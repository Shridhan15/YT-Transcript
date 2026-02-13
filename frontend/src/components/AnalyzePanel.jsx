import { useEffect, useState, useRef } from "react";
import { callAgent } from "../api/backend";
import VoiceCommand from "./VoiceCommand";
import Typewriter from "./Typewriter"; // Import the new component

export default function AnalyzePanel() {
  const [url, setUrl] = useState("");
  // State is now a list of messages: { role: "user" | "ai", text: "..." }
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Ref for auto-scrolling
  const messagesEndRef = useRef(null);

  // 1. Listen for URL
  useEffect(() => {
    const handler = (event) => {
      if (event.data?.type === "YOUTUBE_URL") {
        console.log("Received URL:", event.data.url);
        setUrl(event.data.url);
        setMessages([]); // Clear chat on new video
      }
    };
    window.addEventListener("message", handler);
    window.parent.postMessage({ type: "SIDEBAR_READY" }, "*"); // Handshake
    return () => window.removeEventListener("message", handler);
  }, []);

  // 2. Auto-scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // 3. Unified Handler
  const handleUserQuery = async (queryText) => {
    if (!url) return;
    if (loading) return;

    // Add User Message immediately
    const userMsg = { role: "user", text: queryText };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const result = await callAgent({
        input: queryText,
        url,
      });

      // Add AI Message
      const aiMsg = { role: "ai", text: result.message };
      setMessages((prev) => [...prev, aiMsg]);

      // Execute Tasks
      if (result.tasks?.length) {
        window.parent.postMessage(
          { type: "YT_AGENT_INTENT", payload: result },
          "*",
        );
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Sorry, I encountered an error." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen p-4 text-zinc-200 bg-zinc-900">
      <h2 className="text-lg font-semibold mb-4 text-center">
        YouTube AI Assistant
      </h2>

      {/* --- CHAT HISTORY AREA (Grow to fill space) --- */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 no-scrollbar">
        {/* Welcome Message */}
        {messages.length === 0 && (
          <div className="text-zinc-500 text-sm text-center mt-10 italic">
            Ask me to summarize, find a topic, or control the video!
          </div>
        )}

        {/* Map through messages */}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col max-w-[85%] ${
              msg.role === "user"
                ? "self-end items-end ml-auto"
                : "self-start items-start mr-auto"
            }`}
          >
            <span
              className={`text-[10px] font-bold mb-1 ${
                msg.role === "user" ? "text-zinc-400" : "text-blue-400"
              }`}
            >
              {msg.role === "user" ? "You" : "AI"}
            </span>

            <div
              className={`p-3 text-sm rounded-xl ${
                msg.role === "user"
                  ? "bg-zinc-700 text-white rounded-tr-none"
                  : "bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-tl-none"
              }`}
            >
              {msg.role === "ai" ? (
                // Only animate the LATEST message to avoid re-typing old ones
                idx === messages.length - 1 ? (
                  <Typewriter text={msg.text} />
                ) : (
                  <span className="whitespace-pre-wrap">{msg.text}</span>
                )
              ) : (
                msg.text
              )}
            </div>
          </div>
        ))}

        {/* Loading Bubble */}
        {loading && (
          <div className="self-start max-w-[85%]">
            <span className="text-[10px] text-blue-400 font-bold mb-1">AI</span>
            <div className="bg-zinc-800 border border-zinc-700 p-3 rounded-xl rounded-tl-none w-fit">
              <div className="flex gap-1 h-5 items-center">
                <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"></span>
              </div>
            </div>
          </div>
        )}

        {/* Invisible div to scroll to */}
        <div ref={messagesEndRef} />
      </div>

      {/* --- CONTROLS AREA (Fixed at bottom) --- */}
      <div className="flex flex-col gap-3 pt-2 border-t border-zinc-800">
        <button
          onClick={() =>
            handleUserQuery("Analyze this video and give me a summary")
          }
          disabled={loading}
          className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-sm py-3 rounded-xl disabled:opacity-50 transition-all font-medium"
        >
          {loading ? "Thinking..." : " Analyze & Summarize"}
        </button>

        <VoiceCommand
          onVoiceInput={(text) => handleUserQuery(text)}
          disabled={loading}
        />
      </div>
    </div>
  );
}
