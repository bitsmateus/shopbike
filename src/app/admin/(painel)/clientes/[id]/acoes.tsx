"use client";

import { useState } from "react";
import { Icon } from "@/ui/icons";
import { useAviso } from "@/ui/painel/controles";
import { Botao } from "@/ui/painel/ui";

/**
 * LGPD: "Excluir dados" fica à esquerda, separado e com contorno vermelho; é irreversível,
 * então pede confirmação digitando o nome do cliente. "Exportar dados" à direita.
 */
export function AcoesLgpd({ nome }: { nome: string }) {
  const [confirmar, setConfirmar] = useState(false);
  const [digitado, setDigitado] = useState("");
  const { avisar, aviso } = useAviso();
  const confere = digitado.trim().toLowerCase() === nome.toLowerCase();

  return (
    <>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Botao tom="ghost" className="mr-auto text-danger ring-danger/40 hover:bg-danger-50" onClick={() => setConfirmar(true)}>
          Excluir dados
        </Botao>
        <Botao tom="ghost" onClick={() => avisar("Arquivo com os dados do cliente gerado (JSON) · registrado na auditoria")}>
          <Icon name="download" className="size-4" /> Exportar dados
        </Botao>
      </div>

      {confirmar && (
        <div className="fixed inset-0 z-[60] grid place-items-center p-4" role="alertdialog" aria-modal aria-labelledby="titulo-excluir">
          <button className="absolute inset-0 bg-ink/30 backdrop-blur-[2px]" aria-label="Voltar" onClick={() => setConfirmar(false)} />
          <div className="rise relative w-full max-w-md rounded-[var(--radius-card)] bg-paper p-5 shadow-[var(--shadow-pop)]">
            <h2 id="titulo-excluir" className="text-lg font-bold">
              Excluir os dados de {nome}?
            </h2>
            <p className="mt-1 text-sm text-muted">Nome, documento, contatos, endereços e conversas são apagados de vez. Os pedidos ficam anonimizados para a contabilidade. Não dá para desfazer.</p>
            <label className="mt-4 block">
              <span className="mb-1.5 block text-sm font-medium">
                Para confirmar, digite <strong className="text-ink">{nome}</strong>
              </span>
              <input autoFocus value={digitado} onChange={(e) => setDigitado(e.target.value)} className="campo h-11 w-full rounded-xl px-3 text-sm" autoComplete="off" />
            </label>
            <div className="mt-5 flex justify-end gap-2">
              <Botao tom="ghost" onClick={() => setConfirmar(false)}>
                Voltar
              </Botao>
              <Botao
                tom="perigo"
                disabled={!confere}
                onClick={() => {
                  setConfirmar(false);
                  setDigitado("");
                  avisar(`Dados de ${nome} excluídos (simulado) · registrado na auditoria`);
                }}
              >
                Excluir de vez
              </Botao>
            </div>
          </div>
        </div>
      )}
      {aviso}
    </>
  );
}

/** Observações da equipe com autor, data e edição. */
export function ObservacoesEquipe({ inicial, autor, data }: { inicial: string; autor: string; data: string }) {
  const [texto, setTexto] = useState(inicial);
  const [rascunho, setRascunho] = useState(inicial);
  const [editando, setEditando] = useState(false);
  const [quem, setQuem] = useState({ autor, data });

  return (
    <div className="mt-4 rounded-[var(--radius-tile)] bg-snow p-3 text-sm">
      <div className="flex items-center justify-between gap-2">
        <p className="font-semibold">Observações da equipe</p>
        {!editando && (
          <button onClick={() => setEditando(true)} className="inline-flex h-8 items-center rounded-full px-2.5 text-[13px] font-semibold hover:bg-white">
            Editar
          </button>
        )}
      </div>
      {editando ? (
        <>
          <textarea autoFocus value={rascunho} onChange={(e) => setRascunho(e.target.value)} className="campo mt-2 h-24 w-full resize-none rounded-xl p-3 text-sm" aria-label="Observações da equipe" />
          <div className="mt-2 flex justify-end gap-2">
            <Botao
              tom="ghost"
              tamanho="card"
              onClick={() => {
                setRascunho(texto);
                setEditando(false);
              }}
            >
              Cancelar
            </Botao>
            <Botao
              tamanho="card"
              onClick={() => {
                setTexto(rascunho);
                setQuem({ autor: "Você", data: "agora" });
                setEditando(false);
              }}
            >
              Salvar
            </Botao>
          </div>
        </>
      ) : (
        <>
          <p className="mt-1 text-ink-2">{texto}</p>
          <p className="mt-1.5 text-xs text-muted">
            {quem.autor} · {quem.data}
          </p>
        </>
      )}
    </div>
  );
}
