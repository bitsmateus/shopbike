import Link from "next/link";
import type { Metadata } from "next";
import { produtos } from "@/mock/catalogo";
import { reais } from "@/lib/format";
import { Icon } from "@/ui/icons";
import { ProductArt } from "@/ui/product-art";
import { BadgeFase2 } from "@/ui/painel/fase";
import { Botao, Cabecalho, Card, Chip } from "@/ui/painel/ui";

export const metadata: Metadata = { title: "Seminovas e bike na troca" };

const avaliacoes = [
  { cliente: "Carlos E.", bike: "Caloi Elite Carbon 2021 · M", fotos: 6, pedida: 520_000, proposta: 430_000, etapa: "Proposta enviada", interesse: "Specialized Rockhopper Sport" },
  { cliente: "Bruno T.", bike: "Oggi 7.0 2020 · 19", fotos: 4, pedida: 260_000, proposta: null, etapa: "Aguardando vistoria", interesse: "Oggi Big Wheel 7.0" },
  { cliente: "Lívia R.", bike: "Specialized Sirrus 2022 · S", fotos: 5, pedida: 310_000, proposta: 290_000, etapa: "Aceita · crédito no pedido", interesse: "Allez E5" },
  { cliente: "Mário S.", bike: "Bike de supermercado aro 26", fotos: 2, pedida: 60_000, proposta: null, etapa: "Recusada", interesse: "—" },
];

const tomEtapa = (e: string) => (e.startsWith("Aceita") ? "ok" : e === "Recusada" ? "apagado" : e.startsWith("Proposta") ? "info" : "warn") as "ok";

export default function SeminovasPage() {
  const seminovas = produtos.filter((p) => p.categoria === "seminovas");
  return (
    <>
      <Cabecalho
        titulo="Seminovas e bike na troca"
        kpis={[
          { icon: "bike", rotulo: "Seminovas à venda", valor: "81" },
          { icon: "sync", rotulo: "Avaliações abertas", valor: "2" },
          { icon: "card", rotulo: "Crédito concedido (mês)", valor: "R$ 2.900" },
        ]}
        acoes={<BadgeFase2 />}
      />
      <div className="grid gap-4 xl:grid-cols-[1fr_1.2fr]">
        <Card titulo="À venda" ferramentas={<Link href="/admin/catalogo/novo" className="text-sm font-semibold">+ Cadastrar seminova</Link>}>
          <ul className="space-y-2">
            {seminovas.map((p) => (
              <li key={p.id}>
                <Link href={`/admin/catalogo/${p.id}`} className="tile flex items-center gap-3 p-3 hover:bg-white">
                  <ProductArt kind={p.art} color={p.cores[0].hex} className="size-14" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{p.nome}</span>
                    <span className="text-xs text-muted">
                      Estado {p.seminova?.estado.toLowerCase()} · laudo ok · {p.qualidade.fotos} fotos
                    </span>
                  </span>
                  <span className="font-bold tabular">{reais(p.preco)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
        <Card titulo="Avaliação de bike usada (vinda do site e do WhatsApp)">
          <ul className="space-y-2">
            {avaliacoes.map((a) => (
              <li key={a.cliente} className="tile p-3.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold">{a.cliente}</span>
                  <Chip tom={tomEtapa(a.etapa)}>{a.etapa}</Chip>
                  <span className="ml-auto text-xs text-muted">{a.fotos} fotos</span>
                </div>
                <p className="mt-1 text-sm">{a.bike}</p>
                <p className="text-xs text-muted">Quer comprar: {a.interesse}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                  <span>
                    Pede <strong className="tabular">{reais(a.pedida)}</strong>
                  </span>
                  {a.proposta && (
                    <span>
                      Proposta <strong className="text-ok tabular">{reais(a.proposta)}</strong>
                    </span>
                  )}
                  <span className="flex-1" />
                  {a.etapa === "Aguardando vistoria" && <Botao tom="ink">Fazer proposta</Botao>}
                  {a.etapa.startsWith("Proposta") && (
                    <Botao tom="ghost">
                      <Icon name="whatsapp" className="size-4" /> Cobrar resposta
                    </Botao>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted">Fluxo: recebida → vistoria na oficina → proposta → aceita → crédito no pedido → entra no estoque como seminova.</p>
        </Card>
      </div>
    </>
  );
}
