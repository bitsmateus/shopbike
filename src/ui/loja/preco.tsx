import { reais } from "@/lib/format";
import { parcelasPermitidas, precoAVista, valorParcela } from "@/modules/precos/parcelamento";

export function Preco({ preco, precoDe, limite, tamanho = "md" }: { preco: number; precoDe?: number; limite?: number; tamanho?: "md" | "lg" }) {
  const n = parcelasPermitidas(preco, limite);
  const lg = tamanho === "lg";
  return (
    <div className="tabular">
      {precoDe && precoDe > preco && <div className={lg ? "text-sm text-faint line-through" : "text-xs text-faint line-through"}>{reais(precoDe)}</div>}
      <div className={lg ? "text-3xl font-bold tracking-tight" : "text-lg font-bold tracking-tight"}>{reais(preco)}</div>
      {n > 1 && (
        <div className={lg ? "text-base text-muted" : "text-[13px] text-muted"}>
          em até <strong className="font-semibold text-ink">{n}x</strong> de <strong className="font-semibold text-ink">{reais(valorParcela(preco, n))}</strong> sem juros
        </div>
      )}
      <div className={lg ? "mt-1 text-base font-semibold text-ok" : "text-[13px] font-semibold text-ok"}>{reais(precoAVista(preco))} no Pix</div>
    </div>
  );
}
