import { cn, numero, pct, reais, reaisCurto } from "@/lib/format";
import type { Faixa } from "@/modules/antifraude/nota";
import type { StatusPedido } from "@/mock/operacao";
import { Icon, type IconName } from "@/ui/icons";

export function Card({ titulo, ferramentas, className, children, tom }: { titulo?: string; ferramentas?: React.ReactNode; className?: string; children: React.ReactNode; tom?: "red" }) {
  return (
    <section className={cn("glass rise min-w-0 rounded-[var(--radius-card)] p-5", tom === "red" && "bg-[linear-gradient(160deg,#fdf0f1cc,#ffffffb3)]", className)}>
      {(titulo || ferramentas) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {titulo && <h2 className="text-lg font-bold tracking-tight">{titulo}</h2>}
          {ferramentas && <div className="flex items-center gap-1.5">{ferramentas}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

export function BotaoIcone({ icon, rotulo, onClick }: { icon: IconName; rotulo: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="grid size-9 place-items-center rounded-full bg-white/70 ring-1 ring-black/5 transition hover:bg-white" aria-label={rotulo} title={rotulo}>
      <Icon name={icon} className="size-4" />
    </button>
  );
}

export function Cabecalho({ titulo, kpis, acoes }: { titulo: string; kpis?: { icon: IconName; rotulo: string; valor: string }[]; acoes?: React.ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
      <h1 className="text-[clamp(30px,3.4vw,48px)] leading-none font-bold tracking-tight">{titulo}</h1>
      {kpis && (
        <dl className="flex flex-wrap gap-x-7 gap-y-3">
          {kpis.map((k) => (
            <div key={k.rotulo} className="flex items-center gap-2.5">
              <span className="glass hidden size-10 place-items-center rounded-full sm:grid">
                <Icon name={k.icon} className="size-[18px]" />
              </span>
              <div>
                <dt className="text-xs text-muted">{k.rotulo}</dt>
                <dd className="text-lg leading-tight font-bold tabular">{k.valor}</dd>
              </div>
            </div>
          ))}
        </dl>
      )}
      {acoes && <div className="flex flex-wrap gap-2">{acoes}</div>}
    </div>
  );
}

export function Botao({ children, tom = "ink", className, ...rest }: { tom?: "ink" | "red" | "ghost" } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold transition disabled:opacity-50",
        tom === "ink" && "bg-ink text-white hover:bg-ink-2",
        tom === "red" && "bg-red text-white hover:bg-red-600",
        tom === "ghost" && "bg-white/70 ring-1 ring-black/10 hover:bg-white",
        className,
      )}
    >
      {children}
    </button>
  );
}

const coresStatus: Record<StatusPedido, string> = {
  "Aguardando pagamento": "bg-warn-50 text-warn",
  "Em análise": "bg-red-50 text-red",
  Pago: "bg-info-50 text-info",
  "Em separação": "bg-info-50 text-info",
  Faturado: "bg-cloud text-ink-2",
  Autorizado: "bg-cloud text-ink-2",
  Enviado: "bg-ok-50 text-ok",
  Entregue: "bg-ok-50 text-ok",
  Cancelado: "bg-cloud text-faint",
  Bloqueado: "bg-ink text-white",
};

export function StatusChip({ status }: { status: StatusPedido }) {
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap", coresStatus[status])}>{status}</span>;
}

export function NotaRisco({ nota, faixa, grande }: { nota: number; faixa: Faixa; grande?: boolean }) {
  const cor = faixa === "aprova" ? "text-ok bg-ok-50" : faixa === "revisao" ? "text-warn bg-warn-50" : "text-white bg-red";
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full font-bold tabular", cor, grande ? "px-4 py-2 text-2xl" : "px-2.5 py-1 text-xs")}>
      <span className={cn("rounded-full", grande ? "size-2.5" : "size-1.5", faixa === "bloqueia" ? "bg-white" : "bg-current")} />
      {nota}
    </span>
  );
}

export function Kpi({ rotulo, valor, tipo, variacao, meta }: { rotulo: string; valor: number; tipo: "dinheiro" | "numero" | "pct"; variacao: number; meta?: number }) {
  const txt = tipo === "dinheiro" ? reaisCurto(valor) : tipo === "pct" ? pct(valor, 2) : numero(valor);
  const sobe = variacao >= 0;
  const bom = rotulo.includes("abandonados") ? !sobe : sobe;
  return (
    <div className="tile p-4">
      <div className="text-sm text-muted">{rotulo}</div>
      <div className="mt-1 text-[26px] leading-tight font-bold tracking-tight tabular">{txt}</div>
      <div className={cn("mt-1 inline-flex items-center gap-1 text-xs font-semibold", bom ? "text-ok" : "text-red")}>
        <Icon name={sobe ? "arrowUp" : "arrowDown"} className="size-3.5" />
        {Math.abs(variacao).toLocaleString("pt-BR")}% vs. out
      </div>
      {meta && (
        <div className="mt-3">
          <div className="flex justify-between text-[11px] text-muted">
            <span>Meta {reaisCurto(meta)}</span>
            <span className="tabular">{Math.round((valor / meta) * 100)}%</span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-black/5">
            <div className="h-full rounded-full bg-red" style={{ width: `${Math.min(100, (valor / meta) * 100)}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}

export { reais };
