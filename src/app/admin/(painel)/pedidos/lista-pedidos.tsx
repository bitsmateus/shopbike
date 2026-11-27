"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { pedidos, type Canal, type Pedido, type StatusPedido } from "@/mock/operacao";
import { cn, reais } from "@/lib/format";
import { Icon } from "@/ui/icons";
import { useAviso } from "@/ui/painel/controles";
import { PedidoDrawer } from "@/ui/painel/pedido-drawer";
import { BarraLote, Botao, Card, RiscoNumero, StatusChip, plural } from "@/ui/painel/ui";

const filtrosStatus: (StatusPedido | "Todos")[] = ["Todos", "Aguardando pagamento", "Em análise", "Pago", "Em separação", "Faturado", "Enviado", "Entregue", "Bloqueado", "Cancelado"];

/* Período relativo ao pedido mais recente da base (no protótipo, "hoje" = data do último pedido). */
const ultimoDia = pedidos.map((p) => p.data.slice(0, 10)).sort().at(-1)!;
const diasAtras = (data: string) => Math.round((Date.parse(ultimoDia) - Date.parse(data.slice(0, 10))) / 86_400_000);
const periodos = [
  { id: "todos", rotulo: "Todo o período", ok: () => true },
  { id: "hoje", rotulo: "Hoje", ok: (d: string) => diasAtras(d) === 0 },
  { id: "7", rotulo: "Últimos 7 dias", ok: (d: string) => diasAtras(d) < 7 },
  { id: "mes", rotulo: "Este mês", ok: (d: string) => d.slice(0, 7) === ultimoDia.slice(0, 7) },
] as const;

/**
 * "Próxima ação": o que é tarefa vira botão (com destino); o que é só situação fica em cinza.
 * Situações = esperas e bloqueios, em que não há nada para a loja fazer agora.
 */
function acaoDe(p: Pedido): { tipo: "estado" } | { tipo: "link"; href: string } | { tipo: "detalhe" } {
  const t = p.proximaAcao;
  if (t === "—" || /^(Aguardando|Bloqueado|Pagamento negado)/.test(t)) return { tipo: "estado" };
  if (t.includes("antifraude")) return { tipo: "link", href: `/admin/antifraude?pedido=${p.numero}` };
  if (/Separar|etiqueta/i.test(t)) return { tipo: "link", href: "/admin/expedicao" };
  return { tipo: "detalhe" };
}

const iconeCanal: Record<Canal, "store" | "link" | "whatsapp"> = { Site: "store", Link: "link", IA: "whatsapp" };

