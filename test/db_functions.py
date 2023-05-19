import random
import string
import hashlib
from main import users_collection, stocks_collection, labs_collection, substance_types_collection


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
               "role": role,
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

    new_substance={"substance_name":substance_name,
               "producer_name":producer_name,
                "unique_substance_code":generate_unique_code(),
                "total_quantity": 0,
                "inferior_limit": inferior_limit,
                "laboratory_code" : lab_code
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


# FUNCTII VALIDARE--------------------

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

print (validate_login_password("a", "ana"))
