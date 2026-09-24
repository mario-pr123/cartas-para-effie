import { useCallback, useMemo, useState, useEffect } from "react";
import { Q, DECKS, LEVELS, FICHA, NICKS, PLAN, HIM, MET } from "./data.jsx";
import { useSharedGame } from "./useSharedGame.js";
import HabboCard from "./HabboCard.jsx";

const ALL_DECKS = Object.keys(DECKS);
const ALL_LEVELS = Object.keys(LEVELS);
const INITIAL = { s: 0, t: 0, c: 0, p: [], d: ALL_DECKS, l: ALL_LEVELS, f: 1, sv: [], st: 0, by: "" };

const ids = a => (Array.isArray(a) ? a.filter(x => Number.isInteger(x) && x >= 0 && x < Q.length).slice(0, 300) : []);
function cleanState(g) {
  if (!g || typeof g !== "object") return null;
  const s = Number(g.s), t = Number(g.t);
  if (!Number.isFinite(s) || !Number.isFinite(t)) return null;
  const d = Array.isArray(g.d) ? g.d.filter(x => ALL_DECKS.includes(x)) : [];
  const l = Array.isArray(g.l) ? g.l.filter(x => ALL_LEVELS.includes(x)) : [];
  return {
    s, t,
    c: Number.isInteger(g.c) && g.c >= 0 && g.c < Q.length ? g.c : null,
    p: ids(g.p),
    d: d.length ? d : ALL_DECKS,
    l: l.length ? l : ALL_LEVELS,
    f: g.f ? 1 : 0,
    sv: ids(g.sv),
    st: Number.isInteger(g.st) && g.st >= 0 && g.st < PLAN.length ? g.st : 0,
    by: g.by === "effie" || g.by === "mario" ? g.by : ""
  };
}

const store = {
  get(k) { try { return localStorage.getItem(k) || ""; } catch { return ""; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* sin almacenamiento */ } }
};

function getSala() {
  try {
    const v = new URLSearchParams(window.location.search).get("sala");
    if (v && /^[a-z0-9-]{3,48}$/i.test(v)) return v.toLowerCase();
  } catch { /* */ }
  return "effie-y-mario";
}

const pickRandom = list => (list.length ? list[Math.floor(Math.random() * list.length)] : null);

function Heart({ filled }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" shapeRendering="crispEdges">
      <path fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5"
        d="M3 2h3v1h1v1h2V3h1V2h3v1h1v5h-1v1h-1v1h-1v1h-1v1H9v1H7v-1H6v-1H5v-1H4V9H3V8H2V3h1z" />
    </svg>
  );
}

