"use client";

import { useMemo, useState } from "react";
import { categorias, marcas, produtos } from "@/mock/catalogo";
import { regrasParcelamento } from "@/mock/painel";
import { cn, reais } from "@/lib/format";
import { Icon } from "@/ui/icons";
import { Abas, Interruptor, useAviso } from "@/ui/painel/controles";
import { Botao, CampoPainel, Card, Chip, SelectPainel } from "@/ui/painel/ui";

const abas = ["Promoção em massa", "Regras de parcelamento", "Desconto à vista", "Listas de preço"] as const;

export function Precos() {
  const [aba, setAba] = useState<(typeof abas)[number]>("Promoção em massa");
  return (
    <>
      <div className="mb-4">
        <Abas abas={abas} ativa={aba} onChange={setAba} />
      </div>
      {aba === "Promoção em massa" && <Massa />}
      {aba === "Regras de parcelamento" && <Parcelamento />}
      {aba === "Desconto à vista" && <AVista />}
      {aba === "Listas de preço" && <Listas />}
    </>
  );
}

function Massa() {
  const [filtro, setFiltro] = useState({ tipo: "Marca", valor: "Oggi" });
  const [modo, setModo] = useState<"%" | "R$">("%");
  const [qtd, setQtd] = useState(10);
  const { avisar, aviso } = useAviso();
  const afetados = useMemo(
    () =>
      produtos.filter((p) =>
        filtro.tipo === "Marca" ? p.marca === filtro.valor : filtro.tipo === "Categoria" ? categorias.find((c) => c.slug === p.categoria)?.nome === filtro.valor : p.selos.includes(filtro.valor),
      ),
    [filtro],
  );
  const novo = (preco: number) => Math.max(0, modo === "%" ? Math.round(preco * (1 - qtd / 100)) : preco - qtd * 100);
  const opcoes = filtro.tipo === "Marca" ? marcas : filtro.tipo === "Categoria" ? categorias.map((c) => c.nome) : ["Promoção", "Lançamento", "Seminova", "Exclusivo"];

  return (
    <div className="grid gap-4 xl:grid-cols-[380px_1fr]">
      <Card titulo="Regra">
        <div className="mb-4 flex items-start gap-2 rounded-2xl bg-info-50 p-3 text-sm text-info">
          <Icon name="sync" className="mt-0.5 size-4 shrink-0" />
          <span>O preço base vem da Bruning. Aqui você cria o <strong>preço promocional</strong> (de/por) com início e fim.</span>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <SelectPainel
              label="Aplicar por"
              opcoes={["Marca", "Categoria", "Etiqueta"]}
              value={filtro.tipo}
              onChange={(e) => setFiltro({ tipo: e.target.value, valor: e.target.value === "Marca" ? "Oggi" : e.target.value === "Categoria" ? "Mountain bike" : "Promoção" })}
            />
            <SelectPainel label="Qual" opcoes={opcoes} value={filtro.valor} onChange={(e) => setFiltro({ ...filtro, valor: e.target.value })} />
          </div>
          <div>
            <span className="mb-1.5 block text-sm font-medium text-ink-2">Desconto</span>
            <div className="flex gap-2">
              <div className="flex rounded-xl bg-white p-1 ring-1 ring-black/10">
                {(["%", "R$"] as const).map((m) => (
                  <button key={m} onClick={() => setModo(m)} className={cn("rounded-lg px-3 py-1.5 text-sm font-semibold", modo === m ? "bg-ink text-white" : "")}>
                    {m}
                  </button>
                ))}
              </div>
              <input type="number" value={qtd} onChange={(e) => setQtd(Number(e.target.value))} className="h-11 w-full rounded-xl bg-white px-3 text-sm font-semibold ring-1 ring-black/10" aria-label="Valor do desconto" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <CampoPainel label="Início" type="date" defaultValue="2026-11-27" />
            <CampoPainel label="Fim" type="date" defaultValue="2026-11-30" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" defaultChecked className="size-4 accent-[var(--color-ink)]" /> Aplicar etiqueta “Promoção”
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="size-4 accent-[var(--color-ink)]" /> Frete grátis nesses produtos
          </label>
        </div>
        <Botao tom="red" className="mt-5 w-full" onClick={() => avisar(`Promoção agendada em ${afetados.length} produtos · registrada na auditoria`)}>
          Aplicar em {afetados.length} produtos
        </Botao>
      </Card>
      <Card titulo={`Prévia · ${afetados.length} produtos`} className="overflow-hidden p-0 [&>div:first-child]:px-5 [&>div:first-child]:pt-5">
        <div className="overflow-x-auto">
          <table className="tabela min-w-[560px]">
            <thead>
              <tr>
                <th>Produto</th>
                <th className="text-right">Preço atual</th>
                <th className="text-right">Novo preço</th>
                <th className="text-right">Margem*</th>
              </tr>
            </thead>
            <tbody>
              {afetados.map((p) => {
                const n = novo(p.precoDe ?? p.preco);
                const margem = Math.round((1 - (p.preco * 0.68) / n) * 100);
                return (
                  <tr key={p.id}>
                    <td className="font-medium">{p.nome}</td>
                    <td className="text-right text-muted tabular">{reais(p.precoDe ?? p.preco)}</td>
                    <td className="text-right font-bold tabular">{reais(n)}</td>
                    <td className="text-right">
                      <Chip tom={margem < 15 ? "red" : margem < 25 ? "warn" : "ok"}>{margem}%</Chip>
                    </td>
                  </tr>
                );
              })}
              {afetados.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-muted">
                    Nenhum produto com esse filtro na amostra.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="border-t border-black/5 px-5 py-3 text-xs text-muted">*Margem estimada com o custo vindo da Bruning. Abaixo de 15% pede confirmação do administrador.</p>
      </Card>
      {aviso}
    </div>
  );
}

function Parcelamento() {
  const { avisar, aviso } = useAviso();
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
      <Card titulo="Regras" ferramentas={<Botao tom="ink"><Icon name="plus" className="size-4" /> Nova regra</Botao>} className="overflow-hidden">
        <p className="-mt-2 mb-3 text-sm text-muted">Vale sempre a regra mais específica: produto → marca → categoria → loja.</p>
        <div className="-mx-5 overflow-x-auto">
          <table className="tabela min-w-[600px]">
            <thead>
              <tr>
                <th>Aplica a</th>
                <th>Tipo</th>
                <th className="text-right">Máximo de parcelas</th>
                <th className="text-right">Parcela mínima</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {regrasParcelamento.map((r) => (
                <tr key={r.alvo}>
                  <td className="font-semibold">{r.alvo}</td>
                  <td>
                    <Chip tom={r.tipo === "Loja" ? "ink" : "neutro"}>{r.tipo}</Chip>
                  </td>
                  <td className="text-right font-bold tabular">{r.max}x</td>
                  <td className="text-right tabular">{reais(r.minimo)}</td>
                  <td className="text-right">
                    <button className="text-sm font-semibold text-muted hover:text-ink">Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 rounded-2xl bg-warn-50 p-3 text-sm text-warn">
          A Climba tem regras para 2 categorias, 9 marcas e 3.338 produtos. Elas entram na migração (a confirmar com a exportação).
        </p>
      </Card>
      <div className="space-y-4">
        <Card titulo="Simulador">
          <CampoPainel label="Valor do pedido" defaultValue="R$ 4.499,00" />
          <SelectPainel label="Produto ou marca" opcoes={["Oggi (regra geral)", "Specialized", "Peças"]} className="mt-3" />
          <div className="mt-4 rounded-2xl bg-white p-4 text-sm ring-1 ring-black/5">
            <p className="text-muted">O cliente vê</p>
            <p className="text-lg font-bold">até 21x de R$ 214,24</p>
            <p className="text-ok">R$ 4.049,10 no Pix</p>
          </div>
        </Card>
        <Card titulo="Limite da Rede">
          <p className="text-sm text-muted">Acima de 12x só depois de a Rede confirmar no PV da ShopBike.</p>
          <div className="mt-3 flex items-center justify-between text-sm">
            <span>Liberar 13x a 21x</span>
            <Interruptor ligado={false} onChange={() => avisar("Bloqueado até a confirmação da Rede")} rotulo="Liberar 13x a 21x" />
          </div>
          <Chip tom="warn">Aguardando teste com transação real</Chip>
        </Card>
      </div>
      {aviso}
    </div>
  );
}

function AVista() {
  const formas = [
    ["Pix", 10, true],
    ["Cartão 1x", 10, true],
    ["Cartão parcelado", 0, false],
    ["Pagamento na retirada", 5, true],
    ["Depósito", 0, false],
  ] as const;
  return (
    <Card titulo="Desconto por forma de pagamento" className="max-w-3xl">
      <ul className="divide-y divide-black/5">
        {formas.map(([f, pct, on]) => (
          <li key={f} className="flex items-center gap-4 py-3">
            <span className="flex-1 font-medium">{f}</span>
            <span className="flex items-center gap-1">
              <input defaultValue={pct} className="h-10 w-16 rounded-xl bg-white text-center font-bold ring-1 ring-black/10" aria-label={`Desconto ${f}`} />%
            </span>
            <Chip tom={on ? "ok" : "apagado"}>{on ? "Ativo" : "Sem desconto"}</Chip>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm text-muted">O desconto aparece na vitrine (“R$ X no Pix”), no produto e no checkout. Não soma com cupom de mais de 10% (configurável).</p>
    </Card>
  );
}

function Listas() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {[
        ["Varejo", "Padrão do site", "Todos os clientes", "28.401"],
        ["Lojista (B2B)", "Bruning − 18%", "Grupo Lojista, pedido mínimo R$ 2.000", "11"],
        ["Equipes de pedal", "Varejo − 5% em peças", "Grupo Equipe de pedal", "64"],
      ].map(([n, base, quem, cli], i) => (
        <Card key={n} titulo={n} tom={i === 1 ? "red" : undefined}>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Base</dt>
              <dd className="font-medium">{base}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Para</dt>
              <dd className="text-right font-medium">{quem}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Clientes</dt>
              <dd className="font-medium tabular">{cli}</dd>
            </div>
          </dl>
          <div className="mt-4 flex gap-2">
            <Botao tom="ghost">Editar</Botao>
            <Botao tom="ghost">
              <Icon name="copy" className="size-4" /> Copiar lista
            </Botao>
          </div>
          {i === 1 && <p className="mt-3 text-xs text-muted">Venda B2B completa é da Fase 2.</p>}
        </Card>
      ))}
    </div>
  );
}
