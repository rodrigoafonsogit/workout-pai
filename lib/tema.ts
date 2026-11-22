import type { Exercicio, Treino } from "@/data/treinos";

/** Classe CSS de cada treino (cor do ícone, definida em app/globals.css). */
export const temaClasse: Record<Treino["slug"], string> = {
  push: "t-push",
  pull: "t-pull",
  misto: "t-misto",
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

/** 90 → "1:30 min", 45 → "45 s" */
export function formatarDescanso(seg: number) {
  if (seg < 60) return `${seg} s`;
  const m = Math.floor(seg / 60);
  const s = seg % 60;
  return s ? `${m}:${String(s).padStart(2, "0")} min` : `${m} min`;
}

/**
 * Duração estimada (em minutos, arredondada a 5):
 * ~45 s por série + descanso depois de cada série + ~1 min para preparar cada máquina.
 */
export function duracaoEstimada(exercicios: Exercicio[]) {
  const seg = exercicios.reduce((t, e) => t + e.series * (45 + (e.descansoSeg ?? 60)) + 60, 0);
  return Math.max(5, Math.round(seg / 60 / 5) * 5);
}

export const serieCompleta = (feitas: boolean[] | undefined, n: number) =>
  n > 0 && Array.from({ length: n }).every((_, i) => feitas?.[i]);
