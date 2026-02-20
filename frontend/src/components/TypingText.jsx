import { useEffect, useRef, useState } from "react";

export default function TypingText({ text = "", speed = 18 }) {
  const [displayed, setDisplayed] = useState("");
  const indexRef = useRef(0);
  const intervalRef = useRef(null);
  const finishedRef = useRef(false);
  const lastTextRef = useRef("");

  useEffect(() => {
    if (!text) return;

    if (lastTextRef.current === text && finishedRef.current) {
      return;
    }

    lastTextRef.current = text;
    finishedRef.current = false;
    indexRef.current = 0;
    setDisplayed("");

    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayed((prev) => {
        const next = prev + text.charAt(indexRef.current);
        indexRef.current++;

        if (indexRef.current >= text.length) {
          clearInterval(intervalRef.current);
          finishedRef.current = true;
          onDone?.();
        }

        return next;
      });
    }, speed);

    return () => clearInterval(intervalRef.current);
  }, [text, speed, onDone]);

  return <span>{displayed}</span>;
}
