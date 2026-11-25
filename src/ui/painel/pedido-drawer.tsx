"use client";

import { useState } from "react";
import type { Pedido } from "@/mock/operacao";
import { cn, reais } from "@/lib/format";
import { Icon } from "@/ui/icons";
import { Botao, NotaRisco, StatusChip } from "./ui";

const abas = ["Produtos", "Entrega", "Pagamento", "Cliente", "Histórico", "Antifraude"] as const;

export function PedidoDrawer({ p, fechar, abaInicial = "Produtos" }: { p: Pedido; fechar: () => void; abaInicial?: (typeof abas)[number] }) {
  const [aba, setAba] = useState<(typeof abas)[number]>(abaInicial);
  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal aria-label={`Pedido ${p.numero}`}>
      <button className="absolute inset-0 bg-ink/20" aria-label="Fechar" onClick={fechar} />
      <aside className="glass-strong drawer-in absolute inset-y-2 right-2 flex w-[calc(100%-16px)] max-w-2xl flex-col overflow-hidden rounded-[26px]">
        <header className="border-b border-black/5 p-5">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-bold tracking-tight">Pedido #{p.numero}</h2>
                <StatusChip status={p.status} />
                <NotaRisco nota={p.risco.nota} faixa={p.risco.faixa} />
              </div>
              <p className="mt-1 text-sm text-muted">
                {new Date(p.data).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })} · {p.canal}
                {p.vendedor && ` · vendedor ${p.vendedor}`} · <strong className="text-ink tabular">{reais(p.total)}</strong>
              </p>
            </div>
            <button onClick={fechar} className="grid size-10 place-items-center rounded-full bg-white ring-1 ring-black/5" aria-label="Fechar">
              <Icon name="close" />
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Botao tom="ink">
              <Icon name="check" className="size-4" /> {p.proximaAcao === "—" ? "Sem pendências" : p.proximaAcao}
            </Botao>
            <Botao tom="ghost">
              <Icon name="doc" className="size-4" /> Imprimir
            </Botao>
            <Botao tom="ghost">
              <Icon name="whatsapp" className="size-4" /> WhatsApp do cliente
            </Botao>
            <Botao tom="ghost" className="text-red">
              Cancelar com estorno
            </Botao>
          </div>
          <div role="tablist" className="scrollbar-none -mb-5 mt-4 flex gap-1 overflow-x-auto">
            {abas.map((a) => (
              <button
                key={a}
                role="tab"
                aria-selected={aba === a}
                onClick={() => setAba(a)}
                className={cn("shrink-0 border-b-2 px-3 pb-3 text-sm font-semibold transition", aba === a ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink")}
              >
                {a}
                {a === "Antifraude" && p.risco.faixa !== "aprova" && <span className="ml-1.5 inline-block size-1.5 rounded-full bg-red align-middle" />}
              </button>
            ))}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-5">
          {aba === "Produtos" && (
            <div className="space-y-2">
              {p.itens.map((i) => (
                <div key={i.sku} className="tile flex items-center gap-3 p-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-snow">
                    <Icon name="box" className="size-5" />
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-semibold">{i.nome}</span>
                    <span className="text-xs text-muted">
                      SKU {i.sku} · {i.qtd} un.
                    </span>
                  </span>
                  <span className="font-semibold tabular">{reais(i.preco * i.qtd)}</span>
                </div>
              ))}
              <dl className="mt-4 space-y-1.5 text-sm tabular">
                <Linha k="Frete" v={p.frete.valor ? reais(p.frete.valor) : "Grátis"} />
                <Linha k="Total" v={reais(p.total)} forte />
              </dl>
              <div className="mt-4 rounded-2xl bg-snow p-3 text-sm">
                <p className="font-semibold">Observações internas</p>
                <textarea className="mt-2 h-20 w-full resize-none rounded-xl bg-white p-3 text-sm ring-1 ring-line outline-none" placeholder="Visível só para a equipe…" />
              </div>
            </div>
          )}
          {aba === "Entrega" && (
            <dl className="space-y-3 text-sm">
              <Linha k="Serviço" v={p.frete.servico} />
              <Linha k="Prazo" v={p.frete.prazo} />
              <Linha k="Destino" v={`${p.cliente.cidade}/${p.cliente.uf}`} />
              <Linha k="Nota fiscal" v={p.nf ?? "Aguardando Bruning"} />
              <Linha k="Rastreio" v={p.frete.rastreio ?? "—"} />
              {p.risco.faixa !== "aprova" && (
                <p className="rounded-2xl bg-red-50 p-3 text-red">Pedido de risco: só pode sair para o endereço de cobrança, e qualquer troca de endereço trava o pedido.</p>
              )}
            </dl>
          )}
          {aba === "Pagamento" && (
            <dl className="space-y-3 text-sm">
              <Linha k="Forma" v={p.pagamento.forma} />
              <Linha k="Parcelas" v={`${p.pagamento.parcelas}x`} />
              {p.pagamento.bandeira && <Linha k="Cartão" v={`${p.pagamento.bandeira} final ${p.pagamento.final}`} />}
              <Linha k="3D Secure" v={p.pagamento.tresDS ? "Autenticado no banco" : "Não autenticado"} />
              <Linha k="TID" v={p.pagamento.tid ?? "—"} />
              <Linha k="NSU" v={p.pagamento.nsu ?? "—"} />
              <Linha k="Autorização" v={p.pagamento.autorizacao ?? "—"} />
              <Linha k="Gateway" v={p.pagamento.forma.includes("Pix") ? "Pix [provedor a definir]" : "e.Rede"} />
            </dl>
          )}
          {aba === "Cliente" && (
            <dl className="space-y-3 text-sm">
              <Linha k="Nome" v={p.cliente.nome} />
              <Linha k="CPF" v={p.cliente.cpf} />
              <Linha k="E-mail" v={p.cliente.email} />
              <Linha k="WhatsApp" v={p.cliente.tel} />
              <Linha k="Cidade" v={`${p.cliente.cidade}/${p.cliente.uf}`} />
              <Linha k="Pedidos anteriores" v={String(p.cliente.pedidosAnteriores)} />
              <p className="text-xs text-muted">Acesso a dados pessoais registrado na auditoria (LGPD).</p>
            </dl>
          )}
          {aba === "Histórico" && (
            <ol className="relative space-y-4 border-l border-line pl-5">
              {[...p.historico, { status: p.status, quando: p.data, quem: p.status === "Em análise" ? "Antifraude" : "Sistema" }].map((h, i) => (
                <li key={i} className="relative">
                  <span className="absolute top-1 -left-[25px] size-2.5 rounded-full bg-ink ring-4 ring-white" />
                  <p className="text-sm font-semibold">{h.status}</p>
                  <p className="text-xs text-muted">
                    {new Date(h.quando).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })} · {h.quem}
                  </p>
                </li>
              ))}
            </ol>
          )}
          {aba === "Antifraude" && <AnaliseRisco p={p} />}
        </div>
      </aside>
    </div>
  );
}

