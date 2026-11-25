import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { produtos } from "@/mock/catalogo";
import { EditorProduto } from "./editor";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return [...produtos.map((p) => ({ id: p.id })), { id: "novo" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: id === "novo" ? "Novo produto" : (produtos.find((p) => p.id === id)?.nome ?? "Produto") };
}

export default async function ProdutoPage({ params }: Props) {
  const { id } = await params;
  const p = id === "novo" ? null : produtos.find((x) => x.id === id);
  if (id !== "novo" && !p) notFound();
  return <EditorProduto p={p ?? null} />;
}
