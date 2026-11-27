# Backlog

Ideias e pedidos anotados para trabalhar depois. Cada item diz de onde veio, o que já existe e o que falta.
Quando um item for feito, ele sai daqui e vira commit (e, se mudar regra, entra em `DECISOES.md`).

---

## 1. Aviso no WhatsApp ao mudar a situação do pedido

**Pedido do cliente (27/11/2026):** quando o pedido muda de situação (ex.: "Enviado"), o cliente recebe uma mensagem no WhatsApp pela NX, usando o número da ShopBike conectado na API oficial.

**Onde nasce:** detalhe do pedido (gaveta aberta em `/admin/pedidos`, `src/ui/painel/pedido-drawer.tsx`) e quadro da Expedição (`src/app/admin/(painel)/expedicao/quadro.tsx`). São os dois lugares em que a equipe muda a situação.

**O que já existe**
- Especificação: seção 5.14 (WhatsApp oficial pela API da NX: pedido recebido, pagamento aprovado, nota emitida, enviado com rastreio, saiu para entrega, pronto para retirada, troca atualizada, confirmação do antifraude) e a tabela de integrações (NX / API Z-PRO, templates aprovados na Meta).
- Tela `/admin/notificacoes` (protótipo): template por evento, liga/desliga e log de envios (`eventosNotificacao` e `logEnvios` em `src/mock/painel.ts`).

**O que falta decidir com o cliente**
- Quais situações disparam mensagem (sugestão: as 8 da seção 5.14) e quais ficam só por e-mail.
- Texto de cada template e as variáveis (nome, número do pedido, rastreio, link de acompanhamento). Cada um precisa de aprovação na Meta antes de usar.
- Se a equipe pode escolher, na hora, "não avisar o cliente" (ex.: correção de situação feita por engano).

**Como fica no painel (protótipo, Etapa 0)**
- Ao mudar a situação na gaveta do pedido ou na Expedição, mostrar antes de confirmar: "O cliente vai receber no WhatsApp: [prévia do template]", com a opção de não enviar.
- Depois do envio, registrar no Histórico do pedido: "Mensagem 'Enviado com rastreio' enviada no WhatsApp · 13:42 · entregue/lida/falhou".
- Na Expedição, "Despachar" passa a avisar o cliente junto com o código de rastreio.

**Como fica na plataforma (Etapa 1 em diante)**
- A mudança de situação grava um evento; um job (pg-boss) envia pela API da NX (`NX_API_URL`, `NX_API_ID`, `NX_API_TOKEN`), com nova tentativa automática se falhar.
- Um envio por evento e por pedido (chave de idempotência), para não mandar duas vezes se a situação for salva de novo.
- Status de entrega e leitura voltam pelo webhook da NX e atualizam o log e o histórico do pedido.
- Se o cliente responder à mensagem, a conversa cai para um atendente na plataforma NX (mesmo fluxo da recuperação de carrinho).
- Só envia para quem tem WhatsApp no cadastro; sem número, registra "não enviado: cliente sem WhatsApp".

**Pronto quando:** mudar um pedido para "Enviado" gera a mensagem com o rastreio no WhatsApp do cliente, o envio aparece no histórico do pedido e no log de `/admin/notificacoes`, e uma segunda gravação da mesma situação não manda de novo.
