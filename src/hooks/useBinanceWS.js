import { useEffect, useRef, useState } from "react";
import { fetchCandleOpen } from "../utils/fetchCandleOpen";
import { fetchCustomOpen } from "../utils/fetchCustomOpen";

export default function useBinanceWS(timeframe) {
  const [pairs, setPairs] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);
  const wsRef = useRef(null);
  const latestTickers = useRef([]);
  const openPrices = useRef({}); // symbol_timeframe -> open
  const historyRef = useRef({});
  const priceHistoryRef = useRef({}); // symbol -> price[]
 
/* -----------------------------
   LOAD TICKERS VIA REST API
------------------------------*/
useEffect(() => {
  const loadTickers = async () => {
    try {
      const res = await fetch(
        "https://api.binance.com/api/v3/ticker/24hr"
      );

      const data = await res.json();

      console.log("Loaded tickers:", data.length);

      latestTickers.current = data;
    } catch (err) {
      console.error("Ticker Fetch Error:", err);
    }
  };

  loadTickers();

  const timer = setInterval(loadTickers, 5000);

  return () => clearInterval(timer);
}, []);

  
  /* -----------------------------
     RESET OPEN CACHE ON TF CHANGE
  ------------------------------*/
  useEffect(() => {
    openPrices.current = {};
  }, [timeframe]);

  /* -----------------------------
     CREATE WEBSOCKET ONCE
  ------------------------------*/
  useEffect(() => {
    if (wsRef.current) return; // 🔒 singleton WS

    const ws = new WebSocket(
      "wss://fstream.binance.com/ws/!ticker@arr"
    );
    wsRef.current = ws;

    ws.onopen = () => {
  console.log("WS Connected");
};

ws.onopen = () => {
  console.log("WS Connected");
};

ws.onmessage = (event) => {
  console.log("MESSAGE RECEIVED", event.data);

  try {
    latestTickers.current = JSON.parse(event.data);
  } catch (err) {
    console.error("PARSE ERROR", err);
  }
};

ws.onerror = (err) => {
  console.error("WS ERROR", err);
};

ws.onclose = (e) => {
  console.log("WS CLOSED", e);
};

    return () => {
      try {
        ws.close(1000, "cleanup");
      } catch {}
    };
  }, []);

  /* -----------------------------
     CALCULATION LOOP (TIMEFRAME)
  ------------------------------*/
  useEffect(() => {
    let cancelled = false;

    async function calculate() {
      console.log("Tickers Count:", latestTickers.current.length);

if (!latestTickers.current.length) {
  return;
}

      const usdt = latestTickers.current
  .filter(d => typeof d?.s === "string")
  .filter(d => d.s.endsWith("USDT"))
  .slice(0, 50)

      // 1️⃣ FETCH MISSING OPENS
      await Promise.all(
        usdt.map(async d => {
          const key = `${d.s}_${timeframe}`;
          if (openPrices.current[key]) return;

          let open;
          if (timeframe.startsWith("custom")) {
            const minutes = parseInt(timeframe.split("-")[1]);
            open = await fetchCustomOpen(d.s, minutes);
          } else {
            open = await fetchCandleOpen(d.s, timeframe);
          }
          openPrices.current[key] = open;
        })
      );

      if (cancelled) return;

      // 2️⃣ CALCULATE %
      const calculated = usdt.map(d => {
      const open = openPrices.current[`${d.s}_${timeframe}`];
      const price = +d.c;

      // 🔥 PRICE HISTORY FOR SMA
      const prevPrices = priceHistoryRef.current[d.s] || [];
      const updatedPrices = [...prevPrices.slice(-201), price];
      priceHistoryRef.current[d.s] = updatedPrices;

      // ================= SMA CALCULATION =================
const calcSMA = (arr, len) => {
  if (arr.length < len) return null;
  return arr.slice(-len).reduce((a, b) => a + b, 0) / len;
};

const sma50Current = calcSMA(updatedPrices, 50);
const sma200Current = calcSMA(updatedPrices, 200);

const sma50Prev =
  updatedPrices.length >= 51
    ? calcSMA(updatedPrices.slice(0, -1), 50)
    : null;

const sma200Prev =
  updatedPrices.length >= 201
    ? calcSMA(updatedPrices.slice(0, -1), 200)
    : null;

// ================= TIMEFRAME MODE =================
const isHTF =
  timeframe === "1d" ||
  timeframe === "1w" ||
  timeframe.startsWith("custom");

const isMidTF =
  timeframe === "5m" ||
  timeframe === "15m" ||
  timeframe === "30m";

const isScalpTF = timeframe === "1m";

// ================= FINAL COLOR LOGIC =================

      // 🔹 SMA 50
      const sma50Rising = isHTF
        ? sma50Current !== null &&
          sma200Current !== null &&
          sma50Current > sma200Current // structure
        : isMidTF
        ? sma50Current !== null && price > sma50Current // position
        : sma50Current !== null &&
          sma50Prev !== null &&
          sma50Current > sma50Prev; // slope

      // 🔹 SMA 200
      const sma200Rising = isHTF
        ? sma200Current !== null &&
          price > sma200Current // structure
        : isMidTF
        ? sma200Current !== null && price > sma200Current // position
        : sma200Current !== null &&
          sma200Prev !== null &&
          sma200Current > sma200Prev; // slope


              // ================= MA CROSS DETECTION =================

      // Golden Cross (50 crosses ABOVE 200)
      const goldenCross =
        sma50Prev !== null &&
        sma200Prev !== null &&
        sma50Current !== null &&
        sma200Current !== null &&
        sma50Prev <= sma200Prev &&
        sma50Current > sma200Current;

      // Death Cross (50 crosses BELOW 200)
      const deathCross =
        sma50Prev !== null &&
        sma200Prev !== null &&
        sma50Current !== null &&
        sma200Current !== null &&
        sma50Prev >= sma200Prev &&
        sma50Current < sma200Current;


      const percent = open ? ((price - open) / open) * 100 : 0;

      // 🔥 MINI SPARKLINE HISTORY (ADD HERE)
      const prev = historyRef.current[d.s] || [];
      const updated = [...prev.slice(-9), percent];
      historyRef.current[d.s] = updated;

      return {
        symbol: d.s,
        price,
        percent,
        volume: +d.v,

        sma50Rising,
        sma200Rising,

        goldenCross,
        deathCross,


        // 🔥 ATTACH SPARKLINE POINTS
        sparkline: updated.map(
          (v, i) => `${i * 6},${20 - Math.max(-10, Math.min(10, v))}`
        )
      };
    });

      // 🔥 Sort by absolute movement (top movers up & down)
      calculated.sort(
      (a, b) => Math.abs(b.percent) - Math.abs(a.percent)
      );

      // 🔥 Show only Top N movers (recommended: 30–50)
      console.log("USDT Count:", usdt.length);
console.log("Calculated Count:", calculated.length);
console.log("First Item:", calculated[0]);
      setPairs(calculated.slice(0, 50));
      setLastUpdate(new Date());
      
    }

    const interval = setInterval(calculate, 1000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [timeframe]);

  return { pairs, lastUpdate };
}
