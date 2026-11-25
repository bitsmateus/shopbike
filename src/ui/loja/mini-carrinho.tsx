"use client";

import Link from "next/link";
import { produtoPorSlug, corHex } from "@/mock/catalogo";
import { reais } from "@/lib/format";
import { Icon } from "@/ui/icons";
import { ProductArt } from "@/ui/product-art";
import { useCarrinho } from "./carrinho";

const FRETE_GRATIS = 29_900;

export function BarraFreteGratis({ subtotal }: { subtotal: number }) {
  const falta = FRETE_GRATIS - subtotal;
  const pct = Math.min(100, (subtotal / FRETE_GRATIS) * 100);
  return (
    <div className="rounded-2xl bg-snow p-3 text-sm">
      {falta > 0 ? (
        <p>
          Faltam <strong>{reais(falta)}</strong> para <strong>frete grátis</strong> no Sul.
        </p>
      ) : (
        <p className="font-semibold text-ok">Você ganhou frete grátis no Sul.</p>
      )}
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
        <div className="h-full rounded-full bg-red transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function MiniCarrinho() {
  const { itens, aberto, setAberto, subtotal, alterarQtd, remover } = useCarrinho();
  if (!aberto) return null;
  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal aria-label="Carrinho">
      <button className="absolute inset-0 bg-ink/30" aria-label="Fechar carrinho" onClick={() => setAberto(false)} />
      <aside className="drawer-in absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-lg font-bold">Seu carrinho</h2>
          <button className="grid size-10 place-items-center rounded-full hover:bg-snow" aria-label="Fechar" onClick={() => setAberto(false)}>
            <Icon name="close" />
          </button>
        </div>
        {itens.length === 0 ? (
          <div className="grid flex-1 place-items-center p-8 text-center">
            <div>
              <div className="mx-auto grid size-16 place-items-center rounded-full bg-snow">
                <Icon name="cart" className="size-7 text-faint" />
              </div>
              <p className="mt-4 font-semibold">Seu carrinho está vazio</p>
              <p className="mt-1 text-sm text-muted">Que tal começar pelas bikes em promoção?</p>
              <Link href="/c/mtb" onClick={() => setAberto(false)} className="mt-5 inline-flex rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white">
                Ver bikes
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              <BarraFreteGratis subtotal={subtotal} />
              {itens.map((i) => {
                const p = produtoPorSlug(i.slug);
                return (
                  <div key={i.sku} className="flex gap-3">
                    <div className="grid size-20 shrink-0 place-items-center rounded-2xl bg-snow">
                      {p && <ProductArt kind={p.art} color={corHex(p, i.cor)} className="size-[72px]" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="leading-snug font-medium">{i.nome}</p>
                      <p className="text-xs text-muted">
                        {i.tamanho !== "Único" && `Tam. ${i.tamanho} · `}
                        {i.cor}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <Qtd valor={i.qtd} onChange={(q) => alterarQtd(i.sku, q)} />
                        <span className="font-semibold tabular">{reais(i.preco * i.qtd)}</span>
                      </div>
                      <button onClick={() => remover(i.sku)} className="mt-1 text-xs text-faint underline-offset-2 hover:text-red hover:underline">
                        Remover
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="space-y-3 border-t border-line p-5">
              <div className="flex justify-between text-lg">
                <span>Subtotal</span>
                <strong className="tabular">{reais(subtotal)}</strong>
              </div>
              <Link href="/checkout" onClick={() => setAberto(false)} className="flex h-12 items-center justify-center rounded-full bg-red font-semibold text-white transition hover:bg-red-600">
                Finalizar compra
              </Link>
              <Link href="/carrinho" onClick={() => setAberto(false)} className="flex h-11 items-center justify-center rounded-full font-semibold ring-1 ring-line-2 hover:bg-snow">
                Ver carrinho
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

export function Qtd({ valor, onChange }: { valor: number; onChange: (n: number) => void }) {
  return (
    <div className="inline-flex h-9 items-center rounded-full ring-1 ring-line-2">
      <button className="grid size-9 place-items-center rounded-full hover:bg-snow" aria-label="Diminuir" onClick={() => onChange(valor - 1)}>
        <Icon name="minus" className="size-4" />
      </button>
      <span className="w-6 text-center text-sm font-semibold tabular">{valor}</span>
      <button className="grid size-9 place-items-center rounded-full hover:bg-snow" aria-label="Aumentar" onClick={() => onChange(valor + 1)}>
        <Icon name="plus" className="size-4" />
      </button>
    </div>
  );
}
