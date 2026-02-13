import { useEffect, useRef, useState } from "react";
import TypingText from "./TypingText";

export default function Chat({ onAsk }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const scrollToBottom = () =>
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(scrollToBottom, [messages, loading]);

  const handleAsk = async () => {
    if (!input || loading) return;

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
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-semibold text-zinc-200">
        Ask about the video
      </h3>

      <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[85%] text-xs px-3 py-2 rounded-xl ${
              msg.role === "user"
                ? "bg-blue-600 text-white self-end"
                : "bg-zinc-700/70 text-zinc-200 self-start"
            }`}
          >
            {msg.role === "assistant" ? (
              <TypingText text={msg.content} />
            ) : (
              msg.content
            )}
          </div>
        ))}

        {loading && (
          <div className="text-xs text-zinc-400 italic">Thinking…</div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 mt-2">
        <input
          className="flex-1 bg-zinc-900/80 border border-zinc-700 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Ask a question…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAsk()}
        />

        <button
          onClick={handleAsk}
          disabled={loading}
          className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-xs text-white px-4 py-2 rounded-lg"
        >
          Ask
        </button>
      </div>
    </div>
  );
}
