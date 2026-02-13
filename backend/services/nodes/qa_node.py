from services.agent_state import AgentState
from services.rag import answer_question

def qa_node(state: AgentState) -> dict:
    if not state.get("url"):
        return {"message_parts": ["I need a video URL to answer questions."]}
        
    question = state.get("qa_question")
    if not question:
        return {} # No question to answer

    try: 
        answer = answer_question(question)
        
        return {"message_parts": [f"\n\n{answer}"]}
    
    except Exception as e:
        print(f"QA Error: {e}")
        return {"message_parts": ["I couldn't find an answer in the video."]}