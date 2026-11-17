# NGF Racing

Migracao do site da NGF Racing de React/Vite para Next.js (App Router) com TypeScript, Prisma, SEO melhorado e painel Admin (CMS) para gerenciar:

- Estoque de carros
- Conteudo do site (Hero, Sobre, Contato)
- Catalogo de produtos com pecas, roupas e acessorios

## Stack aplicada no codigo

- Framework: Next.js 15 (App Router) + React 19 + TypeScript
- Banco: Prisma + PostgreSQL
- Produtos: upload persistente no Vercel Blob e compatibilidade com a biblioteca em `public/images`
- Auth Admin: login por variaveis de ambiente e sessao por cookie assinado
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

- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `JWT_SECRET`
- `ADMIN_USER`
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

Produtos:

- `http://localhost:3000/produtos`

## Build de producao

```bash
npm run lint
npm run build
npm run start
```

## Login inicial do Admin

O login admin usa:

- `ADMIN_USER`
- `ADMIN_PASSWORD`

Defina esses valores no `.env` antes de iniciar o app.

## Biblioteca de imagens

Implementacao aplicada:

- Carros: `public/images/carros`
- Produtos: `public/images/produtos`
- Compatibilidade legada: `public/cars` ainda aparece no seletor enquanto houver arquivos antigos em uso
- O admin lista essas imagens server-side e permite escolher principal e galeria visualmente

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

O cadastro e a edicao de **produtos** usam Vercel Blob, sem escrita no disco do deploy.
A API legada `/api/upload` e os fluxos de carros nao foram alterados nesta melhoria.

Configuracao inicial (o estado verificado do projeto fica nos relatorios operacionais privados, mantidos fora do repositorio):

1. Na Vercel, crie ou conecte um store Blob **publico** ao projeto. Stores privados nao atendem a esta implementacao.
2. Configure `BLOB_READ_WRITE_TOKEN` com permissao de escrita nesse store, somente no servidor (nunca use prefixo `NEXT_PUBLIC_`).
3. Configure `BLOB_PUBLIC_HOSTNAME` com o hostname exato do store publico, por exemplo `seu-store.public.blob.vercel-storage.com`, sem protocolo, caminho ou barra final. Ele tambem configura a allowlist do `next/image` no build.
4. Mantenha `POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING`, `JWT_SECRET`, `ADMIN_USER`, `ADMIN_PASSWORD` e `NEXT_PUBLIC_BASE_URL` (origem publica do site) configuradas.
5. Producao ja registra `0_existing_schema` e `20261026_product_image_assets`, aplicadas em 27/10/2026 apos aprovacao explicita e verificacao de restauracao do backup. O baseline foi apenas marcado como aplicado, sem executar seu SQL sobre as tabelas existentes. As duas migracoes incrementais antigas foram preservadas sem alteracoes em `prisma/migration-archive`. Em bancos novos vazios, `migrate deploy` cria todo o schema. Nao repita o baseline de producao e nao rode seed nem reset; confira o historico antes de qualquer migracao futura.
6. Faca o deploy da versao com as variaveis disponiveis tambem no build. Depois dessa configuracao inicial, enviar ou trocar fotos pelo painel nao exige novos deploys.

Use stores e bancos separados para Preview/Development e Production. Para desenvolvimento local, configure as mesmas variaveis em `.env.local` ou `.env`. Nunca versione credenciais.

O isolamento ja esta configurado: Development usa `ngfracing-development` e Preview usa `ngfracing-preview`, com usuarios, senhas de banco, JWT e credenciais administrativas proprios. Ambos usam o Blob `ngfracing-images-preview`; Production mantem `ngfracing-images`. Os arquivos locais de ambiente e o contexto Neon apontam para Development, com backups privados anteriores a mudanca.

O aplicativo bloqueia o endpoint conhecido de producao e uploads no Blob de producao fora de `VERCEL_ENV=production`. Essa variavel e fornecida automaticamente pela Vercel; nao a defina como production para contornar a protecao local. Ferramentas SQL externas nao passam pelo cliente do aplicativo: confira sempre os destinos. Variaveis de deployments antigos sao snapshots; nao foram encontrados deployments Preview READY anteriores nesta checagem.