export function AnaliseRisco({ p }: { p: Pedido }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <NotaRisco nota={p.risco.nota} faixa={p.risco.faixa} grande />
        <div className="text-sm">
          <p className="font-semibold">{p.risco.faixa === "aprova" ? "Aprovação automática" : p.risco.faixa === "revisao" ? "Revisão manual" : "Bloqueado automaticamente"}</p>
          <p className="text-muted">Base 8 + regras abaixo · 0–29 aprova · 30–59 revisão · 60+ bloqueia</p>
        </div>
      </div>
      <div>
        <p className="mb-2 text-sm font-semibold">Motivos da nota</p>
        <ul className="space-y-1.5">
          <li className="flex justify-between rounded-xl bg-snow px-3 py-2 text-sm">
            <span className="text-muted">Base</span>
            <span className="font-semibold tabular">+8</span>
          </li>
          {p.risco.motivos.map((m) => (
            <li key={m.codigo} className="flex justify-between gap-3 rounded-xl bg-snow px-3 py-2 text-sm">
              <span>{m.descricao}</span>
              <span className={cn("font-bold tabular", m.peso > 0 ? "text-red" : "text-ok")}>
                {m.peso > 0 ? "+" : ""}
                {m.peso}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="mb-2 text-sm font-semibold">Dados ligados</p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {p.vinculos.map((v) => (
            <li key={v.tipo + v.valor} className={cn("rounded-xl p-3 text-sm ring-1", v.alerta ? "bg-red-50 ring-red-100" : "bg-white ring-line")}>
              <span className="block text-xs text-muted">{v.tipo}</span>
              <span className="block truncate font-medium">{v.valor}</span>
              {v.alerta && (
                <span className="mt-1 flex items-center gap-1 text-xs font-semibold text-red">
                  <Icon name="alert" className="size-3.5" /> {v.alerta}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Linha({ k, v, forte }: { k: string; v: string; forte?: boolean }) {
  return (
    <div className={cn("flex justify-between gap-4 border-b border-black/5 pb-2", forte && "text-base font-bold")}>
      <dt className="text-muted">{k}</dt>
      <dd className="text-right font-medium">{v}</dd>
    </div>
  );
}
