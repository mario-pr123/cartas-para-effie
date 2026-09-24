// Estado compartido del juego (qué carta está en la mesa, mazos, etc.).
// Solo se guardan números de carta y filtros: nunca las respuestas.
import { hasRedis, redis } from "./_redis.js";

const ROLES = ["effie", "mario"];
const MONTH = 60 * 60 * 24 * 30;
const ONLINE_TTL = 12; // segundos

function newer(a, b) {
  return a.s > b.s || (a.s === b.s && a.t > b.t);
}
function parse(v) {
  try { return v ? JSON.parse(v) : null; } catch { return null; }
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (!hasRedis) return res.status(503).json({ error: "sin-base" });

  const src = req.method === "GET" ? req.query : (req.body || {});
  const sala = String(src.sala || "").toLowerCase();
  if (!/^[a-z0-9-]{3,48}$/.test(sala)) return res.status(400).json({ error: "sala-invalida" });
  const role = ROLES.includes(src.role) ? src.role : "";

  const sk = `cartas:${sala}:state`;
  const pk = r => `cartas:${sala}:on:${r}`;

  try {
    const cmds = [];
    if (role) cmds.push(["SET", pk(role), String(Date.now()), "EX", String(ONLINE_TTL)]);
    cmds.push(["GET", sk], ["GET", pk("effie")], ["GET", pk("mario")]);
    const out = await redis(cmds);
    const off = role ? 1 : 0;
    let state = parse(out[off]);
    const online = { effie: Boolean(out[off + 1]), mario: Boolean(out[off + 2]) };

    if (req.method === "POST") {
      const incoming = src.state;
      const size = JSON.stringify(incoming || "").length;
      const ok = incoming && typeof incoming === "object" &&
        Number.isFinite(incoming.s) && Number.isFinite(incoming.t) && size < 8000;
      if (!ok) return res.status(400).json({ error: "estado-invalido" });
      if (!state || newer(incoming, state)) {
        await redis([["SET", sk, JSON.stringify(incoming), "EX", String(MONTH)]]);
        state = incoming;
      }
    } else if (req.method !== "GET") {
      return res.status(405).json({ error: "metodo" });
    }

    return res.status(200).json({ state, online });
  } catch (e) {
    return res.status(502).json({ error: "base-no-disponible" });
  }
}
