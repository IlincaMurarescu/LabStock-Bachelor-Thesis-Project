from flask import Blueprint, render_template, request, flash, session, jsonify, make_response
from website import model_auth
import jwt
from datetime import datetime, timedelta
from functools import wraps
import sendgrid
from sendgrid.helpers.mail import Mail
import os
from urllib.parse import quote
from credentials import sendgrid_key, secret_key


auth = Blueprint('auth', __name__)





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


def token_required_logout(func ):
    @wraps(func)
    def decorated(*args, **kwargs):
        token = request.args.get('token')
        if not token:
            return jsonify({ 'Alert' : 'Token is missing!' })
        try:
          print("THE TOKEN RECIEVED IS: ", token)
          payload = jwt.decode(token, secret_key, "HS256")
        except:
            return jsonify({'Alert! ' : 'Invalid token!'})
        model_auth.add_blacklist(token=token)
        return  func(payload['user'], *args, **kwargs)
        
    return decorated


@auth.route('/signin',methods=['GET', 'POST'])
def home():
    if request.method == 'POST':
            username=request.form.get('username')
            password=request.form.get('password')
           
        
            if model_auth.validate_login_username(username)==False:
                return jsonify({'message': 'Username does not exist.'}), 401
            
            elif model_auth.validate_login_password(username, password)==False:
                return jsonify({'message': 'Wrong password.'}), 401

            elif model_auth.validate_login_valid(username)==False:
                return jsonify({'message': 'Your account has not been validated yet by the laboratory admin.'}), 401
            else:
                session['logged_in']=True
                token=jwt.encode({
                    'user': username,
                    'expiration': str(datetime.utcnow()+timedelta(hours=6))
                }, secret_key, "HS256")
                return jsonify({'token': token})
                
    return render_template('login_test.html')





@auth.route('/new_lab_registration', methods=['GET','POST'])
def register_labtest():
    

    if request.method == 'POST':
        username=request.form.get('username')
        password=request.form.get('password')
        password_repeat=request.form.get('repeat_password')
        email=request.form.get('email')
        first_name=request.form.get('first_name')
        last_name=request.form.get('last_name')
        lab_role=request.form.get('lab_role')
        lab_name=request.form.get('lab_name')

    
        if model_auth.validate_register_username(username)==False:
            return jsonify({'message': 'This username already exists!'}), 401

        elif model_auth.validate_register_email(email)==False:
            return jsonify({'message': 'This email is already used!'}), 401

        elif model_auth.validate_register_password(password, password_repeat)==False:
            return jsonify({'message': 'The passwords do not correspond!'}), 401

        else:
            result=model_auth.add_one_user_admin(username, first_name, last_name, email, password, lab_name, lab_role)
            return jsonify({'message': 'Your admin account has been created. Please go to the sign in page!'}), 200


    return render_template('new_lab_register.html')





@auth.route('/signup', methods=['GET','POST'])
def register_user():
    

    if request.method == 'POST':
        username=request.form.get('username')
        password=request.form.get('password')
        password_repeat=request.form.get('repeat_password')
        email=request.form.get('email')
        first_name=request.form.get('first_name')
        last_name=request.form.get('last_name')
        lab_role=request.form.get('lab_role')
        lab_code=request.form.get('lab_code')

        print(username, first_name, last_name, password, password_repeat, email, lab_role, lab_code)
    
        if model_auth.validate_register_username(username)==False:
            return jsonify({'message': 'This username already exists!'}), 401

        elif model_auth.validate_register_email(email)==False:
            return jsonify({'message': 'This email is already used!'}), 401

        elif model_auth.validate_register_password(password, password_repeat)==False:
            return jsonify({'message': 'The passwords do not correspond!'}), 401
        elif model_auth.validate_register_lab(lab_code)==True:
            return jsonify({'message': 'The laboratory code does not exist!'}), 401
        else:
            result=model_auth.add_one_user(username, first_name, last_name, email, password, lab_code, lab_role, 0)
            return jsonify({'message': 'Your account has been created. Wait for an laboratory admin to validate your info before accessing your account!'}), 200
            

    return render_template('new_user_register.html')


@auth.route('/logout', methods=['GET'])
@token_required_logout
def logout(user):
    
    session['logged_in']=False
    return jsonify({'message': 'Logout done'}), 200








@auth.route('/validate_user',methods=[ 'POST'])
@token_required
def validate_user(user):

     if request.method == 'POST':
         data=request.json
         username=data['username']
         result=model_auth.validate_account(user)
         if result!='User updated':
              return jsonify({'message': result}), 400

         return jsonify({'message': 'The substance has been deleted!'}), 200


@auth.route('/send_email', methods=['GET', 'POST'])
def email():

    if request.method=='GET':
        return render_template('forgot_password.html')
    
    if request.method=='POST':
        email=request.form.get('email')
        if model_auth.validate_register_email(email)==False:
            username=model_auth.get_username(email)
            token=jwt.encode({
                    'user': username,
                    'expiration': str(datetime.utcnow()+timedelta(hours=8))
                }, secret_key, "HS256")
            token = quote(token)

            message = Mail(
                from_email='labstock23@gmail.com',
                to_emails='i.murarescuu@gmail.com',
                subject='Reset password',
             html_content=f'You have requested to reset you password for your LabStock account.  Access <a href="http://127.0.0.1:5000/reset_password?token={token}">this link</a> to enter your new password. \n The link will expire in 8 hours!'

            )

            try:

                sg = sendgrid.SendGridAPIClient(api_key=sendgrid_key)
                response = sg.send(message)

                return jsonify({'message': 'Check your email inbox.'}), 200

            except Exception as e:
                return jsonify({'message': 'Failed to send email.'}), 500
            
            
        else:
            return jsonify({'message': 'The email address doesn\'t correspond to an active account.'}), 401
            

       
    

@auth.route('/reset_password', methods=['GET', 'POST'])
@token_required
def reset_password(user):

    if request.method=='GET':
        return render_template('reset_password.html')
    
    if request.method=='POST':
        
        password=request.form.get('password')
        password_repeat=request.form.get('repeat_password')

        if model_auth.validate_register_password(password, password_repeat)==False:
            return jsonify({'message': 'The passwords do not correspond!'}), 401
        else:
            update_status=model_auth.update_password(user, password)
            
            if update_status=='User updated':
                return jsonify({'message': 'The password was updated!'}), 200
            else:
                return jsonify({'message': update_status}), 401

