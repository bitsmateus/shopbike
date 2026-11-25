"use client";

import Link from "next/link";
import { useState } from "react";
import { expedicao } from "@/mock/painel";
import { cn } from "@/lib/format";
import { Icon } from "@/ui/icons";
import { useAviso } from "@/ui/painel/controles";
import { Botao, Chip } from "@/ui/painel/ui";

const etapas = [
  { id: "Separar", titulo: "Separar", sub: "Pagos e aprovados no antifraude", cor: "bg-info" },
  { id: "Aguardando NF", titulo: "Aguardando NF", sub: "Bruning emite e devolve a chave", cor: "bg-[#e7a33e]" },
  { id: "Etiqueta", titulo: "Etiqueta", sub: "NF ok, falta etiqueta", cor: "bg-red" },
  { id: "Pronto", titulo: "Pronto", sub: "Embalado, aguardando coleta/retirada", cor: "bg-ink" },
  { id: "Enviado", titulo: "Enviado", sub: "Rastreio automático", cor: "bg-ok" },
] as const;

type Etapa = (typeof etapas)[number]["id"];
type Card = { pedido: string; cliente: string; itens: number; envio: string; etapa: Etapa; nf: boolean; obs?: string; rastreio?: string };

const proxima: Record<Etapa, [Etapa, string] | null> = {
  Separar: ["Aguardando NF", "Marcar separado"],
  "Aguardando NF": null,
  Etiqueta: ["Pronto", "Imprimir etiqueta"],
  Pronto: ["Enviado", "Despachar"],
  Enviado: null,
};

export function QuadroExpedicao() {
  const [cards, setCards] = useState<Card[]>(expedicao.map((e) => ({ ...e })) as Card[]);
  const [sel, setSel] = useState<string[]>([]);
  const { avisar, aviso } = useAviso();

  const mover = (ids: string[], para: Etapa, msg: string) => {
    setCards(cards.map((c) => (ids.includes(c.pedido) ? { ...c, etapa: para, rastreio: para === "Enviado" ? c.rastreio ?? "QB1200" + c.pedido + "BR" : c.rastreio } : c)));
    setSel([]);
    avisar(msg);
  };
  const etiquetas = cards.filter((c) => c.etapa === "Etiqueta" && sel.includes(c.pedido));

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Botao tom="ghost" onClick={() => avisar("Lista de separação gerada (PDF)")}>
          <Icon name="doc" className="size-4" /> Lista de separação
        </Botao>
        <Botao tom="ghost" onClick={() => avisar("PLP dos Correios gerada com 2 objetos")}>
          <Icon name="box" className="size-4" /> Gerar PLP Correios
        </Botao>
        <span className="flex-1" />
        {etiquetas.length > 0 && (
          <Botao tom="red" onClick={() => mover(etiquetas.map((c) => c.pedido), "Pronto", `${etiquetas.length} etiquetas impressas`)}>
            <Icon name="doc" className="size-4" /> Imprimir {etiquetas.length} etiquetas
          </Botao>
        )}
      </div>

      <div className="scrollbar-none -mx-1 flex gap-3 overflow-x-auto px-1 pb-2 xl:grid xl:grid-cols-5 xl:overflow-visible">
        {etapas.map((e) => {
          const lista = cards.filter((c) => c.etapa === e.id);
          return (
            <section key={e.id} className="glass flex w-[280px] shrink-0 flex-col rounded-[22px] p-3 xl:w-auto">
              <header className="px-1.5 pt-1 pb-3">
                <div className="flex items-center gap-2">
                  <span className={cn("size-2.5 rounded-full", e.cor)} />
                  <h2 className="font-bold">{e.titulo}</h2>
                  <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-xs font-bold ring-1 ring-black/5 tabular">{lista.length}</span>
                </div>
                <p className="mt-0.5 text-xs text-muted">{e.sub}</p>
              </header>
              <ul className="flex flex-1 flex-col gap-2">
                {lista.map((c) => {
                  const prox = proxima[c.etapa];
                  return (
                    <li key={c.pedido} className={cn("rise rounded-2xl bg-white/90 p-3 ring-1 transition", sel.includes(c.pedido) ? "ring-2 ring-ink" : "ring-black/5")}>
                      <div className="flex items-start gap-2">
                        {c.etapa === "Etiqueta" && (
                          <input
                            type="checkbox"
                            aria-label={`Selecionar pedido ${c.pedido}`}
                            checked={sel.includes(c.pedido)}
                            onChange={(ev) => setSel((s) => (ev.target.checked ? [...s, c.pedido] : s.filter((x) => x !== c.pedido)))}
                            className="mt-1 size-4 accent-[var(--color-ink)]"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <Link href={`/admin/pedidos?pedido=${c.pedido}`} className="font-bold tabular hover:underline">
                            #{c.pedido}
                          </Link>
                          <p className="truncate text-sm">{c.cliente}</p>
                        </div>
                        <span className="text-xs text-muted">{c.itens} {c.itens === 1 ? "item" : "itens"}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <Chip tom={c.envio === "Retirada na loja" ? "ink" : "neutro"}>
                          <Icon name={c.envio === "Retirada na loja" ? "store" : "truck"} className="size-3" /> {c.envio}
                        </Chip>
                        <Chip tom={c.nf ? "ok" : "warn"}>{c.nf ? "NF ok" : "Sem NF"}</Chip>
                      </div>
                      {c.obs && (
                        <p className="mt-2 flex items-start gap-1 rounded-xl bg-red-50 p-2 text-xs text-red">
                          <Icon name="alert" className="mt-px size-3.5 shrink-0" /> {c.obs}
                        </p>
                      )}
                      {c.rastreio && <p className="mt-2 text-xs text-muted">Rastreio {c.rastreio}</p>}
                      {c.etapa === "Aguardando NF" && (
                        <button onClick={() => mover([c.pedido], "Etiqueta", `NF recebida da Bruning para #${c.pedido} (simulado)`)} className="mt-2 text-xs font-semibold text-info">
                          Simular NF recebida
                        </button>
                      )}
                      {prox && c.etapa !== "Etiqueta" && (
                        <button onClick={() => mover([c.pedido], prox[0], `#${c.pedido}: ${prox[1].toLowerCase()}`)} className="mt-2.5 flex h-8 w-full items-center justify-center gap-1 rounded-full bg-ink text-xs font-semibold text-white">
                          {c.envio === "Retirada na loja" && c.etapa === "Pronto" ? "Entregue ao titular" : prox[1]} <Icon name="chevronRight" className="size-3.5" />
                        </button>
                      )}
                    </li>
                  );
                })}
                {lista.length === 0 && <li className="rounded-2xl border border-dashed border-black/10 p-4 text-center text-xs text-muted">Nada aqui</li>}
              </ul>
            </section>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-muted">Pedidos em análise no antifraude não aparecem aqui: nada é despachado antes da aprovação.</p>
      {aviso}
    </>
  );
}
