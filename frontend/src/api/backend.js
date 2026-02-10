// src/api/backend.js

const BASE_URL = "http://127.0.0.1:8000";

/**
 * Calls the LangGraph agent on the backend.
 * * @param {Object} params
 * @param {string} params.input - The user's text or voice command.
 * @param {string} params.url - The current YouTube video URL.
 * @returns {Promise<{message: string, commands: Array}>}
 */
export async function callAgent({ input, url }) {
    try {
        console.log("Calling Agent API with:", { input, url });
        const response = await fetch(`${BASE_URL}/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            // Map 'input' to 'message' to match the Python Pydantic model
            body: JSON.stringify({
                message: input,
                url: url
            }),
        });
        console.log("Agent API Response:", response);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `Server error: ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Agent API Call Failed:", error);
        // Return a fallback so the UI doesn't crash
        return {
            message: "Sorry, I couldn't connect to the server. Please check if the backend is running.",
            commands: []
        };
    }
}