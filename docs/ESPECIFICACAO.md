# ShopBike — Especificação da nova plataforma de e-commerce

Projeto fechado com a ShopBike em novembro de 2026. A NX Digital vai construir a plataforma de e-commerce própria da ShopBike para substituir a Climba. A plataforma roda em servidor dedicado, no Easypanel, no domínio da loja.

Este documento reúne tudo o que foi levantado: o painel atual da Climba, a proposta apresentada, as decisões do cliente e o código que já existe no site da SB Place. Ele serve de base para a sessão do Claude Code que vai decidir a tecnologia e construir o sistema.

> **Como usar com o Claude Code**
> 1. Coloque este arquivo na raiz do repositório novo, em `docs/ESPECIFICACAO.md`.
> 2. Na primeira sessão, peça ao Claude Code para ler este arquivo e o repositório de referência (visual e tecnologia) e responder às perguntas da seção 12, **antes de escrever código**.
> 3. As decisões tomadas vão para um `CLAUDE.md` e para `docs/DECISOES.md`. Cada módulo da seção 5 vira uma etapa de trabalho.
> 4. Tudo marcado como **[A CONFIRMAR]** depende de resposta do cliente ou de terceiros. A seção 13 lista essas pendências.

---

## Sumário

1. Contexto e objetivo
2. A operação hoje (dados da Climba)
3. Escopo
4. Perfis de usuário
5. Módulos e funções
6. Integrações externas
7. Modelo de dados
8. Requisitos não funcionais
9. Infraestrutura e deploy
10. Migração da Climba
11. Fases e ordem de construção
12. Decisões técnicas a tomar com o Claude Code
13. Pendências e perguntas em aberto
14. Referências

---

## 1. Contexto e objetivo

**Cliente:** ShopBike, loja de bicicletas, peças, acessórios e vestuário em Tubarão/SC. Vende bikes novas e seminovas, com marcas como Specialized, Oggi, Caloi, Shimano e Sram. O ticket varia de R$ 1.000 a R$ 7.000 nas bikes, e a maioria das vendas é de modelos de entrada e intermediários.

**Hoje:** a loja usa a **Climba Commerce** (plano Elite) para site, catálogo, pedidos, pagamentos, frete, antifraude e relatórios. O estoque vem do ERP **Bruning Sistemas**. Atendimento, CRM e IA de vendas no WhatsApp ficam na plataforma da NX Digital.

**Objetivo do projeto:**
- Substituir a Climba por uma plataforma própria, sem comissão sobre as vendas.
- Manter tudo o que a operação usa hoje, para nenhuma rotina se perder.
- Criar um **antifraude próprio** no lugar da ClearSale.
- Ligar a loja ao ecossistema NX: WhatsApp oficial, CRM, IA de vendas e tráfego pago.
- Acrescentar os diferenciais listados na seção 5.

**Proposta comercial fechada:**
- Implantação: R$ 19.990, à vista, no cartão com juros ou em 3x no boleto.
- Mensalidade: R$ 3.197, primeira em 10/01/2027, com 2 meses grátis.

**Princípios do projeto:**
1. Nada do que funciona hoje se perde.
2. A plataforma é da ShopBike: domínio `shopbike.com.br`, servidor dedicado e dados exportáveis.
3. A loja não para: a plataforma é construída em paralelo e só entra no ar depois de testada com a equipe.
4. Venda conectada: site, WhatsApp, vendedores e campanhas enxergam o mesmo pedido, estoque e cliente.

---

## 2. A operação hoje (dados da Climba)

Levantamento feito no painel `shopbike.com.br/admin` em 06/11/2026.

| Indicador | Valor |
|---|---|
| Cliente Climba desde | 07/01/2019 |
| Plano | Elite: R$ 2.099/mês fixo + 0,99% sobre o faturamento (loja e marketplace) |
| Gasto com a Climba nos últimos 12 meses (nov/25 a out/26) | R$ 72.192,86 (média de R$ 6.016/mês) |
| Faturamento out/2026, loja virtual | R$ 325.872,57 em 75 pedidos |
| Faturamento out/2026, marketplace | R$ 24.848,27 em 24 pedidos |
| Produtos cadastrados | 7.395 |
| Visitas no mês anterior | 32.280 |
| Usuários do painel | 18 |
| Carrinhos abandonados | 84 entre 01 e 06/11/2026 |

**Dashboard atual:** visitas, carrinhos (abandonados), pedidos, pedidos pagos, vendas, ticket médio e taxa de conversão. Mostra também a projeção mensal, a comparação com o período anterior, um gráfico de vendas e pedidos por canal (loja virtual x marketplace) e visitas por dispositivo e canal, com meta.

**Gambiarra a eliminar:** para cobrar vendas fechadas no WhatsApp ou na loja, a equipe usa um produto genérico chamado "30106 - Link de Pagamento ShopBike". Por isso o estoque não baixa certo e a venda não fica com os itens reais.

---

## 3. Escopo

### 3.1 Dentro do escopo

Todos os módulos da seção 5, divididos em **Fase 1 (para desligar a Climba)** e **Fase 2 (evolução)**.

### 3.2 Fora do escopo (decisão do cliente)

