"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { produtos, type Produto } from "@/mock/catalogo";
import { links as linksIniciais, type LinkPagamento } from "@/mock/operacao";
import { cn, reais } from "@/lib/format";
import { parcelasPermitidas, valorParcela } from "@/modules/precos/parcelamento";
import { Icon } from "@/ui/icons";
import { ProductArt } from "@/ui/product-art";
import { Abas, useAviso } from "@/ui/painel/controles";
import { Botao, Card, Chip, plural, type Tom } from "@/ui/painel/ui";

type Item = { p: Produto; sku: string; rotulo: string; qtd: number };
/** Item avulso: descrição e valor digitados, sem catálogo. Não baixa estoque. */
type Avulso = { descricao: string; valor: number };

/** "R$" enquanto digita: só números, lidos como centavos (1990 → 19,90). */
const centavosDe = (v: string) => Number(v.replace(/\D/g, "").slice(0, 9) || "0");

const LIMITE_DESCONTO = 5; // % do perfil Vendedor (protótipo)
const PASSO_DESCONTO = 0.5;

/* Ativo = aguardando o cliente (azul) · em andamento = alerta · pago = verde · expirado/cancelado = neutro */
const statusLink: Record<LinkPagamento["status"], [string, Tom]> = {
  ativo: ["Ativo", "info"],
  em_uso: ["Pagamento em andamento", "warn"],
  pago: ["Pago", "ok"],
  expirado: ["Expirado", "apagado"],
  cancelado: ["Cancelado", "apagado"],
};

const filtrosLista = ["Ativos", "Todos"] as const;
const ativo = (l: LinkPagamento) => l.status === "ativo" || l.status === "em_uso";

/** Iniciais da pessoa cujo nome está ao lado (cliente), não do vendedor. */
const iniciais = (nome: string) =>
  nome
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .filter((_, i, a) => i === 0 || i === a.length - 1)
    .join("")
    .toUpperCase();

