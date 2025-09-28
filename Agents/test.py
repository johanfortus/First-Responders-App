# direct_test.py
from first_responder_agent.agent import analyze_call_and_update_wellness, push_notification_based_on_severity
# direct_test.py
import os
from dotenv import load_dotenv

# Load environment variables from the main .env file
load_dotenv('.env')
def test_call_analysis():
    """Test the call analysis function directly"""
    print("🧪 Testing analyze_call_and_update_wellness function...")
    
    # Test data
    test_transcript = "Officer down, shots fired, multiple casualties, child on scene, fire department responding"
    test_caller_ids = ["FIRE_001", "POLICE_002", "EMS_003"]
    
    print(f"📞 Transcript: '{test_transcript}'")
    print(f"👨‍🚒 Caller IDs: {test_caller_ids}")
    print("\n🔄 Running function...")
    
    try:
        result = analyze_call_and_update_wellness(
            transcript=test_transcript,
            caller_ids=test_caller_ids
        )
        
        print("✅ Function completed!")
        print(f"📊 Result: {result}")
        return result
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return None

def test_notification_push():
    """Test the notification push function directly"""
    print("\n🔔 Testing push_notification_based_on_severity function...")
    
    # Test different severity levels
    test_cases = [
        {"user_id": "FIRE_001", "severity": 95, "expected": "critical"},
        {"user_id": "POLICE_002", "severity": 70, "expected": "warning"},
        {"user_id": "EMS_003", "severity": 45, "expected": "reminder"},
        {"user_id": "FIRE_004", "severity": 25, "expected": "no notification"}
    ]
    
    results = []
    
    for test_case in test_cases:
        print(f"\n🚨 Testing: User {test_case['user_id']}, Severity {test_case['severity']}")
        
        try:
            result = push_notification_based_on_severity(
                user_id=test_case['user_id'],
                severity_score=test_case['severity']
            )
            
            print(f"✅ Result: {result}")
            results.append(result)
            
        except Exception as e:
            print(f"❌ Error: {e}")
            results.append(None)
    
    return results

def test_severity_calculation():
    """Test different transcripts to see severity scoring"""
    print("\n📊 Testing Severity Calculation with Different Transcripts...")
    
    from first_responder_agent.utils import calculate_severity_score, load_config
    
    config = load_config()
    
    test_transcripts = [
        {
            "transcript": "Minor fender bender, no injuries, single vehicle",
            "caller_ids": ["POLICE_001"],
            "expected": "low"
        },
        {
            "transcript": "House fire with smoke showing, residents evacuated safely",
            "caller_ids": ["FIRE_001", "FIRE_002"],
            "expected": "medium"
        },
        {
            "transcript": "Officer down, shots fired, multiple casualties, child on scene",
            "caller_ids": ["POLICE_001", "POLICE_002", "EMS_001", "FIRE_001"],
            "expected": "high"
        },
        {
            "transcript": "Mass casualty incident, explosion, multiple fatalities, pediatric victims",
            "caller_ids": ["FIRE_001", "FIRE_002", "POLICE_001", "POLICE_002", "EMS_001"],
            "expected": "critical"
        }
    ]
    
    for test in test_transcripts:
        print(f"\n📝 Transcript: '{test['transcript'][:50]}...'")
        print(f"👥 Responders: {len(test['caller_ids'])} units")
        
        severity = calculate_severity_score(
            transcript=test['transcript'],
            caller_ids=test['caller_ids'],
            config=config
        )
        
        print(f"📊 Severity Score: {severity}/100 (Expected: {test['expected']})")

if __name__ == "__main__":
    print("="*60)
    print("🚒 DIRECT FUNCTION TESTING")
    print("="*60)
    
    # Test 1: Severity calculation
    test_severity_calculation()
    
    print("\n" + "="*60)
    
    # Test 2: Call analysis
    call_result = test_call_analysis()
    
    print("\n" + "="*60)
    
    # Test 3: Notification push
    notification_results = test_notification_push()
    
    print("\n" + "="*60)
    print("📋 SUMMARY:")
    
    if call_result:
        print(f"✅ Call Analysis: SUCCESS - Call ID: {call_result.get('call_id', 'N/A')}")
        print(f"   Severity: {call_result.get('severity_score', 'N/A')}/100")
        print(f"   Users Updated: {call_result.get('users_updated', 'N/A')}")
    else:
        print("❌ Call Analysis: FAILED")
    
    successful_notifications = len([r for r in notification_results if r and r.get('status') == 'success'])
    print(f"✅ Notifications: {successful_notifications}/{len(notification_results)} successful")
    
    print("="*60)