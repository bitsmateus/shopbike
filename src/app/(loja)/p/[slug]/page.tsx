import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categoriaPorSlug, produtoPorSlug, produtos } from "@/mock/catalogo";
import { Icon } from "@/ui/icons";
import { CompraProduto } from "@/ui/loja/compra-produto";
import { ProductCard } from "@/ui/loja/product-card";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return produtos.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = produtoPorSlug((await params).slug);
  if (!p) return {};
  return { title: p.nome, description: p.descricao, alternates: { canonical: `/p/${p.slug}` } };
}

const tabelaQuadro = [
  ["15 / S", "1,55 a 1,65 m", "68 a 74 cm"],
  ["17 / M", "1,65 a 1,75 m", "74 a 80 cm"],
  ["19 / L", "1,75 a 1,85 m", "80 a 86 cm"],
  ["21 / XL", "1,85 a 1,95 m", "86 a 92 cm"],
];

const perguntas = [
  ["Vem montada?", "Sim. A oficina monta e regula antes de despachar ou entregar na retirada."],
  ["Aceita bike usada na troca?", "Sim. Mande fotos pelo WhatsApp e a gente avalia como parte do pagamento."],
];

const avaliacoes = [
  { nome: "Rafael M.", nota: 5, texto: "Chegou montada e regulada. Atendimento do Diego foi nota 10.", data: "12/10/2026" },
  { nome: "Camila S.", nota: 5, texto: "Parcelei em 21x sem juros, sem complicação.", data: "28/09/2026" },
  { nome: "Pedro A.", nota: 4, texto: "Ótima bike. Demorou um dia a mais que o previsto.", data: "03/09/2026" },
];

export default async function ProdutoPage({ params }: Props) {
  const { slug } = await params;
  const p = produtoPorSlug(slug);
  if (!p) notFound();
  const cat = categoriaPorSlug(p.categoria)!;
  const relacionados = produtos.filter((x) => x.categoria === p.categoria && x.id !== p.id).slice(0, 4);
  const ehBike = cat.grupo === "Bicicletas";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: p.nome,
        brand: { "@type": "Brand", name: p.marca },
        sku: p.variacoes[0].sku,
        description: p.descricao,
        aggregateRating: { "@type": "AggregateRating", ratingValue: p.avaliacao.nota, reviewCount: p.avaliacao.total },
        offers: { "@type": "Offer", priceCurrency: "BRL", price: (p.preco / 100).toFixed(2), availability: "https://schema.org/InStock" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: "/" },
          { "@type": "ListItem", position: 2, name: cat.nome, item: `/c/${cat.slug}` },
          { "@type": "ListItem", position: 3, name: p.nome },
        ],
      },
    ],
  };

  return (
    <div className="container-loja pt-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Trilha" className="mb-5 flex flex-wrap items-center gap-1.5 text-sm text-muted">
        <Link href="/" className="hover:text-ink">
          Início
        </Link>
        <Icon name="chevronRight" className="size-3.5" />
        <Link href={`/c/${cat.slug}`} className="hover:text-ink">
          {cat.nome}
        </Link>
        <Icon name="chevronRight" className="size-3.5" />
        <span className="text-ink">{p.nome}</span>
      </nav>

      <CompraProduto p={p} />

      <div className="mt-16 grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-12">
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold tracking-tight">Sobre o produto</h2>
            <p className="mt-3 text-lg leading-relaxed text-ink-2">{p.descricao}</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold tracking-tight">Ficha técnica</h2>
            <dl className="mt-4 divide-y divide-line overflow-hidden rounded-3xl ring-1 ring-line">
              {p.caracteristicas.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[150px_1fr] gap-4 px-5 py-3.5 text-sm odd:bg-snow">
                  <dt className="text-muted">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </section>
          {ehBike && (
            <section id="tamanhos">
              <h2 className="text-2xl font-bold tracking-tight">Tabela de tamanhos</h2>
              <p className="mt-2 text-sm text-muted">Medida da entreperna: em pé, descalço, do chão até a virilha.</p>
              <table className="mt-4 w-full overflow-hidden rounded-3xl text-sm ring-1 ring-line">
                <thead className="bg-snow text-left">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Quadro</th>
                    <th className="px-5 py-3 font-semibold">Altura</th>
                    <th className="px-5 py-3 font-semibold">Entreperna</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {tabelaQuadro.map((r) => (
                    <tr key={r[0]}>
                      {r.map((c) => (
                        <td key={c} className="px-5 py-3 tabular">
                          {c}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}
          <section id="avaliacoes">
            <div className="flex items-end justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Avaliações</h2>
              <span className="text-sm text-muted">
                <strong className="text-2xl text-ink">{p.avaliacao.nota.toFixed(1)}</strong> / 5 · {p.avaliacao.total} avaliações
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {avaliacoes.map((a) => (
                <article key={a.nome} className="rounded-3xl p-5 ring-1 ring-line">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold">{a.nome}</span>
                    <span className="text-faint">{a.data}</span>
                  </div>
                  <div className="mt-1 flex">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Icon key={i} name="star" className={i < a.nota ? "size-4 fill-ink text-ink" : "size-4 text-line-2"} />
                    ))}
                  </div>
                  <p className="mt-2 text-ink-2">{a.texto}</p>
                  <p className="mt-2 text-xs text-ok">Compra verificada</p>
                </article>
              ))}
            </div>
          </section>
          <section>
            <h2 className="text-2xl font-bold tracking-tight">Perguntas e respostas</h2>
            <div className="mt-4 space-y-2">
              {perguntas.map(([q, r]) => (
                <details key={q} className="group rounded-2xl bg-snow p-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
                    {q}
                    <Icon name="chevronDown" className="size-4 transition group-open:rotate-180" />
                  </summary>
                  <p className="mt-2 text-muted">{r}</p>
                </details>
              ))}
              <button className="mt-2 text-sm font-semibold text-red">Fazer uma pergunta</button>
            </div>
          </section>
        </div>
        <aside className="hidden lg:block">
          <div className="sticky top-[150px] rounded-3xl bg-snow p-6">
            <h3 className="font-bold">Ficou em dúvida?</h3>
            <p className="mt-2 text-sm text-muted">Um vendedor da ShopBike monta o pedido com você e manda o link de pagamento no WhatsApp, em até 21x.</p>
            <a href="https://wa.me/" className="mt-4 inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white">
              <Icon name="whatsapp" className="size-5" /> Falar com vendedor
            </a>
          </div>
        </aside>
      </div>

      {relacionados.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight">Você também pode gostar</h2>
          <div className="mt-5 grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
            {relacionados.map((x) => (
              <ProductCard key={x.id} p={x} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
