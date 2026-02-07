const BASE_URL = "http://127.0.0.1:8000";

/**
 * Analyze a YouTube video
 * @param {string} url - YouTube video URL
 * @returns {Promise<{summary: string}>}
 */
export async function analyzeVideo(url) {
    const response = await fetch(`${BASE_URL}/analyze-video`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
    });

    if (!response.ok) {
        throw new Error("Failed to analyze video");
    }

    return response.json();
}

/**
 * Ask a question about the analyzed video (RAG)
 * @param {string} question
 * @returns {Promise<{answer: string}>}
 */
export async function askQuestion(question) {
    const response = await fetch(`${BASE_URL}/ask`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
    });

    if (!response.ok) {
        throw new Error("Failed to get answer");
    }

    return response.json();
}