| Item | Decisão | Observação |
|---|---|---|
| ClearSale | **Sai**, substituída pelo antifraude próprio (5.8) | Na ClearSale, dependendo do plano, a fraude aprovada por ela não fica no prejuízo da loja. No nosso, o chargeback é da loja, a não ser quando a compra foi autenticada no banco (3DS). |
| ANYMARKET / marketplaces | **Fora por enquanto** | Os pedidos do Mercado Livre (24 em out/2026) param na virada se nada for feito. **[A CONFIRMAR]** se o ANYMARKET continua ligado de outra forma. |
| Venda assistida | **Fora** | |
| CRM de terceiros (RD Station etc.) | **Fora**: o CRM é só o da NX | |
| Boleto | Desligado hoje | **[A CONFIRMAR]** se continua desligado. |

---

## 4. Perfis de usuário

| Perfil | O que faz | Acesso |
|---|---|---|
| Cliente final | Compra no site, acompanha pedidos, pede troca | Loja e área do cliente |
| Administrador (dono/gerente) | Tudo, inclusive configurações, regras de antifraude e usuários | Painel completo |
| Operação/expedição | Pedidos, separação, faturamento, etiquetas, trocas | Pedidos, logística, trocas |
| Cadastro/catálogo | Produtos, fotos, preços, promoções, conteúdo | Catálogo, marketing, conteúdo |
| Vendedor | Gera link de pagamento, vê as próprias vendas e comissão | Link de pagamento e "minhas vendas" |
| Analista de risco | Fila de revisão do antifraude, lista de bloqueio | Antifraude |
| Integrações (máquina) | Bruning, agente de IA, n8n, NX | API com token por integração |

Requisitos: perfis de permissão configuráveis, 2FA no painel, registro de acessos e registro de cada ação sensível (auditoria).

---

## 5. Módulos e funções

Legenda: **F1** = Fase 1 (necessário para desligar a Climba). **F2** = Fase 2.

### 5.1 Catálogo de produtos — F1

**Cadastro de produto**
- Nome, slug (URL), código interno, código do ERP (Bruning), SKU, EAN.
- Descrição curta e longa (editor rico), características técnicas em lista estruturada (quadro, aro, câmbio, freio, suspensão, peso etc.) e FAQ por produto.
- Marca, categorias (várias, em árvore), subcategorias, tags e etiquetas (selos como "Lançamento", "Promoção", "Seminova").
- Garantia, disponibilidade (prazo de produção ou encomenda) e produtos adicionais/relacionados.
- Fotos (várias, ordenáveis, com texto alternativo) e vídeos (link ou upload).
- **Variações**: tamanho de quadro, aro, cor, tamanho de vestuário. Cada variação tem SKU, estoque, preço e fotos próprios.
- Tabela de tamanhos por produto ou categoria.
- Atributos de personalização (produtos personalizados, F2).
- Peso e dimensões, para o frete.
- Campos de SEO: título, descrição e URL canônica.
- Status: ativo, inativo, preço sob consulta, só vitrine (sem compra).
- Marcação de **seminova**, com estado, laudo e fotos próprias (ver 5.18).

**Ferramentas**
- Importação de produtos e tags por planilha (XLSX) e de fotos em lote (ZIP, casando o nome do arquivo com o código).
- Exportação do catálogo em planilha e relatório de URLs de imagens.
- Painel de revisão do cadastro com nota de qualidade: produto sem 5 fotos, sem vídeo, sem descrição ou com nota baixa. Na Climba isso se chama "Everest" e aponta os "produtos TOP 10 em vendas" com problema.
- Duplicar produto, ações em massa (ativar, desativar, mudar categoria, aplicar etiqueta) e histórico de alterações.

**Critérios de aceite:** cadastrar uma bike com 3 tamanhos e 2 cores, cada combinação com estoque próprio; importar 7.400 produtos por planilha sem travar o painel; a página do produto mostra a variação escolhida com foto, preço e estoque corretos.

### 5.2 Preços e parcelamento — F1

- Preço de/por, preço promocional com início e fim e preço sob consulta.
- Listas de preços (cópia de lista, preço por grupo de cliente ou lojista no B2B).
- Alteração de preço em massa: percentual ou valor, por filtro de marca, categoria ou tag.
- Desconto à vista (Pix ou cartão em 1x), configurável por forma de pagamento.
- **Parcelamento**:
  - Até **21x** no cartão (geral da loja virtual hoje).
  - Parcelamento personalizado por categoria, marca ou produto. Hoje existem regras para 2 categorias, 9 marcas e 3.338 produtos; **[A CONFIRMAR]** quais são, na exportação.
  - Parcela mínima configurável.
  - Exibir "em até Nx de R$ X" na vitrine e no produto.

### 5.3 Estoque e integração com o ERP Bruning — F1 (crítico)

**Como é hoje:**
- Integração "Bruning Sistemas API — API V1" na Climba.
- **Quem chama é a Bruning**: ela consome a API da Climba no domínio da loja, `https://ml.shopbike.com.br/api/v1/`, com autenticação por cabeçalho `x-idcommerce-api-token`. O token fica no painel da Climba e **não** vai neste documento.
- Configurações ativas: usa API; importação de produtos pela integração ligada; arquivos TXT de produtos, estoque, categorias, subcategorias e marcas (o modo TXT está descontinuado).
- A Bruning envia produtos, estoque, preços, categorias, subcategorias e marcas, e busca os pedidos para faturar. **[A CONFIRMAR]** quais endpoints ela usa de fato.
- A nota fiscal (NF-e) é emitida pela Bruning. **[A CONFIRMAR]**
- Contato: suporte@bruningsistemas.com.br e (48) 3052-3075. Revenda Tecsul: (48) 3438-0399.

