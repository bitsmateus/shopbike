"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type ItemCarrinho = { slug: string; sku: string; nome: string; tamanho: string; cor: string; preco: number; qtd: number };

type Ctx = {
  itens: ItemCarrinho[];
  adicionar: (i: ItemCarrinho) => void;
  alterarQtd: (sku: string, qtd: number) => void;
  remover: (sku: string) => void;
  limpar: () => void;
  subtotal: number;
  quantidade: number;
  aberto: boolean;
  setAberto: (v: boolean) => void;
};

const CarrinhoCtx = createContext<Ctx | null>(null);
const CHAVE = "shopbike:carrinho:prototipo";

export function CarrinhoProvider({ children }: { children: React.ReactNode }) {
  const [itens, setItens] = useState<ItemCarrinho[]>([]);
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    try {
      const salvo = localStorage.getItem(CHAVE);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hidratação do carrinho salvo
      if (salvo) setItens(JSON.parse(salvo));
    } catch {}
  }, []);

  const salvar = useCallback((novo: ItemCarrinho[]) => {
    setItens(novo);
    try {
      localStorage.setItem(CHAVE, JSON.stringify(novo));
    } catch {}
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      itens,
      adicionar: (i) => {
        const existe = itens.find((x) => x.sku === i.sku);
        salvar(existe ? itens.map((x) => (x.sku === i.sku ? { ...x, qtd: x.qtd + i.qtd } : x)) : [...itens, i]);
        setAberto(true);
      },
      alterarQtd: (sku, qtd) => salvar(itens.map((x) => (x.sku === sku ? { ...x, qtd: Math.max(1, qtd) } : x))),
      remover: (sku) => salvar(itens.filter((x) => x.sku !== sku)),
      limpar: () => salvar([]),
      subtotal: itens.reduce((s, x) => s + x.preco * x.qtd, 0),
      quantidade: itens.reduce((s, x) => s + x.qtd, 0),
      aberto,
      setAberto,
    }),
    [itens, aberto, salvar],
  );

  return <CarrinhoCtx.Provider value={value}>{children}</CarrinhoCtx.Provider>;
}

export function useCarrinho() {
  const ctx = useContext(CarrinhoCtx);
  if (!ctx) throw new Error("useCarrinho fora do CarrinhoProvider");
  return ctx;
}
