import pymongo
from pymongo import MongoClient
import hashlib
import random
import string

cluster="mongodb+srv://ilincamurarescu:9bRJNugJyzA9Sswl@app.epksz7t.mongodb.net/?retryWrites=true&w=majority"
client=MongoClient(cluster)

# print(client.list_database_names())

db=client.MedNote_Entities
# print(db.list_collection_names())

user1 = {"username":"DoinaM", "first_name":"Doina", "last_name":"Murarescu",
         "email_address": "dmurarescu@gmail.com", "password": "ilinca10",
         "laboratory_code":"9bRJNugJyzA9Sswl", "role": "medic_anatomo_patolog",
         "admin" : 1
         }

users_collection=db.Users
labs_collection=db.Laboratories
substance_types_collection=db.Substance_types
stocks_collection=db.Stocks
cons_col=db.Consumption

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

def add_one_substance(substance_name, producer_name, inferior_limit):

    new_substance={"substance_name":substance_name,
               "producer_name":producer_name,
                "unique_substance_code":generate_unique_code(),
                "total_quantity": 0,
                "inferior_limit": inferior_limit

                }
    return substance_types_collection.insert_one(new_substance)


def add_one_stock(unique_substance_code, unique_bottle_code, quantity, expiration_date):

    new_stock={"unique_substance_code":unique_substance_code,
               "unique_bottle_code":unique_bottle_code,
               "original_quantity":quantity,
               "current_quantity": quantity,
                "expiration_date":expiration_date
                }
    return stocks_collection.insert_one(new_stock)



#--------------------------------------------------------------------------------------------------------------------------



# user_test=add_one_user('a', 'b', 'c', 'a', 'b', 'c', 'd', 'e')
# lab_test=add_one_lab("Laborator de anatomo-patologie, Spitalul de Pneumoftiziologie Iasi")
# print("Id la user_test: " , user_test.inserted_id)
#hash-ul asta scoate mereu acelasi output pt acelasi input
# print("b hashuit este: ", hashlib.sha256('parola'.encode('utf-8')).hexdigest())
# print("b hashuit este: ", hashlib.sha256('b'.encode('utf-8')).hexdigest())


#---------COMENZI DE BAZA-------

# result=users.insert_one(user1)
# result=users.insert_many([user1, user1])
# result=users_collection.find_one({"first_name": "Doina"})

# result=users_collection.find_one({"first_name": "Doina", "last_name": "Murarescu"}, {"_id": 0, "password": 1})
# print("The user found: " , result['password'])


# from bson.objectid import ObjectId
# result=users.find_one({"_id": ObjectId("6434781c83a8dfe90c23020c")})
# print("The user found: " , result)








# ================================================================================================

from datetime import datetime, timedelta, date

def ajutor():
    # today = datetime.now()
    # one_week_ago = today - timedelta(weeks=3)

    # condition = {
    #     'bottle_code':'ec',
    #     'date': {'$gte': one_week_ago, '$lte': today}
    # }

    # result = cons_col.find(condition)  # înlocuiește 'nume_colectie' cu numele colecției reale
    # if result is None:
    #     return 0
    # total_quantity = 0
    
    # for doc in result:
    #     print(doc['date'])
    #     new Date()

    

    date=datetime.now()+timedelta(weeks=7)
    format_date=date.isoformat()
    new_consumption={"unique_substance_code":"clI7NRwP",
               "unique_bottle_code":"f",
                "original_quantity":10,
                "current_quantity": 6,
    "expiration_date":datetime.now()+timedelta(weeks=9),
                "laboratory_code": "gyeD08ys"
                }
    return stocks_collection.insert_one(new_consumption)



def addstock():
    
   
    new_stock={"unique_substance_code":"clI7NRwP",
               "unique_bottle_code":"AAAA",
               "original_quantity":10,
               "current_quantity": 10,
                "expiration_date":datetime.now()+timedelta(weeks=1),
               "laboratory_code": "gyeD08ys",
               'substance_name':"Coca Cola"
               }
    
    return stocks_collection.insert_one(new_stock)





import csv
import io
from flask import make_response
# def get_csv(lab_code):
#     documents = stocks_collection.find({"laboratory_code": lab_code})
#      # Creează un flux de fișier în memorie
#     output = io.StringIO()

#     # Creează un scriitor CSV pentru fluxul de fișier
#     writer = csv.writer(output)

#     # Scrie antetele coloanelor în fișierul CSV
#     writer.writerow(["Cod substanta", "Cantitate curenta"])  # Înlocuiește Camp1, Camp2, Camp3 cu numele câmpurilor din colecția Stocks

#     # Iterează prin documente și scrie rândurile în fișierul CSV
#     for document in documents:
#         writer.writerow([document["unique_substance_code"], document["current_quantity"]])  # Înlocuiește camp1, camp2, camp3 cu numele câmpurilor din colecția Stocks

#     # Setează cursorul fluxului de fișier la începutul fișierului
#     output.seek(0)

#     # Creează un răspuns Flask cu fișierul CSV atașat
#     response = make_response(output.getvalue())
#     response.headers['Content-Disposition'] = 'attachment; filename=tabel.csv'
#     response.headers['Content-type'] = 'text/csv'

#     return response

def get_csv(lab_code):
    documents = stocks_collection.find({"laboratory_code": lab_code})
    cale_fisier_csv = '/test.csv'

# Deschide fișierul CSV în modul de scriere
    with open(cale_fisier_csv, 'w', newline='') as csvfile:
        # Creează un scriitor CSV
        writer = csv.writer(csvfile)

        # Scrie antetele coloanelor în fișierul CSV
        writer.writerow(["Cod substanta", "Cantitate curenta"])  # Inlocuieste Camp1, Camp2, Camp3 cu numele campurilor din colectia Stocks

        # Iterează prin documente și scrie rândurile în fișierul CSV
        for document in documents:
            writer.writerow([document["unique_substance_code"], document["current_quantity"]])  # Inlocuieste camp1, camp2, camp3 cu numele campurilor din colectia Stocks



# def delete_expired():




addstock()
# ajutor()
# get_csv("gyeD08ys")