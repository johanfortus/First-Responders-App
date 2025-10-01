from google.adk.agents import Agent
from datetime import datetime
import json
import os
import threading
import time
from .utils import (
    load_config,
    send_to_backend,
    calculate_severity_score,
    calculate_wellness_scores,
    update_user_wellness_scores
)

# Load configuration
config = load_config()

def trigger_chat_after_delay(user_id: str, call_id: int, severity_score: int, delay_seconds: int = 10):
    """
    Trigger chat notification after delay when severity meets threshold
    """
    def delayed_trigger():
        time.sleep(delay_seconds)
        try:
            # Create chat trigger notification
            chat_trigger_data = {
                "user_id": user_id,
                "call_id": call_id,
                "severity_score": severity_score,
                "action": "trigger_chat",
                "timestamp": datetime.now().isoformat(),
                "message": f"High severity call detected (score: {severity_score}). Support chat available."
            }

            # Post notification to backend endpoint that frontend polls
            result = send_to_backend("notifications", chat_trigger_data)

            if result and result.get("status") == "success":
                print(f"✓ Chat trigger notification sent for user {user_id} after {delay_seconds}s (call {call_id}, severity {severity_score})")
            else:
                print(f"✗ Failed to send chat trigger notification for user {user_id}")

        except Exception as e:
            print(f"✗ Error triggering chat notification: {e}")

    # Start delayed trigger in background thread
    trigger_thread = threading.Thread(target=delayed_trigger)
    trigger_thread.daemon = True
    trigger_thread.start()
    print(f"Chat trigger scheduled for user {user_id} in {delay_seconds} seconds")

def analyze_call_and_update_wellness(transcript: str, call_id: int, user_id: str) -> dict:
    """
    Analyze emergency call, calculate severity score, update user call arrays, and recalculate wellness scores.

    Args:
        transcript: Audio transcript from 911/dispatch call
        call_id: Unique integer call ID that ties to calls table
        user_id: String user ID who responded to this call

    Returns:
        dict: Results including call_id, severity_score, and updated wellness scores
    """
    try:
        # Validate inputs
        if not transcript or call_id is None or user_id is None:
            return {
                "status": "error",
                "error_message": "Transcript, call_id, and user_id are required"
            }

        # Calculate severity score (1-100) using only transcript
        severity_score = calculate_severity_score(transcript, user_id, config)

        # Check if severity meets threshold for chat trigger (from config: auto_escalate = 0.78)
        threshold = config.get("thresholds", {}).get("auto_escalate", 0.78)
        if severity_score / 100.0 >= threshold:
            # Trigger chat after 10 seconds
            trigger_chat_after_delay(user_id, call_id, severity_score, delay_seconds=10)

        # Create call record matching backend schema
        call_record = {
            "callID": call_id,
            "transcripts": transcript,
            "severityScore": severity_score,
            "date": datetime.now().isoformat(),
            "userID": user_id
        }
        
        # Store call in database
        call_result = send_to_backend("call", call_record)

        # Add call_id to user's calls array using existing PUT endpoint
        user_call_update = {
            "callID": call_id
        }
        backend_result = send_to_backend(f"user/{user_id}", user_call_update, method="PUT")

        # Calculate new wellness scores including this call's severity
        wellness_scores = calculate_wellness_scores(user_id, severity_score)

        # Update user's wellness scores in database
        wellness_result = update_user_wellness_scores(user_id, wellness_scores)

        return {
            "status": "success",
            "call_id": call_id,
            "severity_score": severity_score,
            "call_stored": call_result.get("status") == "success",
            "call_added": backend_result.get("status") == "success",
            "wellness_updated": wellness_result.get("status") == "success",
            "new_wellness_scores": wellness_scores
        }
        
    except Exception as e:
        return {
            "status": "error",
            "error_message": f"Failed to analyze call: {str(e)}"
        }

def push_notification_based_on_severity(user_id: str, severity_score: int) -> dict:
    """
    Push notification to user based on severity score monitoring.
    
    Args:
        user_id: User ID to send notification to
        severity_score: Severity score (1-100) that triggered the notification
    
    Returns:
        dict: Results of notification push attempt
    """
    try:
        # Validate inputs
        if not user_id or severity_score is None:
            return {
                "status": "error",
                "error_message": "user_id and severity_score are required"
            }
        
        # Determine notification type based on severity
        if severity_score >= 80:
            notification_type = "critical"
            message = "High-stress incident detected. Please prioritize your wellbeing and consider reaching out for support."
            priority = "high"
        elif severity_score >= 60:
            notification_type = "warning"
            message = "Challenging call detected. Remember that support resources are available if needed."
            priority = "medium"
        elif severity_score >= 40:
            notification_type = "reminder"
            message = "Check-in reminder: How are you feeling after the recent call?"
            priority = "low"
        else:
            # No notification needed for low severity
            return {
                "status": "success",
                "notification_sent": False,
                "reason": "Severity score too low for notification"
            }
        
        # Create notification payload
        notification_payload = {
            "user_id": user_id,
            "notification_type": notification_type,
            "message": message,
            "priority": priority,
            "severity_score": severity_score,
            "timestamp": datetime.now().isoformat(),
            "action_required": severity_score >= 80  # Critical notifications require action
        }
        
        # Send notification via backend
        notification_result = send_to_backend("notifications", notification_payload)
        
        return {
            "status": "success",
            "notification_sent": notification_result["status"] == "success",
            "notification_type": notification_type,
            "priority": priority,
            "message": message,
            "backend_response": notification_result
        }
        
    except Exception as e:
        return {
            "status": "error",
            "error_message": f"Failed to push notification: {str(e)}"
        }

# Create the root agent with only these two functions
root_agent = Agent(
    name="first_responder_call_analyzer",
    model="gemini-2.0-flash",
    description="AI agent for analyzing emergency calls and pushing severity-based notifications to first responders.",
    instruction="""
    I am a specialized agent for first responder call analysis and notification management. I have two main functions:

    1. **Call Analysis**: I analyze 911/dispatch call transcripts to calculate severity scores (1-100), store call records, update user call arrays, and recalculate wellness scores for all involved responders.

    2. **Severity Notifications**: I push appropriate notifications to users based on severity score thresholds:
       - Critical (80-100): High-priority notifications encouraging immediate support
       - Warning (60-79): Medium-priority notifications with support reminders  
       - Reminder (40-59): Low-priority check-in reminders
       - No notification for scores below 40

    I work directly with the Flask backend to update database records and manage the notification system.
    """,
    tools=[
        analyze_call_and_update_wellness,
        push_notification_based_on_severity
    ]
)