"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { buscar, categorias, corHex } from "@/mock/catalogo";
import { reais } from "@/lib/format";
import { LogoShopBike } from "@/ui/brand";
import { Icon } from "@/ui/icons";
import { ProductArt } from "@/ui/product-art";
import { useCarrinho } from "./carrinho";

const beneficios = [
  { icon: "truck" as const, texto: "Frete grátis no Sul acima de R$ 299" },
  { icon: "pix" as const, texto: "10% off no Pix" },
  { icon: "card" as const, texto: "Até 21x sem juros" },
  { icon: "clock" as const, texto: "Seg a sáb, 8h às 18h" },
];

const menu = [
  { href: "/c/mtb", rotulo: "Mountain bike" },
  { href: "/c/speed", rotulo: "Speed" },
  { href: "/c/eletrica", rotulo: "Elétricas" },
  { href: "/c/urbana", rotulo: "Urbanas" },
  { href: "/c/infantil", rotulo: "Infantil" },
  { href: "/c/seminovas", rotulo: "Seminovas" },
  { href: "/c/pecas", rotulo: "Peças" },
  { href: "/c/acessorios", rotulo: "Acessórios" },
  { href: "/c/vestuario", rotulo: "Vestuário" },
];

export function Header() {
  const { quantidade, setAberto } = useCarrinho();
  const [menuAberto, setMenuAberto] = useState(false);
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <div className="hidden border-b border-line bg-snow md:block">
        <div className="container-loja flex h-9 items-center justify-between text-[13px] text-muted">
          {beneficios.map((b) => (
            <span key={b.texto} className="inline-flex items-center gap-1.5">
              <Icon name={b.icon} className="size-4 text-red" />
              {b.texto}
            </span>
          ))}
        </div>
      </div>

      <div className="container-loja flex h-[72px] items-center gap-3 md:gap-6">
        <button className="-ml-2 grid size-10 place-items-center rounded-full hover:bg-snow lg:hidden" aria-label="Abrir menu" onClick={() => setMenuAberto(true)}>
          <Icon name="menu" />
        </button>
        <Link href="/" className="shrink-0" aria-label="ShopBike, página inicial">
          <LogoShopBike className="h-10 w-auto md:h-12" />
        </Link>
        <div className="hidden flex-1 md:block">
          <Busca />
        </div>
        <nav className="ml-auto flex items-center gap-1" aria-label="Conta e carrinho">
          <a href="https://wa.me/" className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-medium hover:bg-snow xl:inline-flex">
            <Icon name="whatsapp" className="size-5 text-[#1f9d55]" />
            Fale com um vendedor
          </a>
          <Link href="/conta" className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-medium hover:bg-snow sm:inline-flex">
            <Icon name="user" />
            Entrar
          </Link>
          <Link href="/conta" className="grid size-10 place-items-center rounded-full hover:bg-snow" aria-label="Favoritos">
            <Icon name="heart" />
          </Link>
          <button onClick={() => setAberto(true)} className="relative grid size-10 place-items-center rounded-full hover:bg-snow" aria-label={`Carrinho, ${quantidade} itens`}>
            <Icon name="cart" />
            {quantidade > 0 && <span className="absolute -top-0.5 -right-0.5 grid min-w-5 place-items-center rounded-full bg-red px-1 text-[11px] font-bold text-white tabular">{quantidade}</span>}
          </button>
        </nav>
      </div>
      <div className="container-loja pb-3 md:hidden">
        <Busca />
      </div>

      <div className="hidden border-y border-line lg:block">
        <nav className="container-loja flex h-12 items-center gap-1 text-[15px]" aria-label="Categorias">
          {menu.map((m) => (
            <Link key={m.href} href={m.href} className="rounded-full px-3.5 py-1.5 font-medium text-ink-2 transition hover:bg-snow hover:text-ink">
              {m.rotulo}
            </Link>
          ))}
          <Link href="/c/mtb?promo=1" className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-1.5 text-sm font-semibold text-white">
            <span className="size-1.5 rounded-full bg-red" />
            Black Friday
          </Link>
          <Link href="/oficina" className="rounded-full px-3.5 py-1.5 font-medium text-ink-2 hover:bg-snow">
            Oficina
          </Link>
        </nav>
      </div>

      {menuAberto && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal aria-label="Menu">
          <button className="absolute inset-0 bg-ink/30" aria-label="Fechar menu" onClick={() => setMenuAberto(false)} />
          <div className="drawer-in absolute inset-y-0 left-0 flex w-[84%] max-w-sm flex-col bg-white p-5">
            <div className="flex items-center justify-between">
              <LogoShopBike className="h-9 w-auto" />
              <button className="grid size-10 place-items-center rounded-full hover:bg-snow" aria-label="Fechar" onClick={() => setMenuAberto(false)}>
                <Icon name="close" />
              </button>
            </div>
            <nav className="mt-6 flex flex-col gap-1">
              {menu.map((m) => (
                <Link key={m.href} href={m.href} onClick={() => setMenuAberto(false)} className="flex items-center justify-between rounded-xl px-3 py-3 text-lg font-medium hover:bg-snow">
                  {m.rotulo}
                  <Icon name="chevronRight" className="size-4 text-faint" />
                </Link>
              ))}
            </nav>
            <div className="mt-auto grid gap-2 border-t border-line pt-4 text-sm text-muted">
              {beneficios.map((b) => (
                <span key={b.texto} className="inline-flex items-center gap-2">
                  <Icon name={b.icon} className="size-4 text-red" />
                  {b.texto}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function Busca() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [foco, setFoco] = useState(false);
  const caixa = useRef<HTMLDivElement>(null);
  const resultados = q.length >= 2 ? buscar(q).slice(0, 6) : [];

  useEffect(() => {
    const fechar = (e: MouseEvent) => {
      if (!caixa.current?.contains(e.target as Node)) setFoco(false);
    };
    document.addEventListener("mousedown", fechar);
    return () => document.removeEventListener("mousedown", fechar);
  }, []);

  return (
    <div ref={caixa} className="relative w-full max-w-2xl">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          setFoco(false);
          router.push(`/busca?q=${encodeURIComponent(q)}`);
        }}
      >
        <label className="flex h-12 items-center gap-2 rounded-full bg-snow px-4 ring-1 ring-transparent transition focus-within:bg-white focus-within:ring-line-2">
          <Icon name="search" className="size-5 text-faint" />
          <span className="sr-only">Buscar produtos</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => setFoco(true)}
            placeholder="Busque por bike, peça, marca ou aro…"
            className="h-full w-full bg-transparent text-[15px] outline-none placeholder:text-faint"
          />
          {q && (
            <button type="button" onClick={() => setQ("")} className="text-faint hover:text-ink" aria-label="Limpar busca">
              <Icon name="close" className="size-4" />
            </button>
          )}
        </label>
      </form>
      {foco && q.length >= 2 && (
        <div className="rise absolute inset-x-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-3xl bg-white shadow-[var(--shadow-pop)] ring-1 ring-line">
          {resultados.length === 0 ? (
            <div className="p-5 text-sm text-muted">
              Nada encontrado para <strong className="text-ink">“{q}”</strong>. Tente “MTB aro 29” ou fale com um vendedor no WhatsApp.
            </div>
          ) : (
            <ul className="p-2">
              {resultados.map((p) => (
                <li key={p.id}>
                  <Link href={`/p/${p.slug}`} onClick={() => setFoco(false)} className="flex items-center gap-3 rounded-2xl p-2 hover:bg-snow">
                    <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-snow">
                      <ProductArt kind={p.art} color={corHex(p)} className="size-12" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{p.nome}</span>
                      <span className="text-xs text-muted">
                        {p.marca} · {categorias.find((c) => c.slug === p.categoria)?.nome}
                      </span>
                    </span>
                    <span className="font-semibold tabular">{reais(p.preco)}</span>
                  </Link>
                </li>
              ))}
              <li className="border-t border-line px-3 pt-2 pb-1">
                <Link href={`/busca?q=${encodeURIComponent(q)}`} onClick={() => setFoco(false)} className="inline-flex items-center gap-1 text-sm font-semibold text-red">
                  Ver todos os resultados <Icon name="chevronRight" className="size-4" />
                </Link>
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
