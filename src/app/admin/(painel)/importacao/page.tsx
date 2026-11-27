import type { Metadata } from "next";
import { importacoes } from "@/mock/painel";
import { cn, numero } from "@/lib/format";
import { Icon, type IconName } from "@/ui/icons";
import { Botao, Cabecalho, Card, Chip } from "@/ui/painel/ui";

export const metadata: Metadata = { title: "Importação e exportação" };

const entradas: [IconName, string, string, string][] = [
  ["doc", "Produtos e variações", "Planilha XLSX no modelo ShopBike", "Baixar modelo"],
  ["eye", "Fotos em lote", "ZIP com fotos nomeadas pelo código (OGBW7-1.jpg)", "Ver regra de nomes"],
  ["tag", "Tags e etiquetas", "XLSX com código e tags", "Baixar modelo"],
  ["users", "Clientes", "Exportação da Climba (migração)", "Usar só na migração"],
];

const saidas: [string, string][] = [
  ["Catálogo completo", "XLSX com produtos, variações, preços e estoque"],
  ["URLs das imagens", "Lista de todas as fotos com link público"],
  ["Feed Google Shopping", "XML atualizado a cada hora"],
  ["Catálogo Meta", "CSV para Facebook e Instagram"],
  ["Códigos duplicados", "SKUs e EANs repetidos"],
];

export default function ImportacaoPage() {
  return (
    <>
      <Cabecalho
        titulo="Importação e exportação"
        kpis={[
          { icon: "box", rotulo: "Última importação", valor: "7.383 ok" },
          { icon: "alert", rotulo: "Linhas com erro", valor: "12" },
          { icon: "eye", rotulo: "Fotos processadas", valor: numero(4011) },
        ]}
      />
      <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
        <Card titulo="Importar">
          <label className="grid cursor-pointer place-items-center rounded-[20px] border-2 border-dashed border-black/15 bg-snow p-8 text-center hover:bg-white">
            <span>
              <span className="mx-auto grid size-14 place-items-center rounded-full bg-ink text-white">
                <Icon name="arrowUp" />
              </span>
              <span className="mt-3 block font-semibold">Arraste a planilha ou o ZIP de fotos</span>
              <span className="text-sm text-muted">XLSX até 50 MB · ZIP até 2 GB · processamento em segundo plano, sem travar o painel</span>
            </span>
            <input type="file" className="sr-only" />
          </label>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {entradas.map(([i, t, d, a]) => (
              <li key={t} className="tile flex gap-3 p-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white ring-1 ring-black/5">
                  <Icon name={i} className="size-4" />
                </span>
                <span className="text-sm">
                  <span className="block font-semibold">{t}</span>
                  <span className="text-muted">{d}</span>
                  <button className="mt-1 block text-xs font-semibold underline">{a}</button>
                </span>
              </li>
            ))}
          </ul>
        </Card>
        <Card titulo="Exportar">
          <ul className="space-y-2">
            {saidas.map(([t, d]) => (
              <li key={t} className="tile flex items-center gap-3 p-3">
                <span className="flex-1 text-sm">
                  <span className="block font-semibold">{t}</span>
                  <span className="text-muted">{d}</span>
                </span>
                <Botao tom="ghost">
                  <Icon name="arrowDown" className="size-4" /> Baixar
                </Botao>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card titulo="Histórico" className="mt-4 overflow-hidden">
        <div className="-mx-5 overflow-x-auto">
          <table className="tabela min-w-[820px]">
            <thead>
              <tr>
                <th>Arquivo</th>
                <th>Tipo</th>
                <th>Quando</th>
                <th>Progresso</th>
                <th className="text-right">Erros</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {importacoes.map((i) => (
                <tr key={i.arquivo}>
                  <td className="font-semibold">{i.arquivo}</td>
                  <td>{i.tipo}</td>
                  <td className="tabular">{i.quando}</td>
                  <td className="w-56">
                    <div className="h-2 overflow-hidden rounded-full bg-black/5">
                      <div className={cn("h-full rounded-full", i.status === "Processando" ? "bg-info" : "bg-ok")} style={{ width: `${((i.ok + i.erros) / i.linhas) * 100}%` }} />
                    </div>
                    <span className="text-xs text-muted tabular">
                      {numero(i.ok + i.erros)} de {numero(i.linhas)}
                    </span>
                  </td>
                  <td className="text-right">{i.erros > 0 ? <button className="text-sm font-semibold text-danger underline">{i.erros} · baixar</button> : <span className="text-muted">0</span>}</td>
                  <td>
                    <Chip tom={i.status === "Processando" ? "info" : "ok"}>{i.status}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
