import Link from "next/link";
import type { Produto } from "@/mock/catalogo";
import { ProductArt } from "@/ui/product-art";
import { Icon } from "@/ui/icons";
import { Preco } from "./preco";

export function Selo({ texto }: { texto: string }) {
  const estilo =
    texto === "Promoção"
      ? "bg-red text-white"
      : texto === "Seminova"
        ? "bg-ink text-white"
        : texto === "Lançamento"
          ? "bg-white text-ink ring-1 ring-line-2"
          : "bg-snow text-muted ring-1 ring-line";
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide ${estilo}`}>{texto}</span>;
}

export function ProductCard({ p }: { p: Produto }) {
  const desconto = p.precoDe ? Math.round((1 - p.preco / p.precoDe) * 100) : 0;
  return (
    <Link href={`/p/${p.slug}`} className="group flex flex-col rounded-[var(--radius-card)] bg-white p-3 ring-1 ring-line transition hover:shadow-[var(--shadow-soft)] hover:ring-line-2">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-snow">
        <ProductArt kind={p.art} color={p.cores[0].hex} className="size-full p-3 transition duration-500 group-hover:scale-[1.04]" />
        <div className="absolute top-2.5 left-2.5 flex gap-1.5">
          {desconto > 0 && <span className="rounded-full bg-red px-2.5 py-1 text-[11px] font-bold text-white">-{desconto}%</span>}
          {p.selos
            .filter((s) => s !== "Promoção")
            .map((s) => (
              <Selo key={s} texto={s} />
            ))}
        </div>
        <span className="absolute top-2.5 right-2.5 grid size-8 place-items-center rounded-full bg-white/90 text-muted opacity-0 ring-1 ring-line transition group-hover:opacity-100" aria-hidden>
          <Icon name="heart" className="size-4" />
        </span>
        {p.cores.length > 1 && (
          <div className="absolute bottom-2.5 left-2.5 flex gap-1">
            {p.cores.map((c) => (
              <span key={c.nome} title={c.nome} className="size-3.5 rounded-full ring-2 ring-white" style={{ background: c.hex }} />
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 px-1.5 pt-3 pb-1">
        <div className="text-[11px] font-semibold tracking-[0.12em] text-faint uppercase">{p.marca}</div>
        <h3 className="line-clamp-2 min-h-[2.6em] leading-snug font-semibold">{p.nome}</h3>
        <div className="flex items-center gap-1 text-xs text-muted">
          <Icon name="star" className="size-3.5 fill-ink text-ink" />
          <span className="font-semibold text-ink">{p.avaliacao.nota.toFixed(1)}</span>
          <span>({p.avaliacao.total})</span>
        </div>
        <div className="mt-auto">
          <Preco preco={p.preco} precoDe={p.precoDe} limite={p.limiteParcelas} />
        </div>
      </div>
    </Link>
  );
}
