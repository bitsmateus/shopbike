"use client";

import { useState } from "react";
import { arvoreCategorias, marcasCatalogo } from "@/mock/painel";
import { cn, numero } from "@/lib/format";
import { Icon } from "@/ui/icons";
import { Abas, Interruptor, useAviso } from "@/ui/painel/controles";
import { Botao, CampoPainel, Card, Chip, SelectPainel } from "@/ui/painel/ui";

const abas = ["Categorias", "Marcas", "Tabelas de tamanho", "Etiquetas e tags"] as const;

export function Categorias() {
  const [aba, setAba] = useState<(typeof abas)[number]>("Categorias");
  return (
    <>
      <div className="mb-4">
        <Abas abas={abas} ativa={aba} onChange={setAba} />
      </div>
      {aba === "Categorias" && <Arvore />}
      {aba === "Marcas" && <Marcas />}
      {aba === "Tabelas de tamanho" && <Tabelas />}
      {aba === "Etiquetas e tags" && <Etiquetas />}
    </>
  );
}

function Arvore() {
  const [sel, setSel] = useState("Mountain bike");
  const [abertas, setAbertas] = useState<string[]>(["Bicicletas", "Peças"]);
  const { avisar, aviso } = useAviso();
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_420px]">
      <Card titulo="Árvore" ferramentas={<Botao tom="ink"><Icon name="plus" className="size-4" /> Categoria</Botao>}>
        <ul className="space-y-1">
          {arvoreCategorias.map((raiz) => (
            <li key={raiz.nome}>
              <button
                onClick={() => setAbertas(abertas.includes(raiz.nome) ? abertas.filter((x) => x !== raiz.nome) : [...abertas, raiz.nome])}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left font-bold hover:bg-white"
              >
                <Icon name="chevronDown" className={cn("size-4 transition", !abertas.includes(raiz.nome) && "-rotate-90")} />
                {raiz.nome}
                <span className="ml-auto text-xs font-normal text-muted tabular">{numero(raiz.produtos)} produtos</span>
              </button>
              {abertas.includes(raiz.nome) && (
                <ul className="ml-6 border-l border-black/10 pl-2">
                  {raiz.filhos.map((f) => (
                    <li key={f.nome}>
                      <button onClick={() => setSel(f.nome)} className={cn("flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm", sel === f.nome ? "bg-ink text-white" : "hover:bg-white")}>
                        <Icon name="menu" className="size-3.5 opacity-40" />
                        <span className="font-semibold">{f.nome}</span>
                        {f.filhos.length > 0 && <span className={cn("text-xs", sel === f.nome ? "text-white/60" : "text-faint")}>{f.filhos.join(" · ")}</span>}
                        <span className={cn("ml-auto text-xs tabular", sel === f.nome ? "text-white/70" : "text-muted")}>{numero(f.produtos)}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted">Arraste para reordenar ou mudar de nível. A ordem vale para o menu da loja.</p>
      </Card>
      <Card titulo={sel}>
        <div className="space-y-3">
          <CampoPainel label="Nome" defaultValue={sel} key={sel} />
          <CampoPainel label="Slug" defaultValue={"/c/" + sel.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, "-")} key={sel + "s"} dica="Mudar cria 301 automático." />
          <SelectPainel label="Categoria pai" opcoes={arvoreCategorias.map((r) => r.nome)} />
          <div>
            <span className="mb-1.5 block text-sm font-medium text-ink-2">Imagem da categoria</span>
            <div className="grid h-28 place-items-center rounded-2xl border-2 border-dashed border-black/15 text-sm text-muted">Arraste a imagem (usada na home)</div>
          </div>
          <SelectPainel label="Tabela de tamanhos padrão" opcoes={["Quadro MTB (15 a 21)", "Quadro speed (50 a 58)", "Vestuário P a GG", "Nenhuma"]} />
          <SelectPainel label="Filtros exibidos na loja" opcoes={["Marca, aro, tamanho, preço, cor", "Marca, preço", "Marca, tamanho, cor"]} />
          <CampoPainel label="Título SEO" defaultValue={`${sel} | ShopBike`} key={sel + "t"} />
          <div className="flex items-center justify-between text-sm">
            Mostrar no menu da loja <Interruptor ligado onChange={() => avisar("Menu atualizado")} rotulo="Mostrar no menu" />
          </div>
        </div>
        <div className="mt-5 flex gap-2">
          <Botao tom="ink" onClick={() => avisar("Categoria salva")}>
            Salvar
          </Botao>
          <Botao tom="ghost" className="text-danger">
            Excluir
          </Botao>
        </div>
      </Card>
      {aviso}
    </div>
  );
}

function Marcas() {
  return (
    <Card titulo="Marcas" ferramentas={<Botao tom="ink"><Icon name="plus" className="size-4" /> Marca</Botao>} className="overflow-hidden">
      <div className="-mx-5 overflow-x-auto">
        <table className="tabela min-w-[640px]">
          <thead>
            <tr>
              <th>Marca</th>
              <th className="text-right">Produtos</th>
              <th>Origem</th>
              <th>Página da marca</th>
              <th>Parcelamento</th>
            </tr>
          </thead>
          <tbody>
            {marcasCatalogo.map((m) => (
              <tr key={m.nome}>
                <td>
                  <span className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-xl bg-white text-xs font-bold ring-1 ring-black/5">{m.nome.slice(0, 2).toUpperCase()}</span>
                    <span className="font-semibold">{m.nome}</span>
                  </span>
                </td>
                <td className="text-right tabular">{numero(m.produtos)}</td>
                <td>
                  <Chip tom="info">Bruning</Chip>
                </td>
                <td className="text-sm text-muted">/marca/{m.nome.toLowerCase()}</td>
                <td>{m.nome === "Specialized" ? <Chip tom="warn">até 12x</Chip> : <Chip>regra geral</Chip>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function Tabelas() {
  const tabelas = [
    { nome: "Quadro MTB (15 a 21)", usa: "Mountain bike, Seminovas", linhas: [["15 / S", "1,55 a 1,65 m", "68 a 74 cm"], ["17 / M", "1,65 a 1,75 m", "74 a 80 cm"], ["19 / L", "1,75 a 1,85 m", "80 a 86 cm"], ["21 / XL", "1,85 a 1,95 m", "86 a 92 cm"]] },
    { nome: "Quadro speed (50 a 58)", usa: "Speed", linhas: [["50", "1,58 a 1,68 m", "72 a 77 cm"], ["54", "1,70 a 1,78 m", "78 a 83 cm"], ["58", "1,82 a 1,92 m", "85 a 90 cm"]] },
    { nome: "Vestuário P a GG", usa: "Vestuário", linhas: [["P", "Tórax 88–94", "Cintura 74–80"], ["M", "Tórax 94–100", "Cintura 80–86"], ["G", "Tórax 100–106", "Cintura 86–92"], ["GG", "Tórax 106–112", "Cintura 92–98"]] },
  ];
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {tabelas.map((t) => (
        <Card key={t.nome} titulo={t.nome} ferramentas={<Botao tom="ghost">Editar</Botao>}>
          <p className="-mt-2 mb-3 text-xs text-muted">Usada em: {t.usa}</p>
          <table className="w-full overflow-hidden rounded-xl text-sm ring-1 ring-black/5">
            <tbody className="divide-y divide-black/5 bg-white">
              {t.linhas.map((l) => (
                <tr key={l[0]}>
                  {l.map((c, i) => (
                    <td key={c} className={cn("px-3 py-2 tabular", i === 0 && "font-bold")}>
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      ))}
    </div>
  );
}

function Etiquetas() {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card titulo="Etiquetas (selos na foto)" ferramentas={<Botao tom="ink"><Icon name="plus" className="size-4" /> Etiqueta</Botao>}>
        <ul className="space-y-2">
          {[
            ["Promoção", "bg-red text-white", "Automática quando há preço promocional", 214],
            ["Lançamento", "bg-white ring-1 ring-black/15", "Automática por 30 dias após o cadastro", 38],
            ["Seminova", "bg-ink text-white", "Produtos marcados como seminova", 81],
            ["Exclusivo", "bg-snow ring-1 ring-black/10", "Manual", 12],
            ["Sob encomenda", "bg-snow ring-1 ring-black/10", "Manual", 9],
          ].map(([n, cls, regra, q]) => (
            <li key={n as string} className="tile flex items-center gap-3 p-3">
              <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", cls as string)}>{n}</span>
              <span className="flex-1 text-sm text-muted">{regra}</span>
              <span className="text-sm font-semibold tabular">{q}</span>
            </li>
          ))}
        </ul>
      </Card>
      <Card titulo="Tags (filtros e campanhas)">
        <div className="flex flex-wrap gap-2">
          {["black-friday", "aro-29", "aro-27-5", "trilha", "xc", "enduro", "urbano", "presente", "kids", "tubeless", "12v", "mips", "seminova-com-laudo"].map((t) => (
            <span key={t} className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-sm ring-1 ring-black/10">
              #{t} <Icon name="close" className="size-3 text-faint" />
            </span>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted">Tags não aparecem para o cliente. Servem para promoção em massa, vitrines automáticas e busca.</p>
      </Card>
    </div>
  );
}
