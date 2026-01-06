// ✅ ADD THIS AT VERY TOP (before component)
const formatVolume = (v) => {
  if (!v) return "-";
  if (v >= 1e9) return (v / 1e9).toFixed(1) + "B";
  if (v >= 1e6) return (v / 1e6).toFixed(1) + "M";
  if (v >= 1e3) return (v / 1e3).toFixed(1) + "K";
  return v.toFixed(0);
};

const openTradingView = (symbol) => {
  const tvSymbol = `BINANCE:${symbol}`;
  const url = `https://www.tradingview.com/chart/?symbol=${tvSymbol}`;
  window.open(url, "_blank");
};
  

export default function TopLosers({ pairs }) {
  const top = pairs
    .filter(p => p.percent < 0)
    .slice(0, 5);

  return (
    <div className="side-card" >
      <h3 className="side-title loss">📉 Top Losers</h3>

      {top.map(p => (
        <div
          key={p.symbol}
          className="side-row loss" onDoubleClick={() =>  openTradingView(p.symbol)}       
        >
          <div>
            <div className="symbol">{p.symbol}</div>
            <div className="volume">Vol: {formatVolume(p.volume)}</div>
          </div>

          <div className="percent">
            {p.percent.toFixed(2)}%
          </div>
        </div>
      ))}
    </div>
  );
}


/*
export default function TopLosers({ pairs }) {
  const top = pairs.filter(p => p.percent < 0).slice(0, 5);

  return (
    <div className="side-card">
      <h3 className="side-title loss">📉 Top Losers</h3>

      {top.map(p => (
        <div
          key={p.symbol}
          className="side-row loss"
          onClick={() =>
            window.open(
              `https://www.tradingview.com/chart/?symbol=BINANCE:${p.symbol}`,
              "_blank"
            )
          }
        >
          <span className="symbol">{p.symbol}</span>
          <span className="percent">{p.percent.toFixed(2)}%</span>
        </div>
      ))}
    </div>
  );
} */
