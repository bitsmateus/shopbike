import Link from "next/link";
import { cn, numero, pct, reais, reaisCurto } from "@/lib/format";
import type { Faixa } from "@/modules/antifraude/nota";
import type { StatusPedido } from "@/mock/operacao";
import { Icon, type IconName } from "@/ui/icons";

export function Card({ titulo, ferramentas, className, children, tom }: { titulo?: string; ferramentas?: React.ReactNode; className?: string; children: React.ReactNode; tom?: "red" }) {
  return (
    <section className={cn("glass rise min-w-0 rounded-[var(--radius-card)] p-4", tom === "red" && "bg-[linear-gradient(160deg,var(--color-red-50),var(--color-paper)_55%)]", className)}>
      {(titulo || ferramentas) && (
        <div className="mb-3 flex items-center justify-between gap-3">
          {titulo && <h2 className="text-base font-bold">{titulo}</h2>}
          {ferramentas && <div className="-my-1.5 flex items-center gap-1.5">{ferramentas}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

/** Link padrão de card ("Ver todos", "Relatório"): 13px/600, chevron e área de clique de 32px. */
export function LinkCard({ href, children, tom, icone }: { href: string; children: React.ReactNode; tom?: "erro"; icone?: IconName }) {
  return (
    <Link
      href={href}
      className={cn(
        "-mx-2 inline-flex min-h-8 items-center gap-1 rounded-full px-2 py-1.5 text-[13px] font-semibold",
        tom === "erro" ? "text-danger hover:bg-danger-50" : "text-ink hover:bg-snow",
      )}
    >
      {icone && <Icon name={icone} className="size-3.5" />}
      {children}
      <Icon name="chevronRight" className="size-3.5" />
    </Link>
  );
}

/** Nome do canal por extenso, igual em gráficos, listas e relatórios. */
export const nomeCanal: Record<string, string> = { Site: "Site", Link: "Link do vendedor", IA: "IA no WhatsApp" };

export function BotaoIcone({ icon, rotulo, onClick }: { icon: IconName; rotulo: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="grid size-9 place-items-center rounded-full bg-snow ring-1 ring-black/5 transition hover:bg-white" aria-label={rotulo} title={rotulo}>
      <Icon name={icon} className="size-4" />
    </button>
  );
}

export function Cabecalho({ titulo, kpis, acoes }: { titulo: string; kpis?: { icon: IconName; rotulo: string; valor: string; href?: string }[]; acoes?: React.ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
      <h1 className="text-2xl leading-tight font-bold tracking-tight">{titulo}</h1>
      {kpis && (
        <dl className="flex flex-wrap gap-x-6 gap-y-2">
          {kpis.map((k) => (
            <div key={k.rotulo} className={cn("relative flex items-center gap-2.5", k.href && "clicavel -mx-2 -my-1 rounded-full px-2 py-1")}>
              <span className="glass hidden size-8 place-items-center rounded-full sm:grid">
                <Icon name={k.icon} className="size-4" />
              </span>
              <div>
                <dt className="text-xs font-medium text-muted">{k.rotulo}</dt>
                <dd className="text-base leading-tight font-bold tabular">{k.valor}</dd>
              </div>
              {k.href && <Link href={k.href} className="absolute inset-0 rounded-full" aria-label={`${k.rotulo}: ${k.valor}. Abrir detalhes`} />}
            </div>
          ))}
        </dl>
      )}
      {acoes && <div className="flex flex-wrap gap-2">{acoes}</div>}
    </div>
  );
}

/**
 * Botões. Primário = preto (o vermelho da marca não é cor de botão).
 * "perigo" só para ação destrutiva (recusar, excluir). Tamanhos: página 40px, card/linha 36px.
 */
export function Botao({ children, tom = "ink", tamanho = "pagina", className, ...rest }: { tom?: "ink" | "perigo" | "ghost"; tamanho?: "pagina" | "card" } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition disabled:opacity-50",
        tamanho === "pagina" ? "h-10 px-4" : "h-9 px-3.5",
        tom === "ink" && "bg-ink text-white hover:bg-ink-2",
        tom === "perigo" && "bg-danger text-white hover:bg-danger/90",
        tom === "ghost" && "bg-white ring-1 ring-black/10 hover:bg-snow",
        className,
      )}
    >
      {children}
    </button>
  );
}

/* ---------- Mapa único de significado ---------- */
/* Usado nos badges de status (Pedidos, Visão geral, drawer) e nas colunas da Expedição. */
export type Significado = "sucesso" | "alerta" | "erro" | "info" | "neutroForte" | "neutro" | "destaque";

/** Fundo claro + texto (badges). */
export const corSignificado: Record<Significado, string> = {
  sucesso: "bg-ok-50 text-ok",
  alerta: "bg-warn-50 text-warn",
  erro: "bg-danger-50 text-danger",
  info: "bg-info-50 text-info",
  neutroForte: "bg-cloud text-ink-2",
  neutro: "bg-cloud text-faint",
  destaque: "bg-ink text-white",
};

/** Cor sólida (bolinhas e marcadores). */
export const pontoSignificado: Record<Significado, string> = {
  sucesso: "bg-ok",
  alerta: "bg-warn",
  erro: "bg-danger",
  info: "bg-info",
  neutroForte: "bg-faint",
  neutro: "bg-faint",
  destaque: "bg-ink",
};

/* Verde = pago/entregue · âmbar = esperando alguém · vermelho escuro = barrado ·
   azul = em andamento (separação, em trânsito) · cinza = etapa fiscal ou encerrado. */
export const significadoStatus: Record<StatusPedido, Significado> = {
  "Aguardando pagamento": "alerta",
  "Em análise": "alerta",
  Pago: "sucesso",
  "Em separação": "info",
  Faturado: "neutroForte",
  Autorizado: "neutroForte",
  Enviado: "info",
  Entregue: "sucesso",
  Cancelado: "neutro",
  Bloqueado: "erro",
};

export function StatusChip({ status }: { status: StatusPedido }) {
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap", corSignificado[significadoStatus[status]])}>{status}</span>;
}

/**
 * Risco em tabela: só o número, cor a partir de 40.
 * < 40 cinza · 40 a 69 ponto âmbar · 70 ou mais badge de erro.
 */
export function RiscoNumero({ nota }: { nota: number }) {
  const titulo = `Nota de risco ${nota} de 100`;
  if (nota >= 70) return <span title={titulo} className="inline-flex rounded-full bg-danger-50 px-2 py-0.5 text-sm font-semibold text-danger tabular">{nota}</span>;
  if (nota >= 40)
    return (
      <span title={titulo} className="inline-flex items-center gap-1.5 text-sm font-semibold text-warn tabular">
        <span className="size-1.5 rounded-full bg-current" />
        {nota}
      </span>
    );
  return <span title={titulo} className="text-sm font-semibold text-faint tabular">{nota}</span>;
}

/**
 * Barra de ações em lote: flutua fixa no rodapé, centralizada, sem empurrar o conteúdo.
 * Mesma em Pedidos e Expedição. Primeira ação = primária (branca); "Limpar seleção" como link.
 */
export function BarraLote({ texto, acoes, limpar }: { texto: string; acoes: { rotulo: string; icone?: IconName; onClick: () => void }[]; limpar: () => void }) {
  return (
    <div role="region" aria-label="Ações em lote" className="rise fixed bottom-24 left-1/2 z-50 flex max-w-[calc(100vw-24px)] -translate-x-1/2 items-center gap-2 rounded-full bg-ink py-2 pr-2 pl-5 text-sm text-white shadow-[0_12px_32px_-12px_rgb(26_25_23/0.5)] md:bottom-6">
      <strong className="mr-1 font-semibold whitespace-nowrap">{texto}</strong>
      {acoes.map((a, i) => (
        <button
          key={a.rotulo}
          onClick={a.onClick}
          className={cn(
            "inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 font-semibold whitespace-nowrap",
            i === 0 ? "bg-white text-ink hover:bg-snow" : "text-white ring-1 ring-white/25 hover:bg-white/10",
          )}
        >
          {a.icone && <Icon name={a.icone} className="size-4" />}
          {a.rotulo}
        </button>
      ))}
      <button onClick={limpar} className="h-9 rounded-full px-3 font-semibold whitespace-nowrap text-white/75 underline-offset-4 hover:text-white hover:underline">
        Limpar seleção
      </button>
    </div>
  );
}

/** "1 pedido selecionado" / "2 pedidos selecionados". */
export const plural = (n: number, um: string, varios: string) => `${n} ${n === 1 ? um : varios}`;

const faixaTexto: Record<Faixa, string> = { aprova: "aprovação automática (0 a 29)", revisao: "revisão manual (30 a 59)", bloqueia: "bloqueio (60 ou mais)" };

/** Nota de risco do antifraude (0 a 100). A cor segue a faixa de decisão da regra. */
export function NotaRisco({ nota, faixa, grande, rotulo = true }: { nota: number; faixa: Faixa; grande?: boolean; rotulo?: boolean }) {
  const cor = faixa === "aprova" ? "text-ok bg-ok-50" : faixa === "revisao" ? "text-warn bg-warn-50" : "text-danger bg-danger-50";
  return (
    <span
      title={`Nota de risco ${nota} de 100: ${faixaTexto[faixa]}`}
      className={cn("inline-flex shrink-0 items-center gap-1.5 rounded-full font-bold whitespace-nowrap tabular", cor, grande ? "px-3 py-1.5 text-lg" : "px-2 py-1 text-xs")}
    >
      <span className={cn("rounded-full bg-current", grande ? "size-2.5" : "size-1.5")} />
      {rotulo && !grande && <span className="font-semibold">Risco</span>}
      {nota}
    </span>
  );
}

export function Kpi({ rotulo, valor, tipo, variacao, meta, href, destaque, tendencia, className }: { rotulo: string; valor: number; tipo: "dinheiro" | "numero" | "pct"; variacao: number; meta?: number; href?: string; destaque?: boolean; tendencia?: number[]; className?: string }) {
  const txt = tipo === "dinheiro" ? reaisCurto(valor) : tipo === "pct" ? pct(valor, 2) : numero(valor);
  const sobe = variacao >= 0;
  const bom = rotulo.includes("abandonados") ? !sobe : sobe;
  const conteudo = (
    <>
      <div className="flex items-center justify-between gap-2 text-[13px] font-medium text-muted">
        {rotulo}
        {href && <Icon name="chevronRight" className="seta size-3.5 opacity-0 transition" />}
      </div>
      <div className={cn("mt-0.5 leading-tight font-bold tabular", destaque ? "text-[28px]" : "text-xl")}>{txt}</div>
      <div className={cn("mt-1 inline-flex items-center gap-1 text-xs font-semibold", bom ? "text-ok" : "text-danger")}>
        <Icon name={sobe ? "arrowUp" : "arrowDown"} className="size-3.5" />
        {Math.abs(variacao).toLocaleString("pt-BR")}% vs. out
      </div>
      {meta && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-muted">
            <span>Meta {reaisCurto(meta)}</span>
            <span className="font-semibold text-ink tabular">{Math.round((valor / meta) * 100)}%</span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-line">
            <div className={cn("h-full rounded-full", valor >= meta ? "bg-ok" : "bg-ink")} style={{ width: `${Math.min(100, (valor / meta) * 100)}%` }} />
          </div>
        </div>
      )}
      {tendencia && tendencia.length > 1 && <MiniLinha valores={tendencia} />}
    </>
  );
  return href ? (
    <Link href={href} className={cn("tile clicavel group block px-4 py-3", className)} aria-label={`${rotulo}: ${txt}. Abrir detalhes`}>
      {conteudo}
    </Link>
  ) : (
    <div className={cn("tile px-4 py-3", className)}>{conteudo}</div>
  );
}

/** Minilinha de tendência (sem eixo) para o KPI em destaque. */
function MiniLinha({ valores }: { valores: number[] }) {
  const W = 200;
  const H = 40;
  const max = Math.max(...valores);
  const min = Math.min(...valores);
  const pts = valores.map((v, i) => `${(i / (valores.length - 1)) * W},${H - 2 - ((v - min) / (max - min || 1)) * (H - 4)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="mt-3 h-10 w-full text-ink" aria-hidden>
      <polygon points={`0,${H} ${pts} ${W},${H}`} className="fill-current opacity-[0.06]" />
      <polyline points={pts} fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    </svg>
  );
}

export { reais };

export type Tom = "ok" | "warn" | "red" | "info" | "neutro" | "ink" | "apagado";
const tons: Record<Tom, string> = {
  ok: "bg-ok-50 text-ok",
  warn: "bg-warn-50 text-warn",
  red: "bg-danger-50 text-danger",
  info: "bg-info-50 text-info",
  neutro: "bg-white text-ink-2 ring-1 ring-line",
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
