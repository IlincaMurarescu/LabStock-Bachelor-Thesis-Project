from flask import Flask
import db_functions
app=Flask(__name__)

@app.route('/home')
def home():

    return 'Bine ai venit'

@app.route('/<username>')
def check_user(username):
    result= db_functions.validate_login_username(username)
    return str(result)

if __name__== '__main__':
    app.run()