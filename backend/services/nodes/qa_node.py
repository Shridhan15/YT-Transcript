from services.agent_state import AgentState
from services.rag import answer_question
from services.llm import call_llm
from services.transcript import get_transcript_segment 

def qa_node(state: AgentState) -> dict:
    if not state.get("url"):
        return {"message_parts": ["I need a video URL to answer questions."]}
        
    question = state.get("qa_question") or state["user_input"]
    time_range = state.get("time_range")

    try: 
        # Timestamp-based segment
        if time_range:
            start, end = time_range["start"], time_range["end"]
            context = get_transcript_segment(state["url"], start, end)
            
            if not context:
                return {"message_parts": [f"I couldn't find a transcript for the range {start}s - {end}s."]}
            
            #  LLM call using the segment as context
            prompt = f"Context from {start}s to {end}s: {context}\n\nQuestion: {question}"
            answer = call_llm(prompt) 
            return {"message_parts": [f"\n\n(Analysis from {int(start)}s to {int(end)}s):\n{answer}"]}
        
        #  Standard RAG 
        answer = answer_question(question)
        return {"message_parts": [f"\n\n{answer}"]}
    
    except Exception as e:
        print(f"QA Error: {e}")
        return {"message_parts": ["I encountered an error trying to answer that."]}