export function ListaPedidos({ inicial }: { inicial?: string }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<(typeof filtrosStatus)[number]>("Todos");
  const [canal, setCanal] = useState<Canal | "Todos">("Todos");
  const [periodo, setPeriodo] = useState<(typeof periodos)[number]["id"]>("todos");
  const [menuPeriodo, setMenuPeriodo] = useState(false);
  const [aberto, setAberto] = useState<string | undefined>(inicial);
  const [sel, setSel] = useState<string[]>([]);
  const caixaPeriodo = useRef<HTMLDivElement>(null);
  const { avisar, aviso } = useAviso();

  useEffect(() => {
    if (!menuPeriodo) return;
    const fechar = (e: MouseEvent) => {
      if (!caixaPeriodo.current?.contains(e.target as Node)) setMenuPeriodo(false);
    };
    document.addEventListener("mousedown", fechar);
    return () => document.removeEventListener("mousedown", fechar);
  }, [menuPeriodo]);

  const per = periodos.find((x) => x.id === periodo)!;
  const lista = useMemo(() => {
    const t = q.toLowerCase();
    return pedidos.filter(
      (p) =>
        (status === "Todos" || p.status === status) &&
        (canal === "Todos" || p.canal === canal) &&
        per.ok(p.data) &&
        (!t || [p.numero, p.cliente.nome, p.cliente.email, p.cliente.cpf, p.nf ?? "", ...p.itens.map((i) => i.nome + i.sku)].join(" ").toLowerCase().includes(t)),
    );
  }, [q, status, canal, per]);

  const pedidoAberto = pedidos.find((p) => p.numero === aberto);
  const contagem = (s: string) => (s === "Todos" ? pedidos.length : pedidos.filter((p) => p.status === s).length);
  const alternar = (n: string, marcar: boolean) => setSel((s) => (marcar ? [...s, n] : s.filter((x) => x !== n)));

  const exportar = () => {
    const linhas = [
      ["Pedido", "Data", "Cliente", "Cidade/UF", "Canal", "Vendedor", "Pagamento", "Parcelas", "Risco", "Total (R$)", "Status", "Próxima ação"],
      ...lista.map((p) => [
        p.numero,
        new Date(p.data).toLocaleString("pt-BR"),
        p.cliente.nome,
        `${p.cliente.cidade}/${p.cliente.uf}`,
        p.canal,
        p.vendedor ?? "",
        p.pagamento.forma,
        String(p.pagamento.parcelas),
        String(p.risco.nota),
        (p.total / 100).toFixed(2).replace(".", ","),
        p.status,
        p.proximaAcao,
      ]),
    ];
    const csv = "﻿" + linhas.map((l) => l.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(";")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `pedidos-${per.id === "todos" ? "todos" : per.id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    avisar(`${plural(lista.length, "pedido exportado", "pedidos exportados")} (abre no Excel)`);
  };

  const imprimir = (o_que: string) => {
    avisar(`${o_que} de ${plural(sel.length, "pedido", "pedidos")} enviada para a impressora`);
    setSel([]);
  };

  return (
    <>
      <Card className="p-3 md:p-4">
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex h-11 min-w-[260px] flex-1 items-center gap-2 rounded-full bg-snow px-4 ring-1 ring-black/5 focus-within:ring-ink">
            <Icon name="search" className="size-4 text-faint" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Número, NF, CPF, nome, e-mail, produto ou SKU" className="h-full flex-1 bg-transparent text-sm font-medium outline-none" aria-label="Buscar pedidos" />
          </label>

          {/* Canal: controle segmentado (filtro independente dos status abaixo) */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted">Canal</span>
            <div className="flex rounded-full bg-fundo-painel p-1" role="group" aria-label="Canal">
              {(["Todos", "Site", "Link", "IA"] as const).map((c) => (
                <button
                  key={c}
                  aria-pressed={canal === c}
                  onClick={() => setCanal(c)}
                  className={cn("h-8 rounded-full px-3 text-sm font-semibold", canal === c ? "bg-white text-ink shadow-[0_1px_2px_rgb(0_0_0/0.08)]" : "text-muted hover:text-ink")}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div ref={caixaPeriodo} className="relative">
            <Botao tom="ghost" aria-haspopup="menu" aria-expanded={menuPeriodo} onClick={() => setMenuPeriodo((v) => !v)}>
              <Icon name="calendar" className="size-4" /> {per.id === "todos" ? "Período" : per.rotulo}
              <Icon name="chevronDown" className={cn("size-3.5 transition", menuPeriodo && "rotate-180")} />
            </Botao>
            {menuPeriodo && (
              <ul role="menu" className="glass-strong rise absolute top-[calc(100%+6px)] right-0 z-20 w-48 rounded-2xl p-1.5">
                {periodos.map((x) => (
                  <li key={x.id}>
                    <button
                      role="menuitemradio"
                      aria-checked={periodo === x.id}
                      onClick={() => {
                        setPeriodo(x.id);
                        setMenuPeriodo(false);
                      }}
                      className={cn("flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm hover:bg-snow", periodo === x.id && "font-bold")}
                    >
                      {x.rotulo}
                      {periodo === x.id && <Icon name="check" className="size-4" />}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Botao tom="ghost" onClick={exportar} title="Baixar a lista filtrada (CSV)">
            <Icon name="download" className="size-4" /> Exportar
          </Botao>
        </div>

        <div className="scrollbar-none -mx-1 mt-2 flex gap-1.5 overflow-x-auto px-1 py-1" role="group" aria-label="Status">
          {filtrosStatus.map((s) => (
            <button
              key={s}
              aria-pressed={status === s}
              onClick={() => setStatus(s)}
              className={cn("inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ring-1 transition", status === s ? "bg-ink text-white ring-ink" : "bg-white ring-line hover:bg-snow")}
            >
              {s}
              <span className={cn("text-xs tabular", status === s ? "text-white/70" : "text-faint")}>{contagem(s)}</span>
            </button>
          ))}
        </div>
      </Card>

      <Card className="mt-4 overflow-hidden p-0 xl:overflow-visible">
        <div className="overflow-x-auto xl:overflow-visible">
          <table className="thead-fixo w-full min-w-[1080px] text-sm">
            <thead>
              <tr className="text-left text-xs font-bold tracking-[0.3px] text-muted uppercase">
                <th className="w-12 rounded-tl-[var(--radius-card)] p-0">
                  <label className="flex h-11 w-12 cursor-pointer items-center justify-center">
                    <input
                      type="checkbox"
                      aria-label="Selecionar todos"
                      checked={sel.length === lista.length && lista.length > 0}
                      onChange={(e) => setSel(e.target.checked ? lista.map((p) => p.numero) : [])}
                      className="size-[18px] cursor-pointer accent-[var(--color-ink)]"
                    />
                  </label>
                </th>
                <th className="py-3">Pedido</th>
                <th>Cliente</th>
                <th>Canal</th>
                <th>Pagamento</th>
                <th className="pr-4 text-right">Risco</th>
                <th className="text-right">Total</th>
                <th className="pl-6">Status</th>
                <th className="rounded-tr-[var(--radius-card)] pr-5">Próxima ação</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((p) => {
                const marcado = sel.includes(p.numero);
                const acao = acaoDe(p);
                return (
                  <tr
                    key={p.numero}
                    onClick={() => setAberto(p.numero)}
                    aria-selected={marcado}
                    className={cn(
                      "h-14 cursor-pointer border-t border-line transition",
                      marcado ? "bg-fundo-painel shadow-[inset_2px_0_0_var(--color-ink)]" : "hover:bg-snow",
                    )}
                  >
                    <td className="p-0" onClick={(e) => e.stopPropagation()}>
                      {/* a célula inteira marca o pedido (área de 48×56) */}
                      <label className="flex h-14 w-12 cursor-pointer items-center justify-center">
                        <input
                          type="checkbox"
                          aria-label={`Selecionar pedido ${p.numero}`}
                          checked={marcado}
                          onChange={(e) => alternar(p.numero, e.target.checked)}
                          className="size-[18px] cursor-pointer accent-[var(--color-ink)]"
                        />
                      </label>
                    </td>
                    <td>
                      <span className="font-semibold tabular">#{p.numero}</span>
                      <span className="block text-xs text-muted">{new Date(p.data).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</span>
                    </td>
                    <td>
                      <span className="font-medium">{p.cliente.nome}</span>
                      <span className="block text-xs text-muted">
                        {p.cliente.cidade}/{p.cliente.uf}
                      </span>
                    </td>
                    <td>
                      <span className="inline-flex items-center gap-1.5">
                        <Icon name={iconeCanal[p.canal]} className="size-4 text-muted" />
                        {p.canal}
                      </span>
                      {p.vendedor && <span className="block text-xs text-muted">Vendedor: {p.vendedor}</span>}
                    </td>
                    <td>
                      {p.pagamento.forma}
                      <span className="block text-xs text-muted">{p.pagamento.parcelas > 1 ? `${p.pagamento.parcelas}x` : "à vista"}</span>
                    </td>
                    <td className="pr-4 text-right">
                      <RiscoNumero nota={p.risco.nota} />
                    </td>
                    <td className="text-right font-semibold tabular">{reais(p.total)}</td>
                    <td className="pl-6">
                      <StatusChip status={p.status} />
                    </td>
                    <td className="pr-3" onClick={acao.tipo === "estado" ? undefined : (e) => e.stopPropagation()}>
                      {acao.tipo === "estado" ? (
                        <span className="px-2.5 text-sm text-faint">{p.proximaAcao}</span>
                      ) : acao.tipo === "link" ? (
                        <Link href={acao.href} className="inline-flex h-8 items-center gap-1 rounded-full px-2.5 text-sm font-semibold text-ink hover:bg-fundo-painel">
                          {p.proximaAcao} <Icon name="chevronRight" className="size-3.5" />
                        </Link>
                      ) : (
                        <button onClick={() => setAberto(p.numero)} className="inline-flex h-8 items-center gap-1 rounded-full px-2.5 text-sm font-semibold text-ink hover:bg-fundo-painel">
                          {p.proximaAcao} <Icon name="chevronRight" className="size-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {lista.length === 0 && (
            <div className="p-10 text-center">
              <p className="font-semibold">Nenhum pedido com esses filtros</p>
              <p className="mt-1 text-sm text-muted">Tente outro período, canal ou status, ou limpe a busca.</p>
            </div>
          )}
        </div>
      </Card>

      {sel.length > 0 && (
        <BarraLote
          texto={plural(sel.length, "pedido selecionado", "pedidos selecionados")}
          acoes={[
            { rotulo: "Imprimir etiquetas", icone: "doc", onClick: () => imprimir("Etiqueta") },
            { rotulo: "Imprimir pedidos", onClick: () => imprimir("Via") },
          ]}
          limpar={() => setSel([])}
        />
      )}

      {pedidoAberto && <PedidoDrawer p={pedidoAberto} fechar={() => setAberto(undefined)} />}
      {aviso}
    </>
  );
}
