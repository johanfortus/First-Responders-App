from flask import Flask, request, jsonify
from pymongo import MongoClient

import certifi
import json
import os
import sys
import threading
import time
from datetime import datetime
from dotenv import load_dotenv

# Add parent directory to path for importing Agents
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, parent_dir)

# Import agent functions
from Agents.first_responder_agent.agent import analyze_call_and_update_wellness, push_notification_based_on_severity

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Connect to MongoDB Atlas
MONGO_URI = os.getenv('MONGO_URI')
if not MONGO_URI:
    raise ValueError("MONGO_URI environment variable is not set")

# Enhanced MongoDB connection with better SSL configuration
try:
    client = MongoClient(
        MONGO_URI,
        tlsCAFile=certifi.where(),
        serverSelectionTimeoutMS=5000,
        connectTimeoutMS=5000,
        socketTimeoutMS=5000,
        retryWrites=True,
        w='majority'
    )
    # Test the connection
    client.admin.command('ping')
    print("MongoDB connection successful")
except Exception as e:
    print(f"MongoDB connection failed: {e}")
    print("Check your MONGO_URI and network connection")

db = client["development"]
collection = db["call_records"]

# Load threshold configuration
def load_threshold_config():
    config_path = os.path.join(parent_dir, "Agents", "first_responder_agent", "config.json")
    try:
        with open(config_path, 'r') as f:
            config = json.load(f)
            return config.get("thresholds", {}).get("auto_escalate", 0.78)
    except Exception as e:
        print(f"Failed to load threshold config: {e}")
        return 0.78  # Default threshold

CHAT_TRIGGER_THRESHOLD = load_threshold_config()

def trigger_chat_after_delay(user_id, call_id, severity_score, delay_seconds=10):
    """
    Trigger chat in frontend after specified delay if severity meets threshold
    """
    def delayed_trigger():
        time.sleep(delay_seconds)
        try:
            # Create notification payload for chat trigger
            chat_trigger_payload = {
                "user_id": user_id,
                "call_id": call_id,
                "severity_score": severity_score,
                "action": "trigger_chat",
                "timestamp": datetime.now().isoformat()
            }

            # Store the chat trigger event in database for frontend to check
            chat_collection = db["chat_triggers"]
            chat_collection.insert_one(chat_trigger_payload)

            print(f"Chat triggered for user {user_id} after {delay_seconds} seconds due to severity {severity_score}")

        except Exception as e:
            print(f"Failed to trigger chat for user {user_id}: {e}")

    # Start the delayed trigger in a separate thread
    trigger_thread = threading.Thread(target=delayed_trigger)
    trigger_thread.daemon = True
    trigger_thread.start()

# -----------------------------
# Home route
# -----------------------------
@app.route('/')
def home():
    try:
        print("Databases:", client.list_database_names())
        print("Collections:", db.list_collection_names())
        return "Flask server is running! MongoDB connected successfully."
    except Exception as e:
        print(f"Database error: {e}")
        return f"Flask server is running, but MongoDB connection failed: {str(e)}"


# @app.route('/users/<userID>/\', methods=['GET'])
# def get_user_calls(userID):
#     collection = db["call_records"]
#     # Find the user document by userID
#     user = db["users"].find_one({"userID": userID}, {"_id": 0, "calls": 1})
    
#     if not user or "calls" not in user:
#         return jsonify({"error": f"No user found with userID {userID} or no calls field"}), 404

#     call_ids = user["calls"] 
#     print("Call IDs:", call_ids)  # Debug print

#     # Find all call_records where call_id is in the user's calls array
#     calls = list(collection.find({"call_id": {"$in": call_ids}}, {"_id": 0}))
#     print(calls)

#     return jsonify(calls)

