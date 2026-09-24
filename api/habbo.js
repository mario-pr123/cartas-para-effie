// Perfil público de Habbo, leído desde el servidor (evita problemas de CORS).
// Devuelve solo texto y colores: nada de imágenes del avatar.
const NAME = process.env.HABBO_NAME || ".eff!e.";
const HOTELS = (process.env.HABBO_HOTEL || "es,com").split(",").map(s => s.trim()).filter(Boolean);
const UA = { "User-Agent": "Mozilla/5.0 (cartas-para-effie)" , Accept: "application/json" };

const PARTS = {
  hr: "Cabello", ha: "Sombrero", he: "Accesorio de cabeza", ea: "Lentes", fa: "Accesorio de cara",
  ch: "Parte de arriba", cc: "Abrigo", ca: "Accesorio de pecho", cp: "Estampado",
  lg: "Parte de abajo", sh: "Zapatos", wa: "Cinturón"
};
const ORDER = ["hr", "ha", "he", "ea", "fa", "ch", "cc", "ca", "cp", "wa", "lg", "sh"];

let figureCache = {}; // hotel -> { palettes, typePalette }

async function figuredata(hotel) {
  if (figureCache[hotel]) return figureCache[hotel];
  try {
    const r = await fetch(`https://www.habbo.${hotel}/gamedata/figuredata/1`, { headers: { "User-Agent": UA["User-Agent"] } });
    if (!r.ok) return null;
    const xml = await r.text();
    const palettes = {};
    for (const m of xml.matchAll(/<palette id="(\d+)"[^>]*>([\s\S]*?)<\/palette>/g)) {
      const colors = {};
      for (const c of m[2].matchAll(/<color id="(\d+)"[^>]*>([0-9A-Fa-f]{6})<\/color>/g)) colors[c[1]] = "#" + c[2].toUpperCase();
      palettes[m[1]] = colors;
    }
    const typePalette = {};
    for (const m of xml.matchAll(/<settype type="(\w+)" paletteid="(\d+)"/g)) typePalette[m[1]] = m[2];
    figureCache[hotel] = { palettes, typePalette };
    return figureCache[hotel];
  } catch {
    return null;
  }
}

function lookFrom(figure, fd) {
  if (typeof figure !== "string") return [];
  const parts = figure.split(".").map(p => p.split("-")).filter(p => PARTS[p[0]]);
  parts.sort((a, b) => ORDER.indexOf(a[0]) - ORDER.indexOf(b[0]));
  return parts.map(([type, , ...colorIds]) => {
    const pal = fd && fd.palettes[fd.typePalette[type]];
    const colors = pal ? colorIds.map(id => pal[id]).filter(Boolean) : [];
    return { type, label: PARTS[type], colors };
  });
}

export default async function handler(req, res) {
  for (const hotel of HOTELS) {
    try {
      const r = await fetch(`https://www.habbo.${hotel}/api/public/users?name=${encodeURIComponent(NAME)}`, { headers: UA });
      if (!r.ok) continue;
      const u = await r.json();
      if (!u || !u.name) continue;
      const fd = await figuredata(hotel);
      res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
      return res.status(200).json({
        hotel: `habbo.${hotel}`,
        name: u.name,
        motto: u.motto || "",
        online: Boolean(u.online),
        memberSince: u.memberSince || null,
        lastAccess: u.lastAccessTime || null,
        level: u.currentLevel ?? null,
        profileVisible: u.profileVisible !== false,
        look: lookFrom(u.figureString, fd),
        badges: Array.isArray(u.selectedBadges)
          ? u.selectedBadges.slice(0, 5).map(b => ({ name: b.name || "", description: b.description || "" })).filter(b => b.name)
          : []
      });
    } catch {
      // probar el siguiente hotel
    }
  }
  res.setHeader("Cache-Control", "s-maxage=60");
  return res.status(404).json({ error: "no-encontrado", name: NAME });
}
