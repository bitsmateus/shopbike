/*
 * Dados fictícios das telas internas do painel (Etapa 0).
 * Nomes, documentos e números são inventados.
 */

// ---------- Clientes ----------
export type Cliente = {
  id: string;
  nome: string;
  tipo: "PF" | "PJ";
  doc: string;
  email: string;
  tel: string;
  cidade: string;
  uf: string;
  grupo: "Varejo" | "Ciclista frequente" | "Lojista (B2B)" | "Equipe de pedal";
  pedidos: number;
  totalGasto: number;
  ultimaCompra: string;
  desde: string;
  marketing: boolean;
  aniversario: string;
  origem: string;
};

export const clientes: Cliente[] = [
  { id: "c1", nome: "Rafael Medeiros", tipo: "PF", doc: "***.482.119-**", email: "rafa.med@gmail.com", tel: "(48) 99812-4410", cidade: "Tubarão", uf: "SC", grupo: "Ciclista frequente", pedidos: 4, totalGasto: 712_400, ultimaCompra: "25/11/2026", desde: "03/2021", marketing: true, aniversario: "14/12", origem: "Site" },
  { id: "c2", nome: "Jéssica Pacheco", tipo: "PF", doc: "***.118.702-**", email: "jessica.pacheco@hotmail.com", tel: "(48) 99134-0091", cidade: "Laguna", uf: "SC", grupo: "Varejo", pedidos: 2, totalGasto: 345_700, ultimaCompra: "25/11/2026", desde: "06/2025", marketing: true, aniversario: "02/03", origem: "Link (Diego)" },
  { id: "c3", nome: "Marcos Vieira", tipo: "PF", doc: "***.002.981-**", email: "marcosvieira.mtb@gmail.com", tel: "(48) 99601-3344", cidade: "Florianópolis", uf: "SC", grupo: "Ciclista frequente", pedidos: 6, totalGasto: 1_184_900, ultimaCompra: "24/11/2026", desde: "01/2019", marketing: true, aniversario: "29/11", origem: "Site" },
  { id: "c4", nome: "Bike Point Criciúma Ltda", tipo: "PJ", doc: "12.***.***/0001-90", email: "compras@bikepointcri.com.br", tel: "(48) 3433-1020", cidade: "Criciúma", uf: "SC", grupo: "Lojista (B2B)", pedidos: 11, totalGasto: 4_812_300, ultimaCompra: "18/11/2026", desde: "08/2022", marketing: false, aniversario: "—", origem: "Painel" },
  { id: "c5", nome: "Tiago Rocha", tipo: "PF", doc: "***.230.118-**", email: "tiago.rocha@empresa.com.br", tel: "(48) 99142-8811", cidade: "Tubarão", uf: "SC", grupo: "Equipe de pedal", pedidos: 3, totalGasto: 801_200, ultimaCompra: "23/11/2026", desde: "02/2024", marketing: true, aniversario: "07/01", origem: "IA no WhatsApp" },
  { id: "c6", nome: "Ana Clara Bez", tipo: "PF", doc: "***.390.551-**", email: "anaclarabez@gmail.com", tel: "(48) 99988-1020", cidade: "Criciúma", uf: "SC", grupo: "Varejo", pedidos: 1, totalGasto: 84_800, ultimaCompra: "24/11/2026", desde: "11/2026", marketing: false, aniversario: "30/11", origem: "IA no WhatsApp" },
  { id: "c7", nome: "Gabriela Nunes", tipo: "PF", doc: "***.771.664-**", email: "gabi.nunes@yahoo.com.br", tel: "(48) 98810-7712", cidade: "Imbituba", uf: "SC", grupo: "Varejo", pedidos: 1, totalGasto: 219_900, ultimaCompra: "24/11/2026", desde: "11/2026", marketing: true, aniversario: "19/08", origem: "Link (Carla)" },
  { id: "c8", nome: "Henrique Lopes", tipo: "PF", doc: "***.440.903-**", email: "henrique.lopes@gmail.com", tel: "(48) 99900-4412", cidade: "Braço do Norte", uf: "SC", grupo: "Varejo", pedidos: 2, totalGasto: 52_400, ultimaCompra: "22/11/2026", desde: "04/2023", marketing: false, aniversario: "11/05", origem: "Site" },
  { id: "c9", nome: "Pedal Sul Assessoria Esportiva", tipo: "PJ", doc: "33.***.***/0001-07", email: "contato@pedalsul.com.br", tel: "(48) 3626-0000", cidade: "Tubarão", uf: "SC", grupo: "Equipe de pedal", pedidos: 7, totalGasto: 2_290_000, ultimaCompra: "10/11/2026", desde: "03/2020", marketing: true, aniversario: "—", origem: "Painel" },
  { id: "c10", nome: "Camila Souza", tipo: "PF", doc: "***.551.220-**", email: "camila.s@gmail.com", tel: "(48) 99711-0442", cidade: "Gravatal", uf: "SC", grupo: "Varejo", pedidos: 1, totalGasto: 449_900, ultimaCompra: "28/09/2026", desde: "09/2026", marketing: true, aniversario: "26/11", origem: "Site" },
];

