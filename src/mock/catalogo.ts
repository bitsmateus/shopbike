/*
 * Dados fictícios do protótipo (Etapa 0). Nomes de marca reais, modelos e
 * preços ilustrativos. Não usar em produção.
 */
import type { ArtKind } from "@/ui/product-art";

export type Cor = { nome: string; hex: string };
export type Variacao = { sku: string; tamanho: string; cor: string; estoque: number };

export type Produto = {
  id: string;
  slug: string;
  nome: string;
  marca: string;
  categoria: CategoriaSlug;
  tipo: string;
  art: ArtKind;
  preco: number; // centavos
  precoDe?: number;
  selos: string[];
  aro?: string;
  cores: Cor[];
  tamanhos: string[];
  variacoes: Variacao[];
  caracteristicas: [string, string][];
  descricao: string;
  avaliacao: { nota: number; total: number };
  seminova?: { estado: string; laudo: string };
  garantia: string;
  limiteParcelas?: number;
  qualidade: { fotos: number; video: boolean; descricao: boolean; nota: number };
  vendidos30d: number;
};

export type CategoriaSlug = "mtb" | "speed" | "urbana" | "eletrica" | "infantil" | "seminovas" | "pecas" | "acessorios" | "vestuario";

export const categorias: { slug: CategoriaSlug; nome: string; art: ArtKind; cor: string; grupo: "Bicicletas" | "Peças e acessórios" }[] = [
  { slug: "mtb", nome: "Mountain bike", art: "mtb", cor: "#e30618", grupo: "Bicicletas" },
  { slug: "speed", nome: "Speed", art: "speed", cor: "#1a1917", grupo: "Bicicletas" },
  { slug: "eletrica", nome: "Elétricas", art: "eletrica", cor: "#5f5d58", grupo: "Bicicletas" },
  { slug: "urbana", nome: "Urbanas", art: "urbana", cor: "#2c6bc8", grupo: "Bicicletas" },
  { slug: "infantil", nome: "Infantil", art: "infantil", cor: "#e30618", grupo: "Bicicletas" },
  { slug: "seminovas", nome: "Seminovas", art: "mtb", cor: "#8b8983", grupo: "Bicicletas" },
  { slug: "pecas", nome: "Peças", art: "pecas", cor: "#1a1917", grupo: "Peças e acessórios" },
  { slug: "acessorios", nome: "Acessórios", art: "capacete", cor: "#e30618", grupo: "Peças e acessórios" },
  { slug: "vestuario", nome: "Vestuário", art: "vestuario", cor: "#1a1917", grupo: "Peças e acessórios" },
];

export const marcas = ["Specialized", "Oggi", "Caloi", "Shimano", "Sram", "Pirelli", "Absolute"];

const VERMELHO = { nome: "Vermelho", hex: "#e30618" };
const PRETO = { nome: "Preto", hex: "#1a1917" };
const GRAFITE = { nome: "Grafite", hex: "#5f5d58" };
const BRANCO = { nome: "Branco", hex: "#e9e7e3" };
const AZUL = { nome: "Azul", hex: "#2c6bc8" };
const VERDE = { nome: "Verde", hex: "#3d7a4a" };

function grade(prefixo: string, tamanhos: string[], cores: Cor[], base = 3): Variacao[] {
  const out: Variacao[] = [];
  tamanhos.forEach((t, i) =>
    cores.forEach((c, j) => out.push({ sku: `${prefixo}-${t}-${c.nome.slice(0, 3).toUpperCase()}`, tamanho: t, cor: c.nome, estoque: (base + i * 2 + j * 3) % 7 })),
  );
  return out;
}

const fichaMtb = (quadro: string, cambio: string, freio: string, suspensao: string, peso: string): [string, string][] => [
  ["Quadro", quadro],
  ["Aro", "29"],
  ["Câmbio", cambio],
  ["Freio", freio],
  ["Suspensão", suspensao],
  ["Peso aproximado", peso],
];

