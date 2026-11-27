"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { categorias, estoqueTotal, produtos, type Produto } from "@/mock/catalogo";
import Link from "next/link";
import { cn, reais } from "@/lib/format";
import { Icon } from "@/ui/icons";
import { ProductArt } from "@/ui/product-art";
import { Botao, Card } from "@/ui/painel/ui";

function NotaQualidade({ nota }: { nota: number }) {
  const cor = nota >= 80 ? "text-ok bg-ok-50" : nota >= 50 ? "text-warn bg-warn-50" : "text-red bg-red-50";
  return <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-bold tabular", cor)}>{nota}</span>;
}

export function Catalogo() {
  const [aba, setAba] = useState<"todos" | "revisao">("todos");
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("todas");
  const router = useRouter();

  const lista = useMemo(() => {
    let r = produtos.filter((p) => (cat === "todas" || p.categoria === cat) && (!q || `${p.nome} ${p.marca} ${p.variacoes.map((v) => v.sku).join(" ")}`.toLowerCase().includes(q.toLowerCase())));
    if (aba === "revisao") r = r.filter((p) => p.qualidade.nota < 80).sort((a, b) => b.vendidos30d - a.vendidos30d);
    return r;
  }, [q, cat, aba]);

  const problemas = (p: Produto) => [p.qualidade.fotos < 5 && `${p.qualidade.fotos} fotos (mín. 5)`, !p.qualidade.video && "sem vídeo", !p.qualidade.descricao && "sem descrição"].filter(Boolean) as string[];

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="glass inline-flex rounded-full p-1.5" role="tablist">
          {(
            [
              ["todos", `Produtos (${produtos.length})`],
              ["revisao", `Revisão do cadastro (${produtos.filter((p) => p.qualidade.nota < 80).length})`],
            ] as const
          ).map(([k, r]) => (
            <button key={k} role="tab" aria-selected={aba === k} onClick={() => setAba(k)} className={cn("rounded-full px-4 py-2 text-sm font-semibold", aba === k ? "bg-ink text-white" : "text-ink-2 hover:bg-white/70")}>
              {r}
            </button>
          ))}
        </div>
        <span className="flex-1" />
        <Botao tom="ghost">
          <Icon name="arrowUp" className="size-4" /> Importar planilha
        </Botao>
        <Botao tom="ghost">
          <Icon name="box" className="size-4" /> Fotos em lote (ZIP)
        </Botao>
        <Link href="/admin/catalogo/novo" className="inline-flex h-10 items-center gap-2 rounded-full bg-ink px-4 text-sm font-semibold text-white">
          <Icon name="plus" className="size-4" /> Novo produto
        </Link>
      </div>

      {aba === "revisao" && (
        <Card tom="red" className="mb-4 p-4">
          <p className="text-sm">
            <strong>Cadastros fracos ordenados pelos mais vendidos.</strong> Produto com menos de 5 fotos, sem vídeo ou sem descrição vende menos e aparece pior no Google.
          </p>
        </Card>
      )}

      <Card className="overflow-hidden p-0">
        <div className="flex flex-wrap gap-2 border-b border-black/5 p-3">
          <label className="flex h-10 min-w-[240px] flex-1 items-center gap-2 rounded-full bg-white/80 px-4 ring-1 ring-black/5">
            <Icon name="search" className="size-4 text-faint" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Nome, marca ou SKU" className="flex-1 bg-transparent text-sm outline-none" aria-label="Buscar produtos" />
          </label>
          <select value={cat} onChange={(e) => setCat(e.target.value)} className="h-10 rounded-full bg-white/80 px-4 text-sm ring-1 ring-black/5" aria-label="Categoria">
            <option value="todas">Todas as categorias</option>
            {categorias.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.nome}
              </option>
            ))}
          </select>
          <Botao tom="ghost">Ações em massa</Botao>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-sm">
            <thead>
              <tr className="border-b border-black/5 text-left text-xs font-semibold tracking-wide text-muted uppercase">
                <th className="py-3 pl-5">Produto</th>
                <th>Categoria</th>
                <th className="text-center">Variações</th>
                <th className="text-center">Estoque</th>
                <th className="text-right">Preço</th>
                <th className="pl-6">{aba === "revisao" ? "Problemas" : "Qualidade"}</th>
                <th className="pr-5 text-right">Vendas 30d</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((p) => (
                <tr key={p.id} onClick={() => router.push(`/admin/catalogo/${p.id}`)} className="cursor-pointer border-b border-black/5 last:border-0 hover:bg-white/70">
                  <td className="py-2 pl-4">
                    <span className="flex items-center gap-3">
                      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/80">
                        <ProductArt kind={p.art} color={p.cores[0].hex} className="size-9" />
                      </span>
                      <span>
                        <span className="block font-semibold">{p.nome}</span>
                        <span className="text-xs text-muted">
                          {p.marca} · {p.variacoes[0].sku.split("-")[0]}
                        </span>
                      </span>
                    </span>
                  </td>
                  <td>{categorias.find((c) => c.slug === p.categoria)?.nome}</td>
                  <td className="text-center tabular">{p.variacoes.length}</td>
                  <td className={cn("text-center font-semibold tabular", estoqueTotal(p) <= 2 && "text-red")}>{estoqueTotal(p)}</td>
                  <td className="text-right font-semibold tabular">{reais(p.preco)}</td>
                  <td className="pl-6">
                    {aba === "revisao" ? (
                      <span className="flex flex-wrap gap-1">
                        {problemas(p).map((x) => (
                          <span key={x} className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red">
                            {x}
                          </span>
                        ))}
                      </span>
                    ) : (
                      <NotaQualidade nota={p.qualidade.nota} />
                    )}
                  </td>
                  <td className="pr-5 text-right tabular">{p.vendidos30d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="border-t border-black/5 px-5 py-3 text-xs text-muted">Protótipo com 18 produtos. A base real tem 7.395 itens vindos da Bruning e da Climba.</p>
      </Card>

    </>
  );
}
