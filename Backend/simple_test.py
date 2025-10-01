from flask import Flask, request, jsonify
import google.generativeai as genai
import os

app = Flask(__name__)

# Configure Gemini API
genai.configure(api_key=os.getenv('GEMINI_API_KEY', ''))
model = genai.GenerativeModel('gemini-pro')

# Simple conversation state tracker (in-memory)
conversation_states = {}

@app.route('/test-chat', methods=['POST'])
def test_chat():
    try:
        data = request.json
        user_message = data.get('message', '')
        incident_id = data.get('incidentId', '')
        
        # Get or create conversation state
        if incident_id not in conversation_states:
            conversation_states[incident_id] = {
                'message_count': 0
            }
            print(f"DEBUG: Created new conversation state for {incident_id}")
        
        state = conversation_states[incident_id]
        state['message_count'] += 1
        
        print(f"DEBUG: User message: {user_message}")
        print(f"DEBUG: Message count: {state['message_count']}")
        print(f"DEBUG: All conversation states: {conversation_states}")
        
        # Always use Gemini AI for dynamic responses
        try:
            # Build context-aware prompt based on conversation state
            conversation_context = f"Message #{state['message_count']} in conversation"
            if state['message_count'] == 1:
                context_note = "This is the first response after a difficult emergency call. Be warm, empathetic, and check how they're feeling."
            elif state['message_count'] == 2:
                context_note = "This is the second message. Continue to be supportive and ask about their specific concerns or feelings."
            elif state['message_count'] >= 3:
                context_note = "The conversation is developing. Consider offering specific resources like therapist recommendations for the Miami area, or connecting them with emergency contacts if needed."
            else:
                context_note = "Continue the supportive conversation."
            
            prompt = f"""You are a supportive AI assistant for first responders after difficult emergency calls. 

Context: {conversation_context}. {context_note}

The first responder said: "{user_message}"

Guidelines:
- Respond with empathy and understanding
- Keep responses concise (2-3 sentences typically)
- If they seem to need professional help, mention Miami-area therapists or emergency contacts
- Be genuine and caring in your responses
- Don't be overly clinical - be human and supportive

Respond as a caring mental health support system for emergency responders."""
            
            gemini_response = model.generate_content(prompt)
            response = gemini_response.text
            print(f"DEBUG: Gemini response (message #{state['message_count']}): {response}")
        except Exception as e:
            print(f"DEBUG: Gemini API error: {e}")
            # Fallback response that varies based on message count
            if state['message_count'] == 1:
                response = "Thank you for reaching out. I'm here to listen and support you through this. How are you feeling right now?"
            elif state['message_count'] == 2:
                response = "I can hear that you're going through a tough time. You're not alone in this. What's weighing most heavily on your mind?"
            else:
                response = "Thank you for continuing to share with me. It takes courage to talk about these experiences. Would you like me to help you find some resources or support options?"
        
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
    app.run(debug=True, host='127.0.0.1', port=5000)
