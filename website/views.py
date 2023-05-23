from flask import Blueprint, render_template, request, flash, session, jsonify, make_response
from website import db_functions
import jwt
from datetime import datetime, timedelta
from functools import wraps
from website import entities_db_functions


views = Blueprint('views', __name__)



def token_required(func ):
    @wraps(func)
    def decorated(*args, **kwargs):
        token = request.args.get('token')
        if not token:
            return jsonify({ 'Alert' : 'Token is missing!' })
        try:
          # print("THE TOKEN RECIEVED IS: ", token)
          payload = jwt.decode(token, 'tralala', "HS256")
        except:
            return jsonify({'Alert! ' : 'Invalid token!'})
     #    print('E OK TOKEN-UL: ', payload['user'])

        return  func(payload['user'], *args, **kwargs)
        
    return decorated






@views.route('/aboutus')
def aboutus():
     return render_template('about_us.html')


@views.route('/statistics')
@token_required
def statistics(user):
     text="Hello, "+ user
    #  return jsonify({'message': text}), 200
     return render_template('statistics.html')

@views.route('/substances',methods=['GET', 'POST'])
@token_required
def prod(user):
     lab_code=entities_db_functions.find_labcode(user)

     data=entities_db_functions.get_lab_substances(lab_code)
     return render_template('products.html', data=data)



@views.route('/add_substance',methods=['GET', 'POST'])
@token_required
def addsubstance(user):
     if request.method == 'GET':
          lab_code=entities_db_functions.find_labcode(user)

          data=entities_db_functions.get_lab_substances(lab_code)
          return render_template('add_new_substance.html', data=data)
     if request.method == 'POST':
         substance_name=request.form.get('substance_name')
         substance_producer=request.form.get('substance_producer')
         substance_inferiorlimit=request.form.get('substance_inferiorlimit')
         lab_code=entities_db_functions.find_labcode(user)
         result=entities_db_functions.add_one_substance(substance_name, substance_producer, substance_inferiorlimit, lab_code)
         return jsonify({'message': 'The substance has been added!'}), 200
            

@views.route('/edit_substance',methods=['GET', 'POST'])
@token_required
def editsubstance(user):
     if request.method == 'GET':
          lab_code=entities_db_functions.find_labcode(user)

          data=entities_db_functions.get_lab_substances(lab_code)
          return render_template('edit_substance.html', data=data)
     
     if request.method == 'POST':
         substance_name=request.form.get('substance_name')
         substance_producer=request.form.get('substance_producer')
         unique_substance_code=request.form.get('substanceCode')
         lab_code=entities_db_functions.find_labcode(user)
         result=entities_db_functions.edit_one_substance(substance_name, substance_producer, unique_substance_code)
         return jsonify({'message': 'The substance has been edited!'}), 200




@views.route('/delete_substance',methods=['GET', 'POST'])
@token_required
def deletesubstance(user):

     if request.method == 'POST':
     #     request.
         data=request.json
     #     unique_substance_code=request.form.get('substanceCode')
     #     print("--------------------", request)
     #     print("=======================", unique_substance_code)
         unique_substance_code=data['substanceCode']
         lab_code=entities_db_functions.find_labcode(user)
         result=entities_db_functions.delete_one_substance( unique_substance_code)
         return jsonify({'message': 'The substance has been deleted!'}), 200
