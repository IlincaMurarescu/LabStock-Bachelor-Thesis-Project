from website.db_connection import users_collection, stocks_collection, labs_collection, substance_types_collection, quality_incidents_collection, consumption_collection

from website.db_functions import generate_unique_code

from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta


def find_labcode(username):
    result=users_collection.find_one({"username": username}, {"_id": 0, "laboratory_code": 1})
    return result['laboratory_code']


# ADD ENTITY

def add_one_substance(substance_name, producer_name, inferior_limit, lab_code):
    
    new_substance={"substance_name":substance_name,
               "producer_name":producer_name,
                "unique_substance_code":generate_unique_code(),
                "total_quantity": 0,
                "inferior_limit": int(inferior_limit),
                "lab_code" : lab_code,
                "score":[0, 0] #score[0]->nr of votes; #score[1]-> sum of points
                }
    return substance_types_collection.insert_one(new_substance)


def add_one_stock(unique_substance_code, unique_bottle_code, quantity, expiration_date, lab_code):
    
    criteria = {"unique_substance_code": unique_substance_code,"unique_bottle_code": unique_bottle_code}

    veil = stocks_collection.find_one(criteria)
    if veil:
        return 'The bottle with the identification code entered already exists for this substance!'

    
    result=update_substance_quantity_added(unique_substance_code, quantity)
    new_stock={"unique_substance_code":unique_substance_code,
               "unique_bottle_code":unique_bottle_code,
               "original_quantity":int(quantity),
               "current_quantity": int(quantity),
                "expiration_date":datetime.strptime(expiration_date,"%d/%m/%Y"),
               "laboratory_code": lab_code
               }
    
    return stocks_collection.insert_one(new_stock)



def add_qi(content, date, substance_code, username, lab_code):

    new_qi={"content":content,
               "date":date,
               "substance_code": substance_code,
               "username_author": username,
                "lab_code":lab_code,

               }
    return quality_incidents_collection.insert_one(new_qi)



def add_consumption(substance_code, bottle_code, quantity):
    
    new_consumption={"substance_code":substance_code,
               "bottle_code":bottle_code,
                "quantity":int(quantity),
                "date": datetime.now()
                }
    return consumption_collection.insert_one(new_consumption)
  

# FIND ENTITIES

def get_username_fullname(username):
    

    result=users_collection.find_one({"username": username}, {"_id": 0, "first_name": 1,"last_name": 1 })
    return result['first_name'], result['last_name']



   

def get_user_data(username):
    user=users_collection.find_one({'username': username})
    data=[]
    lab_name=get_lab_name(user['laboratory_code'])
    data.append({
        'username':username,
            'first_name': user['first_name'],
            'last_name': user['last_name'],
            'email_address': user['email_address'],
            'role':user['lab_role'],
            'lab_name':lab_name,
            'lab_code': user['laboratory_code']
        })

   
    return data

def get_invalidusers(username):

    lab=users_collection.find_one({"username": username, "admin":1}, {"_id": 0, "laboratory_code": 1 })
    if lab is None:
        return 0
    lab=lab['laboratory_code']

    users=users_collection.find({'laboratory_code': lab, "valid_account": 0})
    if users is None:
        return 'There are no accounts left to be validated.'
    data = []
    for user in users:
        data.append({
            'first_name': user['first_name'],
            'last_name': user['last_name'],
            'username':user['username']
        })
    return data



def get_lab_substances(lab_code):
    substances=substance_types_collection.find({'lab_code': lab_code})
    data = []
    for substance in substances:
        if substance['score'][0]==0:
            score=0
        else:
            score=substance['score'][1]/substance['score'][0]
            if score.is_integer():
                score=int(score)
            else:
                score=round(score, 2)

        average_consumption=get_substance_week_average(substance['unique_substance_code'])


        data.append({
            'substance_name': substance['substance_name'],
            'producer_name': substance['producer_name'],
            'total_quantity':substance['total_quantity'],
            'average':average_consumption,
            'score':score, 
            'unique_substance_code': substance['unique_substance_code']
            })
    return data

    
def get_lab_name(lab_code):
    result=labs_collection.find_one({"identif_code": lab_code}, {"_id": 0, "name": 1})
    return result['name']

def get_substance_info(substance_code):
    substances=substance_types_collection.find({'unique_substance_code': substance_code})
    data = []
    for substance in substances:
        if substance['score'][0]==0:
            score=0
        else:
            score=substance['score'][1]/substance['score'][0]
            if score.is_integer():
                score=int(score)
            else:
                score=round(score, 2)

        average_consumption=get_substance_week_average(substance['unique_substance_code'])


        data.append({
            'substance_name': substance['substance_name'],
            'producer_name': substance['producer_name'],
            'total_quantity':substance['total_quantity'],
            'average':average_consumption,
            'score':score, 
            'unique_substance_code': substance['unique_substance_code']
            })
    return data