/** Máscara (48) 99999-9999 / (48) 9999-9999. */
function mascaraWhats(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

const estoqueTotal = (p: Produto) => p.variacoes.reduce((s, v) => s + v.estoque, 0);
const pct = (n: number) => n.toLocaleString("pt-BR", { maximumFractionDigits: 1 });

export function Links() {
  const [busca, setBusca] = useState("");
  const [ativoIdx, setAtivoIdx] = useState(0);
  const [itens, setItens] = useState<Item[]>([]);
  const [desconto, setDesconto] = useState(0);
  const [parcelas, setParcelas] = useState(21);
  const [nome, setNome] = useState("");
  const [whats, setWhats] = useState("");
  const [avulsos, setAvulsos] = useState<Avulso[]>([]);
  const [formAvulso, setFormAvulso] = useState(false);
  const [descAvulso, setDescAvulso] = useState("");
  const [valorAvulso, setValorAvulso] = useState(0);
  const [lista, setLista] = useState(linksIniciais);
  const [filtro, setFiltro] = useState<(typeof filtrosLista)[number]>("Ativos");
  const [gerado, setGerado] = useState<string | null>(null);
  const { avisar, aviso } = useAviso();

  const sugestoes = useMemo(() => (busca.length < 2 ? [] : produtos.filter((p) => `${p.nome} ${p.marca}`.toLowerCase().includes(busca.toLowerCase())).slice(0, 5)), [busca]);
  const subtotal = itens.reduce((s, i) => s + i.p.preco * i.qtd, 0) + avulsos.reduce((s, a) => s + a.valor, 0);
  const semItens = itens.length === 0 && avulsos.length === 0;
  const total = Math.round(subtotal * (1 - desconto / 100));
  const maxParcelas = parcelasPermitidas(total);
  const n = Math.min(parcelas, maxParcelas);
  const whatsOk = whats.replace(/\D/g, "").length >= 10;

  // O que falta para gerar o link (texto ao lado do botão desabilitado)
  // WhatsApp é opcional: sem ele, o vendedor copia o link e manda por onde quiser.
  const falta = [semItens && "um produto ou item avulso", !nome.trim() && "o nome do cliente"].filter(Boolean) as string[];
  const faltaTxt = falta.length ? `Adicione ${falta.length > 1 ? falta.slice(0, -1).join(", ") + " e " + falta.at(-1) : falta[0]} para gerar o link.` : "";

  const visiveis = filtro === "Ativos" ? lista.filter(ativo) : lista;

  const adicionarAvulso = () => {
    if (!descAvulso.trim() || valorAvulso <= 0) return;
    setAvulsos([...avulsos, { descricao: descAvulso.trim(), valor: valorAvulso }]);
    setDescAvulso("");
    setValorAvulso(0);
    setFormAvulso(false);
  };

  const adicionar = (p: Produto) => {
    const v = p.variacoes.find((x) => x.estoque > 0) ?? p.variacoes[0];
    setItens([...itens, { p, sku: v.sku, rotulo: `${v.tamanho} · ${v.cor}`, qtd: 1 }]);
    setBusca("");
    setAtivoIdx(0);
  };

  const ajustarDesconto = (v: number) => setDesconto(Math.min(LIMITE_DESCONTO, Math.max(0, Math.round(v / PASSO_DESCONTO) * PASSO_DESCONTO)));

  const gerar = () => {
    // Protótipo: token previsível. Na plataforma, token aleatório gerado no servidor.
    const token = `novo${lista.length + 1}`;
    setLista([
      { token, cliente: nome.trim(), vendedor: "Você", itens: [...itens.map((i) => i.p.nome), ...avulsos.map((a) => a.descricao)].join(" + "), total, parcelas: n, status: "ativo", validade: "27/11, 18:00", criado: "25/11, 14:00" },
      ...lista,
    ]);
    setGerado(token);
  };

  const copiar = async (texto: string) => {
    try {
      await navigator.clipboard.writeText(texto);
      avisar("Link copiado");
    } catch {
      avisar("Não foi possível copiar: selecione o link e use Ctrl C");
    }
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[1.1fr_1fr]">
      <Card titulo="Novo link de pagamento">
        <p className="-mt-2 mb-4 text-sm text-muted">Monte o pedido com os itens reais do catálogo. O link abre o checkout da loja, com antifraude, 3DS e baixa de estoque.</p>

        <div>
          <label htmlFor="busca-produto" className="mb-1.5 block text-sm font-medium">
            Produtos
          </label>
          <div className="flex gap-2">
          <div className="relative min-w-0 flex-1">
            <span className="campo flex h-11 items-center gap-2 rounded-xl px-3">
              <Icon name="search" className="size-4 text-faint" />
              <input
                id="busca-produto"
                value={busca}
                onChange={(e) => {
                  setBusca(e.target.value);
                  setAtivoIdx(0);
                }}
                onKeyDown={(e) => {
                  if (!sugestoes.length) return;
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setAtivoIdx((i) => (i + 1) % sugestoes.length);
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setAtivoIdx((i) => (i - 1 + sugestoes.length) % sugestoes.length);
                  } else if (e.key === "Enter") {
                    e.preventDefault();
                    adicionar(sugestoes[ativoIdx]);
                  } else if (e.key === "Escape") setBusca("");
                }}
                placeholder="Buscar produto ou SKU…"
                className="flex-1 bg-transparent text-sm font-medium"
                role="combobox"
                aria-expanded={sugestoes.length > 0}
                aria-controls="sugestoes-produto"
                aria-activedescendant={sugestoes.length ? `sug-${sugestoes[ativoIdx]?.id}` : undefined}
              />
            </span>
            {sugestoes.length > 0 && (
              <ul id="sugestoes-produto" role="listbox" className="absolute inset-x-0 top-[calc(100%+6px)] z-10 rounded-[var(--radius-tile)] bg-paper p-1.5 shadow-[0_12px_32px_-12px_rgb(26_25_23/0.35)] ring-1 ring-line">
                {sugestoes.map((p, i) => {
                  const est = estoqueTotal(p);
                  return (
                    <li key={p.id} id={`sug-${p.id}`} role="option" aria-selected={i === ativoIdx}>
                      <button
                        type="button"
                        onMouseEnter={() => setAtivoIdx(i)}
                        onClick={() => adicionar(p)}
                        className={cn("flex h-12 w-full items-center gap-3 rounded-lg px-2 text-left text-sm", i === ativoIdx && "bg-fundo-painel")}
                      >
                        <ProductArt kind={p.art} color={p.cores[0].hex} className="size-9" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-medium">{p.nome}</span>
                          <span className={cn("block text-xs", est ? "text-muted" : "text-danger")}>{est ? `${est} em estoque` : "Sem estoque"}</span>
                        </span>
                        <span className="font-semibold tabular">{reais(p.preco)}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          {/* Avulso: cobra algo fora do catálogo sem precisar buscar produto */}
          <Botao tom="ghost" aria-expanded={formAvulso} onClick={() => setFormAvulso((v) => !v)} className="h-11 shrink-0 rounded-xl" title="Cobrar um valor sem produto do catálogo">
            <Icon name="plus" className="size-4" /> Item avulso
          </Botao>
          </div>

          {formAvulso && (
            <div className="rise mt-2 rounded-[var(--radius-tile)] bg-snow p-3 ring-1 ring-line">
              <div className="flex flex-wrap items-end gap-2">
                <label className="block min-w-[200px] flex-1">
                  <span className="mb-1 block text-xs font-medium text-muted">Descrição</span>
                  <input
                    autoFocus
                    value={descAvulso}
                    onChange={(e) => setDescAvulso(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && adicionarAvulso()}
                    placeholder="Ex.: Revisão completa, montagem, frete especial"
                    className="campo h-11 w-full rounded-xl px-3 text-sm"
                  />
                </label>
                <label className="block w-36">
                  <span className="mb-1 block text-xs font-medium text-muted">Valor</span>
                  <input
                    inputMode="numeric"
                    value={valorAvulso ? reais(valorAvulso) : ""}
                    onChange={(e) => setValorAvulso(centavosDe(e.target.value))}
                    onKeyDown={(e) => e.key === "Enter" && adicionarAvulso()}
                    placeholder="R$ 0,00"
                    className="campo h-11 w-full rounded-xl px-3 text-right text-sm tabular"
                  />
                </label>
                <Botao onClick={adicionarAvulso} disabled={!descAvulso.trim() || valorAvulso <= 0} className="h-11 rounded-xl">
                  Adicionar
                </Botao>
              </div>
              <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-warn">
                <Icon name="info" className="size-3.5 shrink-0" /> Item avulso não baixa estoque. Para peças e bikes, prefira buscar o produto.
              </p>
            </div>
          )}
        </div>

        <ul className="mt-3 space-y-2">
          {semItens && <li className="rounded-[var(--radius-tile)] border border-dashed border-line-2 p-5 text-center text-sm text-muted">Nenhum item ainda. Busque acima — ex.: “Big Wheel” — ou adicione um item avulso.</li>}
          {avulsos.map((a, idx) => (
            <li key={`avulso-${idx}`} className="tile flex items-center gap-3 p-2.5">
              <span className="grid size-11 place-items-center rounded-lg bg-white text-muted">
                <Icon name="tag" className="size-5" />
              </span>
              <span className="min-w-0 flex-1 text-sm">
                <span className="block truncate font-semibold">{a.descricao}</span>
                <span className="text-xs text-muted">Avulso · não baixa estoque</span>
              </span>
              <span className="font-semibold tabular">{reais(a.valor)}</span>
              <button onClick={() => setAvulsos(avulsos.filter((_, j) => j !== idx))} className="grid size-8 place-items-center rounded-full hover:bg-white" aria-label={`Remover ${a.descricao}`}>
                <Icon name="close" className="size-4" />
              </button>
            </li>
          ))}
          {itens.map((i, idx) => (
            <li key={idx} className="tile flex items-center gap-3 p-2.5">
              <span className="grid size-11 place-items-center rounded-lg bg-white">
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
              <button onClick={() => setItens(itens.filter((_, j) => j !== idx))} className="grid size-8 place-items-center rounded-full hover:bg-white" aria-label={`Remover ${i.p.nome}`}>
                <Icon name="close" className="size-4" />
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Nome do cliente</span>
            <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex.: Rodrigo Mendes" autoComplete="off" className="campo h-11 w-full rounded-xl px-3 text-sm" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">
              WhatsApp <span className="font-normal text-muted">(opcional)</span>
            </span>
            <input
              value={whats}
              onChange={(e) => setWhats(mascaraWhats(e.target.value))}
              placeholder="(48) 99999-9999"
              inputMode="tel"
              autoComplete="off"
              className="campo h-11 w-full rounded-xl px-3 text-sm tabular"
            />
          </label>

          <div>
            <span className="mb-1.5 flex items-baseline justify-between text-sm font-medium">
              <label htmlFor="desconto">Desconto</label>
              <span className="text-xs text-muted">limite do seu perfil: {LIMITE_DESCONTO}%</span>
            </span>
            {/* campo numérico com −/+ (passo de 0,5%): preciso, sem slider */}
            <div className="campo flex h-11 w-full items-center rounded-xl">
              <button type="button" onClick={() => ajustarDesconto(desconto - PASSO_DESCONTO)} disabled={desconto <= 0} className="grid size-11 place-items-center rounded-l-xl text-ink hover:bg-snow disabled:text-faint" aria-label="Diminuir desconto">
                <Icon name="minus" className="size-4" />
              </button>
              <input
                id="desconto"
                inputMode="decimal"
                value={pct(desconto)}
                onChange={(e) => {
                  const v = Number(e.target.value.replace(",", ".").replace(/[^\d.]/g, ""));
                  if (!Number.isNaN(v)) ajustarDesconto(v);
                }}
                className="w-full min-w-0 flex-1 bg-transparent text-center text-sm font-semibold tabular"
                aria-describedby="desconto-ajuda"
              />
              <span className="pr-1 text-sm text-muted">%</span>
              <button type="button" onClick={() => ajustarDesconto(desconto + PASSO_DESCONTO)} disabled={desconto >= LIMITE_DESCONTO} className="grid size-11 place-items-center rounded-r-xl text-ink hover:bg-snow disabled:text-faint" aria-label="Aumentar desconto">
                <Icon name="plus" className="size-4" />
              </button>
            </div>
            <span id="desconto-ajuda" className="mt-1 block text-xs text-muted">
              Passos de 0,5%{desconto > 0 && subtotal > 0 ? ` · −${reais(subtotal - total)}` : ""}
            </span>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Parcelas máximas</span>
            <select value={parcelas} onChange={(e) => setParcelas(Number(e.target.value))} className="campo h-11 w-full rounded-xl px-3 text-sm">
              {[1, 3, 6, 10, 12, 18, 21].map((x) => (
                <option key={x} value={x}>
                  até {x}x
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Validade</span>
            <select className="campo h-11 w-full rounded-xl px-3 text-sm">
              <option>48 horas</option>
              <option>24 horas</option>
              <option>7 dias</option>
            </select>
          </label>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-4 rounded-[var(--radius-card)] bg-snow p-4 ring-1 ring-line">
          <div className="min-w-[180px] flex-1">
            <p className="text-sm text-muted">Total do link</p>
            <p className="text-2xl font-bold tabular">{reais(total)}</p>
            {total > 0 && (
              <p className="text-sm text-muted">
                até {n}x de {reais(valorParcela(total, n))} sem juros
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <Botao disabled={falta.length > 0} onClick={gerar} className="h-12 px-6" aria-describedby="gerar-ajuda">
              <Icon name="link" className="size-4" /> Gerar link
            </Botao>
            {faltaTxt && (
              <p id="gerar-ajuda" className="max-w-[240px] text-right text-xs text-muted">
                {faltaTxt}
              </p>
            )}
          </div>
        </div>

        {gerado && (
          <div className="rise mt-4 rounded-[var(--radius-card)] bg-ok-50 p-4">
            <p className="text-sm font-semibold text-ok">Link criado · uso único · estoque reservado por 48 h</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <code className="flex-1 truncate rounded-xl bg-white px-3 py-2 text-sm">shopbike.com.br/pagar/{gerado}</code>
              <Botao tom="ghost" onClick={() => copiar(`https://shopbike.com.br/pagar/${gerado}`)}>
                <Icon name="copy" className="size-4" /> Copiar
              </Botao>
              {whatsOk && (
                <Botao tom="ink" onClick={() => avisar(`Link enviado no WhatsApp para ${whats}`)}>
                  <Icon name="whatsapp" className="size-4" /> Enviar no WhatsApp
                </Botao>
              )}
            </div>
          </div>
        )}
      </Card>

      <Card titulo="Links recentes" ferramentas={<Abas abas={filtrosLista} ativa={filtro} onChange={setFiltro} contagem={{ Ativos: lista.filter(ativo).length, Todos: lista.length }} />}>
        <ul className="space-y-2">
          {visiveis.length === 0 && <li className="rounded-[var(--radius-tile)] border border-dashed border-line-2 p-5 text-center text-sm text-muted">Nenhum link ativo agora.</li>}
          {visiveis.map((l) => (
            <li key={l.token} className="tile p-3.5">
              <div className="flex items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-cloud text-xs font-bold text-ink-2" aria-hidden>
                  {iniciais(l.cliente)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{l.cliente}</span>
                    <Chip tom={statusLink[l.status][1]}>{statusLink[l.status][0]}</Chip>
                  </div>
                  <p className="truncate text-sm text-muted">{l.itens}</p>
                  <p className="mt-1 text-xs text-muted">
                    {l.vendedor} · criado {l.criado} · válido até {l.validade}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold tabular">{reais(l.total)}</p>
                  <p className="text-xs text-muted">até {l.parcelas}x</p>
                </div>
              </div>
              {ativo(l) && (
                <div className="mt-3 flex gap-2 border-t border-line pt-3">
                  <Link href={`/pagar/${l.token}`} className="inline-flex h-8 items-center gap-1.5 rounded-full bg-white px-3 text-[13px] font-semibold ring-1 ring-line hover:bg-snow">
                    <Icon name="eye" className="size-3.5" /> Ver como cliente
                  </Link>
                  <button onClick={() => avisar(`Link reenviado no WhatsApp para ${l.cliente}`)} className="inline-flex h-8 items-center gap-1.5 rounded-full bg-white px-3 text-[13px] font-semibold ring-1 ring-line hover:bg-snow">
                    <Icon name="whatsapp" className="size-3.5" /> Reenviar
                  </button>
                  <button
                    onClick={() => {
                      setLista((ls) => ls.map((x) => (x.token === l.token ? { ...x, status: "cancelado" } : x)));
                      avisar(`Link de ${l.cliente} cancelado · reserva de estoque liberada`);
                    }}
                    className="ml-auto inline-flex h-8 items-center rounded-full px-3 text-[13px] font-semibold text-danger hover:bg-danger-50"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted">{plural(lista.filter(ativo).length, "link ativo", "links ativos")} de {lista.length}</p>
      </Card>
      {aviso}
    </div>
  );
}
