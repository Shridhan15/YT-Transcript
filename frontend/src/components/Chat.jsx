import { useState } from "react";

export default function Chat({ onAsk }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!input) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    const res = await onAsk(input);

    const aiMessage = { role: "assistant", content: res.answer };
    setMessages((prev) => [...prev, aiMessage]);
    setLoading(false);
  };

  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded p-3 flex flex-col gap-2">
      <h3 className="text-sm font-medium mb-1">Ask about the video</h3>

      <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`text-xs p-2 rounded ${
              msg.role === "user"
                ? "bg-blue-600 text-white self-end"
                : "bg-zinc-700 text-zinc-200 self-start"
            }`}
          >
            {msg.content}
          </div>
        ))}

        {loading && <div className="text-xs text-zinc-400">Thinking…</div>}
      </div>

      <div className="flex gap-2 mt-2">
        <input
          className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs focus:outline-none"
          placeholder="Ask a question…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAsk()}
        />

        <button
          onClick={handleAsk}
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-xs text-white px-3 py-1 rounded"
        >
          Ask
        </button>
      </div>
    </div>
  );
}