export const conversasCliente = [
  { quando: "25/11, 10:02", quem: "Cliente", texto: "Oi! Tem a Big Wheel 7.0 no tamanho 17?" },
  { quando: "25/11, 10:02", quem: "IA ShopBike", texto: "Tem sim! Na cor preta e vermelha. Em até 21x de R$ 214,24 ou R$ 4.049,10 no Pix. Quer que um vendedor monte o pedido?" },
  { quando: "25/11, 10:05", quem: "Cliente", texto: "Quero, pode ser preta." },
  { quando: "25/11, 10:09", quem: "Diego (vendedor)", texto: "Rafael, segue o link de pagamento: shopbike.com.br/pagar/…" },
  { quando: "25/11, 13:34", quem: "Sistema", texto: "Pagamento aprovado · pedido #48213" },
];

// ---------- Trocas ----------
export type Troca = {
  id: string;
  pedido: string;
  cliente: string;
  produto: string;
  motivo: string;
  tipo: "Troca" | "Devolução";
  resolucao: "Troca por outro tamanho" | "Vale-compra" | "Estorno" | "A definir";
  status: "Solicitado" | "Aprovado" | "Em trânsito" | "Recebido" | "Concluído" | "Recusado";
  aberto: string;
  valor: number;
  reversa?: string;
};

export const trocas: Troca[] = [
  { id: "T-0142", pedido: "48190", cliente: "Camila Souza", produto: "Camisa ShopBike Team · M · Preto", motivo: "Tamanho não serviu", tipo: "Troca", resolucao: "Troca por outro tamanho", status: "Solicitado", aberto: "25/11, 09:12", valor: 17_990 },
  { id: "T-0141", pedido: "48175", cliente: "Henrique Lopes", produto: "Capacete Specialized Align II · G · Branco", motivo: "Produto com defeito", tipo: "Troca", resolucao: "A definir", status: "Aprovado", aberto: "24/11, 16:40", valor: 39_900, reversa: "LR882041993BR" },
  { id: "T-0140", pedido: "48166", cliente: "Marcos Vieira", produto: "Pneu Pirelli Scorpion XC RC 29x2.2", motivo: "Arrependimento (7 dias)", tipo: "Devolução", resolucao: "Estorno", status: "Em trânsito", aberto: "23/11, 11:05", valor: 39_900, reversa: "LR882041201BR" },
  { id: "T-0139", pedido: "48120", cliente: "Tiago Rocha", produto: "Corrente Sram GX Eagle 12v", motivo: "Produto diferente do anunciado", tipo: "Troca", resolucao: "Vale-compra", status: "Recebido", aberto: "20/11, 14:22", valor: 32_900 },
  { id: "T-0138", pedido: "48098", cliente: "Ana Clara Bez", produto: "Garrafa ShopBike 750 ml · Vermelho", motivo: "Avaria no transporte", tipo: "Troca", resolucao: "Troca por outro tamanho", status: "Concluído", aberto: "15/11, 10:10", valor: 4_990 },
  { id: "T-0137", pedido: "48071", cliente: "Rafael Medeiros", produto: "Cassete Shimano Deore M6100 12v", motivo: "Arrependimento (7 dias)", tipo: "Devolução", resolucao: "Estorno", status: "Recusado", aberto: "12/11, 18:31", valor: 64_900 },
];

