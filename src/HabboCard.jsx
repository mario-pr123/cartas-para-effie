import { useEffect, useRef, useState } from "react";
import { HABBO_NAME } from "./data.jsx";

// Tarjeta estilo habbodex: avatar oficial dibujado por Habbo a partir de su look,
// misión, estado y placas. Se actualiza sola cada 20 segundos.
const REFRESH = 20000;

const ACTIONS = [
  { id: "std", label: "De pie" },
  { id: "wav", label: "Saludando" },
  { id: "sit", label: "Sentada" }
];

const fmtDate = iso => {
  if (!iso) return null;
  const d = new Date(iso);
  return isNaN(d) ? null : d.toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" });
};
const fmtAgo = iso => {
  if (!iso) return null;
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (!Number.isFinite(m)) return null;
  if (m < 1) return "hace un momento";
  if (m < 60) return `hace ${m} min`;
  const h = Math.round(m / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.round(h / 24);
  return `hace ${d} día${d === 1 ? "" : "s"}`;
};

// Con el look (figure) si la API respondió; si no, por nombre directo al hotel.
function avatarUrl(hotel, who, dir, action) {
  const q = new URLSearchParams({
    ...who, direction: String(dir), head_direction: String(dir),
    action, gesture: "sml", size: "l"
  });
  return `https://www.habbo.${hotel}/habbo-imaging/avatarimage?${q}`;
}
const badgeUrl = code => `https://images.habbo.com/c_images/album1584/${encodeURIComponent(code)}.gif`;

export default function HabboCard() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ok | error
  const [dir, setDir] = useState(2);
  const [action, setAction] = useState("std");
  const [changed, setChanged] = useState(false);
  const [, setNow] = useState(0);
  const prev = useRef(null);

  useEffect(() => {
    let alive = true;
    let timer = null;
    async function load() {
      try {
        const r = await fetch("/api/habbo", { cache: "no-store" });
        if (!r.ok) throw new Error(String(r.status));
        const d = await r.json();
        if (!alive) return;
        if (prev.current && (prev.current.figure !== d.figure || prev.current.motto !== d.motto)) {
          setChanged(true);
          setTimeout(() => alive && setChanged(false), 2500);
        }
        prev.current = d;
        setData(d);
        setStatus("ok");
      } catch {
        if (alive && !prev.current) setStatus("error");
      }
      if (alive) timer = setTimeout(load, document.visibilityState === "visible" ? REFRESH : REFRESH * 3);
    }
    load();
    const tick = setInterval(() => setNow(n => n + 1), 10000);
    return () => { alive = false; clearTimeout(timer); clearInterval(tick); };
  }, []);

  const d = data;
  const name = d ? d.name : HABBO_NAME;
  const [imgOk, setImgOk] = useState(true);
  const src = d && d.figure
    ? avatarUrl(d.hotel, { figure: d.figure }, dir, action)
    : avatarUrl("es", { user: HABBO_NAME }, dir, action);
  useEffect(() => { setImgOk(true); }, [src]);

  return (
    <section className="habbo" aria-label={`Perfil de Habbo de ${name}`}>
      <div className="habbo-top">
        <span className="px">Tu keko, en vivo</span>
        {d && <span className="px muted-px">habbo.{d.hotel}</span>}
      </div>

      <div className={"stage-room" + (changed ? " flash" : "")}>
        {d && d.motto && <p className="bubble">{d.motto}</p>}
        <div className="avatar-wrap">
          {imgOk ? (
            <img
              className="avatar"
              src={src}
              alt={`Tu keko, ${name}, en Habbo`}
              width="128" height="220"
              onError={() => setImgOk(false)}
            />
          ) : (
            <div className="avatar-ph" aria-hidden="true" />
          )}
        </div>
        <div className="nameplate">
          <span className="habbo-name">{name}</span>
          {d && (
            <span className={"hb-status " + (d.online ? "on" : "")}>
              <span className="dot" /> {d.online ? "En el hotel ahora" : "Fuera del hotel"}
            </span>
          )}
        </div>
      </div>

      {imgOk && (
        <div className="avatar-controls">
          <div className="rotate">
            <button className="small-btn" aria-label="Girar a la izquierda" onClick={() => setDir(v => (v + 1) % 8)}>↺</button>
            <button className="small-btn" aria-label="Girar a la derecha" onClick={() => setDir(v => (v + 7) % 8)}>↻</button>
          </div>
          <div className="levels" role="group" aria-label="Pose">
            {ACTIONS.map(a => (
              <button key={a.id} aria-pressed={action === a.id ? "true" : "false"} onClick={() => setAction(a.id)}>{a.label}</button>
            ))}
          </div>
        </div>
      )}

      {status === "loading" && <p className="habbo-msg">Buscándote en el hotel…</p>}
      {status === "error" && (
        <p className="habbo-msg">
          Ahorita no pude leer tu misión ni tus placas. Lo vuelvo a intentar solo en unos segundos.
        </p>
      )}

      {d && (
        <div className="habbo-body">
          <dl className="hb-stats">
            {fmtDate(d.memberSince) && <div><dt className="px">En Habbo desde</dt><dd>{fmtDate(d.memberSince)}</dd></div>}
            {!d.online && fmtAgo(d.lastAccess) && <div><dt className="px">Última vez</dt><dd>{fmtAgo(d.lastAccess)}</dd></div>}
            {d.level != null && <div><dt className="px">Nivel</dt><dd>{d.level}</dd></div>}
            {d.starGems != null && <div><dt className="px">Gemas</dt><dd>{d.starGems}</dd></div>}
            {d.counts && d.counts.rooms != null && <div><dt className="px">Salas</dt><dd>{d.counts.rooms}</dd></div>}
            {d.counts && d.counts.badges != null && <div><dt className="px">Placas</dt><dd>{d.counts.badges}</dd></div>}
          </dl>

          {d.badges.length > 0 && (
            <div className="hb-section">
              <h3>Tus placas a la vista</h3>
              <ul className="badge-row">
                {d.badges.map((b, i) => (
                  <li key={b.code + i} title={b.description || b.name}>
                    <img src={badgeUrl(b.code)} alt="" width="40" height="40" loading="lazy"
                      onError={e => { e.currentTarget.style.visibility = "hidden"; }} />
                    <span>{b.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {d.rooms.length > 0 && (
            <div className="hb-section">
              <h3>Tus salas</h3>
              <ul className="rooms">
                {d.rooms.map((r, i) => (
                  <li key={i}><b>{r.name}</b>{r.description && <span>{r.description}</span>}</li>
                ))}
              </ul>
            </div>
          )}

          <p className="hb-foot">Se actualiza sola · leído {fmtAgo(d.fetchedAt) || "hace un momento"}</p>
        </div>
      )}
    </section>
  );
}
