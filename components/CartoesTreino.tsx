"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { treinos, type Treino } from "@/data/treinos";
import { resumoSessao } from "@/lib/registo";
import { diaCompleto, diaNumero, duracaoEstimada, temaClasse } from "@/lib/tema";
import { Chevron, IconeTreino, Relogio } from "./Icones";

function proximoTreino(hoje: number): { treino: Treino; emDias: number } {
  let melhor = { treino: treinos[0], emDias: 8 };
  for (const t of treinos) {
    const emDias = (diaNumero[t.dia] - hoje + 7) % 7 || 7;
    if (emDias < melhor.emDias) melhor = { treino: t, emDias };
  }
  return melhor;
}

const quando = (emDias: number) => (emDias === 1 ? "amanhã" : `daqui a ${emDias} dias`);

type Resumo = { concluidos: number; comecado: boolean };

export default function CartoesTreino() {
  // Calculado só no telemóvel (cliente), para usar a data certa e o progresso guardado.
  const [diaHoje, setDiaHoje] = useState<number | null>(null);
  const [resumos, setResumos] = useState<Record<string, Resumo>>({});

  useEffect(() => {
    setDiaHoje(new Date().getDay());
    const r: Record<string, Resumo> = {};
    for (const t of treinos) {
      r[t.slug] = resumoSessao(t.slug, Object.fromEntries(t.exercicios.map((e) => [e.id, e.series])));
    }
    setResumos(r);
  }, []);

  const treinoHoje = diaHoje === null ? undefined : treinos.find((t) => diaNumero[t.dia] === diaHoje);
  const proximo = diaHoje !== null && !treinoHoje ? proximoTreino(diaHoje) : null;
  const recomendado = treinoHoje?.slug ?? proximo?.treino.slug;

  return (
    <>
      <header className="anim-entrar">
        <h1 className="text-[34px] font-extrabold leading-tight tracking-tight">Olá! Vamos treinar?</h1>
        <p className="mt-2 min-h-[3.25rem] text-[19px] leading-snug text-label-2">
          {treinoHoje && (
            <>
              Hoje é dia de <strong className="text-label">{treinoHoje.titulo}</strong>. Carrega no botão verde para
              começar.
            </>
          )}
          {proximo && (
            <>
              Hoje é dia de descanso. O próximo treino é{" "}
              <strong className="text-label">
                {proximo.treino.titulo} ({proximo.treino.dia.toLowerCase()})
              </strong>
              , {quando(proximo.emDias)}.
            </>
          )}
        </p>
      </header>

      <ul className="mt-6 space-y-4">
        {treinos.map((t, i) => {
          const eRecomendado = recomendado === t.slug;
          const eHoje = treinoHoje?.slug === t.slug;
          const r = resumos[t.slug];
          const total = t.exercicios.length;
          const emCurso = r?.comecado && r.concluidos < total;
          return (
            <li key={t.slug} className="anim-entrar" style={{ animationDelay: `${60 * (i + 1)}ms` }}>
              <Link
                href={`/treino/${t.slug}`}
                className={`${temaClasse[t.slug]} block rounded-[24px] border bg-card p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition active:scale-[0.98] ${
                  eRecomendado ? "border-green-ring border-2" : "border-line"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[15px] font-bold uppercase tracking-wider text-label-2">
                    {diaCompleto[t.dia]}
                  </span>
                  {eRecomendado && (
                    <span className="rounded-full bg-green-soft px-3 py-1 text-[15px] font-bold text-green-text">
                      {eHoje ? "Treino de hoje" : `Próximo · ${proximo ? quando(proximo.emDias) : ""}`}
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-center gap-4">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[16px] bg-icone-soft text-icone">
                    <IconeTreino slug={t.slug} className="h-7 w-7" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[28px] font-extrabold leading-tight">{t.titulo}</p>
                    {t.descricao && <p className="text-[17px] leading-snug text-label-2">{t.descricao}</p>}
                  </div>
                </div>

                <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[17px] text-label-2">
                  <span>
                    <strong className="font-semibold text-label">{total}</strong> exercícios
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Relogio className="h-[18px] w-[18px]" />
                    cerca de <strong className="font-semibold text-label">{duracaoEstimada(t.exercicios)} min</strong>
                  </span>
                </p>

                {emCurso && (
                  <p className="mt-3 text-[16px] font-semibold text-green-text">
                    Em curso: {r.concluidos} de {total} exercícios feitos
                  </p>
                )}

                <span
                  className={`mt-5 flex h-[58px] items-center justify-center gap-2 rounded-[16px] text-[19px] font-bold ${
                    eRecomendado ? "bg-green text-on-green" : "bg-fill text-label"
                  }`}
                >
                  {emCurso ? "Continuar treino" : eRecomendado ? "Começar treino" : "Ver treino"}
                  <Chevron className="h-5 w-5" />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
