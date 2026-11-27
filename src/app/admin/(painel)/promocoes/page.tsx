import type { Metadata } from "next";
import { promocoes } from "@/mock/painel";
import { cn, reaisCurto } from "@/lib/format";
import { Icon } from "@/ui/icons";
import { Botao, Cabecalho, Card, Chip } from "@/ui/painel/ui";

export const metadata: Metadata = { title: "Promoções" };

export default function PromocoesPage() {
  return (
    <>
      <Cabecalho
        titulo="Promoções"
        kpis={[
          { icon: "tag", rotulo: "Ativas", valor: "1" },
          { icon: "clock", rotulo: "Agendadas", valor: "2" },
          { icon: "chart", rotulo: "Vendas na Black Friday", valor: reaisCurto(18_204_000) },
        ]}
        acoes={
          <Botao tom="ink">
            <Icon name="plus" className="size-4" /> Nova promoção
          </Botao>
        }
      />
      <div className="grid gap-4 md:grid-cols-2">
        {promocoes.map((p) => (
          <Card key={p.nome} tom={p.status === "Ativa" ? "red" : undefined} className={cn(p.status === "Encerrada" && "opacity-70")}>
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold">{p.nome}</h2>
                  <Chip tom={p.status === "Ativa" ? "red" : p.status === "Agendada" ? "info" : "apagado"}>{p.status}</Chip>
                </div>
                <p className="text-sm text-muted">{p.periodo}</p>
              </div>
              <button className="grid size-9 place-items-center rounded-full bg-white/70 ring-1 ring-black/5" aria-label="Editar">
                <Icon name="gear" className="size-4" />
              </button>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
              {[
                ["Produtos", String(p.produtos)],
                ["Desconto", p.desconto],
                ["Frete grátis", p.freteGratis ? "Sim" : "Não"],
                ["Vendas", p.vendas ? reaisCurto(p.vendas) : "—"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs text-muted">{k}</dt>
                  <dd className="font-bold tabular">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 flex items-center gap-1.5 text-xs text-muted">
              <Icon name="home" className="size-3.5" /> Vitrine: {p.vitrine}
            </p>
          </Card>
        ))}
      </div>
      <Card titulo="Como funciona" className="mt-4">
        <ol className="grid gap-3 text-sm sm:grid-cols-4">
          {["Escolha produtos por marca, categoria ou tag", "Defina desconto e período (preço de/por)", "Ligue banner, vitrine e frete grátis", "Ao fim do período, tudo volta sozinho"].map((t, i) => (
            <li key={t} className="tile flex gap-2 p-3">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-ink text-xs font-bold text-white">{i + 1}</span>
              {t}
            </li>
          ))}
        </ol>
      </Card>
    </>
  );
}