**Duas estratégias (decidir na seção 12):**
- **A. API compatível com a Climba (preferida):** a plataforma nova expõe os mesmos endpoints e formatos da API V1 da Climba. Do lado da Bruning, muda só a URL e o token. Para isso precisamos da documentação da API V1 da Climba (link "Documentação" na tela de Integrações ERP) e do "Log de Integração" da Climba, para ver as chamadas reais.
- **B. API nova:** a Bruning integra com uma API nossa. Depende da Bruning aceitar e pode ter custo.

**Funções:**
- Receber e atualizar produtos, variações, preços, estoque, categorias e marcas vindos do ERP. Definir quais campos o ERP manda e quais o painel pode editar (o ERP manda estoque e preço; o painel manda fotos, descrição e SEO).
- Entregar à Bruning os pedidos pagos e receber de volta número e chave da NF-e e status de faturamento.
- Reserva de estoque ao criar o pedido, baixa ao confirmar o pagamento e devolução ao cancelar ou expirar.
- Log de integração por chamada (data, endpoint, resultado e erro), com reprocessamento manual.
- Alerta quando a sincronização parar (ex.: nada recebido em X horas).

**Critérios de aceite:** a mudança de estoque no ERP aparece na loja em até X minutos **[A CONFIRMAR o intervalo]**; um pedido pago aparece para a Bruning e a NF volta para o pedido; nenhum produto fica com estoque negativo.

### 5.4 Loja virtual (vitrine) — F1

- Layout novo, rápido e mobile-first, com a identidade da ShopBike: branco com detalhes vermelho e preto, logo atual.
- **Home montada por blocos no painel:** banners principais (com ordenação), secundários, de listagem e fixos; vitrines (destaques, promoção, lançamentos); categorias com imagem; vídeos; barra de frete grátis; faixa de benefícios (frete grátis, 10% à vista, até 21x, horário de atendimento).
- Menu do topo e do rodapé editáveis, logos, ícones e cores configuráveis.
- **Página de categoria/listagem:** filtros por marca, aro, tamanho, preço, cor e tipo (MTB, speed, elétrica, infantil, scooter); ordenação; paginação ou carregamento contínuo.
- **Página de produto:** galeria, seleção de variação, preço e parcelamento, cálculo de frete por CEP, prazo, estoque, características, tabela de tamanhos, avaliações, perguntas e respostas, compre junto, avise-me quando chegar, favoritos, compartilhar, botão "comprar pelo WhatsApp".
- Páginas institucionais: quem somos, lojas, serviços, trabalhe conosco, como comprar, políticas (troca, privacidade, entrega).
- Pop-up de captação de leads, botão flutuante do WhatsApp e aviso de cookies (LGPD).
- **SEO:** URLs amigáveis, sitemap, robots, dados estruturados (Product, Offer, BreadcrumbList), Open Graph, URL canônica e **redirecionamento 301 de todas as URLs antigas** (seção 10).

### 5.5 Busca — F1

- Resultados instantâneos ao digitar, tolerância a erro de digitação, sinônimos ("bike" = "bicicleta", "MTB" = "mountain bike"), busca por aro, tamanho e marca.
- Curadoria no painel: fixar produtos para um termo e ajustar a relevância.
- Log de pesquisas, incluindo termos sem resultado.
- Substitui o Climba Search e o SmartHint.

### 5.6 Carrinho e checkout — F1

- Carrinho persistente (logado ou não), cupom, cálculo de frete e retirada na loja.
- **Checkout transparente**, em uma página ou em poucas etapas, com **compra sem cadastro** (o cadastro é criado por trás).
- Dados: nome, CPF/CNPJ, e-mail, WhatsApp, endereço (com busca por CEP) e endereço de entrega diferente do de cobrança.
- Formas de pagamento: ver 5.7.
- Antifraude antes da cobrança (5.8).
- Tela de pedido concluído com status, Pix (QR Code e copia e cola) ou orientação de 3DS.
- Recuperação de carrinho e de Pix não pago (5.14).

### 5.7 Pagamentos — F1

**Hoje na Climba:**
- Cartão de crédito e Pix ativos; boleto inativo.
- Gateways instalados: **Rede** (principal, 21x), Cielo, Getnet, Mercado Pago e PagSeguro.
- "Pagamento facilitado": 2 cartões, Pix + cartão e Pix + 2 cartões.
- O Pix hoje é **manual**: a equipe confere no extrato.

**Na plataforma nova:**
- **Cartão pela API e.Rede (v2, OAuth2)**, com o PV de e-commerce da **ShopBike**, que já aceita 21x pela Climba. Capturar na hora ou pré-autorizar (decidir), parcelamento até 21x conforme as regras de 5.2 e **3DS 2**. Nada de dado de cartão gravado.
  - Existe código pronto e testado em produção no site da SB Place (`bitsmateus/sbplace`, `lib/rede.js` e `lib/checkout.js`): OAuth2, 3DS, consulta por referência e limite de tentativas por IP. **Reaproveitar.**
  - Na SB Place (outro CNPJ), a Rede recusou acima de 12x. É limite do PV. **[A CONFIRMAR]** com uma transação real que o PV da ShopBike aceita 13x a 21x pela API.
- **Pix com QR Code dinâmico e baixa automática** por webhook: o pedido vira "Pago" sozinho. Conferir o CPF de quem pagou com o do comprador (5.8). **[A CONFIRMAR]** o provedor do Pix (Rede, banco ou outro).
- **2 cartões, Pix + cartão e Pix + 2 cartões**: cobrança dividida com estorno automático se uma parte falhar.
- Gateway reserva: **[A CONFIRMAR]** se mantém um segundo (ex.: Mercado Pago) para contingência.
- Estorno total e parcial pelo painel, conciliação (valor, parcelas, NSU, TID e autorização) e relatório por forma de pagamento.
- Formas manuais configuráveis: pagamento na retirada, a combinar, depósito, financiamento e condicional (existem na Climba; **[A CONFIRMAR]** quais são usadas).

