export default function TimeframeSelector({ tf, setTf }) {
  const frames = ["1m", "5m", "15m", "1h", "4h", "1d", "1w"];
  const custom = ["30m", "90m", "6h"];

  return (
    <div className="timeframes">
      {frames.map(f => (
        <button
          key={f}
          onClick={() => setTf(f)}
          className={tf === f ? "tf-btn active" : "tf-btn"}
        >
          {f}
        </button>
      ))}

      {custom.map(c => (
        <button
          key={c}
          onClick={() => setTf(`custom-${c.replace("m","").replace("h","")}`)}
          className={tf === `custom-${c.replace("m","").replace("h","")}`
            ? "tf-btn active"
            : "tf-btn"}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
