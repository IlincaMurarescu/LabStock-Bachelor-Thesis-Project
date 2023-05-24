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

@views.route('/get_qualityi',methods=['GET', 'POST'])
@token_required
def get_qualityi(user):
      if request.method == 'POST':
         data=request.json
         print("------macar suntem aici! avem si data: ", data)
         unique_substance_code=data['substanceCode']
         data=entities_db_functions.get_substance_qi(unique_substance_code)
         return jsonify(data), 200




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
         data=request.json

         unique_substance_code=data['substanceCode']
         lab_code=entities_db_functions.find_labcode(user)
         result=entities_db_functions.delete_one_substance( unique_substance_code)
         return jsonify({'message': 'The substance has been deleted!'}), 200



@views.route('/scoresubmit',methods=['GET', 'POST'])
@token_required
def scoresubmit(user):
     if request.method == 'POST':
         substance_score=request.form.get('score')
         substance_code=request.form.get('substanceCode')
         result=entities_db_functions.update_score(substance_score, substance_code)
         return jsonify({'message': 'The substance has been edited!'}), 200



@views.route('/add_qi',methods=['GET', 'POST'])
@token_required
def addqi(user):
     if request.method == 'GET':
          substancecode=request.args.get('substancecode')
          data=entities_db_functions.get_substance_nameprod(substancecode)
          print('--------- data is ', data)
          return render_template('add_incident.html', data=data)
     if request.method == 'POST':
         content=request.form.get('content')
         substance_code=request.form.get('substanceCodeQi')
         username=user
         local = datetime.now()
         date= local.strftime("%m/%d/%Y")                      
         lab_code=entities_db_functions.find_labcode(user)
         result=entities_db_functions.add_qi(content, date, substance_code, user, lab_code)
         return jsonify({'message': 'The qi has been added!'}), 200