### 5.8 Antifraude próprio — F1 (prioridade alta)

O cliente relata ataques constantes de quadrilhas e um golpe recente que "nem chegou na ClearSale". **Todo pedido de todo canal passa pela análise:** site, link de pagamento, Pix e retirada.

**Camada 1: antes do pagamento**
- Limite de tentativas de cartão por CPF, aparelho, IP e cartão (o "teste de cartão"). A SB Place usa 6 tentativas a cada 10 minutos por IP.
- Identificação do aparelho (fingerprint), detecção de VPN/proxy, localização do IP e captcha quando houver suspeita.
- Validação de CPF, e-mail e telefone.

**Camada 2: nota de risco (0 a 100), com o motivo de cada ponto registrado**

| Regra | Peso inicial |
|---|---|
| Dado em lista de bloqueio (CPF, e-mail, telefone, endereço, aparelho, cartão) | +60 |
| Titular do cartão diferente do comprador | +25 |
| Mais de 2 cartões tentados no mesmo pedido ou aparelho | +25 |
| Pix pago por CPF diferente do comprador | +30 |
| Endereço de entrega usado por outros CPFs | +20 |
| Primeira compra acima de R$ 3.000 | +15 |
| Acesso de um estado e entrega em outro | +15 |
| Acesso por VPN ou proxy | +15 |
| E-mail ou telefone criado há menos de 30 dias | +10 |
| Compra autenticada no banco (3DS) | −30 |
| Cliente com compras anteriores sem problema | −15 |

- Base de 8 pontos e nota limitada entre 0 e 100.
- **Faixas:** 0 a 29 aprova sozinho; 30 a 59 vai para revisão; 60 ou mais bloqueia.
- Regras, pesos e faixas editáveis no painel. Ligar ou desligar uma regra recalcula as notas.
- **Rede de vínculos:** CPF, e-mail, telefone, cartão (BIN + final), endereço e aparelho ligados entre si. Se qualquer um aparecer numa fraude, todo pedido ligado trava.

**Camada 3: autenticação no banco (3DS)** nos pedidos de risco, ou em todos acima de um valor configurável.

**Camada 4: conferência ativa no risco médio**
- Confirmação pelo WhatsApp oficial (template NX).
- Pedido de documento com foto e selfie, enviado por link seguro, com o arquivo guardado de forma restrita.
- No Pix, CPF de quem pagou igual ao do comprador.

**Camada 5: entrega e retirada**
- Retirada só com documento do titular.
- Pedido de risco só sai para o endereço de cobrança.
- Troca de endereço depois da compra trava o pedido.
- Nada é despachado antes da aprovação.

**Telas e funções:**
- Fila de revisão com nota, motivos, dados ligados e ações: Aprovar, Pedir documento, Recusar e bloquear. O protótipo já mostra essa tela.
- Lista de bloqueio, com origem e quem incluiu.
- Marcação de chargeback e fraude confirmada, que alimenta a lista de bloqueio.
- Relatório com taxa de aprovação, tempo de revisão, fraudes evitadas e chargebacks.
- Consulta opcional a bureau de dados, para conferir se telefone e endereço pertencem ao CPF. Tem custo por consulta, então usar só no risco médio ou alto. **[A CONFIRMAR]** o fornecedor.
- **Antes das regras finais:** perguntar ao cliente como foi o último golpe e incluir uma regra específica para ele.

### 5.9 Pedidos e operação — F1

**Status (iguais aos de hoje, mais os do antifraude):** Aguardando pagamento (Pendente), Em análise (antifraude), Pago, Em separação, Faturado, Autorizado, Enviado, Entregue, Cancelado e Bloqueado. **[A CONFIRMAR]** o significado de "Autorizado" na operação deles.

**Lista de pedidos:**
- Filtros: número, NF, CPF/CNPJ, nome, e-mail, código e nome do produto, status, período, canal (site, link, IA) e vendedor.
- Colunas: pedido, data, cliente, canal, pagamento, nota de risco, total, status e **próxima ação** (ex.: "Faturar pedido", "Imprimir etiqueta", "Aguarde confirmação do pagamento", "Última tentativa de pagamento negada").
- Exportar planilha e ações em massa (imprimir etiquetas e pedidos).

**Detalhe do pedido:** abas Produtos, Entrega, Pagamento, Pedido, Cliente, Histórico de status e Antifraude; observações internas; alterar o pedido (endereço, itens antes do faturamento); cancelar com estorno.

**Fluxo:** pago → separação → faturado (NF da Bruning) → etiqueta e envio (código de rastreio) → entregue. Cada mudança gera histórico e notificação (5.14).

### 5.10 Frete e logística — F1

**Hoje:**
- **Correios com contrato:** PAC e Sedex ativos; PAC Mini inativo.
- **Transportadoras ativas:** Expresso São Miguel, Translovato, Jamef Econômico (rodoviário), Rodonaves, Coopex, "Arlete com ADV" e "A Combinar".
- Inativas: Jadlog, Mercado Envios, Frenet, Braspress, Motoboy, Entrega Própria, fretes fixos e "Envio ShopBike".
- Retirada na loja, regras de frete grátis, cotações de frete e log do cálculo de frete.

