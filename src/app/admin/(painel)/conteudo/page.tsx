"use client";

import { useState } from "react";
import { Icon } from "@/ui/icons";
import { Abas, useAviso } from "@/ui/painel/controles";
import { Botao, Cabecalho, CampoPainel, Card, Chip } from "@/ui/painel/ui";

const abas = ["Páginas", "Lojas e horários", "Blog", "Formulários recebidos"] as const;

const paginas = [
  ["Quem somos", "/quem-somos", "Publicada", "12/11/2026"],
  ["Como comprar", "/como-comprar", "Publicada", "10/11/2026"],
  ["Política de trocas e devoluções", "/politicas/trocas", "Publicada", "01/11/2026"],
  ["Política de privacidade (LGPD)", "/politicas/privacidade", "Publicada", "01/11/2026"],
  ["Política de entrega", "/politicas/entrega", "Publicada", "01/11/2026"],
  ["Serviços da oficina", "/oficina", "Publicada", "20/11/2026"],
  ["Trabalhe conosco", "/trabalhe-conosco", "Rascunho", "22/11/2026"],
  ["Agenda de pedais", "/agenda", "Publicada", "24/11/2026"],
];

const posts = [
  ["Como escolher o tamanho do quadro da sua MTB", "Guia", "1.840 visitas", "Publicado"],
  ["Revisão: quando levar a bike na oficina", "Manutenção", "960 visitas", "Publicado"],
  ["Aro 29 ou 27,5? Entenda a diferença", "Guia", "2.312 visitas", "Publicado"],
  ["5 trilhas para pedalar perto de Tubarão", "Pedal", "—", "Rascunho"],
];

const formularios = [
  ["Contato", "Paula R.", "Vocês fazem bike fit?", "25/11, 10:20", "Novo"],
  ["Trabalhe conosco", "André M.", "Mecânico com 5 anos de experiência", "24/11, 15:02", "Lido"],
  ["Contato", "Empresa XPTO", "Orçamento de 20 bikes para a equipe", "23/11, 09:45", "Respondido"],
];

export default function ConteudoPage() {
  const [aba, setAba] = useState<(typeof abas)[number]>("Páginas");
  const { avisar, aviso } = useAviso();
  return (
    <>
      <Cabecalho titulo="Conteúdo" />
      <div className="mb-4">
        <Abas abas={abas} ativa={aba} onChange={setAba} />
      </div>

      {aba === "Páginas" && (
        <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
          <Card titulo="Páginas institucionais" ferramentas={<Botao tom="ink"><Icon name="plus" className="size-4" /> Página</Botao>} className="overflow-hidden">
            <div className="-mx-5 overflow-x-auto">
              <table className="tabela min-w-[520px]">
                <tbody>
                  {paginas.map(([t, url, s, d]) => (
                    <tr key={t}>
                      <td>
                        <span className="block font-semibold">{t}</span>
                        <span className="text-xs text-muted">{url}</span>
                      </td>
                      <td>
                        <Chip tom={s === "Publicada" ? "ok" : "warn"}>{s}</Chip>
                      </td>
                      <td className="text-right text-xs text-muted">editada {d}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <Card titulo="Editando: Política de trocas e devoluções">
            <CampoPainel label="Título" defaultValue="Política de trocas e devoluções" />
            <div className="mt-3 overflow-hidden rounded-xl bg-white ring-1 ring-black/10">
              <div className="flex flex-wrap gap-1 border-b border-black/5 p-1.5">
                {["B", "I", "H2", "• Lista", "Link", "Imagem"].map((b) => (
                  <button key={b} className="rounded-lg px-2.5 py-1 text-xs font-semibold hover:bg-snow">
                    {b}
                  </button>
                ))}
              </div>
              <textarea
                className="h-48 w-full resize-y p-3 text-sm outline-none"
                aria-label="Conteúdo"
                defaultValue={"Você pode trocar ou devolver em até 7 dias após o recebimento (arrependimento) ou em até 30 dias em caso de defeito.\n\nComo pedir: pela área do cliente ou pelo WhatsApp. A etiqueta reversa é gerada por nós."}
              />
            </div>
            <div className="mt-3 flex gap-2">
              <Botao tom="ink" onClick={() => avisar("Página publicada")}>
                Publicar
              </Botao>
              <Botao tom="ghost">Pré-visualizar</Botao>
            </div>
          </Card>
        </div>
      )}

      {aba === "Lojas e horários" && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card titulo="ShopBike Tubarão (matriz)" ferramentas={<Chip tom="ok">Retirada ativa</Chip>}>
            <div className="grid gap-3 sm:grid-cols-2">
              <CampoPainel label="Endereço" defaultValue="Rua exemplo, 000 · Centro" className="sm:col-span-2" />
              <CampoPainel label="Cidade" defaultValue="Tubarão/SC" />
              <CampoPainel label="WhatsApp" defaultValue="(48) 9 0000-0000" />
              <CampoPainel label="Seg a sex" defaultValue="8h às 18h" />
              <CampoPainel label="Sábado" defaultValue="8h às 12h" />
            </div>
            <p className="mt-3 text-xs text-muted">Endereço e telefone reais entram na migração.</p>
          </Card>
          <Card>
            <button className="grid h-full min-h-48 w-full place-items-center rounded-2xl border-2 border-dashed border-black/15 text-sm font-semibold text-muted hover:bg-white/60">
              <span>
                <Icon name="plus" className="mx-auto mb-1 size-5" />
                Adicionar loja ou ponto de retirada
              </span>
            </button>
          </Card>
        </div>
      )}

      {aba === "Blog" && (
        <Card titulo="Blog" ferramentas={<Botao tom="ink"><Icon name="plus" className="size-4" /> Post</Botao>} className="overflow-hidden">
          <p className="-mt-2 mb-3 text-sm text-muted">Hoje o blog está no WordPress. Migrar para cá ou manter: a confirmar com a loja.</p>
          <div className="-mx-5 overflow-x-auto">
            <table className="tabela min-w-[640px]">
              <thead>
                <tr>
                  <th>Post</th>
                  <th>Categoria</th>
                  <th>Visitas (30d)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {posts.map(([t, c, v, s]) => (
                  <tr key={t}>
                    <td className="font-semibold">{t}</td>
                    <td>{c}</td>
                    <td className="tabular">{v}</td>
                    <td>
                      <Chip tom={s === "Publicado" ? "ok" : "warn"}>{s}</Chip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {aba === "Formulários recebidos" && (
        <Card titulo="Formulários do site" className="overflow-hidden">
          <div className="-mx-5 overflow-x-auto">
            <table className="tabela min-w-[720px]">
              <thead>
                <tr>
                  <th>Formulário</th>
                  <th>De</th>
                  <th>Mensagem</th>
                  <th>Quando</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {formularios.map(([f, de, m, q, s]) => (
                  <tr key={de}>
                    <td>
                      <Chip>{f}</Chip>
                    </td>
                    <td className="font-semibold">{de}</td>
                    <td className="max-w-[300px] truncate">{m}</td>
                    <td className="tabular">{q}</td>
                    <td>
                      <Chip tom={s === "Novo" ? "red" : s === "Respondido" ? "ok" : "neutro"}>{s}</Chip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
      {aviso}
    </>
  );
}
