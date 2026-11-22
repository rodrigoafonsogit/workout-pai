"use client";

import { useRef, useState } from "react";
import { EcraInteiro, Play } from "./Icones";

/** Extrai o ID de 11 caracteres de um link do YouTube (normal, youtu.be, shorts, embed, live). */
export function youtubeId(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^(www\.|m\.)/, "");
    let id: string | null = null;
    if (host === "youtu.be") id = u.pathname.slice(1).split("/")[0];
    else if (host === "youtube.com" || host === "youtube-nocookie.com") {
      if (u.pathname === "/watch") id = u.searchParams.get("v");
      else {
        const m = u.pathname.match(/^\/(shorts|embed|live|v)\/([^/?#]+)/);
        if (m) id = m[2];
      }
    }
    return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

const eShort = (url: string) => /youtube\.com\/shorts\//.test(url);
const eFicheiroVideo = (url: string) => /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url);
const eImagem = (url: string) => /\.(svg|png|jpe?g|webp|gif)(\?.*)?$/i.test(url);

function Indisponivel() {
  return (
    <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-[16px] bg-fill text-label-2">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-fill-strong">
        <Play className="ml-0.5 h-6 w-6" />
      </span>
      <span className="text-[17px]">Vídeo em breve</span>
    </div>
  );
}

function BotaoEcraInteiro({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-[14px] bg-fill text-[17px] font-semibold text-label active:bg-fill-strong"
    >
      <EcraInteiro className="h-5 w-5" />
      Ver em ecrã inteiro
    </button>
  );
}

type VideoComEcraInteiro = HTMLVideoElement & { webkitEnterFullscreen?: () => void };

export default function Video({ url, titulo }: { url: string; titulo: string }) {
  const [erro, setErro] = useState(false);
  const [imagemAberta, setImagemAberta] = useState(false);
  const videoRef = useRef<VideoComEcraInteiro>(null);

  if (url.includes("SUBSTITUIR") || erro) return <Indisponivel />;

  const id = youtubeId(url);
  if (id) {
    // Shorts são verticais; limitamos a largura para não ocupar o ecrã todo.
    const vertical = eShort(url);
    return (
      <div className={vertical ? "mx-auto aspect-[9/16] w-full max-w-[min(100%,20rem)]" : "aspect-video w-full"}>
        <iframe
          className="h-full w-full rounded-[16px] bg-black"
          src={`https://www.youtube-nocookie.com/embed/${id}?rel=0&playsinline=1`}
          title={titulo}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          allowFullScreen
        />
      </div>
    );
  }

  if (eImagem(url)) {
    return (
      <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt={titulo} className="w-full rounded-[16px] bg-white" onError={() => setErro(true)} />
        <BotaoEcraInteiro onClick={() => setImagemAberta(true)} />
        {imagemAberta && (
          <button
            onClick={() => setImagemAberta(false)}
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black p-4"
            aria-label="Fechar"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={titulo} className="max-h-[80vh] w-full rounded-[12px] bg-white object-contain" />
            <span className="mt-6 rounded-full bg-white/15 px-6 py-3 text-[18px] font-semibold text-white">
              Toca para fechar
            </span>
          </button>
        )}
      </>
    );
  }

  if (eFicheiroVideo(url)) {
    const ecraInteiro = () => {
      const v = videoRef.current;
      if (!v) return;
      if (v.requestFullscreen && document.fullscreenEnabled) v.requestFullscreen().catch(() => v.webkitEnterFullscreen?.());
      else v.webkitEnterFullscreen?.();
      v.play().catch(() => {});
    };
    return (
      <>
        <video
          ref={videoRef}
          key={url}
          className="mx-auto max-h-[50vh] w-full rounded-[16px] bg-black object-contain"
          // "#t=0.1" faz o iPhone mostrar a primeira imagem do vídeo antes de carregar em play.
          src={`${url}#t=0.1`}
          controls
          playsInline
          preload="metadata"
          onError={() => setErro(true)}
        />
        <BotaoEcraInteiro onClick={ecraInteiro} />
      </>
    );
  }

  return <Indisponivel />;
}