**Funções:**
- Cálculo de frete por CEP com peso, dimensões e valor; prazo de manuseio por produto; frete grátis por região, valor e produto; retirada na loja (uma ou mais lojas).
- Integração com os Correios pelo contrato próprio: preço e prazo, etiqueta, pré-postagem (PLP), aviso de recebimento e rastreio.
- Transportadoras por tabela própria ou por agregador (Frenet, Melhor Envio ou outro). **[A CONFIRMAR]** quais têm API.
- Impressão de etiquetas e pedidos em lote.
- Rastreio automático, com status no pedido e aviso ao cliente.

### 5.11 Trocas e devoluções — F1

- Pedido de troca ou devolução pela área do cliente ou pelo painel, com motivos cadastráveis.
- Fluxo: solicitado → aprovado → recebido → concluído (troca, vale ou estorno), com etiqueta reversa quando houver.
- Relatório de trocas por produto e motivo.

### 5.12 Clientes e área do cliente — F1

- Cadastro (PF/PJ), endereços, grupos de clientes, histórico de compras, aniversariantes e consentimentos (LGPD).
- **Área do cliente:** pedidos (inclusive os migrados da Climba), rastreio, trocas, favoritos, dados e endereços; login por e-mail com senha ou código pelo WhatsApp.
- Pedido de exclusão ou exportação de dados (LGPD).
- Formulário de contato no painel.

### 5.13 Marketing e conversão — F1

- **Cupons:** valor ou percentual, frete grátis, por produto, categoria ou marca, valor mínimo, limite de uso por cliente e geral, validade, cupom automático (aplicado sem digitar) e cupom de primeira compra.
- **Promoções** com período, frete grátis configurável, vitrines (destaques, promoção, lançamento automático) e banners.
- **Leads:** pop-up de captação, base de leads e envio ao CRM NX.
- **Avaliações** de produto (nativas; substitui Trustvox e Ebit, **[A CONFIRMAR]**), perguntas e respostas, lista de favoritos, avise-me quando chegar, compre junto, compra sem cadastro e "comprar pelo WhatsApp".
- **Afiliados** (F2): link com código, comissão e relatório.

### 5.14 Notificações — F1

**WhatsApp oficial pela API da NX:** pedido recebido, pagamento aprovado, nota emitida, enviado com rastreio, saiu para entrega, pronto para retirada, troca atualizada e confirmação do antifraude.
- Templates escolhidos no painel, como no site da SB Place (`NX_API_URL`, `NX_API_ID`, `NX_API_TOKEN`).

**Recuperação automática:** carrinho abandonado e Pix gerado e não pago geram mensagem no WhatsApp. Se o cliente responder, a conversa cai para um vendedor na plataforma NX. Substitui o CartStack.

**E-mail transacional** com os mesmos eventos e templates editáveis (hoje há "Template de e-mails", "Avisos por e-mail" e log de envio).

**Notificações internas:** novo pedido, pedido em análise, integração parada e estoque baixo.

### 5.15 Link de pagamento do vendedor — F1 (diferencial)

- No painel ou no celular, o vendedor monta o pedido com os **itens reais** (produtos e variações do catálogo, serviços e frete), aplica desconto dentro do limite do perfil e escolhe as parcelas, até 21x.
- O link (`shopbike.com.br/pagar/<token>`) abre o checkout da própria loja, com as mesmas regras do site: cartão pela Rede até 21x, Pix, antifraude, 3DS e baixa de estoque.
- **Não usa o produto "Link de Pagamento" da Rede**, que tem limite de 12x e R$ 30 mil.
- Validade, uso único, cancelamento, status (ativo, em uso, pago, expirado, cancelado) e envio pelo WhatsApp com um toque.
- A venda fica atribuída ao vendedor.
- Referência: módulo de links da SB Place (`lib/links.js`, `lib/link-status.js`, `app/pagar/[token]`).

### 5.16 Vendedores, metas e comissão — F2

- Cadastro de vendedores e atribuição da venda (link de pagamento, cupom do vendedor ou indicação manual no pedido).
- Ranking, metas e cálculo de comissão por período, com regra por categoria ou margem **[A CONFIRMAR]**.
- Envio das vendas ao CRM NX, para fechar o funil conversa → venda.

### 5.17 API para a IA de vendas e para a NX — F1

O agente de IA da ShopBike no WhatsApp (n8n) hoje consulta a API da Climba para buscar produtos e fotos. Ele passa a consultar a plataforma nova:
- Busca de produtos por texto, categoria, faixa de preço, aro e tamanho, com estoque, preço, parcelas e fotos.
- Detalhe do produto com URL pública.
- Criação de link de pagamento pela IA (opcional, com aprovação de um vendedor).
- Consulta do status do pedido por número e CPF, para a IA responder "cadê meu pedido".
- Autenticação por token por integração, limite de requisições e documentação (OpenAPI).

### 5.18 Diferenciais — F2

- **Calculadora de tamanho de quadro:** altura, entreperna e tipo de uso indicam o tamanho, mostrado na página do produto e nos filtros.
- **Seminovas e bike usada na troca:** cadastro com estado, laudo e fotos; formulário de avaliação da usada, com fluxo no painel e crédito no pedido.
- **Pós-venda e oficina:** lembretes de revisão (ex.: 30 e 180 dias) pelo WhatsApp e agendamento de oficina pelo site e pelo WhatsApp.
- **Cadastro com IA:** sugestão de título, descrição, ficha técnica e SEO, e alerta de cadastro fraco.
- **Painel único:** loja, WhatsApp e campanhas no mesmo dashboard.

### 5.19 Dashboard e relatórios — F1 (os principais) e F2 (o restante)

