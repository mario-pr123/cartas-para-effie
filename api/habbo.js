// Perfil público de Habbo, leído desde el servidor (evita problemas de CORS).
// Devuelve el código del look (figureString) para dibujar el avatar con el
// servicio oficial de imágenes de Habbo, como hace habbodex.
const NAME = process.env.HABBO_NAME || ".eff!e.";
const HOTELS = (process.env.HABBO_HOTEL || "es,com").split(",").map(s => s.trim()).filter(Boolean);
const HEADERS = { "User-Agent": "Mozilla/5.0 (cartas-para-effie)", Accept: "application/json" };

async function getJson(url) {
  const r = await fetch(url, { headers: HEADERS });
  if (!r.ok) return null;
  return r.json();
}

export default async function handler(req, res) {
  for (const hotel of HOTELS) {
    try {
      const base = `https://www.habbo.${hotel}`;
      const u = await getJson(`${base}/api/public/users?name=${encodeURIComponent(NAME)}`);
      if (!u || !u.name) continue;

      // Perfil completo (salas, grupos, amigos): solo si ella lo tiene visible.
      let profile = null;
      if (u.uniqueId && u.profileVisible !== false) {
        try { profile = await getJson(`${base}/api/public/users/${encodeURIComponent(u.uniqueId)}/profile`); } catch { profile = null; }
      }

      const rooms = profile && Array.isArray(profile.rooms)
        ? profile.rooms.slice(0, 6).map(r => ({ name: r.name || "", description: r.description || "" })).filter(r => r.name)
        : [];

      res.setHeader("Cache-Control", "s-maxage=15, stale-while-revalidate=30");
      return res.status(200).json({
        hotel,
        name: u.name,
        figure: u.figureString || "",
        motto: u.motto || "",
        online: Boolean(u.online),
        memberSince: u.memberSince || null,
        lastAccess: u.lastAccessTime || null,
        level: u.currentLevel ?? null,
        starGems: u.starGemCount ?? null,
        badges: Array.isArray(u.selectedBadges)
          ? u.selectedBadges.slice(0, 5).map(b => ({ code: b.code || "", name: b.name || "", description: b.description || "" }))
          : [],
        counts: profile ? {
          rooms: Array.isArray(profile.rooms) ? profile.rooms.length : null,
          groups: Array.isArray(profile.groups) ? profile.groups.length : null,
          friends: Array.isArray(profile.friends) ? profile.friends.length : null,
          badges: Array.isArray(profile.badges) ? profile.badges.length : null
        } : null,
        rooms,
        fetchedAt: new Date().toISOString()
      });
    } catch {
      // probar el siguiente hotel
    }
  }
  res.setHeader("Cache-Control", "s-maxage=30");
  return res.status(404).json({ error: "no-encontrado", name: NAME });
}
