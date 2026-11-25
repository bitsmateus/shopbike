"use client";

import { useState } from "react";
import { blocosHome } from "@/mock/painel";
import { cn } from "@/lib/format";
import { Icon } from "@/ui/icons";
import { ProductArt } from "@/ui/product-art";
import { Abas, Interruptor, InterruptorLocal, useAviso } from "@/ui/painel/controles";
import { Botao, CampoPainel, Card, Chip } from "@/ui/painel/ui";

const abas = ["Home por blocos", "Banners", "Menus", "Aparência"] as const;

export function Vitrine() {
  const [aba, setAba] = useState<(typeof abas)[number]>("Home por blocos");
  return (
    <>
      <div className="mb-4">
        <Abas abas={abas} ativa={aba} onChange={setAba} />
      </div>
      {aba === "Home por blocos" && <Home />}
      {aba === "Banners" && <Banners />}
      {aba === "Menus" && <Menus />}
      {aba === "Aparência" && <Aparencia />}
    </>
  );
}

function Home() {
  const [blocos, setBlocos] = useState(blocosHome);
  const [sel, setSel] = useState(blocosHome[1].id);
  const { avisar, aviso } = useAviso();
  const mover = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= blocos.length) return;
    const n = [...blocos];
    [n[i], n[j]] = [n[j], n[i]];
    setBlocos(n);
  };
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_420px]">
      <Card titulo="Blocos da página inicial" ferramentas={<><Botao tom="ghost"><Icon name="plus" className="size-4" /> Bloco</Botao><Botao tom="ink" onClick={() => avisar("Home publicada")}>Publicar</Botao></>}>
        <ol className="space-y-2">
          {blocos.map((b, i) => (
            <li key={b.id}>
              <div
                onClick={() => setSel(b.id)}
                className={cn("tile flex cursor-pointer items-center gap-3 p-3 transition", sel === b.id ? "bg-white ring-2 ring-ink" : "hover:bg-white", !b.ativo && "opacity-60")}
              >
                <span className="flex flex-col">
                  <button onClick={(e) => { e.stopPropagation(); mover(i, -1); }} aria-label="Subir" className="text-faint hover:text-ink">
                    <Icon name="chevronDown" className="size-4 rotate-180" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); mover(i, 1); }} aria-label="Descer" className="text-faint hover:text-ink">
                    <Icon name="chevronDown" className="size-4" />
                  </button>
                </span>
                <span className="w-6 text-center text-sm font-bold text-muted tabular">{i + 1}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">{b.tipo}</span>
                  <span className="block truncate text-xs text-muted">{b.titulo}</span>
                </span>
                <span onClick={(e) => e.stopPropagation()}>
                  <Interruptor ligado={b.ativo} onChange={(v) => setBlocos(blocos.map((x) => (x.id === b.id ? { ...x, ativo: v } : x)))} rotulo={`Mostrar ${b.tipo}`} />
                </span>
              </div>
            </li>
          ))}
        </ol>
      </Card>
      <div className="space-y-4">
        <Card titulo="Prévia (celular)">
          <div className="mx-auto w-[240px] overflow-hidden rounded-[28px] bg-white p-2 shadow-[var(--shadow-pop)] ring-1 ring-black/10">
            <div className="space-y-1.5 rounded-[22px] bg-white p-1.5">
              {blocos
                .filter((b) => b.ativo)
                .map((b) => (
                  <div key={b.id} className={cn("rounded-lg text-[9px] font-semibold", sel === b.id && "ring-2 ring-red")}>
                    {b.tipo === "Barra de benefícios" && <div className="rounded-md bg-snow px-2 py-1 text-muted">Frete grátis · 10% Pix · 21x</div>}
                    {b.tipo === "Banners principais" && (
                      <div className="flex items-center rounded-lg bg-snow p-2">
                        <span className="flex-1 text-[11px] leading-tight font-bold">
                          Sua próxima <span className="text-red">trilha</span>
                        </span>
                        <ProductArt kind="mtb" color="#e30618" className="w-16" />
                      </div>
                    )}
                    {b.tipo === "Faixa de benefícios" && <div className="grid grid-cols-4 gap-1">{[1, 2, 3, 4].map((k) => <span key={k} className="h-5 rounded bg-red-50" />)}</div>}
                    {b.tipo === "Categorias com imagem" && <div className="grid grid-cols-4 gap-1">{[1, 2, 3, 4].map((k) => <span key={k} className="h-7 rounded bg-snow" />)}</div>}
                    {b.tipo === "Vitrine" && (
                      <div>
                        <p className="mb-0.5 px-0.5">{b.titulo.split(" (")[0]}</p>
                        <div className="grid grid-cols-2 gap-1">{[1, 2].map((k) => <span key={k} className="h-10 rounded bg-snow" />)}</div>
                      </div>
                    )}
                    {b.tipo === "Banner secundário" && <div className="rounded-lg bg-ink px-2 py-2.5 text-white">{b.titulo}</div>}
                    {b.tipo === "Vídeo" && <div className="grid h-10 place-items-center rounded-lg bg-cloud">▶</div>}
                    {b.tipo === "Marcas" && <div className="grid grid-cols-4 gap-1">{[1, 2, 3, 4].map((k) => <span key={k} className="h-4 rounded bg-snow" />)}</div>}
                  </div>
                ))}
            </div>
          </div>
        </Card>
        <Card titulo="Bloco selecionado">
          <p className="text-sm">
            <strong>{blocos.find((b) => b.id === sel)?.tipo}</strong> · {blocos.find((b) => b.id === sel)?.titulo}
          </p>
          <div className="mt-3 grid gap-2">
            <CampoPainel label="Título exibido" defaultValue={blocos.find((b) => b.id === sel)?.titulo.split(" (")[0]} key={sel} />
            <label className="flex items-center justify-between text-sm">
              Só no celular <InterruptorLocal inicial={false} rotulo="Só no celular" />
            </label>
            <label className="flex items-center justify-between text-sm">
              Agendar (início e fim) <InterruptorLocal inicial={sel === "b7"} rotulo="Agendar" />
            </label>
          </div>
        </Card>
      </div>
      {aviso}
    </div>
  );
}

