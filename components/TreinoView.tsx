"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Exercicio, Treino } from "@/data/treinos";
import { diaCompleto, formatarDescanso, temaClasse } from "@/lib/tema";
import { Relogio, Visto, Voltar } from "./Icones";
import Video from "./Video";

type Feitas = Record<string, boolean[]>;
type Temporizador = { fim: number; total: number; nome: string } | null;

const relogio = (seg: number) => `${Math.floor(seg / 60)}:${String(seg % 60).padStart(2, "0")}`;

export default function TreinoView({ treino }: { treino: Treino }) {
  const chave = `treino-do-pai:${treino.slug}`;

  // ── Barra de navegação: o título aparece ao fazer scroll (como no iOS) ──
  const [compacto, setCompacto] = useState(false);
  useEffect(() => {
    const onScroll = () => setCompacto(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
  const concluido = totalSeries > 0 && seriesFeitas === totalSeries;

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
      const AC =
        window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioRef.current && AC) audioRef.current = new AC();
      audioRef.current?.resume();
    } catch {}
    setTerminou(false);
    setTemp({ fim: Date.now() + ex.descansoSeg * 1000, total: ex.descansoSeg, nome: ex.nome });
  };

  return (
    <div className={temaClasse[treino.slug]}>
      {/* Barra de navegação */}
      <nav
        className={`sticky top-0 z-40 pt-[env(safe-area-inset-top)] backdrop-blur-xl backdrop-saturate-150 transition-colors ${
          compacto ? "border-b border-sep bg-bar" : "border-b border-transparent bg-bg"
        }`}
      >
        <div className="relative mx-auto flex h-11 max-w-xl items-center px-2">
          <Link href="/" className="flex items-center text-[17px] text-accent active:opacity-50">
            <Voltar className="h-6 w-6" />
            <span className="-ml-0.5">Treinos</span>
          </Link>
          <p
            className={`pointer-events-none absolute inset-x-0 text-center text-[17px] font-semibold transition-opacity ${
              compacto ? "opacity-100" : "opacity-0"
            }`}
          >
            {treino.titulo}
          </p>
        </div>
      </nav>

      <main className="mx-auto max-w-xl px-4 pb-40">
        {/* Título grande */}
        <header className="pt-1">
          <p className="text-[13px] font-semibold uppercase tracking-wide text-accent">{diaCompleto[treino.dia]}</p>
          <h1 className="text-[34px] font-bold leading-tight tracking-tight">{treino.titulo}</h1>
          {treino.descricao && <p className="text-[17px] text-label-2">{treino.descricao}</p>}
        </header>

        {/* Progresso */}
        <section className="mt-6 rounded-[14px] bg-card p-4">
          <div className="flex items-baseline justify-between">
            <span className="text-[17px] font-semibold">{concluido ? "Treino concluído" : "Progresso"}</span>
            <span className="text-[15px] tabular-nums text-label-2">
              {seriesFeitas} de {totalSeries} séries
            </span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-fill">
            <div
              className="h-full rounded-full bg-accent transition-[width] duration-300"
              style={{ width: `${totalSeries ? (seriesFeitas / totalSeries) * 100 : 0}%` }}
            />
          </div>
        </section>

        {/* Exercícios */}
        <h2 className="mb-2 mt-8 px-4 text-[13px] uppercase text-label-2">
          Exercícios · {treino.exercicios.length}
        </h2>
        <ol className="space-y-4">
          {treino.exercicios.map((ex, idx) => (
            <CartaoExercicio
              key={ex.id}
              ex={ex}
              numero={idx + 1}
              feitas={feitas[ex.id] ?? []}
              onAlternar={(i) => alternar(ex, i)}
              onDescanso={() => iniciarDescanso(ex)}
            />
          ))}
        </ol>

        <button
          onClick={recomecar}
          className="mt-8 h-[50px] w-full rounded-[14px] bg-card text-[17px] text-red active:bg-fill"
        >
          Recomeçar treino
        </button>
      </main>

      {/* Temporizador */}
      {(temp || terminou) && (
        <div className="fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="mx-auto max-w-xl overflow-hidden rounded-[22px] border border-sep bg-bar shadow-[0_8px_40px_rgba(0,0,0,0.18)] backdrop-blur-2xl backdrop-saturate-150">
            {temp ? (
              <>
                <div className="flex items-center gap-3 p-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] text-label-2">Descanso · {temp.nome}</p>
                    <p className="text-[44px] font-semibold leading-none tracking-tight tabular-nums">
                      {relogio(restante)}
                    </p>
                  </div>
                  <button
                    onClick={() => setTemp((t) => t && { ...t, fim: t.fim + 15000, total: t.total + 15 })}
                    className="h-11 rounded-full bg-fill px-4 text-[15px] font-semibold active:bg-fill-strong"
                  >
                    +15 s
                  </button>
                  <button
                    onClick={() => setTemp(null)}
                    className="h-11 rounded-full bg-accent px-5 text-[15px] font-semibold text-white active:opacity-80"
                  >
                    Parar
                  </button>
                </div>
                <div className="h-1 bg-fill">
                  <div
                    className="h-full bg-accent transition-[width] duration-300 ease-linear"
                    style={{ width: `${(restante / temp.total) * 100}%` }}
                  />
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center gap-2 p-5 text-[17px] font-semibold">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-white">
                  <Visto className="h-4 w-4" />
                </span>
                Descanso terminado
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CartaoExercicio({
  ex,
  numero,
  feitas,
  onAlternar,
  onDescanso,
}: {
  ex: Exercicio;
  numero: number;
  feitas: boolean[];
  onAlternar: (i: number) => void;
  onDescanso: () => void;
}) {
  const [videoAtivo, setVideoAtivo] = useState(0);
  const videos = ex.videos.slice(0, 2);
  const completo = Array.from({ length: ex.series }).every((_, i) => feitas[i]);

  return (
    <li className="overflow-hidden rounded-[14px] bg-card">
      {/* Cabeçalho */}
      <div className="flex items-start gap-3 px-4 pt-4">
        <span
          className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[15px] font-semibold tabular-nums ${
            completo ? "bg-accent text-white" : "bg-fill text-label-2"
          }`}
        >
          {completo ? <Visto className="h-4 w-4" /> : numero}
        </span>
        <h3 className="text-[20px] font-semibold leading-snug">{ex.nome}</h3>
      </div>

      {/* Séries · Repetições · Descanso */}
      <dl className="mx-4 mt-4 grid grid-cols-3 divide-x divide-sep rounded-[12px] bg-fill py-2.5">
        <Dado rotulo="Séries" valor={String(ex.series)} />
        <Dado rotulo="Repetições" valor={ex.repeticoes} />
        <Dado rotulo="Descanso" valor={ex.descansoSeg ? formatarDescanso(ex.descansoSeg) : "—"} />
      </dl>

      {ex.notas && <p className="px-4 pt-3 text-[15px] leading-snug text-label-2">{ex.notas}</p>}

      {/* Vídeos */}
      {videos.length > 0 && (
        <div className="px-4 pt-4">
          {videos.length > 1 ? (
            <div className="mb-3 grid grid-cols-2 rounded-[9px] bg-fill p-0.5" role="tablist">
              {videos.map((v, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={videoAtivo === i}
                  onClick={() => setVideoAtivo(i)}
                  className={`h-9 rounded-[7px] text-[15px] font-medium transition ${
                    videoAtivo === i ? "bg-card font-semibold shadow-[0_1px_4px_rgba(0,0,0,0.12)]" : "text-label"
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          ) : (
            <p className="mb-2 text-[13px] uppercase text-label-2">{videos[0].label}</p>
          )}
          <Video
            key={videos[videoAtivo].url}
            url={videos[videoAtivo].url}
            titulo={`${ex.nome} — ${videos[videoAtivo].label}`}
          />
        </div>
      )}

      {/* Marcar séries */}
      <div className="mt-4 border-t border-sep p-4">
        <p className="mb-3 text-[13px] uppercase text-label-2">Séries feitas</p>
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: ex.series }).map((_, i) => {
            const feita = !!feitas[i];
            return (
              <button
                key={i}
                onClick={() => onAlternar(i)}
                aria-pressed={feita}
                aria-label={`Série ${i + 1}${feita ? " feita" : ""}`}
                className={`flex h-[52px] w-[52px] items-center justify-center rounded-full text-[19px] font-semibold tabular-nums transition active:scale-90 ${
                  feita ? "bg-accent text-white" : "border-2 border-fill-strong text-label-2"
                }`}
              >
                {feita ? <Visto className="h-6 w-6" /> : i + 1}
              </button>
            );
          })}
        </div>

        {ex.descansoSeg ? (
          <button
            onClick={onDescanso}
            className="mt-4 flex h-[50px] w-full items-center justify-center gap-2 rounded-[12px] bg-accent/15 text-[17px] font-semibold text-accent active:bg-accent/25"
          >
            <Relogio className="h-5 w-5" />
            Iniciar descanso · {formatarDescanso(ex.descansoSeg)}
          </button>
        ) : null}
      </div>
    </li>
  );
}

function Dado({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="px-2 text-center">
      <dt className="text-[12px] text-label-2">{rotulo}</dt>
      <dd className="mt-0.5 text-[17px] font-semibold leading-tight">{valor}</dd>
    </div>
  );
}
