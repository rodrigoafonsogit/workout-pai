type P = { className?: string };

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
  "aria-hidden": true,
};

export const Chevron = ({ className = "h-5 w-5" }: P) => (
  <svg {...base} strokeWidth={2.6} className={className}>
    <path d="M9 5l7 7-7 7" />
  </svg>
);

export const Voltar = ({ className = "h-6 w-6" }: P) => (
  <svg {...base} strokeWidth={2.6} className={className}>
    <path d="M15 5l-7 7 7 7" />
  </svg>
);

export const Visto = ({ className = "h-5 w-5" }: P) => (
  <svg {...base} strokeWidth={3} className={className}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

export const Relogio = ({ className = "h-5 w-5" }: P) => (
  <svg {...base} className={className}>
    <circle cx="12" cy="13" r="8" />
    <path d="M12 9v4l2.5 2.5M10 2h4" />
  </svg>
);

export const Repetir = ({ className = "h-5 w-5" }: P) => (
  <svg {...base} className={className}>
    <path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4" />
  </svg>
);

export const EcraInteiro = ({ className = "h-5 w-5" }: P) => (
  <svg {...base} className={className}>
    <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
  </svg>
);

export const Haltere = ({ className = "h-5 w-5" }: P) => (
  <svg {...base} className={className}>
    <path d="M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11" />
  </svg>
);

export const Play = ({ className = "h-6 w-6" }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
    <path d="M8 5.5v13a1 1 0 001.5.86l10.5-6.5a1 1 0 000-1.72L9.5 4.64A1 1 0 008 5.5z" />
  </svg>
);

/** Ícone de cada treino: seta para cima (empurrar), para baixo (puxar), ambas (misto). */
export const IconeTreino = ({ slug, className = "h-6 w-6" }: P & { slug: "push" | "pull" | "misto" }) => (
  <svg {...base} strokeWidth={2.6} className={className}>
    {slug === "push" && <path d="M12 19V5M6 11l6-6 6 6" />}
    {slug === "pull" && <path d="M12 5v14M6 13l6 6 6-6" />}
    {slug === "misto" && <path d="M8 19V5M4 9l4-4 4 4M16 5v14M12 15l4 4 4-4" />}
  </svg>
);
