@AGENTS.md

# ShopBike — regras do projeto

Plataforma de e-commerce própria da ShopBike (Tubarão/SC), construída e mantida pela NX Digital para substituir a Climba.

- Especificação: `docs/ESPECIFICACAO.md`. Decisões: `docs/DECISOES.md`. Leia os dois antes de mudar arquitetura.
- Toda decisão nova ou alterada vai para `docs/DECISOES.md` (data e motivo). Não apague a anterior.
- Itens **[A CONFIRMAR]** da especificação não viram regra no código sem confirmação; deixe um `TODO(confirmar): ...` e registre.

## Stack

Next.js 16 (App Router) + TypeScript + Tailwind 4. PostgreSQL + Drizzle, pg-boss, Meilisearch, R2 para mídia. Deploy por Dockerfile no Easypanel.
Next 16 tem mudanças de API: consulte `node_modules/next/dist/docs/` antes de usar algo que não conhece (ex.: `params` é Promise, `proxy.ts` no lugar de `middleware`).

## Estrutura

```
src/app/(loja)/        vitrine, categoria, produto, carrinho, checkout, conta
src/app/admin/         painel
src/app/pagar/[token]/ link de pagamento
src/app/api/           v1 (compatível Climba/Bruning), ia, webhooks
src/modules/<dominio>/ regra de negócio; outros módulos importam só o index.ts
src/db/                schema e migrações
src/jobs/              worker (pg-boss)
src/ui/                design system
src/mock/              dados fictícios do protótipo (Etapa 0)
```

## Regras inegociáveis

- **Cartão:** nunca gravar nem logar número, CVV ou validade. Dados do cartão passam só em memória a caminho da Rede.
- **Segredos:** só em variável de ambiente; toda variável nova entra no `.env.example` com comentário.
- **Dinheiro:** sempre em centavos (inteiro). Nunca `float` para valor.
- **Estoque:** nunca negativo. Reserva ao criar o pedido, baixa ao pagar, devolução ao cancelar/expirar, tudo em transação.
- **Antifraude:** todo pedido de todo canal passa pela análise. Cada ponto da nota grava o motivo. Nada é despachado antes da aprovação.
- **Auditoria:** toda ação sensível do painel (preço, aprovação de pedido, regra de risco, usuário, estorno) gera registro de quem, quando e o quê.
- **LGPD:** não logar dados pessoais; documentos do antifraude com acesso restrito.
- **SEO:** não mudar slug publicado sem criar 301.
- Parcelas acima de 12x só depois de a Rede confirmar no PV da ShopBike.

## Código

- Português para domínio, telas e mensagens (`pedido`, `variacao`, `notaRisco`); inglês aceito para termos técnicos.
- Validação de entrada com Zod nas bordas (rotas, server actions, webhooks).
- Regra de negócio em funções puras dentro do módulo, com teste. Componentes não calculam preço, parcela, frete ou nota de risco.
- Testes obrigatórios para checkout, pagamentos, antifraude, parcelamento e estoque.
- Antes de concluir: `npm run lint`, `npm run typecheck` e `npm run build` sem erro.

## Visual

- Cores: branco, vermelho `#E30618` (só destaque e CTA), preto `#1A1917`. Leve, nada pesado.
- Tokens em `src/app/globals.css`; não usar cor solta no componente.
- Painel: linguagem do Solvik (vidro claro, cápsulas, cards 22 px, Urbanist), recriada do zero. Nunca copiar arquivos do Solvik.
- Loja: logo ShopBike. Painel e login: logo ShopBike + NX (`src/ui/brand.tsx`).
- Acessibilidade: contraste AA, foco visível, checkout navegável por teclado, `alt` em imagens.
