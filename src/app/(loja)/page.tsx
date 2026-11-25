import Link from "next/link";
import { categorias, marcas, produtos } from "@/mock/catalogo";
import { Icon } from "@/ui/icons";
import { ProductArt } from "@/ui/product-art";
import { ProductCard } from "@/ui/loja/product-card";

export default function Home() {
  const maisVendidas = [...produtos].filter((p) => ["mtb", "speed", "eletrica", "infantil", "urbana"].includes(p.categoria)).sort((a, b) => b.vendidos30d - a.vendidos30d).slice(0, 4);
  const promocoes = produtos.filter((p) => p.precoDe).slice(0, 4);
  const pecas = produtos.filter((p) => ["pecas", "acessorios", "vestuario"].includes(p.categoria)).slice(0, 4);

  return (
    <>
      {/* Banners principais */}
      <section className="container-loja grid gap-4 pt-5 lg:grid-cols-[1.75fr_1fr]">
        <div className="relative overflow-hidden rounded-[28px] bg-snow">
          <div className="absolute -top-24 -right-24 size-[420px] rounded-full bg-red/[0.07]" aria-hidden />
          <div className="relative grid items-center gap-2 p-7 md:grid-cols-[1fr_1.1fr] md:p-10">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold ring-1 ring-line">
                <span className="size-1.5 rounded-full bg-red" />
                Black Friday ShopBike · até 30/11
              </span>
              <h1 className="mt-5 text-4xl leading-[1.02] font-bold tracking-tight text-balance md:text-[56px]">
                Sua próxima <span className="text-red">trilha</span> começa aqui.
              </h1>
              <p className="mt-4 max-w-md text-lg text-muted">MTBs Oggi, Specialized e Caloi com até 20% off, em até 21x sem juros ou 10% off no Pix.</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/c/mtb" className="inline-flex h-12 items-center gap-2 rounded-full bg-red px-6 font-semibold text-white transition hover:bg-red-600">
                  Ver mountain bikes <Icon name="chevronRight" className="size-4" />
                </Link>
                <Link href="/c/seminovas" className="inline-flex h-12 items-center rounded-full bg-white px-6 font-semibold ring-1 ring-line-2 transition hover:ring-ink">
                  Seminovas com laudo
                </Link>
              </div>
            </div>
            <ProductArt kind="mtb" color="#e30618" className="w-full" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <Link href="/c/eletrica" className="group relative flex min-h-[200px] overflow-hidden rounded-[28px] bg-ink p-6 text-white">
            <div className="relative z-10 flex flex-col">
              <span className="text-xs font-semibold tracking-[0.14em] text-white/60 uppercase">Elétricas</span>
              <span className="mt-2 max-w-[11ch] text-2xl leading-tight font-bold">Vá de bike, chegue sem suar.</span>
              <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold">
                A partir de 21x de R$ 333 <Icon name="chevronRight" className="size-4" />
              </span>
            </div>
            <ProductArt kind="eletrica" color="#f2f1ee" className="absolute -right-10 -bottom-4 w-[70%] opacity-95 transition duration-500 group-hover:-translate-x-1" />
          </Link>
          <Link href="/oficina" className="group relative flex min-h-[200px] overflow-hidden rounded-[28px] bg-red-50 p-6">
            <div className="relative z-10 flex flex-col">
              <span className="text-xs font-semibold tracking-[0.14em] text-red uppercase">Oficina ShopBike</span>
              <span className="mt-2 max-w-[13ch] text-2xl leading-tight font-bold">Revisão completa com hora marcada.</span>
              <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold">
                Agendar pelo WhatsApp <Icon name="chevronRight" className="size-4" />
              </span>
            </div>
            <ProductArt kind="pecas" color="#e30618" className="absolute -right-6 -bottom-10 w-[52%] opacity-90" />
          </Link>
        </div>
      </section>

      {/* Faixa de benefícios */}
      <section className="container-loja mt-4">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-line ring-1 ring-line md:grid-cols-4">
          {[
            ["truck", "Frete grátis no Sul", "acima de R$ 299"],
            ["pix", "10% off no Pix", "aprovação na hora"],
            ["card", "Até 21x sem juros", "no cartão de crédito"],
            ["store", "Retire hoje", "na loja de Tubarão"],
          ].map(([i, t, s]) => (
            <div key={t} className="flex items-center gap-3 bg-white p-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-red-50 text-red">
                <Icon name={i as "truck"} className="size-5" />
              </span>
              <span>
                <span className="block text-sm font-semibold">{t}</span>
                <span className="text-xs text-muted">{s}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Categorias */}
      <section className="container-loja mt-14">
        <Titulo titulo="Encontre a sua" />
        <div className="scrollbar-none -mx-4 mt-5 flex snap-x gap-3 overflow-x-auto px-4 md:mx-0 md:grid md:grid-cols-9 md:px-0">
          {categorias.map((c) => (
            <Link key={c.slug} href={`/c/${c.slug}`} className="group w-32 shrink-0 snap-start text-center md:w-auto">
              <span className="grid aspect-square place-items-center rounded-3xl bg-snow transition group-hover:bg-cloud">
                <ProductArt kind={c.art} color={c.cor} className="w-[86%]" />
              </span>
              <span className="mt-2 block text-sm font-semibold">{c.nome}</span>
            </Link>
          ))}
        </div>
      </section>

      <Vitrine titulo="Mais vendidas do mês" href="/c/mtb" itens={maisVendidas} />

      {/* Banner seminovas */}
      <section className="container-loja mt-14">
        <div className="grid items-center gap-6 overflow-hidden rounded-[28px] ring-1 ring-line md:grid-cols-2">
          <div className="p-7 md:p-10">
            <span className="text-xs font-semibold tracking-[0.14em] text-faint uppercase">Seminovas ShopBike</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">Revisadas na nossa oficina, com laudo e 90 dias de garantia.</h2>
            <p className="mt-3 text-muted">E se você tem uma bike parada, a gente avalia e usa como parte do pagamento.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/c/seminovas" className="inline-flex h-11 items-center rounded-full bg-ink px-5 font-semibold text-white">
                Ver seminovas
              </Link>
              <Link href="#" className="inline-flex h-11 items-center rounded-full px-5 font-semibold ring-1 ring-line-2">
                Avaliar minha bike
              </Link>
            </div>
          </div>
          <div className="relative h-full min-h-[240px] bg-snow">
            <ProductArt kind="mtb" color="#5f5d58" className="absolute inset-0 m-auto w-[85%]" />
            <span className="absolute top-5 right-5 rounded-2xl bg-white px-3 py-2 text-xs shadow-[var(--shadow-soft)]">
              <span className="block font-semibold">Laudo técnico</span>
              <span className="text-muted">quadro, suspensão e transmissão</span>
            </span>
          </div>
        </div>
      </section>

      <Vitrine titulo="Promoções de Black Friday" href="/c/mtb?promo=1" itens={promocoes} />
      <Vitrine titulo="Peças, acessórios e vestuário" href="/c/pecas" itens={pecas} />

      {/* Marcas */}
      <section className="container-loja mt-14">
        <Titulo titulo="Marcas que a gente vende e entende" />
        <div className="mt-5 grid grid-cols-3 gap-3 md:grid-cols-7">
          {marcas.map((m) => (
            <Link key={m} href={`/busca?q=${m}`} className="grid h-20 place-items-center rounded-2xl bg-snow text-lg font-bold tracking-tight text-ink-2 transition hover:bg-cloud">
              {m}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

function Titulo({ titulo, href }: { titulo: string; href?: string }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{titulo}</h2>
      {href && (
        <Link href={href} className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-red">
          Ver tudo <Icon name="chevronRight" className="size-4" />
        </Link>
      )}
    </div>
  );
}

function Vitrine({ titulo, href, itens }: { titulo: string; href: string; itens: typeof produtos }) {
  return (
    <section className="container-loja mt-14">
      <Titulo titulo={titulo} href={href} />
      <div className="mt-5 grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        {itens.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
    </section>
  );
}