export const motivosTroca = [
  { motivo: "Tamanho não serviu", qtd: 14 },
  { motivo: "Arrependimento (7 dias)", qtd: 9 },
  { motivo: "Produto com defeito", qtd: 6 },
  { motivo: "Avaria no transporte", qtd: 3 },
  { motivo: "Produto diferente do anunciado", qtd: 2 },
];

// ---------- Marketing ----------
export type Cupom = {
  codigo: string;
  descricao: string;
  tipo: "%" | "R$" | "Frete grátis";
  valor: number;
  regra: string;
  minimo: number;
  usos: number;
  limite: number | null;
  validade: string;
  automatico: boolean;
  ativo: boolean;
};

export const cupons: Cupom[] = [
  { codigo: "BLACKSB", descricao: "Black Friday em acessórios", tipo: "%", valor: 15, regra: "Categoria Acessórios e Vestuário", minimo: 10_000, usos: 132, limite: 500, validade: "30/11/2026", automatico: false, ativo: true },
  { codigo: "PRIMEIRA", descricao: "Primeira compra", tipo: "%", valor: 5, regra: "Só primeira compra · 1 uso por CPF", minimo: 0, usos: 41, limite: null, validade: "—", automatico: false, ativo: true },
  { codigo: "PEDAL5", descricao: "Grupo de pedal de quarta", tipo: "%", valor: 5, regra: "Todo o site", minimo: 20_000, usos: 18, limite: 100, validade: "31/12/2026", automatico: false, ativo: true },
  { codigo: "FRETESUL", descricao: "Frete grátis no Sul (automático)", tipo: "Frete grátis", valor: 0, regra: "CEP 80000-000 a 99999-999", minimo: 29_900, usos: 402, limite: null, validade: "—", automatico: true, ativo: true },
  { codigo: "OGGI300", descricao: "R$ 300 off em bikes Oggi", tipo: "R$", valor: 30_000, regra: "Marca Oggi · bikes acima de R$ 3.000", minimo: 300_000, usos: 7, limite: 50, validade: "30/11/2026", automatico: true, ativo: true },
  { codigo: "DIEGO10", descricao: "Cupom do vendedor Diego", tipo: "%", valor: 3, regra: "Atribui a venda ao Diego", minimo: 0, usos: 22, limite: null, validade: "—", automatico: false, ativo: true },
  { codigo: "INVERNO26", descricao: "Liquida inverno", tipo: "%", valor: 20, regra: "Vestuário", minimo: 0, usos: 88, limite: 200, validade: "31/08/2026", automatico: false, ativo: false },
];

export const promocoes = [
  { nome: "Black Friday ShopBike", periodo: "20/11 a 30/11/2026", status: "Ativa", produtos: 214, desconto: "até 20%", freteGratis: true, vendas: 18_204_000, vitrine: "Home · banner principal" },
  { nome: "Semana Specialized", periodo: "01/12 a 07/12/2026", status: "Agendada", produtos: 38, desconto: "10%", freteGratis: false, vendas: 0, vitrine: "Home · banner secundário" },
  { nome: "Cyber Monday · peças", periodo: "30/11/2026", status: "Agendada", produtos: 612, desconto: "15%", freteGratis: true, vendas: 0, vitrine: "Barra superior" },
  { nome: "Dia dos Pais", periodo: "01/08 a 10/08/2026", status: "Encerrada", produtos: 96, desconto: "até 15%", freteGratis: false, vendas: 9_112_000, vitrine: "—" },
];

