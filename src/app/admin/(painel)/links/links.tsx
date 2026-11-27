"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { produtos, type Produto } from "@/mock/catalogo";
import { links as linksIniciais, type LinkPagamento } from "@/mock/operacao";
import { cn, reais } from "@/lib/format";
import { parcelasPermitidas, valorParcela } from "@/modules/precos/parcelamento";
import { Icon } from "@/ui/icons";
import { ProductArt } from "@/ui/product-art";
import { Botao, Card } from "@/ui/painel/ui";

type Item = { p: Produto; sku: string; rotulo: string; qtd: number };

const LIMITE_DESCONTO = 5; // % do perfil Vendedor (protótipo)

const statusLink: Record<LinkPagamento["status"], [string, string]> = {
  ativo: ["Ativo", "bg-ok-50 text-ok"],
  em_uso: ["Pagamento em andamento", "bg-warn-50 text-warn"],
  pago: ["Pago", "bg-info-50 text-info"],
  expirado: ["Expirado", "bg-cloud text-faint"],
  cancelado: ["Cancelado", "bg-cloud text-faint"],
};

export function Links() {
  const [busca, setBusca] = useState("");
  const [itens, setItens] = useState<Item[]>([]);
  const [desconto, setDesconto] = useState(0);
  const [parcelas, setParcelas] = useState(21);
  const [cliente, setCliente] = useState("");
  const [lista, setLista] = useState(linksIniciais);
  const [gerado, setGerado] = useState<string | null>(null);

  const sugestoes = useMemo(() => (busca.length < 2 ? [] : produtos.filter((p) => `${p.nome} ${p.marca}`.toLowerCase().includes(busca.toLowerCase())).slice(0, 5)), [busca]);
  const subtotal = itens.reduce((s, i) => s + i.p.preco * i.qtd, 0);
  const total = Math.round(subtotal * (1 - desconto / 100));
  const maxParcelas = parcelasPermitidas(total);
  const n = Math.min(parcelas, maxParcelas);

  const adicionar = (p: Produto) => {
    const v = p.variacoes.find((x) => x.estoque > 0) ?? p.variacoes[0];
    setItens([...itens, { p, sku: v.sku, rotulo: `${v.tamanho} · ${v.cor}`, qtd: 1 }]);
    setBusca("");
  };

  const gerar = () => {
    // Protótipo: token previsível. Na plataforma, token aleatório gerado no servidor.
    const token = `novo${lista.length + 1}`;
    setLista([
      { token, cliente: cliente || "Cliente", vendedor: "Você", itens: itens.map((i) => i.p.nome).join(" + "), total, parcelas: n, status: "ativo", validade: "27/11 18:00", criado: "25/11 14:00" },
      ...lista,
    ]);
    setGerado(token);
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[1.1fr_1fr]">
      <Card titulo="Novo link de pagamento">
        <p className="-mt-2 mb-4 text-sm text-muted">Monte o pedido com os itens reais do catálogo. O link abre o checkout da loja, com antifraude, 3DS e baixa de estoque.</p>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Produtos</span>
          <div className="relative">
            <span className="flex h-11 items-center gap-2 rounded-xl bg-white px-3 ring-1 ring-black/10 focus-within:ring-ink">
              <Icon name="search" className="size-4 text-faint" />
              <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar produto ou SKU…" className="flex-1 bg-transparent text-sm outline-none" />
            </span>
            {sugestoes.length > 0 && (
              <ul className="glass-strong absolute inset-x-0 top-[calc(100%+6px)] z-10 rounded-2xl p-1.5">
                {sugestoes.map((p) => (
                  <li key={p.id}>
                    <button type="button" onClick={() => adicionar(p)} className="flex w-full items-center gap-3 rounded-xl p-2 text-left text-sm hover:bg-snow">
                      <ProductArt kind={p.art} color={p.cores[0].hex} className="size-9" />
                      <span className="flex-1 font-medium">{p.nome}</span>
                      <span className="font-semibold tabular">{reais(p.preco)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </label>

        <ul className="mt-3 space-y-2">
          {itens.length === 0 && <li className="rounded-2xl border border-dashed border-line-2 p-5 text-center text-sm text-muted">Nenhum item ainda. Busque acima — ex.: “Big Wheel”.</li>}
          {itens.map((i, idx) => (
            <li key={idx} className="tile flex items-center gap-3 p-2.5">
              <span className="grid size-11 place-items-center rounded-xl bg-snow">
                <ProductArt kind={i.p.art} color={i.p.cores[0].hex} className="size-10" />
              </span>
              <span className="min-w-0 flex-1 text-sm">
                <span className="block truncate font-semibold">{i.p.nome}</span>
                <select
                  className="mt-0.5 rounded-md bg-transparent text-xs text-muted"
                  value={i.sku}
                  onChange={(e) => {
                    const v = i.p.variacoes.find((x) => x.sku === e.target.value)!;
                    setItens(itens.map((x, j) => (j === idx ? { ...x, sku: v.sku, rotulo: `${v.tamanho} · ${v.cor}` } : x)));
                  }}
                  aria-label="Variação"
                >
                  {i.p.variacoes.map((v) => (
                    <option key={v.sku} value={v.sku} disabled={v.estoque === 0}>
                      {v.tamanho} · {v.cor} ({v.estoque} em estoque)
                    </option>
                  ))}
                </select>
              </span>
              <span className="font-semibold tabular">{reais(i.p.preco)}</span>
              <button onClick={() => setItens(itens.filter((_, j) => j !== idx))} className="grid size-8 place-items-center rounded-full hover:bg-white" aria-label="Remover">
                <Icon name="close" className="size-4" />
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Cliente (nome e WhatsApp)</span>
            <input value={cliente} onChange={(e) => setCliente(e.target.value)} placeholder="Ex.: Rodrigo · (48) 9…" className="h-11 w-full rounded-xl bg-white px-3 text-sm ring-1 ring-black/10 outline-none focus:ring-ink" />
          </label>
          <label className="block">
            <span className="mb-1.5 flex justify-between text-sm font-medium">
              Desconto <span className="text-xs text-muted">limite do seu perfil: {LIMITE_DESCONTO}%</span>
            </span>
            <input
              type="range"
              min={0}
              max={LIMITE_DESCONTO}
              step={0.5}
              value={desconto}
              onChange={(e) => setDesconto(Number(e.target.value))}
              className="mt-3 w-full accent-[var(--color-red)]"
              aria-label="Desconto"
            />
            <span className="text-xs text-muted tabular">{desconto}%</span>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Parcelas máximas</span>
            <select value={parcelas} onChange={(e) => setParcelas(Number(e.target.value))} className="h-11 w-full rounded-xl bg-white px-3 text-sm ring-1 ring-black/10">
              {[1, 3, 6, 10, 12, 18, 21].map((x) => (
                <option key={x} value={x}>
                  até {x}x
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Validade</span>
            <select className="h-11 w-full rounded-xl bg-white px-3 text-sm ring-1 ring-black/10">
              <option>48 horas</option>
              <option>24 horas</option>
              <option>7 dias</option>
            </select>
          </label>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-4 rounded-2xl bg-snow p-4 ring-1 ring-black/5">
          <div className="flex-1">
            <p className="text-sm text-muted">Total do link</p>
            <p className="text-2xl font-bold tabular">{reais(total)}</p>
            {total > 0 && (
              <p className="text-sm text-muted">
                até {n}x de {reais(valorParcela(total, n))} sem juros
              </p>
            )}
          </div>
          <Botao disabled={itens.length === 0} onClick={gerar} className="h-12 px-6">
            <Icon name="link" className="size-4" /> Gerar link
          </Botao>
        </div>

        {gerado && (
          <div className="rise mt-4 rounded-2xl bg-ok-50 p-4">
            <p className="text-sm font-semibold text-ok">Link criado · uso único · estoque reservado por 48 h</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <code className="flex-1 truncate rounded-xl bg-white px-3 py-2 text-sm">shopbike.com.br/pagar/{gerado}</code>
              <Botao tom="ghost">
                <Icon name="copy" className="size-4" /> Copiar
              </Botao>
              <Botao tom="ink">
                <Icon name="whatsapp" className="size-4" /> Enviar no WhatsApp
              </Botao>
            </div>
          </div>
        )}
      </Card>

      <Card titulo="Links recentes" ferramentas={<span className="text-sm text-muted">{lista.length}</span>}>
        <ul className="space-y-2">
          {lista.map((l) => (
            <li key={l.token} className="tile p-3.5">
              <div className="flex items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-ink text-sm font-bold text-white">{l.vendedor[0]}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{l.cliente}</span>
                    <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", statusLink[l.status][1])}>{statusLink[l.status][0]}</span>
                  </div>
                  <p className="truncate text-sm text-muted">{l.itens}</p>
                  <p className="mt-1 text-xs text-faint">
                    {l.vendedor} · criado {l.criado} · válido até {l.validade}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold tabular">{reais(l.total)}</p>
                  <p className="text-xs text-muted">até {l.parcelas}x</p>
                </div>
              </div>
              {(l.status === "ativo" || l.status === "em_uso") && (
                <div className="mt-3 flex gap-2 border-t border-black/5 pt-3">
                  <Link href={`/pagar/${l.token}`} className="inline-flex h-8 items-center gap-1.5 rounded-full bg-white px-3 text-xs font-semibold ring-1 ring-black/10">
                    <Icon name="eye" className="size-3.5" /> Ver como cliente
                  </Link>
                  <button className="inline-flex h-8 items-center gap-1.5 rounded-full bg-white px-3 text-xs font-semibold ring-1 ring-black/10">
                    <Icon name="whatsapp" className="size-3.5" /> Reenviar
                  </button>
                  <button className="ml-auto inline-flex h-8 items-center rounded-full px-3 text-xs font-semibold text-danger">Cancelar</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
