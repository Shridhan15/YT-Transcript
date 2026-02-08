import TypingText from "./TypingText";

export default function Summary({ text, onDone }) {
  return (
    <div className="rounded-xl p-4 bg-white/5 backdrop-blur-md border border-white/10">
      <h3 className="text-sm font-semibold mb-2 text-zinc-200">Summary</h3>

      <p className="text-xs leading-relaxed text-zinc-300 whitespace-pre-wrap">
        <TypingText text={text} onDone={onDone} />
      </p>
    </div>
  );
}
