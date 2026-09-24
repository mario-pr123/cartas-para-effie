import { useEffect, useState } from "react";
import { HABBO_NAME } from "./data.jsx";

const fmt = iso => {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d)) return null;
  return d.toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" });
};

export default function HabboCard() {
  const [state, setState] = useState({ status: "loading", data: null });

  useEffect(() => {
    let alive = true;
    fetch("/api/habbo")
      .then(r => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(data => alive && setState({ status: "ok", data }))
      .catch(() => alive && setState({ status: "error", data: null }));
    return () => { alive = false; };
  }, []);

  const d = state.data;

  return (
    <section className="habbo" aria-label="Perfil de Habbo">
      <div className="habbo-head">
        <span className="px">Perfil público · {d ? d.hotel : "Habbo"}</span>
        <p className="habbo-name">{d ? d.name : HABBO_NAME}</p>
        {d && (
          <span className={"hb-status " + (d.online ? "on" : "")}>
            <span className="dot" /> {d.online ? "En el hotel ahora" : "Fuera del hotel"}
          </span>
        )}
      </div>

      {state.status === "loading" && <p className="habbo-msg">Buscando a {HABBO_NAME} en el hotel…</p>}

      {state.status === "error" && (
        <p className="habbo-msg">
          No pude leer el perfil de {HABBO_NAME} en este momento. Esta parte funciona cuando la app está publicada en Vercel.
        </p>
      )}

      {d && (
        <div className="habbo-body">
          {d.motto && <blockquote className="motto">“{d.motto}”</blockquote>}

          <dl className="hb-facts">
            {fmt(d.memberSince) && (<><dt className="px">En Habbo desde</dt><dd>{fmt(d.memberSince)}</dd></>)}
            {d.level != null && (<><dt className="px">Nivel</dt><dd>{d.level}</dd></>)}
          </dl>

          {d.look.length > 0 && (
            <div className="look">
              <h3>Su look de hoy</h3>
              <ul>
                {d.look.map((p, i) => (
                  <li key={p.type + i}>
                    <span>{p.label}</span>
                    <span className="swatches">
                      {p.colors.length
                        ? p.colors.map((c, j) => <span key={j} className="sw" style={{ background: c }} title={c} />)
                        : <span className="sw none" title="Sin color" />}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {d.badges.length > 0 && (
            <div className="badges">
              <h3>Placas que tiene a la vista</h3>
              <ul>
                {d.badges.map((b, i) => (
                  <li key={i}><b>{b.name}</b>{b.description ? <span> · {b.description}</span> : null}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
