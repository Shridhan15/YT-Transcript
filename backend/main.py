from fastapi import FastAPI
from pydantic import BaseModel

from services.transcript import fetch_transcript
from services.chunker import chunk_text
from services.summarizer import summarize_chunks

app = FastAPI()

class VideoRequest(BaseModel):
    url: str

@app.post("/analyze-video")
def analyze_video(req: VideoRequest):
    transcript = fetch_transcript(req.url)
    chunks = chunk_text(transcript)
    summary = summarize_chunks(chunks)
    return {"summary": summary}
