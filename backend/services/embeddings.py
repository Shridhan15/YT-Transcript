import os
import numpy as np
from huggingface_hub import InferenceClient
from dotenv import load_dotenv

load_dotenv()

client = InferenceClient(
    model="sentence-transformers/all-MiniLM-L6-v2",
    token=os.getenv("HF_API_TOKEN")
)

def embed_texts(texts: list[str]) -> np.ndarray:
    """
    Calls Hugging Face Inference API to generate embeddings.
    Returns numpy array of shape (n_texts, embedding_dim)
    """
    embeddings = client.feature_extraction(texts)

    return np.array(embeddings, dtype="float32")


if __name__ == "__main__":
    emb = embed_texts(["Hello world", "YouTube AI assistant"])
    print(emb.shape)   # should be (2, 384)
