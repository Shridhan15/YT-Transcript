import { useEffect, useState, useRef } from "react";
import { callAgent } from "../api/backend";
import VoiceCommand from "./VoiceCommand";
import Typewriter from "./Typewriter"; 

export default function AnalyzePanel() {
  const [url, setUrl] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const handler = (event) => {
      if (event.data?.type === "YOUTUBE_URL") {
        console.log("Received URL:", event.data.url);
        setUrl(event.data.url);
        setMessages([]); 
      }
    };
    window.addEventListener("message", handler);
    window.parent.postMessage({ type: "SIDEBAR_READY" }, "*"); 
    return () => window.removeEventListener("message", handler);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleUserQuery = async (queryText) => {
    if (!url) return;
    if (loading) return;
    window.parent.postMessage({ type: "GET_VIDEO_TIME" }, "*");
    const currentTime = await new Promise((resolve) => {
      const handler = (event) => {
        if (event.data?.type === "VIDEO_TIME_RESPONSE") {
          window.removeEventListener("message", handler);
          resolve(event.data.currentTime);
        }
      };
      window.addEventListener("message", handler);
      setTimeout(() => resolve(0), 500);
    });

    const userMsg = { role: "user", text: queryText };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const result = await callAgent({
        input: queryText,
        url,
        currentTime: currentTime,
      });

      const aiMsg = { role: "ai", text: result.message };
      setMessages((prev) => [...prev, aiMsg]);

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

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 no-scrollbar">
        {messages.length === 0 && (
          <div className="text-zinc-500 text-sm text-center mt-10 italic">
            Ask me to summarize, find a topic, or control the video!
          </div>
        )}

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

        <div ref={messagesEndRef} />
      </div>

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
