export default function MarketFilter({ filter, setFilter }) {
  const options = ["all", "gainers", "losers"];

  return (
    <div style={{ margin: "15px 0" }}>
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
            background:
            filter === opt ? "#111827" : "#e5e7eb",
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
