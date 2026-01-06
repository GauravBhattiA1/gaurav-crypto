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
      "wss://stream.binance.com:9443/ws/!ticker@arr"
    );
    wsRef.current = ws;

    ws.onmessage = (event) => {
      latestTickers.current = JSON.parse(event.data);
    };

    ws.onerror = () => {};
    ws.onopen = () => {};

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
      if (!latestTickers.current.length) return;

      const usdt = latestTickers.current
        .filter(d => d.s.endsWith("USDT"))
        .slice(0, 50);

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
