import Link from "next/link";
import type { Metadata } from "next";
import { relatorios } from "@/mock/relatorios";
import { Icon, type IconName } from "@/ui/icons";
import { Cabecalho, Card, Chip } from "@/ui/painel/ui";

export const metadata: Metadata = { title: "Relatórios" };

const icones: Record<string, IconName> = { Vendas: "chart", "Curva ABC": "tag", Comportamento: "users", Cadastros: "box", Clientes: "user" };

export default function RelatoriosPage() {
  const grupos = [...new Set(relatorios.map((r) => r.grupo))];
  return (
    <>
      <Cabecalho
        titulo="Relatórios"
        kpis={[
          { icon: "chart", rotulo: "Disponíveis na Fase 1", valor: `${relatorios.filter((r) => r.fase === 1).length}` },
          { icon: "clock", rotulo: "Na Fase 2", valor: `${relatorios.filter((r) => r.fase === 2).length}` },
          { icon: "arrowDown", rotulo: "Exportação", valor: "XLSX e CSV" },
        ]}
      />
      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {grupos.map((g) => (
          <Card key={g}>
            <div className="mb-3 flex items-center gap-2.5">
              <span className="grid size-10 place-items-center rounded-full bg-white ring-1 ring-black/5">
                <Icon name={icones[g] ?? "doc"} className="size-[18px]" />
              </span>
              <h2 className="text-base font-bold">{g}</h2>
            </div>
            <ul className="space-y-1">
              {relatorios
                .filter((r) => r.grupo === g)
                .map((r) => (
                  <li key={r.slug}>
                    <Link href={`/admin/relatorios/${r.slug}`} className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-white">
                      <span className="flex-1">{r.titulo}</span>
                      {r.fase === 2 && <Chip tom="info">Fase 2</Chip>}
                      <Icon name="chevronRight" className="size-4 text-faint" />
                    </Link>
                  </li>
                ))}
            </ul>
          </Card>
        ))}
        <Card titulo="Logs">
          <ul className="space-y-1 text-sm">
            {[
              ["Integração (Bruning, Rede, Pix, Correios, NX)", "/admin/integracoes"],
              ["Pesquisas na loja e termos sem resultado", "/admin/relatorios/pesquisas"],
              ["Cálculo de frete", "/admin/integracoes"],
              ["E-mails e WhatsApp enviados", "/admin/notificacoes"],
              ["Acessos de clientes e da administração", "/admin/auditoria"],
            ].map(([t, href]) => (
              <li key={t}>
                <Link href={href} className="flex items-center gap-2 rounded-xl px-3 py-2.5 font-medium hover:bg-white">
                  <span className="flex-1">{t}</span>
                  <Icon name="chevronRight" className="size-4 text-faint" />
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
