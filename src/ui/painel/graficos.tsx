"use client";

import { useState } from "react";
import { reaisCurto } from "@/lib/format";

/* Cores dos canais vêm dos tokens (globals.css). Vermelho fica fora: é cor de erro. */
const CORES = { site: "var(--color-canal-site)", link: "var(--color-canal-link)", ia: "var(--color-canal-ia)" } as const;
const CORES_LISTA = [CORES.site, CORES.link, CORES.ia];

/** Divisões redondas do eixo (em centavos): 1, 2, 2,5 ou 5 vezes uma potência de 10, até 6 linhas. */
function divisoes(maximo: number) {
  const reaisMax = maximo / 100;
  const base = 10 ** Math.floor(Math.log10(reaisMax / 5));
  const passo = [1, 2, 2.5, 5, 10].map((m) => m * base).find((p) => reaisMax / p <= 5) ?? base * 10;
  const topo = Math.ceil(reaisMax / passo) * passo;
  return { topo: topo * 100, ticks: Array.from({ length: Math.round(topo / passo) + 1 }, (_, i) => i * passo * 100) };
}

/** Rótulo do eixo no padrão brasileiro: "0", "5 mil", "10 mil". */
const rotuloEixo = (centavos: number) => {
  const r = centavos / 100;
  return r === 0 ? "0" : r >= 1000 ? `${(r / 1000).toLocaleString("pt-BR")} mil` : r.toLocaleString("pt-BR");
};

/** Barras empilhadas por dia: site, link do vendedor e IA. Passe o mouse (ou toque) para ver os números do dia. */
export function GraficoVendas({ serie, mes = "nov" }: { serie: { dia: number; site: number; link: number; ia: number }[]; mes?: string }) {
  const [ativo, setAtivo] = useState<number | null>(null);
  const W = 720;
  const H = 150;
  const pad = { l: 48, r: 8, t: 10, b: 24 };
  const { topo: max, ticks } = divisoes(Math.max(...serie.map((d) => d.site + d.link + d.ia)));
  const bw = (W - pad.l - pad.r) / serie.length;
  const y = (v: number) => H - pad.b - (v / max) * (H - pad.t - pad.b);
  const d = ativo == null ? null : serie[ativo];
  const total = d ? d.site + d.link + d.ia : 0;
  // posição do quadro em % da largura, sem sair da área do gráfico
  const xPct = ativo == null ? 0 : ((pad.l + ativo * bw + bw / 2) / W) * 100;

  return (
    <figure className="relative" onMouseLeave={() => setAtivo(null)}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full touch-none" role="img" aria-label="Vendas por dia e canal">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} style={{ stroke: "var(--color-line)" }} />
            <text x={pad.l - 8} y={y(t) + 4} textAnchor="end" fontSize="12" style={{ fill: "var(--color-faint)" }}>
              {rotuloEixo(t)}
            </text>
          </g>
        ))}
        {serie.map((dia, i) => {
          const x = pad.l + i * bw + bw * 0.18;
          const w = bw * 0.64;
          let acc = 0;
          const apagado = ativo != null && ativo !== i;
          return (
            <g key={dia.dia} style={{ opacity: apagado ? 0.35 : 1, transition: "opacity .15s" }}>
              {ativo === i && <rect x={pad.l + i * bw} y={pad.t} width={bw} height={H - pad.t - pad.b} rx={6} style={{ fill: "var(--color-cloud)" }} />}
              {(["site", "link", "ia"] as const).map((k) => {
                const y0 = y(acc);
                acc += dia[k];
                const y1 = y(acc);
                return <rect key={k} x={x} y={y1} width={w} height={Math.max(0, y0 - y1 - 1)} rx={Math.min(4, w / 2)} style={{ fill: CORES[k] }} />;
              })}
              {(i % 4 === 0 || i === serie.length - 1 || ativo === i) && (
                <text x={x + w / 2} y={H - 6} textAnchor="middle" fontSize="12" fontWeight={ativo === i ? 700 : 500} style={{ fill: ativo === i ? "var(--color-ink)" : "var(--color-faint)" }}>
                  {dia.dia}
                </text>
              )}
              {/* área de captura do mouse: a coluna inteira do dia */}
              <rect
                x={pad.l + i * bw}
                y={0}
                width={bw}
                height={H}
                fill="transparent"
                onMouseEnter={() => setAtivo(i)}
                onTouchStart={() => setAtivo(i)}
                style={{ cursor: "pointer" }}
              />
            </g>
          );
        })}
      </svg>

      {d && (
        <div
          role="status"
          className="pointer-events-none absolute top-0 z-10 w-[200px] rounded-xl bg-ink px-3 py-2.5 text-xs text-white shadow-[var(--shadow-pop)]"
          style={{ left: xPct > 55 ? `calc(${xPct}% - 222px)` : `calc(${xPct}% + 22px)` }}
        >
          <p className="mb-1.5 font-bold">
            {d.dia} de {mes}
          </p>
          {(
            [
              ["Site", d.site, CORES.site],
              ["Link do vendedor", d.link, CORES.link],
              ["IA no WhatsApp", d.ia, CORES.ia],
            ] as const
          ).map(([n, v, c]) => (
            <p key={n} className="flex items-center justify-between gap-3 py-0.5">
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-white/80">
                <span className="size-2 rounded-full ring-1 ring-white/40" style={{ background: c }} />
                {n}
              </span>
              <span className="font-semibold tabular">{reaisCurto(v)}</span>
            </p>
          ))}
          <p className="mt-1.5 flex justify-between border-t border-white/15 pt-1.5 font-bold">
            <span>Total</span>
            <span className="tabular">{reaisCurto(total)}</span>
          </p>
        </div>
      )}

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
        <span className="ml-auto text-faint">Passe o mouse nas barras para ver os valores do dia</span>
      </figcaption>
    </figure>
  );
}

export function Anel({ valor, total, rotulo }: { valor: number; total: number; rotulo: string }) {
  const r = 42;
  const c = 2 * Math.PI * r;
  const f = valor / total;
  return (
    <div className="relative grid size-20 shrink-0 place-items-center">
      <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90" aria-hidden>
        <circle cx="50" cy="50" r={r} fill="none" strokeWidth="7" style={{ stroke: "var(--color-line)" }} />
        <circle cx="50" cy="50" r={r} fill="none" strokeWidth="7" strokeLinecap="round" strokeDasharray={`${c * f} ${c}`} style={{ stroke: "var(--color-ok)" }} />
      </svg>
      <div className="max-w-[60px] text-center">
        <div className="text-lg leading-none font-bold tabular">{Math.round(f * 100)}%</div>
        <div className="mt-0.5 text-xs leading-tight text-muted">{rotulo}</div>
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
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-line">
            <div className="h-full rounded-full" style={{ width: `${(i.valor / max) * 100}%`, background: CORES_LISTA[idx % 3] }} />
          </div>
          {i.sub && <div className="mt-1 text-xs text-muted">{i.sub}</div>}
        </li>
      ))}
    </ul>
  );
}
