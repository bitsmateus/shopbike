"use client";

import { useState } from "react";
import { Icon } from "@/ui/icons";

const CODIGO = "00020126580014BR.GOV.BCB.PIX0136prototipo-shopbike-nao-pagar520400005303986540540495802BR";

export function CopiarPix() {
  const [ok, setOk] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(CODIGO).catch(() => {});
        setOk(true);
        setTimeout(() => setOk(false), 2000);
      }}
      className="mt-5 inline-flex h-12 items-center gap-2 rounded-full bg-ink px-5 font-semibold text-white"
    >
      <Icon name={ok ? "check" : "copy"} className="size-5" />
      {ok ? "Código copiado" : "Copiar código Pix"}
    </button>
  );
}
