import type { Metadata } from "next";
import { links } from "@/mock/operacao";
import { PagarLink } from "./pagar-link";

export const metadata: Metadata = { title: "Pagamento do seu pedido" };

export default async function PagarPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const link = links.find((l) => l.token === token) ?? links[2];
  return <PagarLink link={link} />;
}