export const produtos: Produto[] = [
  {
    id: "p1",
    slug: "oggi-big-wheel-7-0-2027",
    nome: "Oggi Big Wheel 7.0",
    marca: "Oggi",
    categoria: "mtb",
    tipo: "MTB",
    art: "mtb",
    preco: 449_900,
    precoDe: 499_900,
    selos: ["Promoção"],
    aro: "29",
    cores: [PRETO, VERMELHO],
    tamanhos: ["15", "17", "19"],
    variacoes: grade("OGBW7", ["15", "17", "19"], [PRETO, VERMELHO]),
    caracteristicas: fichaMtb("Alumínio 6061", "Shimano Deore 1x12", "Hidráulico Shimano MT200", "Garfo a ar 100 mm com trava", "13,4 kg"),
    descricao:
      "A Big Wheel 7.0 é a porta de entrada certa para quem quer pedalar trilha de verdade: grupo Shimano Deore 12 velocidades, freio hidráulico e suspensão a ar com trava no guidão.",
    avaliacao: { nota: 4.8, total: 64 },
    garantia: "Quadro vitalício, componentes 1 ano",
    qualidade: { fotos: 8, video: true, descricao: true, nota: 96 },
    vendidos30d: 14,
  },
  {
    id: "p2",
    slug: "specialized-rockhopper-sport-29",
    nome: "Specialized Rockhopper Sport 29",
    marca: "Specialized",
    categoria: "mtb",
    tipo: "MTB",
    art: "mtb",
    preco: 649_900,
    selos: ["Lançamento"],
    aro: "29",
    cores: [VERDE, PRETO],
    tamanhos: ["S", "M", "L", "XL"],
    variacoes: grade("SPRH", ["S", "M", "L", "XL"], [VERDE, PRETO], 2),
    caracteristicas: fichaMtb("Alumínio Premium A1", "Shimano Cues 1x10", "Hidráulico Shimano", "SR Suntour XCM 100 mm", "14,1 kg"),
    descricao: "Geometria moderna e trilha sem drama. A Rockhopper Sport é a MTB de entrada da Specialized com grupo Cues e freio hidráulico.",
    avaliacao: { nota: 4.9, total: 31 },
    garantia: "Quadro vitalício, componentes 1 ano",
    qualidade: { fotos: 6, video: false, descricao: true, nota: 82 },
    vendidos30d: 9,
  },
  {
    id: "p3",
    slug: "caloi-explorer-comp-29",
    nome: "Caloi Explorer Comp 29",
    marca: "Caloi",
    categoria: "mtb",
    tipo: "MTB",
    art: "mtb",
    preco: 299_900,
    precoDe: 339_900,
    selos: ["Promoção"],
    aro: "29",
    cores: [GRAFITE, AZUL],
    tamanhos: ["15", "17", "19"],
    variacoes: grade("CLEX", ["15", "17", "19"], [GRAFITE, AZUL], 4),
    caracteristicas: fichaMtb("Alumínio", "Shimano Altus 2x9", "Hidráulico", "Garfo com trava 100 mm", "14,8 kg"),
    descricao: "Versátil para estrada de chão e trilha leve, com 18 marchas e freio hidráulico.",
    avaliacao: { nota: 4.6, total: 112 },
    garantia: "Quadro 5 anos, componentes 1 ano",
    qualidade: { fotos: 3, video: false, descricao: true, nota: 61 },
    vendidos30d: 21,
  },
  {
    id: "p4",
    slug: "oggi-hacker-sport-29",
    nome: "Oggi Hacker Sport 29",
    marca: "Oggi",
    categoria: "mtb",
    tipo: "MTB",
    art: "mtb",
    preco: 219_900,
    selos: [],
    aro: "29",
    cores: [PRETO, VERMELHO, BRANCO],
    tamanhos: ["15", "17", "19", "21"],
    variacoes: grade("OGHS", ["15", "17", "19", "21"], [PRETO, VERMELHO, BRANCO], 1),
    caracteristicas: fichaMtb("Alumínio", "Shimano 2x8", "Mecânico a disco", "Garfo com trava", "15,2 kg"),
    descricao: "A primeira MTB de muita gente em Tubarão. Robusta e fácil de manter.",
    avaliacao: { nota: 4.7, total: 203 },
    garantia: "Quadro 5 anos, componentes 1 ano",
    qualidade: { fotos: 5, video: true, descricao: true, nota: 90 },
    vendidos30d: 26,
  },
  {
    id: "p5",
    slug: "specialized-allez-e5",
    nome: "Specialized Allez E5",
    marca: "Specialized",
    categoria: "speed",
    tipo: "Speed",
    art: "speed",
    preco: 689_900,
    selos: ["Lançamento"],
    aro: "700",
    cores: [VERMELHO, PRETO],
    tamanhos: ["52", "54", "56", "58"],
    variacoes: grade("SPAL", ["52", "54", "56", "58"], [VERMELHO, PRETO], 2),
    caracteristicas: [
      ["Quadro", "Alumínio E5 Premium"],
      ["Aro", "700c"],
      ["Câmbio", "Shimano Claris 2x8"],
      ["Freio", "Disco mecânico"],
      ["Garfo", "Carbono"],
      ["Peso aproximado", "9,9 kg"],
    ],
    descricao: "A speed de alumínio mais famosa do mundo, agora com freio a disco.",
    avaliacao: { nota: 4.9, total: 18 },
    garantia: "Quadro vitalício, componentes 1 ano",
    qualidade: { fotos: 6, video: true, descricao: true, nota: 94 },
    vendidos30d: 5,
  },
  {
    id: "p6",
    slug: "oggi-velloce-disc",
    nome: "Oggi Velloce Disc",
    marca: "Oggi",
    categoria: "speed",
    tipo: "Speed",
    art: "speed",
    preco: 549_900,
    selos: [],
    aro: "700",
    cores: [BRANCO, PRETO],
    tamanhos: ["50", "53", "56"],
    variacoes: grade("OGVL", ["50", "53", "56"], [BRANCO, PRETO], 3),
    caracteristicas: [
      ["Quadro", "Alumínio"],
      ["Aro", "700c"],
      ["Câmbio", "Shimano Sora 2x9"],
      ["Freio", "Disco hidráulico"],
      ["Peso aproximado", "10,2 kg"],
    ],
    descricao: "Speed confortável para os primeiros 100 km.",
    avaliacao: { nota: 4.7, total: 22 },
    garantia: "Quadro 5 anos, componentes 1 ano",
    qualidade: { fotos: 2, video: false, descricao: false, nota: 38 },
    vendidos30d: 3,
  },
  {
    id: "p7",
    slug: "caloi-e-vibe-easy-rider",
    nome: "Caloi E-Vibe Easy Rider",
    marca: "Caloi",
    categoria: "eletrica",
    tipo: "Elétrica",
    art: "eletrica",
    preco: 699_900,
    precoDe: 799_900,
    selos: ["Promoção"],
    aro: "26",
    cores: [GRAFITE, BRANCO],
    tamanhos: ["Único"],
    variacoes: grade("CLEV", ["Único"], [GRAFITE, BRANCO], 2),
    caracteristicas: [
      ["Motor", "350 W no cubo traseiro"],
      ["Bateria", "36 V 10,4 Ah"],
      ["Autonomia", "até 50 km"],
      ["Aro", "26"],
      ["Freio", "Disco mecânico"],
    ],
    descricao: "Para ir e voltar do trabalho sem chegar suado. Bateria removível com carregador.",
    avaliacao: { nota: 4.5, total: 40 },
    garantia: "Bateria e motor 1 ano",
    qualidade: { fotos: 5, video: false, descricao: true, nota: 78 },
    vendidos30d: 4,
  },
  {
    id: "p8",
    slug: "specialized-turbo-vado-sl",
    nome: "Specialized Turbo Vado SL 4.0",
    marca: "Specialized",
    categoria: "eletrica",
    tipo: "Elétrica",
    art: "eletrica",
    preco: 2_499_900,
    selos: ["Sob encomenda"],
    aro: "700",
    cores: [PRETO],
    tamanhos: ["M", "L"],
    variacoes: grade("SPTV", ["M", "L"], [PRETO], 1),
    caracteristicas: [
      ["Motor", "Specialized SL 1.1, 240 W"],
      ["Bateria", "320 Wh integrada"],
      ["Autonomia", "até 130 km"],
      ["Câmbio", "Shimano Deore 1x10"],
    ],
    descricao: "A elétrica que parece bike normal: 15 kg e autonomia de sobra.",
    avaliacao: { nota: 5, total: 6 },
    garantia: "Quadro vitalício, motor 2 anos",
    limiteParcelas: 12,
    qualidade: { fotos: 7, video: true, descricao: true, nota: 92 },
    vendidos30d: 1,
  },
  {
    id: "p9",
    slug: "caloi-cecci-aro-16",
    nome: "Caloi Cecci Aro 16",
    marca: "Caloi",
    categoria: "infantil",
    tipo: "Infantil",
    art: "infantil",
    preco: 89_900,
    selos: [],
    aro: "16",
    cores: [VERMELHO, AZUL],
    tamanhos: ["Único"],
    variacoes: grade("CLCC", ["Único"], [VERMELHO, AZUL], 5),
    caracteristicas: [
      ["Aro", "16"],
      ["Idade", "4 a 6 anos"],
      ["Rodinhas", "Inclusas"],
    ],
    descricao: "Primeira bike com rodinhas, freio fácil e cesta.",
    avaliacao: { nota: 4.8, total: 77 },
    garantia: "1 ano",
    qualidade: { fotos: 4, video: false, descricao: true, nota: 72 },
    vendidos30d: 11,
  },
  {
    id: "p10",
    slug: "oggi-cityfun-urbana",
    nome: "Oggi Cityfun Urbana",
    marca: "Oggi",
    categoria: "urbana",
    tipo: "Urbana",
    art: "urbana",
    preco: 159_900,
    selos: [],
    aro: "700",
    cores: [AZUL, BRANCO],
    tamanhos: ["M", "L"],
    variacoes: grade("OGCF", ["M", "L"], [AZUL, BRANCO], 2),
    caracteristicas: [
      ["Aro", "700c"],
      ["Câmbio", "Shimano 7v"],
      ["Freio", "V-brake"],
    ],
    descricao: "Postura ereta e quadro baixo para o dia a dia.",
    avaliacao: { nota: 4.4, total: 15 },
    garantia: "Quadro 5 anos",
    qualidade: { fotos: 1, video: false, descricao: false, nota: 24 },
    vendidos30d: 2,
  },
  {
    id: "p11",
    slug: "seminova-specialized-epic-comp-2023",
    nome: "Specialized Epic Comp 2023 (Seminova)",
    marca: "Specialized",
    categoria: "seminovas",
    tipo: "MTB",
    art: "mtb",
    preco: 1_890_000,
    selos: ["Seminova"],
    aro: "29",
    cores: [VERMELHO],
    tamanhos: ["M"],
    variacoes: [{ sku: "SN-EPIC-M", tamanho: "M", cor: "Vermelho", estoque: 1 }],
    caracteristicas: fichaMtb("Carbono FACT 11m", "Sram GX Eagle 1x12", "Sram Level TL", "Full suspension 100/100 mm", "11,2 kg"),
    descricao: "Revisada na oficina da ShopBike, com laudo e garantia de 90 dias.",
    avaliacao: { nota: 5, total: 2 },
    seminova: { estado: "Muito bom", laudo: "Quadro sem trincas; suspensões revisadas; transmissão com 20% de desgaste." },
    garantia: "90 dias (oficina ShopBike)",
    qualidade: { fotos: 9, video: true, descricao: true, nota: 98 },
    vendidos30d: 0,
  },
  {
    id: "p12",
    slug: "seminova-oggi-7-2-2022",
    nome: "Oggi 7.2 2022 (Seminova)",
    marca: "Oggi",
    categoria: "seminovas",
    tipo: "MTB",
    art: "mtb",
    preco: 389_000,
    selos: ["Seminova"],
    aro: "29",
    cores: [PRETO],
    tamanhos: ["17"],
    variacoes: [{ sku: "SN-OG72-17", tamanho: "17", cor: "Preto", estoque: 1 }],
    caracteristicas: fichaMtb("Alumínio", "Shimano Deore 1x11", "Hidráulico", "Garfo a ar", "13,6 kg"),
    descricao: "Uma dona, pouco uso, revisada.",
    avaliacao: { nota: 4.7, total: 3 },
    seminova: { estado: "Bom", laudo: "Pequenos riscos no quadro; pneus novos." },
    garantia: "90 dias (oficina ShopBike)",
    qualidade: { fotos: 6, video: false, descricao: true, nota: 80 },
    vendidos30d: 1,
  },
  {
    id: "p13",
    slug: "capacete-specialized-align-ii",
    nome: "Capacete Specialized Align II",
    marca: "Specialized",
    categoria: "acessorios",
    tipo: "Capacete",
    art: "capacete",
    preco: 39_900,
    selos: [],
    cores: [PRETO, VERMELHO, BRANCO],
    tamanhos: ["P", "M", "G"],
    variacoes: grade("SPAG", ["P", "M", "G"], [PRETO, VERMELHO, BRANCO], 4),
    caracteristicas: [
      ["Sistema", "MIPS"],
      ["Ajuste", "Headset SX"],
      ["Peso", "330 g"],
    ],
    descricao: "Proteção MIPS com ótimo custo-benefício.",
    avaliacao: { nota: 4.9, total: 88 },
    garantia: "1 ano",
    qualidade: { fotos: 5, video: false, descricao: true, nota: 84 },
    vendidos30d: 19,
  },
  {
    id: "p14",
    slug: "cassete-shimano-deore-m6100-12v",
    nome: "Cassete Shimano Deore M6100 12v 10-51",
    marca: "Shimano",
    categoria: "pecas",
    tipo: "Transmissão",
    art: "pecas",
    preco: 64_900,
    selos: [],
    cores: [GRAFITE],
    tamanhos: ["10-51"],
    variacoes: grade("SHM6100", ["10-51"], [GRAFITE], 5),
    caracteristicas: [
      ["Velocidades", "12"],
      ["Relação", "10-51T"],
      ["Compatível", "Micro Spline"],
    ],
    descricao: "Cassete 12 velocidades para upgrade de transmissão.",
    avaliacao: { nota: 4.9, total: 41 },
    garantia: "1 ano",
    qualidade: { fotos: 2, video: false, descricao: true, nota: 55 },
    vendidos30d: 12,
  },
  {
    id: "p15",
    slug: "corrente-sram-gx-eagle",
    nome: "Corrente Sram GX Eagle 12v",
    marca: "Sram",
    categoria: "pecas",
    tipo: "Transmissão",
    art: "pecas",
    preco: 32_900,
    selos: [],
    cores: [PRETO],
    tamanhos: ["126 elos"],
    variacoes: grade("SRGX", ["126 elos"], [PRETO], 6),
    caracteristicas: [
      ["Velocidades", "12"],
      ["Elos", "126"],
    ],
    descricao: "Corrente com PowerLock para transmissões Eagle.",
    avaliacao: { nota: 4.8, total: 27 },
    garantia: "1 ano",
    qualidade: { fotos: 1, video: false, descricao: false, nota: 20 },
    vendidos30d: 8,
  },
  {
    id: "p16",
    slug: "pneu-pirelli-scorpion-xc-29",
    nome: "Pneu Pirelli Scorpion XC RC 29x2.2",
    marca: "Pirelli",
    categoria: "pecas",
    tipo: "Pneu",
    art: "pneu",
    preco: 39_900,
    selos: [],
    aro: "29",
    cores: [PRETO],
    tamanhos: ["29x2.2"],
    variacoes: grade("PRXC", ["29x2.2"], [PRETO], 4),
    caracteristicas: [
      ["Medida", "29 x 2.2"],
      ["Tubeless", "Sim"],
    ],
    descricao: "Pneu rápido para XC, tubeless ready.",
    avaliacao: { nota: 4.7, total: 34 },
    garantia: "Contra defeito de fabricação",
    qualidade: { fotos: 4, video: false, descricao: true, nota: 70 },
    vendidos30d: 15,
  },
  {
    id: "p17",
    slug: "camisa-shopbike-team",
    nome: "Camisa ShopBike Team",
    marca: "Absolute",
    categoria: "vestuario",
    tipo: "Camisa",
    art: "vestuario",
    preco: 17_990,
    selos: ["Exclusivo"],
    cores: [PRETO, BRANCO],
    tamanhos: ["P", "M", "G", "GG"],
    variacoes: grade("SBTEAM", ["P", "M", "G", "GG"], [PRETO, BRANCO], 3),
    caracteristicas: [
      ["Tecido", "Dry-fit"],
      ["Bolsos", "3 traseiros"],
    ],
    descricao: "A camisa oficial do pedal da ShopBike.",
    avaliacao: { nota: 4.9, total: 52 },
    garantia: "Contra defeito de fabricação",
    qualidade: { fotos: 4, video: false, descricao: true, nota: 74 },
    vendidos30d: 23,
  },
  {
    id: "p18",
    slug: "garrafa-shopbike-750ml",
    nome: "Garrafa ShopBike 750 ml",
    marca: "Absolute",
    categoria: "acessorios",
    tipo: "Hidratação",
    art: "acessorio",
    preco: 4_990,
    selos: [],
    cores: [PRETO, VERMELHO],
    tamanhos: ["750 ml"],
    variacoes: grade("SBGAR", ["750 ml"], [PRETO, VERMELHO], 5),
    caracteristicas: [["Capacidade", "750 ml"]],
    descricao: "Garrafa sem BPA com bico de fluxo rápido.",
    avaliacao: { nota: 4.6, total: 19 },
    garantia: "—",
    qualidade: { fotos: 2, video: false, descricao: true, nota: 58 },
    vendidos30d: 31,
  },
];

