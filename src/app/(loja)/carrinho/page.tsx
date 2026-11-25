"use client";

import Link from "next/link";
import { corHex, produtoPorSlug } from "@/mock/catalogo";
import { reais } from "@/lib/format";
import { parcelasPermitidas, precoAVista, valorParcela } from "@/modules/precos/parcelamento";
import { Icon } from "@/ui/icons";
import { ProductArt } from "@/ui/product-art";
import { useCarrinho } from "@/ui/loja/carrinho";
import { BarraFreteGratis, Qtd } from "@/ui/loja/mini-carrinho";

export default function CarrinhoPage() {
  const { itens, subtotal, alterarQtd, remover } = useCarrinho();
  const n = parcelasPermitidas(subtotal);
  return (
    <div className="container-loja pt-8">
      <h1 className="text-3xl font-bold tracking-tight">Carrinho</h1>
      {itens.length === 0 ? (
        <div className="mt-8 rounded-[28px] bg-snow p-12 text-center">
          <p className="font-semibold">Seu carrinho está vazio.</p>
          <Link href="/c/mtb" className="mt-4 inline-flex rounded-full bg-ink px-5 py-2.5 font-semibold text-white">
            Ver bikes
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px]">
          <ul className="divide-y divide-line rounded-[28px] ring-1 ring-line">
            {itens.map((i) => {
              const p = produtoPorSlug(i.slug);
              return (
                <li key={i.sku} className="flex gap-4 p-4 md:p-5">
                  <Link href={`/p/${i.slug}`} className="grid size-24 shrink-0 place-items-center rounded-2xl bg-snow md:size-28">
                    {p && <ProductArt kind={p.art} color={corHex(p, i.cor)} className="size-full p-2" />}
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <Link href={`/p/${i.slug}`} className="font-semibold hover:underline">
                      {i.nome}
                    </Link>
                    <span className="text-sm text-muted">
                      Tamanho {i.tamanho} · {i.cor} · SKU {i.sku}
                    </span>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <Qtd valor={i.qtd} onChange={(q) => alterarQtd(i.sku, q)} />
                      <span className="font-bold tabular">{reais(i.preco * i.qtd)}</span>
                    </div>
                  </div>
                  <button onClick={() => remover(i.sku)} className="grid size-9 place-items-center self-start rounded-full text-faint hover:bg-snow hover:text-red" aria-label="Remover">
                    <Icon name="close" className="size-4" />
                  </button>
                </li>
              );
            })}
          </ul>
          <aside className="space-y-3 lg:sticky lg:top-[150px] lg:self-start">
            <BarraFreteGratis subtotal={subtotal} />
            <div className="rounded-[28px] bg-snow p-5">
              <div className="flex justify-between text-lg">
                <span>Subtotal</span>
                <strong className="tabular">{reais(subtotal)}</strong>
              </div>
              <p className="mt-1 text-sm text-muted">
                em até {n}x de {reais(valorParcela(subtotal, n))} ou <strong className="text-ok">{reais(precoAVista(subtotal))} no Pix</strong>
              </p>
              <Link href="/checkout" className="mt-5 flex h-12 items-center justify-center rounded-full bg-red font-semibold text-white hover:bg-red-600">
                Finalizar compra
              </Link>
              <Link href="/" className="mt-2 flex h-11 items-center justify-center rounded-full font-semibold ring-1 ring-line-2">
                Continuar comprando
              </Link>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
