import type { Metadata } from "next";
import { buscar } from "@/mock/catalogo";
import { Listagem } from "@/ui/loja/listagem";

export const metadata: Metadata = { title: "Busca" };

export default async function BuscaPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const lista = buscar(q);
  return (
    <div className="container-loja pt-8">
      <p className="text-sm text-muted">Resultados para</p>
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">“{q}”</h1>
      {lista.length === 0 ? (
        <div className="mt-8 rounded-3xl bg-snow p-10 text-center">
          <p className="font-semibold">Não encontramos nada com esse termo.</p>
          <p className="mt-1 text-sm text-muted">O termo fica registrado para a equipe cadastrar o que você procura.</p>
        </div>
      ) : (
        <Listagem key={q} produtos={lista} />
      )}
    </div>
  );
}
