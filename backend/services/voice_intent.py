from groq import Groq
import os
import json
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

VOICE_SYSTEM_PROMPT = """
You are a YouTube voice automation agent.

Your task:
Convert a spoken user command into structured tasks.

STRICT RULES:
- Output ONLY valid JSON
- No explanations, no markdown
- Use ONLY allowed intents
- Multiple actions → multiple tasks

ALLOWED INTENTS:
PLAY
PAUSE
SEEK          (value = seconds, + or -)
MUTE
UNMUTE
SPEED         (value = playback speed, e.g. 1.25)
NEXT
SEARCH        (query = string)

OUTPUT FORMAT:
{
  "tasks": [
    { "intent": "...", "value": number?, "query": string? }
  ]
}

EXAMPLES:

User: pause the video
{
  "tasks": [
    { "intent": "PAUSE" }
  ]
}

User: go back 10 seconds and pause
{
  "tasks": [
    { "intent": "SEEK", "value": -10 },
    { "intent": "PAUSE" }
  ]
}

User: search system design interviews
{
  "tasks": [
    { "intent": "SEARCH", "query": "system design interviews" }
  ]
}
"""

def extract_voice_intent(command: str) -> dict:
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": VOICE_SYSTEM_PROMPT},
            {"role": "user", "content": command}
        ],
        temperature=0.2,
    )

    raw_output = response.choices[0].message.content.strip()
 
    try:
        return json.loads(raw_output)
    except json.JSONDecodeError: 
        return { "tasks": [] }
