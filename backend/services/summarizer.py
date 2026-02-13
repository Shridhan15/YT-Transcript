from services.llm import call_llm

def summarize_chunks(chunks):
    summaries = []

    for chunk in chunks[:5]:  # limit initially
        prompt = f"""
You are generating a structured video summary.

Strict Instructions:
- Start directly with the first section title.
- Do NOT write introductions like "Here is the summary" or "Providing a summary".
- Do NOT use bold text or special formatting symbols like **.
- Do NOT add a heading like "Summary:".
- Follow the exact format below.
- Keep language natural and human.
- Avoid repeating the same opening word across sections.
- Keep it clean and readable.

Output Format (follow exactly):

Section Title:
- Point
- Point
- Point

Section Title:
- Point
- Point

Now summarize this transcript section:

{chunk}
"""

        summaries.append(call_llm(prompt))

    final_prompt = f"""
You are combining multiple partial summaries into one clean, well-structured summary.

Strict Rules:
- Start directly with a section title.
- Do NOT write introductions.
- Do NOT write "Summary:".
- Do NOT use bold formatting.
- Keep clean section titles.
- Each section must contain 2–4 bullet points.
- Remove repetition across sections.
- Make the flow natural and cohesive.
- Keep it human and readable.

Follow this format exactly:

Section Title:
- Point
- Point

Section Title:
- Point
- Point

Partial Summaries:
{summaries}
"""


    return call_llm(final_prompt)
