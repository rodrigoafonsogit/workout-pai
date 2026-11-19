"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { treinos, type Treino } from "@/data/treinos";
import { diaNumero, temaClasse } from "@/lib/tema";
import { Chevron, IconeTreino } from "./Icones";

function proximoTreino(hoje: number): { treino: Treino; emDias: number } {
  let melhor = { treino: treinos[0], emDias: 8 };
  for (const t of treinos) {
    const emDias = (diaNumero[t.dia] - hoje + 7) % 7 || 7;
    if (emDias < melhor.emDias) melhor = { treino: t, emDias };
  }
  return melhor;
}

const quando = (emDias: number) => (emDias === 1 ? "amanhã" : `daqui a ${emDias} dias`);

function dataHoje(d: Date) {
  const s = d.toLocaleDateString("pt-PT", { weekday: "long", day: "numeric", month: "long" });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function IconeQuadrado({ slug, grande = false }: { slug: Treino["slug"]; grande?: boolean }) {
  return (
    <span
      className={`${temaClasse[slug]} flex shrink-0 items-center justify-center bg-accent text-white ${
        grande ? "h-12 w-12 rounded-[12px]" : "h-9 w-9 rounded-[9px]"
      }`}
    >
      <IconeTreino slug={slug} className={grande ? "h-6 w-6" : "h-5 w-5"} />
    </span>
  );
}

export default function CartoesTreino() {
  // Calculado só no telemóvel (cliente), para usar a data certa.
  const [agora, setAgora] = useState<Date | null>(null);
  useEffect(() => setAgora(new Date()), []);

  const diaHoje = agora?.getDay();
  const treinoHoje = treinos.find((t) => diaNumero[t.dia] === diaHoje);
  const proximo = diaHoje !== undefined && !treinoHoje ? proximoTreino(diaHoje) : null;

  return (
    <>
      <p className="h-5 text-[13px] font-semibold uppercase tracking-wide text-label-2">{agora ? dataHoje(agora) : ""}</p>
      <h1 className="mt-1 text-[34px] font-bold leading-tight tracking-tight">Treino do Pai</h1>

      {/* Hoje */}
      <h2 className="mb-2 mt-8 px-4 text-[13px] uppercase text-label-2">Hoje</h2>
      <section className="min-h-[148px] rounded-[14px] bg-card">
        {treinoHoje && (
          <div className={`${temaClasse[treinoHoje.slug]} p-4`}>
            <div className="flex items-center gap-3">
              <IconeQuadrado slug={treinoHoje.slug} grande />
              <div>
                <p className="text-[22px] font-bold leading-tight">Treino {treinoHoje.titulo}</p>
                <p className="text-[15px] text-label-2">
                  {treinoHoje.descricao} · {treinoHoje.exercicios.length} exercícios
                </p>
              </div>
            </div>
            <Link
              href={`/treino/${treinoHoje.slug}`}
              className="mt-4 flex h-[50px] items-center justify-center rounded-[12px] bg-accent text-[17px] font-semibold text-white active:opacity-80"
            >
              Começar treino
            </Link>
          </div>
        )}
        {proximo && (
          <div className="p-4">
            <p className="text-[22px] font-bold leading-tight">Dia de descanso</p>
            <p className="mt-0.5 text-[15px] text-label-2">Recupera bem. O próximo treino é {quando(proximo.emDias)}.</p>
            <Link
              href={`/treino/${proximo.treino.slug}`}
              className="mt-4 flex items-center gap-3 rounded-[12px] bg-fill p-3 active:bg-fill-strong"
            >
              <IconeQuadrado slug={proximo.treino.slug} />
              <div className="min-w-0 flex-1">
                <p className="text-[13px] text-label-2">Próximo · {proximo.treino.dia}</p>
                <p className="font-semibold">Treino {proximo.treino.titulo}</p>
              </div>
              <Chevron className="h-4 w-4 text-label-3" />
            </Link>
          </div>
        )}
      </section>

      {/* Semana */}
      <h2 className="mb-2 mt-8 px-4 text-[13px] uppercase text-label-2">Esta semana</h2>
      <ul className="overflow-hidden rounded-[14px] bg-card">
        {treinos.map((t, i) => {
          const eHoje = treinoHoje?.slug === t.slug;
          return (
            <li key={t.slug}>
              <Link href={`/treino/${t.slug}`} className="flex items-center gap-3 pl-4 active:bg-fill">
                <IconeQuadrado slug={t.slug} />
                <div className={`flex min-w-0 flex-1 items-center gap-2 py-3 pr-4 ${i > 0 ? "border-t border-sep" : ""}`}>
                  <div className="min-w-0 flex-1">
                    <p className="text-[17px] font-semibold">{t.titulo}</p>
                    <p className="truncate text-[15px] text-label-2">
                      {t.dia} · {t.descricao}
                    </p>
                  </div>
                  {eHoje && (
                    <span className={`${temaClasse[t.slug]} text-[15px] font-semibold text-accent`}>Hoje</span>
                  )}
                  <Chevron className="h-4 w-4 shrink-0 text-label-3" />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
