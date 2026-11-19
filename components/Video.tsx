"use client";

import { useState } from "react";
import { Play } from "./Icones";

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

function Indisponivel() {
  return (
    <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-[12px] bg-fill text-label-2">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-fill-strong">
        <Play className="ml-0.5 h-5 w-5" />
      </span>
      <span className="text-[15px]">Vídeo em breve</span>
    </div>
  );
}

export default function Video({ url, titulo }: { url: string; titulo: string }) {
  const [erro, setErro] = useState(false);

  if (url.includes("SUBSTITUIR") || erro) return <Indisponivel />;

  const id = youtubeId(url);
  if (id) {
    // Shorts são verticais; limitamos a largura para não ocupar o ecrã todo.
    const vertical = eShort(url);
    return (
      <div className={vertical ? "mx-auto aspect-[9/16] w-full max-w-[min(100%,20rem)]" : "aspect-video w-full"}>
        <iframe
          className="h-full w-full rounded-[12px] bg-black"
          src={`https://www.youtube-nocookie.com/embed/${id}?rel=0&playsinline=1`}
          title={titulo}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  if (eFicheiroVideo(url)) {
    return (
      <video
        key={url}
        className="max-h-[70vh] w-full rounded-[12px] bg-black"
        src={url}
        controls
        playsInline
        preload="metadata"
        onError={() => setErro(true)}
      />
    );
  }

  return <Indisponivel />;
}