@app.route('/call', methods=['POST'])
def add_call():
    data = request.json

    # Validate required fields
    required_fields = ["callID", "userID", "transcripts", "severityScore", "date"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    # Convert date string to datetime object (optional)
    try:
        call_date = datetime.fromisoformat(data["date"])
    except ValueError:
        return jsonify({"error": "Invalid date format. Use ISO format (YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS)"}), 400

    # Prepare new call document
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
        # Auto-create user if they don't exist
        new_user = {
            "userID": userID,
            "calls": []
        }
        collection.insert_one(new_user)
        print(f"Created new user: {userID}")  # Debug print
    
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


# -----------------------------
# Agent endpoints
# -----------------------------
@app.route('/analyze-call', methods=['POST'])
def analyze_call():
    """Analyze emergency call transcript and update wellness scores"""
    data = request.json

    # Validate required fields
    required_fields = ["transcript", "call_id", "user_id"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    try:
        result = analyze_call_and_update_wellness(
            transcript=data["transcript"],
            call_id=data["call_id"],
            user_id=data["user_id"]
        )

        # Check if severity score meets threshold for chat trigger
        if result["status"] == "success" and "severity_score" in result:
            severity_score = result["severity_score"] / 100.0  # Convert to 0-1 scale to match threshold
            if severity_score >= CHAT_TRIGGER_THRESHOLD:
                # Trigger chat after 10 seconds
                trigger_chat_after_delay(
                    user_id=data["user_id"],
                    call_id=data["call_id"],
                    severity_score=result["severity_score"]
                )
                result["chat_trigger_scheduled"] = True
                result["threshold_met"] = True
            else:
                result["chat_trigger_scheduled"] = False
                result["threshold_met"] = False

        return jsonify(result), 200 if result["status"] == "success" else 500

    except Exception as e:
        return jsonify({
            "status": "error",
            "error_message": f"Failed to analyze call: {str(e)}"
        }), 500


@app.route('/push-notification', methods=['POST'])
def push_notification():
    """Push severity-based notification to user"""
    data = request.json

    # Validate required fields
    required_fields = ["user_id", "severity_score"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    try:
        result = push_notification_based_on_severity(
            user_id=data["user_id"],
            severity_score=data["severity_score"]
        )
        return jsonify(result), 200 if result["status"] == "success" else 500

    except Exception as e:
        return jsonify({
            "status": "error",
            "error_message": f"Failed to push notification: {str(e)}"
        }), 500


# -----------------------------
# Additional endpoints for agent functionality
# -----------------------------
@app.route('/users/<user_id>/calls', methods=['GET'])
def get_user_calls_for_agent(user_id):
    """Get user's call history for wellness calculations"""
    # For now, return empty array - would implement proper user call tracking later
    return jsonify({
        "calls": [],
        "status": "success"
    }), 200


@app.route('/users/<user_id>/wellness', methods=['POST'])
def update_user_wellness_scores(user_id):
    """Update user's wellness scores"""
    data = request.json

    # For now, just return success - would implement wellness tracking later
    return jsonify({
        "status": "success",
        "message": f"Wellness scores updated for user {user_id}"
    }), 200


@app.route('/notifications', methods=['POST'])
def send_notification_endpoint():
    """Send notification to user"""
    data = request.json

    # For now, just return success - would implement notification system later
    return jsonify({
        "status": "success",
        "message": "Notification sent successfully"
    }), 200



@app.route('/chat-with-gemini', methods=['POST'])
def chat_with_gemini():
    """Chat with Gemini AI for mental health support"""
    try:
        data = request.json
        user_message = data.get('message', '')
        context = data.get('context', '')
        incident_id = data.get('incidentId', '')
        
        # For demo purposes, use a simple response system
        # In production, this would integrate with actual Gemini API
        lower_message = user_message.lower()
        
        # Crisis detection keywords
        crisis_keywords = [
            'not good', 'terrible', 'awful', 'horrible', 'can\'t cope', 
            'overwhelmed', 'depressed', 'suicidal', 'want to die', 
            'end it all', 'kill myself', 'harm myself'
        ]
        
        if any(keyword in lower_message for keyword in crisis_keywords):
            return jsonify({
                "status": "success",
                "response": "CRISIS_DETECTED",
                "severity": "high"
            }), 200
        
        # Mental health concerns
        concern_keywords = [
            'struggling', 'hard time', 'difficult', 'stress', 'anxiety', 
            'worried', 'scared', 'afraid', 'trouble', 'problem'
        ]
        
        if any(keyword in lower_message for keyword in concern_keywords):
            response = "I can hear that you're going through a tough time right now. It's completely understandable to feel this way after a difficult call. You're not alone in this. Would you like me to connect you with someone who can provide additional support?"
        elif any(word in lower_message for word in ['okay', 'fine', 'alright', 'good']):
            response = "I'm glad to hear you're doing okay. It's important to check in with yourself regularly after these kinds of calls. Is there anything specific about the call that's on your mind?"
        else:
            response = "Thank you for sharing that with me. It takes courage to talk about these experiences. How are you feeling physically right now? Are you getting enough rest?"
        
        # Store the conversation in database
        conversation_collection = db["chat_conversations"]
        conversation_collection.insert_one({
            "incident_id": incident_id,
            "user_message": user_message,
            "ai_response": response,
            "timestamp": datetime.utcnow(),
            "context": context
        })
        
        return jsonify({
            "status": "success",
            "response": response,
            "severity": "normal"
        }), 200
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


if __name__ == "__main__":
    debug_mode = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    app.run(debug=debug_mode, host='0.0.0.0', port=5000)