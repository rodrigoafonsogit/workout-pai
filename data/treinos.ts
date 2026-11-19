/*
 * ===================================================================
 *  TREINOS DO PAI — é só este ficheiro que precisas de editar.
 * ===================================================================
 *
 *  ➕ ADICIONAR UM EXERCÍCIO
 *     Copia um bloco { ... } dentro de `exercicios` e muda os valores.
 *     - id:          único dentro do treino, sem espaços (ex.: "supino-plano")
 *     - nome:        o que aparece no ecrã
 *     - series:      número de séries (gera as bolinhas para marcar)
 *     - repeticoes:  texto livre: "10", "8-10", "30 seg", "até à falha"
 *     - descansoSeg: (opcional) segundos de descanso → ativa o temporizador
 *     - notas:       (opcional) dica curta
 *     - videos:      lista de vídeos (até 2), pode ficar vazia: []
 *     A ordem no ficheiro é a ordem no ecrã.
 *
 *  🎬 ADICIONAR UM VÍDEO
 *     { label: "Explicação", url: "..." }
 *     O `url` pode ser:
 *     - YouTube normal:   https://www.youtube.com/watch?v=XXXXXXXXXXX
 *     - YouTube curto:    https://youtu.be/XXXXXXXXXXX
 *     - YouTube Shorts:   https://www.youtube.com/shorts/XXXXXXXXXXX
 *       (vídeos "Não listados" funcionam e não aparecem em pesquisas)
 *     - Ficheiro .mp4 na pasta public/videos:  "/videos/supino.mp4"
 *       (ou qualquer link direto para um .mp4)
 *     Enquanto o URL tiver "SUBSTITUIR", aparece "Vídeo em breve".
 *
 *  ⚠️ Se mudares o `id` de um exercício, as séries marcadas desse
 *     exercício no telemóvel são esquecidas (não faz mal nenhum).
 * ===================================================================
 */

export type Video = { label: string; url: string };

export type Exercicio = {
  id: string;
  nome: string;
  series: number;
  repeticoes: string;
  descansoSeg?: number;
  notas?: string;
  videos: Video[];
};

export type Treino = {
  slug: "push" | "pull" | "misto";
  dia: "Segunda" | "Quarta" | "Sexta";
  titulo: string;
  descricao?: string;
  exercicios: Exercicio[];
};

