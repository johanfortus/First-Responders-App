import json
import os
import requests
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def load_config() -> Dict:
    """Load configuration from config.json"""
    try:
        config_path = os.path.join(os.path.dirname(__file__), 'config.json')
        with open(config_path, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        logger.error("config.json not found")
        return {}

def send_to_backend(endpoint: str, data: Dict, backend_url: str = None) -> Dict:
    """Send data to backend API endpoint"""
    try:
        config = load_config()
        base_url = backend_url or config.get('backend_url', 'http://localhost:8000')
        
        # Ensure endpoint starts with /
        if not endpoint.startswith('/'):
            endpoint = '/' + endpoint
            
        url = f"{base_url}{endpoint}"
        
        headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
        
        # Add authentication if configured
        auth_token = config.get('auth_token') or os.getenv('API_AUTH_TOKEN')
        if auth_token:
            headers['Authorization'] = f"Bearer {auth_token}"
        
        response = requests.post(url, json=data, headers=headers, timeout=30)
        response.raise_for_status()
        
        return response.json()
        
    except requests.exceptions.RequestException as e:
        logger.error(f"Backend request failed: {str(e)}")
        raise
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse backend response: {str(e)}")
        raise

def calculate_severity_score(transcript: str, user_id: str, config: Dict) -> int:
    """
    Calculate call severity score (1-100) using AI analysis of transcript

    Args:
        transcript: 911/dispatch audio transcript
        user_id: String user ID who responded (used for context)
        config: Configuration (not used for AI scoring)

    Returns:
        int: Severity score from 1-100
    """
    try:
        import vertexai
        from vertexai.generative_models import GenerativeModel
        
        # Initialize Vertex AI
        project_id = os.getenv('GOOGLE_CLOUD_PROJECT')
        location = os.getenv('GOOGLE_CLOUD_LOCATION', 'us-central1')
        
        if not project_id:
            logger.warning("Google Cloud project not configured, using fallback")
            raise Exception("No Google Cloud project configured")
        
        vertexai.init(project=project_id, location=location)
        model = GenerativeModel('gemini-2.5-flash')
        
        # Create prompt for AI severity assessment
        prompt = f"""
        You are an expert emergency response analyst. Analyze this 911/dispatch call transcript and assign a severity score from 1-100.

        TRANSCRIPT: "{transcript}"

        RESPONDING USER ID: {user_id}
        
        SCORING CRITERIA:
        - 1-20: Minor incidents (fender benders, minor medical calls, false alarms)
        - 21-40: Moderate incidents (minor fires, minor injuries, property damage)
        - 41-60: Serious incidents (house fires, major accidents, significant injuries)
        - 61-80: Critical incidents (multiple casualties, officer down, major fires)
        - 81-100: Catastrophic incidents (mass casualties, terrorism, major disasters)
        
        FACTORS TO CONSIDER:
        - Life-threatening situations
        - Number and severity of injuries/casualties
        - Threat to public safety
        - Emotional trauma potential for responders
        - Complexity and duration of response needed
        - Presence of children or vulnerable populations
        - Officer/responder safety concerns
        
        Respond with ONLY a number from 1-100. No explanation needed.
        """
        
        # Get AI response
        response = model.generate_content(prompt)
        score_text = response.text.strip()
        
        # Extract the score from response
        import re
        numbers = re.findall(r'\d+', score_text)
        
        if numbers:
            severity_score = int(numbers[0])
            severity_score = max(1, min(severity_score, 100))
            logger.info(f"AI Severity Score: {severity_score}/100")
            return severity_score
        
    except Exception as e:
        logger.warning(f"AI severity calculation failed: {str(e)}, using fallback")
        
        # Fallback to keyword-based scoring
        high_risk_keywords = config.get("high_risk_keywords", [])
        keywords_found = []
        
        for keyword in high_risk_keywords:
            if keyword.lower() in transcript.lower():
                keywords_found.append(keyword)
        
        # Simple fallback scoring based on keywords found
        severity_score = 1 + min(len(keywords_found) * 20, 99)
        severity_score = max(1, min(severity_score, 100))
        
        logger.info(f"Fallback Severity Score: {severity_score}/100")
        return severity_score

def calculate_wellness_scores(user_id: str, new_call_severity: int = None) -> Dict[str, int]:
    """
    Calculate wellness scores based on user's call history
    
    Args:
        user_id: The user ID to calculate wellness for
        new_call_severity: Optional new call severity to include in calculation
        
    Returns:
        Dict containing wellness_score_day, wellness_score_week, wellness_score_month
    """
    try:
        # Fetch user's call history from backend
        calls_data = send_to_backend(f'/users/{user_id}/calls', {})
        calls = calls_data.get('calls', [])
        
        today = datetime.now().date()
        week_ago = today - timedelta(days=7)
        month_ago = today - timedelta(days=30)
        
        # Filter calls by time periods
        daily_calls = []
        weekly_calls = []
        monthly_calls = []
        
        for call in calls:
            call_date = datetime.fromisoformat(call["day"]).date()
            severity = call["severity_score"]
            
            if call_date == today:
                daily_calls.append(severity)
            if call_date >= week_ago:
                weekly_calls.append(severity)
            if call_date >= month_ago:
                monthly_calls.append(severity)
        
        # Include new call severity if provided
        if new_call_severity:
            daily_calls.append(new_call_severity)
            weekly_calls.append(new_call_severity)
            monthly_calls.append(new_call_severity)
        
        # Calculate wellness scores (inverse of severity - higher severity = lower wellness)
        def calculate_wellness_from_severity(severities: List[int]) -> int:
            if not severities:
                return 50  # Neutral wellness if no calls
            
            avg_severity = sum(severities) / len(severities)
            # Invert the scale: wellness = 101 - severity
            wellness = 101 - avg_severity
            return max(1, min(wellness, 100))
        
        wellness_day = calculate_wellness_from_severity(daily_calls)
        wellness_week = calculate_wellness_from_severity(weekly_calls)
        wellness_month = calculate_wellness_from_severity(monthly_calls)
        
        result = {
            "wellness_score_day": int(wellness_day),
            "wellness_score_week": int(wellness_week),
            "wellness_score_month": int(wellness_month)
        }
        
        logger.info(f"Calculated wellness scores for user {user_id}: {result}")
        return result
        
    except Exception as e:
        logger.error(f"Failed to calculate wellness scores for user {user_id}: {str(e)}")
        # Return neutral scores on error
        return {
            "wellness_score_day": 50,
            "wellness_score_week": 50,
            "wellness_score_month": 50
        }

def update_user_wellness_scores(user_id: str, wellness_scores: Dict) -> Dict:
    """
    Update user's wellness scores in the backend
    
    Args:
        user_id: The user ID to update
        wellness_scores: Dictionary containing the new wellness scores
        
    Returns:
        Dict containing update result
    """
    try:
        data = {
            "user_id": user_id,
            "wellness_scores": wellness_scores,
            "updated_at": datetime.now().isoformat()
        }
        
        result = send_to_backend(f'/users/{user_id}/wellness', data)
        logger.info(f"Updated wellness scores for user {user_id}")
        return result
        
    except Exception as e:
        logger.error(f"Failed to update wellness scores for user {user_id}: {str(e)}")
        raise