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



/**
 * Send voice command text to backend for intent extraction
 * @param {string} command - Spoken command text
 * @returns {Promise<{tasks: Array}>}
 */
export async function voiceCommand(command) {
    console.log("Sending voice command to backend:", command);
    const response = await fetch(`${BASE_URL}/voice-intent`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ command }),
    });
    console.log("Received response from backend for voice command:", response);

    if (!response.ok) {
        throw new Error("Failed to process voice command");
    }

    return response.json();
}
