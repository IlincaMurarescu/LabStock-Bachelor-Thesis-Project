from flask import Blueprint, render_template, request, flash, session, jsonify, make_response
from website import model_auth
import jwt
from datetime import datetime, timedelta
from functools import wraps
from website import model_entities
from website.aux_functions import is_valid_date, is_number
from credentials import secret_key

views = Blueprint('views', __name__)



def token_required(func ):
    @wraps(func)
    def decorated(*args, **kwargs):
        token = request.args.get('token')
        if model_auth.validate_blacklist(token) is True:
            return jsonify({'Alert! ' : f'Invalid token! The token {token} has been already used.'})
        if not token:
            return jsonify({ 'Alert' : 'Token is missing!' })
        try:
       
          payload = jwt.decode(token, secret_key, "HS256")

        except:
            return jsonify({'Alert! ' : 'Invalid token!'})
    

        return  func(payload['user'], *args, **kwargs)
        
    return decorated






@views.route('/aboutus')
def aboutus():
     return render_template('about_us.html')


@views.route('/statistics')
@token_required
def statistics(user):
     lab_code=model_entities.find_labcode(user)
     data=model_entities.get_lab_substances(lab_code)
     issues_q, issues_e=model_entities.get_issues(user)
     if len(issues_q)!=0:
         quantity_alert=f"The substance {issues_q[0]} produced by {issues_q[1]} is close to the inferior limit set."
     else:
         quantity_alert=""
     if len(issues_e)!=0:
         expiration_alert=f"The veil with the code \" {issues_e[0]} \" [{issues_e[1]}] will expire soon."
     else:
         expiration_alert=""
     return render_template('statistics.html', data=data, issues=[quantity_alert, expiration_alert])

@views.route('/substances',methods=['GET', 'POST'])
@token_required
def prod(user):
     lab_code=model_entities.find_labcode(user)

     data=model_entities.get_lab_substances(lab_code)
     return render_template('products.html', data=data)

@views.route('/get_qualityi',methods=[ 'POST'])
@token_required
def get_qualityi(user):
      if request.method == 'POST':
         data=request.json
         unique_substance_code=data['substanceCode']
         data=model_entities.get_substance_qi(unique_substance_code)

         return jsonify(data), 200




@views.route('/add_substance',methods=['GET', 'POST'])
@token_required
def addsubstance(user):
     if request.method == 'GET':
          lab_code=model_entities.find_labcode(user)

          data=model_entities.get_lab_substances(lab_code)
          return render_template('add_new_substance.html', data=data)
     if request.method == 'POST':
         substance_name=request.form.get('substance_name')
         substance_producer=request.form.get('substance_producer')
         substance_inferiorlimit=request.form.get('substance_inferiorlimit')
         lab_code=model_entities.find_labcode(user)
         result=model_entities.add_one_substance(substance_name, substance_producer, substance_inferiorlimit, lab_code)
         return jsonify({'message': 'The substance has been added!'}), 200
            

@views.route('/edit_substance',methods=['GET', 'POST'])
@token_required
def editsubstance(user):
     if request.method == 'GET':
          lab_code=model_entities.find_labcode(user)

          data=model_entities.get_lab_substances(lab_code)
          return render_template('edit_substance.html', data=data)
     
     if request.method == 'POST':
         substance_name=request.form.get('substance_name')
         substance_producer=request.form.get('substance_producer')
         unique_substance_code=request.form.get('substanceCode')
         lab_code=model_entities.find_labcode(user)
         result=model_entities.edit_one_substance(substance_name, substance_producer, unique_substance_code)
         return jsonify({'message': 'The substance has been edited!'}), 200




@views.route('/delete_substance',methods=['GET', 'POST'])
@token_required
def deletesubstance(user):

     if request.method == 'POST':
         data=request.json

         unique_substance_code=data['substanceCode']
         lab_code=model_entities.find_labcode(user)
         result=model_entities.delete_one_substance( unique_substance_code)
         return jsonify({'message': 'The substance has been deleted!'}), 200



@views.route('/scoresubmit',methods=['GET', 'POST'])
@token_required
def scoresubmit(user):
     if request.method == 'POST':
         substance_score=request.form.get('score')
         substance_code=request.form.get('substanceCode')
         result=model_entities.update_score(substance_score, substance_code)
         return jsonify({'message': 'The substance has been edited!'}), 200



@views.route('/add_qi',methods=['GET', 'POST'])
@token_required
def addqi(user):
     if request.method == 'GET':
          substancecode=request.args.get('substancecode')
          data=model_entities.get_substance_nameprod(substancecode)
          return render_template('add_incident.html', data=data)
     if request.method == 'POST':
         content=request.form.get('content')
         substance_code=request.form.get('substanceCodeQi')
         username=user
         local = datetime.now()
         date= local.strftime("%d/%m/%Y")                      
         lab_code=model_entities.find_labcode(user)
         result=model_entities.add_qi(content, date, substance_code, user, lab_code)
         return jsonify({'message': 'The qi has been added!'}), 200