**Dashboard:** visitas, carrinhos e abandonados, pedidos, pedidos pagos, vendas, ticket médio, conversão e projeção do mês; comparação com o período anterior e meta; vendas por canal (site, link, IA); resumo do antifraude; pedidos que pedem ação; mais vendidos.

**Relatórios que existem hoje** (os da Fase 1 em negrito; o resto na F2):
- Vendas: **vendas por período**, **por cliente**, **por estado**, **por cidade**, **faturamento por origem do pedido**, **taxa de conversão**, **desempenho de produtos**, **relatório de pedidos**.
- Curva ABC: **por quantidade** e **por valor**; **top produtos**, **categorias mais vendidas**, **marcas mais vendidas**.
- Comportamento: **análise de canal**, **formas de pagamento**, **tipo de frete**, relatório de frete, **cupons**, interesse em produtos, **tentativa de compra sem estoque**, cupons de troca, trocas por produto, listas de favoritos.
- Cadastros: estatísticas, quantidade de fotos e de descrição por produto, estoque agrupado, códigos duplicados, exportação de URLs de imagens.
- Clientes: relatório de clientes, aniversariantes, cadastros com dados incompletos.
- Logs: integração, pesquisas, cálculo de frete, e-mails, acessos de clientes e da administração.

Todos com filtro por período e exportação em planilha.

### 5.20 Vendas especiais — F2

- **B2B/lojistas:** cadastro aprovado, tabela de preço própria e pedido mínimo.
- **Lista de presentes** com categorias.
- **Produtos personalizados**, com atributos de personalização.
- **Afiliados** (ver 5.13).

### 5.21 Conteúdo — F1

Páginas extras (CMS simples), textos e políticas, galeria, lojas (endereços e horários), agenda, serviços, trabalhe conosco e blog. Hoje há um blog WordPress instalado; **[A CONFIRMAR]** se continua no WordPress ou migra.

### 5.22 Painel administrativo — F1

- Usuários, perfis de permissão, 2FA e sessão segura.
- Log de acessos e auditoria (quem alterou preço, aprovou pedido ou mexeu em regra).
- Busca global (produto, pedido, cliente) e central de notificações.

### 5.23 Configurações — F1

Dados da loja, domínio, formas de pagamento, formas de envio e prazos, remetente, textos padrão, e-mails, redes sociais, selos de segurança, privacidade (LGPD), redirecionamentos de URL, robots, scripts de rastreamento (com cuidado de segurança) e cache.

### 5.24 Marketing externo e rastreamento — F1

- GA4, Google Search Console, feed do Google Shopping (Merchant Center) e Bing Webmaster.
- Meta Pixel + **API de Conversões** (servidor) e catálogo da Meta sempre atualizado.
- E-mail marketing: envio de contatos e eventos ao Mailbiz/MailChimp. **[A CONFIRMAR]** se continuam em uso.

---

## 6. Integrações externas

| Integração | Uso | Fase | Observações |
|---|---|---|---|
| ERP Bruning | Produtos, estoque, preços, pedidos e NF | F1 | Seção 5.3. Ponto mais crítico do projeto. |
| e.Rede (Itaú) | Cartão até 21x, 3DS e consulta | F1 | PV + token de e-commerce da ShopBike. Reaproveitar `lib/rede.js` da SB Place. |
| Pix (provedor **[A CONFIRMAR]**) | QR dinâmico, webhook e CPF do pagador | F1 | |
| Correios (contrato) | Preço, prazo, etiqueta, PLP e rastreio | F1 | |
| Transportadoras / agregador | Cotação e rastreio | F1 | **[A CONFIRMAR]** quais têm API. |
| NX (API Z-PRO / WhatsApp oficial) | Notificações, recuperação e conferência do antifraude | F1 | Templates aprovados na Meta. |
| CRM NX | Leads, vendas e funil | F1/F2 | |
| Agente de IA (n8n) | Consulta de catálogo e pedidos | F1 | API da seção 5.17. |
| Google (GA4, Merchant, Search Console) | Rastreio e catálogo | F1 | |
| Meta (Pixel, CAPI, catálogo) | Rastreio e catálogo | F1 | |
| Mailbiz / MailChimp | E-mail marketing | F1 | **[A CONFIRMAR]** |
| Bureau de dados | Antifraude | F2 | Opcional, com custo por consulta. |
| ANYMARKET | Marketplaces | Fora | Decisão do cliente. |

---

## 7. Modelo de dados (entidades principais)

Rascunho para orientar o Claude Code. Nomes e campos finais ficam a cargo dele.