export const blocosHome = [
  { id: "b1", tipo: "Barra de benefícios", titulo: "Frete grátis · 10% Pix · 21x · horário", ativo: true },
  { id: "b2", tipo: "Banners principais", titulo: "3 banners · Black Friday em 1º", ativo: true },
  { id: "b3", tipo: "Faixa de benefícios", titulo: "4 ícones", ativo: true },
  { id: "b4", tipo: "Categorias com imagem", titulo: "9 categorias", ativo: true },
  { id: "b5", tipo: "Vitrine", titulo: "Mais vendidas do mês (automática)", ativo: true },
  { id: "b6", tipo: "Banner secundário", titulo: "Seminovas com laudo", ativo: true },
  { id: "b7", tipo: "Vitrine", titulo: "Promoções de Black Friday", ativo: true },
  { id: "b8", tipo: "Vídeo", titulo: "Tour pela oficina (YouTube)", ativo: false },
  { id: "b9", tipo: "Vitrine", titulo: "Peças, acessórios e vestuário", ativo: true },
  { id: "b10", tipo: "Marcas", titulo: "7 marcas", ativo: true },
];

export type Recuperacao = {
  id: string;
  tipo: "Carrinho" | "Pix";
  cliente: string;
  itens: string;
  valor: number;
  quando: string;
  etapa: "Aguardando" | "Mensagem enviada" | "Lida" | "Respondeu · com vendedor" | "Recuperado" | "Perdido";
};

export const recuperacoes: Recuperacao[] = [
  { id: "r1", tipo: "Pix", cliente: "Jéssica Pacheco", itens: "Explorer Comp 29 + Capacete", valor: 305_820, quando: "há 18 min", etapa: "Aguardando" },
  { id: "r2", tipo: "Carrinho", cliente: "Lucas M.", itens: "Rockhopper Sport 29 · L", valor: 649_900, quando: "há 42 min", etapa: "Mensagem enviada" },
  { id: "r3", tipo: "Carrinho", cliente: "Patrícia G.", itens: "Capacete Align II + Garrafa", valor: 44_890, quando: "há 1 h", etapa: "Lida" },
  { id: "r4", tipo: "Carrinho", cliente: "Rodrigo Mendes", itens: "Big Wheel 7.0 · 19", valor: 449_900, quando: "há 3 h", etapa: "Respondeu · com vendedor" },
  { id: "r5", tipo: "Pix", cliente: "Eduardo F.", itens: "Cassete M6100", valor: 58_410, quando: "ontem", etapa: "Recuperado" },
  { id: "r6", tipo: "Carrinho", cliente: "Vanessa K.", itens: "Caloi Cecci Aro 16", valor: 89_900, quando: "ontem", etapa: "Recuperado" },
  { id: "r7", tipo: "Carrinho", cliente: "Bruno T.", itens: "Allez E5 · 54", valor: 689_900, quando: "2 dias", etapa: "Perdido" },
];

export const leads = [
  { nome: "Fernanda Lima", contato: "(48) 99120-•••", origem: "Pop-up home", interesse: "Speed", quando: "25/11, 11:40", crm: "Enviado" },
  { nome: "João Pedro", contato: "jp.bike@•••", origem: "Avise-me (Turbo Vado L)", interesse: "Elétrica", quando: "25/11, 09:02", crm: "Enviado" },
  { nome: "Larissa M.", contato: "(48) 98812-•••", origem: "Pop-up home", interesse: "Infantil", quando: "24/11, 20:15", crm: "Enviado" },
  { nome: "Carlos E.", contato: "(48) 99933-•••", origem: "Avaliar minha bike usada", interesse: "Seminova / troca", quando: "24/11, 17:48", crm: "Pendente" },
  { nome: "Sabrina P.", contato: "sabrina•••@gmail.com", origem: "Rodapé · newsletter", interesse: "—", quando: "24/11, 08:30", crm: "Enviado" },
];

export const avaliacoesPendentes = [
  { tipo: "Avaliação", produto: "Oggi Big Wheel 7.0", cliente: "Rafael M.", nota: 5, texto: "Chegou montada e regulada. Atendimento do Diego foi nota 10.", quando: "25/11" },
  { tipo: "Pergunta", produto: "Specialized Turbo Vado SL 4.0", cliente: "João P.", nota: 0, texto: "Qual o peso máximo do ciclista? Serve para quem tem 1,90 m?", quando: "25/11" },
  { tipo: "Avaliação", produto: "Caloi Explorer Comp 29", cliente: "Pedro A.", nota: 2, texto: "A bike é boa, mas a entrega atrasou dois dias e ninguém avisou.", quando: "24/11" },
  { tipo: "Pergunta", produto: "Oggi Hacker Sport 29", cliente: "Larissa M.", nota: 0, texto: "Aceita bike usada na troca?", quando: "24/11" },
];

