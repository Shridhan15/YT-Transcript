from services.agent_state import AgentState

def merge_node(state: AgentState) -> dict:
    all_parts = state.get("message_parts", [])
    combined = "".join(all_parts)
    return {"message": combined}