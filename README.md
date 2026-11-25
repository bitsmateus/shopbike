# ShopBike — plataforma de e-commerce

Plataforma própria da ShopBike (Tubarão/SC), construída e mantida pela NX Digital para substituir a Climba.

- Especificação: [`docs/ESPECIFICACAO.md`](docs/ESPECIFICACAO.md)
- Decisões técnicas: [`docs/DECISOES.md`](docs/DECISOES.md)
- Regras do projeto: [`CLAUDE.md`](CLAUDE.md)

## Estado atual: Etapa 0 (protótipo)

Protótipo navegável da loja e do painel, **com dados fictícios e sem backend**, na stack final (Next.js 16 + TypeScript + Tailwind 4). Serve para aprovar layout e fluxos.

**Painel (38 telas):** abra `/admin/mapa` para ver todas, agrupadas como no menu, com a seção da especificação de cada uma. As telas da Fase 2 aparecem marcadas com “F2”.

| Área | Telas |
|---|---|
| Visão geral | dashboard |
| Pedidos | pedidos, expedição, trocas e devoluções, links de pagamento |
| Antifraude | fila de revisão, regras, lista de bloqueio, chargebacks, relatório |
| Clientes | clientes, perfil do cliente, leads, avaliações e perguntas, oficina (F2), lojistas B2B (F2) |
| Catálogo | produtos, editor de produto, preços e parcelamento, categorias e marcas, busca da loja, importação, seminovas (F2) |
| Marketing | cupons, promoções, vitrine da loja, conteúdo, recuperação de vendas, afiliados (F2) |
| Relatórios | central de relatórios, relatório detalhado, vendedores e metas (F2) |
| Configurações | loja/pagamento/frete/SEO/LGPD, notificações, usuários e perfis, auditoria, integrações e API, minha conta |

**Loja:** `/` home, `/c/mtb` categoria, `/busca?q=bike`, `/p/oggi-big-wheel-7-0-2027` produto, `/carrinho`, `/checkout`, `/pagar/Xa81Pd` link do vendedor, `/conta`, `/oficina`.

Dica no checkout: cupom `PEDAL5`. Nada é cobrado; pagamento, antifraude e 3DS são simulados.

As regras de parcelamento (`src/modules/precos`) e a nota de risco (`src/modules/antifraude`) já são as funções reais, seguindo a especificação.

## Rodar

Requer Node.js 22+.

```bash
npm install
npm run dev
```

Abra http://localhost:3000 (loja) e http://localhost:3000/admin (painel).

```bash
npm run lint && npm run typecheck && npm run build
```