- **loja / configuracao**: dados da loja, endereços de retirada, parâmetros (parcelas, desconto à vista, faixas do antifraude).
- **usuario_admin**, **perfil**, **permissao**, **log_acesso**, **auditoria**.
- **produto**: dados gerais, SEO, status, marca_id, código ERP.
- **variacao**: produto_id, SKU, EAN, atributos (tamanho, aro, cor), preço, preço promocional, estoque, peso e dimensões.
- **categoria** (árvore), **marca**, **tag**, **etiqueta**, **caracteristica**, **midia** (foto/vídeo, ordem, alt), **tabela_tamanho**, **faq_produto**.
- **lista_preco**, **regra_parcelamento** (por categoria, marca ou produto).
- **seminova_laudo** (F2).
- **cliente**, **endereco**, **grupo_cliente**, **consentimento**.
- **carrinho**, **item_carrinho**.
- **pedido**: canal, vendedor_id, cliente, endereços, valores, frete, status, token público, NF.
- **item_pedido**, **historico_status**, **observacao_pedido**.
- **pagamento**: forma, parcelas, valor, gateway, TID, NSU, autorização, 3DS, CPF do pagador (Pix), estornos.
- **link_pagamento**: token, vendedor, itens, validade, status, pedido_id.
- **analise_risco**: pedido_id, nota, faixa, regras disparadas (com peso), decisão, quem decidiu e quando.
- **regra_risco**, **lista_bloqueio** (tipo, valor, origem), **vinculo** (CPF, e-mail, telefone, cartão, endereço, aparelho), **chargeback**.
- **envio**: transportadora, serviço, etiqueta, PLP, rastreio e eventos.
- **troca_devolucao**, **motivo_troca**.
- **cupom**, **promocao**, **banner**, **vitrine**, **pagina**, **menu**.
- **avaliacao**, **pergunta_resposta**, **favorito**, **aviso_estoque**, **lead**.
- **notificacao** (template, canal, evento, envio e status).
- **integracao_log** (ERP, Rede, Pix, Correios, NX).
- **redirect_url** (antiga → nova).
- **vendedor**, **meta**, **comissao** (F2).

---

## 8. Requisitos não funcionais

**Segurança e pagamentos**
- Nunca gravar nem logar número de cartão ou CVV. Usar tokenização ou envio direto ao gateway; o modelo da SB Place passa o cartão só em memória a caminho da Rede.
- HTTPS obrigatório, cookies seguros, proteção contra CSRF e XSS, cabeçalhos de segurança e limite de requisições.
- Segredos só em variáveis de ambiente, nunca no repositório.
- 2FA no painel, perfis de permissão e auditoria.
- Documentos do antifraude (selfie e documento) com acesso restrito e prazo de retenção definido.

**LGPD**
- Consentimento de cookies e marketing, política de privacidade, exportação e exclusão de dados a pedido e registro de quem acessou dados pessoais.

**Desempenho**
- Página de produto e categoria rápidas no celular (metas de Core Web Vitals no verde).
- Imagens otimizadas (WebP/AVIF, tamanhos responsivos, CDN) e cache.
- Suportar o volume atual com folga: 7.400 produtos e mais de 30 mil visitas por mês, além dos picos de campanha.

**Disponibilidade e observabilidade**
- Monitoramento de uptime, alertas no WhatsApp da NX, logs estruturados e rastreio de erros.
- Ambiente de homologação separado da produção.

**Backups**
- Backup diário do banco e das mídias fora do servidor, com teste de restauração mensal.

**SEO**
- Manter as posições: redirecionamento 301 de todas as URLs antigas, mesmos slugs quando possível, sitemap e Search Console acompanhados por 60 dias depois da virada.

**Acessibilidade**
- Contraste, foco visível, navegação por teclado no checkout e textos alternativos.

---

## 9. Infraestrutura e deploy

- **Easypanel em VPS dedicada à ShopBike**, separada do n8n e dos outros clientes.
- Domínio `shopbike.com.br` (DNS **[A CONFIRMAR]**: quem administra). Recomendado usar Cloudflare na frente (DNS, CDN de imagens e proteção).
- Serviços (proposta; decidir na seção 12): aplicação (loja e painel), banco de dados, fila e cache, busca, armazenamento de mídias (disco persistente ou S3) e tarefas agendadas (sincronização com o ERP, rastreio, recuperação de carrinho, expiração de links e Pix).
- **Ambientes:** homologação (`homolog.shopbike.com.br` ou similar, protegido) e produção.
- Deploy pelo Git: build no Easypanel a partir do repositório, variáveis de ambiente no Easypanel e volumes persistentes.
- Lista de variáveis de ambiente documentada (`.env.example`): Rede, Pix, NX, Correios, ERP, e-mail, Google, Meta e segredos de sessão.

---

## 10. Migração da Climba

**Dados a exportar e importar:**
- 7.395 produtos com variações, fotos, vídeos, descrições, características, categorias, marcas, tags, preços e regras de parcelamento.
- Clientes e endereços; senhas só se a Climba permitir exportar **[A CONFIRMAR]**, senão o cliente cria uma nova senha no primeiro acesso.
- Histórico de pedidos (somente consulta), cupons ativos, avaliações, perguntas e respostas, leads, conteúdo das páginas e banners.
- **Mapa de URLs:** produtos, categorias, marcas, páginas e busca. Exemplos atuais: `/procura` e `/bicicleta-seminova...`.

**Etapas da migração (sem datas):**
1. Levantamento e acessos: exportações, mapa de URLs e credenciamentos (Rede, Pix, Correios).
2. Conexão com a Bruning (seção 5.3).
3. Construção em homologação.
4. Migração dos dados, com conferência por amostragem.
5. Testes com a equipe: compra completa com cartão, Pix, antifraude, NF, etiqueta, rastreio, WhatsApp e link de pagamento.
6. Treinamento: painel para a equipe e link de pagamento para os vendedores.
7. Virada: última sincronização de pedidos e estoque, DNS apontado e 301 ativos.
8. Acompanhamento: a Climba fica como plano de volta e só é desligada com tudo estável. Verificar no contrato da Climba o aviso prévio e a multa **[A CONFIRMAR]**.

---

## 11. Fases e ordem de construção

A ordem segue as dependências: catálogo e ERP primeiro, porque tudo depende deles.

