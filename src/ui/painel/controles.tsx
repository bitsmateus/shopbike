"use client";

import { useCallback, useState } from "react";
import { cn } from "@/lib/format";
import { Icon } from "@/ui/icons";

/** Abas em cápsula (padrão Solvik). */
export function Abas<T extends string>({ abas, ativa, onChange, contagem }: { abas: readonly T[]; ativa: T; onChange: (a: T) => void; contagem?: Partial<Record<T, number>> }) {
  return (
    <div className="glass scrollbar-none inline-flex max-w-full overflow-x-auto rounded-full p-1" role="tablist">
      {abas.map((a) => (
        <button
          key={a}
          role="tab"
          aria-selected={ativa === a}
          onClick={() => onChange(a)}
          className={cn("shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold transition", ativa === a ? "bg-ink text-white" : "text-ink-2 hover:bg-white/70")}
        >
          {a}
          {contagem?.[a] != null && <span className={cn("ml-1.5 text-xs tabular", ativa === a ? "text-white/70" : "text-faint")}>{contagem[a]}</span>}
        </button>
      ))}
    </div>
  );
}

export function Interruptor({ ligado, onChange, rotulo }: { ligado: boolean; onChange: (v: boolean) => void; rotulo: string }) {
  return (
    <button role="switch" aria-checked={ligado} aria-label={rotulo} onClick={() => onChange(!ligado)} className={cn("relative h-6 w-11 shrink-0 rounded-full transition", ligado ? "bg-ink" : "bg-line-2")}>
      <span className={cn("absolute top-0.5 size-5 rounded-full bg-white shadow transition-all", ligado ? "left-[22px]" : "left-0.5")} />
    </button>
  );
}

/** Aviso temporário (toast). */
export function useAviso() {
  const [texto, setTexto] = useState("");
  const avisar = useCallback((t: string) => {
    setTexto(t);
    setTimeout(() => setTexto(""), 3200);
  }, []);
  const aviso = texto ? (
    <div role="status" className="rise fixed bottom-24 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-white shadow-[var(--shadow-pop)] md:bottom-8">
      <Icon name="check" className="size-4 text-[#b8e65a]" />
      {texto}
    </div>
  ) : null;
  return { avisar, aviso };
}

/** Painel lateral de detalhe (drawer). */
export function Gaveta({ titulo, sub, fechar, children, rodape, largura = "max-w-2xl" }: { titulo: React.ReactNode; sub?: React.ReactNode; fechar: () => void; children: React.ReactNode; rodape?: React.ReactNode; largura?: string }) {
  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal aria-label={typeof titulo === "string" ? titulo : "Detalhe"}>
      <button className="absolute inset-0 bg-ink/20" aria-label="Fechar" onClick={fechar} />
      <aside className={cn("glass-strong drawer-in absolute inset-y-2 right-2 flex w-[calc(100%-16px)] flex-col overflow-hidden rounded-[26px]", largura)}>
        <header className="flex items-start gap-3 border-b border-black/5 p-5">
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold tracking-tight">{titulo}</h2>
            {sub && <div className="mt-1 text-sm text-muted">{sub}</div>}
          </div>
          <button onClick={fechar} className="grid size-10 shrink-0 place-items-center rounded-full bg-white ring-1 ring-black/5" aria-label="Fechar">
            <Icon name="close" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
        {rodape && <footer className="flex flex-wrap justify-end gap-2 border-t border-black/5 p-4">{rodape}</footer>}
      </aside>
    </div>
  );
}

/** Interruptor que guarda o próprio estado (ajustes de tela no protótipo). */
export function InterruptorLocal({ inicial, rotulo }: { inicial: boolean; rotulo: string }) {
  const [v, setV] = useState(inicial);
  return <Interruptor ligado={v} onChange={setV} rotulo={rotulo} />;
}
