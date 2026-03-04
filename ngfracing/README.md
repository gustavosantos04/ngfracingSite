# NGF Racing

Migracao do site da NGF Racing de React/Vite para Next.js (App Router) com TypeScript, Prisma, SEO melhorado e painel Admin (CMS) para gerenciar:

- Estoque de carros
- Conteudo do site (Hero, Sobre, Contato)
- Catalogo informativo de pecas FuelTech

## Stack aplicada no codigo

- Framework: Next.js 15 (App Router) + React 19 + TypeScript
- Banco: Prisma + SQLite
- Upload de imagens: Opcao B aplicada no codigo, com salvamento local em `public/uploads`
- Auth Admin: login por e-mail/senha, hash com `bcryptjs`, sessao por cookie assinado
- SEO: metadata, OpenGraph, `robots.ts`, `sitemap.ts`, Schema.org `Vehicle`

## Estrutura principal

- `app/`: rotas publicas, admin e APIs
- `components/`: componentes publicos e do CMS
- `lib/`: prisma, auth, upload, validators, helpers
- `prisma/`: schema e seed
- `public/`: assets e uploads

## Configuracao

1. Instale as dependencias:

```bash
npm install
```

2. Crie o arquivo de ambiente:

```bash
cp .env.example .env
```

No Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

3. Ajuste as credenciais em `.env`:

- `DATABASE_URL`
- `JWT_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `NEXT_PUBLIC_BASE_URL`

## Banco de dados

### Fluxo padrao (recomendado)

Gerar client:

```bash
npx prisma generate
```

Criar migracao local:

```bash
npx prisma migrate dev --name init
```

Popular com dados iniciais:

```bash
npm run prisma:seed
```

### Fluxo rapido para MVP

Se voce quiser apenas sincronizar schema sem criar migration:

```bash
npm run prisma:push
npm run prisma:seed
```

## Rodando localmente

```bash
npm run dev
```

App publica:

- `http://localhost:3000`

Admin:

- `http://localhost:3000/admin/login`

## Build de producao

```bash
npm run lint
npm run build
npm run start
```

## Login inicial do Admin

O seed cria 1 usuario admin usando:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

Defina esses valores no `.env` antes de rodar o seed.

## Upload de imagens

Implementacao aplicada:

- Salva arquivos em `public/uploads`
- Aceita `jpg`, `png`, `webp`, `avif`
- Limite de 5MB por arquivo
- Limite de 8 imagens por carro

## Deploy

### VPS tradicional (aplicado no codigo)

Este projeto ja esta pronto para rodar assim:

1. Configure `.env`
2. Rode `npm install`
3. Rode `npx prisma generate`
4. Rode `npx prisma migrate dev --name init` ou `npm run prisma:push`
5. Rode `npm run prisma:seed`
6. Rode `npm run build`
7. Rode `npm run start`
8. Use PM2, NSSM ou systemd para manter o processo online
9. Aponte Nginx/Apache para a porta do Next.js

### Vercel / Serverless

O codigo atual usa upload local em disco, que nao e o ideal para serverless.

Para Vercel, troque a implementacao de `lib/upload.ts` para:

- Cloudinary
- Amazon S3
- R2 / S3 compativel

O restante do projeto (App Router, Prisma, rotas, CMS) ja esta preparado para essa adaptacao.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run prisma:generate
npm run prisma:migrate
npm run prisma:push
npm run prisma:seed
```

## Observacoes

- O layout original foi preservado em estrutura: Hero, Sobre, Estoque, Contato/CTA
- O visual foi refinado mantendo vermelho, amarelo, preto e branco
- O codigo legado do Vite foi movido para pasta de backup para evitar conflito com o App Router
