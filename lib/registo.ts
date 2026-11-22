/*
 * Registo guardado no telemóvel (localStorage). Não há servidor nem base de dados.
 *
 * - Pesos (um por exercício, partilhado entre treinos):
 *     "treino-do-pai:pesos"  → { [exercicioId]: { kg: 20, data: "2026-11-22" } }
 * - Sessão em curso de cada treino (séries marcadas e pesos de hoje):
 *     "treino-do-pai:sessao:push" → { data, feitas: { [id]: boolean[] }, hoje: { [id]: "20" } }
 *
 * Os pesos de hoje passam a "último treino" quando:
 *   - o pai carrega em "Concluir treino", ou
 *   - abre o treino noutro dia sem ter concluído (guardamos na mesma, automaticamente).
 */

export type PesoGuardado = { kg: number; data: string };
export type Pesos = Record<string, PesoGuardado>;
export type Sessao = { data: string; feitas: Record<string, boolean[]>; hoje: Record<string, string> };

const CHAVE_PESOS = "treino-do-pai:pesos";
const chaveSessao = (slug: string) => `treino-do-pai:sessao:${slug}`;
const chaveAntiga = (slug: string) => `treino-do-pai:${slug}`; // versão anterior (só séries)

export function hojeISO(d = new Date()) {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${dia}`;
}

function ler<T>(chave: string): T | null {
  try {
    const v = localStorage.getItem(chave);
    return v ? (JSON.parse(v) as T) : null;
  } catch {
    return null;
  }
}

function escrever(chave: string, valor: unknown) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
  } catch {}
}

/** "7,5" ou "7.5" → 7.5. Devolve null se não for um peso válido. */
export function lerKg(texto: string | undefined): number | null {
  if (!texto) return null;
  const n = Number(texto.trim().replace(",", "."));
  return Number.isFinite(n) && n > 0 && n < 1000 ? Math.round(n * 100) / 100 : null;
}

/** 7.5 → "7,5" */
export function formatarKg(kg: number) {
  return kg.toLocaleString("pt-PT", { maximumFractionDigits: 2 });
}

export function lerPesos(): Pesos {
  return ler<Pesos>(CHAVE_PESOS) ?? {};
}

const sessaoVazia = (): Sessao => ({ data: hojeISO(), feitas: {}, hoje: {} });

/** Passa os pesos de hoje para "último treino". */
function guardarPesosDaSessao(sessao: Sessao) {
  const pesos = lerPesos();
  let mudou = false;
  for (const [id, texto] of Object.entries(sessao.hoje)) {
    const kg = lerKg(texto);
    if (kg !== null) {
      pesos[id] = { kg, data: sessao.data };
      mudou = true;
    }
  }
  if (mudou) escrever(CHAVE_PESOS, pesos);
}

/**
 * Carrega a sessão do treino. Se for de outro dia, guarda os pesos dessa sessão
 * e começa uma sessão nova.
 */
export function carregarSessao(slug: string): Sessao {
  let sessao = ler<Sessao>(chaveSessao(slug));

  if (!sessao) {
    // Migração da versão anterior (só tinha as séries marcadas).
    const antigas = ler<Record<string, boolean[]>>(chaveAntiga(slug));
    sessao = { ...sessaoVazia(), feitas: antigas ?? {} };
    try {
      localStorage.removeItem(chaveAntiga(slug));
    } catch {}
  }

  if (sessao.data !== hojeISO()) {
    guardarPesosDaSessao(sessao);
    sessao = sessaoVazia();
  }
  sessao.feitas ??= {};
  sessao.hoje ??= {};
  return sessao;
}

export function gravarSessao(slug: string, sessao: Sessao) {
  escrever(chaveSessao(slug), sessao);
}

/** "Concluir treino": guarda os pesos e limpa a sessão. Devolve os pesos atualizados. */
export function concluirSessao(slug: string, sessao: Sessao): Pesos {
  guardarPesosDaSessao(sessao);
  gravarSessao(slug, sessaoVazia());
  return lerPesos();
}

/** Resumo para a página inicial: exercícios concluídos na sessão de hoje. */
export function resumoSessao(slug: string, series: Record<string, number>) {
  const s = ler<Sessao>(chaveSessao(slug));
  if (!s || s.data !== hojeISO()) return { concluidos: 0, comecado: false };
  let concluidos = 0;
  let comecado = false;
  for (const [id, n] of Object.entries(series)) {
    const f = s.feitas?.[id] ?? [];
    if (f.some(Boolean)) comecado = true;
    if (n > 0 && Array.from({ length: n }).every((_, i) => f[i])) concluidos++;
  }
  return { concluidos, comecado };
}