def get_substance_nameprod(substance_code):
    substances=substance_types_collection.find({'unique_substance_code': substance_code})
    data = []
    for substance in substances:
        data.append({
            'substance_name': substance['substance_name'],
            'producer_name': substance['producer_name']
        })
    return data

def get_substance_name(substance_code):
    result=substance_types_collection.find_one({"unique_substance_code": substance_code}, {"_id": 0, "substance_name": 1})
    return result['substance_name']


def get_substance_qi(substance_code):
    substancename=get_substance_name(substance_code)
    qis=quality_incidents_collection.find({'substance_code': substance_code})
    data = []
    for qi in qis:
        first_name, last_name=get_username_fullname(qi['username_author'])

        data.append({
            'substancename':substancename,
            'content': qi['content'],
            'date': qi['date'],
            'first_name': first_name,
            'last_name': last_name
        })
    return data




# for statistics


def get_substance_week_average(substance_code):
    today = datetime.now()
    one_week_ago = today - timedelta(days=7)

    condition = {
        'substance_code': substance_code,
        'date': {'$gte': one_week_ago.strftime('%d/%m/%Y'), '$lte': today.strftime('%d/%m/%Y')}
    }

    result = consumption_collection.find(condition)  # înlocuiește 'nume_colectie' cu numele colecției reale
    if result is None:
        return 0
    total_quantity = 0
    
    for doc in result:
        total_quantity += doc['quantity']
    
    average_consumption=total_quantity/7
    if average_consumption.is_integer():
        average_consumption=int(average_consumption)
    else:
        average_consumption = round(average_consumption, 2)
    return average_consumption
   

   
# def get_chart_consumption(substance_code, months):



def calculate_consumption(substance_code, num_months):
    consumption_sum = []
    periods = []
    total_sum_quantity=0
    if num_months==3:

        for i in range (12):
            start_date = datetime.now() - timedelta(weeks=i+1)
            end_date = datetime.now() - timedelta(weeks=i)


            criteria = {
                'substance_code':substance_code,
                'date': {'$gte': start_date, '$lte': end_date}
            }
            
            result = consumption_collection.find(criteria)

            # Calculează suma cantității pentru săptămâna curentă
            quantity_sum = sum([doc['quantity'] for doc in result])

            # Adaugă suma cantității și perioada în listele corespunzătoare
            total_sum_quantity+=quantity_sum
            consumption_sum.append(quantity_sum)
            string_start=start_date.strftime('%d/%m/%Y')
            end_string=end_date.strftime('%d/%m/%Y')
            periods.append(f'{string_start}-{end_string}')
        weekly_average=total_sum_quantity/12
        return periods, consumption_sum, total_sum_quantity, weekly_average
    
    if num_months==6:

       
        current_date = datetime.now()

        for i in range(6):
            
            i=6-1-i
            start_date = current_date - relativedelta(months=i + 1)
            end_date = current_date - relativedelta(months=i)


            # Calculate the month name
            month_name = start_date.strftime("%B")

            criteria = {
                'substance_code': substance_code,
                'date': {'$gte': start_date, '$lt': end_date}
            }

            result = consumption_collection.find(criteria)

            # Calculate the sum of quantity for the current month
            quantity_sum = sum(doc['quantity'] for doc in result)

            # Append the sum of quantity and month name to the corresponding lists
            total_sum_quantity+=quantity_sum
            consumption_sum.append(quantity_sum)
            periods.append(month_name)

        weekly_average=total_sum_quantity/(4*6)
   
        return periods, consumption_sum, total_sum_quantity, weekly_average


    if num_months==12:

       
        current_date = datetime.now()

        for i in range(12):
            
            i=12-1-i
            start_date = current_date - relativedelta(months=i + 1)
            end_date = current_date - relativedelta(months=i)


            # Calculate the month name
            month_name = start_date.strftime("%B")

            criteria = {
                'substance_code': substance_code,
                'date': {'$gte': start_date, '$lt': end_date}
            }

            result = consumption_collection.find(criteria)

            # Calculate the sum of quantity for the current month
            quantity_sum = sum(doc['quantity'] for doc in result)

            # Append the sum of quantity and month name to the corresponding lists
            total_sum_quantity+=quantity_sum
            consumption_sum.append(quantity_sum)
            periods.append(month_name)

        weekly_average=total_sum_quantity/(4*12)
    
        return periods, consumption_sum, total_sum_quantity, weekly_average

    return 0,1


