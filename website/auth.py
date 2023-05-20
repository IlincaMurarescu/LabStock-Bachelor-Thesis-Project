from flask import Blueprint, render_template, request, flash, session, jsonify, make_response
from website import db_functions
import jwt
from datetime import datetime, timedelta
from functools import wraps

auth = Blueprint('auth', __name__)


def token_required(func ):
    @wraps(func)
    def decorated(*args, **kwargs):
        token = request.args.get('token')
        if not token:
            return jsonify({ 'Alert' : 'Token is missing!' })
        try:
            payload = jwt.decode(token, 'tralala')
        except:
            return jsonify({'Alert! ' : 'Invalid token!'})
    return decorated




@auth.route('/signin',methods=['GET', 'POST'])
def home():
    if request.method == 'POST':
            username=request.form.get('username')
            password=request.form.get('password')
            # username='a'
            # password='b'
        
            if db_functions.validate_login_username(username)==False:
                return jsonify({'message': 'Username does not exist.'}), 401
            
            elif db_functions.validate_login_password(username, password)==False:
                return jsonify({'message': 'Wrong password.'}), 401

            elif db_functions.validate_login_valid(username)==False:
                return jsonify({'message': 'Your account has not been validated yet by the laboratory admin.'}), 401
            else:
                session['logged_in']=True
                token=jwt.encode({
                    'user': username,
                    'expiration': str(datetime.utcnow()+timedelta(seconds=120))
                }, 'tralala')
                return jsonify({'token': token})
                        # jwt.decode(jwt=token, )
            
    return render_template('login_test.html')





# ------------OLD LOGIN, WITHOUT TOKEN STUFF------------------
# @auth.route('/signin', methods=['GET', 'POST'])
# def login():
#     # result = db_functions.validate_login_username(username)
#     # return str(result)
#     # pass

#     if request.method == 'POST':
#         username=request.form.get('username')
#         password=request.form.get('password')

#         print(username, password)
    
#         if db_functions.validate_login_username(username)==False:
#             flash("Username does not exist.", category='error')
#         elif db_functions.validate_login_password(username, password)==False:
#             flash("Wrong password.", category='error')
#         elif db_functions.validate_login_valid(username)==False:
#             flash("Your account has not been validated yet by the laboratory admin.", category='error')
#         else:
#             flash("Succes", category='succes')
#             return render_template('nav_bar1.html')

#     return render_template('login_test.html')


@auth.route('/new_lab_registrationtest', methods=['GET','POST'])
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

    
        if db_functions.validate_register_username(username)==False:
            return jsonify({'message': 'This username already exists!'}), 401

        elif db_functions.validate_register_email(email)==False:
            return jsonify({'message': 'This email is already used!'}), 401

        elif db_functions.validate_register_password(password, password_repeat)==False:
            return jsonify({'message': 'The passwords do not correspond!'}), 401

        else:
            result=db_functions.add_one_user_admin(username, first_name, last_name, email, password, lab_name, lab_role)
            return jsonify({'message': 'Your admin account has been created. Please go to the sign in page!'}), 200


    return render_template('new_lab_register.html')


# -------------FARA JSON RETURN
# @auth.route('/new_lab_registration', methods=['GET','POST'])
# def register_lab():
    

#     if request.method == 'POST':
#         username=request.form.get('username')
#         password=request.form.get('password')
#         password_repeat=request.form.get('repeat_password')
#         email=request.form.get('email')
#         first_name=request.form.get('first_name')
#         last_name=request.form.get('last_name')
#         lab_role=request.form.get('lab_role')
#         lab_name=request.form.get('lab_name')

#         print(username, first_name, last_name, password, password_repeat, email, lab_role, lab_name)
    
#         if db_functions.validate_register_username(username)==False:
#             flash("This username already exists!", category='error')
#         elif db_functions.validate_register_email(email)==False:
#             flash("This email is already used!", category='error')
#         elif db_functions.validate_register_password(password, password_repeat)==False:
#             flash("The passwords do not correspond!", category='error')
#         else:
#             flash("Succes", category='succes')
#             result=db_functions.add_one_user_admin(username, first_name, last_name, email, password, lab_name, lab_role)
#             print("A MERS!!! ", result)
#             return render_template('nav_bar1.html')

#     return render_template('new_lab_register.html')



@auth.route('/signuptest', methods=['GET','POST'])
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
    
        if db_functions.validate_register_username(username)==False:
            return jsonify({'message': 'This username already exists!'}), 401

        elif db_functions.validate_register_email(email)==False:
            return jsonify({'message': 'This email is already used!'}), 401

        elif db_functions.validate_register_password(password, password_repeat)==False:
            return jsonify({'message': 'The passwords do not correspond!'}), 401
        elif db_functions.validate_register_lab(lab_code)==False:
            return jsonify({'message': 'The laboratory code does not exist!'}), 401
        else:
            result=db_functions.add_one_user(username, first_name, last_name, email, password, lab_code, lab_role, 0)
            return jsonify({'message': 'Your account has been created. Wait for an laboratory admin to validate your info before accessing your account!'}), 200
            

    return render_template('new_user_register.html')





# ----------FARA JSON RETURN
# @auth.route('/signup', methods=['GET','POST'])
# def register_user():
    

#     if request.method == 'POST':
#         username=request.form.get('username')
#         password=request.form.get('password')
#         password_repeat=request.form.get('repeat_password')
#         email=request.form.get('email')
#         first_name=request.form.get('first_name')
#         last_name=request.form.get('last_name')
#         lab_role=request.form.get('lab_role')
#         lab_code=request.form.get('lab_code')

#         print(username, first_name, last_name, password, password_repeat, email, lab_role, lab_code)
    
#         if db_functions.validate_register_username(username)==False:
#             flash("This username already exists!", category='error')
#         elif db_functions.validate_register_email(email)==False:
#             flash("This email is already used!", category='error')
#         elif db_functions.validate_register_password(password, password_repeat)==False:
#             flash("The passwords do not correspond!", category='error')
#         elif db_functions.validate_register_lab(lab_code)==False:
#             flash("The laboratory code does not exist!", category='error')
#         else:
#             flash("Your account has been created. Wait for an laboratory admin to validate your info before accessing your account!", category='succes')
#             result=db_functions.add_one_user(username, first_name, last_name, email, password, lab_code, lab_role, 0)
#             print("A MERS!!! ", result)
#             return render_template('login_test.html')

#     return render_template('new_user_register.html')