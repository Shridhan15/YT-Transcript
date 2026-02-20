import os
import json
from dotenv import load_dotenv
from groq import Groq
from services.agent_state import AgentState

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))
 


def command_understanding_node(state: AgentState) -> dict:
    user_text = state["user_input"]
    curr_time = state.get("current_video_time", 0)

    SYSTEM_PROMPT = f"""
    You are a YouTube AI Assistant dispatcher. Current video time: {curr_time} seconds.
    Your sole job is to classify the user's intent into the JSON schema below. 

    ### INTENT CLASSIFICATION RULES:
    1. **Tasks (Video Control)**: 
       - If the user wants to play, pause, seek, or change speed, add an OBJECT to the "tasks" list.
       - FORMAT: {{"intent": "PLAY" | "PAUSE" | "SEEK" | "MUTE" | "UNMUTE" | "SPEED", "value": number | null}}
       - Example "skip 10s": {{"intent": "SEEK", "value": 10}}
       - CRITICAL: Never return strings in the "tasks" array.

    2. **Analyze (Summarization)**:
       - If the user asks for a summary, overview, or "what is this video about", set "analyze": true.
       - Set "message_parts": ["I'm analyzing the video transcript to generate a summary..."]

    3. **QA (Specific Questions)**:
       - If the user asks a specific question about content, set "qa_enabled": true and put the question in "qa_question".

    ### TIMESTAMP MATH (Reference time: {curr_time}s):
    - "last 2 mins" -> {{"start": {max(0, curr_time - 120)}, "end": {curr_time}}}
    - "what just happened" -> {{"start": {max(0, curr_time - 30)}, "end": {curr_time}}}

    ### OUTPUT SCHEMA:
    RETURN ONLY VALID JSON. DO NOT explain your reasoning.
    {{
      "tasks": [],
      "qa_enabled": false,
      "qa_question": null,
      "time_range": {{"start": float, "end": float}} or null,
      "analyze": false,
      "message_parts": ["Brief confirmation of the action being taken"]
    }}
    """
    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_text}
            ],
            temperature=0,
            response_format={"type": "json_object"}
        )
        
        content = completion.choices[0].message.content
        data = json.loads(content)
        
        print(f"DEBUG LLM Output: {data}")

        return {
            "tasks": data.get("tasks", []),
            "qa_enabled": data.get("qa_enabled", False),
            "qa_question": data.get("qa_question"),
            "time_range": data.get("time_range"),
            "analyze": data.get("analyze", False),
            "message_parts": data.get("message_parts", [])
        }

    except Exception as e:
        print(f"LLM Error in Understand Node: {e}")
        return {
            "tasks": [], "qa_enabled": False, "analyze": False,
            "message_parts": ["Error parsing command."]
        }