// ---------- Expedição ----------
export const expedicao = [
  { pedido: "48213", cliente: "Rafael Medeiros", itens: 1, envio: "Retirada na loja", etapa: "Separar", nf: false, obs: "Retirada só com documento do titular" },
  { pedido: "48202", cliente: "Bike Point Criciúma", itens: 6, envio: "Rodonaves", etapa: "Separar", nf: false },
  { pedido: "48207", cliente: "Gabriela Nunes", itens: 1, envio: "Retirada na loja", etapa: "Aguardando NF", nf: false },
  { pedido: "48203", cliente: "Eduardo F.", itens: 1, envio: "Sedex", etapa: "Aguardando NF", nf: false },
  { pedido: "48209", cliente: "Ana Clara Bez", itens: 1, envio: "PAC", etapa: "Etiqueta", nf: true },
  { pedido: "48201", cliente: "Vanessa K.", itens: 1, envio: "Jamef Econômico", etapa: "Etiqueta", nf: true },
  { pedido: "48199", cliente: "Pedal Sul Assessoria", itens: 4, envio: "Entrega ShopBike", etapa: "Pronto", nf: true },
  { pedido: "48208", cliente: "Marcos Vieira", itens: 2, envio: "Sedex", etapa: "Enviado", nf: true, rastreio: "QB120044871BR" },
  { pedido: "48196", cliente: "Camila Souza", itens: 1, envio: "PAC", etapa: "Enviado", nf: true, rastreio: "QB120041102BR" },
] as const;

// ---------- Notificações ----------
export const eventosNotificacao = [
  { evento: "Pedido recebido", whatsapp: "pedido_recebido_v2", email: true, ativo: true },
  { evento: "Pagamento aprovado", whatsapp: "pagamento_aprovado", email: true, ativo: true },
  { evento: "Pix gerado (lembrete em 15 min)", whatsapp: "pix_lembrete", email: false, ativo: true },
  { evento: "Nota fiscal emitida", whatsapp: "nf_emitida", email: true, ativo: true },
  { evento: "Enviado com rastreio", whatsapp: "pedido_enviado_rastreio", email: true, ativo: true },
  { evento: "Saiu para entrega", whatsapp: "saiu_entrega", email: false, ativo: true },
  { evento: "Pronto para retirada", whatsapp: "pronto_retirada", email: true, ativo: true },
  { evento: "Troca atualizada", whatsapp: "troca_status", email: true, ativo: true },
  { evento: "Confirmação do antifraude", whatsapp: "confirma_compra_seguranca", email: false, ativo: true },
  { evento: "Carrinho abandonado (30 min)", whatsapp: "carrinho_abandonado", email: true, ativo: true },
];

export const logEnvios = [
  { quando: "25/11, 13:34", evento: "Pagamento aprovado", canal: "WhatsApp", destino: "(48) 99812-••••", status: "Lida" },
  { quando: "25/11, 13:34", evento: "Pagamento aprovado", canal: "E-mail", destino: "rafa•••@gmail.com", status: "Entregue" },
  { quando: "25/11, 11:22", evento: "Confirmação do antifraude", canal: "WhatsApp", destino: "(11) 94410-••••", status: "Enviada" },
  { quando: "25/11, 10:40", evento: "Carrinho abandonado (30 min)", canal: "WhatsApp", destino: "(48) 99120-••••", status: "Respondeu" },
  { quando: "25/11, 10:02", evento: "Pix gerado (lembrete em 15 min)", canal: "WhatsApp", destino: "(48) 99134-••••", status: "Lida" },
  { quando: "24/11, 17:55", evento: "Enviado com rastreio", canal: "WhatsApp", destino: "(48) 99601-••••", status: "Lida" },
  { quando: "24/11, 17:55", evento: "Enviado com rastreio", canal: "E-mail", destino: "marcos•••@gmail.com", status: "Falhou" },
];

