"use client";

import Link from "next/link";
import { useState } from "react";
import { categorias, marcas, produtos, type Produto } from "@/mock/catalogo";
import { cn, reais } from "@/lib/format";
import { parcelasPermitidas } from "@/modules/precos/parcelamento";
import { Icon, type IconName } from "@/ui/icons";
import { ProductArt } from "@/ui/product-art";
import { Interruptor, useAviso } from "@/ui/painel/controles";
import { Botao, CampoPainel, Card, Chip, SelectPainel } from "@/ui/painel/ui";

const secoes: [string, string, IconName][] = [
  ["dados", "Dados gerais", "doc"],
  ["midia", "Fotos e vídeos", "eye"],
  ["variacoes", "Variações e estoque", "box"],
  ["descricao", "Descrição", "doc"],
  ["ficha", "Ficha técnica", "wrench"],
  ["faq", "Perguntas frequentes", "users"],
  ["preco", "Preço e parcelamento", "card"],
  ["frete", "Frete", "truck"],
  ["seo", "SEO", "search"],
  ["relacionados", "Relacionados", "link"],
  ["seminova", "Seminova (laudo)", "shield"],
  ["historico", "Histórico", "clock"],
];

const vazio: Produto = {
  ...produtos[0],
  id: "novo",
  slug: "",
  nome: "",
  selos: [],
  variacoes: [],
  tamanhos: [],
  caracteristicas: [],
  descricao: "",
  qualidade: { fotos: 0, video: false, descricao: false, nota: 0 },
};

