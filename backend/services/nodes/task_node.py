from services.agent_state import AgentState 
INTENT_MAP = {
    "SKIP": "SEEK",
    "REWIND": "SEEK",
    "FORWARD": "SEEK",
    "JUMP": "SEEK",
    "FIND": "SEARCH",   
    "LOOKUP": "SEARCH", 
}

ALLOWED_INTENTS = {"PLAY", "PAUSE", "SEEK", "SEARCH", "MUTE", "UNMUTE", "SPEED", "NEXT"}

def task_node(state: AgentState):
    tasks = state.get("tasks", [])
    processed_tasks = []

    for task in tasks:
        if isinstance(task, str):
            intent = task.upper().replace("_VIDEO", "")
            processed_tasks.append({"intent": intent, "value": None})
        elif isinstance(task, dict):
            processed_tasks.append(task)

    return {"tasks": processed_tasks}