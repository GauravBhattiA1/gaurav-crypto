
export default function StatsCards({ pairs }) {
  const total = pairs.length;
  const gainers = pairs.filter(p => p.percent > 0).length;
  const losers = pairs.filter(p => p.percent < 0).length;

  const avg =
    total > 0
      ? (pairs.reduce((s, p) => s + p.percent, 0) / total).toFixed(2)
      : "0.00";

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr 1fr", // 🔥 Losers wider
        gap: 15,
        marginBottom: 10,
        maxWidth: 1200
      }}
    >
      <Card title="Total Pairs" value={total} />
      <Card title="Gainers" value={gainers} color="green" />
      <Card title="Losers" value={losers} color="red" wide />
      <Card title="Avg Change" value={`${avg}%`} />
    </div>
  );
}

function Card({ title, value, color, wide }) {
  return (
    <div
      style={{
        padding: 16,
        minHeight: 90,
        borderRadius: 12,
        background: "#f1f198ff",
        color: color || "#111",
        boxShadow: "0 6px 16px rgba(32, 29, 29, 0.05)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
      }}
    >
      <div style={{ fontSize: 20, fontWeight: 700, opacity: 0.85 }}>{title}</div>
      <div
        style={{
          fontSize: 38,
          fontWeight: 800,
          marginTop: 6,
          color:
            color === "green"
              ? "#16a34a"
              : color === "red"
              ? "#dc2626"
              : "#111"
        }}
      >
        {value}
      </div>
    </div>
  );
}
