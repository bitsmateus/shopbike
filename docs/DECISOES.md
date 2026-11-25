# Decisões técnicas — ShopBike

Respostas às 13 decisões da seção 12 de `docs/ESPECIFICACAO.md`, aprovadas em 25/11/2026.
Para mudar uma decisão, registre aqui a nova escolha, a data e o motivo; não apague a anterior.

Referências usadas:
- **Visual:** `finty123/CRM-SOLVIK` (clone do preview Solvik). Usado só como linguagem visual.
- **Tecnologia:** `bitsmateus/sbplace` (site da SB Place, em produção no Easypanel): Next.js 16, React 19, Tailwind 4, `jose`, `sharp`, Docker.

| # | Decisão | Escolha | Status |
|---|---|---|---|
| 1 | Framework | Next.js 16 (App Router) + TypeScript, um app só (loja + painel) e um worker | Aprovada |
| 2 | Base | Construir do zero, em módulos | Aprovada |
| 3 | Banco | PostgreSQL 16 + Drizzle ORM, migrações versionadas | Aprovada |
| 4 | Busca | Meilisearch | Aprovada |
| 5 | Filas | pg-boss (fila no Postgres) + cron no worker | Aprovada |
| 6 | Imagens | Bucket S3-compatível (Cloudflare R2) + variantes AVIF/WebP com `sharp` + Cloudflare | Aprovada |
| 7 | Bruning | **API compatível com a Climba V1** | Aprovada, depende da documentação |
| 8 | Pagamentos | Portar `lib/rede.js`; autorizar sem capturar; provedor do Pix em aberto | Parcial |
| 9 | Antifraude | Módulo interno, síncrono no checkout, regras em tabela | Aprovada |
| 10 | Autenticação | Sessão própria no banco, Argon2id, 2FA TOTP no painel, código por WhatsApp | Aprovada |
| 11 | Repositório/CI | Repo único, módulos por domínio, Vitest + Playwright, GitHub Actions, deploy Easypanel | Aprovada |
| 12 | Observabilidade | pino + Sentry (sem PII) + Uptime Kuma fora da VPS + alertas no WhatsApp NX | Aprovada |
| 13 | Design system | Tailwind 4 + primitivos Radix (padrão shadcn), tokens em CSS | Aprovada |

---

## 1. Framework: Next.js 16 + TypeScript, um app

- Loja em `src/app/(loja)`, painel em `src/app/admin`, link de pagamento em `src/app/pagar/[token]`, APIs em `src/app/api`.
- Renderização no servidor e ISR para catálogo (SEO e Core Web Vitals).
- Um processo **worker** (mesma imagem Docker, outro comando) roda filas e tarefas agendadas.
- Mesma stack do `sbplace`, que já roda no Easypanel; a NX mantém uma stack só.
- **TypeScript** (o `sbplace` é JavaScript): pagamentos, antifraude e integração com ERP pedem tipos.
- Next 16 tem mudanças (ex.: `params` é Promise, `middleware` virou `proxy`). Consultar `node_modules/next/dist/docs/` antes de usar uma API.

Descartadas: dois apps separados (dobra CI e deploy); Astro + API (painel e checkout mais pesados de manter).

## 2. Construir do zero

Antifraude síncrono, pagamento dividido, 21x pela Rede, link de pagamento do vendedor e API compatível com a Climba são o núcleo do projeto e não vêm prontos em Medusa, Saleor ou Vendure. Partir de uma base significaria brigar com o modelo dela e manter mais uma dependência. Usamos bibliotecas pequenas e estáveis (Zod, Drizzle, pg-boss).

## 3. PostgreSQL 16 + Drizzle

- Relacional para variações, pedidos e relatórios; migrações versionadas no repositório.
- Postgres em container próprio no Easypanel, com volume e backup diário externo.
- Driver em JavaScript puro (`postgres`), sem módulo nativo: no `sbplace`, o `better-sqlite3` derrubava o processo no servidor.

## 4. Meilisearch

Tolerância a erro, sinônimos, facetas e resultado instantâneo. O worker sincroniza o índice. A curadoria (fixar produtos para um termo) fica na aplicação. Postgres FTS fica como plano de reserva.

## 5. pg-boss + cron no worker

Fila dentro do Postgres: sem Redis, e o job nasce na mesma transação do pedido. Tarefas: sincronização ERP, rastreio, recuperação de carrinho e Pix, expiração de links, recálculo de notas de risco. Revisar se o volume crescer muito.

## 6. Imagens

Original no bucket S3-compatível (Cloudflare R2; reserva: MinIO no Easypanel). Variantes AVIF/WebP em tamanhos fixos geradas com `sharp` no upload, servidas pelo Cloudflare. O backup das mídias fica naturalmente fora da VPS.

