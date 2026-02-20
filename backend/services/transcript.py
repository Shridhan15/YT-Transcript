from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import NoTranscriptFound
from services.utils import extract_video_id


def fetch_transcript(video_url: str):
    video_id = extract_video_id(video_url)
    ytt_api = YouTubeTranscriptApi()
    try:
        try:
            transcript_obj = ytt_api.fetch(video_id, languages=["en"])
            print("DEBUG: Using English transcript")
        except:
            transcript_obj = ytt_api.fetch(video_id, languages=["hi"])
            print("DEBUG: English not found, using Hindi transcript")
        
        return transcript_obj.to_raw_data()
    except Exception as e:
        print(f"Transcript Error: {e}")
        return []

def get_transcript_segment(video_url: str, start: float, end: float) -> str:
    full_data = fetch_transcript(video_url)
    print(f"DEBUG: Filtering transcript from {start}s to {end}s")
    
    segment_chunks = [
        chunk["text"] for chunk in full_data 
        if chunk["start"] >= start and chunk["start"] <= end
    ]
    
    context = " ".join(segment_chunks)
    print(f"DEBUG: Captured {len(segment_chunks)} chunks. Text length: {len(context)}")
    return context