export const treinos: Treino[] = [
  // ───────────────────────── SEGUNDA — PUSH ─────────────────────────
  {
    slug: "push",
    dia: "Segunda",
    titulo: "Push",
    descricao: "Peito, ombros e tríceps",
    exercicios: [
      {
        id: "supino-plano",
        nome: "Supino plano com barra",
        series: 4,
        repeticoes: "8-10",
        descansoSeg: 120,
        notas: "Omoplatas juntas, pés firmes no chão. Desce a barra até ao peito com controlo.",
        videos: [
          { label: "Explicação", url: "https://youtu.be/SUBSTITUIR" },
          { label: "Pai a fazer", url: "/videos/SUBSTITUIR-supino.mp4" },
        ],
      },
      {
        id: "supino-inclinado-halteres",
        nome: "Supino inclinado com halteres",
        series: 3,
        repeticoes: "10-12",
        descansoSeg: 90,
        notas: "Banco a 30°. Cotovelos ligeiramente para dentro, não abertos a 90°.",
        videos: [{ label: "Explicação", url: "https://youtu.be/SUBSTITUIR" }],
      },
      {
        id: "press-ombros-halteres",
        nome: "Press de ombros com halteres (sentado)",
        series: 3,
        repeticoes: "10",
        descansoSeg: 90,
        notas: "Costas encostadas ao banco. Não arquear a lombar.",
        videos: [{ label: "Explicação", url: "https://youtu.be/SUBSTITUIR" }],
      },
      {
        id: "elevacoes-laterais",
        nome: "Elevações laterais",
        series: 3,
        repeticoes: "12-15",
        descansoSeg: 60,
        notas: "Peso leve. Sobe só até à altura dos ombros, sem balançar.",
        videos: [{ label: "Explicação", url: "https://youtu.be/SUBSTITUIR" }],
      },
      {
        id: "triceps-corda",
        nome: "Tríceps na polia com corda",
        series: 3,
        repeticoes: "12",
        descansoSeg: 60,
        notas: "Cotovelos colados ao corpo. Abre a corda no fim do movimento.",
        videos: [{ label: "Explicação", url: "https://youtu.be/SUBSTITUIR" }],
      },
      {
        id: "flexoes",
        nome: "Flexões",
        series: 2,
        repeticoes: "até à falha",
        descansoSeg: 60,
        notas: "Se for difícil, apoia os joelhos ou as mãos num banco.",
        videos: [],
      },
    ],
  },

  // ───────────────────────── QUARTA — PULL ─────────────────────────
  {
    slug: "pull",
    dia: "Quarta",
    titulo: "Pull",
    descricao: "Costas e bíceps",
    exercicios: [
      {
        id: "puxada-frente",
        nome: "Puxada à frente na polia",
        series: 4,
        repeticoes: "10",
        descansoSeg: 90,
        notas: "Puxa a barra até ao peito, peito para cima. Não puxes com os braços, pensa nos cotovelos.",
        videos: [
          { label: "Explicação", url: "https://youtu.be/SUBSTITUIR" },
          { label: "Pai a fazer", url: "/videos/SUBSTITUIR-puxada.mp4" },
        ],
      },
      {
        id: "remada-curvada",
        nome: "Remada curvada com barra",
        series: 4,
        repeticoes: "8-10",
        descansoSeg: 120,
        notas: "Costas direitas, tronco inclinado. Barra vai ao umbigo.",
        videos: [{ label: "Explicação", url: "https://youtu.be/SUBSTITUIR" }],
      },
      {
        id: "remada-sentada",
        nome: "Remada sentada na polia",
        series: 3,
        repeticoes: "12",
        descansoSeg: 90,
        notas: "Não balances o tronco. Aperta as omoplatas no fim.",
        videos: [{ label: "Explicação", url: "https://youtu.be/SUBSTITUIR" }],
      },
      {
        id: "face-pull",
        nome: "Face pull",
        series: 3,
        repeticoes: "15",
        descansoSeg: 60,
        notas: "Corda à altura da cara. Ótimo para os ombros e postura.",
        videos: [{ label: "Explicação", url: "https://youtu.be/SUBSTITUIR" }],
      },
      {
        id: "curl-halteres",
        nome: "Curl de bíceps com halteres",
        series: 3,
        repeticoes: "10-12",
        descansoSeg: 60,
        notas: "Cotovelos parados. Desce devagar.",
        videos: [{ label: "Explicação", url: "https://youtu.be/SUBSTITUIR" }],
      },
      {
        id: "curl-martelo",
        nome: "Curl martelo",
        series: 3,
        repeticoes: "12",
        descansoSeg: 60,
        notas: "Palmas viradas uma para a outra durante todo o movimento.",
        videos: [],
      },
    ],
  },

  // ───────────────────────── SEXTA — MISTO ─────────────────────────
  {
    slug: "misto",
    dia: "Sexta",
    titulo: "Misto",
    descricao: "Um pouco de tudo: empurrar e puxar",
    exercicios: [
      {
        id: "supino-halteres",
        nome: "Supino plano com halteres",
        series: 3,
        repeticoes: "10",
        descansoSeg: 90,
        notas: "Controla a descida. Junta os halteres em cima sem bater.",
        videos: [{ label: "Explicação", url: "https://youtu.be/SUBSTITUIR" }],
      },
      {
        id: "remada-unilateral",
        nome: "Remada unilateral com halter",
        series: 3,
        repeticoes: "10 (cada lado)",
        descansoSeg: 60,
        notas: "Joelho e mão apoiados no banco. Puxa o halter para a anca.",
        videos: [{ label: "Explicação", url: "https://youtu.be/SUBSTITUIR" }],
      },
      {
        id: "press-ombros-maquina",
        nome: "Press de ombros na máquina",
        series: 3,
        repeticoes: "12",
        descansoSeg: 90,
        videos: [{ label: "Explicação", url: "https://youtu.be/SUBSTITUIR" }],
      },
      {
        id: "puxada-pega-fechada",
        nome: "Puxada com pega fechada",
        series: 3,
        repeticoes: "12",
        descansoSeg: 90,
        notas: "Puxa até ao peito, cotovelos junto ao corpo.",
        videos: [{ label: "Explicação", url: "https://youtu.be/SUBSTITUIR" }],
      },
      {
        id: "mergulhos-banco",
        nome: "Mergulhos no banco",
        series: 3,
        repeticoes: "10",
        descansoSeg: 60,
        notas: "Costas perto do banco. Desce só até sentires conforto nos ombros.",
        videos: [],
      },
      {
        id: "prancha",
        nome: "Prancha",
        series: 3,
        repeticoes: "30 seg",
        descansoSeg: 45,
        notas: "Corpo em linha reta, barriga contraída. Não deixes a anca descer.",
        videos: [{ label: "Explicação", url: "https://youtu.be/SUBSTITUIR" }],
      },
    ],
  },
];

export function getTreino(slug: string): Treino | undefined {
  return treinos.find((t) => t.slug === slug);
}
