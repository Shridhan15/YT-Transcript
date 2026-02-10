import { useState } from "react";

export default function VoiceCommand({ onVoiceInput, disabled }) {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState("");

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;

    setListening(true);
    setError("");

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setListening(false);
      // Pass text up to parent immediately
      onVoiceInput(text);
    };

    recognition.onerror = (event) => {
      console.error(event);
      setListening(false);
      setError("Error listening");
    };

    recognition.start();
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={startListening}
        disabled={disabled}
        className={`text-sm py-2 rounded-xl transition-all ${
          listening
            ? "bg-red-600 animate-pulse"
            : "bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50"
        }`}
      >
        {listening ? "Listening..." : "🎙️ Voice Command"}
      </button>
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}
