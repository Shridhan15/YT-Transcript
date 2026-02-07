# services/chunker.py
def chunk_text(text: str, chunk_size=1000, overlap=200):
    chunks = []
    start = 0
    idx = 0

    while start < len(text):
        end = start + chunk_size
        chunk_text = text[start:end]

        chunks.append({
            "id": idx,
            "text": chunk_text
        })

        idx += 1
        start = end - overlap

    return chunks
