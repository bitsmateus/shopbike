"use client";

import { useMemo, useState } from "react";
import type { Produto } from "@/mock/catalogo";
import { cn } from "@/lib/format";
import { Icon } from "@/ui/icons";
import { ProductCard } from "./product-card";

const faixasPreco = [
  { rotulo: "Até R$ 1.000", min: 0, max: 100_000 },
  { rotulo: "R$ 1.000 a R$ 3.000", min: 100_000, max: 300_000 },
  { rotulo: "R$ 3.000 a R$ 7.000", min: 300_000, max: 700_000 },
  { rotulo: "Acima de R$ 7.000", min: 700_000, max: Infinity },
];

const ordens = {
  relevancia: "Mais relevantes",
  vendidos: "Mais vendidos",
  menor: "Menor preço",
  maior: "Maior preço",
  avaliacao: "Melhor avaliados",
} as const;

type Filtros = { marca: string[]; aro: string[]; tamanho: string[]; cor: string[]; tipo: string[]; preco: string[] };
const vazio: Filtros = { marca: [], aro: [], tamanho: [], cor: [], tipo: [], preco: [] };

export function Listagem({ produtos, promoInicial = false }: { produtos: Produto[]; promoInicial?: boolean }) {
  const [f, setF] = useState<Filtros>(vazio);
  const [ordem, setOrdem] = useState<keyof typeof ordens>("relevancia");
  const [soPromo, setSoPromo] = useState(promoInicial);
  const [painel, setPainel] = useState(false);

  const opcoes = useMemo(() => {
    const uniq = (xs: string[]) => [...new Set(xs)].sort((a, b) => a.localeCompare(b, "pt-BR", { numeric: true }));
    return {
      tipo: uniq(produtos.map((p) => p.tipo)),
      marca: uniq(produtos.map((p) => p.marca)),
      aro: uniq(produtos.flatMap((p) => (p.aro ? [p.aro] : []))),
      tamanho: uniq(produtos.flatMap((p) => p.tamanhos)),
      cor: uniq(produtos.flatMap((p) => p.cores.map((c) => c.nome))),
      preco: faixasPreco.map((x) => x.rotulo),
    };
  }, [produtos]);

  const filtrados = useMemo(() => {
    const r = produtos.filter(
      (p) =>
        (!soPromo || p.precoDe) &&
        (!f.marca.length || f.marca.includes(p.marca)) &&
        (!f.tipo.length || f.tipo.includes(p.tipo)) &&
        (!f.aro.length || (p.aro && f.aro.includes(p.aro))) &&
        (!f.tamanho.length || p.tamanhos.some((t) => f.tamanho.includes(t))) &&
        (!f.cor.length || p.cores.some((c) => f.cor.includes(c.nome))) &&
        (!f.preco.length || faixasPreco.some((x) => f.preco.includes(x.rotulo) && p.preco >= x.min && p.preco < x.max)),
    );
    const s = [...r];
    if (ordem === "menor") s.sort((a, b) => a.preco - b.preco);
    if (ordem === "maior") s.sort((a, b) => b.preco - a.preco);
    if (ordem === "vendidos") s.sort((a, b) => b.vendidos30d - a.vendidos30d);
    if (ordem === "avaliacao") s.sort((a, b) => b.avaliacao.nota - a.avaliacao.nota);
    return s;
  }, [produtos, f, ordem, soPromo]);

  const alternar = (k: keyof Filtros, v: string) => setF((x) => ({ ...x, [k]: x[k].includes(v) ? x[k].filter((y) => y !== v) : [...x[k], v] }));
  const ativos = Object.entries(f).flatMap(([k, vs]) => vs.map((v: string) => [k as keyof Filtros, v] as const));

  const grupos: [keyof Filtros, string][] = [
    ["tipo", "Tipo"],
    ["marca", "Marca"],
    ["aro", "Aro"],
    ["tamanho", "Tamanho"],
    ["preco", "Preço"],
    ["cor", "Cor"],
  ];

  const blocoFiltros = (
    <div className="space-y-6">
      <label className="flex cursor-pointer items-center justify-between rounded-2xl bg-snow p-3 text-sm font-semibold">
        Só promoções
        <input type="checkbox" checked={soPromo} onChange={(e) => setSoPromo(e.target.checked)} className="size-4 accent-[var(--color-red)]" />
      </label>
      {grupos
        .filter(([k]) => opcoes[k].length > 1)
        .map(([k, rotulo]) => (
          <fieldset key={k}>
            <legend className="mb-2.5 text-sm font-bold">{rotulo}</legend>
            <div className={k === "aro" || k === "tamanho" ? "flex flex-wrap gap-2" : "space-y-1"}>
              {opcoes[k].map((v) =>
                k === "aro" || k === "tamanho" ? (
                  <button
                    key={v}
                    onClick={() => alternar(k, v)}
                    aria-pressed={f[k].includes(v)}
                    className={cn("min-w-11 rounded-full px-3 py-1.5 text-sm ring-1", f[k].includes(v) ? "bg-ink text-white ring-ink" : "ring-line-2 hover:ring-ink")}
                  >
                    {v}
                  </button>
                ) : (
                  <label key={v} className="flex cursor-pointer items-center gap-2.5 rounded-lg py-1 text-sm text-ink-2">
                    <input type="checkbox" checked={f[k].includes(v)} onChange={() => alternar(k, v)} className="size-4 accent-[var(--color-red)]" />
                    {v}
                    <span className="ml-auto text-xs text-faint">
                      {k === "marca" ? produtos.filter((p) => p.marca === v).length : k === "tipo" ? produtos.filter((p) => p.tipo === v).length : ""}
                    </span>
                  </label>
                ),
              )}
            </div>
          </fieldset>
        ))}
    </div>
  );

  return (
    <div className="mt-6 grid gap-8 lg:grid-cols-[260px_1fr]">
      <aside className="hidden lg:block">{blocoFiltros}</aside>
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => setPainel(true)} className="inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold ring-1 ring-line-2 lg:hidden">
            <Icon name="filter" className="size-4" /> Filtros {ativos.length > 0 && `(${ativos.length})`}
          </button>
          <span className="text-sm text-muted">
            {filtrados.length} {filtrados.length === 1 ? "produto" : "produtos"}
          </span>
          <label className="ml-auto inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm ring-1 ring-line-2">
            <span className="text-muted">Ordenar:</span>
            <select value={ordem} onChange={(e) => setOrdem(e.target.value as keyof typeof ordens)} className="bg-transparent font-semibold outline-none">
              {Object.entries(ordens).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </label>
        </div>
        {ativos.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {ativos.map(([k, v]) => (
              <button key={k + v} onClick={() => alternar(k, v)} className="inline-flex items-center gap-1.5 rounded-full bg-snow py-1.5 pr-2.5 pl-3 text-sm">
                {v} <Icon name="close" className="size-3.5" />
              </button>
            ))}
            <button onClick={() => setF(vazio)} className="text-sm font-semibold text-red">
              Limpar tudo
            </button>
          </div>
        )}
        {filtrados.length === 0 ? (
          <div className="mt-10 rounded-3xl bg-snow p-10 text-center">
            <p className="font-semibold">Nenhum produto com esses filtros.</p>
            <p className="mt-1 text-sm text-muted">Tire algum filtro ou peça ajuda a um vendedor no WhatsApp.</p>
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-3">
            {filtrados.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </div>

      {painel && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal aria-label="Filtros">
          <button className="absolute inset-0 bg-ink/30" aria-label="Fechar" onClick={() => setPainel(false)} />
          <div className="rise absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-[28px] bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Filtros</h2>
              <button onClick={() => setPainel(false)} className="grid size-10 place-items-center rounded-full hover:bg-snow" aria-label="Fechar">
                <Icon name="close" />
              </button>
            </div>
            {blocoFiltros}
            <button onClick={() => setPainel(false)} className="sticky bottom-0 mt-6 h-12 w-full rounded-full bg-ink font-semibold text-white">
              Ver {filtrados.length} produtos
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
