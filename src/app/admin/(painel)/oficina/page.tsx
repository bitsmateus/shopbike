import type { Metadata } from "next";
import { cn } from "@/lib/format";
import { Icon } from "@/ui/icons";
import { BadgeFase2 } from "@/ui/painel/fase";
import { Botao, Cabecalho, Card, Chip } from "@/ui/painel/ui";

export const metadata: Metadata = { title: "Oficina e pós-venda" };

const dias = ["Seg 23", "Ter 24", "Qua 25", "Qui 26", "Sex 27", "Sáb 28"];
const horas = ["08:00", "09:30", "11:00", "13:30", "15:00", "16:30"];
const agenda: Record<string, { cliente: string; servico: string; origem: "Site" | "WhatsApp" | "Loja" }> = {
  "Seg 23|08:00": { cliente: "Marcos V.", servico: "Revisão completa", origem: "Site" },
  "Seg 23|13:30": { cliente: "Tiago R.", servico: "Sangria freio", origem: "WhatsApp" },
  "Ter 24|09:30": { cliente: "Equipe Pedal Sul", servico: "4 revisões", origem: "Loja" },
  "Qua 25|08:00": { cliente: "Rafael M.", servico: "Montagem Big Wheel", origem: "Loja" },
  "Qua 25|11:00": { cliente: "Camila S.", servico: "Revisão 30 dias", origem: "WhatsApp" },
  "Qua 25|15:00": { cliente: "Paula R.", servico: "Bike fit", origem: "Site" },
  "Qui 26|09:30": { cliente: "Henrique L.", servico: "Suspensão", origem: "WhatsApp" },
  "Qui 26|13:30": { cliente: "Vanessa K.", servico: "Revisão 30 dias", origem: "WhatsApp" },
  "Sex 27|08:00": { cliente: "Carlos E.", servico: "Vistoria bike usada", origem: "Site" },
  "Sáb 28|09:30": { cliente: "Gabriela N.", servico: "Revisão 30 dias", origem: "WhatsApp" },
};

const lembretes = [
  ["Camila Souza", "Big Wheel 7.0", "30 dias", "Agendou"],
  ["Vanessa K.", "Caloi Cecci", "30 dias", "Agendou"],
  ["Rafael Medeiros", "Hacker Sport", "180 dias", "Enviado"],
  ["Bruna S.", "E-Vibe", "30 dias", "Sem resposta"],
  ["Lívia R.", "Allez E5", "180 dias", "Enviado"],
];

export default function OficinaPage() {
  return (
    <>
      <Cabecalho
        titulo="Oficina e pós-venda"
        kpis={[
          { icon: "wrench", rotulo: "Agendados na semana", valor: `${Object.keys(agenda).length}` },
          { icon: "whatsapp", rotulo: "Lembretes enviados (mês)", valor: "86" },
          { icon: "check", rotulo: "Viraram agendamento", valor: "34%" },
        ]}
        acoes={<BadgeFase2 />}
      />
      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <Card titulo="Agenda · 23 a 28 de novembro" ferramentas={<Botao tom="ink"><Icon name="plus" className="size-4" /> Agendar</Botao>} className="min-w-0">
          <div className="-mx-1 overflow-x-auto px-1">
            <div className="grid min-w-[760px] grid-cols-[64px_repeat(6,1fr)] gap-1.5">
              <span />
              {dias.map((d) => (
                <span key={d} className={cn("rounded-xl py-2 text-center text-sm font-bold", d === "Qua 25" ? "bg-ink text-white" : "bg-white/70")}>
                  {d}
                </span>
              ))}
              {horas.map((h) => (
                <div key={h} className="contents">
                  <span className="pt-2 text-right text-xs text-muted tabular">{h}</span>
                  {dias.map((d) => {
                    const a = agenda[`${d}|${h}`];
                    return a ? (
                      <div key={d + h} className={cn("min-h-16 rounded-xl p-2 text-xs ring-1", a.servico.includes("Vistoria") ? "bg-red-50 ring-red-100" : "bg-white ring-black/5")}>
                        <p className="font-semibold">{a.cliente}</p>
                        <p className="text-muted">{a.servico}</p>
                        <p className="mt-1 text-[10px] font-semibold text-faint">{a.origem}</p>
                      </div>
                    ) : (
                      <div key={d + h} className="min-h-16 rounded-xl border border-dashed border-black/10" />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </Card>
        <div className="space-y-4">
          <Card titulo="Lembretes de revisão">
            <ul className="space-y-2 text-sm">
              {lembretes.map(([c, b, q, s]) => (
                <li key={c} className="tile flex items-center gap-2 p-2.5">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{c}</span>
                    <span className="text-xs text-muted">
                      {b} · {q}
                    </span>
                  </span>
                  <Chip tom={s === "Agendou" ? "ok" : s === "Enviado" ? "info" : "apagado"}>{s}</Chip>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted">Enviados pelo WhatsApp oficial 30 e 180 dias depois da compra de bike.</p>
          </Card>
          <Card titulo="Serviços e preços">
            <ul className="space-y-1.5 text-sm">
              {[
                ["Revisão completa", "R$ 189", "1h30"],
                ["Revisão de suspensão", "R$ 249", "2h"],
                ["Sangria de freio", "R$ 79", "40 min"],
                ["Montagem", "R$ 149", "1h30"],
                ["Bike fit", "R$ 290", "1h30"],
              ].map(([s, v, t]) => (
                <li key={s} className="flex justify-between border-b border-black/5 pb-1.5">
                  <span>{s}</span>
                  <span className="text-muted">
                    {t} · <strong className="text-ink">{v}</strong>
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}
