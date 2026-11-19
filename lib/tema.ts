import type { Treino } from "@/data/treinos";

type Slug = Treino["slug"];

/** Cores por treino (classes Tailwind escritas por extenso para não serem removidas no build). */
export const tema: Record<
  Slug,
  { fundo: string; fundoSuave: string; texto: string; borda: string; anel: string; bolinha: string; hex: string }
> = {
  push: {
    fundo: "bg-orange-600",
    fundoSuave: "bg-orange-50 dark:bg-orange-950/40",
    texto: "text-orange-700 dark:text-orange-400",
    borda: "border-orange-600 dark:border-orange-500",
    anel: "ring-orange-500",
    bolinha: "bg-orange-600 border-orange-600 dark:bg-orange-500 dark:border-orange-500",
    hex: "#ea580c",
  },
  pull: {
    fundo: "bg-blue-600",
    fundoSuave: "bg-blue-50 dark:bg-blue-950/40",
    texto: "text-blue-700 dark:text-blue-400",
    borda: "border-blue-600 dark:border-blue-500",
    anel: "ring-blue-500",
    bolinha: "bg-blue-600 border-blue-600 dark:bg-blue-500 dark:border-blue-500",
    hex: "#2563eb",
  },
  misto: {
    fundo: "bg-green-600",
    fundoSuave: "bg-green-50 dark:bg-green-950/40",
    texto: "text-green-700 dark:text-green-400",
    borda: "border-green-600 dark:border-green-500",
    anel: "ring-green-500",
    bolinha: "bg-green-600 border-green-600 dark:bg-green-500 dark:border-green-500",
    hex: "#16a34a",
  },
};

/** Dia da semana em JS (0 = domingo) de cada dia de treino. */
export const diaNumero: Record<Treino["dia"], number> = {
  Segunda: 1,
  Quarta: 3,
  Sexta: 5,
};

export const diaCompleto: Record<Treino["dia"], string> = {
  Segunda: "Segunda-feira",
  Quarta: "Quarta-feira",
  Sexta: "Sexta-feira",
};
