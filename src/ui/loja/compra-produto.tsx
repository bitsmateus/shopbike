"use client";

import { useMemo, useState } from "react";
import type { Produto } from "@/mock/catalogo";
import { cn, reais } from "@/lib/format";
import { tabelaParcelas, precoAVista } from "@/modules/precos/parcelamento";
import { Icon } from "@/ui/icons";
import { ProductArt } from "@/ui/product-art";
import { useCarrinho } from "./carrinho";
import { Qtd } from "./mini-carrinho";
import { Preco } from "./preco";
import { Selo } from "./product-card";

export function CompraProduto({ p }: { p: Produto }) {
  const { adicionar } = useCarrinho();
  const [cor, setCor] = useState(p.cores[0].nome);
  const [tamanho, setTamanho] = useState<string | null>(p.tamanhos.length === 1 ? p.tamanhos[0] : null);
  const [qtd, setQtd] = useState(1);
  const [foto, setFoto] = useState(0);
  const [erro, setErro] = useState("");
  const [verParcelas, setVerParcelas] = useState(false);

  const hex = p.cores.find((c) => c.nome === cor)!.hex;
  const variacao = tamanho ? p.variacoes.find((v) => v.tamanho === tamanho && v.cor === cor) : undefined;
  const estoqueDoTamanho = (t: string) => p.variacoes.find((v) => v.tamanho === t && v.cor === cor)?.estoque ?? 0;
  const parcelas = useMemo(() => tabelaParcelas(p.preco, p.limiteParcelas), [p]);

  const comprar = () => {
    if (!tamanho) return setErro("Escolha o tamanho.");
    if (!variacao || variacao.estoque === 0) return setErro("Sem estoque nessa combinação.");
    setErro("");
    adicionar({ slug: p.slug, sku: variacao.sku, nome: p.nome, tamanho, cor, preco: p.preco, qtd });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:gap-12">
      {/* Galeria */}
      <div className="lg:sticky lg:top-[150px] lg:self-start">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-snow">
          <ProductArt key={`${cor}-${foto}`} kind={p.art} color={hex} angle={foto} className="rise size-full p-6" />
          <div className="absolute top-4 left-4 flex gap-1.5">
            {p.selos.map((s) => (
              <Selo key={s} texto={s} />
            ))}
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            <button className="grid size-10 place-items-center rounded-full bg-white ring-1 ring-line hover:ring-ink" aria-label="Favoritar">
              <Icon name="heart" className="size-5" />
            </button>
            <button className="grid size-10 place-items-center rounded-full bg-white ring-1 ring-line hover:ring-ink" aria-label="Compartilhar">
              <Icon name="send" className="size-5" />
            </button>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-4 gap-3">
          {[0, 1, 2, 3].map((i) => (
            <button
              key={i}
              onClick={() => setFoto(i)}
              aria-label={`Foto ${i + 1}`}
              aria-pressed={foto === i}
              className={cn("aspect-[4/3] overflow-hidden rounded-2xl bg-snow ring-2 transition", foto === i ? "ring-ink" : "ring-transparent hover:ring-line-2")}
            >
              <ProductArt kind={p.art} color={hex} angle={i} className="size-full p-1.5" />
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-faint">Ilustração do protótipo. Na plataforma, fotos reais com zoom e vídeo.</p>
      </div>

      {/* Compra */}
      <div>
        <div className="text-xs font-semibold tracking-[0.14em] text-faint uppercase">{p.marca}</div>
        <h1 className="mt-1.5 text-3xl leading-tight font-bold tracking-tight md:text-[34px]">{p.nome}</h1>
        <div className="mt-2 flex items-center gap-3 text-sm text-muted">
          <span className="inline-flex items-center gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <Icon key={i} name="star" className={cn("size-4", i < Math.round(p.avaliacao.nota) ? "fill-ink text-ink" : "text-line-2")} />
            ))}
            <span className="ml-1 font-semibold text-ink">{p.avaliacao.nota.toFixed(1)}</span>
          </span>
          <a href="#avaliacoes" className="underline-offset-2 hover:underline">
            {p.avaliacao.total} avaliações
          </a>
          <span>·</span>
          <span>Cód. {p.variacoes[0].sku.split("-")[0]}</span>
        </div>

        {p.seminova && (
          <div className="mt-4 rounded-2xl bg-snow p-4 text-sm">
            <div className="flex items-center gap-2 font-semibold">
              <Icon name="shield" className="size-5 text-ok" /> Seminova revisada · estado {p.seminova.estado.toLowerCase()}
            </div>
            <p className="mt-1 text-muted">{p.seminova.laudo}</p>
          </div>
        )}

        <div className="mt-5">
          <Preco preco={p.preco} precoDe={p.precoDe} limite={p.limiteParcelas} tamanho="lg" />
          <button onClick={() => setVerParcelas((v) => !v)} className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-ink-2 underline-offset-2 hover:underline">
            Ver todas as parcelas <Icon name="chevronDown" className={cn("size-4 transition", verParcelas && "rotate-180")} />
          </button>
          {verParcelas && (
            <div className="rise mt-3 grid grid-cols-2 gap-x-6 gap-y-1 rounded-2xl bg-snow p-4 text-sm tabular sm:grid-cols-3">
              <div className="col-span-full mb-1 font-semibold text-ok">Pix ou 1x no cartão: {reais(precoAVista(p.preco))}</div>
              {parcelas.map((x) => (
                <div key={x.parcelas} className="flex justify-between">
                  <span className="text-muted">{x.parcelas}x</span>
                  <span>{reais(x.valor)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-7 space-y-5">
          <div>
            <div className="mb-2 text-sm">
              Cor: <strong>{cor}</strong>
            </div>
            <div className="flex gap-2">
              {p.cores.map((c) => (
                <button
                  key={c.nome}
                  onClick={() => setCor(c.nome)}
                  aria-label={c.nome}
                  aria-pressed={cor === c.nome}
                  className={cn("grid size-11 place-items-center rounded-full ring-2 transition", cor === c.nome ? "ring-ink" : "ring-line hover:ring-line-2")}
                >
                  <span className="size-8 rounded-full ring-1 ring-black/10" style={{ background: c.hex }} />
                </button>
              ))}
            </div>
          </div>

          {p.tamanhos.length > 1 && (
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span>
                  Tamanho{p.categoria !== "vestuario" && p.categoria !== "acessorios" ? " do quadro" : ""}: <strong>{tamanho ?? "escolha"}</strong>
                </span>
                <a href="#tamanhos" className="inline-flex items-center gap-1 font-semibold text-red">
                  Qual é o meu tamanho?
                </a>
              </div>
              <div className="flex flex-wrap gap-2">
                {p.tamanhos.map((t) => {
                  const est = estoqueDoTamanho(t);
                  return (
                    <button
                      key={t}
                      disabled={est === 0}
                      onClick={() => {
                        setTamanho(t);
                        setErro("");
                      }}
                      aria-pressed={tamanho === t}
                      className={cn(
                        "h-11 min-w-14 rounded-full px-4 font-semibold ring-1 transition",
                        tamanho === t ? "bg-ink text-white ring-ink" : "ring-line-2 hover:ring-ink",
                        est === 0 && "cursor-not-allowed text-faint line-through opacity-60 hover:ring-line-2",
                      )}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="text-sm">
            {variacao ? (
              variacao.estoque > 0 ? (
                <span className="inline-flex items-center gap-1.5 font-semibold text-ok">
                  <span className="size-2 rounded-full bg-ok" />
                  {variacao.estoque === 1 ? "Última unidade" : variacao.estoque === 2 ? "Últimas 2 unidades" : "Em estoque"} · SKU {variacao.sku}
                </span>
              ) : (
                <span className="font-semibold text-red">Sem estoque nessa combinação</span>
              )
            ) : (
              <span className="text-muted">Escolha o tamanho para ver o estoque.</span>
            )}
          </div>

          {variacao && variacao.estoque === 0 ? (
            <button className="flex h-13 w-full items-center justify-center gap-2 rounded-full font-semibold ring-1 ring-ink">
              <Icon name="bell" className="size-5" /> Avise-me quando chegar
            </button>
          ) : (
            <div className="flex gap-3">
              <Qtd valor={qtd} onChange={(n) => setQtd(Math.max(1, n))} />
              <button onClick={comprar} className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-red font-semibold text-white transition hover:bg-red-600">
                <Icon name="cart" className="size-5" /> Adicionar ao carrinho
              </button>
            </div>
          )}
          {erro && (
            <p role="alert" className="text-sm font-semibold text-red">
              {erro}
            </p>
          )}
          <a href="https://wa.me/" className="flex h-12 w-full items-center justify-center gap-2 rounded-full font-semibold ring-1 ring-line-2 transition hover:ring-[#1f9d55]">
            <Icon name="whatsapp" className="size-5 text-[#1f9d55]" /> Comprar pelo WhatsApp
          </a>
        </div>

        <Frete />

        <ul className="mt-6 grid gap-3 text-sm text-muted sm:grid-cols-2">
          <li className="flex items-center gap-2">
            <Icon name="shield" className="size-5 text-ink" /> Garantia: {p.garantia}
          </li>
          <li className="flex items-center gap-2">
            <Icon name="store" className="size-5 text-ink" /> Retire grátis em Tubarão
          </li>
          <li className="flex items-center gap-2">
            <Icon name="wrench" className="size-5 text-ink" /> Montada e regulada pela oficina
          </li>
          <li className="flex items-center gap-2">
            <Icon name="lock" className="size-5 text-ink" /> Pagamento com 3D Secure
          </li>
        </ul>
      </div>
    </div>
  );
}

function Frete() {
  const [cep, setCep] = useState("");
  const [res, setRes] = useState<null | { nome: string; prazo: string; valor: number }[]>(null);
  const calcular = (e: React.FormEvent) => {
    e.preventDefault();
    const digitos = cep.replace(/\D/g, "");
    if (digitos.length !== 8) return;
    const sul = /^(8|9)/.test(digitos);
    setRes([
      { nome: "Retirada na loja (Tubarão)", prazo: "Hoje, após a montagem", valor: 0 },
      { nome: "Entrega ShopBike", prazo: "1 a 2 dias úteis", valor: digitos.startsWith("887") ? 0 : -1 },
      { nome: "PAC", prazo: sul ? "4 dias úteis" : "8 dias úteis", valor: sul ? 0 : 6_890 },
      { nome: "Sedex", prazo: sul ? "2 dias úteis" : "4 dias úteis", valor: sul ? 2_190 : 12_490 },
      { nome: "Jamef Econômico", prazo: sul ? "5 dias úteis" : "9 dias úteis", valor: sul ? 4_900 : 9_800 },
    ].filter((x) => x.valor >= 0));
  };
  return (
    <div className="mt-6 rounded-3xl p-4 ring-1 ring-line">
      <form onSubmit={calcular} className="flex items-center gap-2">
        <Icon name="truck" className="size-5 shrink-0" />
        <label className="sr-only" htmlFor="cep">
          CEP
        </label>
        <input
          id="cep"
          inputMode="numeric"
          value={cep}
          onChange={(e) => setCep(e.target.value.replace(/\D/g, "").slice(0, 8).replace(/^(\d{5})(\d)/, "$1-$2"))}
          placeholder="Calcule o frete: digite seu CEP"
          className="h-10 flex-1 rounded-full bg-snow px-4 text-sm outline-none focus:ring-1 focus:ring-line-2"
        />
        <button className="h-10 rounded-full bg-ink px-4 text-sm font-semibold text-white">Calcular</button>
      </form>
      {res && (
        <ul className="rise mt-3 divide-y divide-line text-sm">
          {res.map((r) => (
            <li key={r.nome} className="flex items-center justify-between py-2.5">
              <span>
                <span className="font-medium">{r.nome}</span>
                <span className="block text-xs text-muted">{r.prazo}</span>
              </span>
              <span className={cn("font-semibold tabular", r.valor === 0 && "text-ok")}>{r.valor === 0 ? "Grátis" : reais(r.valor)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
