import { useState } from "react";
import { analyzeVideo, askQuestion } from "../api/backend";
import Summary from "./Summary";
import Chat from "./Chat";

export default function AnalyzePanel() {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!url) return;
    setLoading(true);
    const data = await analyzeVideo(url);
    setSummary(data.summary);
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">YouTube AI Assistant</h2>

      <input
        className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Paste YouTube URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm py-2 rounded"
      >
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {summary && <Summary text={summary} />}
      {summary && <Chat onAsk={askQuestion} />}
    </div>
  );
}
