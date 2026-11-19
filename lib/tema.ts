import type { Treino } from "@/data/treinos";

/** Classe CSS com a cor de destaque de cada treino (definidas em app/globals.css). */
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

/** 90 → "1:30", 45 → "45 s" */
export function formatarDescanso(seg: number) {
  if (seg < 60) return `${seg} s`;
  const m = Math.floor(seg / 60);
  const s = seg % 60;
  return s ? `${m}:${String(s).padStart(2, "0")} min` : `${m} min`;
}
