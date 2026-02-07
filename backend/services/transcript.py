from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import NoTranscriptFound
from services.utils import extract_video_id


def fetch_transcript(video_url: str) -> str:
    video_id = extract_video_id(video_url)

    ytt_api = YouTubeTranscriptApi()

    try:
        transcript = ytt_api.fetch(video_id, languages=["en"])
        print("Using English transcript")

    except NoTranscriptFound:
        try:
            transcript = ytt_api.fetch(video_id, languages=["hi"])
            print("English not found, using Hindi transcript")

        except Exception as e:
            raise RuntimeError(f"Transcript fetch failed: {e}")

    data = transcript.to_raw_data()
    full_text = " ".join(chunk["text"] for chunk in data)

    return full_text
