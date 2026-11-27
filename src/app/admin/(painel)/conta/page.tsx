"use client";

import { Icon } from "@/ui/icons";
import { InterruptorLocal, useAviso } from "@/ui/painel/controles";
import { Botao, Cabecalho, CampoPainel, Card, Chip } from "@/ui/painel/ui";
import { QrFalso } from "@/ui/qr-falso";

export default function ContaPage() {
  const { avisar, aviso } = useAviso();
  return (
    <>
      <Cabecalho titulo="Minha conta" />
      <div className="grid gap-4 xl:grid-cols-3">
        <Card titulo="Perfil">
          <div className="mb-4 flex items-center gap-3">
            <span className="grid size-14 place-items-center rounded-full bg-ink text-lg font-bold text-white">GE</span>
            <div>
              <p className="font-bold">Gerência</p>
              <Chip tom="ink">Administrador</Chip>
            </div>
          </div>
          <div className="grid gap-3">
            <CampoPainel label="Nome" defaultValue="Gerência" />
            <CampoPainel label="E-mail" defaultValue="gerencia@shopbike.com.br" />
            <CampoPainel label="WhatsApp para alertas" defaultValue="(48) 90000-0000" />
          </div>
          <Botao tom="ink" className="mt-4" onClick={() => avisar("Perfil salvo")}>
            Salvar
          </Botao>
        </Card>
        <Card titulo="Segurança">
          <div className="flex items-center gap-2 text-sm">
            <Icon name="shield" className="size-5 text-ok" />
            <span className="font-semibold">Verificação em duas etapas ativa</span>
          </div>
          <div className="mt-4 flex items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-black/5">
            <QrFalso seed={3} className="size-24 shrink-0" />
            <p className="text-sm text-muted">Para trocar de celular, leia o QR Code no app autenticador (Google Authenticator, Authy) e confirme com o código.</p>
          </div>
          <div className="mt-4 grid gap-3">
            <CampoPainel label="Senha atual" type="password" />
            <CampoPainel label="Nova senha" type="password" dica="Mínimo de 12 caracteres." />
          </div>
          <Botao tom="ghost" className="mt-3" onClick={() => avisar("Senha alterada · outras sessões encerradas")}>
            Trocar senha
          </Botao>
        </Card>
        <div className="space-y-4">
          <Card titulo="Sessões abertas">
            <ul className="space-y-2 text-sm">
              {[
                ["Chrome · Windows", "Tubarão/SC · agora", true],
                ["Safari · iPhone", "Tubarão/SC · há 2 h", false],
              ].map(([d, l, atual]) => (
                <li key={d as string} className="tile flex items-center gap-3 p-3">
                  <Icon name={(d as string).includes("iPhone") ? "device" : "store"} className="size-5 text-muted" />
                  <span className="flex-1">
                    <span className="block font-medium">{d}</span>
                    <span className="text-xs text-muted">{l}</span>
                  </span>
                  {atual ? <Chip tom="ok">Esta</Chip> : <button className="text-xs font-semibold text-danger">Encerrar</button>}
                </li>
              ))}
            </ul>
          </Card>
          <Card titulo="Meus alertas">
            {[
              ["Pedido em análise no antifraude", true],
              ["Integração parada", true],
              ["Novo pedido pago", false],
              ["Resumo do dia às 18h", true],
            ].map(([t, on]) => (
              <label key={t as string} className="flex items-center justify-between border-b border-black/5 py-2.5 text-sm">
                {t} <InterruptorLocal inicial={on as boolean} rotulo={t as string} />
              </label>
            ))}
          </Card>
        </div>
      </div>
      {aviso}
    </>
  );
}
