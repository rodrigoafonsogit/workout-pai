"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Exercicio, Treino } from "@/data/treinos";
import {
  carregarSessao,
  concluirSessao,
  formatarKg,
  gravarSessao,
  lerKg,
  lerPesos,
  type Pesos,
  type Sessao,
} from "@/lib/registo";
import { diaCompleto, duracaoEstimada, formatarDescanso, serieCompleta, temaClasse } from "@/lib/tema";
import { Chevron, IconeTreino, Relogio, Repetir, Visto, Voltar } from "./Icones";
import Video from "./Video";

type Temporizador = { fim: number; total: number; nome: string } | null;

const relogio = (seg: number) => `${Math.floor(seg / 60)}:${String(seg % 60).padStart(2, "0")}`;

export default function TreinoView({ treino }: { treino: Treino }) {
  const { slug, exercicios } = treino;

  // ── Barra de navegação: o título aparece ao fazer scroll ──
  const [compacto, setCompacto] = useState(false);
  useEffect(() => {
    const onScroll = () => setCompacto(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Sessão (séries marcadas + pesos de hoje) e pesos do último treino ──
  const [sessao, setSessao] = useState<Sessao | null>(null);
  const [pesos, setPesos] = useState<Pesos>({});
  const [concluido, setConcluido] = useState(false);
  const [abertos, setAbertos] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setSessao(carregarSessao(slug));
    setPesos(lerPesos());
  }, [slug]);

  useEffect(() => {
    if (sessao) gravarSessao(slug, sessao);
  }, [sessao, slug]);

  const feitas = sessao?.feitas ?? {};
  const completo = (ex: Exercicio) => serieCompleta(feitas[ex.id], ex.series);
  const nConcluidos = exercicios.filter(completo).length;
  const atual = exercicios.find((e) => !completo(e));
  const tudoFeito = nConcluidos === exercicios.length;

  const irPara = (id: string) =>
    document.getElementById(`ex-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });

  const alternarSerie = (ex: Exercicio, i: number) => {
    if (!sessao) return;
    const lista = Array.from({ length: ex.series }, (_, k) => sessao.feitas[ex.id]?.[k] ?? false);
    lista[i] = !lista[i];
    setSessao({ ...sessao, feitas: { ...sessao.feitas, [ex.id]: lista } });

    // Quando o exercício fica completo, desliza até ao seguinte.
    if (lista.every(Boolean)) {
      const idx = exercicios.findIndex((e) => e.id === ex.id);
      const seguinte = exercicios.slice(idx + 1).find((e) => !completo(e));
      setAbertos((a) => ({ ...a, [ex.id]: false }));
      if (seguinte) setTimeout(() => irPara(seguinte.id), 450);
    }
  };

  const mudarPeso = (ex: Exercicio, texto: string) => {
    if (!sessao) return;
    const limpo = texto.replace(/[^\d.,]/g, "").replace(/([.,].*)[.,]/, "$1").slice(0, 6);
    setSessao({ ...sessao, hoje: { ...sessao.hoje, [ex.id]: limpo } });
  };

  const concluir = () => {
    if (!sessao) return;
    if (!tudoFeito && !confirm("Ainda há séries por marcar. Concluir o treino na mesma?\nOs pesos de hoje ficam guardados."))
      return;
    setPesos(concluirSessao(slug, sessao));
    setSessao({ data: sessao.data, feitas: {}, hoje: {} });
    setAbertos({});
    setTemp(null);
    setTerminou(false);
    setConcluido(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const recomecar = () => {
    if (!sessao) return;
    if (confirm("Recomeçar o treino?\nAs séries marcadas vão ser limpas. Os pesos de hoje mantêm-se.")) {
      setSessao({ ...sessao, feitas: {} });
      setAbertos({});
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // ── Temporizador de descanso ──
  const [temp, setTemp] = useState<Temporizador>(null);
  const [ultimoDescanso, setUltimoDescanso] = useState<{ seg: number; nome: string } | null>(null);
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
    const id = setTimeout(() => setTerminou(false), 10000);
    return () => clearTimeout(id);
  }, [terminou]);

  const iniciarDescanso = (seg: number, nome: string) => {
    try {
      // O som só pode ser ativado com um toque do utilizador (regra dos browsers).
      const AC =
        window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioRef.current && AC) audioRef.current = new AC();
      audioRef.current?.resume();
    } catch {}
    setTerminou(false);
    setUltimoDescanso({ seg, nome });
    setTemp({ fim: Date.now() + seg * 1000, total: seg, nome });
  };

  const duracao = duracaoEstimada(exercicios);

  return (
    <div className={temaClasse[slug]}>
      {/* Barra de navegação */}
      <nav
        className={`sticky top-0 z-40 pt-[env(safe-area-inset-top)] backdrop-blur-xl transition-colors ${
          compacto ? "border-b border-line bg-bar" : "border-b border-transparent bg-bg"
        }`}
      >
        <div className="relative mx-auto flex h-14 max-w-xl items-center justify-between px-2">
          <Link
            href="/"
            className="relative z-10 flex h-12 items-center rounded-[12px] pr-3 text-[18px] font-semibold text-green-text active:opacity-50"
          >
            <Voltar className="h-7 w-7" />
            Início
          </Link>
          <p
            className={`pointer-events-none absolute inset-x-0 text-center text-[18px] font-bold transition-opacity ${
              compacto ? "opacity-100" : "opacity-0"
            }`}
          >
            {treino.titulo}
          </p>
          <span
            className={`relative z-10 pr-3 text-[16px] font-semibold tabular-nums text-label-2 transition-opacity ${
              compacto && sessao ? "opacity-100" : "opacity-0"
            }`}
          >
            {nConcluidos}/{exercicios.length}
          </span>
        </div>
      </nav>

      <main className="mx-auto max-w-xl px-4 pb-48">
        {/* Cabeçalho */}
        <header className="anim-entrar flex items-center gap-4 pt-2">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[18px] bg-icone-soft text-icone">
            <IconeTreino slug={slug} className="h-8 w-8" />
          </span>
          <div className="min-w-0">
            <p className="text-[15px] font-bold uppercase tracking-wider text-label-2">{diaCompleto[treino.dia]}</p>
            <h1 className="text-[34px] font-extrabold leading-none tracking-tight">{treino.titulo}</h1>
          </div>
        </header>
        {treino.descricao && <p className="mt-3 text-[18px] text-label-2">{treino.descricao}</p>}
        <p className="mt-1 text-[17px] text-label-2">
          {exercicios.length} exercícios · cerca de {duracao} min
        </p>

        {concluido ? (
          <Concluido onVerDeNovo={() => setConcluido(false)} />
        ) : (
          <>
            {/* Progresso */}
            <section className="anim-entrar mt-5 rounded-[20px] border border-line bg-card p-5">
              <p className="text-[20px] font-bold">
                {sessao ? (
                  tudoFeito ? (
                    "Todos os exercícios feitos!"
                  ) : (
                    <>
                      {nConcluidos} de {exercicios.length} exercícios concluídos
                    </>
                  )
                ) : (
                  " "
                )}
              </p>
              <div className="mt-3 flex gap-1.5" aria-hidden>
                {exercicios.map((e) => (
                  <span
                    key={e.id}
                    className={`h-2.5 flex-1 rounded-full transition-colors duration-300 ${
                      completo(e) ? "bg-green" : e.id === atual?.id ? "bg-green-ring/40" : "bg-fill-strong"
                    }`}
                  />
                ))}
              </div>
              {atual && sessao && (
                <button
                  onClick={() => irPara(atual.id)}
                  className="mt-4 flex w-full items-center gap-3 rounded-[14px] bg-green-soft p-3 text-left active:opacity-70"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-semibold text-green-text">
                      {nConcluidos === 0 ? "Começa por" : "Agora"}
                    </span>
                    <span className="block truncate text-[18px] font-bold text-label">{atual.nome}</span>
                  </span>
                  <Chevron className="h-5 w-5 shrink-0 rotate-90 text-green-text" />
                </button>
              )}
              {tudoFeito && sessao && (
                <button
                  onClick={concluir}
                  className="mt-4 flex h-[58px] w-full items-center justify-center gap-2 rounded-[16px] bg-green text-[19px] font-bold text-on-green active:opacity-80"
                >
                  <Visto className="h-6 w-6" />
                  Concluir treino
                </button>
              )}
            </section>

            {/* Exercícios */}
            <ol className="mt-5 space-y-4">
              {exercicios.map((ex, idx) => {
                const feito = completo(ex);
                return (
                  <li key={ex.id} id={`ex-${ex.id}`} className="scroll-mt-20">
                    {feito && !abertos[ex.id] ? (
                      <CartaoFechado
                        ex={ex}
                        pesoHoje={lerKg(sessao?.hoje[ex.id])}
                        onAbrir={() => setAbertos((a) => ({ ...a, [ex.id]: true }))}
                      />
                    ) : (
                      <CartaoExercicio
                        ex={ex}
                        numero={idx + 1}
                        atual={ex.id === atual?.id}
                        feito={feito}
                        feitas={feitas[ex.id] ?? []}
                        ultimo={pesos[ex.id]?.kg}
                        pesoHoje={sessao?.hoje[ex.id]}
                        onPeso={(t) => mudarPeso(ex, t)}
                        onSerie={(i) => alternarSerie(ex, i)}
                        onDescanso={() => ex.descansoSeg && iniciarDescanso(ex.descansoSeg, ex.nome)}
                        onFechar={() => setAbertos((a) => ({ ...a, [ex.id]: false }))}
                      />
                    )}
                  </li>
                );
              })}
            </ol>

            {/* Fim do treino */}
            <section className="mt-8 space-y-3">
              <button
                onClick={concluir}
                className="flex h-[60px] w-full items-center justify-center gap-2 rounded-[18px] bg-green text-[20px] font-bold text-on-green active:opacity-80"
              >
                <Visto className="h-6 w-6" />
                Concluir treino
              </button>
              <p className="px-2 text-center text-[16px] text-label-2">
                Ao concluir, os pesos de hoje ficam guardados para a próxima vez.
              </p>
              <button
                onClick={recomecar}
                className="flex h-[54px] w-full items-center justify-center gap-2 rounded-[18px] border border-line bg-card text-[18px] font-semibold text-red active:bg-fill"
              >
                <Repetir className="h-5 w-5" />
                Recomeçar treino
              </button>
            </section>
          </>
        )}
      </main>

      {/* Temporizador */}
      {(temp || terminou) && (
        <div className="anim-subir fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="mx-auto max-w-xl overflow-hidden rounded-[26px] border border-line bg-bar shadow-[0_10px_40px_rgba(0,0,0,0.2)] backdrop-blur-2xl">
            {temp ? (
              <>
                <div className="p-4">
                  <p className="truncate text-[16px] font-semibold text-label-2">Descanso · {temp.nome}</p>
                  <p className="mt-1 text-[64px] font-extrabold leading-none tracking-tight tabular-nums">
                    {relogio(restante)}
                  </p>
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setTemp((t) => t && { ...t, fim: t.fim + 15000, total: t.total + 15 })}
                      className="h-14 rounded-[14px] bg-fill text-[18px] font-bold active:bg-fill-strong"
                    >
                      +15 s
                    </button>
                    <button
                      onClick={() => ultimoDescanso && iniciarDescanso(ultimoDescanso.seg, ultimoDescanso.nome)}
                      className="flex h-14 items-center justify-center gap-1.5 rounded-[14px] bg-fill text-[18px] font-bold active:bg-fill-strong"
                    >
                      <Repetir className="h-5 w-5" />
                      Do início
                    </button>
                    <button
                      onClick={() => setTemp(null)}
                      className="h-14 rounded-[14px] bg-green text-[18px] font-bold text-on-green active:opacity-80"
                    >
                      Parar
                    </button>
                  </div>
                </div>
                <div className="h-1.5 bg-fill">
                  <div
                    className="h-full bg-green transition-[width] duration-300 ease-linear"
                    style={{ width: `${(restante / temp.total) * 100}%` }}
                  />
                </div>
              </>
            ) : (
              <div className="p-4">
                <p className="flex items-center gap-3 text-[22px] font-bold">
                  <span className="anim-pop flex h-10 w-10 items-center justify-center rounded-full bg-green text-on-green">
                    <Visto className="h-6 w-6" />
                  </span>
                  Descanso terminado!
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => ultimoDescanso && iniciarDescanso(ultimoDescanso.seg, ultimoDescanso.nome)}
                    className="flex h-14 items-center justify-center gap-2 rounded-[14px] bg-fill text-[18px] font-bold active:bg-fill-strong"
                  >
                    <Repetir className="h-5 w-5" />
                    Descansar outra vez
                  </button>
                  <button
                    onClick={() => setTerminou(false)}
                    className="h-14 rounded-[14px] bg-green text-[18px] font-bold text-on-green active:opacity-80"
                  >
                    OK
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Concluido({ onVerDeNovo }: { onVerDeNovo: () => void }) {
  return (
    <section className="anim-entrar mt-6 rounded-[24px] border border-line bg-card p-6 text-center">
      <span className="anim-pop mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green text-on-green">
        <Visto className="h-11 w-11" />
      </span>
      <h2 className="mt-4 text-[28px] font-extrabold">Treino concluído!</h2>
      <p className="mt-2 text-[18px] text-label-2">Muito bem. Os pesos de hoje ficaram guardados para a próxima vez.</p>
      <Link
        href="/"
        className="mt-6 flex h-[58px] items-center justify-center rounded-[16px] bg-green text-[19px] font-bold text-on-green active:opacity-80"
      >
        Voltar ao início
      </Link>
      <button onClick={onVerDeNovo} className="mt-3 h-12 w-full text-[17px] font-semibold text-green-text">
        Ver o treino outra vez
      </button>
    </section>
  );
}

function CartaoFechado({ ex, pesoHoje, onAbrir }: { ex: Exercicio; pesoHoje: number | null; onAbrir: () => void }) {
  return (
    <button
      onClick={onAbrir}
      className="anim-entrar flex w-full items-center gap-4 rounded-[20px] border border-line bg-card p-4 text-left active:bg-fill"
    >
      <span className="anim-pop flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green text-on-green">
        <Visto className="h-6 w-6" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[19px] font-bold">{ex.nome}</span>
        <span className="block text-[16px] text-green-text">
          Concluído{pesoHoje !== null ? ` · ${formatarKg(pesoHoje)} kg` : ""}
        </span>
      </span>
      <span className="text-[16px] font-semibold text-label-2">Abrir</span>
    </button>
  );
}

function CartaoExercicio({
  ex,
  numero,
  atual,
  feito,
  feitas,
  ultimo,
  pesoHoje,
  onPeso,
  onSerie,
  onDescanso,
  onFechar,
}: {
  ex: Exercicio;
  numero: number;
  atual: boolean;
  feito: boolean;
  feitas: boolean[];
  ultimo?: number;
  pesoHoje?: string;
  onPeso: (t: string) => void;
  onSerie: (i: number) => void;
  onDescanso: () => void;
  onFechar: () => void;
}) {
  const [videoAtivo, setVideoAtivo] = useState(0);
  const videos = ex.videos.slice(0, 2);
  const valorPeso = pesoHoje ?? (ultimo !== undefined ? formatarKg(ultimo) : "");

  return (
    <article
      className={`rounded-[22px] bg-card p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)] ${
        atual ? "border-2 border-green-ring" : "border border-line"
      }`}
    >
      {/* 1. Nome */}
      {atual && (
        <span className="mb-2 inline-block rounded-full bg-green px-3 py-1 text-[14px] font-bold uppercase tracking-wide text-on-green">
          A fazer agora
        </span>
      )}
      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[17px] font-bold tabular-nums ${
            feito ? "bg-green text-on-green" : "bg-fill text-label-2"
          }`}
        >
          {feito ? <Visto className="h-5 w-5" /> : numero}
        </span>
        <h2 className="flex-1 text-[24px] font-extrabold leading-tight">{ex.nome}</h2>
        {feito && (
          <button onClick={onFechar} className="h-9 rounded-full bg-fill px-3 text-[15px] font-semibold active:bg-fill-strong">
            Fechar
          </button>
        )}
      </div>

      {/* 2. Vídeo */}
      {videos.length > 0 && (
        <div className="mt-4">
          {videos.length > 1 && (
            <div className="mb-3 grid grid-cols-2 gap-1 rounded-[14px] bg-fill p-1" role="tablist">
              {videos.map((v, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={videoAtivo === i}
                  onClick={() => setVideoAtivo(i)}
                  className={`h-11 rounded-[11px] text-[17px] font-semibold transition ${
                    videoAtivo === i ? "bg-card shadow-[0_1px_4px_rgba(0,0,0,0.12)]" : "text-label-2"
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          )}
          <Video
            key={videos[videoAtivo].url}
            url={videos[videoAtivo].url}
            titulo={`${ex.nome} — ${videos[videoAtivo].label}`}
          />
        </div>
      )}

      {/* 3. Séries e repetições */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Dado rotulo="Séries" valor={String(ex.series)} />
        <Dado rotulo="Repetições" valor={ex.repeticoes} />
      </div>

      {/* 4. Peso */}
      {!ex.semPeso && (
        <div className="mt-3 rounded-[16px] bg-fill p-4">
          <p className="flex items-baseline justify-between gap-2 text-[17px]">
            <span className="text-label-2">Último treino</span>
            <span className="font-bold">{ultimo !== undefined ? `${formatarKg(ultimo)} kg` : "Primeiro registo"}</span>
          </p>
          <label className="mt-3 block">
            <span className="text-[17px] font-semibold">Peso de hoje</span>
            <span className="mt-1.5 flex items-center rounded-[14px] border-2 border-line bg-card transition-colors focus-within:border-green-ring">
              <input
                type="text"
                inputMode="decimal"
                autoComplete="off"
                enterKeyHint="done"
                placeholder="0"
                value={valorPeso}
                onChange={(e) => onPeso(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
                onFocus={(e) => e.target.select()}
                className="h-14 min-w-0 flex-1 bg-transparent px-4 text-[26px] font-bold tabular-nums outline-none placeholder:text-label-3"
              />
              <span className="pr-4 text-[20px] font-semibold text-label-2">kg</span>
            </span>
          </label>
        </div>
      )}

      {/* 5. Instruções */}
      {ex.notas && (
        <div className="mt-4">
          <p className="text-[15px] font-bold uppercase tracking-wider text-label-2">Como fazer</p>
          <p className="mt-1 text-[18px] leading-snug">{ex.notas}</p>
        </div>
      )}

      {/* Marcar séries */}
      <div className="mt-5">
        <p className="text-[15px] font-bold uppercase tracking-wider text-label-2">Marca cada série que fizeres</p>
        <div
          className="mt-2 grid gap-2"
          style={{ gridTemplateColumns: `repeat(${Math.min(ex.series, 4)}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: ex.series }).map((_, i) => {
            const feita = !!feitas[i];
            return (
              <button
                key={`${i}-${feita}`}
                onClick={() => onSerie(i)}
                aria-pressed={feita}
                aria-label={`Série ${i + 1}${feita ? " feita" : ""}`}
                className={`flex h-[72px] flex-col items-center justify-center rounded-[16px] text-[17px] font-bold transition active:scale-95 ${
                  feita ? "anim-pop bg-green text-on-green" : "border-2 border-fill-strong bg-card text-label"
                }`}
              >
                {feita ? <Visto className="h-7 w-7" /> : <span className="text-[24px] leading-none">{i + 1}</span>}
                <span className={`mt-0.5 text-[13px] font-semibold ${feita ? "" : "text-label-2"}`}>
                  {feita ? "Feita" : "Série"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Descanso */}
      {ex.descansoSeg ? (
        <button
          onClick={onDescanso}
          className="mt-3 flex h-[58px] w-full items-center justify-center gap-2 rounded-[16px] bg-green-soft text-[18px] font-bold text-green-text active:opacity-70"
        >
          <Relogio className="h-6 w-6" />
          Descansar {formatarDescanso(ex.descansoSeg)}
        </button>
      ) : null}
    </article>
  );
}

function Dado({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="rounded-[16px] bg-fill px-3 py-3 text-center">
      <p className="text-[15px] font-semibold text-label-2">{rotulo}</p>
      <p className="mt-0.5 text-[26px] font-extrabold leading-tight">{valor}</p>
    </div>
  );
}
