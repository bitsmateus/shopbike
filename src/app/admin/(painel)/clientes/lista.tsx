"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { clientes, type Cliente } from "@/mock/painel";
import { cn, iniciaisDe, numero, reais } from "@/lib/format";
import { Icon } from "@/ui/icons";
import { useAviso } from "@/ui/painel/controles";
import { Botao, Card, Chip } from "@/ui/painel/ui";

const grupos = ["Todos", "Varejo", "Ciclista frequente", "Equipe de pedal", "Lojista (B2B)"] as const;

/** Total da base (a lista do protótipo é uma amostra; na plataforma a paginação vem do servidor). */
const TOTAL_BASE = 28_412;

type Coluna = "pedidos" | "totalGasto" | "ultimaCompra";
const dataNum = (d: string) => {
  const [dia, mes, ano] = d.split("/").map(Number);
  return ano * 10_000 + mes * 100 + dia;
};
const valorOrdem = (c: Cliente, col: Coluna) => (col === "ultimaCompra" ? dataNum(c.ultimaCompra) : c[col]);

export function ListaClientes() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [grupo, setGrupo] = useState<(typeof grupos)[number]>("Todos");
  const [ordem, setOrdem] = useState<{ col: Coluna; dir: "asc" | "desc" } | null>(null);
  const { avisar, aviso } = useAviso();

  const lista = useMemo(() => {
    const filtrada = clientes.filter((c) => (grupo === "Todos" || c.grupo === grupo) && (!q || `${c.nome} ${c.email} ${c.doc} ${c.cidade} ${c.tel}`.toLowerCase().includes(q.toLowerCase())));
    if (!ordem) return filtrada;
    return [...filtrada].sort((a, b) => (valorOrdem(a, ordem.col) - valorOrdem(b, ordem.col)) * (ordem.dir === "asc" ? 1 : -1));
  }, [q, grupo, ordem]);
  const contagem = (g: string) => (g === "Todos" ? clientes.length : clientes.filter((c) => c.grupo === g).length);

  // Clique alterna: maior primeiro → menor primeiro
  const ordenar = (col: Coluna) => setOrdem((o) => (o?.col === col ? { col, dir: o.dir === "desc" ? "asc" : "desc" } : { col, dir: "desc" }));
  const ariaSort = (col: Coluna) => (ordem?.col === col ? (ordem.dir === "asc" ? "ascending" : "descending") : "none");
  const cab = (col: Coluna, children: string) => (
    <th aria-sort={ariaSort(col)} className={cn(col !== "ultimaCompra" && "text-right")}>
      <button onClick={() => ordenar(col)} className={cn("inline-flex items-center gap-1 uppercase hover:text-ink", ordem?.col === col && "text-ink")}>
        {children}
        <Icon name={ordem?.col === col && ordem.dir === "asc" ? "arrowUp" : "arrowDown"} className={cn("size-3.5", ordem?.col !== col && "opacity-40")} />
      </button>
    </th>
  );

  const exportar = () => {
    const linhas = [["Nome", "Tipo", "Documento", "Telefone", "E-mail", "Cidade/UF", "Grupo", "Pedidos", "Total gasto (R$)", "Última compra", "Aceita marketing"], ...lista.map((c) => [c.nome, c.tipo, c.doc, c.tel, c.email, `${c.cidade}/${c.uf}`, c.grupo, String(c.pedidos), (c.totalGasto / 100).toFixed(2).replace(".", ","), c.ultimaCompra, c.marketing ? "Sim" : "Não"])];
    const csv = "﻿" + linhas.map((l) => l.map((x) => `"${x.replace(/"/g, '""')}"`).join(";")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "clientes.csv";
    a.click();
    URL.revokeObjectURL(url);
    avisar(`${lista.length} clientes exportados (abre no Excel)`);
  };

  return (
    <>
      <Card className="overflow-hidden p-0">
        {/* Busca e filtros juntos, como em Pedidos */}
        <div className="border-b border-line p-3 md:p-4">
          <div className="flex flex-wrap items-center gap-2">
            <label className="campo flex h-11 min-w-[260px] flex-1 items-center gap-2 rounded-full px-4">
              <Icon name="search" className="size-4 text-faint" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Nome, CPF/CNPJ, e-mail, telefone ou cidade" className="flex-1 bg-transparent text-sm font-medium" aria-label="Buscar clientes" />
            </label>
            <Botao tom="ghost" onClick={exportar}>
              <Icon name="download" className="size-4" /> Exportar
            </Botao>
            <Botao tom="ink" onClick={() => avisar("Cadastro de cliente: formulário chega na Etapa 1")}>
              <Icon name="plus" className="size-4" /> Novo cliente
            </Botao>
          </div>
          <div className="scrollbar-none -mx-1 mt-2 flex gap-1.5 overflow-x-auto px-1 py-1" role="group" aria-label="Grupo">
            {grupos.map((g) => (
              <button
                key={g}
                aria-pressed={grupo === g}
                onClick={() => setGrupo(g)}
                className={cn("inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ring-1 transition", grupo === g ? "bg-ink text-white ring-ink" : "bg-white ring-line hover:bg-snow")}
              >
                {g}
                <span className={cn("text-xs tabular", grupo === g ? "text-white/70" : "text-faint")}>{contagem(g)}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="tabela min-w-[980px]">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Contato</th>
                <th>Cidade</th>
                <th>Grupo</th>
                {cab("pedidos", "Pedidos")}
                {cab("totalGasto", "Total gasto")}
                {cab("ultimaCompra", "Última compra")}
                <th>Aceita marketing</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((c) => (
                // linha inteira abre o cliente; o nome continua sendo link (teclado e abrir em nova aba)
                <tr key={c.id} className="cursor-pointer" onClick={() => router.push(`/admin/clientes/${c.id}`)}>
                  <td>
                    <Link href={`/admin/clientes/${c.id}`} className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-cloud text-xs font-bold text-ink" aria-hidden>
                        {iniciaisDe(c.nome)}
                      </span>
                      <span>
                        <span className="block font-semibold">{c.nome}</span>
                        <span className="text-xs text-muted">
                          {c.tipo} · {c.doc}
                        </span>
                      </span>
                    </Link>
                  </td>
                  <td>
                    <span className="block">{c.tel}</span>
                    <span className="text-xs text-muted">{c.email}</span>
                  </td>
                  <td>
                    {c.cidade}/{c.uf}
                  </td>
                  <td>
                    <Chip>{c.grupo}</Chip>
                  </td>
                  <td className="text-right tabular">{c.pedidos}</td>
                  <td className="text-right font-semibold tabular">{reais(c.totalGasto)}</td>
                  <td className="tabular">{c.ultimaCompra}</td>
                  <td className={c.marketing ? "text-ink" : "text-faint"}>{c.marketing ? "Sim" : "Não"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {lista.length === 0 && <p className="p-10 text-center text-sm text-muted">Nenhum cliente com essa busca ou grupo.</p>}
        </div>
        {/* Paginação: total real da base; no protótipo só existe a primeira página */}
        <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-2.5 text-sm">
          <span className="text-muted tabular">
            {lista.length ? `1–${lista.length}` : "0"} de {grupo === "Todos" && !q ? numero(TOTAL_BASE) : lista.length}
          </span>
          <span className="flex gap-1.5">
            <Botao tom="ghost" tamanho="card" disabled aria-label="Página anterior">
              <Icon name="chevronLeft" className="size-4" /> Anterior
            </Botao>
            <Botao tom="ghost" tamanho="card" disabled={grupo !== "Todos" || !!q} onClick={() => avisar("Próxima página: a lista completa vem do servidor na Etapa 1")} aria-label="Próxima página">
              Próxima <Icon name="chevronRight" className="size-4" />
            </Botao>
          </span>
        </div>
      </Card>
      {aviso}
    </>
  );
}
