"use client";

import { useMemo, useState } from "react";
import { categorias, estoqueTotal, produtos, type Produto } from "@/mock/catalogo";
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
  const [aberto, setAberto] = useState<Produto | null>(null);

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
        <Botao tom="ink">
          <Icon name="plus" className="size-4" /> Novo produto
        </Botao>
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
                <tr key={p.id} onClick={() => setAberto(p)} className="cursor-pointer border-b border-black/5 last:border-0 hover:bg-white/70">
                  <td className="py-2.5 pl-5">
                    <span className="flex items-center gap-3">
                      <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-white/80">
                        <ProductArt kind={p.art} color={p.cores[0].hex} className="size-11" />
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

      {aberto && <EditorProduto p={aberto} fechar={() => setAberto(null)} />}
    </>
  );
}

function EditorProduto({ p, fechar }: { p: Produto; fechar: () => void }) {
  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal aria-label={p.nome}>
      <button className="absolute inset-0 bg-ink/20" aria-label="Fechar" onClick={fechar} />
      <aside className="glass-strong drawer-in absolute inset-y-2 right-2 flex w-[calc(100%-16px)] max-w-3xl flex-col overflow-hidden rounded-[26px]">
        <header className="flex items-center gap-4 border-b border-black/5 p-5">
          <span className="grid size-16 place-items-center rounded-2xl bg-snow">
            <ProductArt kind={p.art} color={p.cores[0].hex} className="size-14" />
          </span>
          <div className="flex-1">
            <h2 className="text-xl font-bold tracking-tight">{p.nome}</h2>
            <p className="text-sm text-muted">
              {p.marca} · nota do cadastro <NotaQualidade nota={p.qualidade.nota} />
            </p>
          </div>
          <button onClick={fechar} className="grid size-10 place-items-center rounded-full bg-white ring-1 ring-black/5" aria-label="Fechar">
            <Icon name="close" />
          </button>
        </header>
        <div className="flex-1 space-y-6 overflow-y-auto p-5">
          <div className="flex items-start gap-2 rounded-2xl bg-info-50 p-3 text-sm text-info">
            <Icon name="sync" className="mt-0.5 size-4 shrink-0" />
            <span>
              <strong>Estoque e preço vêm da Bruning</strong> e não podem ser editados aqui. Fotos, descrição, ficha técnica e SEO são do painel.
            </span>
          </div>

          <section>
            <h3 className="mb-3 font-bold">Variações (tamanho × cor)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-muted">
                    <th className="pb-2">Tamanho</th>
                    {p.cores.map((c) => (
                      <th key={c.nome} className="pb-2 text-center">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="size-3 rounded-full ring-1 ring-black/10" style={{ background: c.hex }} />
                          {c.nome}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {p.tamanhos.map((t) => (
                    <tr key={t} className="border-t border-black/5">
                      <td className="py-2.5 font-semibold">{t}</td>
                      {p.cores.map((c) => {
                        const v = p.variacoes.find((x) => x.tamanho === t && x.cor === c.nome)!;
                        return (
                          <td key={c.nome} className="py-2.5 text-center">
                            <span className={cn("inline-flex min-w-16 flex-col rounded-xl px-2 py-1.5 ring-1", v.estoque === 0 ? "bg-red-50 ring-red-100" : "bg-white ring-black/5")}>
                              <span className={cn("font-bold tabular", v.estoque === 0 && "text-red")}>{v.estoque} un.</span>
                              <span className="text-[10px] text-faint">{v.sku}</span>
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="grid gap-3 sm:grid-cols-2">
            {[
              ["Nome", p.nome, false],
              ["Slug (URL)", `/p/${p.slug}`, false],
              ["Preço (Bruning)", reais(p.preco), true],
              ["Preço promocional", p.precoDe ? `${reais(p.preco)} até 30/11` : "—", false],
              ["Parcelamento", p.limiteParcelas ? `até ${p.limiteParcelas}x (regra do produto)` : "até 21x (regra geral)", false],
              ["Garantia", p.garantia, false],
              ["Título SEO", `${p.nome} | ShopBike`, false],
              ["Etiquetas", p.selos.join(", ") || "—", false],
            ].map(([k, v, erp]) => (
              <label key={k as string} className="block">
                <span className="mb-1 flex items-center gap-1 text-xs font-medium text-muted">
                  {k} {erp && <Icon name="lock" className="size-3" />}
                </span>
                <input defaultValue={v as string} readOnly={erp as boolean} className={cn("h-11 w-full rounded-xl px-3 text-sm ring-1 ring-black/10 outline-none focus:ring-ink", erp ? "bg-snow text-muted" : "bg-white")} />
              </label>
            ))}
          </section>

          <section>
            <h3 className="mb-2 font-bold">Checklist do cadastro</h3>
            <ul className="grid gap-2 text-sm sm:grid-cols-2">
              {[
                [p.qualidade.fotos >= 5, `${p.qualidade.fotos} fotos (mínimo 5)`],
                [p.qualidade.video, "Vídeo"],
                [p.qualidade.descricao, "Descrição completa"],
                [p.caracteristicas.length >= 4, "Ficha técnica"],
              ].map(([ok, t]) => (
                <li key={t as string} className="flex items-center gap-2 rounded-xl bg-white p-3 ring-1 ring-black/5">
                  <Icon name={ok ? "check" : "alert"} className={cn("size-4", ok ? "text-ok" : "text-red")} />
                  {t}
                </li>
              ))}
            </ul>
          </section>
        </div>
        <footer className="flex justify-end gap-2 border-t border-black/5 p-4">
          <Botao tom="ghost" onClick={fechar}>
            Cancelar
          </Botao>
          <Botao tom="ink" onClick={fechar}>
            Salvar alterações
          </Botao>
        </footer>
      </aside>
    </div>
  );
}
