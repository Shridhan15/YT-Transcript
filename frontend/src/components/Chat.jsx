import { useState } from "react";

export default function Chat({ onAsk }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question) return;
    setLoading(true);
    const res = await onAsk(question);
    setAnswer(res.answer);
    setLoading(false);
  };

  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded p-3">
      <h3 className="text-sm font-medium mb-2">Ask a question</h3>

      <input
        className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs mb-2 focus:outline-none"
        placeholder="Ask about the video..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button
        onClick={handleAsk}
        disabled={loading}
        className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-xs text-white px-3 py-1 rounded"
      >
        {loading ? "Thinking..." : "Ask"}
      </button>

      {answer && (
        <p className="mt-3 text-xs text-zinc-300 whitespace-pre-wrap">
          <span className="font-semibold text-zinc-200">Answer:</span> {answer}
        </p>
      )}
    </div>
  );
}