export function produtoPorSlug(slug: string) {
  return produtos.find((p) => p.slug === slug);
}

export function categoriaPorSlug(slug: string) {
  return categorias.find((c) => c.slug === slug);
}

export function corHex(p: Produto, nome?: string) {
  return (p.cores.find((c) => c.nome === nome) ?? p.cores[0]).hex;
}

export function estoqueTotal(p: Produto) {
  return p.variacoes.reduce((s, v) => s + v.estoque, 0);
}

export const sinonimos: Record<string, string[]> = {
  bike: ["bicicleta"],
  bicicleta: ["bike"],
  mtb: ["mountain bike", "trilha"],
  "mountain bike": ["mtb"],
  speed: ["road", "estrada"],
  eletrica: ["e-bike", "elétrica"],
};

/** Busca do protótipo: normaliza acento, aplica sinônimos e tolera 1 erro por palavra. */
export function buscar(termo: string): Produto[] {
  const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const t = norm(termo).trim();
  if (!t) return [];
  const palavras = t.split(/\s+/).flatMap((w) => [w, ...(sinonimos[w] ?? []).map(norm)]);
  const perto = (a: string, b: string) => {
    if (Math.abs(a.length - b.length) > 1) return false;
    let erros = 0;
    for (let i = 0, j = 0; i < a.length || j < b.length; i++, j++) {
      if (a[i] !== b[j]) {
        erros++;
        if (a.length > b.length) j--;
        else if (b.length > a.length) i--;
      }
      if (erros > 1) return false;
    }
    return true;
  };
  return produtos
    .map((p) => {
      const alvo = norm(`${p.nome} ${p.marca} ${p.tipo} ${p.categoria} aro ${p.aro ?? ""}`);
      const tokens = alvo.split(/\s+/);
      const score = palavras.reduce((s, w) => s + (alvo.includes(w) ? 2 : tokens.some((tk) => w.length > 3 && perto(tk, w)) ? 1 : 0), 0);
      return { p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.p);
}
