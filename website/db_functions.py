import random
import string
import hashlib
from website.db_connection import users_collection, stocks_collection, labs_collection, substance_types_collection, blacklist_collection


#FUNCTII AJUTATOARE PENTRU ADAUGAT--------------------------------------------------------------------
def generate_unique_code():
    return (''.join(random.choices(string.ascii_uppercase + string.ascii_lowercase + string.digits, k=8)))

def hash_password(pswrd):
    return  hashlib.sha256(pswrd.encode('utf-8')).hexdigest()

# FUNCTII ADAUGARE ELEMENTE----------------------------------------------------------------------------
def add_one_user(username, first_name, last_name, email_address, password, lab_code, role, admin):
    verified_account=-1
    if admin==1:
        verified_account=1
    elif admin==0:
        verified_account=0
    new_user={"username":username,
               "first_name":first_name,
               "last_name":last_name,
                "email_address": email_address,
               "password": hash_password(password),
                "laboratory_code":lab_code,
               "lab_role": role,
                "admin" : admin,
                "valid_account":verified_account
                }
    return users_collection.insert_one(new_user)


#Returnam codul unic al laboratorului pentru ca avem nevoie de el imediat, in crearea contului primului admin
# (e asociat by default la acest laborator + trebuie sa ii fie vizibil codul pt a il transmite colegilor)
def add_one_lab(name):
    unique_lab_code=generate_unique_code()
    new_lab={"name": name,
             "identif_code": unique_lab_code
                }
    return labs_collection.insert_one(new_lab), unique_lab_code

def add_one_substance(substance_name, producer_name, inferior_limit, lab_code):
    unique_substance_code=generate_unique_code()
    new_substance={"substance_name":substance_name,
               "producer_name":producer_name,
                "unique_substance_code":generate_unique_code(),
                "total_quantity": 0,
                "inferior_limit": inferior_limit,
                "substance_code" : unique_substance_code
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


# functii creare cont nou
def add_one_user_admin(username, first_name, last_name, email_address, password, lab_name, role, admin=1):
    verified_account=-1
    if admin==1:
        verified_account=1
    elif admin==0:
        verified_account=0
    inserted_lab, lab_code=add_one_lab(lab_name)
    new_user={"username":username,
               "first_name":first_name,
               "last_name":last_name,
                "email_address": email_address,
               "password": hash_password(password),
                "laboratory_code":lab_code,
                "lab_role": role,
                "admin" : admin,
                "valid_account":verified_account
                }
    return users_collection.insert_one(new_user)


def add_blacklist(token):
    blacklist_collection.insert_one({'token': token})

# FUNCTII VALIDARE--------------------

# validare login
def validate_login_username(username):

    result=users_collection.find_one({"username" : username})
    if result is None:
        return False
    return True

def validate_login_password(username, password):
    result=users_collection.find_one({"username": username, "password": hash_password(password)})
    if result is None:
        return False
    return True

def validate_login_valid(username):
    result = users_collection.find_one({"username": username, "valid_account": 1})
    if result is not None:
        return True
    return False

# functii validare register

def validate_register_username(username):

    result=users_collection.find_one({"username" : username})
    if result is None:
        return True
    return False


def validate_register_email(email):

    result=users_collection.find_one({"email_address" : email})
    if result is None:
        return True
    return False

def validate_register_password(pas1, pas2):
    print("Pass1 is ", pas1, " and pass2 is ", pas2)
    if pas1==pas2:
        return True
    return False


def validate_register_lab(lab_code):
    result=labs_collection.find_one({"identif_code" : lab_code})
    if result is None:
        return True
    return False

def validate_blacklist(token):
    if blacklist_collection.find_one({'token': token}):
        return False
    return True

# FUNCTII UPDATE---------------------------------------------


def validate_account(username):
    criteria = {"username": username}

    user = users_collection.find_one(criteria)
    if user:
        user['valid_account']=1
        users_collection.replace_one(criteria, user)
        return 'User updated'
    else:
        return 'Something went wrong! Please try again.'
    
def update_password(username, password):
    criteria = {"username": username}
    print(f"-----\n----- aici in update_password: {username}")
    user = users_collection.find_one(criteria)
    if user:
        user['password']= str(hash_password(password))
        print(f"-----\n----- aici in update_password parola criptata arata asa: {hash_password(password)}")

        status=users_collection.replace_one(criteria, user)
        return 'User updated'
    else:
        return 'Something went wrong! Please try again.'


# FUNCTII GET----------------

def get_username(email):
    criteria = {"email_address": email}

    user = users_collection.find_one(criteria)
    if user:
        return user['username']
    else:
        return 0


