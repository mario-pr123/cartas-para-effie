// ================= Contenido del juego =================
// Edita aquí preguntas, mazos y la ficha de Effie.

export const HIM = "Mario";
export const HABBO_NAME = ".eff!e.";
export const MET = new Date(2026, 7, 24); // 24 de agosto de 2026, en Habbo

export const DECKS = {
  peli:     { name: "Orgullo y prejuicio", color: "var(--mint)" },
  habbo:    { name: "Hotel Habbo",         color: "var(--lilac)" },
  musica:   { name: "Música y tacones",    color: "var(--blush)" },
  natura:   { name: "Hongos y caballos",   color: "var(--moss)" },
  tauro:    { name: "Muy tauro",           color: "var(--butter)" },
  aula:     { name: "Profe Effie",         color: "var(--sky)" },
  hogar:    { name: "Niebla y raíces",     color: "var(--peach)" },
  gamer:    { name: "Player 2",            color: "var(--lilac)" },
  nosotros: { name: "Un mes de nosotros",  color: "var(--blush)" }
};

export const LEVELS = { ligera: "Ligera", media: "Media", profunda: "Profunda" };

// tipo:
//   ambos    → responden los dos, alternando quién empieza
//   effie    → pregunta para Effie
//   mario    → pregunta para Mario
//   adivinaE → Mario adivina algo de Effie
//   adivinaM → Effie adivina algo de Mario
//   reto     → mini reto para hacer en la llamada
const RAW = [
  // Orgullo y prejuicio (después de verla juntos)
  ["peli", "ligera", "ambos", "Después de verla juntos: ¿qué escena te gustó más esta vez?"],
  ["peli", "ligera", "effie", "¿Cuántas veces has visto Orgullo y prejuicio? ¿Qué notaste hoy que no habías visto antes?"],
  ["peli", "ligera", "mario", "Primera impresión honesta de la película. Sin quedar bien."],
  ["peli", "ligera", "ambos", "¿Eres más Elizabeth, más Jane o más Mr. Darcy? Defiéndelo."],
  ["peli", "media", "ambos", "¿Cuál fue tu primer prejuicio sobre el otro? ¿Acertaste?"],
  ["peli", "profunda", "ambos", "¿Qué gesto pequeño, como la mano de Darcy, te parece más romántico que una gran declaración?"],
  ["peli", "media", "ambos", "¿Qué libro le recomendarías al otro para que te conozca mejor?", "libro"],
  ["peli", "ligera", "effie", "¿Qué libros te atrapan? ¿Qué leías en tus videos de TikTok?", "generos"],
  ["peli", "ligera", "adivinaM", "¿Qué personaje crees que me cayó mejor a mí?"],
  ["peli", "ligera", "reto", "Declárense como Darcy bajo la lluvia, en una sola frase y con acento inglés."],

  // Hotel Habbo
  ["habbo", "ligera", "ambos", "¿Qué fue lo primero que pensaste del otro cuando se cruzaron en Habbo?"],
  ["habbo", "ligera", "effie", "¿Por qué .eff!e.? ¿Cómo elegiste tu nombre en el hotel?"],
  ["habbo", "ligera", "effie", "¿Cuál ha sido tu keko favorito de todos los que has creado? Descríbelo como un look de pasarela.", "keko"],
  ["habbo", "ligera", "effie", "Zana o kick moderno: ¿qué te engancha? ¿Juegas para ganar o para reírte?"],
  ["habbo", "ligera", "ambos", "Si hoy armaras una sala que te represente, ¿cómo sería? ¿Qué mueble no puede faltar?"],
  ["habbo", "ligera", "ambos", "¿Cuál es tu recuerdo más gracioso o más raro dentro del hotel?"],
  ["habbo", "media", "ambos", "¿Cómo le contarías nuestra primera conversación a alguien que nunca ha jugado Habbo?"],
  ["habbo", "profunda", "ambos", "¿Hay algo que se sienta más fácil de decir detrás de un keko o una llamada que en persona?"],
  ["habbo", "ligera", "adivinaE", "¿Qué color crees que domina los looks de .eff!e.?"],
  ["habbo", "ligera", "reto", "Cada uno se arma un keko nuevo en 5 minutos inspirado en el otro. Luego se lo presentan."],
  ["habbo", "ligera", "reto", "Armen una sala juntos en 10 minutos. Tú eliges el tema y yo pongo los muebles que me digas."],

  // Música y tacones
  ["musica", "ligera", "effie", "¿Cómo fue el concierto de The Weeknd? Cuéntalo desde que llegaste.", "weeknd"],
  ["musica", "ligera", "adivinaE", "¿Qué canción de The Weeknd crees que Effie pondría en repeat?"],
  ["musica", "ligera", "adivinaM", "¿Qué canción de The Weeknd crees que es mi favorita? (O cuál debería ser.)"],
  ["musica", "ligera", "effie", "Juan Gabriel: ¿cuál es la canción que cantas a todo pulmón?", "juanga"],
  ["musica", "ligera", "effie", "¿Qué trap has estado escuchando últimamente? Pásame uno.", "trap"],
  ["musica", "media", "effie", "¿Cómo llegaste al heels dance? ¿Qué sientes cuando te pones los tacones para bailar?", "heels"],
  ["musica", "ligera", "ambos", "¿Qué canción pones cuando necesitas sentirte imparable?"],
  ["musica", "profunda", "ambos", "¿Qué te da bailar (o la música) que no te da nada más?"],
  ["musica", "ligera", "ambos", "Si esta cita tuviera banda sonora, ¿qué tres canciones tendría?"],
  ["musica", "media", "ambos", "¿Qué canción te recuerda a una etapa que ya cerraste?"],
  ["musica", "ligera", "reto", "Cada uno manda por chat una canción sin explicar nada. Escuchen 30 segundos y adivinen por qué la eligió el otro."],
  ["musica", "ligera", "reto", "Armen una playlist de cinco canciones para esta cita: dos tuyas, dos mías y una que elijamos juntos."],

  // Hongos y caballos (naturaleza)
  ["natura", "ligera", "effie", "¿Qué tienen los hongos que te encantan tanto? ¿Tienes uno favorito?"],
  ["natura", "ligera", "effie", "¿Cuándo empezó tu amor por los caballos? ¿Has montado alguno?"],
  ["natura", "ligera", "ambos", "Describe tu lugar ideal en la naturaleza: bosque, montaña, río… ¿Qué se escucha ahí?"],
  ["natura", "ligera", "ambos", "Si pudieras pasar un fin de semana en cualquier lugar natural, ¿a dónde irías y qué harías?"],
  ["natura", "media", "ambos", "¿Qué sientes en la naturaleza que no sientes en la ciudad?"],
  ["natura", "profunda", "ambos", "¿Qué lugar natural te gustaría conocer con el otro algún día?"],
  ["natura", "ligera", "adivinaE", "Si Effie fuera un hongo, ¿cuál sería y por qué?"],
  ["natura", "ligera", "adivinaM", "Si yo fuera un caballo, ¿de qué color sería y cómo me llamaría?"],
  ["natura", "ligera", "reto", "Armen en Habbo un rincón de bosque con hongos en 10 minutos. Gana el más bonito según el otro."],

  // Muy tauro
  ["tauro", "ligera", "effie", "Como buena tauro, ¿en qué eres terca y orgullosa de serlo?"],
  ["tauro", "ligera", "mario", "¿Qué has aprendido de los tauro desde que me conoces?"],
  ["tauro", "ligera", "ambos", "¿Qué cosa sencilla te da paz al instante? Una comida, un lugar, un olor…"],
  ["tauro", "ligera", "ambos", "¿Cuál es el pequeño lujo que nunca te niegas?"],
  ["tauro", "profunda", "ambos", "¿Qué necesitas de alguien para confiar de verdad?"],
  ["tauro", "ligera", "adivinaM", "¿Qué rasgo de mi signo crees que tengo más marcado?"],

  // Profe Effie
  ["aula", "media", "effie", "¿Qué das en la universidad y qué te llevó a la docencia?", "clase"],
  ["aula", "ligera", "effie", "¿Cuál es la anécdota más graciosa o más caótica con tus alumnos?"],
  ["aula", "ligera", "adivinaM", "Si yo fuera tu alumno, ¿qué calificación sacaría? Justifícala."],
  ["aula", "ligera", "ambos", "¿De qué tema podrías dar una clase de una hora sin preparar nada?"],
  ["aula", "profunda", "ambos", "¿Qué aprendiste tarde que te habría gustado saber antes?"],
  ["aula", "media", "ambos", "¿Qué opinión tuya suele sorprender a la gente?"],
  ["aula", "media", "ambos", "¿Cómo te gusta recibir cariño: palabras, tiempo, detalles, ayuda o contacto?"],
  ["aula", "ligera", "reto", "Explícale al otro en 60 segundos algo que te apasione, como si fuera tu alumno."],

  // Niebla y raíces
  ["hogar", "ligera", "effie", "¿Cómo llegó Niebla a tu vida y por qué se llama así?", "niebla"],
  ["hogar", "ligera", "effie", "¿Cuál es la manía más graciosa de Niebla?"],
  ["hogar", "ligera", "reto", "Presenta a Niebla en cámara, o cuéntame la historia de su mejor foto."],
  ["hogar", "media", "effie", "¿Qué te ha compartido tu papá de su lado libanés: comida, palabras, costumbres?", "libano"],
  ["hogar", "ligera", "ambos", "Pasta: ¿cuál sería tu plato perfecto? ¿Y quién hace la mejor lasaña que has probado?", "pasta"],
  ["hogar", "ligera", "adivinaE", "Si Effie pudiera comer una sola pasta el resto de su vida, ¿cuál sería?"],
  ["hogar", "ligera", "mario", "¿Qué platillo te sale mejor? ¿Me lo cocinarías?"],
  ["hogar", "media", "ambos", "¿Qué tradición de tu casa quieres conservar siempre?"],
  ["hogar", "media", "ambos", "¿A quién de tu familia te pareces más?"],
  ["hogar", "profunda", "ambos", "¿Qué significa hogar para ti?"],

  // Player 2
  ["gamer", "ligera", "effie", "Tienes consolas desde niña: ¿cuál fue la primera y qué juego te marcó?"],
  ["gamer", "ligera", "effie", "Xbox Series S o Nintendo Switch: ¿cuál usas más y qué opinas de verdad de cada una?", "consola"],
  ["gamer", "ligera", "ambos", "¿A qué jugaríamos juntos primero, online?"],
  ["gamer", "ligera", "ambos", "¿Te enojas cuando pierdes? Sin mentir."],
  ["gamer", "media", "ambos", "¿Algún juego te hizo llorar?"],
  ["gamer", "media", "ambos", "Si tu vida fuera un videojuego, ¿en qué nivel vas y qué jefe final te falta?"],
  ["gamer", "ligera", "adivinaM", "¿A qué juego crees que le he dedicado más horas?"],

  // Un mes de nosotros
  ["nosotros", "ligera", "ambos", "¿Qué pensaste la primera vez que escuchaste la voz del otro en llamada?"],
  ["nosotros", "ligera", "effie", "¿Qué tiene que pasar para que me digas Andreé?"],
  ["nosotros", "ligera", "ambos", "¿Cuándo salió el primer «bobito» o el primer «mi niña»? ¿Te acuerdas por qué?"],
  ["nosotros", "media", "ambos", "¿Qué te dio más nervios de esta primera cita?"],
  ["nosotros", "media", "ambos", "¿Qué tiene de especial conocerse primero por la voz?"],
  ["nosotros", "media", "ambos", "Cuando por fin se vean en persona, ¿qué es lo primero que te gustaría hacer?"],
  ["nosotros", "profunda", "ambos", "¿Qué te hace sentir que alguien te cuida aunque esté lejos?"],
  ["nosotros", "profunda", "ambos", "¿Cómo te das cuenta de que un «te quiero» es de verdad?"],
  ["nosotros", "ligera", "ambos", "¿Qué plan online te gustaría para la segunda cita?"],
  ["nosotros", "profunda", "ambos", "¿Qué es algo que todavía no te han preguntado y te gustaría que te preguntaran?"],
  ["nosotros", "ligera", "reto", "Díganse una cosa que les gustó del otro en este primer mes."]
];

