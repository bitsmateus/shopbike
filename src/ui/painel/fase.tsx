"use client";

import { useEffect, useRef } from "react";
import { Icon } from "@/ui/icons";
import { useAviso } from "./controles";

/** Selo pequeno "Em breve" (relatórios e itens de lista da próxima fase). */
export function BadgeFase2({ texto = "Em breve" }: { texto?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-faint ring-1 ring-line" title="Chega depois da virada da Climba">
      <span className="size-1.5 rounded-full bg-faint" />
      {texto}
    </span>
  );
}

/** Faixa no topo de uma tela que é só prévia. */
export function FaixaPrevia({ texto = "Esta área entra na próxima fase. Os dados são de exemplo e as ações que alteram dados estão desativadas." }: { texto?: string }) {
  return (
    <p className="mb-4 flex items-center gap-2 rounded-[var(--radius-tile)] bg-info-50 px-3.5 py-2.5 text-sm font-medium text-ink">
      <Icon name="info" className="size-4 shrink-0 text-info" />
      <span>
        <strong className="font-semibold">Prévia</strong> · {texto}
      </span>
    </p>
  );
}

/* Botões que só leem ou navegam continuam ativos numa prévia. */
const LEITURA = "[data-leitura],[role=tab],[aria-pressed],[aria-label='Fechar']";

/**
 * Área de prévia: mostra a faixa e desativa os botões que alterariam dados
 * (aria-disabled + dica "Disponível na próxima fase"). Abrir detalhe, filtrar e fechar
 * continuam funcionando; para isso, o botão leva data-leitura.
 */
export function AreaPrevia({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { avisar, aviso } = useAviso();

  useEffect(() => {
    const area = ref.current;
    if (!area) return;
    const marcar = () =>
      area.querySelectorAll<HTMLButtonElement>("button").forEach((b) => {
        if (b.matches(LEITURA) || b.dataset.previa) return;
        b.dataset.previa = "1";
        b.setAttribute("aria-disabled", "true");
        b.title = b.title ? `${b.title} · disponível na próxima fase` : "Disponível na próxima fase";
      });
    marcar();
    const obs = new MutationObserver(marcar);
    obs.observe(area, { childList: true, subtree: true });
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="area-previa"
      onClickCapture={(e) => {
        const b = (e.target as HTMLElement).closest("button");
        if (b && b.dataset.previa) {
          e.preventDefault();
          e.stopPropagation();
          avisar("Disponível na próxima fase · nesta prévia nada é alterado");
        }
      }}
    >
      <FaixaPrevia />
      {children}
      {aviso}
    </div>
  );
}
