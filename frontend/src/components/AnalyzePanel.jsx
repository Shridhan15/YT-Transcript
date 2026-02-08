import { useEffect, useState } from "react";
import { analyzeVideo, askQuestion } from "../api/backend";
import Summary from "./Summary";
import Chat from "./Chat";

export default function AnalyzePanel() {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  // Receive URL from content.js
  useEffect(() => {
    const handler = (event) => {
      if (event.data?.type === "YOUTUBE_URL") {
        setUrl(event.data.url);
        setSummary("");
        setAnalyzed(false);
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  // Manual analyze
  const handleAnalyze = async () => {
    if (!url) return;
    setLoading(true);
    const data = await analyzeVideo(url);
    setSummary(data.summary);
    setAnalyzed(true);
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">YouTube AI Assistant</h2>

      {!analyzed && (
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm py-2 rounded"
        >
          {loading ? "Analyzing…" : "Analyze this video"}
        </button>
      )}

      {summary && <Summary text={summary} />}
      {summary && <Chat onAsk={askQuestion} />}
    </div>
  );
}
