"use client";

import Link from "next/link";
import { useState } from "react";
import { expedicao } from "@/mock/painel";
import { cn } from "@/lib/format";
import { Icon } from "@/ui/icons";
import { useAviso } from "@/ui/painel/controles";
import { BarraLote, Botao, Chip, plural, pontoSignificado, type Significado } from "@/ui/painel/ui";

/* Cor de cada etapa vem do mapa único de significado (o mesmo dos status de pedido):
   em andamento = azul, esperando terceiro = âmbar, etapa interna = cinza, pronto = preto. */
const etapas: { id: Etapa; titulo: string; sub: string; significado: Significado }[] = [
  { id: "Separar", titulo: "Separar", sub: "Pagos e aprovados no antifraude", significado: "info" },
  { id: "Aguardando NF", titulo: "Aguardando NF", sub: "Aguardando a nota fiscal da Bruning", significado: "alerta" },
  { id: "Etiqueta", titulo: "Etiqueta", sub: "Nota emitida, falta etiqueta", significado: "neutro" },
  { id: "Pronto", titulo: "Pronto", sub: "Embalado, aguardando coleta ou retirada", significado: "destaque" },
  { id: "Enviado", titulo: "Enviado", sub: "Em trânsito, rastreio automático", significado: "info" },
];

type Etapa = "Separar" | "Aguardando NF" | "Etiqueta" | "Pronto" | "Enviado";
type CardExp = { pedido: string; cliente: string; itens: number; envio: string; etapa: Etapa; nf: boolean; obs?: string; rastreio?: string };

/** Quantos cards cada coluna mostra antes do "+N pedidos". */
const LIMITE = 5;

const proxima: Record<Etapa, { para: Etapa; rotulo: string } | null> = {
  Separar: { para: "Aguardando NF", rotulo: "Marcar separado" },
  "Aguardando NF": null,
  Etiqueta: { para: "Pronto", rotulo: "Imprimir etiqueta" },
  Pronto: { para: "Enviado", rotulo: "Despachar" },
  Enviado: null,
};