@views.route('/new_stock',methods=['GET', 'POST'])
@token_required
def addstock(user):
     if request.method == 'GET':

          lab_code=model_entities.find_labcode(user)
          data=model_entities.get_lab_substances(lab_code)

          return render_template('add_stock.html', data=data)

     if request.method == 'POST':
         substancecode=request.form.get('substancecode')
         bottlecode=request.form.get('vial_code')
         quantity=request.form.get('stock_quantity')
         expiration_date=request.form.get('expiration_date')

         if is_number(quantity) is False:
             return jsonify({'message': 'Please enter a number for the quantity.'}), 400
         if is_valid_date(expiration_date) is -1:
             return jsonify({'message': 'Please respect the expiration date format in the example.'}), 400
         elif is_valid_date(expiration_date) is 0:
             return jsonify({'message': 'The product is already expired!'}), 400


         
     
         lab_code=model_entities.find_labcode(user)
         result=model_entities.add_one_stock(substancecode, bottlecode, quantity, expiration_date, lab_code)
         if isinstance(result, str):
              return jsonify({'message': result}), 400



         return jsonify({'message': 'The qi has been added!'}), 200



@views.route('/track_usage',methods=['GET', 'POST'])
@token_required
def trackusage(user):
     if request.method == 'GET':

          lab_code=model_entities.find_labcode(user)
          data=model_entities.get_lab_substances(lab_code)

          return render_template('track_usage.html', data=data)

     if request.method == 'POST':
         substancecode=request.form.get('substancecode')
         bottlecode=request.form.get('vial_code')
         quantity=request.form.get('consume_quantity')

         if is_number(quantity) is False:
             return jsonify({'message': 'Please enter a number for the quantity.'}), 400
        
         result=model_entities.update_after_usage(substancecode, bottlecode, quantity)
         if result!='Quantities updated':
             return jsonify({'message': result}), 400

         return jsonify({'message': 'The qi has been added!'}), 200


@views.route('/settings', methods=['GET', 'POST'])
@token_required
def settings(user):
     if request.method == 'GET':

          data=model_entities.get_user_data(user)
          data2=model_entities.get_invalidusers(user)
          if data2==0:
              return render_template('settings.html', data=data, admin=0)
          return render_template('settings.html', data=data, data2=data2, admin=1)

     if request.method == 'POST':
         data=request.json
         username=data['username']
         result=model_entities.validate_user(username)

         if result!='User updated':
             return jsonify({'message': result}), 400

         return jsonify({'message': 'The user has been validated!'}), 200



@views.route('/statistics_details', methods=['GET', 'POST'])
@token_required
def statistics_details(user):
    if request.method=='GET':
        substance_code=request.args.get('substanceCode')
        substance=model_entities.get_substance_info(substance_code)
        
        return render_template('statistics_details.html', substance=substance)

    if request.method=='POST':
        data=request.json
        substance_code=data['substanceCode']
        chart_type=data['chartType']
        if chart_type==1:
            time_period=data['timePeriod']
            periods, quantities, charttexttotal, charttextaverage, estimate_date=model_entities.calculate_consumption(substance_code, time_period)
            if charttextaverage.is_integer():
                charttextaverage=int(charttextaverage)
            else:
                charttextaverage=round(charttextaverage, 2)
            data={ 'labels': periods, 
                'values': quantities}
            return jsonify({"data": data, "chartSummary": [charttexttotal, charttextaverage, estimate_date]}), 200      
        elif chart_type==2:
            data, mysum=model_entities.get_stocks_situation(substance_code)
            return jsonify({"data": data, "chartSummary": mysum}), 200
        else:
            time_period=data['timePeriod']
            months, quantity_left, monthly_average=model_entities.get_prediction(substance_code, time_period)
            data={ 'labels': months, 
                'values': quantity_left}
            return jsonify({"data": data, "chartSummary": monthly_average}), 200

import csv
import io
from flask import Flask, make_response
from pymongo import MongoClient



@views.route('/download', methods=['GET'])
@token_required
def stocks_csv(user):
   
    documents = model_entities.get_csv_info_stocks(user)
    output = io.StringIO()

    writer = csv.writer(output)

  
    writer.writerow(["Substance name", "Veil code", "Initial quantity", "Current quantity", "Expiration date"])  

   
    for document in documents:
        writer.writerow([document["substance_name"], document['unique_bottle_code'],document['original_quantity'],document["current_quantity"], document['expiration_date']])  
    
    output.seek(0)

    response = make_response(output.getvalue())
    response.headers['Content-Disposition'] = 'attachment; filename=Stocks.csv'
    response.headers['Content-type'] = 'text/csv'

    return response


@views.route('/download2', methods=['GET'])
@token_required
def substances_csv(user):
   
    documents = model_entities.get_csv_info_substances(user)
    output = io.StringIO()

    writer = csv.writer(output)

  
    writer.writerow(["Substance name", "Producer", "Current quantity"])  

   
    for document in documents:
        writer.writerow([document["substance_name"], document['producer_name'],document['total_quantity']]) 

    output.seek(0)

    response = make_response(output.getvalue())
    response.headers['Content-Disposition'] = 'attachment; filename=Substances.csv'
    response.headers['Content-type'] = 'text/csv'
   

    return response