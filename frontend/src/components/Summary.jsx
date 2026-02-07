export default function Summary({ text }) {
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded p-3">
      <h3 className="text-sm font-medium mb-2">Summary</h3>
      <p className="text-xs leading-relaxed text-zinc-300 whitespace-pre-wrap">
        {text}
      </p>
    </div>
  );
}
