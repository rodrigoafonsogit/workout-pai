"use client";

import { useState } from "react";

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

function eShort(url: string) {
  return /youtube\.com\/shorts\//.test(url);
}

function eFicheiroVideo(url: string) {
  return /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url);
}

function Indisponivel() {
  return (
    <div className="flex aspect-video w-full items-center justify-center rounded-2xl bg-stone-200 text-lg text-stone-500 dark:bg-stone-800 dark:text-stone-400">
      🎬 Vídeo em breve
    </div>
  );
}

export default function Video({ url, titulo }: { url: string; titulo: string }) {
  const [erro, setErro] = useState(false);

  if (url.includes("SUBSTITUIR") || erro) return <Indisponivel />;

  const id = youtubeId(url);
  if (id) {
    // Shorts são verticais; limitamos a altura para não ocupar o ecrã todo.
    const vertical = eShort(url);
    return (
      <div className={vertical ? "mx-auto aspect-[9/16] w-full max-w-[min(100%,22rem)]" : "aspect-video w-full"}>
        <iframe
          className="h-full w-full rounded-2xl bg-black"
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
        className="max-h-[70vh] w-full rounded-2xl bg-black"
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
