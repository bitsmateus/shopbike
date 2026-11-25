"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogoSistema } from "@/ui/brand";
import { Icon } from "@/ui/icons";

export default function LoginPage() {
  const router = useRouter();
  const [etapa, setEtapa] = useState<"senha" | "2fa">("senha");
  return (
    <div className="painel-bg grid min-h-dvh place-items-center p-4">
      <div className="glass-strong rise w-full max-w-md rounded-[28px] p-7 md:p-9">
        <LogoSistema />
        {etapa === "senha" ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setEtapa("2fa");
            }}
            className="mt-8 space-y-3"
          >
            <h1 className="text-2xl font-bold tracking-tight">Entrar no painel</h1>
            <p className="text-sm text-muted">Use o seu acesso da equipe ShopBike.</p>
            <input autoComplete="username" placeholder="E-mail" aria-label="E-mail" className="h-12 w-full rounded-xl bg-white px-4 ring-1 ring-black/10 outline-none focus:ring-2 focus:ring-ink" />
            <input type="password" autoComplete="current-password" placeholder="Senha" aria-label="Senha" className="h-12 w-full rounded-xl bg-white px-4 ring-1 ring-black/10 outline-none focus:ring-2 focus:ring-ink" />
            <button className="h-12 w-full rounded-full bg-ink font-semibold text-white">Continuar</button>
          </form>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              router.push("/admin");
            }}
            className="mt-8 space-y-4"
          >
            <div className="grid size-12 place-items-center rounded-full bg-red-50 text-red">
              <Icon name="lock" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Verificação em duas etapas</h1>
            <p className="text-sm text-muted">Digite o código de 6 dígitos do seu app autenticador.</p>
            <div className="flex justify-between gap-2">
              {Array.from({ length: 6 }, (_, i) => (
                <input key={i} inputMode="numeric" maxLength={1} aria-label={`Dígito ${i + 1}`} className="h-14 w-full rounded-xl bg-white text-center text-xl font-bold ring-1 ring-black/10 outline-none focus:ring-2 focus:ring-ink" />
              ))}
            </div>
            <button className="h-12 w-full rounded-full bg-ink font-semibold text-white">Entrar</button>
            <p className="text-center text-xs text-muted">Acesso registrado no log de auditoria.</p>
          </form>
        )}
      </div>
    </div>
  );
}