## 7. Integração Bruning: API compatível com a Climba V1

- A plataforma expõe os endpoints e formatos da API V1 da Climba (`/api/v1`, cabeçalho `x-idcommerce-api-token`). Do lado da Bruning muda só a URL e o token.
- A compatibilidade vive num **módulo adaptador** (`modules/erp-bruning`); o domínio interno não conhece o formato da Climba.
- Testes de contrato a partir das chamadas reais do "Log de Integração" da Climba.
- **Bloqueio:** precisamos da documentação da API V1 da Climba e do log real (pendência 13 da especificação).

## 8. Pagamentos

- **Cartão:** portar `lib/rede.js` e `lib/checkout.js` do `sbplace` para TypeScript (OAuth2, 3DS 2, consulta por referência, limite de tentativas). Atrás de uma interface `PaymentGateway`.
- **Captura:** autorizar sem capturar. Nota 0–29: captura na hora. 30–59: fica retida na fila de revisão. 60+: cancela a autorização. **[A CONFIRMAR]** prazo máximo de captura na Rede.
- **Ordem com o antifraude:** nota parcial antes de cobrar (camada 1 e regras sem cartão); nota final depois da autorização (titular do cartão, 3DS).
- **Pix:** **[EM ABERTO]** provedor. Requisito: QR dinâmico, webhook e **CPF do pagador** no retorno. Candidatos: Pix da Rede, PSP (Efí, Asaas) ou banco.
- **Gateway reserva:** só a interface na F1; Mercado Pago como contingência depois.
- **Parcelas:** menor entre o limite global, a regra (categoria, marca, produto) e a parcela mínima, como em `lib/installments.js`. Acima de 12x só após a Rede confirmar no PV da ShopBike.

## 9. Antifraude

- Módulo `modules/antifraude`, chamado de forma síncrona no checkout, com orçamento de tempo por regra.
- Regras, pesos e faixas em tabela (`regra_risco`), editáveis no painel; cada ponto grava o motivo.
- Vínculos (CPF, e-mail, telefone, cartão BIN+final, endereço, aparelho) em tabela indexada.
- Recálculo de notas por job quando uma regra muda.
- Fingerprint com FingerprintJS open-source + sinais próprios; sinais de aparelho e IP são fracos e nunca decidem sozinhos.

## 10. Autenticação

- Sessão própria em banco (token opaco em cookie httpOnly, Secure, SameSite=Lax), senha com Argon2id.
- Painel: 2FA TOTP obrigatório, perfis e permissões em tabela, log de acesso e auditoria.
- Cliente: e-mail e senha ou código pelo WhatsApp (NX).

## 11. Repositório, testes e CI

- Repo único; módulos em `src/modules/<dominio>`, que só se comunicam pelo `index.ts` do módulo.
- Vitest para regras (antifraude, parcelamento, estoque, pedidos); testes de contrato contra o sandbox da Rede; Playwright no checkout.
- GitHub Actions: lint, typecheck, testes e build da imagem. Deploy pelo Easypanel a partir do Git (Dockerfile).

## 12. Observabilidade

Logs JSON com pino; erros no Sentry com remoção de dados pessoais; Uptime Kuma **fora** da VPS da ShopBike; alertas no WhatsApp da NX (site fora, integração parada, fila travada, erro na Rede).

## 13. Design system

- Tailwind 4 + primitivos Radix (padrão shadcn), tokens em variáveis CSS (`src/app/globals.css`).
- **Solvik só como linguagem visual.** O HTML dele declara "licensed, not sold"; nenhum arquivo compilado é copiado. Recriamos proporções e padrões: cards de raio 22 px, controles em cápsula, topbar com navegação em pílula, drawer de detalhe, fonte Urbanist.
- **Cores (claro, leve):** fundo branco, superfícies `#F7F6F5`, texto `#1A1917` (o preto da logo), vermelho `#E30618` (o da logo) só em CTA, selos e destaques; preto em botões secundários e títulos.
- **Painel:** vidro translúcido claro, sem foto de fundo pesada. **Loja:** e-commerce limpo e rápido, sem vidro nem animações pesadas.
- **Logos:** loja usa a logo da ShopBike. O sistema (painel e login) usa **ShopBike + NX juntas**. Arquivos em `public/brand/`.

---

## Etapa 0: protótipo

Aprovada em 25/11/2026: protótipo navegável da loja e do painel, com dados fictícios e sem backend, na stack final. Serve para aprovar o layout. Dados em `src/mock/`; nada dele vai para produção sem passar pelos módulos reais.
