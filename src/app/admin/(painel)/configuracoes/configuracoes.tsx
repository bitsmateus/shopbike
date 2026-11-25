"use client";

import { useState } from "react";
import { redirects, transportadoras } from "@/mock/painel";
import { cn } from "@/lib/format";
import { Icon } from "@/ui/icons";
import { Abas, InterruptorLocal, useAviso } from "@/ui/painel/controles";
import { Botao, CampoPainel, Card, Chip, SelectPainel } from "@/ui/painel/ui";

const abas = ["Loja", "Pagamentos", "Frete e entrega", "SEO e redirecionamentos", "Rastreamento", "Privacidade (LGPD)"] as const;

export function Configuracoes() {
  const [aba, setAba] = useState<(typeof abas)[number]>("Loja");
  const { avisar, aviso } = useAviso();
  const salvar = (
    <div className="mt-4 flex justify-end">
      <Botao tom="ink" onClick={() => avisar("Configurações salvas · registradas na auditoria")}>
        Salvar
      </Botao>
    </div>
  );

  return (
    <>
      <div className="mb-4">
        <Abas abas={abas} ativa={aba} onChange={setAba} />
      </div>

      {aba === "Loja" && (
        <div className="grid gap-4 xl:grid-cols-2">
          <Card titulo="Dados da loja">
            <div className="grid gap-3 sm:grid-cols-2">
              <CampoPainel label="Nome" defaultValue="ShopBike" />
              <CampoPainel label="Razão social" defaultValue="ShopBike Comércio de Bicicletas Ltda" />
              <CampoPainel label="CNPJ" defaultValue="00.000.000/0001-00" />
              <CampoPainel label="Domínio" defaultValue="shopbike.com.br" readOnly />
              <CampoPainel label="E-mail de atendimento" defaultValue="atendimento@shopbike.com.br" />
              <CampoPainel label="WhatsApp" defaultValue="(48) 9 0000-0000" />
              <CampoPainel label="Instagram" defaultValue="@shopbike" />
              <CampoPainel label="Horário" defaultValue="Seg a sex 8h–18h · sáb 8h–12h" />
            </div>
            {salvar}
          </Card>
          <Card titulo="Remetente e textos padrão">
            <div className="grid gap-3">
              <CampoPainel label="Remetente dos e-mails" defaultValue="ShopBike <nao-responda@shopbike.com.br>" />
              <CampoPainel label="Endereço de origem dos envios" defaultValue="Tubarão/SC · CEP 88700-000" />
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink-2">Aviso no topo do checkout</span>
                <textarea defaultValue="Pedidos aprovados até 14h saem no mesmo dia." className="h-20 w-full resize-none rounded-xl bg-white p-3 text-sm ring-1 ring-black/10" />
              </label>
              <label className="flex items-center justify-between text-sm">
                Loja em manutenção (só administradores navegam) <InterruptorLocal inicial={false} rotulo="Manutenção" />
              </label>
            </div>
            {salvar}
          </Card>
        </div>
      )}

      {aba === "Pagamentos" && (
        <div className="grid gap-4 xl:grid-cols-2">
          <Card titulo="Cartão · e.Rede" ferramentas={<Chip tom="ok">Conectado · sandbox</Chip>}>
            <div className="grid gap-3 sm:grid-cols-2">
              <CampoPainel label="PV (filiação)" defaultValue="•••••• (variável de ambiente)" readOnly />
              <CampoPainel label="Ambiente" defaultValue="Sandbox" readOnly />
              <SelectPainel label="Captura" opcoes={["Autorizar e decidir pelo antifraude", "Capturar na hora"]} />
              <SelectPainel label="Parcelamento máximo" opcoes={["12x (até a Rede liberar)", "21x"]} />
              <CampoPainel label="3DS obrigatório acima de" defaultValue="R$ 3.000,00" />
              <CampoPainel label="Parcela mínima" defaultValue="R$ 50,00" />
            </div>
            <p className="mt-3 text-xs text-muted">PV e token ficam em variável de ambiente no Easypanel, nunca no banco.</p>
            {salvar}
          </Card>
          <Card titulo="Pix" ferramentas={<Chip tom="warn">Provedor a definir</Chip>}>
            <p className="text-sm text-muted">QR Code dinâmico com baixa automática por webhook. O provedor precisa informar o CPF de quem pagou.</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <SelectPainel label="Provedor" opcoes={["A definir", "Pix da Rede", "Efí", "Asaas", "Banco"]} />
              <CampoPainel label="Validade do QR Code" defaultValue="30 minutos" />
            </div>
            <div className="mt-5">
              <p className="mb-2 text-sm font-semibold">Pagamento facilitado</p>
              {["2 cartões", "Pix + cartão", "Pix + 2 cartões"].map((f) => (
                <label key={f} className="flex items-center justify-between border-b border-black/5 py-2 text-sm">
                  {f} <InterruptorLocal inicial={f !== "Pix + 2 cartões"} rotulo={f} />
                </label>
              ))}
            </div>
          </Card>
          <Card titulo="Formas manuais">
            {[
              ["Pagamento na retirada", true],
              ["A combinar", false],
              ["Depósito", false],
              ["Financiamento", false],
              ["Condicional", false],
              ["Boleto", false],
            ].map(([f, on]) => (
              <label key={f as string} className="flex items-center justify-between border-b border-black/5 py-2.5 text-sm">
                {f} <InterruptorLocal inicial={on as boolean} rotulo={f as string} />
              </label>
            ))}
            <p className="mt-3 text-xs text-muted">Quais a loja usa e se o boleto volta: a confirmar.</p>
          </Card>
          <Card titulo="Gateway reserva">
            <p className="text-sm text-muted">Se a Rede ficar fora do ar, o checkout pode cair para um segundo gateway.</p>
            <SelectPainel label="Reserva" opcoes={["Nenhum", "Mercado Pago (a confirmar)"]} className="mt-3" />
          </Card>
        </div>
      )}

      {aba === "Frete e entrega" && (
        <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
          <Card titulo="Formas de envio" className="overflow-hidden">
            <div className="-mx-5 overflow-x-auto">
              <table className="tabela min-w-[560px]">
                <thead>
                  <tr>
                    <th>Forma</th>
                    <th>Tipo</th>
                    <th>Cálculo</th>
                    <th>Ativa</th>
                  </tr>
                </thead>
                <tbody>
                  {transportadoras.map((t) => (
                    <tr key={t.nome} className={cn(!t.ativo && "opacity-60")}>
                      <td className="font-semibold">{t.nome}</td>
                      <td>{t.tipo}</td>
                      <td>{t.api === "A confirmar" ? <Chip tom="warn">API a confirmar</Chip> : t.api}</td>
                      <td>
                        <InterruptorLocal inicial={t.ativo} rotulo={`Ativar ${t.nome}`} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <div className="space-y-4">
            <Card titulo="Frete grátis">
              <ul className="space-y-2 text-sm">
                {[
                  ["Sul (CEP 80000-000 a 99999-999)", "acima de R$ 299"],
                  ["Tubarão e região", "Entrega ShopBike grátis"],
                  ["Bikes acima de R$ 3.000", "PAC grátis para todo o Brasil"],
                ].map(([r, v]) => (
                  <li key={r} className="tile flex justify-between gap-3 p-3">
                    <span>{r}</span>
                    <span className="font-semibold">{v}</span>
                  </li>
                ))}
              </ul>
              <button className="mt-3 text-sm font-semibold">+ Regra</button>
            </Card>
            <Card titulo="Correios (contrato)">
              <div className="grid gap-3">
                <CampoPainel label="Cartão de postagem" defaultValue="Aguardando credenciais" readOnly />
                <CampoPainel label="Prazo de manuseio padrão" defaultValue="1 dia útil" />
                <label className="flex items-center justify-between text-sm">
                  Aviso de recebimento (AR) <InterruptorLocal inicial={false} rotulo="AR" />
                </label>
              </div>
            </Card>
          </div>
        </div>
      )}

      {aba === "SEO e redirecionamentos" && (
        <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
          <Card titulo="Redirecionamentos 301" ferramentas={<><Botao tom="ghost"><Icon name="arrowUp" className="size-4" /> Importar mapa da Climba</Botao><Botao tom="ink"><Icon name="plus" className="size-4" /> Novo</Botao></>} className="overflow-hidden">
            <div className="-mx-5 overflow-x-auto">
              <table className="tabela min-w-[640px]">
                <thead>
                  <tr>
                    <th>URL antiga</th>
                    <th>Nova</th>
                    <th className="text-right">Acessos (30d)</th>
                  </tr>
                </thead>
                <tbody>
                  {redirects.map((r) => (
                    <tr key={r.de}>
                      <td className="font-mono text-xs">{r.de}</td>
                      <td className="font-mono text-xs">{r.para}</td>
                      <td className="text-right tabular">{r.acessos30d.toLocaleString("pt-BR")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-muted">Todas as URLs da Climba entram aqui antes da virada. Páginas que dão erro 404 aparecem para criar o redirecionamento.</p>
          </Card>
          <Card titulo="Arquivos do Google">
            <div className="grid gap-3">
              <CampoPainel label="Sitemap" defaultValue="shopbike.com.br/sitemap.xml" readOnly dica="Gerado automaticamente." />
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink-2">robots.txt</span>
                <textarea defaultValue={"User-agent: *\nDisallow: /admin\nDisallow: /checkout\nSitemap: https://shopbike.com.br/sitemap.xml"} className="h-28 w-full resize-none rounded-xl bg-white p-3 font-mono text-xs ring-1 ring-black/10" />
              </label>
              <CampoPainel label="Título padrão" defaultValue="ShopBike | Bikes e acessórios em Tubarão/SC" />
            </div>
          </Card>
        </div>
      )}

      {aba === "Rastreamento" && (
        <div className="grid gap-4 xl:grid-cols-2">
          <Card titulo="Google e Meta">
            {[
              ["Google Analytics 4", "G-XXXXXXX", true],
              ["Google Search Console", "verificado", true],
              ["Feed Google Shopping (Merchant)", "atualiza a cada hora", true],
              ["Bing Webmaster", "verificado", false],
              ["Meta Pixel", "0000000000", true],
              ["Meta API de Conversões (servidor)", "token em variável de ambiente", true],
              ["Catálogo da Meta", "sincronizado há 12 min", true],
            ].map(([n, d, on]) => (
              <div key={n as string} className="flex items-center gap-3 border-b border-black/5 py-2.5 text-sm">
                <span className="flex-1">
                  <span className="block font-medium">{n}</span>
                  <span className="text-xs text-muted">{d}</span>
                </span>
                <InterruptorLocal inicial={on as boolean} rotulo={n as string} />
              </div>
            ))}
          </Card>
          <Card titulo="Scripts personalizados" tom="red">
            <p className="text-sm">Scripts de terceiros rodam no checkout e podem roubar dados de cartão. Só administradores podem incluir, e cada mudança vai para a auditoria.</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="tile flex items-center justify-between p-3">
                <span>Hotjar (só na vitrine)</span>
                <Chip tom="ok">Fora do checkout</Chip>
              </li>
            </ul>
            <Botao tom="ghost" className="mt-3">
              <Icon name="plus" className="size-4" /> Script
            </Botao>
          </Card>
          <Card titulo="E-mail marketing">
            {["Mailbiz", "MailChimp"].map((m) => (
              <div key={m} className="flex items-center justify-between border-b border-black/5 py-2.5 text-sm">
                <span>
                  {m} <span className="text-xs text-muted">· a confirmar se continua</span>
                </span>
                <InterruptorLocal inicial={false} rotulo={m} />
              </div>
            ))}
          </Card>
        </div>
      )}

      {aba === "Privacidade (LGPD)" && (
        <div className="grid gap-4 xl:grid-cols-2">
          <Card titulo="Consentimentos e retenção">
            <div className="grid gap-3">
              <SelectPainel label="Guardar documentos do antifraude por" opcoes={["90 dias", "180 dias", "1 ano"]} />
              <SelectPainel label="Apagar carrinhos de visitantes após" opcoes={["30 dias", "90 dias"]} />
              <SelectPainel label="Anonimizar clientes inativos após" opcoes={["5 anos", "Nunca"]} />
              <label className="flex items-center justify-between text-sm">
                Banner de cookies com opção “só essenciais” <InterruptorLocal inicial rotulo="Banner de cookies" />
              </label>
            </div>
          </Card>
          <Card titulo="Pedidos dos titulares" className="overflow-hidden">
            <div className="-mx-5 overflow-x-auto">
              <table className="tabela">
                <thead>
                  <tr>
                    <th>Titular</th>
                    <th>Pedido</th>
                    <th>Prazo</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Sabrina P.", "Exportar meus dados", "10/12", "Novo"],
                    ["Mário S.", "Excluir meus dados", "02/12", "Em andamento"],
                    ["Leandro T.", "Excluir meus dados", "20/11", "Concluído"],
                  ].map(([t, p, d, s]) => (
                    <tr key={t}>
                      <td className="font-semibold">{t}</td>
                      <td>{p}</td>
                      <td className="tabular">{d}</td>
                      <td>
                        <Chip tom={s === "Concluído" ? "ok" : s === "Novo" ? "red" : "warn"}>{s}</Chip>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-muted">Pedidos e notas fiscais ficam guardados pelo prazo fiscal mesmo após a exclusão; o resto é anonimizado.</p>
          </Card>
        </div>
      )}
      {aviso}
    </>
  );
}
