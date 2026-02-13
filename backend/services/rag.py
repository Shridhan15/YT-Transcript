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
You are answering a question using retrieved transcript context.

Strict Rules:
- Use ONLY the information present in the Context.
- Do NOT use outside knowledge.
- Do NOT assume anything not explicitly stated.
- If the answer is not clearly found in the Context, reply exactly:
Not mentioned in the video
- Do NOT add introductions.
- Do NOT add explanations unless required by the question.
- Do NOT use bold, markdown, or formatting symbols.
- Do NOT restate the question.
- Do NOT write anything before or after the answer.
- Keep the answer clear, natural, and concise.

Context:
{context}

Question:
{question}

Answer:
"""


    return call_llm(prompt)