// ---------- Usuários, perfis e auditoria ----------
export const usuarios = [
  { nome: "Gerência", email: "gerencia@shopbike.com.br", perfil: "Administrador", doisFatores: true, ultimoAcesso: "agora", ativo: true },
  { nome: "Diego", email: "diego@shopbike.com.br", perfil: "Vendedor", doisFatores: true, ultimoAcesso: "há 12 min", ativo: true },
  { nome: "Carla", email: "carla@shopbike.com.br", perfil: "Vendedor", doisFatores: true, ultimoAcesso: "há 1 h", ativo: true },
  { nome: "Juliano", email: "expedicao@shopbike.com.br", perfil: "Operação/expedição", doisFatores: true, ultimoAcesso: "há 25 min", ativo: true },
  { nome: "Priscila", email: "cadastro@shopbike.com.br", perfil: "Cadastro/catálogo", doisFatores: false, ultimoAcesso: "ontem", ativo: true },
  { nome: "Mateus (NX)", email: "suporte@nxdigital.com.br", perfil: "Analista de risco", doisFatores: true, ultimoAcesso: "há 3 h", ativo: true },
  { nome: "Ex-funcionário", email: "antigo@shopbike.com.br", perfil: "Vendedor", doisFatores: false, ultimoAcesso: "02/09/2026", ativo: false },
];

export const permissoes = [
  "Ver pedidos",
  "Alterar e cancelar pedidos",
  "Estornar pagamentos",
  "Expedição e etiquetas",
  "Trocas e devoluções",
  "Editar produtos e fotos",
  "Promoções e cupons",
  "Gerar link de pagamento",
  "Ver só as próprias vendas",
  "Fila do antifraude",
  "Regras do antifraude",
  "Relatórios financeiros",
  "Usuários e configurações",
] as const;

export const perfis: { nome: string; usuarios: number; permite: (typeof permissoes)[number][]; descontoMax?: number }[] = [
  { nome: "Administrador", usuarios: 2, permite: [...permissoes].filter((p) => p !== "Ver só as próprias vendas") },
  {
    nome: "Operação/expedição",
    usuarios: 4,
    permite: ["Ver pedidos", "Alterar e cancelar pedidos", "Expedição e etiquetas", "Trocas e devoluções"],
  },
  { nome: "Cadastro/catálogo", usuarios: 3, permite: ["Editar produtos e fotos", "Promoções e cupons"] },
  { nome: "Vendedor", usuarios: 7, permite: ["Gerar link de pagamento", "Ver só as próprias vendas"], descontoMax: 5 },
  { nome: "Analista de risco", usuarios: 2, permite: ["Ver pedidos", "Fila do antifraude", "Regras do antifraude"] },
];

export const auditoria = [
  { quando: "25/11, 13:52", quem: "Gerência", acao: "Aprovou pedido no antifraude", alvo: "Pedido #48198", detalhe: "Nota 41 · motivo: cliente confirmou pelo WhatsApp", ip: "177.•••.12.40" },
  { quando: "25/11, 12:10", quem: "Priscila", acao: "Alterou preço promocional", alvo: "Oggi Big Wheel 7.0", detalhe: "R$ 4.699,00 → R$ 4.499,00 até 30/11", ip: "177.•••.12.41" },
  { quando: "25/11, 11:47", quem: "Mateus (NX)", acao: "Alterou peso de regra", alvo: "Regra: Pix pago por CPF diferente", detalhe: "+25 → +30", ip: "189.•••.80.2" },
  { quando: "25/11, 10:09", quem: "Diego", acao: "Gerou link de pagamento", alvo: "Link k7Qp2x", detalhe: "R$ 3.398,00 · até 21x · desconto 0%", ip: "177.•••.12.44" },
  { quando: "25/11, 09:30", quem: "Juliano", acao: "Imprimiu etiquetas", alvo: "3 pedidos", detalhe: "#48209, #48201, #48196", ip: "177.•••.12.42" },
  { quando: "24/11, 18:02", quem: "Gerência", acao: "Estornou pagamento", alvo: "Pedido #48166", detalhe: "Parcial · R$ 399,00 · troca T-0140", ip: "177.•••.12.40" },
  { quando: "24/11, 16:55", quem: "Gerência", acao: "Desativou usuário", alvo: "antigo@shopbike.com.br", detalhe: "Acesso revogado e sessões encerradas", ip: "177.•••.12.40" },
  { quando: "24/11, 15:20", quem: "Mateus (NX)", acao: "Incluiu na lista de bloqueio", alvo: "Telefone (21) 96611-••••", detalhe: "Golpe relatado pela loja", ip: "189.•••.80.2" },
];