export function EditorProduto({ p: original }: { p: Produto | null }) {
  const p = original ?? vazio;
  const novo = !original;
  const [status, setStatus] = useState("Ativo");
  const [titulo, setTitulo] = useState(p.nome);
  const [slug, setSlug] = useState(p.slug);
  const [seoDesc, setSeoDesc] = useState(p.descricao.slice(0, 150));
  const [ficha, setFicha] = useState<[string, string][]>(p.caracteristicas.length ? p.caracteristicas : [["Quadro", ""], ["Aro", ""]]);
  const [selos, setSelos] = useState<string[]>(p.selos);
  const [seminova, setSeminova] = useState(!!p.seminova);
  const { avisar, aviso } = useAviso();
  const fotos = Math.max(p.qualidade.fotos, novo ? 0 : 1);

  const checklist: [boolean, string][] = [
    [fotos >= 5, `${fotos} de 5 fotos`],
    [p.qualidade.video, "Vídeo"],
    [p.descricao.length > 80, "Descrição completa"],
    [ficha.filter(([, v]) => v).length >= 4, "Ficha técnica (4+ itens)"],
    [seoDesc.length >= 100, "Descrição de SEO"],
  ];
  const nota = Math.round((checklist.filter(([ok]) => ok).length / checklist.length) * 100);

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Link href="/admin/catalogo" className="inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-ink">
          <Icon name="chevronLeft" className="size-4" /> Produtos
        </Link>
        <span className="flex-1" />
        {!novo && (
          <Link href={`/p/${p.slug}`} target="_blank" className="inline-flex h-10 items-center gap-2 rounded-full bg-white/70 px-4 text-sm font-semibold ring-1 ring-black/10">
            <Icon name="eye" className="size-4" /> Ver na loja
          </Link>
        )}
        <Botao tom="ghost" onClick={() => avisar("Produto duplicado como rascunho")}>
          <Icon name="copy" className="size-4" /> Duplicar
        </Botao>
        <Botao tom="ink" onClick={() => avisar("Alterações salvas · registradas na auditoria")}>
          <Icon name="check" className="size-4" /> Salvar
        </Botao>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <span className="grid size-20 place-items-center rounded-[20px] bg-white/80 ring-1 ring-black/5">{!novo && <ProductArt kind={p.art} color={p.cores[0].hex} className="size-[72px]" />}</span>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl leading-tight font-bold tracking-tight">{titulo || "Novo produto"}</h1>
          <p className="text-sm text-muted">{novo ? "Preencha os dados e salve como rascunho." : `${p.marca} · ${p.variacoes.length} variações · código ERP ${p.variacoes[0]?.sku.split("-")[0]}`}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[200px_1fr_320px]">
        {/* Índice */}
        <nav aria-label="Seções do produto" className="hidden xl:block">
          <ul className="glass sticky top-[96px] space-y-0.5 rounded-[22px] p-2">
            {secoes
              .filter(([id]) => id !== "seminova" || seminova)
              .map(([id, rotulo, i]) => (
                <li key={id}>
                  <a href={`#${id}`} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-ink-2 hover:bg-white">
                    <Icon name={i} className="size-4 text-muted" /> {rotulo}
                  </a>
                </li>
              ))}
          </ul>
        </nav>

        {/* Formulário */}
        <div className="min-w-0 space-y-4">
          <Card titulo="Dados gerais" className="scroll-mt-24" >
            <div id="dados" className="grid scroll-mt-28 gap-3 sm:grid-cols-2">
              <CampoPainel label="Nome do produto" value={titulo} onChange={(e) => setTitulo(e.target.value)} className="sm:col-span-2" placeholder="Ex.: Oggi Big Wheel 7.0" />
              <CampoPainel
                label="Slug (URL)"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                dica={novo ? "Gerado a partir do nome." : "Mudar o slug cria um redirecionamento 301 automático."}
              />
              <CampoPainel label="Código interno" defaultValue={p.variacoes[0]?.sku.split("-")[0] ?? ""} />
              <CampoPainel label="Código no ERP (Bruning)" defaultValue={novo ? "" : "BRN-" + p.id.toUpperCase() + "0091"} readOnly dica="Vem da integração." />
              <CampoPainel label="EAN (produto pai)" defaultValue={novo ? "" : "7891234567890"} />
              <SelectPainel label="Marca" opcoes={marcas} defaultValue={p.marca} />
              <SelectPainel label="Garantia" opcoes={["Quadro vitalício, componentes 1 ano", "Quadro 5 anos, componentes 1 ano", "1 ano", "90 dias (oficina ShopBike)", "Contra defeito de fabricação"]} defaultValue={p.garantia} />
              <SelectPainel label="Disponibilidade" opcoes={["Pronta entrega", "Sob encomenda (15 dias)", "Pré-venda", "Produção própria (5 dias)"]} />
              <SelectPainel label="Tabela de tamanhos" opcoes={["Quadro MTB (15 a 21)", "Quadro speed (50 a 58)", "Vestuário P a GG", "Capacete P/M/G", "Nenhuma"]} />
            </div>
          </Card>

          <Card titulo="Fotos e vídeos" ferramentas={<Botao tom="ghost"><Icon name="plus" className="size-4" /> Enviar</Botao>}>
            <div id="midia" className="grid scroll-mt-28 grid-cols-3 gap-3 sm:grid-cols-5">
              {Array.from({ length: Math.max(fotos, 1) }, (_, i) => (
                <div key={i} className="group relative">
                  <div className={cn("grid aspect-square place-items-center rounded-2xl bg-white ring-1 ring-black/5", i === 0 && "ring-2 ring-ink")}>
                    {!novo && <ProductArt kind={p.art} color={p.cores[i % p.cores.length].hex} angle={i} className="size-full p-2" />}
                  </div>
                  {i === 0 && <span className="absolute top-2 left-2 rounded-full bg-ink px-2 py-0.5 text-[10px] font-bold text-white">Capa</span>}
                  <input defaultValue={novo ? "" : `${p.nome} ${i === 0 ? "vista lateral" : `detalhe ${i}`}`} aria-label={`Texto alternativo da foto ${i + 1}`} className="mt-1.5 h-8 w-full rounded-lg bg-white/80 px-2 text-xs ring-1 ring-black/5" />
                </div>
              ))}
              <label className="grid aspect-square cursor-pointer place-items-center rounded-2xl border-2 border-dashed border-black/15 text-center text-xs text-muted hover:bg-white/60">
                <span>
                  <Icon name="plus" className="mx-auto size-5" />
                  Arraste fotos
                  <br />
                  ou vídeo
                </span>
                <input type="file" multiple className="sr-only" />
              </label>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <Icon name="link" className="size-4 text-muted" />
              <input placeholder="Link do vídeo (YouTube ou Vimeo)" defaultValue={p.qualidade.video ? "https://youtube.com/watch?v=exemplo" : ""} className="h-10 min-w-[240px] flex-1 rounded-xl bg-white px-3 ring-1 ring-black/10" aria-label="Link do vídeo" />
            </div>
            <p className="mt-2 text-xs text-muted">Arraste para ordenar. A primeira é a capa. Fotos viram WebP/AVIF em vários tamanhos automaticamente.</p>
          </Card>

          <Card titulo="Variações e estoque" ferramentas={<Chip tom="info"><Icon name="sync" className="size-3" /> Estoque e preço vêm da Bruning</Chip>}>
            <div id="variacoes" className="scroll-mt-28">
              <div className="mb-3 flex flex-wrap gap-2 text-sm">
                <span className="text-muted">Atributos:</span>
                <Chip>Tamanho do quadro: {p.tamanhos.join(", ") || "—"}</Chip>
                <Chip>Cor: {p.cores.map((c) => c.nome).join(", ")}</Chip>
                {p.aro && <Chip>Aro: {p.aro}</Chip>}
                <button className="text-xs font-semibold text-ink underline">Editar atributos</button>
              </div>
              <div className="-mx-5 overflow-x-auto">
                <table className="tabela min-w-[720px]">
                  <thead>
                    <tr>
                      <th>Variação</th>
                      <th>SKU</th>
                      <th>EAN</th>
                      <th className="text-right">Estoque</th>
                      <th className="text-right">Reservado</th>
                      <th>Fotos próprias</th>
                      <th>Ativa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {p.variacoes.map((v, i) => (
                      <tr key={v.sku}>
                        <td className="font-medium">
                          <span className="inline-flex items-center gap-2">
                            <span className="size-3 rounded-full ring-1 ring-black/10" style={{ background: p.cores.find((c) => c.nome === v.cor)?.hex }} />
                            {v.tamanho} · {v.cor}
                          </span>
                        </td>
                        <td className="text-xs">{v.sku}</td>
                        <td className="text-xs text-muted">789123456{String(7890 + i).slice(-4)}</td>
                        <td className={cn("text-right font-bold tabular", v.estoque === 0 && "text-red")}>
                          <span className="inline-flex items-center gap-1">
                            <Icon name="lock" className="size-3 text-faint" />
                            {v.estoque}
                          </span>
                        </td>
                        <td className="text-right text-muted tabular">{i === 0 ? 1 : 0}</td>
                        <td>{i % 2 === 0 ? <Chip tom="ok">3 fotos</Chip> : <Chip tom="apagado">usa as do produto</Chip>}</td>
                        <td>
                          <Interruptor ligado={v.estoque > 0 || i % 3 !== 0} onChange={() => avisar("Variação atualizada")} rotulo={`Ativar ${v.sku}`} />
                        </td>
                      </tr>
                    ))}
                    {p.variacoes.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-muted">
                          Defina os atributos (tamanho, cor, aro) para gerar as variações.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>

          <Card titulo="Descrição" ferramentas={<Botao tom="ghost" onClick={() => avisar("Sugestão de descrição gerada pela IA (Fase 2)")}><Icon name="star" className="size-4" /> Sugerir com IA</Botao>}>
            <div id="descricao" className="scroll-mt-28">
              <CampoPainel label="Descrição curta" defaultValue={p.descricao.split(".")[0]} />
              <p className="mt-4 mb-1.5 text-sm font-medium text-ink-2">Descrição completa</p>
              <div className="overflow-hidden rounded-xl bg-white ring-1 ring-black/10">
                <div className="flex flex-wrap gap-1 border-b border-black/5 p-1.5">
                  {["B", "I", "H2", "• Lista", "1. Lista", "Link", "Imagem", "Tabela"].map((b) => (
                    <button key={b} className="rounded-lg px-2.5 py-1 text-xs font-semibold text-ink-2 hover:bg-snow">
                      {b}
                    </button>
                  ))}
                </div>
                <textarea defaultValue={p.descricao} className="h-36 w-full resize-y p-3 text-sm outline-none" aria-label="Descrição completa" />
              </div>
            </div>
          </Card>

          <Card titulo="Ficha técnica" ferramentas={<Botao tom="ghost" onClick={() => setFicha([...ficha, ["", ""]])}><Icon name="plus" className="size-4" /> Linha</Botao>}>
            <ul id="ficha" className="scroll-mt-28 space-y-2">
              {ficha.map(([k, v], i) => (
                <li key={i} className="flex gap-2">
                  <input value={k} onChange={(e) => setFicha(ficha.map((f, j) => (j === i ? [e.target.value, f[1]] : f)))} placeholder="Característica" aria-label="Característica" className="h-10 w-40 rounded-xl bg-white px-3 text-sm font-medium ring-1 ring-black/10 sm:w-52" />
                  <input value={v} onChange={(e) => setFicha(ficha.map((f, j) => (j === i ? [f[0], e.target.value] : f)))} placeholder="Valor" aria-label="Valor" className="h-10 min-w-0 flex-1 rounded-xl bg-white px-3 text-sm ring-1 ring-black/10" />
                  <button onClick={() => setFicha(ficha.filter((_, j) => j !== i))} className="grid size-10 place-items-center rounded-full hover:bg-white" aria-label="Remover linha">
                    <Icon name="close" className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-muted">Quadro, aro, câmbio, freio e suspensão viram filtros na loja.</p>
          </Card>

          <Card titulo="Perguntas frequentes do produto" ferramentas={<Botao tom="ghost"><Icon name="plus" className="size-4" /> Pergunta</Botao>}>
            <ul id="faq" className="scroll-mt-28 space-y-2 text-sm">
              {[
                ["Vem montada?", "Sim. A oficina monta e regula antes de despachar."],
                ["Aceita bike usada na troca?", "Sim, mande fotos pelo WhatsApp para avaliação."],
              ].map(([q, r]) => (
                <li key={q} className="tile p-3">
                  <p className="font-semibold">{q}</p>
                  <p className="text-muted">{r}</p>
                </li>
              ))}
            </ul>
          </Card>

          <Card titulo="Preço e parcelamento">
            <div id="preco" className="grid scroll-mt-28 gap-3 sm:grid-cols-3">
              <CampoPainel label="Preço (Bruning)" defaultValue={reais(p.precoDe ?? p.preco)} readOnly dica="Atualizado pelo ERP." />
              <CampoPainel label="Preço promocional" defaultValue={p.precoDe ? reais(p.preco) : ""} placeholder="R$ 0,00" />
              <CampoPainel label="Promoção até" type="date" defaultValue={p.precoDe ? "2026-11-30" : ""} />
              <SelectPainel label="Parcelamento" opcoes={["Regra geral (até 21x)", "Regra da marca", "Até 12x neste produto", "Até 6x neste produto"]} defaultValue={p.limiteParcelas ? "Até 12x neste produto" : "Regra geral (até 21x)"} />
              <SelectPainel label="Exibição" opcoes={["Preço normal", "Preço sob consulta", "Só vitrine (sem compra)"]} />
              <div className="rounded-xl bg-white/80 p-3 text-sm ring-1 ring-black/5">
                <p className="text-xs text-muted">Na loja aparece</p>
                <p className="font-semibold tabular">
                  até {parcelasPermitidas(p.preco, p.limiteParcelas)}x · {reais(Math.round(p.preco * 0.9))} no Pix
                </p>
              </div>
            </div>
          </Card>

          <Card titulo="Frete">
            <div id="frete" className="grid scroll-mt-28 gap-3 sm:grid-cols-5">
              <CampoPainel label="Peso (kg)" defaultValue={p.categoria === "pecas" || p.categoria === "acessorios" || p.categoria === "vestuario" ? "0,4" : "16,0"} />
              <CampoPainel label="Altura (cm)" defaultValue="80" />
              <CampoPainel label="Largura (cm)" defaultValue="25" />
              <CampoPainel label="Comprimento (cm)" defaultValue="150" />
              <CampoPainel label="Manuseio (dias)" defaultValue="1" dica="Montagem e embalagem." />
            </div>
          </Card>

          <Card titulo="SEO">
            <div id="seo" className="grid scroll-mt-28 gap-3">
              <CampoPainel label="Título da página" defaultValue={`${p.nome} | ShopBike`} dica={`${(p.nome + " | ShopBike").length} de 60 caracteres`} />
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink-2">Descrição para o Google</span>
                <textarea value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)} className="h-20 w-full resize-none rounded-xl bg-white p-3 text-sm ring-1 ring-black/10 outline-none focus:ring-2 focus:ring-ink" />
                <span className="text-xs text-muted">{seoDesc.length} de 160 caracteres</span>
              </label>
              <CampoPainel label="URL canônica" defaultValue={`https://shopbike.com.br/p/${slug}`} />
              <div className="rounded-xl bg-white p-4 ring-1 ring-black/5">
                <p className="text-xs text-muted">Prévia no Google</p>
                <p className="mt-1 text-xs text-ok">shopbike.com.br › p › {slug || "…"}</p>
                <p className="text-lg leading-snug text-[#1a0dab]">{p.nome || "Título do produto"} | ShopBike</p>
                <p className="line-clamp-2 text-sm text-muted">{seoDesc || "Descrição…"}</p>
              </div>
            </div>
          </Card>

          <Card titulo="Relacionados e compre junto">
            <div id="relacionados" className="grid scroll-mt-28 gap-4 sm:grid-cols-2">
              {[
                ["Produtos relacionados", produtos.filter((x) => x.categoria === p.categoria && x.id !== p.id).slice(0, 3)],
                ["Compre junto", produtos.filter((x) => ["acessorios", "pecas"].includes(x.categoria)).slice(0, 2)],
              ].map(([t, lista]) => (
                <div key={t as string}>
                  <p className="mb-2 text-sm font-medium">{t as string}</p>
                  <ul className="space-y-1.5">
                    {(lista as Produto[]).map((x) => (
                      <li key={x.id} className="tile flex items-center gap-2 p-2 text-sm">
                        <ProductArt kind={x.art} color={x.cores[0].hex} className="size-9" />
                        <span className="flex-1 truncate">{x.nome}</span>
                        <Icon name="close" className="size-4 text-faint" />
                      </li>
                    ))}
                    <li>
                      <button className="text-sm font-semibold">+ Adicionar</button>
                    </li>
                  </ul>
                </div>
              ))}
            </div>
          </Card>

          {seminova && (
            <Card titulo="Seminova · laudo" tom="red">
              <div id="seminova" className="grid scroll-mt-28 gap-3 sm:grid-cols-2">
                <SelectPainel label="Estado" opcoes={["Excelente", "Muito bom", "Bom", "Regular"]} defaultValue={p.seminova?.estado} />
                <CampoPainel label="Ano do modelo" defaultValue="2023" />
                <label className="block sm:col-span-2">
                  <span className="mb-1.5 block text-sm font-medium text-ink-2">Laudo técnico da oficina</span>
                  <textarea defaultValue={p.seminova?.laudo} className="h-24 w-full resize-none rounded-xl bg-white p-3 text-sm ring-1 ring-black/10" />
                </label>
                <CampoPainel label="Revisado por" defaultValue="Oficina ShopBike · Juliano" />
                <CampoPainel label="Garantia da seminova" defaultValue="90 dias" />
              </div>
            </Card>
          )}

          <Card titulo="Histórico de alterações">
            <ol id="historico" className="scroll-mt-28 space-y-3 text-sm">
              {[
                ["25/11 12:10", "Priscila", "Preço promocional R$ 4.699,00 → R$ 4.499,00 até 30/11"],
                ["25/11 08:10", "Importação", "Etiqueta “Promoção” aplicada (tags-black-friday.xlsx)"],
                ["24/11 13:58", "Bruning", "Estoque 17·Preto 2 → 3"],
                ["20/11 16:30", "Priscila", "3 fotos novas e vídeo adicionados"],
              ].map(([q, quem, o]) => (
                <li key={q + o} className="flex gap-3">
                  <span className="w-24 shrink-0 text-xs text-muted tabular">{q}</span>
                  <span>
                    <strong>{quem}</strong> · {o}
                  </span>
                </li>
              ))}
            </ol>
          </Card>
        </div>

        {/* Lateral */}
        <aside className="space-y-4 xl:sticky xl:top-[96px] xl:self-start">
          <Card titulo="Publicação">
            <SelectPainel label="Status" opcoes={["Ativo", "Inativo", "Rascunho"]} value={status} onChange={(e) => setStatus(e.target.value)} />
            <p className="mt-2 flex items-center gap-1.5 text-sm">
              <span className={cn("size-2 rounded-full", status === "Ativo" ? "bg-ok" : "bg-line-2")} />
              {status === "Ativo" ? "Visível na loja e para a IA" : "Fora da loja"}
            </p>
            <label className="mt-4 flex items-center justify-between text-sm">
              Marcar como seminova
              <Interruptor ligado={seminova} onChange={setSeminova} rotulo="Seminova" />
            </label>
          </Card>
          <Card titulo="Organização">
            <p className="mb-2 text-sm font-medium">Categorias</p>
            <div className="flex flex-wrap gap-1.5">
              {categorias
                .filter((c) => c.slug === p.categoria || (c.slug === "seminovas" && seminova))
                .map((c) => (
                  <Chip key={c.slug} tom="ink">
                    {c.nome} <Icon name="close" className="size-3" />
                  </Chip>
                ))}
              <button className="rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-dashed ring-black/20">+ categoria</button>
            </div>
            <p className="mt-4 mb-2 text-sm font-medium">Etiquetas (selos)</p>
            <div className="flex flex-wrap gap-1.5">
              {["Lançamento", "Promoção", "Seminova", "Exclusivo", "Sob encomenda"].map((s) => (
                <button
                  key={s}
                  aria-pressed={selos.includes(s)}
                  onClick={() => setSelos(selos.includes(s) ? selos.filter((x) => x !== s) : [...selos, s])}
                  className={cn("rounded-full px-2.5 py-1 text-xs font-semibold ring-1", selos.includes(s) ? "bg-red text-white ring-red" : "bg-white ring-black/10")}
                >
                  {s}
                </button>
              ))}
            </div>
            <p className="mt-4 mb-2 text-sm font-medium">Tags</p>
            <input defaultValue="black-friday, aro-29, trilha" className="h-10 w-full rounded-xl bg-white px-3 text-sm ring-1 ring-black/10" aria-label="Tags" />
          </Card>
          <Card titulo="Qualidade do cadastro">
            <div className="flex items-center gap-3">
              <span className={cn("grid size-14 place-items-center rounded-full text-lg font-bold tabular", nota >= 80 ? "bg-ok-50 text-ok" : nota >= 50 ? "bg-warn-50 text-warn" : "bg-red-50 text-red")}>{nota}</span>
              <p className="text-sm text-muted">Cadastro completo vende mais e aparece melhor no Google.</p>
            </div>
            <ul className="mt-3 space-y-1.5 text-sm">
              {checklist.map(([ok, t]) => (
                <li key={t} className="flex items-center gap-2">
                  <Icon name={ok ? "check" : "alert"} className={cn("size-4", ok ? "text-ok" : "text-red")} />
                  {t}
                </li>
              ))}
            </ul>
          </Card>
          {!novo && (
            <Card titulo="Desempenho (30 dias)">
              <dl className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ["Vendas", String(p.vendidos30d)],
                  ["Visitas", String(p.vendidos30d * 41 + 120)],
                  ["Conversão", `${((p.vendidos30d / (p.vendidos30d * 41 + 120)) * 100).toFixed(1)}%`],
                  ["Avise-me", "4"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-xs text-muted">{k}</dt>
                    <dd className="text-lg font-bold tabular">{v}</dd>
                  </div>
                ))}
              </dl>
            </Card>
          )}
        </aside>
      </div>
      {aviso}
    </>
  );
}
