"use client";

import { useState } from "react";
import { avaliacoesPendentes } from "@/mock/painel";
import { cn } from "@/lib/format";
import { Icon } from "@/ui/icons";
import { useAviso } from "@/ui/painel/controles";
import { Botao, Card, Chip, Vazio } from "@/ui/painel/ui";

export function Moderacao() {
  const [fila, setFila] = useState(avaliacoesPendentes);
  const [resposta, setResposta] = useState<Record<number, string>>({});
  const { avisar, aviso } = useAviso();
  const tirar = (i: number, msg: string) => {
    setFila(fila.filter((_, j) => j !== i));
    avisar(msg);
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
      <div className="min-w-0 space-y-3">
        {fila.length === 0 && (
          <Card>
            <Vazio titulo="Tudo moderado" texto="Novas avaliações e perguntas aparecem aqui." />
          </Card>
        )}
        {fila.map((a, i) => (
          <Card key={a.texto} className="p-5">
            <div className="flex flex-wrap items-center gap-2">
              <Chip tom={a.tipo === "Pergunta" ? "info" : a.nota <= 2 ? "red" : "ok"}>{a.tipo}</Chip>
              <span className="font-semibold">{a.produto}</span>
              <span className="text-sm text-muted">
                · {a.cliente} · {a.quando}
              </span>
              {a.tipo === "Avaliação" && (
                <span className="ml-auto flex">
                  {Array.from({ length: 5 }, (_, k) => (
                    <Icon key={k} name="star" className={cn("size-4", k < a.nota ? "fill-ink text-ink" : "text-line-2")} />
                  ))}
                </span>
              )}
            </div>
            <p className="mt-3 text-[15px]">{a.texto}</p>
            {a.tipo === "Avaliação" && a.nota > 0 && <p className="mt-1 text-xs text-ok">Compra verificada · pedido entregue</p>}
            <textarea
              value={resposta[i] ?? ""}
              onChange={(e) => setResposta({ ...resposta, [i]: e.target.value })}
              placeholder={a.tipo === "Pergunta" ? "Responder publicamente na página do produto…" : "Resposta pública da loja (opcional)…"}
              className="mt-3 h-20 w-full resize-none rounded-xl bg-white p-3 text-sm ring-1 ring-black/10 outline-none focus:ring-ink"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <Botao tom="ink" onClick={() => tirar(i, a.tipo === "Pergunta" ? "Resposta publicada" : "Avaliação publicada")}>
                <Icon name="check" className="size-4" /> {a.tipo === "Pergunta" ? "Responder e publicar" : "Publicar"}
              </Botao>
              {a.tipo === "Avaliação" && a.nota <= 2 && (
                <Botao tom="ghost" onClick={() => avisar("Cliente chamado no WhatsApp pela equipe")}>
                  <Icon name="whatsapp" className="size-4" /> Chamar cliente
                </Botao>
              )}
              <Botao tom="ghost" className="text-danger" onClick={() => tirar(i, "Removida (fica no histórico)")}>
                Não publicar
              </Botao>
            </div>
          </Card>
        ))}
      </div>
      <Card titulo="Notas por produto">
        <ul className="space-y-3 text-sm">
          {[
            ["Oggi Hacker Sport 29", 4.7, 203],
            ["Caloi Explorer Comp 29", 4.6, 112],
            ["Capacete Align II", 4.9, 88],
            ["Caloi Cecci Aro 16", 4.8, 77],
            ["Oggi Big Wheel 7.0", 4.8, 64],
          ].map(([n, nota, t]) => (
            <li key={n as string} className="flex items-center gap-2">
              <span className="flex-1">{n}</span>
              <span className="inline-flex items-center gap-1 font-bold tabular">
                <Icon name="star" className="size-3.5 fill-ink" /> {(nota as number).toFixed(1)}
              </span>
              <span className="w-10 text-right text-xs text-muted">{t}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-muted">Avaliações nativas substituem Trustvox e Ebit (a confirmar com a loja).</p>
      </Card>
      {aviso}
    </div>
  );
}
