import type { Metadata } from "next";
import { PainelShell } from "@/ui/painel/shell";
import { PrototipoBadge } from "@/ui/prototipo-badge";

export const metadata: Metadata = { title: { default: "Painel", template: "%s · Painel ShopBike" } };

export default function PainelLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PainelShell>{children}</PainelShell>
      <div className="hidden md:block">
        <PrototipoBadge destino="loja" />
      </div>
    </>
  );
}
