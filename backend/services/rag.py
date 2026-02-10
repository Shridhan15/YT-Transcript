from services.embeddings import embed_texts
from services.vector_store import VectorStore
from services.llm import call_llm

vector_store = None   


def build_rag_index(chunks):
    global vector_store

    texts = [c["text"] for c in chunks]
    embeddings = embed_texts(texts)

    vector_store = VectorStore(dim=embeddings.shape[1])
    vector_store.add(embeddings, texts)


def answer_question(question: str):
    query_embedding = embed_texts([question])
    relevant_chunks = vector_store.search(query_embedding, k=4)

    context = "\n\n".join(relevant_chunks)

    prompt = f"""
Answer the question using ONLY the context below.
If the answer is not in the context, say "Not mentioned in the video" and do not use **, keep the answer humanly.

Context:
{context}

Question:
{question}
"""

    return call_llm(prompt)
