"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { treinos, type Treino } from "@/data/treinos";
import { diaCompleto, diaNumero, tema } from "@/lib/tema";

function proximoTreino(hoje: number): { treino: Treino; emDias: number } {
  let melhor = { treino: treinos[0], emDias: 8 };
  for (const t of treinos) {
    const emDias = (diaNumero[t.dia] - hoje + 7) % 7 || 7;
    if (emDias < melhor.emDias) melhor = { treino: t, emDias };
  }
  return melhor;
}

function quando(emDias: number) {
  return emDias === 1 ? "amanhã" : `daqui a ${emDias} dias`;
}

function saudacao(hora: number) {
  if (hora < 6) return "Boa noite";
  if (hora < 13) return "Bom dia";
  if (hora < 20) return "Boa tarde";
  return "Boa noite";
}

export default function CartoesTreino() {
  // Calculado só no telemóvel (cliente), para usar a data e hora certas.
  const [agora, setAgora] = useState<Date | null>(null);
  useEffect(() => setAgora(new Date()), []);

  const diaHoje = agora?.getDay();
  const treinoHoje = treinos.find((t) => diaNumero[t.dia] === diaHoje);
  const proximo = diaHoje !== undefined && !treinoHoje ? proximoTreino(diaHoje) : null;

  return (
    <>
      <p className="mt-2 min-h-[1.75rem] text-xl text-stone-600 dark:text-stone-400">
        {agora ? `${saudacao(agora.getHours())}, pai! 💪` : ""}
      </p>

      <div className="mt-6 min-h-[4.5rem] rounded-2xl bg-white p-4 text-lg font-semibold shadow-sm dark:bg-stone-900">
        {treinoHoje && (
          <span>
            Hoje é dia de <span className={tema[treinoHoje.slug].texto}>{treinoHoje.titulo}</span>. Bom treino!
          </span>
        )}
        {proximo && (
          <span>
            Hoje é dia de descanso.
            <br />
            Próximo treino:{" "}
            <span className={tema[proximo.treino.slug].texto}>
              {proximo.treino.dia} — {proximo.treino.titulo}
            </span>{" "}
            <span className="font-normal text-stone-500 dark:text-stone-400">({quando(proximo.emDias)})</span>
          </span>
        )}
      </div>

      <ul className="mt-6 space-y-4">
        {treinos.map((t) => {
          const c = tema[t.slug];
          const eHoje = treinoHoje?.slug === t.slug;
          const eProximo = proximo?.treino.slug === t.slug;
          return (
            <li key={t.slug}>
              <Link
                href={`/treino/${t.slug}`}
                className={`block overflow-hidden rounded-3xl bg-white shadow-sm transition active:scale-[0.98] dark:bg-stone-900 ${
                  eHoje ? `ring-4 ${c.anel}` : ""
                }`}
              >
                <div className={`${c.fundo} flex items-center justify-between px-5 py-3 text-white`}>
                  <span className="text-lg font-semibold uppercase tracking-wide">{diaCompleto[t.dia]}</span>
                  {eHoje && <span className="rounded-full bg-white px-3 py-1 text-base font-bold text-stone-900">HOJE</span>}
                  {eProximo && <span className="rounded-full bg-white/25 px-3 py-1 text-base font-semibold">Próximo</span>}
                </div>
                <div className="flex items-center justify-between gap-4 px-5 py-5">
                  <div>
                    <p className={`text-4xl font-extrabold ${c.texto}`}>{t.titulo}</p>
                    {t.descricao && <p className="mt-1 text-lg text-stone-600 dark:text-stone-300">{t.descricao}</p>}
                    <p className="mt-1 text-base text-stone-500 dark:text-stone-400">{t.exercicios.length} exercícios</p>
                  </div>
                  <span aria-hidden className={`text-4xl ${c.texto}`}>
                    ›
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
