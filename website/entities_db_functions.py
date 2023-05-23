from website.db_connection import users_collection, stocks_collection, labs_collection, substance_types_collection

from website.db_functions import generate_unique_code



def find_labcode(username):
    result=users_collection.find_one({"username": username}, {"_id": 0, "laboratory_code": 1})
    return result['laboratory_code']


# ADD ENTITY

def add_one_substance(substance_name, producer_name, inferior_limit, lab_code):
    
    new_substance={"substance_name":substance_name,
               "producer_name":producer_name,
                "unique_substance_code":generate_unique_code(),
                "total_quantity": 0,
                "inferior_limit": inferior_limit,
                "lab_code" : lab_code,
                "score":[0, 0] #score[0]->nr of votes; #score[1]-> sum of points
                }
    return substance_types_collection.insert_one(new_substance)


def add_one_stock(unique_substance_code, unique_bottle_code, quantity, expiration_date, lab_code):

    new_stock={"unique_substance_code":unique_substance_code,
               "unique_bottle_code":unique_bottle_code,
               "original_quantity":quantity,
               "current_quantity": quantity,
                "expiration_date":expiration_date,
               "laboratory_code": lab_code

               }
    return stocks_collection.insert_one(new_stock)



# FIND ENTITIES

def get_lab_substances(lab_code):
    substances=substance_types_collection.find({'lab_code': lab_code})
    data = []
    for substance in substances:
        if substance['score'][0]==0:
            score=0
        else:
            score=substance['score'][1]/substance['score'][0]
        data.append({
            'substance_name': substance['substance_name'],
            'producer_name': substance['producer_name'],
            'score':score, 
            'unique_substance_code': substance['unique_substance_code']
        })
    return data


# EDIT ENTITIES

def edit_one_substance(substance_name, substance_producer, substance_code):
    criteria = {"unique_substance_code": substance_code}

    substance = substance_types_collection.find_one(criteria)
    if substance:
        if substance_name is not '':
            substance['substance_name']=substance_name
        if substance_producer is not '':
            substance['producer_name']=substance_producer
        substance_types_collection.replace_one(criteria, substance)
        return 'Substance updated'
    else:
        return 'Substance not found'
    

def delete_one_substance(substance_code):
    result = substance_types_collection.delete_one({'unique_substance_code': substance_code})
    if result.deleted_count == 1:
        print("AM STERS SUBSTANTA CU CODUL: ", substance_code)

        return 'Entity deleted successfully'
    else:
        print("NU AM STERS SUBSTANTA CU CODUL: ", substance_code)

        return 'Entity not found or unable to delete'
