import os
import json
from dotenv import load_dotenv
from groq import Groq
from services.agent_state import AgentState

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))
 
SYSTEM_PROMPT = """
You are a YouTube AI Assistant. 
Your job is to analyze the user's input and decide on actions (Tasks) and capabilities (QA/Analysis).

RETURN ONLY VALID JSON. NO MARKDOWN.

### 1. TASKS (Video Control)
If the user wants to control the video, output structured tasks.
Allowed Intents:
- PLAY, PAUSE, MUTE, UNMUTE, NEXT
- SEEK (value = seconds integer. Positive for skip/forward, Negative for rewind/back)
- SPEED (value = float, e.g., 1.5, 2.0)
- SEARCH (query = string)

Examples:
- "Skip 10 seconds" -> {"intent": "SEEK", "value": 10}
- "Go back 30 seconds" -> {"intent": "SEEK", "value": -30}
- "Play at 2x speed" -> {"intent": "SPEED", "value": 2.0}

### 2. CAPABILITIES (QA & Analysis)
- qa_enabled: true (If user asks a question about the video content)
- qa_question: "The extracted question?" (or null)
- analyze: true (If user wants a summary, overview, or analysis)

### 3. MESSAGE
- message_parts: A list of short confirmation strings (e.g., "Skipping 10s", "Answering your question...").

### OUTPUT FORMAT
{
  "tasks": [ {"intent": "SEEK", "value": 10} ],
  "qa_enabled": false,
  "qa_question": null,
  "analyze": false,
  "message_parts": ["Skipping forward 10 seconds."]
}
"""

def command_understanding_node(state: AgentState) -> dict:
    user_text = state["user_input"]
    
    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile", # Using your preferred model
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_text}
            ],
            temperature=0,
            response_format={"type": "json_object"}
        )
        
        content = completion.choices[0].message.content
        data = json.loads(content)

        return {
            "tasks": data.get("tasks", []),
            "qa_enabled": data.get("qa_enabled", False),
            "qa_question": data.get("qa_question"),
            "analyze": data.get("analyze", False),
            "message_parts": data.get("message_parts", [])
        }

    except Exception as e:
        print(f"LLM Error: {e}")
        return {
            "tasks": [],
            "qa_enabled": False, 
            "analyze": False,
            "message_parts": ["Sorry, I couldn't understand that command."]
        }