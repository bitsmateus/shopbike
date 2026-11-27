/* Dados de exemplo da oficina (prévia). Fora do componente client para a página do servidor também ler. */
/* Serviços: duração em minutos e preço em centavos (0 = cortesia). */
export const servicos = [
  { nome: "Revisão completa", min: 90, preco: 18_900 },
  { nome: "Revisão de suspensão", min: 120, preco: 24_900 },
  { nome: "Sangria de freio", min: 40, preco: 7_900 },
  { nome: "Montagem", min: 90, preco: 14_900 },
  { nome: "Bike fit", min: 90, preco: 29_000 },
  { nome: "Revisão de 30 dias", min: 60, preco: 0 },
  { nome: "Vistoria de bike usada", min: 45, preco: 0 },
] as const;
export type Servico = (typeof servicos)[number]["nome"];

export type Origem = "Site" | "WhatsApp" | "Loja";
export type Agendamento = { dia: string; inicio: string; servico: Servico; qtd?: number; cliente: string; clienteId?: string; bike: string; origem: Origem; confirmado: boolean };

export const dias = ["Seg 23", "Ter 24", "Qua 25", "Qui 26", "Sex 27", "Sáb 28"];
export const HOJE = "Qua 25";
export const AGORA = "14:00"; // hora "atual" do protótipo
export const ABRE = 8 * 60;
export const FECHA = 18 * 60;
export const PX_MIN = 0.9; // altura por minuto

export const agenda: Agendamento[] = [
  { dia: "Seg 23", inicio: "08:00", servico: "Revisão completa", cliente: "Marcos Vieira", clienteId: "c3", bike: "Specialized Epic 2023", origem: "Site", confirmado: true },
  { dia: "Seg 23", inicio: "13:30", servico: "Sangria de freio", cliente: "Tiago Rocha", clienteId: "c5", bike: "Oggi Big Wheel 7.0", origem: "WhatsApp", confirmado: true },
  { dia: "Ter 24", inicio: "09:30", servico: "Revisão completa", qtd: 2, cliente: "Pedal Sul Assessoria Esportiva", clienteId: "c9", bike: "2 bikes da equipe", origem: "Loja", confirmado: true },
  { dia: "Qua 25", inicio: "08:00", servico: "Montagem", cliente: "Rafael Medeiros", clienteId: "c1", bike: "Oggi Big Wheel 7.0 (nova)", origem: "Loja", confirmado: true },
  { dia: "Qua 25", inicio: "11:00", servico: "Revisão de 30 dias", cliente: "Camila Souza", clienteId: "c10", bike: "Oggi Big Wheel 7.0", origem: "WhatsApp", confirmado: true },
  { dia: "Qua 25", inicio: "15:00", servico: "Bike fit", cliente: "Paula Ramos", bike: "Specialized Allez E5", origem: "Site", confirmado: true },
  { dia: "Qui 26", inicio: "09:30", servico: "Revisão de suspensão", cliente: "Henrique Lopes", clienteId: "c8", bike: "Caloi Elite Carbon", origem: "WhatsApp", confirmado: true },
  { dia: "Qui 26", inicio: "13:30", servico: "Revisão de 30 dias", cliente: "Vanessa Kremer", bike: "Caloi Cecci", origem: "WhatsApp", confirmado: true },
  { dia: "Sex 27", inicio: "08:00", servico: "Vistoria de bike usada", cliente: "Carlos Eduardo Lima", bike: "Trek Marlin 7 (usada)", origem: "Site", confirmado: false },
  { dia: "Sáb 28", inicio: "09:30", servico: "Revisão de 30 dias", cliente: "Gabriela Nunes", clienteId: "c7", bike: "Oggi Hacker Sport 29", origem: "WhatsApp", confirmado: true },
];

export const lembretes = [
  { cliente: "Camila Souza", clienteId: "c10", bike: "Big Wheel 7.0", prazo: "30 dias", status: "Agendou" },
  { cliente: "Vanessa Kremer", bike: "Caloi Cecci", prazo: "30 dias", status: "Agendou" },
  { cliente: "Rafael Medeiros", clienteId: "c1", bike: "Hacker Sport", prazo: "180 dias", status: "Enviado" },
  { cliente: "Bruna Silveira", bike: "E-Vibe", prazo: "30 dias", status: "Sem resposta" },
  { cliente: "Lívia Rocha", bike: "Allez E5", prazo: "180 dias", status: "Enviado" },
] as const;

