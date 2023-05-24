from pymongo import MongoClient

# Acasa
cluster="mongodb+srv://ilincamurarescu:9bRJNugJyzA9Sswl@app.epksz7t.mongodb.net/?retryWrites=true&w=majority"
#Handresti

client=MongoClient(cluster)

db=client.MedNote_Entities

users_collection=db.Users
labs_collection=db.Laboratories
substance_types_collection=db.Substance_types
stocks_collection=db.Stocks
quality_incidents_collection=db.Quality_incidents