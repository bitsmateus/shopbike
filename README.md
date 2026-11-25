# ShopBike — plataforma de e-commerce

Plataforma própria da ShopBike (Tubarão/SC), construída e mantida pela NX Digital para substituir a Climba.

- Especificação: [`docs/ESPECIFICACAO.md`](docs/ESPECIFICACAO.md)
- Decisões técnicas: [`docs/DECISOES.md`](docs/DECISOES.md)
- Regras do projeto: [`CLAUDE.md`](CLAUDE.md)

## Estado atual: Etapa 0 (protótipo)

Protótipo navegável da loja e do painel, **com dados fictícios e sem backend**, na stack final (Next.js 16 + TypeScript + Tailwind 4). Serve para aprovar layout e fluxos.

| Loja | Painel |
|---|---|
| `/` home por blocos | `/admin/login` login com 2FA |
| `/c/mtb` categoria com filtros | `/admin` visão geral |
| `/busca?q=bike` busca com sinônimos e tolerância a erro | `/admin/pedidos` lista + detalhe |
| `/p/oggi-big-wheel-7-0-2027` produto com variações | `/admin/antifraude` fila, regras, lista de bloqueio |
| `/carrinho`, `/checkout` checkout transparente | `/admin/catalogo` cadastro e variações |
| `/pagar/Xa81Pd` link de pagamento do vendedor | `/admin/links` gerar link de pagamento |
| `/conta`, `/oficina` | `/admin/integracoes` log da Bruning |

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
