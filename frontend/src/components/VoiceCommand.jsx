import { useState } from "react";
import { voiceCommand } from "../api/backend";

export default function VoiceCommand() {
  const [listening, setListening] = useState(false);
  const [heardText, setHeardText] = useState("");
  const [error, setError] = useState("");
  const [llmResponse, setLlmResponse] = useState(null);

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Voice not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onerror = (e) => {
      console.error("Speech error:", e);
      setListening(false);
      setError("Voice recognition failed: " + e.error);
    };

    setListening(true);
    setHeardText("");
    setError("");
    setLlmResponse(null);

    recognition.onresult = async (event) => {
      const text = event.results[0][0].transcript;
      setHeardText(text);
      setListening(false);

      try {
        const intentPayload = await voiceCommand(text);
        setLlmResponse(intentPayload);

        window.parent.postMessage(
          {
            type: "YT_AGENT_INTENT",
            payload: intentPayload,
          },
          "*",
        );
      } catch {
        setError("Failed to process command");
      }
    };

    recognition.onerror = () => {
      setListening(false);
      setError("Voice recognition failed");
    };

    recognition.start();
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={startListening}
        className={`text-sm py-2 rounded-xl ${
          listening ? "bg-red-600" : "bg-zinc-700 hover:bg-zinc-600"
        }`}
      >
        {listening ? "Listening…" : "🎙️ Voice Command"}
      </button>

      {heardText && (
        <p className="text-xs text-zinc-400">Heard: “{heardText}”</p>
      )}
      {llmResponse && (
        <pre className="text-xs bg-zinc-900 text-green-400 p-2 rounded-lg overflow-x-auto">
          {JSON.stringify(llmResponse, null, 2)}
        </pre>
      )}

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
