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
        id: "supino-maquina",
        nome: "Supino na máquina",
        series: 4,
        repeticoes: "8-10",
        descansoSeg: 120,
        notas: "Costas bem apoiadas no banco. Empurra até quase esticar os braços e volta devagar.",
        videos: [{ label: "Explicação", url: "/videos/supino-maquina.mp4" }],
      },
      {
        id: "supino-halteres",
        nome: "Supino plano com halteres",
        series: 3,
        repeticoes: "10-12",
        descansoSeg: 90,
        notas: "Cotovelos ligeiramente para dentro, não abertos a 90°. Controla a descida.",
        videos: [{ label: "Pai a fazer", url: "/videos/supino-halteres-pai.mp4" }],
      },
      {
        id: "press-ombros-maquina",
        nome: "Press de ombros na máquina",
        series: 3,
        repeticoes: "10-12",
        descansoSeg: 90,
        notas: "Costas encostadas. Não arquear a lombar nem trancar os cotovelos em cima.",
        videos: [
          { label: "Explicação", url: "/videos/press-ombros-maquina.mp4" },
          { label: "Pai a fazer", url: "/videos/press-ombros-maquina-pai.mp4" },
        ],
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
        videos: [{ label: "Pai a fazer", url: "/videos/triceps-corda-pai.mp4" }],
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
        nome: "Puxada à frente na máquina",
        series: 4,
        repeticoes: "10",
        descansoSeg: 90,
        notas: "Puxa até ao peito, peito para cima. Pensa em levar os cotovelos para baixo, não em puxar com os braços.",
        videos: [{ label: "Explicação", url: "/videos/puxada-frente.mp4" }],
      },
      {
        id: "remada-sentada-maquina",
        nome: "Remada sentada na máquina",
        series: 4,
        repeticoes: "10-12",
        descansoSeg: 90,
        notas: "Peito encostado ao apoio. Aperta as omoplatas no fim e não balances o tronco.",
        videos: [{ label: "Explicação", url: "/videos/remada-sentada-maquina.mp4" }],
      },
      {
        id: "remada-curvada",
        nome: "Remada curvada com barra",
        series: 3,
        repeticoes: "8-10",
        descansoSeg: 120,
        notas: "Costas direitas, tronco inclinado. Barra vai ao umbigo.",
        videos: [{ label: "Explicação", url: "https://youtu.be/SUBSTITUIR" }],
      },
      {
        id: "deltoide-posterior",
        nome: "Peck deck invertido (ombro posterior)",
        series: 3,
        repeticoes: "12-15",
        descansoSeg: 60,
        notas: "Braços quase esticados. Abre até à linha dos ombros, sem dar balanço.",
        videos: [{ label: "Pai a fazer", url: "/videos/deltoide-posterior-pai.mp4" }],
      },
      {
        id: "curl-scott",
        nome: "Curl de bíceps na máquina Scott",
        series: 3,
        repeticoes: "10-12",
        descansoSeg: 60,
        notas: "Braços bem apoiados. Desce devagar até quase esticar.",
        videos: [{ label: "Explicação", url: "/videos/curl-scott.mp4" }],
      },
      {
        id: "curl-polia",
        nome: "Curl de bíceps na polia",
        series: 3,
        repeticoes: "12",
        descansoSeg: 60,
        notas: "Cotovelo parado junto ao corpo. Sobe e desce com controlo.",
        videos: [{ label: "Explicação", url: "/videos/curl-polia.mp4" }],
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
        videos: [{ label: "Pai a fazer", url: "/videos/supino-halteres-pai.mp4" }],
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
        videos: [
          { label: "Explicação", url: "/videos/press-ombros-maquina.mp4" },
          { label: "Pai a fazer", url: "/videos/press-ombros-maquina-pai.mp4" },
        ],
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