function Banners() {
  const banners = [
    { titulo: "Black Friday · MTBs até 20% off", local: "Principal", ordem: 1, periodo: "20/11 a 30/11", cliques: 4_210, ativo: true, cor: "#e30618" },
    { titulo: "Elétricas · 21x de R$ 333", local: "Principal", ordem: 2, periodo: "Sempre", cliques: 1_102, ativo: true, cor: "#1a1917" },
    { titulo: "Oficina · revisão com hora marcada", local: "Secundário", ordem: 1, periodo: "Sempre", cliques: 640, ativo: true, cor: "#fdf0f1" },
    { titulo: "Seminovas com laudo", local: "Listagem (MTB)", ordem: 1, periodo: "Sempre", cliques: 388, ativo: true, cor: "#f7f6f5" },
    { titulo: "Semana Specialized", local: "Principal", ordem: 3, periodo: "01/12 a 07/12", cliques: 0, ativo: false, cor: "#3d7a4a" },
  ];
  return (
    <Card titulo="Banners" ferramentas={<Botao tom="ink"><Icon name="plus" className="size-4" /> Banner</Botao>}>
      <ul className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
        {banners.map((b) => (
          <li key={b.titulo} className={cn("tile overflow-hidden", !b.ativo && "opacity-70")}>
            <div className="flex h-28 items-end p-3" style={{ background: b.cor }}>
              <span className={cn("max-w-[70%] text-sm leading-tight font-bold", ["#e30618", "#1a1917", "#3d7a4a"].includes(b.cor) ? "text-white" : "text-ink")}>{b.titulo}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 p-3 text-xs">
              <Chip>{b.local}</Chip>
              <span className="text-muted">#{b.ordem}</span>
              <span className="text-muted">{b.periodo}</span>
              <span className="ml-auto font-semibold tabular">{b.cliques.toLocaleString("pt-BR")} cliques</span>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted">Envie versões para computador (1920×640) e celular (800×800). As imagens são otimizadas automaticamente.</p>
    </Card>
  );
}

function Menus() {
  const topo = ["Mountain bike", "Speed", "Elétricas", "Urbanas", "Infantil", "Seminovas", "Peças", "Acessórios", "Vestuário", "Black Friday (destaque)", "Oficina"];
  const rodape = [
    ["Comprar", "6 links"],
    ["Atendimento", "5 links"],
    ["ShopBike", "5 links"],
  ];
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card titulo="Menu do topo" ferramentas={<Botao tom="ghost"><Icon name="plus" className="size-4" /> Item</Botao>}>
        <ol className="space-y-1.5">
          {topo.map((m, i) => (
            <li key={m} className="tile flex items-center gap-3 px-3 py-2.5 text-sm">
              <Icon name="menu" className="size-4 text-faint" />
              <span className="w-5 text-muted tabular">{i + 1}</span>
              <span className="flex-1 font-medium">{m}</span>
              {m.includes("destaque") && <Chip tom="ink">Pílula preta</Chip>}
            </li>
          ))}
        </ol>
      </Card>
      <Card titulo="Rodapé">
        <ul className="space-y-1.5">
          {rodape.map(([c, n]) => (
            <li key={c} className="tile flex items-center justify-between px-3 py-2.5 text-sm">
              <span className="font-semibold">{c}</span>
              <span className="text-muted">{n}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 grid gap-2">
          <CampoPainel label="Texto do rodapé" defaultValue="Bikes, peças, acessórios e vestuário em Tubarão/SC." />
          <CampoPainel label="Selos de segurança" defaultValue="Compra protegida com 3D Secure · Site seguro" />
        </div>
      </Card>
    </div>
  );
}

function Aparencia() {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card titulo="Marca">
        <div className="flex flex-wrap gap-3">
          {[
            ["Vermelho (destaque)", "#E30618"],
            ["Preto (texto)", "#1A1917"],
            ["Fundo", "#FFFFFF"],
            ["Superfície", "#F7F6F5"],
          ].map(([n, c]) => (
            <div key={n} className="tile flex items-center gap-2 p-2 pr-3 text-sm">
              <span className="size-9 rounded-lg ring-1 ring-black/10" style={{ background: c }} />
              <span>
                <span className="block font-medium">{n}</span>
                <span className="font-mono text-xs text-muted">{c}</span>
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <CampoPainel label="Logo (topo)" defaultValue="shopbike.png" readOnly />
          <CampoPainel label="Ícone do site (favicon)" defaultValue="icone-sb.png" readOnly />
        </div>
      </Card>
      <Card titulo="Elementos da loja">
        <ul className="space-y-3 text-sm">
          {[
            ["Botão flutuante do WhatsApp", true],
            ["Pop-up de captação de leads", true],
            ["Aviso de cookies (LGPD)", true],
            ["Barra de frete grátis no carrinho", true],
            ["Contador regressivo nas promoções", false],
          ].map(([t, v]) => (
            <li key={t as string} className="flex items-center justify-between">
              {t}
              <InterruptorLocal inicial={v as boolean} rotulo={t as string} />
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
