from services.llm import call_llm

def summarize_chunks(chunks):
    summaries = []

    for chunk in chunks[:5]:  # limit initially
        prompt = f"""
        Provide a clear, readable summary of the video.

Rules:
- Divide the summary into clear sections.
- Use short section titles.
- Each section should be 2–4 bullet points or short paragraphs.
- Do NOT start every section with the same word.
- Keep language simple and readable.
- Do not use ** for emphasis, keep the summary humanly.

Format exactly like this:

Section Title:
- point
- point

Section Title:
- point
- point

        {chunk}
        """
        summaries.append(call_llm(prompt))

    final_prompt = f"""
    Combine the following partial summaries into one coherent summary:

    {summaries}
    """

    return call_llm(final_prompt)
