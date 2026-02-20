// src/api/backend.js

const BASE_URL = "http://127.0.0.1:8000";

/**
 * Calls the LangGraph agent on the backend.
 * * @param {Object} params
 * @param {string} params.input -  user's text or voice command.
 * @param {string} params.url -  current YouTube video URL.
 * @returns {Promise<{message: string, commands: Array}>}
 */
export async function callAgent({ input, url, currentTime }) {
    try {
        console.log("Calling Agent API with:", { input, url, currentTime });
        const response = await fetch(`${BASE_URL}/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: input,
                url: url,
                currentTime
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
        return {
            message: "Sorry, I couldn't connect to the server. Please check if the backend is running.",
            commands: []
        };
    }
}