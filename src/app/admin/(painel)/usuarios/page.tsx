"use client";

import { useState } from "react";
import { perfis, permissoes, usuarios } from "@/mock/painel";
import { cn } from "@/lib/format";
import { Icon } from "@/ui/icons";
import { Abas, Gaveta, useAviso } from "@/ui/painel/controles";
import { Botao, Cabecalho, CampoPainel, Card, Chip, SelectPainel } from "@/ui/painel/ui";

const abas = ["Usuários", "Perfis e permissões"] as const;

export default function UsuariosPage() {
  const [aba, setAba] = useState<(typeof abas)[number]>("Usuários");
  const [convite, setConvite] = useState(false);
  const { avisar, aviso } = useAviso();
  return (
    <>
      <Cabecalho
        titulo="Usuários e perfis"
        kpis={[
          { icon: "users", rotulo: "Usuários ativos", valor: `${usuarios.filter((u) => u.ativo).length}` },
          { icon: "lock", rotulo: "Sem 2FA", valor: `${usuarios.filter((u) => u.ativo && !u.doisFatores).length}` },
          { icon: "shield", rotulo: "Perfis", valor: `${perfis.length}` },
        ]}
        acoes={
          <Botao tom="ink" onClick={() => setConvite(true)}>
            <Icon name="plus" className="size-4" /> Convidar usuário
          </Botao>
        }
      />
      <div className="mb-4">
        <Abas abas={abas} ativa={aba} onChange={setAba} />
      </div>

      {aba === "Usuários" && (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="tabela min-w-[820px]">
              <thead>
                <tr>
                  <th>Usuário</th>
                  <th>Perfil</th>
                  <th>2FA</th>
                  <th>Último acesso</th>
                  <th>Situação</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.email} className={cn(!u.ativo && "opacity-60")}>
                    <td>
                      <span className="flex items-center gap-3">
                        <span className="grid size-9 place-items-center rounded-full bg-ink text-xs font-bold text-white">{u.nome.slice(0, 2).toUpperCase()}</span>
                        <span>
                          <span className="block font-semibold">{u.nome}</span>
                          <span className="text-xs text-muted">{u.email}</span>
                        </span>
                      </span>
                    </td>
                    <td>
                      <Chip tom={u.perfil === "Administrador" ? "ink" : "neutro"}>{u.perfil}</Chip>
                    </td>
                    <td>{u.doisFatores ? <Chip tom="ok">Ativo</Chip> : <Chip tom="red">Pendente</Chip>}</td>
                    <td>{u.ultimoAcesso}</td>
                    <td>{u.ativo ? <Chip tom="ok">Ativo</Chip> : <Chip tom="apagado">Desativado</Chip>}</td>
                    <td className="text-right">
                      {u.ativo && !u.doisFatores && (
                        <button onClick={() => avisar(`Lembrete de 2FA enviado para ${u.nome}`)} className="text-sm font-semibold text-red">
                          Exigir 2FA
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="border-t border-black/5 px-5 py-3 text-xs text-muted">A Climba tem 18 usuários. Cada um recebe convite por e-mail e precisa ativar o 2FA no primeiro acesso.</p>
        </Card>
      )}

      {aba === "Perfis e permissões" && (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="tabela min-w-[900px]">
              <thead>
                <tr>
                  <th className="sticky left-0 bg-[#f7f6f5]">Permissão</th>
                  {perfis.map((p) => (
                    <th key={p.nome} className="text-center">
                      {p.nome}
                      <span className="block text-[10px] font-normal normal-case">{p.usuarios} usuários</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {permissoes.map((perm) => (
                  <tr key={perm}>
                    <td className="sticky left-0 bg-[#f7f6f5] font-medium">{perm}</td>
                    {perfis.map((p) => (
                      <td key={p.nome} className="text-center">
                        <input type="checkbox" defaultChecked={p.permite.includes(perm)} disabled={p.nome === "Administrador"} aria-label={`${p.nome}: ${perm}`} className="size-4 accent-[var(--color-ink)]" />
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td className="sticky left-0 bg-[#f7f6f5] font-medium">Desconto máximo no link</td>
                  {perfis.map((p) => (
                    <td key={p.nome} className="text-center text-sm font-semibold">
                      {p.nome === "Administrador" ? "Livre" : p.descontoMax ? `${p.descontoMax}%` : "—"}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex justify-between border-t border-black/5 px-5 py-3">
            <Botao tom="ghost">
              <Icon name="plus" className="size-4" /> Novo perfil
            </Botao>
            <Botao tom="ink" onClick={() => avisar("Permissões salvas · registradas na auditoria")}>
              Salvar permissões
            </Botao>
          </div>
        </Card>
      )}

      {convite && (
        <Gaveta
          titulo="Convidar usuário"
          sub="A pessoa recebe um e-mail para criar a senha e ativar o 2FA."
          fechar={() => setConvite(false)}
          largura="max-w-lg"
          rodape={
            <Botao
              tom="ink"
              onClick={() => {
                setConvite(false);
                avisar("Convite enviado");
              }}
            >
              Enviar convite
            </Botao>
          }
        >
          <div className="grid gap-3">
            <CampoPainel label="Nome" />
            <CampoPainel label="E-mail" type="email" />
            <SelectPainel label="Perfil" opcoes={perfis.map((p) => p.nome)} />
            <CampoPainel label="WhatsApp (para alertas)" />
          </div>
        </Gaveta>
      )}
      {aviso}
    </>
  );
}
