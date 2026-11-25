import { reais, reaisCurto } from "@/lib/format";

const CORES = { site: "#1a1917", link: "#e30618", ia: "#2c6bc8" } as const;

/** Barras empilhadas por dia: site, link do vendedor e IA. */
export function GraficoVendas({ serie }: { serie: { dia: number; site: number; link: number; ia: number }[] }) {
  const W = 720;
  const H = 220;
  const pad = { l: 44, r: 8, t: 10, b: 24 };
  const max = Math.max(...serie.map((d) => d.site + d.link + d.ia)) * 1.1;
  const bw = (W - pad.l - pad.r) / serie.length;
  const y = (v: number) => H - pad.b - (v / max) * (H - pad.t - pad.b);
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * max);
  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Vendas por dia e canal em novembro">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} stroke="#1a191714" />
            <text x={pad.l - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill="#8b8983">
              {t === 0 ? "0" : `${Math.round(t / 100_000)}k`}
            </text>
          </g>
        ))}
        {serie.map((d, i) => {
          const x = pad.l + i * bw + bw * 0.18;
          const w = bw * 0.64;
          let acc = 0;
          return (
            <g key={d.dia}>
              <title>{`Dia ${d.dia}: site ${reais(d.site)} · link ${reais(d.link)} · IA ${reais(d.ia)}`}</title>
              {(["site", "link", "ia"] as const).map((k) => {
                const y0 = y(acc);
                acc += d[k];
                const y1 = y(acc);
                return <rect key={k} x={x} y={y1} width={w} height={Math.max(0, y0 - y1 - 1)} rx={Math.min(4, w / 2)} fill={CORES[k]} opacity={k === "site" ? 0.88 : 1} />;
              })}
              {(i % 4 === 0 || i === serie.length - 1) && (
                <text x={x + w / 2} y={H - 6} textAnchor="middle" fontSize="11" fill="#8b8983">
                  {d.dia}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-2 flex flex-wrap gap-4 text-xs text-muted">
        {[
          ["Site", CORES.site],
          ["Link do vendedor", CORES.link],
          ["IA no WhatsApp", CORES.ia],
        ].map(([n, c]) => (
          <span key={n} className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-full" style={{ background: c }} />
            {n}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}

export function Anel({ valor, total, rotulo }: { valor: number; total: number; rotulo: string }) {
  const r = 42;
  const c = 2 * Math.PI * r;
  const f = valor / total;
  return (
    <div className="relative grid size-32 shrink-0 place-items-center">
      <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90" aria-hidden>
        <circle cx="50" cy="50" r={r} fill="none" stroke="#1a191712" strokeWidth="7" />
        <circle cx="50" cy="50" r={r} fill="none" stroke="#1f7a3d" strokeWidth="7" strokeLinecap="round" strokeDasharray={`${c * f} ${c}`} />
      </svg>
      <div className="max-w-[78px] text-center">
        <div className="text-2xl leading-none font-bold tabular">{Math.round(f * 100)}%</div>
        <div className="mt-1 text-[11px] leading-tight text-muted">{rotulo}</div>
      </div>
    </div>
  );
}

export function BarrasHorizontais({ itens }: { itens: { rotulo: string; valor: number; sub?: string }[] }) {
  const max = Math.max(...itens.map((i) => i.valor));
  return (
    <ul className="space-y-3.5">
      {itens.map((i, idx) => (
        <li key={i.rotulo}>
          <div className="flex items-baseline justify-between text-sm">
            <span className="font-medium">{i.rotulo}</span>
            <span className="font-semibold tabular">{reaisCurto(i.valor)}</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-black/5">
            <div className="h-full rounded-full" style={{ width: `${(i.valor / max) * 100}%`, background: ["#1a1917", "#e30618", "#2c6bc8"][idx % 3] }} />
          </div>
          {i.sub && <div className="mt-1 text-xs text-muted">{i.sub}</div>}
        </li>
      ))}
    </ul>
  );
}
