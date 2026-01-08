export default function MarketFilter({
  filter,
  setFilter,
  masterTrend,
  setMasterTrend,
  strongTrendCount
}) {
  const options = ["all", "gainers", "losers"];

  return (
    <div style={{ margin: "15px 0" }}>
      
      {/* 🔥 MASTER STRONG TREND BUTTON */}
      <button
        onClick={() => setMasterTrend(prev => !prev)}
        className={`filter-btn ${masterTrend ? "active" : ""}`}
        style={{
          marginRight: 12,
          padding: "8px 20px",
          borderRadius: 20,
          border: "none",
          cursor: "pointer",
          fontWeight: 700,
          background: masterTrend ? "#16a34a" : "#e5e7eb",
          color: masterTrend ? "#fff" : "#111"
        }}
      >
        📈 Strong Trend {masterTrend ? "ON" : "OFF"} ({strongTrendCount})
      </button>

      {/* 🔹 ALL / GAINERS / LOSERS */}
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => setFilter(opt)}
          style={{
            marginRight: 8,
            padding: "6px 25px",
            borderRadius: 20,
            border: "none",
            cursor: "pointer",
            background: filter === opt ? "#111827" : "#e5e7eb",
            color: filter === opt ? "#fff" : "#111",
            fontWeight: 600,
            fontSize: 25
          }}
        >
          {opt.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
