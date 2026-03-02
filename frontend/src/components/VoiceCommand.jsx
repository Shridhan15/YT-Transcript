import { useState } from "react";

export default function VoiceCommand({ onVoiceInput, disabled, setListening }) {
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
      onVoiceInput(text);
    };

    recognition.onerror = () => {
      setListening(false);
      setError("Error listening");
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };

  return (
    <>
      <button
        id="voice-hidden-btn"
        onClick={startListening}
        disabled={disabled}
        style={{ display: "none" }}
      >
        hidden
      </button>

      {error && <span className="text-xs text-red-400">{error}</span>}
    </>
  );
}
