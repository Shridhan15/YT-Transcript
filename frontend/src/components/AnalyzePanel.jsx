import { useEffect, useRef, useState } from "react";
import { analyzeVideo, askQuestion } from "../api/backend";
import Summary from "./Summary";
import Chat from "./Chat";
import VoiceCommand from "./VoiceCommand";

export default function AnalyzePanel() {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [summaryDone, setSummaryDone] = useState(false);

  // prevents onDone firing multiple times
  const summaryDoneRef = useRef(false);

  useEffect(() => {
    const handler = (event) => {
      if (event.data?.type === "YOUTUBE_URL") {
        setUrl(event.data.url);
        setSummary("");
        setAnalyzed(false);
        setSummaryDone(false);
        summaryDoneRef.current = false; // reset
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const handleAnalyze = async () => {
    if (!url || loading) return;

    setLoading(true);
    setSummary("");
    setSummaryDone(false);
    summaryDoneRef.current = false;

    const data = await analyzeVideo(url);

    setSummary(data.summary);
    setAnalyzed(true);
    setLoading(false);
  };

  const handleSummaryDone = () => {
    if (summaryDoneRef.current) return; // 🔒 guard
    summaryDoneRef.current = true;
    setSummaryDone(true);
  };

  return (
    <div className="flex flex-col gap-4 text-zinc-200">
      <h2 className="text-lg font-semibold">YouTube AI Assistant</h2>

      {!analyzed && (
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="cursor-pointer bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm py-2 rounded-xl"
        >
          {loading ? "Analyzing…" : "Analyze this video"}
        </button>
      )}

      <VoiceCommand />

      {summary && <Summary text={summary} onDone={handleSummaryDone} />}

      {/* Chat appears ONLY after summary finishes typing */}
      {summaryDone && (
        <div className="animate-fade-in">
          <Chat onAsk={askQuestion} />
        </div>
      )}
    </div>
  );
}
