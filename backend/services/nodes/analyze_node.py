from services.agent_state import AgentState
from services.transcript import fetch_transcript
from services.chunker import chunk_text
from services.rag import build_rag_index
from services.summarizer import summarize_chunks

def analyze_node(state: AgentState) -> dict:
    print("DEBUG: Entered Analyze Node")
    if not state.get("url"):
        return {"message_parts": ["I need a video URL to analyze content."]}

    try:
        url = state.get("url")
    
        transcript_list = fetch_transcript(url)
        if not transcript_list:
            return {"message_parts": ["Could not retrieve transcript."]}
        
        full_text = " ".join([chunk['text'] for chunk in transcript_list])
    

        print(f"DEBUG: Transcript fetched, length: {len(transcript_list)}")
        
        chunks = chunk_text(full_text)
        build_rag_index(chunks)
         
        # Summarize
        chunk_texts = [c["text"] if isinstance(c, dict) else c for c in chunks]
        summary = summarize_chunks(chunk_texts)

        return {"message_parts": [f"\n\n{summary}"]}

    except Exception as e:
        print(f"Analysis Error: {e}")
        return {"message_parts": ["\n[Error: Failed to analyze the video.]"]}