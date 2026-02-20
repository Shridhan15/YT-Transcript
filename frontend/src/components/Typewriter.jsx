// src/components/Typewriter.jsx
import { useState, useEffect } from "react";

export default function Typewriter({ text, speed = 15 }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText("");

    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return <span className="whitespace-pre-wrap">{displayedText}</span>;
}
