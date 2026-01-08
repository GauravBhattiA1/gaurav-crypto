import { useState } from "react";
import useBinanceWS from "./hooks/useBinanceWS";
import TimeframeSelector from "./components/TimeframeSelector";
import StatsCards from "./components/StatsCards";
import MarketFilter from "./components/MarketFilter";
import TopGainers from "./components/TopGainers";
import TopLosers from "./components/TopLosers";
import MACrossList from "./components/MACrossList";
import "./App.css";

export default function App() {
  const [tf, setTf] = useState("15m");
  const [filter, setFilter] = useState("all");
  const [favorites, setFavorites] = useState([]);
  const [masterTrend, setMasterTrend] = useState(false);
  const { pairs, lastUpdate } = useBinanceWS(tf);

  // ================= MA CROSS LISTS =================

// 🟢 50 MA crosses ABOVE 200 MA
const goldenCrossCoins = pairs.filter(p => p.goldenCross);

// 🔴 50 MA crosses BELOW 200 MA
const deathCrossCoins = pairs.filter(p => p.deathCross);

  

  const openTradingView = (symbol) => {
  const tvSymbol = `BINANCE:${symbol}`;
  const url = `https://www.tradingview.com/chart/?symbol=${tvSymbol}`;
  window.open(url, "_blank");
  };
  
   const passesMasterFilter = (p) => {
  if (!masterTrend) return true;
  return p.sma50Rising && p.sma200Rising;
  };
  
  const filteredPairs = pairs
  .filter(p => {
    if (filter === "gainers") return p.percent > 0;
    if (filter === "losers") return p.percent < 0;
    return true;
  })
  .filter(passesMasterFilter);

  const strongTrendCount = filteredPairs.filter(
  p => p.sma50Rising && p.sma200Rising
  ).length;

  const toggleFavorite = (symbol) => {
  setFavorites(f =>
    f.includes(symbol)
      ? f.filter(s => s !== symbol)
      : [...f, symbol]
  );
  };

  return (
    <div className="app">

      {/* HEADER */}
      <header className="header">
        <h1>Gaurav Crypto Analytics</h1>
        <TimeframeSelector tf={tf} setTf={setTf} /> 
         <MarketFilter
          filter={filter}
          setFilter={setFilter}
          masterTrend={masterTrend}
          setMasterTrend={setMasterTrend}
          strongTrendCount={strongTrendCount}
        />
      </header>
      <div className="last-update">
      ⏱ Last update: {lastUpdate ? lastUpdate.toLocaleTimeString() : "—"}
    </div>

      {/* STATS */}
      <StatsCards pairs={pairs} />

      {/* MAIN DASHBOARD LAYOUT */}
      <div className="dashboard-layout">

        {/* LEFT SIDE */}
        <div className="main-section">

          {/* FILTER 
          <MarketFilter filter={filter} setFilter={setFilter} masterTrend={masterTrend} setMasterTrend={setMasterTrend} /> */}

          {/* GRID */}
          <div className="pairs-grid">
            {filteredPairs.map(p => (
              <div
                key={p.symbol}
                className={`pair-card 
                  ${p.percent >= 0 ? "up" : "down"} 
                  ${p.volume > 5_000_000 ? "volume-spike" : ""}`}
                onDoubleClick={() =>  openTradingView(p.symbol)}
                style={{ cursor: "pointer" }}
              >
                <div className="symbol">
                  {p.symbol}
                  <span
                    className={`star ${favorites.includes(p.symbol) ? "active" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(p.symbol);
                    }}
                  >
                    ★
                  </span>
                </div>
                <div className="price">${p.price.toFixed(6)}</div>
                <div className="percent">
                {p.percent.toFixed(4)}%
            </div>
              {/* 🔥 MINI SPARKLINE */}
              <svg width="60" height="20">
                <polyline
                  fill="none"
                  stroke={p.percent >= 0 ? "green" : "red"}
                  strokeWidth="2"
                  points={p.sparkline?.join(" ") || ""}
                />
              </svg>
              </div>
            ))}
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="right-panel">
          <TopGainers pairs={pairs} />
          <TopLosers pairs={pairs} />       
          <MACrossList
            title="Golden Cross"
            coins={goldenCrossCoins}
            type="golden"
          />

          <MACrossList
            title="Death Cross"
            coins={deathCrossCoins}
            type="death"
          />
        </div>
         
      </div>
    </div>
  );
}