export default function App() {
  const sala = useMemo(getSala, []);
  const [role, setRole] = useState(() => store.get("cartas-role"));
  const [jumpVal, setJumpVal] = useState("");
  useEffect(() => { store.set("cartas-role", role || ""); }, [role]);

  const clean = useCallback(cleanState, []);
  const { game: g, commit, mode, online } = useSharedGame({ initial: INITIAL, sala, role, clean });

  const effieOn = role === "effie" || online.effie;
  const marioOn = role === "mario" || online.mario;
  const other = role === "effie" ? online.mario : role === "mario" ? online.effie : false;

  const pool = useMemo(() => Q.filter(q => g.d.includes(q.deck) && g.l.includes(q.level)), [g.d, g.l]);
  const current = g.c !== null ? Q[g.c] : null;
  const remaining = pool.filter(q => !g.p.includes(q.id) && q.id !== g.c);
  const done = pool.filter(q => g.p.includes(q.id)).length + (current ? 1 : 0);
  const days = Math.max(1, Math.round((new Date().setHours(0, 0, 0, 0) - MET) / 86400000));

  function draw() {
    const played = current ? [...g.p.filter(x => x !== current.id), current.id] : g.p;
    const next = pickRandom(pool.filter(q => !played.includes(q.id)));
    commit({ p: played, c: next ? next.id : null, f: g.f ? 0 : 1 });
  }
  function restart() {
    const next = pickRandom(pool);
    commit({ p: [], c: next ? next.id : null });
  }
  function jumpTo(id) {
    if (id === null || id < 0 || id >= Q.length) return;
    const played = current && current.id !== id ? [...g.p.filter(x => x !== current.id), current.id] : g.p;
    commit({ p: played.filter(x => x !== id), c: id, st: PLAN.length - 1 });
    try { document.getElementById("mesa")?.scrollIntoView({ behavior: "smooth", block: "start" }); } catch { /* */ }
  }
  function toggleDeck(k) {
    const d = g.d.includes(k) ? (g.d.length > 1 ? g.d.filter(x => x !== k) : g.d) : [...g.d, k];
    commit({ d });
  }
  function toggleLevel(k) {
    const l = g.l.includes(k) ? (g.l.length > 1 ? g.l.filter(x => x !== k) : g.l) : [...g.l, k];
    commit({ l });
  }
  function toggleSave(id) {
    commit({ sv: g.sv.includes(id) ? g.sv.filter(x => x !== id) : [...g.sv, id] });
  }
  function submitJump(e) {
    e.preventDefault();
    const n = parseInt(jumpVal, 10);
    if (n >= 1 && n <= Q.length) { jumpTo(n - 1); setJumpVal(""); }
  }

  function describe(q) {
    const first = g.f ? "Effie" : HIM;
    const second = g.f ? HIM : "Effie";
    switch (q.type) {
      case "effie":
        return { kind: "Para Effie", who: <>Responde <b>Effie</b></>, order: `Si aplica, después responde ${HIM}.` };
      case "mario":
        return { kind: "Para Mario", who: <>Responde <b>{HIM}</b></>, order: "Si aplica, después responde Effie." };
      case "adivinaE":
        return { kind: "Adivina", who: <>Adivina <b>{HIM}</b></>, order: "Luego Effie dice la respuesta real.", hint: `${HIM} responde en voz alta; Effie confirma o corrige.` };
      case "adivinaM":
        return { kind: "Adivina", who: <>Adivina <b>Effie</b></>, order: `Luego ${HIM} dice la respuesta real.`, hint: `Effie responde en voz alta; ${HIM} confirma o corrige.` };
      case "reto":
        return { kind: "Mini reto", who: <>Juegan <b>los dos</b></>, order: `Empieza ${first}.` };
      default:
        return { kind: "Los dos", who: <>Empieza <b>{first}</b></>, order: `Después responde ${second}.` };
    }
  }

  const deck = current ? DECKS[current.deck] : null;
  const info = current ? describe(current) : null;
  const isSaved = current && g.sv.includes(current.id);
  const drawnBy = g.by === "effie" ? "Effie" : g.by === "mario" ? HIM : "";

  const statusText =
    mode === "live"
      ? (other ? "Estamos conectados: vemos lo mismo en vivo."
        : role === "effie" ? `Esperando a ${HIM}…` : role === "mario" ? "Esperando a Effie…" : "Esperando al otro…")
    : mode === "loading" ? "Conectando…"
    : "Solo en este dispositivo. Dime el número de carta y vamos a la par.";

  return (
    <div className="app">
      <header>
        <div className="kicker">
          <span className="tag px">Nuestra primera cita</span>
          <span className="px">Día {days} desde Habbo</span>
        </div>
        <h1>Cartas para <em>Effie</em></h1>
        <p className="lede">
          Effie, mi amor, hace un mes te encontré en Habbo y desde entonces no hemos dejado de hablar. Hice esta página para conocerte un poquito más en nuestra primera cita. Sacamos una carta a la vez y los dos vemos la misma. Si alguna no te gusta, la pasamos sin explicar nada.
        </p>

        <div className="sync" role="status">
          <div className="people">
            <span className={"person " + (effieOn ? "on" : "off")}><span className="dot" />Effie{role === "effie" ? " (tú)" : ""}</span>
            <span className={"person " + (marioOn ? "on" : "off")}><span className="dot" />{HIM}{role === "mario" ? " (tú)" : ""}</span>
          </div>
          <span className="status">{statusText}</span>
        </div>

        {!role ? (
          <div className="whoami">
            <p>¿Quién eres?</p>
            <div className="opts">
              <button className="small-btn" onClick={() => setRole("effie")}>Soy Effie</button>
              <button className="small-btn" onClick={() => setRole("mario")}>Soy {HIM}</button>
            </div>
          </div>
        ) : (
          <p className="me">
            Estás como <b>{role === "effie" ? "Effie" : HIM}</b>.{" "}
            <button className="link-btn" onClick={() => setRole("")}>Cambiar</button>
          </p>
        )}

        <ol className="plan" aria-label="Plan de la cita">
          {PLAN.map((p, i) => (
            <li key={p.title} className={i === g.st ? "now" : i < g.st ? "past" : ""}>
              <button onClick={() => commit({ st: i })} aria-current={i === g.st ? "step" : undefined}>
                <span className="px">{i === g.st ? "Ahora" : `Paso ${i + 1}`}</span>
                <span className="pt">{p.title}</span>
                <span className="ps">{p.sub}</span>
              </button>
            </li>
          ))}
        </ol>
      </header>

      <div className="column">
        <main className="main">
          <section className="stage" id="mesa" aria-live="polite">
            {current ? (
              <>
                <div className="turn">
                  <span className="who">{info.who}</span>
                  <span className="count px">Carta #{current.id + 1} · {done} de {pool.length}</span>
                </div>
                <article className="card" key={current.id} style={{ "--c": deck.color }}>
                  <div className="card-top">
                    <span className="deckname px">{deck.name}</span>
                    <span className="meta">
                      <span className="pill kind px">{info.kind}</span>
                      <span className="pill px">{LEVELS[current.level]}</span>
                    </span>
                  </div>
                  <p className="q">{current.text}</p>
                  {info.hint && <p className="hint">{info.hint}</p>}
                  <div className="card-foot">
                    <span className="order">
                      {info.order}
                      {drawnBy && <><br /><span className="drawnby">{drawnBy} sacó esta carta</span></>}
                    </span>
                    <button className="icon-btn" aria-pressed={isSaved ? "true" : "false"} onClick={() => toggleSave(current.id)}>
                      <Heart filled={isSaved} /> {isSaved ? "Guardada" : "Para después"}
                    </button>
                  </div>
                </article>
                <div className="actions">
                  <button className="btn ghost" onClick={draw}>Paso esta</button>
                  <button className="btn primary" onClick={draw}>Siguiente carta</button>
                </div>
              </>
            ) : (
              <div className="empty">
                <h2>Se acabó el mazo</h2>
                <p>Ya jugamos todas las cartas de estos mazos. Podemos barajar otra vez o activar otros mazos y niveles.</p>
                <button className="btn primary" onClick={restart}>Barajar otra vez</button>
              </div>
            )}
            <div className="under">
              <p className="note">{remaining.length} cartas por salir. Tus respuestas no se guardan en ningún lado.</p>
              <form className="jump" onSubmit={submitJump}>
                <label htmlFor="jump-n">Ir a la carta #</label>
                <input id="jump-n" type="number" inputMode="numeric" min="1" max={Q.length}
                  value={jumpVal} onChange={e => setJumpVal(e.target.value)} />
                <button className="small-btn" type="submit">Ir</button>
              </form>
            </div>
          </section>

          <section className="filters">
            <h2 className="block-title">Mazos</h2>
            <div className="decks">
              {ALL_DECKS.map(k => (
                <button key={k} className="chip" style={{ "--c": DECKS[k].color }}
                  aria-pressed={g.d.includes(k) ? "true" : "false"} onClick={() => toggleDeck(k)}>
                  {DECKS[k].name} <span className="n">{Q.filter(q => q.deck === k).length}</span>
                </button>
              ))}
            </div>
            <div>
              <p className="section-label px">Profundidad</p>
              <div className="levels">
                {ALL_LEVELS.map(k => (
                  <button key={k} aria-pressed={g.l.includes(k) ? "true" : "false"} onClick={() => toggleLevel(k)}>{LEVELS[k]}</button>
                ))}
              </div>
            </div>
          </section>

          {g.sv.length > 0 && (
            <section className="saved">
              <h2 className="block-title">Para nuestra próxima llamada</h2>
              <p className="muted">Las que dejamos para después.</p>
              <ul>
                {g.sv.map(id => (
                  <li key={id} style={{ "--c": DECKS[Q[id].deck].color }}>
                    <span>{Q[id].text}</span>
                    <button className="link-btn" onClick={() => jumpTo(id)}>Jugar</button>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </main>

        <div className="extras">
          <section className="ficha" aria-label="Lo que ya sé de ti">
            <div className="ficha-head">
              <span className="px">Lo que ya sé de ti</span>
              <p className="ficha-name">Effie <em>{"\u2649\uFE0E"}</em></p>
            </div>
            <div className="stats">
              <div className="stat"><span className="v">29</span><span className="k">años</span></div>
              <div className="stat"><span className="v">1,60</span><span className="k">metros</span></div>
              <div className="stat"><span className="v">MX</span><span className="k">vive en</span></div>
              <div className="stat"><span className="v">{days}</span><span className="k">días</span></div>
            </div>
            <div className="ficha-body">
              {FICHA.map(gr => (
                <div className="group" key={gr.title}>
                  <h3>{gr.title}</h3>
                  <ul className="traits">
                    {gr.items.map((it, i) => (
                      <li key={i}>
                        <span className="ico" style={{ "--c": it[1] }} aria-hidden="true">{it[0]}</span>
                        <span>{it[2]}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="group">
                <h3>Así nos decimos</h3>
                <div className="nicks">
                  {NICKS.map(n => <span key={n} className="nick">{n}</span>)}
                  <span className="nick angry">Andreé <small>(cuando te enojas)</small></span>
                </div>
              </div>
            </div>
            <p className="ficha-foot">Todo lo que sé de ti lo aprendí escuchándote.</p>
          </section>

          <HabboCard />
        </div>
      </div>

      <footer>
        <p>Hecho con mucho cariño por tu bobito, {HIM}. Para mi niña, en nuestra primera cita.</p>
        <p className="sig">Te quiero, Effie.</p>
      </footer>
    </div>
  );
}
