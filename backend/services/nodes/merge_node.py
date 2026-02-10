from services.agent_state import AgentState

def merge_node(state: AgentState) -> dict:
    # Join all collected parts into one clean string
    return {"message": " ".join(state["message_parts"])}