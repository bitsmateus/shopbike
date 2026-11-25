"use client";

import { useMemo, useState } from "react";
import { pedidos, type Canal, type StatusPedido } from "@/mock/operacao";
import { cn, reais } from "@/lib/format";
import { Icon } from "@/ui/icons";
import { PedidoDrawer } from "@/ui/painel/pedido-drawer";
import { Botao, Card, NotaRisco, StatusChip } from "@/ui/painel/ui";

const filtrosStatus: (StatusPedido | "Todos")[] = ["Todos", "Aguardando pagamento", "Em análise", "Pago", "Em separação", "Faturado", "Enviado", "Entregue", "Bloqueado", "Cancelado"];

export function ListaPedidos({ inicial }: { inicial?: string }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<(typeof filtrosStatus)[number]>("Todos");
  const [canal, setCanal] = useState<Canal | "Todos">("Todos");
  const [aberto, setAberto] = useState<string | undefined>(inicial);
  const [sel, setSel] = useState<string[]>([]);

  const lista = useMemo(() => {
    const t = q.toLowerCase();
    return pedidos.filter(
      (p) =>
        (status === "Todos" || p.status === status) &&
        (canal === "Todos" || p.canal === canal) &&
        (!t || [p.numero, p.cliente.nome, p.cliente.email, p.cliente.cpf, p.nf ?? "", ...p.itens.map((i) => i.nome + i.sku)].join(" ").toLowerCase().includes(t)),
    );
  }, [q, status, canal]);

  const pedidoAberto = pedidos.find((p) => p.numero === aberto);
  const contagem = (s: string) => (s === "Todos" ? pedidos.length : pedidos.filter((p) => p.status === s).length);

  return (
    <>
      <Card className="p-3 md:p-4">
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex h-11 min-w-[260px] flex-1 items-center gap-2 rounded-full bg-white/80 px-4 ring-1 ring-black/5 focus-within:ring-ink">
            <Icon name="search" className="size-4 text-faint" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Número, NF, CPF, nome, e-mail, produto ou SKU" className="h-full flex-1 bg-transparent text-sm outline-none" aria-label="Buscar pedidos" />
          </label>
          <div className="flex rounded-full bg-white/70 p-1 ring-1 ring-black/5" role="group" aria-label="Canal">
            {(["Todos", "Site", "Link", "IA"] as const).map((c) => (
              <button key={c} aria-pressed={canal === c} onClick={() => setCanal(c)} className={cn("rounded-full px-3.5 py-1.5 text-sm font-semibold", canal === c ? "bg-ink text-white" : "text-muted hover:text-ink")}>
                {c}
              </button>
            ))}
          </div>
          <Botao tom="ghost">
            <Icon name="filter" className="size-4" /> Período
          </Botao>
          <Botao tom="ghost">
            <Icon name="arrowDown" className="size-4" /> Exportar
          </Botao>
        </div>
        <div className="scrollbar-none mt-3 flex gap-1.5 overflow-x-auto">
          {filtrosStatus.map((s) => (
            <button
              key={s}
              aria-pressed={status === s}
              onClick={() => setStatus(s)}
              className={cn("inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ring-1 transition", status === s ? "bg-ink text-white ring-ink" : "bg-white/60 ring-black/5 hover:bg-white")}
            >
              {s}
              <span className={cn("text-xs tabular", status === s ? "text-white/70" : "text-faint")}>{contagem(s)}</span>
            </button>
          ))}
        </div>
      </Card>

      {sel.length > 0 && (
        <div className="glass rise mt-3 flex flex-wrap items-center gap-2 rounded-full p-2 pl-5 text-sm">
          <strong>{sel.length} selecionados</strong>
          <span className="flex-1" />
          <Botao tom="ghost">Imprimir etiquetas</Botao>
          <Botao tom="ghost">Imprimir pedidos</Botao>
          <Botao tom="ink" onClick={() => setSel([])}>
            Limpar
          </Botao>
        </div>
      )}

      <Card className="mt-4 overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px] text-sm">
            <thead>
              <tr className="border-b border-black/5 text-left text-xs font-semibold tracking-wide text-muted uppercase">
                <th className="w-10 py-3.5 pl-5">
                  <input
                    type="checkbox"
                    aria-label="Selecionar todos"
                    checked={sel.length === lista.length && lista.length > 0}
                    onChange={(e) => setSel(e.target.checked ? lista.map((p) => p.numero) : [])}
                    className="size-4 accent-[var(--color-ink)]"
                  />
                </th>
                <th className="py-3.5">Pedido</th>
                <th>Cliente</th>
                <th>Canal</th>
                <th>Pagamento</th>
                <th>Risco</th>
                <th className="text-right">Total</th>
                <th className="pl-6">Status</th>
                <th className="pr-5">Próxima ação</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((p) => (
                <tr key={p.numero} onClick={() => setAberto(p.numero)} className="cursor-pointer border-b border-black/5 transition last:border-0 hover:bg-white/70">
                  <td className="py-3.5 pl-5" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      aria-label={`Selecionar pedido ${p.numero}`}
                      checked={sel.includes(p.numero)}
                      onChange={(e) => setSel((s) => (e.target.checked ? [...s, p.numero] : s.filter((x) => x !== p.numero)))}
                      className="size-4 accent-[var(--color-ink)]"
                    />
                  </td>
                  <td className="py-3.5">
                    <span className="font-bold tabular">#{p.numero}</span>
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
                      <Icon name={p.canal === "Site" ? "store" : p.canal === "Link" ? "link" : "whatsapp"} className="size-4 text-muted" />
                      {p.canal}
                    </span>
                    {p.vendedor && <span className="block text-xs text-muted">{p.vendedor}</span>}
                  </td>
                  <td>
                    {p.pagamento.forma}
                    <span className="block text-xs text-muted">{p.pagamento.parcelas > 1 ? `${p.pagamento.parcelas}x` : "à vista"}</span>
                  </td>
                  <td>
                    <NotaRisco nota={p.risco.nota} faixa={p.risco.faixa} />
                  </td>
                  <td className="text-right font-semibold tabular">{reais(p.total)}</td>
                  <td className="pl-6">
                    <StatusChip status={p.status} />
                  </td>
                  <td className="pr-5">
                    <span className={cn("text-sm", p.proximaAcao.includes("negada") || p.proximaAcao.includes("bloqueado") ? "text-red" : "font-medium")}>{p.proximaAcao}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {lista.length === 0 && <p className="p-10 text-center text-muted">Nenhum pedido com esses filtros.</p>}
        </div>
      </Card>

      {pedidoAberto && <PedidoDrawer p={pedidoAberto} fechar={() => setAberto(undefined)} />}
    </>
  );
}
