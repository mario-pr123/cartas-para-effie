# Cartas para Effie

Juego de preguntas en React (Vite) para la primera cita de Effie y Mario. Los dos ven la misma carta en vivo, y la página muestra el keko de `.eff!e.` con su misión, placas y salas, actualizado cada 20 segundos.

## Subirla a Vercel (unos 10 minutos)

1. **Sube la carpeta a GitHub.** Crea un repositorio nuevo (puede ser privado) y sube todo el contenido de esta carpeta.
2. **Importa el proyecto en Vercel.** En vercel.com → *Add New… → Project*, elige el repositorio. Vercel detecta Vite solo; deja todo como está y dale *Deploy*.
3. **Conecta la base para la sincronización.** En el proyecto: *Storage* → *Create Database* → **Upstash for Redis** (plan gratis) → conéctala al proyecto. Esto crea las variables `KV_REST_API_URL` y `KV_REST_API_TOKEN` automáticamente.
4. **Vuelve a desplegar.** *Deployments* → los tres puntos del último → *Redeploy*. Sin este paso las variables nuevas no se aplican.
5. **Pruébala.** Abre el enlace en dos pestañas, elige "Soy Effie" en una y "Soy Mario" en la otra, y saca una carta: debe cambiar en las dos.

### Sala privada (recomendado)

Por defecto los dos entran a la sala `effie-y-mario`. Para que nadie más pueda adivinarla, compartan el enlace con una sala propia, por ejemplo:

```
https://tu-proyecto.vercel.app/?sala=eff-mario-24ago-k7q2
```

Solo letras minúsculas, números y guiones. Los dos deben usar exactamente el mismo enlace.

## Qué se guarda

Solo el número de carta, los mazos activos, las cartas marcadas para después y el paso de la cita. **Las respuestas nunca se escriben en ningún lado.** El estado se borra solo después de 30 días.

## Habbo

`/api/habbo` busca a `.eff!e.` primero en habbo.es y luego en habbo.com. Si está en otro hotel, agrega en Vercel (*Settings → Environment Variables*) la variable `HABBO_HOTEL` con el dominio, por ejemplo `com.br`, y vuelve a desplegar. `HABBO_NAME` cambia el nombre buscado.

## Editar preguntas

Todo el contenido está en `src/data.jsx`: preguntas, mazos, la ficha de Effie, los apodos y el plan de la cita. Los textos del encabezado y el pie están en `src/App.jsx`.

## En tu computadora

```
npm install
npm run dev
```

Con `npm run dev` la app funciona en modo "solo en este dispositivo" (no hay API). Para probar la sincronización localmente usa `npx vercel dev`.