Estado final, correcoes de seguranca, testes e publicacao ficam registrados nos relatorios operacionais privados, fora do repositorio. Producao foi publicada em 28/10/2026, apos homologacao no Preview e autorizacao explicita.

Fluxo: selecione arquivos, confira as previas, clique em **Enviar imagens pendentes / tentar novamente**, ajuste principal/ordem e salve o produto. O limite e de 9 imagens (principal + 8 extras), 4 MiB por arquivo e 40 megapixels. Cada arquivo segue em uma requisicao separada, abaixo do limite de 4,5 MB das Functions. JPG, PNG, WebP e AVIF sao decodificados e convertidos em WebP de ate 2400 px, sem metadados EXIF. Imagens animadas, SVG e conteudo invalido sao rejeitados.

As rotas exigem sessao ADMIN e origem confiavel. O limite de tentativas por instancia reutiliza o mecanismo do projeto; uma contagem de uploads recentes no banco complementa a protecao entre instancias. Essa contagem nao e uma quota estrita sob requisicoes simultaneas.

O Neon guarda apenas URLs, ordem e metadados (pathname, MIME, bytes, dimensoes, autor e data em `ProductImageAsset`). Os campos existentes `primaryImageUrl` e `galleryJson` permanecem compativeis. O salvamento confirma que as URLs vieram de uploads registrados, da biblioteca ou do proprio produto e grava produto/galeria juntos em uma operacao atomica. O catalogo publico usa as URLs do Blob via `next/image` e as rotas sao revalidadas ao salvar.

**Retencao e falhas:** remover uma foto da galeria ou excluir um produto nunca apaga o arquivo fisico. Isso protege imagens compartilhadas e permite repetir salvamentos com falha. Uploads bem-sucedidos de formularios abandonados permanecem registrados; uma falha entre Blob e banco pode deixar um arquivo sem registro, identificado nos logs `[product-images] Upload failed`. Nao existe limpeza automatica. Para uma limpeza manual futura, confira referencias exatas em todos os produtos (principal e JSON da galeria), carros e demais conteudos, alem de formularios em andamento, e mantenha um periodo de retencao antes de qualquer exclusao. Nao exclua apenas por prefixo ou idade.

Fotos antigas em `/images/...` e `/uploads/...` continuam aceitas quando ja pertencem ao produto; arquivos locais precisam permanecer no repositorio. Arquivos antigos que existiam apenas no disco efemero de um deploy nao podem ser recuperados por esta mudanca.

Referencias: [upload pelo servidor no Blob](https://vercel.com/docs/vercel-blob/server-upload), [limites das Functions](https://vercel.com/docs/functions/limitations).

Validacao local:

```bash
npm test
npm run lint
npm run typecheck
npm run build
npx playwright install chromium
npm run test:browser
```

Os testes de navegador usam porta 3107, credenciais ficticias e banco indisponivel, sem gravar dados reais. Exercitam a autenticacao/origem da API e, com respostas de upload simuladas, a interface em desktop e celular (previas, falha parcial, repeticao, principal, ordem e remocao).

Scripts operacionais privados (fora do repositorio) tambem verificaram upload real no Blob separado de homologacao, persistencia e renderizacao em uma copia local restaurada e em uma branch real isolada do Neon, incluindo fotos antigas com fotos novas. Em producao foram aplicados somente o registro do baseline e a migracao aditiva expressamente aprovados; os hashes de todas as tabelas existentes permaneceram iguais. Nunca execute scripts de migracao ou publicacao de producao sem a aprovacao explicita combinada.

## Pedidos de produtos

O fluxo de compra dos produtos nao processa pagamento no site.

- O cliente escolhe produto, quantidade e tamanho quando aplicavel
- O sistema abre um formulario de solicitacao
- Ao enviar, a aplicacao grava um pedido no banco
- O time acompanha esses pedidos em `/admin/pedidos`

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
