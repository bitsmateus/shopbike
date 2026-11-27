/** Selo para telas da Fase 2 (evolução), mostradas no protótipo para o cliente ver o sistema inteiro. */
export function BadgeFase2({ texto = "Em breve" }: { texto?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-faint ring-1 ring-line" title="Chega depois da virada da Climba">
      <span className="size-1.5 rounded-full bg-faint" />
      {texto}
    </span>
  );
}
