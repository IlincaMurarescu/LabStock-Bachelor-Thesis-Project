from pymongo import MongoClient
from credentials import mongodb_key

cluster="mongodb+srv://ilincamurarescu:"+mongodb_key+"@app.epksz7t.mongodb.net/?retryWrites=true&w=majority"

client=MongoClient(cluster)

db=client.MedNote_Entities

users_collection=db.Users
labs_collection=db.Laboratories
substance_types_collection=db.Substance_types
stocks_collection=db.Stocks
quality_incidents_collection=db.Quality_incidents
consumption_collection=db.Consumption
blacklist_collection=db.Blacklist