import { useCallback, useEffect, useRef, useState } from "react";

// Sincroniza el estado del juego entre Effie y Mario a través de /api/state.
// Cada cambio lleva un número de secuencia (s) y una hora (t); gana el más reciente.
// Si la API no está disponible (por ejemplo con `npm run dev`), funciona solo en este dispositivo.

const FAST = 1500;
const SLOW = 6000;

const newer = (a, b) => a.s > b.s || (a.s === b.s && a.t > b.t);

export function useSharedGame({ initial, sala, role, clean }) {
  const [game, setGame] = useState(initial);
  const gameRef = useRef(initial);
  const [mode, setMode] = useState("loading"); // loading | live | local
  const [online, setOnline] = useState({ effie: false, mario: false });
  const roleRef = useRef(role);
  roleRef.current = role;

  const adopt = useCallback(raw => {
    const g = clean(raw);
    if (g && newer(g, gameRef.current)) {
      gameRef.current = g;
      setGame(g);
    }
  }, [clean]);

  // Consulta periódica
  useEffect(() => {
    let alive = true;
    let timer = null;
    async function tick() {
      try {
        const q = new URLSearchParams({ sala, role: roleRef.current || "" });
        const r = await fetch(`/api/state?${q}`, { cache: "no-store" });
        if (!r.ok) throw new Error(String(r.status));
        const data = await r.json();
        if (!alive) return;
        setMode("live");
        setOnline(data.online || { effie: false, mario: false });
        if (data.state) adopt(data.state);
      } catch {
        if (alive) setMode("local");
      }
      if (alive) {
        const visible = typeof document === "undefined" || document.visibilityState === "visible";
        timer = setTimeout(tick, visible ? FAST : SLOW);
      }
    }
    tick();
    return () => { alive = false; clearTimeout(timer); };
  }, [sala, adopt]);

  const commit = useCallback(patch => {
    const cur = gameRef.current;
    const next = { ...cur, ...patch, s: cur.s + 1, t: Date.now(), by: roleRef.current || "" };
    gameRef.current = next;
    setGame(next);
    fetch("/api/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sala, role: roleRef.current || "", state: next })
    })
      .then(r => (r.ok ? r.json() : null))
      .then(data => { if (data && data.state) adopt(data.state); })
      .catch(() => {});
  }, [sala, adopt]);

  return { game, commit, mode, online };
}
