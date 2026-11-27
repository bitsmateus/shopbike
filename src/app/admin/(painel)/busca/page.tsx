import Link from "next/link";
import type { Metadata } from "next";
import { produtos } from "@/mock/catalogo";
import { Icon } from "@/ui/icons";
import { ProductArt } from "@/ui/product-art";
import { Botao, Cabecalho, Card, Chip } from "@/ui/painel/ui";

export const metadata: Metadata = { title: "Busca da loja" };

const sinonimos = [
  ["bike", "bicicleta"],
  ["mtb", "mountain bike, trilha"],
  ["speed", "road, estrada, bike de estrada"],
  ["elétrica", "e-bike, bicicleta elétrica"],
  ["câmara", "camara de ar, câmara de ar"],
  ["sapatilha", "tênis de clip"],
];

const fixados = [
  { termo: "black friday", produtos: ["Oggi Big Wheel 7.0", "Caloi Explorer Comp 29", "Caloi E-Vibe Easy Rider"] },
  { termo: "capacete", produtos: ["Capacete Specialized Align II"] },
  { termo: "aro 29", produtos: ["Oggi Big Wheel 7.0", "Specialized Rockhopper Sport 29"] },
];

export default function BuscaPage() {
  return (
    <>
      <Cabecalho
        titulo="Busca da loja"
        kpis={[
          { icon: "search", rotulo: "Buscas (30d)", valor: "18.420" },
          { icon: "alert", rotulo: "Sem resultado", valor: "6,4%" },
          { icon: "cart", rotulo: "Busca → venda", valor: "8,1%" },
        ]}
        acoes={
          <Link href="/admin/relatorios/pesquisas" className="inline-flex h-10 items-center gap-2 rounded-full bg-snow px-4 text-sm font-semibold ring-1 ring-black/10">
            <Icon name="chart" className="size-4" /> Log de pesquisas
          </Link>
        }
      />
      <div className="grid gap-4 xl:grid-cols-3">
        <Card titulo="Sinônimos" ferramentas={<Botao tom="ghost"><Icon name="plus" className="size-4" /> Sinônimo</Botao>}>
          <ul className="space-y-2 text-sm">
            {sinonimos.map(([a, b]) => (
              <li key={a} className="tile flex items-center gap-2 p-3">
                <strong>{a}</strong>
                <Icon name="sync" className="size-3.5 text-faint" />
                <span className="text-muted">{b}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card titulo="Produtos fixados por termo" ferramentas={<Botao tom="ghost"><Icon name="plus" className="size-4" /> Termo</Botao>}>
          <ul className="space-y-3">
            {fixados.map((f) => (
              <li key={f.termo} className="tile p-3">
                <p className="text-sm font-semibold">“{f.termo}”</p>
                <ol className="mt-2 space-y-1.5">
                  {f.produtos.map((n, i) => {
                    const p = produtos.find((x) => x.nome === n)!;
                    return (
                      <li key={n} className="flex items-center gap-2 text-sm">
                        <span className="w-4 text-xs text-muted tabular">{i + 1}</span>
                        <ProductArt kind={p.art} color={p.cores[0].hex} className="size-8" />
                        <span className="flex-1 truncate">{n}</span>
                      </li>
                    );
                  })}
                </ol>
              </li>
            ))}
          </ul>
        </Card>
        <div className="space-y-4">
          <Card titulo="Termos sem resultado (7 dias)">
            <ul className="space-y-2 text-sm">
              {[
                ["camara 29", 41],
                ["sapatilha", 33],
                ["bike fit", 12],
                ["gravel", 9],
              ].map(([t, n]) => (
                <li key={t as string} className="flex items-center gap-2">
                  <span className="flex-1">“{t}”</span>
                  <span className="text-muted tabular">{n}×</span>
                  <button className="text-xs font-semibold underline">resolver</button>
                </li>
              ))}
            </ul>
          </Card>
          <Card titulo="Relevância">
            <ul className="space-y-2 text-sm">
              {["Nome do produto", "Marca", "Categoria e tipo", "Ficha técnica (aro, tamanho)", "Mais vendidos primeiro", "Em estoque antes de esgotado"].map((r, i) => (
                <li key={r} className="flex items-center gap-2">
                  <span className="grid size-6 place-items-center rounded-full bg-white text-xs font-bold ring-1 ring-black/5">{i + 1}</span>
                  {r}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted">Tolerância a 1 erro de digitação por palavra. Substitui Climba Search e SmartHint.</p>
            <Chip tom="info">Meilisearch</Chip>
          </Card>
        </div>
      </div>
    </>
  );
}
