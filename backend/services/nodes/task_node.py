from services.agent_state import AgentState

# Add synonyms to map to valid YouTube actions
INTENT_MAP = {
    "SKIP": "SEEK",
    "REWIND": "SEEK",
    "FORWARD": "SEEK",
    "JUMP": "SEEK"
}

ALLOWED_INTENTS = {"PLAY", "PAUSE", "SEEK", "SEARCH", "MUTE", "UNMUTE", "SPEED", "NEXT"}

def task_node(state: AgentState) -> dict:
    valid_tasks = []

    for task in state["tasks"]:
        raw_intent = task.get("intent")
        if isinstance(task, dict) and raw_intent:
            
            # 1. Normalize Intent (Handle SKIP -> SEEK)
            intent = raw_intent.upper()
            if intent in INTENT_MAP:
                intent = INTENT_MAP[intent]
                task["intent"] = intent # Update the task object
            
            # 2. Check if allowed
            if intent in ALLOWED_INTENTS:
                valid_tasks.append(task)
            
    return {"tasks": valid_tasks}