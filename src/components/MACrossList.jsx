export default function MACrossList({ title, coins, type }) {
  return (
    <div className="side-card">
      <h3 className={`side-title ${type === "golden" ? "gain" : "loss"}`}>
        {type === "golden" ? "✨ Golden Cross" : "⚠ Death Cross"}
      </h3>

      {coins.length === 0 && (
        <p style={{ fontSize: 12, opacity: 0.6 }}>
          No recent crosses
        </p>
      )}

      {coins.map(p => (
        <div
          key={p.symbol}
          className={`side-row ${type === "golden" ? "gain" : "loss"}`}
        >
          <span>{p.symbol}</span>
          <span>
            {type === "golden" ? "🟢 50 × 200" : "🔴 50 × 200"}
          </span>
        </div>
      ))}
    </div>
  );
}
