import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { categoriaPorSlug, categorias, produtos } from "@/mock/catalogo";
import { Icon } from "@/ui/icons";
import { Listagem } from "@/ui/loja/listagem";

type Props = { params: Promise<{ categoria: string }>; searchParams: Promise<{ promo?: string }> };

export function generateStaticParams() {
  return categorias.map((c) => ({ categoria: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = categoriaPorSlug((await params).categoria);
  return { title: c ? `${c.nome}` : "Categoria" };
}

export default async function CategoriaPage({ params, searchParams }: Props) {
  const { categoria } = await params;
  const { promo } = await searchParams;
  const c = categoriaPorSlug(categoria);
  if (!c) notFound();
  const lista = produtos.filter((p) => p.categoria === c.slug);
  return (
    <div className="container-loja pt-6">
      <nav aria-label="Trilha" className="flex items-center gap-1.5 text-sm text-muted">
        <Link href="/" className="hover:text-ink">
          Início
        </Link>
        <Icon name="chevronRight" className="size-3.5" />
        <span>{c.grupo}</span>
        <Icon name="chevronRight" className="size-3.5" />
        <span className="text-ink">{c.nome}</span>
      </nav>
      <div className="mt-4 flex items-end justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{c.nome}</h1>
      </div>
      <div className="scrollbar-none mt-4 flex gap-2 overflow-x-auto">
        {categorias
          .filter((x) => x.grupo === c.grupo)
          .map((x) => (
            <Link
              key={x.slug}
              href={`/c/${x.slug}`}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ring-1 ${x.slug === c.slug ? "bg-ink text-white ring-ink" : "ring-line-2 hover:ring-ink"}`}
            >
              {x.nome}
            </Link>
          ))}
      </div>
      <Listagem produtos={lista} promoInicial={promo === "1"} />
    </div>
  );
}
