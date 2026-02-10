from services.agent_state import AgentState
from services.transcript import fetch_transcript
from services.chunker import chunk_text
from services.rag import build_rag_index
from services.summarizer import summarize_chunks

def analyze_node(state: AgentState) -> dict:
    if not state.get("url"):
        return {"message_parts": ["I need a video URL to analyze content."]}

    try:
        # 1. Get Transcript
        transcript_text = fetch_transcript(state["url"])
        
        # 2. Chunk Text
        chunks = chunk_text(transcript_text)
        
        # 3. Build Index (for future QA)
        build_rag_index(chunks)
        
        # 4. Summarize
        # Extract just the text from chunks if your chunker returns objects
        chunk_texts = [c["text"] if isinstance(c, dict) else c for c in chunks]
        summary = summarize_chunks(chunk_texts)

        return {"message_parts": [f"\n\n**Summary:** {summary}"]}

    except Exception as e:
        print(f"Analysis Error: {e}")
        return {"message_parts": ["Failed to analyze the video."]}