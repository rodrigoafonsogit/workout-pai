import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import TreinoView from "@/components/TreinoView";
import { getTreino, treinos } from "@/data/treinos";
import { diaCompleto, tema } from "@/lib/tema";

export const dynamicParams = false;

export function generateStaticParams() {
  return treinos.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const t = getTreino(slug);
  return { title: t ? `${t.titulo} · Treino do Pai` : "Treino do Pai" };
}

export default async function PaginaTreino({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const treino = getTreino(slug);
  if (!treino) notFound();
  const c = tema[treino.slug];

  return (
    <main>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-xl py-2 pr-4 text-lg font-semibold text-stone-600 active:opacity-60 dark:text-stone-300"
      >
        ‹ Voltar
      </Link>

      <header className={`mt-2 rounded-3xl p-5 text-white ${c.fundo}`}>
        <p className="text-lg font-semibold uppercase tracking-wide opacity-90">{diaCompleto[treino.dia]}</p>
        <h1 className="text-4xl font-extrabold">Treino {treino.titulo}</h1>
        {treino.descricao && <p className="mt-1 text-xl opacity-95">{treino.descricao}</p>}
      </header>

      <TreinoView treino={treino} />
    </main>
  );
}