export const Q = RAW.map((q, i) => ({ id: i, deck: q[0], level: q[1], type: q[2], text: q[3], key: q[4] || null }));

// ================= Ficha de Effie =================
export const FICHA = [
  { title: "Música y baile", items: [
    ["♪", "var(--blush)", <>Eres fan de <b>The Weeknd</b> y ya fuiste a uno de sus conciertos.</>],
    ["♫", "var(--blush)", <>Cantas <b>Juan Gabriel</b>, y últimamente andas escuchando <b>trap</b>.</>],
    ["↑", "var(--blush)", <>Haces <b>heels dance</b>, y bailar te encanta.</>]
  ]},
  { title: "Naturaleza", items: [
    ["❀", "var(--moss)", <>Amas la <b>naturaleza</b>, muchísimo.</>],
    ["♠", "var(--moss)", <>Te encantan los <b>hongos</b>.</>],
    ["♞", "var(--moss)", <>Y los <b>caballos</b>.</>]
  ]},
  { title: "Lectura y cine", items: [
    ["❦", "var(--mint)", <>Te gusta <b>leer</b>. Tenías un TikTok donde subías videos leyendo.</>],
    ["✉", "var(--mint)", <>Tu película favorita es <b>Orgullo y prejuicio</b> (2005). Hoy la vemos juntos.</>]
  ]},
  { title: "En el hotel", items: [
    ["☆", "var(--lilac)", <>Eres muy <b>creativa</b>, y se nota en los looks de tus kekos.</>],
    ["▦", "var(--lilac)", <>Te encanta <b>armar salas</b>.</>],
    ["●", "var(--lilac)", <>Tu juego favorito: <b>Zanita xd</b>.</>]
  ]},
  { title: "Tu vida", items: [
    ["✎", "var(--sky)", <>Eres <b>docente universitaria</b>.</>],
    ["◕", "var(--peach)", <>Tienes a <b>Niebla</b>, tu perrita de 8 años.</>],
    ["▶", "var(--lilac)", <>Tienes VARIAS consolas xd. La <b>Xbox Series S</b> que no me gusta jeje y ahorita conectada tu <b>Nintendo Switch</b>.</>],
    ["✦", "var(--peach)", <>Tu papá es <b>libanés</b>, y tú vives en <b>México</b>.</>],
    ["◒", "var(--butter)", <>Amas las <b>pastas</b>.</>]
  ]},
  { title: "Cómo eres", items: [
    ["\u2649\uFE0E", "var(--butter)", <>Eres <b>tauro</b>, y siempre lo declaras con gusto y orgullo.</>],
    ["◆", "var(--sky)", <>Eres muy <b>inteligente</b>. Lo he comprobado aunque tengo que corregirte a veces con tu escritura xD.</>],
    ["◐", "var(--butter)", <>Cuidas mucho tu <b>privacidad</b>.</>],
    ["☏", "var(--blush)", <>Podemos pasar horas y horas <b>hablando en llamada</b>.</>]
  ]}
];

export const NICKS = ["mi amor", "mi niña", "bobito", "mi Mario", "te quiero"];

export const PLAN = [
  { title: "Orgullo y prejuicio", sub: "Tu favorita, la de 2005" },
  { title: "Un rato en Habbo", sub: "Tú y yo en el hotel" },
  { title: "Las cartas", sub: "Para conocerte más" }
];