export const acessos = [
  { quando: "25/11, 13:40", quem: "Gerência", evento: "Login com 2FA", ip: "177.•••.12.40", local: "Tubarão/SC", ok: true },
  { quando: "25/11, 11:02", quem: "Mateus (NX)", evento: "Login com 2FA", ip: "189.•••.80.2", local: "Tubarão/SC", ok: true },
  { quando: "25/11, 08:58", quem: "Diego", evento: "Login com 2FA", ip: "177.•••.12.44", local: "Tubarão/SC", ok: true },
  { quando: "25/11, 03:14", quem: "gerencia@shopbike.com.br", evento: "Senha incorreta (3x) · bloqueado 15 min", ip: "45.•••.210.9", local: "São Paulo/SP", ok: false },
  { quando: "24/11, 19:30", quem: "Priscila", evento: "Login sem 2FA", ip: "177.•••.12.41", local: "Tubarão/SC", ok: true },
];

// ---------- Configurações ----------
export const transportadoras = [
  { nome: "Correios · PAC", tipo: "Contrato", ativo: true, api: "API Correios" },
  { nome: "Correios · Sedex", tipo: "Contrato", ativo: true, api: "API Correios" },
  { nome: "Correios · PAC Mini", tipo: "Contrato", ativo: false, api: "API Correios" },
  { nome: "Expresso São Miguel", tipo: "Transportadora", ativo: true, api: "Tabela própria" },
  { nome: "Translovato", tipo: "Transportadora", ativo: true, api: "Tabela própria" },
  { nome: "Jamef Econômico", tipo: "Transportadora", ativo: true, api: "A confirmar" },
  { nome: "Rodonaves", tipo: "Transportadora", ativo: true, api: "A confirmar" },
  { nome: "Coopex", tipo: "Transportadora", ativo: true, api: "Tabela própria" },
  { nome: "Arlete com ADV", tipo: "Transportadora", ativo: true, api: "Tabela própria" },
  { nome: "A combinar", tipo: "Manual", ativo: true, api: "—" },
  { nome: "Entrega ShopBike", tipo: "Própria", ativo: true, api: "—" },
  { nome: "Retirada na loja", tipo: "Retirada", ativo: true, api: "—" },
  { nome: "Jadlog", tipo: "Transportadora", ativo: false, api: "—" },
  { nome: "Braspress", tipo: "Transportadora", ativo: false, api: "—" },
];

export const redirects = [
  { de: "/bicicleta-seminova-specialized-epic-comp-2023", para: "/p/seminova-specialized-epic-comp-2023", acessos30d: 214 },
  { de: "/procura?q=oggi", para: "/busca?q=oggi", acessos30d: 1_802 },
  { de: "/bicicletas/mtb-aro-29", para: "/c/mtb", acessos30d: 3_440 },
  { de: "/capacete-specialized-align-ii-mips", para: "/p/capacete-specialized-align-ii", acessos30d: 96 },
];

export const regrasParcelamento = [
  { alvo: "Geral da loja", tipo: "Loja", max: 21, minimo: 5_000 },
  { alvo: "Specialized", tipo: "Marca", max: 12, minimo: 10_000 },
  { alvo: "Peças", tipo: "Categoria", max: 10, minimo: 5_000 },
  { alvo: "Vestuário", tipo: "Categoria", max: 6, minimo: 5_000 },
  { alvo: "Specialized Turbo Vado SL 4.0", tipo: "Produto", max: 12, minimo: 10_000 },
];

