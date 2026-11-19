"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Exercicio, Treino } from "@/data/treinos";
import { tema } from "@/lib/tema";
import Video from "./Video";

type Feitas = Record<string, boolean[]>;
type Temporizador = { fim: number; total: number; nome: string } | null;

function formatar(seg: number) {
  const m = Math.floor(seg / 60);
  const s = seg % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function TreinoView({ treino }: { treino: Treino }) {
  const c = tema[treino.slug];
  const chave = `treino-do-pai:${treino.slug}`;

  // ── Séries feitas (localStorage) ──
  const [feitas, setFeitas] = useState<Feitas>({});
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    try {
      const guardado = localStorage.getItem(chave);
      if (guardado) setFeitas(JSON.parse(guardado));
    } catch {}
    setCarregado(true);
  }, [chave]);

  useEffect(() => {
    if (!carregado) return;
    try {
      localStorage.setItem(chave, JSON.stringify(feitas));
    } catch {}
  }, [feitas, carregado, chave]);

  const alternar = (ex: Exercicio, i: number) =>
    setFeitas((f) => {
      const lista = Array.from({ length: ex.series }, (_, k) => f[ex.id]?.[k] ?? false);
      lista[i] = !lista[i];
      return { ...f, [ex.id]: lista };
    });

  const recomecar = () => {
    if (confirm("Recomeçar o treino? As séries marcadas vão ser limpas.")) setFeitas({});
  };

  const totalSeries = treino.exercicios.reduce((s, e) => s + e.series, 0);
  const seriesFeitas = treino.exercicios.reduce(
    (s, e) => s + (feitas[e.id]?.slice(0, e.series).filter(Boolean).length ?? 0),
    0,
  );

  // ── Temporizador de descanso ──
  const [temp, setTemp] = useState<Temporizador>(null);
  const [restante, setRestante] = useState(0);
  const [terminou, setTerminou] = useState(false);
  const audioRef = useRef<AudioContext | null>(null);

  const apitar = useCallback(() => {
    try {
      navigator.vibrate?.([300, 150, 300, 150, 300]);
      const ctx = audioRef.current;
      if (!ctx) return;
      [0, 0.35, 0.7].forEach((t) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.frequency.value = 880;
        g.gain.setValueAtTime(0.3, ctx.currentTime + t);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.25);
        o.connect(g).connect(ctx.destination);
        o.start(ctx.currentTime + t);
        o.stop(ctx.currentTime + t + 0.25);
      });
    } catch {}
  }, []);

  useEffect(() => {
    if (!temp) return;
    const tick = () => {
      const r = Math.max(0, Math.ceil((temp.fim - Date.now()) / 1000));
      setRestante(r);
      if (r === 0) {
        setTemp(null);
        setTerminou(true);
        apitar();
      }
    };
    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [temp, apitar]);

  useEffect(() => {
    if (!terminou) return;
    const id = setTimeout(() => setTerminou(false), 4000);
    return () => clearTimeout(id);
  }, [terminou]);

  const iniciarDescanso = (ex: Exercicio) => {
    if (!ex.descansoSeg) return;
    try {
      // O som só pode ser ativado com um toque do utilizador (regra dos browsers).
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioRef.current && AC) audioRef.current = new AC();
      audioRef.current?.resume();
    } catch {}
    setTerminou(false);
    setTemp({ fim: Date.now() + ex.descansoSeg * 1000, total: ex.descansoSeg, nome: ex.nome });
  };

  return (
    <>
      {/* Progresso */}
      <div className="mt-5 rounded-2xl bg-white p-4 shadow-sm dark:bg-stone-900">
        <div className="flex items-baseline justify-between text-lg">
          <span className="font-semibold">Progresso</span>
          <span className="tabular-nums text-stone-600 dark:text-stone-300">
            {seriesFeitas} / {totalSeries} séries
          </span>
        </div>
        <div className="mt-2 h-3 overflow-hidden rounded-full bg-stone-200 dark:bg-stone-800">
          <div
            className={`h-full ${c.fundo} transition-all`}
            style={{ width: `${totalSeries ? (seriesFeitas / totalSeries) * 100 : 0}%` }}
          />
        </div>
        {seriesFeitas === totalSeries && totalSeries > 0 && (
          <p className={`mt-3 text-xl font-bold ${c.texto}`}>🎉 Treino concluído! Muito bem!</p>
        )}
      </div>

      {/* Exercícios */}
      <ol className="mt-5 space-y-5">
        {treino.exercicios.map((ex, idx) => (
          <CartaoExercicio
            key={ex.id}
            ex={ex}
            numero={idx + 1}
            slug={treino.slug}
            feitas={feitas[ex.id] ?? []}
            onAlternar={(i) => alternar(ex, i)}
            onDescanso={() => iniciarDescanso(ex)}
          />
        ))}
      </ol>

      <button
        onClick={recomecar}
        className="mt-8 w-full rounded-2xl border-2 border-stone-300 bg-white py-4 text-xl font-semibold active:bg-stone-100 dark:border-stone-700 dark:bg-stone-900 dark:active:bg-stone-800"
      >
        ↺ Recomeçar treino
      </button>

      {/* Barra do temporizador */}
      {(temp || terminou) && (
        <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div
            className={`mx-auto flex max-w-xl items-center gap-4 rounded-3xl p-4 text-white shadow-2xl ${
              terminou ? "bg-stone-900 dark:bg-white dark:text-stone-900" : c.fundo
            }`}
          >
            {temp ? (
              <>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base opacity-90">Descanso · {temp.nome}</p>
                  <p className="text-5xl font-extrabold tabular-nums">{formatar(restante)}</p>
                </div>
                <button
                  onClick={() => setTemp((t) => t && { ...t, fim: t.fim + 15000 })}
                  className="rounded-2xl bg-white/20 px-4 py-4 text-lg font-bold active:bg-white/30"
                >
                  +15s
                </button>
                <button
                  onClick={() => setTemp(null)}
                  className="rounded-2xl bg-white px-4 py-4 text-lg font-bold text-stone-900 active:bg-stone-200"
                >
                  Parar
                </button>
              </>
            ) : (
              <p className="flex-1 py-3 text-center text-2xl font-bold">⏰ Descanso terminado! Vamos!</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function CartaoExercicio({
  ex,
  numero,
  slug,
  feitas,
  onAlternar,
  onDescanso,
}: {
  ex: Exercicio;
  numero: number;
  slug: Treino["slug"];
  feitas: boolean[];
  onAlternar: (i: number) => void;
  onDescanso: () => void;
}) {
  const c = tema[slug];
  const [videoAtivo, setVideoAtivo] = useState(0);
  const videos = ex.videos.slice(0, 2);
  const completo = Array.from({ length: ex.series }).every((_, i) => feitas[i]);

  return (
    <li className={`overflow-hidden rounded-3xl bg-white shadow-sm dark:bg-stone-900 ${completo ? "opacity-70" : ""}`}>
      <div className="p-5">
        <div className="flex items-start gap-3">
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl font-bold text-white ${c.fundo}`}
          >
            {completo ? "✓" : numero}
          </span>
          <h2 className="pt-1 text-2xl font-bold leading-tight">{ex.nome}</h2>
        </div>

        {/* Séries / reps / descanso */}
        <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
          <Dado rotulo="Séries" valor={String(ex.series)} />
          <Dado rotulo="Repetições" valor={ex.repeticoes} />
          <Dado rotulo="Descanso" valor={ex.descansoSeg ? `${ex.descansoSeg}s` : "—"} />
        </dl>

        {ex.notas && (
          <p className={`mt-4 rounded-2xl p-4 text-lg leading-snug ${c.fundoSuave}`}>💡 {ex.notas}</p>
        )}
      </div>

      {/* Vídeos */}
      {videos.length > 0 && (
        <div className="px-5 pb-2">
          {videos.length > 1 && (
            <div className="mb-3 grid grid-cols-2 gap-2" role="tablist">
              {videos.map((v, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={videoAtivo === i}
                  onClick={() => setVideoAtivo(i)}
                  className={`rounded-xl border-2 py-3 text-lg font-semibold ${
                    videoAtivo === i
                      ? `${c.fundo} border-transparent text-white`
                      : "border-stone-300 bg-transparent dark:border-stone-700"
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          )}
          {videos.length === 1 && (
            <p className="mb-2 text-base font-semibold text-stone-500 dark:text-stone-400">{videos[0].label}</p>
          )}
          <Video key={videos[videoAtivo].url} url={videos[videoAtivo].url} titulo={`${ex.nome} — ${videos[videoAtivo].label}`} />
        </div>
      )}

      {/* Marcar séries */}
      <div className="p-5">
        <p className="mb-3 text-base font-semibold text-stone-500 dark:text-stone-400">Toca para marcar cada série feita</p>
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: ex.series }).map((_, i) => {
            const feita = !!feitas[i];
            return (
              <button
                key={i}
                onClick={() => onAlternar(i)}
                aria-pressed={feita}
                aria-label={`Série ${i + 1}${feita ? " feita" : ""}`}
                className={`flex h-16 w-16 items-center justify-center rounded-full border-4 text-2xl font-bold transition active:scale-90 ${
                  feita ? `${c.bolinha} text-white` : "border-stone-300 text-stone-400 dark:border-stone-600"
                }`}
              >
                {feita ? "✓" : i + 1}
              </button>
            );
          })}
        </div>

        {ex.descansoSeg ? (
          <button
            onClick={onDescanso}
            className={`mt-5 w-full rounded-2xl border-2 py-4 text-xl font-bold ${c.borda} ${c.texto} active:opacity-70`}
          >
            ⏱ Descanso {ex.descansoSeg}s
          </button>
        ) : null}
      </div>
    </li>
  );
}

function Dado({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="rounded-2xl bg-stone-100 px-2 py-3 dark:bg-stone-800">
      <dt className="text-sm font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">{rotulo}</dt>
      <dd className="mt-1 text-xl font-bold leading-tight">{valor}</dd>
    </div>
  );
}
