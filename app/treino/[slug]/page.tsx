import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TreinoView from "@/components/TreinoView";
import { getTreino, treinos } from "@/data/treinos";

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
  return <TreinoView treino={treino} />;
}
