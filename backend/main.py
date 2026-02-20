from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from pydantic import BaseModel
from services.embeddings import embed_texts

from services.transcript import fetch_transcript
from services.chunker import chunk_text
from services.summarizer import summarize_chunks
from services.rag import build_rag_index, answer_question
from services.voice_intent import extract_voice_intent
from services.graph import build_agent

app = FastAPI()
agent_graph = build_agent()





app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class VideoRequest(BaseModel):
    url: str

class QuestionRequest(BaseModel):
    question: str


# @app.post("/analyze-video")
# def analyze_video(req: VideoRequest):
#     transcript = fetch_transcript(req.url)
#     chunks = chunk_text(transcript)

#     build_rag_index(chunks)
#     summary = summarize_chunks([c["text"] for c in chunks])

#     return {"summary": summary}


# @app.post("/ask")
# def ask(req: QuestionRequest):
#     answer = answer_question(req.question)
#     return {"answer": answer}


# @app.post("/voice-intent")
# def voice_intent(payload: dict):
#     return extract_voice_intent(payload["command"])

class ChatRequest(BaseModel):
    message: str
    url: str
    currentTime: float


@app.post("/chat")
def chat(req: ChatRequest):
    initial_state = {
        "user_input": req.message,
        "url": req.url,
        "current_video_time": req.currentTime, 
        "message_parts": [],
        "tasks": [],
        "qa_enabled": False,
        "analyze": False,
        "time_range": None
    }
    
    # Run Graph
    result = agent_graph.invoke(initial_state)
    
    return {
        "message": result["message"],
        "tasks": result.get("tasks", [])
    }