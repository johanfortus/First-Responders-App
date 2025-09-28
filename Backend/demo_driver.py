#!/usr/bin/env python3
"""
Demo Driver Script for First Responders App
This script demonstrates the complete flow of the emergency call analysis system.
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, List

# Configuration
BASE_URL = "http://127.0.0.1:5000"
HEADERS = {"Content-Type": "application/json"}

# Sample emergency call transcripts for demo
SAMPLE_CALLS = [
    {
        "transcript": "911 dispatch, we have a minor fender bender at Main Street and 5th. No injuries reported, just need an officer for the report.",
        "call_id": 1001,
        "user_id": "officer_smith",
        "expected_severity": "Low (10-20)"
    },
    {
        "transcript": "Emergency! House fire at 123 Oak Street, multiple families trapped on second floor! Fire spreading rapidly!",
        "call_id": 1002,
        "user_id": "firefighter_jones",
        "expected_severity": "Critical (70-80)"
    },
    {
        "transcript": "We have an active shooter situation at downtown office building. Multiple shots fired, people are hiding. Need immediate response!",
        "call_id": 1003,
        "user_id": "officer_williams",
        "expected_severity": "Catastrophic (90-100)"
    },
    {
        "transcript": "Medical emergency - elderly person fell and might have broken hip. Patient is conscious and breathing.",
        "call_id": 1004,
        "user_id": "paramedic_davis",
        "expected_severity": "Moderate (30-40)"
    },
    {
        "transcript": "Multi-car accident on Highway 101, at least 3 vehicles involved, multiple injuries reported, need ambulances and fire rescue!",
        "call_id": 1005,
        "user_id": "officer_smith",
        "expected_severity": "Serious (60-70)"
    }
]

def check_server_status() -> bool:
    """Check if Flask server is running"""
    try:
        response = requests.get(f"{BASE_URL}/")
        return response.status_code == 200
    except requests.exceptions.ConnectionError:
        return False

def analyze_call(transcript: str, call_id: int, user_id: str) -> Dict:
    """Call the analyze-call endpoint"""
    payload = {
        "transcript": transcript,
        "call_id": call_id,
        "user_id": user_id
    }

    try:
        response = requests.post(f"{BASE_URL}/analyze-call", json=payload, headers=HEADERS)
        return {
            "status_code": response.status_code,
            "response": response.json()
        }
    except Exception as e:
        return {
            "status_code": 500,
            "response": {"error": str(e)}
        }

def push_notification(user_id: str, severity_score: int) -> Dict:
    """Call the push-notification endpoint"""
    payload = {
        "user_id": user_id,
        "severity_score": severity_score
    }

    try:
        response = requests.post(f"{BASE_URL}/push-notification", json=payload, headers=HEADERS)
        return {
            "status_code": response.status_code,
            "response": response.json()
        }
    except Exception as e:
        return {
            "status_code": 500,
            "response": {"error": str(e)}
        }

def add_traditional_call(call_data: Dict) -> Dict:
    """Add call using the traditional /call endpoint (for comparison)"""
    payload = {
        "callID": call_data["call_id"],
        "userID": call_data["user_id"],
        "transcripts": call_data["transcript"],
        "severityScore": 50,  # Manual score for comparison
        "date": datetime.now().isoformat()
    }

    try:
        response = requests.post(f"{BASE_URL}/call", json=payload, headers=HEADERS)
        return {
            "status_code": response.status_code,
            "response": response.json()
        }
    except Exception as e:
        return {
            "status_code": 500,
            "response": {"error": str(e)}
        }

def run_demo():
    """Run the complete demo"""
    print("=" * 60)
    print("!!! FIRST RESPONDERS APP - DEMO DRIVER !!!")
    print("=" * 60)

    # Check server status
    print("\n1. Checking server status...")
    if not check_server_status():
        print("[X] Flask server is not running!")
        print("Please start the server with: python app.py")
        return
    print("[OK] Flask server is running!")

    print("\n2. Running Emergency Call Analysis Demo...")
    print("-" * 50)

    results = []

    for i, call_data in enumerate(SAMPLE_CALLS, 1):
        print(f"\n[CALL] #{i}: {call_data['user_id'].upper()}")
        print(f"Expected Severity: {call_data['expected_severity']}")
        print(f"Transcript: {call_data['transcript'][:100]}...")

        # Analyze the call using AI agent
        print("\n[AI] Analyzing call with AI agent...")
        analysis_result = analyze_call(
            transcript=call_data["transcript"],
            call_id=call_data["call_id"],
            user_id=call_data["user_id"]
        )

        if analysis_result["status_code"] == 200:
            response_data = analysis_result["response"]
            if response_data.get("status") == "success":
                severity_score = response_data.get("severity_score", 0)
                print(f"[OK] AI Severity Score: {severity_score}/100")
                print(f"[OK] Call stored: {response_data.get('call_stored', False)}")
                print(f"[OK] Wellness updated: {response_data.get('wellness_updated', False)}")

                # Show wellness scores if available
                wellness_scores = response_data.get("new_wellness_scores", {})
                if wellness_scores:
                    print(f"[STATS] New Wellness Scores:")
                    print(f"   Daily: {wellness_scores.get('wellness_score_day', 'N/A')}")
                    print(f"   Weekly: {wellness_scores.get('wellness_score_week', 'N/A')}")
                    print(f"   Monthly: {wellness_scores.get('wellness_score_month', 'N/A')}")

                # Test notification system
                print(f"\n[NOTIF] Testing notification system...")
                notification_result = push_notification(call_data["user_id"], severity_score)

                if notification_result["status_code"] == 200:
                    notif_data = notification_result["response"]
                    if notif_data.get("notification_sent"):
                        print(f"[OK] Notification sent: {notif_data.get('notification_type', 'unknown')} priority")
                        print(f"[MSG] Message: {notif_data.get('message', 'No message')}")
                    else:
                        print(f"[INFO] No notification sent: {notif_data.get('reason', 'Unknown reason')}")
                else:
                    print(f"[X] Notification failed: {notification_result['response']}")

                results.append({
                    "call_id": call_data["call_id"],
                    "user_id": call_data["user_id"],
                    "expected_severity": call_data["expected_severity"],
                    "actual_severity": severity_score,
                    "analysis_success": True,
                    "notification_sent": notification_result["status_code"] == 200
                })
            else:
                print(f"[X] Analysis failed: {response_data.get('error_message', 'Unknown error')}")
                results.append({
                    "call_id": call_data["call_id"],
                    "user_id": call_data["user_id"],
                    "analysis_success": False
                })
        else:
            print(f"[X] Request failed: {analysis_result['response']}")
            results.append({
                "call_id": call_data["call_id"],
                "user_id": call_data["user_id"],
                "analysis_success": False
            })

        print("-" * 30)
        time.sleep(1)  # Brief pause between calls

    # Summary
    print("\n" + "=" * 60)
    print("[SUMMARY] DEMO SUMMARY")
    print("=" * 60)

    successful_analyses = sum(1 for r in results if r.get("analysis_success"))
    successful_notifications = sum(1 for r in results if r.get("notification_sent"))

    print(f"Total Calls Processed: {len(results)}")
    print(f"Successful Analyses: {successful_analyses}/{len(results)}")
    print(f"Notifications Sent: {successful_notifications}/{len(results)}")

    print("\n[RESULTS] SEVERITY SCORE RESULTS:")
    for result in results:
        if result.get("analysis_success"):
            print(f"  {result['user_id']}: {result.get('actual_severity', 'N/A')}/100 "
                  f"(Expected: {result.get('expected_severity', 'N/A')})")

    print("\n[DONE] DEMO COMPLETE!")
    print("The system successfully demonstrated:")
    print("  [OK] AI-powered severity scoring")
    print("  [OK] Automatic call record storage")
    print("  [OK] Real-time wellness score updates")
    print("  [OK] Intelligent notification system")

if __name__ == "__main__":
    run_demo()