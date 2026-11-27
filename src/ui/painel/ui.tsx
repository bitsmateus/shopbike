import { cn, numero, pct, reais, reaisCurto } from "@/lib/format";
import type { Faixa } from "@/modules/antifraude/nota";
import type { StatusPedido } from "@/mock/operacao";
import { Icon, type IconName } from "@/ui/icons";

export function Card({ titulo, ferramentas, className, children, tom }: { titulo?: string; ferramentas?: React.ReactNode; className?: string; children: React.ReactNode; tom?: "red" }) {
  return (
    <section className={cn("glass rise min-w-0 rounded-[var(--radius-card)] p-4", tom === "red" && "bg-[linear-gradient(160deg,#fdf0f1cc,#ffffffb3)]", className)}>
      {(titulo || ferramentas) && (
        <div className="mb-3 flex items-center justify-between gap-3">
          {titulo && <h2 className="text-[15px] font-bold">{titulo}</h2>}
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
    <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
      <h1 className="text-2xl leading-tight font-bold tracking-tight">{titulo}</h1>
      {kpis && (
        <dl className="flex flex-wrap gap-x-6 gap-y-2">
          {kpis.map((k) => (
            <div key={k.rotulo} className="flex items-center gap-2.5">
              <span className="glass hidden size-8 place-items-center rounded-full sm:grid">
                <Icon name={k.icon} className="size-4" />
              </span>
              <div>
                <dt className="text-xs text-muted">{k.rotulo}</dt>
                <dd className="text-base leading-tight font-bold tabular">{k.valor}</dd>
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
    <span className={cn("inline-flex items-center gap-1.5 rounded-full font-bold tabular", cor, grande ? "px-3 py-1.5 text-lg" : "px-2.5 py-1 text-xs")}>
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
    <div className="tile px-3 py-2.5">
      <div className="text-xs font-medium text-muted">{rotulo}</div>
      <div className="mt-0.5 text-xl leading-tight font-bold tabular">{txt}</div>
      <div className={cn("mt-1 inline-flex items-center gap-1 text-xs font-semibold", bom ? "text-ok" : "text-red")}>
        <Icon name={sobe ? "arrowUp" : "arrowDown"} className="size-3.5" />
        {Math.abs(variacao).toLocaleString("pt-BR")}% vs. out
      </div>
      {meta && (
        <div className="mt-2">
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

export type Tom = "ok" | "warn" | "red" | "info" | "neutro" | "ink" | "apagado";
const tons: Record<Tom, string> = {
  ok: "bg-ok-50 text-ok",
  warn: "bg-warn-50 text-warn",
  red: "bg-red-50 text-red",
  info: "bg-info-50 text-info",
  neutro: "bg-white text-ink-2 ring-1 ring-black/5",
  ink: "bg-ink text-white",
  apagado: "bg-cloud text-faint",
};

export function Chip({ tom = "neutro", children }: { tom?: Tom; children: React.ReactNode }) {
  return <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap", tons[tom])}>{children}</span>;
}

export function CampoPainel({ label, dica, className, ...rest }: { label: string; dica?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-sm font-medium text-ink-2">{label}</span>
      <input {...rest} className="h-10 w-full rounded-xl bg-white px-3 text-sm ring-1 ring-black/10 outline-none transition read-only:bg-snow read-only:text-muted focus:ring-2 focus:ring-ink" />
      {dica && <span className="mt-1 block text-xs text-muted">{dica}</span>}
    </label>
  );
}

export function SelectPainel({ label, opcoes, className, ...rest }: { label: string; opcoes: string[] } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-sm font-medium text-ink-2">{label}</span>
      <select {...rest} className="h-10 w-full rounded-xl bg-white px-3 text-sm ring-1 ring-black/10 outline-none focus:ring-2 focus:ring-ink">
        {opcoes.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

export function Vazio({ icone = "check", titulo, texto }: { icone?: IconName; titulo: string; texto?: string }) {
  return (
    <div className="py-12 text-center">
      <span className="mx-auto grid size-12 place-items-center rounded-full bg-white ring-1 ring-black/5">
        <Icon name={icone} className="size-5 text-muted" />
      </span>
      <p className="mt-3 font-semibold">{titulo}</p>
      {texto && <p className="mt-1 text-sm text-muted">{texto}</p>}
    </div>
  );
}
