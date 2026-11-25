/** Selo para telas da Fase 2 (evolução), mostradas no protótipo para o cliente ver o sistema inteiro. */
export function BadgeFase2({ texto = "Fase 2" }: { texto?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-info-50 px-3 py-1.5 text-xs font-bold text-info ring-1 ring-info/20" title="Entra depois da virada da Climba">
      <span className="size-1.5 rounded-full bg-info" />
      {texto}
    </span>
  );
}