export const importacoes = [
  { arquivo: "catalogo-climba-completo.xlsx", tipo: "Produtos (XLSX)", quando: "22/11, 15:02", linhas: 7_395, ok: 7_383, erros: 12, status: "Concluída" },
  { arquivo: "fotos-lote-04.zip", tipo: "Fotos (ZIP)", quando: "23/11, 10:40", linhas: 2_840, ok: 2_801, erros: 39, status: "Concluída" },
  { arquivo: "tags-black-friday.xlsx", tipo: "Tags (XLSX)", quando: "25/11, 08:10", linhas: 214, ok: 214, erros: 0, status: "Concluída" },
  { arquivo: "fotos-lote-05.zip", tipo: "Fotos (ZIP)", quando: "25/11, 13:55", linhas: 1_920, ok: 1_210, erros: 4, status: "Processando" },
];

export const arvoreCategorias = [
  { nome: "Bicicletas", produtos: 612, filhos: [
    { nome: "Mountain bike", produtos: 248, filhos: ["Aro 29", "Aro 27,5", "Full suspension"] },
    { nome: "Speed", produtos: 86, filhos: ["Alumínio", "Carbono"] },
    { nome: "Elétricas", produtos: 41, filhos: [] },
    { nome: "Urbanas", produtos: 64, filhos: [] },
    { nome: "Infantil", produtos: 92, filhos: ["Aro 12 a 16", "Aro 20 a 24"] },
    { nome: "Seminovas", produtos: 81, filhos: [] },
  ] },
  { nome: "Peças", produtos: 4_210, filhos: [
    { nome: "Transmissão", produtos: 1_380, filhos: ["Cassetes", "Correntes", "Câmbios", "Pedivelas"] },
    { nome: "Freios", produtos: 610, filhos: [] },
    { nome: "Pneus e câmaras", produtos: 702, filhos: [] },
    { nome: "Suspensão", produtos: 188, filhos: [] },
  ] },
  { nome: "Acessórios", produtos: 1_840, filhos: [
    { nome: "Capacetes", produtos: 210, filhos: [] },
    { nome: "Iluminação", produtos: 164, filhos: [] },
    { nome: "Hidratação", produtos: 120, filhos: [] },
  ] },
  { nome: "Vestuário", produtos: 733, filhos: [
    { nome: "Camisas", produtos: 301, filhos: [] },
    { nome: "Bermudas", produtos: 188, filhos: [] },
  ] },
];

export const marcasCatalogo = [
  { nome: "Shimano", produtos: 1_942 },
  { nome: "Sram", produtos: 604 },
  { nome: "Oggi", produtos: 318 },
  { nome: "Specialized", produtos: 512 },
  { nome: "Caloi", produtos: 266 },
  { nome: "Pirelli", produtos: 140 },
  { nome: "Absolute", produtos: 702 },
];

export const tokensApi = [
  { nome: "Bruning (ERP)", escopo: "produtos, estoque, preços, pedidos, NF", limite: "600/min", ultimoUso: "há 2 min", criado: "20/11/2026" },
  { nome: "Agente de IA (n8n)", escopo: "catálogo (leitura), status de pedido, criar link (com aprovação)", limite: "120/min", ultimoUso: "há 30 s", criado: "20/11/2026" },
  { nome: "CRM NX", escopo: "leads, vendas, clientes (leitura)", limite: "60/min", ultimoUso: "há 5 min", criado: "21/11/2026" },
];

export const notificacoesInternas = [
  { icone: "shield" as const, texto: "Pedido #48212 caiu em revisão no antifraude (nota 58)", quando: "há 3 h", nova: true },
  { icone: "alert" as const, texto: "Integração Bruning: SKU OGVL-58-PRE sem produto pai", quando: "há 45 min", nova: true },
  { icone: "box" as const, texto: "Estoque baixo: Big Wheel 7.0 · 17 · Vermelho (1 un.)", quando: "há 1 h", nova: true },
  { icone: "doc" as const, texto: "Novo pedido #48213 · R$ 4.499,00 · retirada", quando: "há 30 min", nova: false },
  { icone: "whatsapp" as const, texto: "Rodrigo Mendes respondeu a recuperação de carrinho", quando: "há 3 h", nova: false },
];
