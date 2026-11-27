"use client";

import { useState } from "react";
import { Icon } from "@/ui/icons";
import { useAviso } from "@/ui/painel/controles";
import { Botao, Card, Chip, plural } from "@/ui/painel/ui";

const DOCS_EXIGIDOS = ["Contrato social", "Cartão CNPJ"];
const LISTAS = ["Lojista (B2B)", "Equipes de pedal", "Atacado (acima de R$ 20 mil)"];

const cadastros = [
  { empresa: "Ciclo Norte Bikes ME", cnpj: "41.***.***/0001-22", cnpjCompleto: "41.882.310/0001-22", cidade: "Joinville/SC", enviado: "24/11", docs: ["Contrato social", "Cartão CNPJ"] },
  { empresa: "Pedal Forte Comércio", cnpj: "18.***.***/0001-03", cnpjCompleto: "18.204.977/0001-03", cidade: "Lages/SC", enviado: "22/11", docs: ["Cartão CNPJ"] },
];

/** Cadastros de lojista a aprovar: documentos abrem, CNPJ revelável, lista escolhida antes de aprovar. */
export function CadastrosB2B() {
  const [revelados, setRevelados] = useState<string[]>([]);
  const [listas, setListas] = useState<Record<string, string>>({});
  const [doc, setDoc] = useState<{ empresa: string; nome: string } | null>(null);
  const [recusar, setRecusar] = useState<string | null>(null);
  const [motivo, setMotivo] = useState("");
  const { avisar, aviso } = useAviso();

  return (
    <Card titulo="Cadastros aguardando aprovação" ferramentas={<Chip tom="warn">{plural(cadastros.length, "aguardando", "aguardando")}</Chip>}>
      <ul className="space-y-2">
        {cadastros.map((p) => {
          const faltando = DOCS_EXIGIDOS.filter((d) => !p.docs.includes(d));
          const visivel = revelados.includes(p.empresa);
          return (
            <li key={p.empresa} className="tile p-3.5">
              <p className="font-semibold">{p.empresa}</p>
              <p className="flex flex-wrap items-center gap-x-1 text-sm text-muted">
                <span className="tabular">{visivel ? p.cnpjCompleto : p.cnpj}</span>
                {!visivel && (
                  <button
                    data-leitura
                    onClick={() => {
                      setRevelados((r) => [...r, p.empresa]);
                      avisar(`CNPJ de ${p.empresa} revelado · registrado na auditoria`);
                    }}
                    className="grid size-7 place-items-center rounded-full hover:bg-white hover:text-ink"
                    aria-label={`Revelar CNPJ de ${p.empresa}`}
                    title="Revelar para conferir na Receita (fica registrado na auditoria)"
                  >
                    <Icon name="eye" className="size-4" />
                  </button>
                )}
                · {p.cidade} · enviado {p.enviado}
              </p>

              {/* Documentos como links; o que falta aparece em âmbar */}
              <div className="mt-2 flex flex-wrap items-center gap-x-1 gap-y-1">
                {p.docs.map((d) => (
                  <button key={d} data-leitura onClick={() => setDoc({ empresa: p.empresa, nome: d })} className="inline-flex h-8 items-center gap-1.5 rounded-full px-2 text-sm font-semibold text-ink hover:bg-white">
                    <Icon name="doc" className="size-4" /> {d}
                  </button>
                ))}
                {faltando.map((d) => (
                  <span key={d} className="inline-flex h-8 items-center gap-1.5 rounded-full bg-warn-50 px-2.5 text-xs font-semibold text-warn">
                    <Icon name="alert" className="size-3.5" /> {d} pendente
                  </span>
                ))}
              </div>

              <label className="mt-3 block max-w-xs">
                <span className="mb-1 block text-xs font-medium text-muted">Lista de preço</span>
                <select value={listas[p.empresa] ?? LISTAS[0]} onChange={(e) => setListas((l) => ({ ...l, [p.empresa]: e.target.value }))} className="campo h-11 w-full rounded-xl px-3 text-sm">
                  {LISTAS.map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </label>

              {/* Recusar à esquerda (contorno), 24px, Aprovar à direita */}
              <div className="mt-3 flex items-center">
                <Botao tom="ghost" data-leitura className="mr-6 text-danger ring-danger/40 hover:bg-danger-50" onClick={() => setRecusar(p.empresa)}>
                  Recusar
                </Botao>
                <Botao className="ml-auto" disabled={faltando.length > 0} title={faltando.length ? `Falta: ${faltando.join(", ")}` : undefined}>
                  Aprovar
                </Botao>
              </div>
            </li>
          );
        })}
      </ul>

      {doc && (
        <div className="fixed inset-0 z-[60] grid place-items-center p-4" role="dialog" aria-modal aria-label={doc.nome}>
          <button className="absolute inset-0 bg-ink/30 backdrop-blur-[2px]" aria-label="Fechar" onClick={() => setDoc(null)} />
          <div className="rise relative w-full max-w-lg rounded-[var(--radius-card)] bg-paper p-5 shadow-[var(--shadow-pop)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">{doc.nome}</h2>
                <p className="text-sm text-muted">{doc.empresa}</p>
              </div>
              <button onClick={() => setDoc(null)} className="grid size-10 place-items-center rounded-full ring-1 ring-line hover:bg-snow" aria-label="Fechar">
                <Icon name="close" />
              </button>
            </div>
            <div className="mt-4 grid aspect-[3/4] max-h-[60dvh] place-items-center rounded-[var(--radius-tile)] bg-snow text-sm text-faint">
              <span className="grid justify-items-center gap-2">
                <Icon name="doc" className="size-8" />
                PDF enviado pelo lojista (no protótipo, sem arquivo)
              </span>
            </div>
          </div>
        </div>
      )}

      {recusar && (
        <div className="fixed inset-0 z-[60] grid place-items-center p-4" role="alertdialog" aria-modal aria-labelledby="titulo-recusa-b2b">
          <button className="absolute inset-0 bg-ink/30 backdrop-blur-[2px]" aria-label="Fechar" onClick={() => setRecusar(null)} />
          <div className="rise relative w-full max-w-md rounded-[var(--radius-card)] bg-paper p-5 shadow-[var(--shadow-pop)]">
            <h2 id="titulo-recusa-b2b" className="text-lg font-bold">
              Recusar o cadastro de {recusar}?
            </h2>
            <p className="mt-1 text-sm text-muted">O lojista recebe o motivo por e-mail e pode enviar o cadastro de novo.</p>
            <label className="mt-4 block">
              <span className="mb-1.5 block text-sm font-medium">Motivo</span>
              <select value={motivo} onChange={(e) => setMotivo(e.target.value)} className="campo h-11 w-full rounded-xl px-3 text-sm">
                <option value="">Escolha um motivo</option>
                {["Documentos ilegíveis ou incompletos", "CNPJ inativo ou irregular na Receita", "Atividade não é comércio de bicicletas", "Fora da área atendida"].map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </label>
            <div className="mt-5 flex justify-end gap-2">
              <Botao tom="ghost" data-leitura onClick={() => setRecusar(null)}>
                Voltar
              </Botao>
              <Botao tom="perigo" disabled={!motivo}>
                Recusar cadastro
              </Botao>
            </div>
          </div>
        </div>
      )}
      {aviso}
    </Card>
  );
}
