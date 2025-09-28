from flask import Flask, request, jsonify
from pymongo import MongoClient
import certifi
import json
import os 
from datetime import datetime

app = Flask(__name__)

# Connect to MongoDB Atlas
MONGO_URI = "mongodb+srv://destingollamudi_db_user:R550jzYyB6L88CS6@first-responders.ybbrqtf.mongodb.net/development?retryWrites=true&w=majority"
client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())
db = client["development"]
collection = db["call_records"]

@app.route('/')
def home():
    # print("Databases:", client.list_database_names())
    # print("Collections:", db.list_collection_names())
    return "Flask server is running!"

@app.route('/call', methods=['POST'])
def add_call():
    data = request.json

    # Validate required fields
    required_fields = ["userID", "transcripts", "severityScore", "date"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    try:
        call_date = datetime.fromisoformat(data["date"])
    except ValueError:
        return jsonify({"error": "Invalid date format. Use ISO format (YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS)"}), 400

    new_call = {
        "callID": data["callID"],
        "userID": data["userID"],
        "transcripts": data["transcripts"],
        "severityScore": data["severityScore"],
        "date": call_date
    }

    # Insert into MongoDB
    result = collection.insert_one(new_call)

    return jsonify({
        "message": "Call added successfully",
        "call_id": str(result.inserted_id)
    }), 201


@app.route('/user/<userID>', methods=['PUT'])
def put_call(userID):
    data = request.json
    collection = db["users"]
    
    # Validate request data
    if not data or 'callID' not in data:
        return jsonify({"error": "callID is required in request body"}), 400
    
    try:
        callID = int(data['callID'])
    except (ValueError, TypeError):
        return jsonify({"error": "callID must be a valid integer"}), 400
    
    # Find the user document by userID
    user = collection.find_one({"userID": userID})
    
    if not user:
        return jsonify({"error": f"No user found with userID {userID}"}), 404
    
    # Append the callID to the calls array
    result = collection.update_one(
        {"userID": userID},
        {"$push": {"calls": callID}}
    )
    
    if result.modified_count == 0:
        return jsonify({"error": "Failed to update user"}), 500
    
    # Get the updated user document
    updated_user = collection.find_one({"userID": userID}, {"_id": 0})
    
    print("Updated user document:", updated_user)  # Debug print
    
    return jsonify({
        "message": f"Successfully added callID {callID} to user {userID}",
        "user": updated_user
    }), 200


if __name__ == "__main__":
    app.run(debug=True)
