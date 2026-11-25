/** QR Code ilustrativo (não lê). Na plataforma vem do provedor do Pix. */
export function QrFalso({ seed = 7, className = "" }: { seed?: number; className?: string }) {
  const n = 29;
  // hash determinístico por célula (função pura)
  const preenchida = (x: number, y: number) => {
    const h = Math.imul(x * 374761393 + y * 668265263 + seed * 2147483647, 1274126177) >>> 0;
    return (h ^ (h >>> 13)) % 100 > 48;
  };
  const finder = (x: number, y: number) => (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9);
  const cells: React.ReactNode[] = [];
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) {
      if (finder(x, y)) continue;
      if (preenchida(x, y)) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />);
    }
  const f = (x: number, y: number) => (
    <g key={`f${x}${y}`}>
      <rect x={x} y={y} width="7" height="7" />
      <rect x={x + 1} y={y + 1} width="5" height="5" fill="#fff" />
      <rect x={x + 2} y={y + 2} width="3" height="3" />
    </g>
  );
  return (
    <svg viewBox={`-1 -1 ${n + 2} ${n + 2}`} className={className} role="img" aria-label="QR Code do Pix" shapeRendering="crispEdges">
      <rect x="-1" y="-1" width={n + 2} height={n + 2} fill="#fff" />
      <g fill="#1a1917">
        {cells}
        {f(0, 0)}
        {f(n - 7, 0)}
        {f(0, n - 7)}
      </g>
    </svg>
  );
}