export function QuadroExpedicao() {
  const [cards, setCards] = useState<CardExp[]>(expedicao.map((e) => ({ ...e })) as CardExp[]);
  const [sel, setSel] = useState<string[]>([]);
  const [abertas, setAbertas] = useState<Etapa[]>([]);
  const { avisar, aviso } = useAviso();

  const mover = (ids: string[], para: Etapa, msg: string) => {
    setCards((cs) => cs.map((c) => (ids.includes(c.pedido) ? { ...c, etapa: para, rastreio: para === "Enviado" ? (c.rastreio ?? "QB1200" + c.pedido + "BR") : c.rastreio } : c)));
    setSel((s) => s.filter((x) => !ids.includes(x)));
    avisar(msg);
  };
  const copiar = async (codigo: string) => {
    try {
      await navigator.clipboard.writeText(codigo);
      avisar(`Rastreio ${codigo} copiado`);
    } catch {
      avisar("Não foi possível copiar: selecione o código e use Ctrl C");
    }
  };
  const etiquetas = cards.filter((c) => c.etapa === "Etiqueta" && sel.includes(c.pedido));
  const correios = cards.filter((c) => c.etapa === "Pronto" && /PAC|Sedex/.test(c.envio)).length;

  return (
    <>
      <p className="-mt-2 mb-3 flex items-center gap-1.5 text-sm font-medium text-muted">
        <Icon name="info" className="size-3.5 shrink-0" />
        Pedidos em análise no antifraude não aparecem aqui: nada é despachado antes da aprovação.
      </p>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Botao tom="ghost" onClick={() => avisar("Lista de separação gerada (PDF)")}>
          <Icon name="doc" className="size-4" /> Lista de separação
        </Botao>
        <Botao tom="ghost" onClick={() => avisar(`PLP dos Correios gerada com ${plural(correios, "objeto", "objetos")}`)}>
          <Icon name="box" className="size-4" /> Gerar PLP Correios
        </Botao>
      </div>

      <div className="scrollbar-none -mx-1 flex items-start gap-3 overflow-x-auto px-1 pb-2 xl:grid xl:grid-cols-5 xl:overflow-visible">
        {etapas.map((e) => {
          const lista = cards.filter((c) => c.etapa === e.id);
          const aberta = abertas.includes(e.id);
          const visiveis = aberta ? lista : lista.slice(0, LIMITE);
          const resto = lista.length - visiveis.length;
          return (
            <section key={e.id} aria-labelledby={`col-${e.id}`} className="glass flex min-h-60 w-[272px] shrink-0 flex-col rounded-[var(--radius-card)] p-3 xl:w-auto">
              <header className="px-1 pt-0.5 pb-3">
                <div className="flex items-center gap-2">
                  <span className={cn("size-2 shrink-0 rounded-full", pontoSignificado[e.significado])} aria-hidden />
                  <h2 id={`col-${e.id}`} className="text-base font-bold">
                    {e.titulo}
                  </h2>
                  <span className="ml-auto rounded-full bg-snow px-2 py-0.5 text-xs font-bold ring-1 ring-line tabular" aria-label={plural(lista.length, "pedido", "pedidos")}>
                    {lista.length}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-muted">{e.sub}</p>
              </header>

              <ul
                className={cn(
                  "flex flex-col gap-2",
                  aberta && lista.length > LIMITE && "fila-scroll -mr-1.5 max-h-[60dvh] overflow-y-auto pr-1.5 pb-6 [mask-image:linear-gradient(to_bottom,black_calc(100%-24px),transparent)]",
                )}
              >
                {visiveis.map((c) => {
                  const prox = proxima[c.etapa];
                  const marcado = sel.includes(c.pedido);
                  return (
                    <li key={c.pedido} className={cn("rounded-[var(--radius-tile)] bg-snow p-3 ring-1 transition", marcado ? "ring-2 ring-ink" : "ring-line")}>
                      <div className="flex items-start gap-2">
                        {c.etapa === "Etiqueta" && (
                          <label className="-m-1.5 grid size-8 shrink-0 cursor-pointer place-items-center" title="Selecionar para imprimir em lote">
                            <input
                              type="checkbox"
                              aria-label={`Selecionar pedido ${c.pedido} para impressão em lote`}
                              checked={marcado}
                              onChange={(ev) => setSel((s) => (ev.target.checked ? [...s, c.pedido] : s.filter((x) => x !== c.pedido)))}
                              className="size-[18px] cursor-pointer accent-[var(--color-ink)]"
                            />
                          </label>
                        )}
                        <div className="min-w-0 flex-1">
                          <Link href={`/admin/pedidos?pedido=${c.pedido}`} className="text-base font-bold tabular underline-offset-4 hover:underline">
                            #{c.pedido}
                          </Link>
                          <p className="truncate text-sm">{c.cliente}</p>
                        </div>
                        <span className="pt-1 text-xs whitespace-nowrap text-muted">{plural(c.itens, "item", "itens")}</span>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <Chip>
                          <Icon name={c.envio === "Retirada na loja" ? "store" : "truck"} className="size-3.5" /> {c.envio}
                        </Chip>
                        <Chip tom={c.nf ? "ok" : "warn"}>{c.nf ? "NF ok" : "Sem NF"}</Chip>
                      </div>

                      {/* Orientação = âmbar com ícone de info (erro seria vermelho escuro com alerta) */}
                      {c.obs && (
                        <p className="mt-2 flex items-start gap-1.5 rounded-[var(--radius-tile)] bg-warn-50 px-2.5 py-2 text-xs font-semibold text-warn">
                          <Icon name="info" className="mt-px size-3.5 shrink-0" /> {c.obs}
                        </p>
                      )}

                      {c.rastreio && (
                        <button
                          onClick={() => copiar(c.rastreio!)}
                          title="Copiar código de rastreio"
                          className="-mx-1.5 mt-1.5 inline-flex h-8 items-center gap-1.5 rounded-full px-1.5 text-xs font-semibold text-ink hover:bg-white"
                        >
                          <span className="text-muted">Rastreio</span>
                          <span className="tabular">{c.rastreio}</span>
                          <Icon name="copy" className="size-3.5" />
                        </button>
                      )}

                      {c.etapa === "Aguardando NF" && (
                        <div className="mt-2.5">
                          <span className="mb-1 inline-block rounded-full bg-info-50 px-2 py-0.5 text-xs font-semibold text-info">Simulação · só no protótipo</span>
                          <Botao tom="ghost" tamanho="card" className="w-full" onClick={() => mover([c.pedido], "Etiqueta", `NF recebida da Bruning para #${c.pedido} (simulado)`)}>
                            Simular NF recebida
                          </Botao>
                        </div>
                      )}

                      {prox && (
                        <Botao
                          tamanho="card"
                          className="mt-2.5 w-full"
                          onClick={() => mover([c.pedido], prox.para, c.etapa === "Etiqueta" ? `Etiqueta de #${c.pedido} impressa` : `#${c.pedido}: ${prox.rotulo.toLowerCase()}`)}
                        >
                          {c.envio === "Retirada na loja" && c.etapa === "Pronto" ? "Entregue ao titular" : prox.rotulo} <Icon name="chevronRight" className="size-3.5" />
                        </Botao>
                      )}
                    </li>
                  );
                })}
                {lista.length === 0 && <li className="rounded-[var(--radius-tile)] border border-dashed border-line-2 p-4 text-center text-xs text-muted">Nenhum pedido nesta etapa</li>}
              </ul>

              {lista.length > LIMITE && (
                <button
                  onClick={() => setAbertas((a) => (aberta ? a.filter((x) => x !== e.id) : [...a, e.id]))}
                  className="mt-2 h-8 rounded-full text-sm font-semibold text-ink hover:bg-snow"
                >
                  {aberta ? "Mostrar menos" : `+${plural(resto, "pedido", "pedidos")}`}
                </button>
              )}
            </section>
          );
        })}
      </div>

      {etiquetas.length > 0 && (
        <BarraLote
          texto={plural(etiquetas.length, "etiqueta selecionada", "etiquetas selecionadas")}
          acoes={[
            {
              rotulo: `Imprimir etiquetas (${etiquetas.length})`,
              icone: "doc",
              onClick: () => mover(etiquetas.map((c) => c.pedido), "Pronto", `${plural(etiquetas.length, "etiqueta impressa", "etiquetas impressas")}`),
            },
          ]}
          limpar={() => setSel([])}
        />
      )}
      {aviso}
    </>
  );
}
