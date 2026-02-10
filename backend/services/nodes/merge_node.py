from services.agent_state import AgentState

def merge_node(state: AgentState) -> dict: 
    return {"message": " ".join(state["message_parts"])}