def get_stocks_situation(substance_code):
    sig_exp=[0, 0]
    sig_nexp=[0,0]
    nesig_exp=[0, 0]
    nesig_nexp=[0,0]
    
    today = datetime.now()
    next_month = today + timedelta(weeks=4)

    condition = {
        'unique_substance_code': substance_code,
    }

    result = stocks_collection.find(condition)
    if result is None:
        return [sig_exp, sig_nexp, nesig_exp, nesig_nexp]
    else:
        for doc in result:
            if doc['original_quantity']==doc['current_quantity'] and doc['expiration_date']<next_month:
                sig_exp[0]+=doc['current_quantity'] #cantitate produs
                sig_exp[1]+=1 #nr flacoane
            elif doc['original_quantity']==doc['current_quantity'] and doc['expiration_date']>next_month:
                            sig_nexp[0]+=doc['current_quantity'] #cantitate produs
                            sig_nexp[1]+=1 #nr flacoane
            elif doc['original_quantity']!=doc['current_quantity'] and doc['expiration_date']<next_month:
                                        nesig_exp[0]+=doc['current_quantity'] #cantitate produs
                                        nesig_exp[1]+=1 #nr flacoane
            elif doc['original_quantity']!=doc['current_quantity'] and doc['expiration_date']>next_month:
                                                    nesig_nexp[0]+=doc['current_quantity'] #cantitate produs
                                                    nesig_nexp[1]+=1 #nr flacoane

        data={'labels': ['sig_exp', 'sig_nexp', 'nesig_exp', 'nesig_nexp'],
              'values': [sig_exp[0], sig_nexp[0], nesig_exp[0], nesig_nexp[0]]}
        mysum=sig_exp[0]+ sig_nexp[0]+ nesig_exp[0]+ nesig_nexp[0]
        return data, mysum



# EDIT ENTITIES

def edit_one_substance(substance_name, substance_producer, substance_code):
    criteria = {"unique_substance_code": substance_code}

    substance = substance_types_collection.find_one(criteria)
    if substance:
        if substance_name!='':
            substance['substance_name']=substance_name
        if substance_producer!='':
            substance['producer_name']=substance_producer
        substance_types_collection.replace_one(criteria, substance)
        return 'Substance updated'
    else:
        return 'Substance not found'
    

def update_score(score_value, substance_code):
    criteria = {"unique_substance_code": substance_code}
    substance = substance_types_collection.find_one(criteria)
    if substance:
        substance['score'][1]=substance['score'][1]+int(score_value)
        substance['score'][0]=substance['score'][0]+1
        substance_types_collection.replace_one(criteria, substance)
        return 'Substance updated'
    else:
        return 'Substance not found'


def update_substance_quantity_added(substance_code, quantity):
    criteria = {"unique_substance_code": substance_code}

    substance = substance_types_collection.find_one(criteria)
    if substance:
        substance['total_quantity']+=int(quantity)
        substance_types_collection.replace_one(criteria, substance)
        return 'Substance updated'
    else:
        return 'Substance not found'
    



    

def update_bottle_usage(substance_code,bottle_code, quantity):
    criteria = {"unique_bottle_code": bottle_code, "unique_substance_code": substance_code}

    bottle = stocks_collection.find_one(criteria)
    if bottle:
        if bottle['current_quantity']<int(quantity):
            return 'The existing quantity inside the veil selected is smaller than the consumed quantity enetered.'
        bottle['current_quantity']-=int(quantity)
        stocks_collection.replace_one(criteria, bottle)
        added_consumption_status=add_consumption(substance_code, bottle_code, quantity)
        return 'Bottle updated'
    else:
        return 'Veil not found for the substance selected. Check the identification code again, or the substance selected.'
    

def update_substace_usage(substance_code, quantity):
    criteria = {"unique_substance_code": substance_code}

    substance = substance_types_collection.find_one(criteria)
    if substance:
        substance['total_quantity']-=int(quantity)
        substance_types_collection.replace_one(criteria, substance)
        return 'Substance updated'
    else:
        return 'Substance not found'



    
def update_after_usage(substance_code, bottle_code, quantity):
    bottle_result=update_bottle_usage(substance_code, bottle_code, quantity)
    if bottle_result!='Bottle updated':
            return bottle_result
    
    susbtance_result=update_substace_usage(substance_code, quantity)
    if susbtance_result!='Substance updated':
            return susbtance_result
    return 'Quantities updated'






# DELETE ENTITY
def delete_one_substance(substance_code):
    result = substance_types_collection.delete_one({'unique_substance_code': substance_code})
    if result.deleted_count == 1:
        print("AM STERS SUBSTANTA CU CODUL: ", substance_code)

        return 'Entity deleted successfully'
    else:
        print("NU AM STERS SUBSTANTA CU CODUL: ", substance_code)

        return 'Entity not found or unable to delete'
    


    #  EXPORT CSV


def export_csv(lab_code):
     # Query the collection to retrieve the data
    data = substance_types_collection.find({ 'lab_code': lab_code })  # Apply your desired filters here

    # Create a CSV file
    csv_data = []
    csv_headers = ['Substance_name', 'Producer', 'Current_quantity']  # Define your CSV headers

    for item in data:
        # Format the data as per your requirements
        csv_row = [item['substance_name'], item['producer_name'], item['total_quantity']]
        csv_data.append(csv_row)

    # Create a response with the CSV file
    response = make_response('')
    response.headers['Content-Disposition'] = 'attachment; filename=data.csv'
    response.headers['Content-Type'] = 'text/csv'

    # Write the data to the CSV file
    with response.stream as csv_file:
        writer = csv.writer(csv_file)
        writer.writerow(csv_headers)
        writer.writerows(csv_data)

    return response