**Fase 1: desligar a Climba**
1. Base: projeto, autenticação do painel, perfis, auditoria, CI/deploy e homologação.
2. Catálogo, preços e parcelamento (5.1, 5.2).
3. Integração Bruning (5.3), em paralelo ao item 2.
4. Loja virtual e busca (5.4, 5.5, 5.21).
5. Carrinho, checkout e pagamentos com Rede, Pix e 2 cartões (5.6, 5.7).
6. Antifraude (5.8).
7. Pedidos, frete, trocas e clientes (5.9 a 5.12).
8. Marketing, notificações e link de pagamento (5.13 a 5.15).
9. API para a IA e para a NX (5.17), dashboard e relatórios principais (5.19), rastreamento (5.24).
10. Migração de dados, 301, testes, treinamento e virada (seção 10).

**Fase 2: evolução**
Vendedores e comissão (5.16), diferenciais (5.18), relatórios restantes, vendas especiais (5.20), afiliados e bureau de dados no antifraude.

---

## 12. Decisões técnicas a tomar com o Claude Code

O cliente já tem um **repositório de referência com o visual e a tecnologia preferidos** **[link a informar]**. O Claude Code deve ler esse repositório e este documento e propor as decisões abaixo, com prós e contras, **antes de escrever código**. Registrar as escolhas em `docs/DECISOES.md`.

| # | Decisão | Critérios |
|---|---|---|
| 1 | Linguagem e framework da loja e do painel (um app ou dois) | SEO com renderização no servidor, desempenho no celular, alinhamento com o repositório de referência, manutenção pela NX |
| 2 | Construir do zero ou partir de uma base de e-commerce open-source (ex.: Medusa, Saleor, Vendure) | Prazo, quanto do carrinho, promoções e pedidos já vem pronto, liberdade de layout, licença |
| 3 | Banco de dados | Relacional (variações, pedidos, relatórios), backups, migrações versionadas |
| 4 | Busca | Sinônimos, tolerância a erros, filtros por facetas, peso no servidor |
| 5 | Filas e tarefas agendadas | Sincronização com o ERP, notificações, rastreio, expiração de links e Pix |
| 6 | Armazenamento e otimização de imagens | 7.400 produtos com várias fotos, CDN |
| 7 | Estratégia da integração Bruning (5.3: compatível com a Climba ou API nova) | Depende da documentação da Climba e da conversa com a Bruning |
| 8 | Pagamentos: reaproveitar `lib/rede.js` da SB Place; provedor do Pix; gateway reserva; captura imediata ou pré-autorização | Antifraude antes ou depois da autorização |
| 9 | Desenho do motor de antifraude | Regras configuráveis, recálculo, vínculos, fila; onde roda (no checkout, de forma síncrona) |
| 10 | Autenticação de clientes e do painel | Senha, código pelo WhatsApp, 2FA, sessões |
| 11 | Estrutura do repositório, testes e CI | Testes automáticos no checkout, nos pagamentos e no antifraude; lint; deploy pelo Easypanel |
| 12 | Observabilidade | Logs, erros, uptime, alertas |
| 13 | Design system | Seguir o repositório de referência com as cores da ShopBike (branco, vermelho e preto) e a logo |

---

## 13. Pendências e perguntas em aberto

**Com o cliente:**
1. Link do repositório de referência (visual e tecnologia).
2. Data desejada para a virada. A primeira mensalidade é em 10/01/2027 e há 2 meses grátis; alinhar a expectativa.
3. Como foi o último golpe que "nem chegou na ClearSale" (para criar a regra específica).
4. Histórico de chargebacks e contrato da ClearSale (data de saída).
5. Mercado Livre/ANYMARKET: o que acontece com esses pedidos na virada.
6. Mailbiz, MailChimp, SmartHint, Trustvox, Ebit, CartStack e blog WordPress: quais continuam.
7. Quais formas manuais de pagamento usam (retirada, a combinar, financiamento, condicional) e se o boleto volta.
8. Significado do status "Autorizado" e o fluxo real da expedição.
9. Regras de parcelamento personalizado (categorias, marcas e produtos) e desconto à vista.
10. Regras de comissão e metas dos vendedores.
11. Quem aprova o layout e quem participa dos testes.
12. Acessos: painel da Climba (exportações), DNS, Google, Meta, Correios e Rede.

**Com terceiros:**
13. **Bruning:** documentação da API V1 da Climba, endpoints usados, se aceitam trocar URL e token e se há custo.
14. **Rede:** PV e token de e-commerce da ShopBike, 3DS habilitado, confirmação de 13x a 21x pela API e teto por transação; Pix pela Rede ou por outro provedor.
15. **Climba:** aviso prévio e multa do contrato; exportação completa (produtos, clientes, pedidos, senhas, URLs).
16. **Correios:** contrato, cartão de postagem e credenciais da API.

---

## 14. Referências

- **PDF de escopo enviado ao cliente:** diferenciais, sistema atual e migração.
- **Apresentação comercial** (deck de 21 slides): antifraude em camadas, diferenciais, migração e investimento.
- **Protótipo navegável** (`shopbike-admin`): visão geral, pedidos com nota de risco, antifraude (fila, regras, lista de bloqueio) e link de pagamento. Serve de referência de fluxo e de regras, não de tecnologia.
- **Site da SB Place** (`github.com/bitsmateus/sbplace`): integração e.Rede v2 com 3DS (`lib/rede.js`), checkout e limite de tentativas (`lib/checkout.js`), links de pagamento (`lib/links.js`, `lib/link-status.js`, `app/pagar/[token]`) e notificações pela NX (`lib/nx.js`, `lib/notifications.js`).
- **Painel da Climba** (`shopbike.com.br/admin`): fonte de verdade das configurações atuais até a virada.
