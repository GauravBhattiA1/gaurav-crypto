export default function TimeframeSelector({ tf, setTf }) {
  const timeframes = [
    { label: "1m", value: "1m" },
    { label: "5m", value: "5m" },
    { label: "15m", value: "15m" },
    { label: "30m", value: "30m" },
    { label: "1h", value: "1h" },
    { label: "4h", value: "4h" },
    { label: "8h", value: "8h" },
    { label: "1d", value: "1d" },
    { label: "1w", value: "1w" },

    // 🔥 CUSTOM (Rolling 30 days)
    { label: "1M", value: "custom-43200" },
    { label: "3M", value: "custom-129600" }, // 90 days
    { label: "6M", value: "custom-259200" }, // 180 days
  ];

  return (
    <div className="timeframes">
      {timeframes.map(t => (
        <button
          key={t.value}
          onClick={() => setTf(t.value)}
          className={tf === t.value ? "tf-btn active" : "tf-btn"}
          title={t.label === "1M" ? "Rolling 30 days" : ""}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
