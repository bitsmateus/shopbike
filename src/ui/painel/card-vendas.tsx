"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/format";
import { Icon } from "@/ui/icons";
import { useAviso } from "./controles";
import { GraficoVendas } from "./graficos";
import { Card, Kpi } from "./ui";

type Dia = { dia: number; site: number; link: number; ia: number };
type KpiDado = { rotulo: string; valor: number; tipo: "dinheiro" | "numero" | "pct"; variacao: number; meta?: number; href?: string };

const periodos = [
  { id: "7", rotulo: "Últimos 7 dias", dias: 7 },
  { id: "15", rotulo: "Últimos 15 dias", dias: 15 },
  { id: "mes", rotulo: "Este mês", dias: 0 },
] as const;

/** Card principal da visão geral: indicadores clicáveis, gráfico, filtro de período e exportação. */
export function CardVendas({ kpis, serie }: { kpis: KpiDado[]; serie: Dia[] }) {
  const [periodo, setPeriodo] = useState<(typeof periodos)[number]["id"]>("mes");
  const [menu, setMenu] = useState(false);
  const caixa = useRef<HTMLDivElement>(null);
  const { avisar, aviso } = useAviso();

  const [destaque, ...outros] = kpis;
  const p = periodos.find((x) => x.id === periodo)!;
  const dados = p.dias ? serie.slice(-p.dias) : serie;
  const titulo = p.dias ? `${dados[0].dia} a ${dados[dados.length - 1].dia} de novembro` : `1 a ${serie[serie.length - 1].dia} de novembro`;

  useEffect(() => {
    if (!menu) return;
    const fechar = (e: MouseEvent) => {
      if (!caixa.current?.contains(e.target as Node)) setMenu(false);
    };
    document.addEventListener("mousedown", fechar);
    return () => document.removeEventListener("mousedown", fechar);
  }, [menu]);

  const exportar = () => {
    const linhas = [
      ["Dia", "Site (R$)", "Link do vendedor (R$)", "IA no WhatsApp (R$)", "Total (R$)"],
      ...dados.map((d) => [`${String(d.dia).padStart(2, "0")}/11/2026`, d.site, d.link, d.ia, d.site + d.link + d.ia].map((v) => (typeof v === "number" ? (v / 100).toFixed(2).replace(".", ",") : v))),
    ];
    const csv = "﻿" + linhas.map((l) => l.join(";")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `vendas-${p.id === "mes" ? "novembro" : `ultimos-${p.dias}-dias`}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    avisar("Planilha baixada (abre no Excel)");
  };

  const ferramentas = (
    <div ref={caixa} className="relative flex items-center gap-1.5">
      <button
        onClick={() => setMenu((v) => !v)}
        aria-expanded={menu}
        aria-haspopup="menu"
        title="Escolher período"
        className={cn("inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold ring-1 ring-black/10 hover:bg-snow", menu ? "bg-snow" : "bg-white")}
      >
        <Icon name="calendar" className="size-4" />
        <span className="hidden sm:inline">{p.rotulo}</span>
        <Icon name="chevronDown" className={cn("size-3.5 transition", menu && "rotate-180")} />
      </button>
      <button onClick={exportar} title="Baixar planilha (CSV)" aria-label="Baixar planilha" className="grid size-9 place-items-center rounded-full bg-white ring-1 ring-black/10 hover:bg-snow">
        <Icon name="download" className="size-4" />
      </button>
      {menu && (
        <ul role="menu" className="glass-strong rise absolute top-[calc(100%+6px)] right-0 z-20 w-48 rounded-2xl p-1.5">
          {periodos.map((x) => (
            <li key={x.id}>
              <button
                role="menuitemradio"
                aria-checked={periodo === x.id}
                onClick={() => {
                  setPeriodo(x.id);
                  setMenu(false);
                }}
                className={cn("flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm hover:bg-snow", periodo === x.id && "font-bold")}
              >
                {x.rotulo}
                {periodo === x.id && <Icon name="check" className="size-4 text-red" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <Card titulo={`Vendas · ${titulo}`} className="xl:col-span-8" ferramentas={ferramentas}>
      {/* Vendas em destaque (com meta e tendência); os outros cinco compactos ao lado */}
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,3fr)]">
        <Kpi {...destaque} destaque tendencia={dados.map((d) => d.site + d.link + d.ia)} className="h-full" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-6">
          {outros.map((k, i) => (
            <Kpi key={k.rotulo} {...k} className={i < 3 ? "sm:col-span-2" : "sm:col-span-3"} />
          ))}
        </div>
      </div>
      <div className="mt-4">
        <GraficoVendas serie={dados} />
      </div>
      {aviso}
    </Card>
  );
}
