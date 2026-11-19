# Treino do Pai 💪

Web app simples (Next.js + TypeScript + Tailwind) para consultar o plano de treino semanal no telemóvel.
Sem login, sem base de dados, sem backend: é tudo estático.

- **Segunda** → Push (peito, ombros, tríceps)
- **Quarta** → Pull (costas, bíceps)
- **Sexta** → Misto

## Correr localmente

Precisas do Node.js 20 ou mais recente.

```bash
npm install
npm run dev
```

Abre http://localhost:3000. Para experimentar no telemóvel na mesma rede Wi-Fi, usa `http://<IP-do-computador>:3000`.

## Editar os treinos

**Só precisas de mexer em `data/treinos.ts`.** No topo do ficheiro há instruções.

- Para **adicionar um exercício**, copia um bloco `{ id, nome, series, repeticoes, descansoSeg, notas, videos }` e altera-o.
- A ordem no ficheiro é a ordem no ecrã.
- `repeticoes` é texto: `"10"`, `"8-10"`, `"30 seg"`, `"até à falha"`.
- `descansoSeg` (opcional) ativa o botão do temporizador de descanso.
- O `id` tem de ser único dentro do treino, porque é com ele que as séries marcadas ficam guardadas no telemóvel.

## Adicionar vídeos

Cada exercício aceita até 2 vídeos, cada um com uma etiqueta (por exemplo `"Explicação"` e `"Pai a fazer"`). Com 2 vídeos aparecem botões para alternar entre eles.

```ts
videos: [
  { label: "Explicação", url: "https://youtu.be/dQw4w9WgXcQ" },
  { label: "Pai a fazer", url: "/videos/supino-pai.mp4" },
],
```

**Opção A: YouTube (recomendado)**
1. Carrega o vídeo no YouTube com visibilidade **Não listado** (só quem tem o link o vê).
2. Copia o link (`youtube.com/watch?v=…`, `youtu.be/…` ou `youtube.com/shorts/…`) e cola-o no `url`.
3. A app converte o link para embed automaticamente. Os Shorts aparecem na vertical.

**Opção B: ficheiro .mp4**
1. Põe o ficheiro em `public/videos/`, por exemplo `public/videos/supino-pai.mp4`.
2. No `url`, escreve `"/videos/supino-pai.mp4"`.
3. Usa vídeos curtos e comprimidos (idealmente menos de 20 MB cada). O GitHub recusa ficheiros com mais de 100 MB e o repositório fica pesado depressa. Para vídeos grandes, usa o YouTube.

Enquanto o URL tiver a palavra `SUBSTITUIR` (ou se o ficheiro não existir), aparece "Vídeo em breve".

## Deploy na Vercel

1. Cria um repositório no GitHub e faz push deste projeto:
   ```bash
   git init && git add . && git commit -m "Treino do Pai"
   git branch -M main
   git remote add origin https://github.com/rodrigoafonsogit/workout-pai.git
   git push -u origin main
   ```
2. Em https://vercel.com/new, importa o repositório. A Vercel deteta o Next.js sozinha, por isso basta carregar em **Deploy**.
3. A partir daí, cada `git push` (por exemplo depois de editar `data/treinos.ts`) faz um novo deploy automaticamente.

Em alternativa, com a CLI: `npx vercel` (e depois `npx vercel --prod`).

## Instalar no telemóvel

- **iPhone (Safari):** abrir o site → botão Partilhar → "Adicionar ao ecrã principal".
- **Android (Chrome):** abrir o site → menu ⋮ → "Instalar app" ou "Adicionar ao ecrã principal".

## Estrutura

```
data/treinos.ts          ← os treinos (é aqui que se edita)
app/page.tsx             ← página inicial
app/treino/[slug]/       ← páginas /treino/push, /treino/pull, /treino/misto
app/manifest.ts          ← manifest PWA
components/              ← cartões, vista de treino, leitor de vídeo
lib/tema.ts              ← cores de cada treino
public/icons/            ← ícones da app
public/videos/           ← os teus .mp4 (opcional)
```
