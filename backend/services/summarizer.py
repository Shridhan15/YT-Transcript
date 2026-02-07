from services.llm import call_llm

def summarize_chunks(chunks):
    summaries = []

    for chunk in chunks[:5]:  # limit initially
        prompt = f"""
        Summarize the following YouTube transcript chunk clearly and concisely:

        {chunk}
        """
        summaries.append(call_llm(prompt))

    final_prompt = f"""
    Combine the following partial summaries into one coherent summary:

    {summaries}
    """

    return call_llm(final_prompt)
