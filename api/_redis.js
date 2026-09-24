// Cliente mínimo para Upstash Redis por REST (sin dependencias).
// Vercel crea estas variables al conectar la base desde Storage / Marketplace.
const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

export const hasRedis = Boolean(URL_ && TOKEN);

export async function redis(commands) {
  const r = await fetch(`${URL_}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(commands)
  });
  if (!r.ok) throw new Error(`redis ${r.status}`);
  const out = await r.json();
  return out.map(x => (x && "result" in x ? x.result : null));
}
