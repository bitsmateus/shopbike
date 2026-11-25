/*
 * Ilustração de produto para o protótipo (substitui as fotos reais).
 * Bikes desenhadas em SVG na cor da variação escolhida.
 */
export type ArtKind =
  | "mtb"
  | "speed"
  | "urbana"
  | "eletrica"
  | "infantil"
  | "capacete"
  | "vestuario"
  | "pecas"
  | "acessorio"
  | "pneu";

export function ProductArt({
  kind,
  color = "#1a1917",
  className = "",
  angle = 0,
}: {
  kind: ArtKind;
  color?: string;
  className?: string;
  /** 0 = lateral; 1..3 = variações de enquadramento para a galeria */
  angle?: number;
}) {
  const zoom = [1, 1.35, 1.7, 1.15][angle % 4];
  const origin = ["200 140", "290 150", "190 175", "120 150"][angle % 4];
  return (
    <svg viewBox="0 0 400 280" className={className} role="img" aria-label="Ilustração do produto">
      <defs>
        <radialGradient id="sb-floor" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1a1917" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#1a1917" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g transform={`translate(${200 - 200 * zoom} ${140 - 140 * zoom}) scale(${zoom})`} style={{ transformOrigin: origin }}>
        <ellipse cx="200" cy="250" rx="160" ry="10" fill="url(#sb-floor)" />
        {kind === "mtb" && <Bike color={color} variant="mtb" />}
        {kind === "speed" && <Bike color={color} variant="speed" />}
        {kind === "urbana" && <Bike color={color} variant="urbana" />}
        {kind === "eletrica" && <Bike color={color} variant="eletrica" />}
        {kind === "infantil" && (
          <g transform="translate(60 60) scale(0.7)">
            <Bike color={color} variant="infantil" />
          </g>
        )}
        {kind === "capacete" && <Capacete color={color} />}
        {kind === "vestuario" && <Camisa color={color} />}
        {kind === "pecas" && <Cassete color={color} />}
        {kind === "acessorio" && <Garrafa color={color} />}
        {kind === "pneu" && <Pneu />}
      </g>
    </svg>
  );
}

function Wheel({ cx, cy, r, tire }: { cx: number; cy: number; r: number; tire: number }) {
  const spokes = Array.from({ length: 12 }, (_, i) => (i * Math.PI) / 6);
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1a1917" strokeWidth={tire} />
      <circle cx={cx} cy={cy} r={r - tire / 2 - 3} fill="none" stroke="#b9b6b0" strokeWidth="2.5" />
      {spokes.map((a) => (
        <line
          key={a}
          x1={cx}
          y1={cy}
          x2={cx + Math.cos(a) * (r - tire / 2 - 4)}
          y2={cy + Math.sin(a) * (r - tire / 2 - 4)}
          stroke="#cfccc6"
          strokeWidth="1"
        />
      ))}
      <circle cx={cx} cy={cy} r="6" fill="#2b2a27" />
    </g>
  );
}

function Bike({ color, variant }: { color: string; variant: "mtb" | "speed" | "urbana" | "eletrica" | "infantil" }) {
  const tire = variant === "mtb" || variant === "eletrica" ? 11 : variant === "speed" ? 5 : 8;
  const R = 62;
  const rear = { x: 95, y: 190 };
  const front = { x: 305, y: 190 };
  const bb = { x: 190, y: 196 };
  const seat = { x: 168, y: 104 };
  const headTop = { x: 282, y: 100 };
  const headBot = { x: 290, y: 128 };
  const topTube = variant === "urbana" ? { x: 200, y: 160 } : seat;
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      <Wheel cx={rear.x} cy={rear.y} r={R} tire={tire} />
      <Wheel cx={front.x} cy={front.y} r={R} tire={tire} />
      {/* corrente e coroa */}
      <circle cx={bb.x} cy={bb.y} r="13" fill="none" stroke="#2b2a27" strokeWidth="3" />
      <path d={`M${rear.x} ${rear.y - 8} L${bb.x} ${bb.y - 13} M${rear.x} ${rear.y + 8} L${bb.x} ${bb.y + 13}`} stroke="#8b8983" strokeWidth="1.6" />
      {/* quadro */}
      <g stroke={color} strokeWidth={variant === "speed" ? 7 : 9} fill="none">
        <path d={`M${rear.x} ${rear.y} L${bb.x} ${bb.y}`} />
        <path d={`M${rear.x} ${rear.y} L${seat.x + 4} ${seat.y + 14}`} />
        <path d={`M${seat.x} ${seat.y} L${bb.x} ${bb.y}`} />
        <path d={`M${variant === "urbana" ? topTube.x : seat.x + 2} ${variant === "urbana" ? topTube.y : seat.y + 6} L${headTop.x} ${headTop.y + 6}`} />
        <path d={`M${bb.x} ${bb.y} L${headBot.x} ${headBot.y}`} strokeWidth={variant === "speed" ? 8 : 11} />
        <path d={`M${headTop.x} ${headTop.y} L${headBot.x} ${headBot.y}`} strokeWidth="11" />
      </g>
      {/* garfo */}
      {variant === "mtb" || variant === "eletrica" ? (
        <g>
          <path d={`M${headBot.x} ${headBot.y} L${headBot.x + 6} ${headBot.y + 26}`} stroke="#2b2a27" strokeWidth="10" />
          <path d={`M${headBot.x + 6} ${headBot.y + 26} L${front.x} ${front.y}`} stroke="#5f5d58" strokeWidth="6" />
        </g>
      ) : (
        <path d={`M${headBot.x} ${headBot.y} Q${front.x - 2} ${front.y - 30} ${front.x} ${front.y}`} stroke={color} strokeWidth="6" fill="none" />
      )}
      {/* bateria */}
      {variant === "eletrica" && (
        <g transform={`rotate(-35 ${(bb.x + headBot.x) / 2} ${(bb.y + headBot.y) / 2})`}>
          <rect x={(bb.x + headBot.x) / 2 - 30} y={(bb.y + headBot.y) / 2 - 17} width="60" height="16" rx="5" fill="#1a1917" />
          <rect x={(bb.x + headBot.x) / 2 + 14} y={(bb.y + headBot.y) / 2 - 13} width="8" height="8" rx="2" fill="#e30618" />
        </g>
      )}
      {/* canote e selim */}
      <path d={`M${seat.x} ${seat.y} L${seat.x - 5} ${seat.y - 20}`} stroke="#2b2a27" strokeWidth="5" />
      <path d={`M${seat.x - 30} ${seat.y - 22} Q${seat.x - 5} ${seat.y - 30} ${seat.x + 18} ${seat.y - 22}`} stroke="#1a1917" strokeWidth="8" fill="none" />
      {/* mesa e guidão */}
      <path d={`M${headTop.x} ${headTop.y} L${headTop.x + 2} ${headTop.y - 14} L${headTop.x + 22} ${headTop.y - 18}`} stroke="#2b2a27" strokeWidth="5" fill="none" />
      {variant === "speed" ? (
        <path d={`M${headTop.x + 22} ${headTop.y - 18} q16 0 16 14 q0 14 -14 12`} stroke="#1a1917" strokeWidth="5" fill="none" />
      ) : variant === "urbana" ? (
        <path d={`M${headTop.x + 22} ${headTop.y - 18} q-10 -10 -34 -6`} stroke="#1a1917" strokeWidth="5" fill="none" />
      ) : (
        <path d={`M${headTop.x + 14} ${headTop.y - 16} L${headTop.x + 30} ${headTop.y - 20}`} stroke="#1a1917" strokeWidth="6" />
      )}
      {/* pedal */}
      <path d={`M${bb.x} ${bb.y} L${bb.x + 14} ${bb.y + 18}`} stroke="#2b2a27" strokeWidth="4" />
      <rect x={bb.x + 8} y={bb.y + 17} width="16" height="5" rx="2" fill="#1a1917" />
    </g>
  );
}

function Capacete({ color }: { color: string }) {
  return (
    <g>
      <path d="M90 190 C 90 100, 170 60, 230 70 C 300 80, 330 140, 320 190 Z" fill={color} />
      <path d="M90 190 L 320 190 L 300 205 L 110 205 Z" fill="#1a1917" />
      {[130, 170, 210, 250].map((x, i) => (
        <path key={x} d={`M${x} ${105 + (i % 2) * -8} q 20 -10 40 -6`} stroke="#ffffff" strokeOpacity=".7" strokeWidth="10" strokeLinecap="round" fill="none" />
      ))}
      <path d="M250 190 q10 30 -20 40" stroke="#5f5d58" strokeWidth="4" fill="none" />
    </g>
  );
}

function Camisa({ color }: { color: string }) {
  return (
    <g>
      <path d="M150 50 L120 60 L70 110 L105 140 L130 120 L130 240 L270 240 L270 120 L295 140 L330 110 L280 60 L250 50 Q200 80 150 50 Z" fill={color} />
      <path d="M130 160 L270 160" stroke="#ffffff" strokeOpacity=".8" strokeWidth="10" />
      <path d="M130 178 L270 178" stroke="#e30618" strokeWidth="6" />
      <path d="M200 70 L200 240" stroke="#1a1917" strokeOpacity=".15" strokeWidth="2" />
    </g>
  );
}

function Cassete({ color }: { color: string }) {
  const rings = [90, 80, 70, 60, 50, 41, 33, 26];
  return (
    <g>
      {rings.map((r, i) => (
        <circle key={r} cx={200} cy={150} r={r} fill="none" stroke={i % 2 ? "#8b8983" : color} strokeWidth="7" strokeDasharray="4 3" />
      ))}
      <circle cx="200" cy="150" r="16" fill="#1a1917" />
    </g>
  );
}

function Garrafa({ color }: { color: string }) {
  return (
    <g>
      <rect x="160" y="70" width="80" height="170" rx="22" fill={color} />
      <rect x="178" y="42" width="44" height="32" rx="8" fill="#1a1917" />
      <rect x="192" y="28" width="16" height="18" rx="4" fill="#5f5d58" />
      <rect x="160" y="130" width="80" height="34" fill="#ffffff" fillOpacity=".85" />
      <text x="200" y="153" textAnchor="middle" fontSize="16" fontWeight="700" fill="#e30618" fontFamily="sans-serif">
        SB
      </text>
    </g>
  );
}

function Pneu() {
  return (
    <g>
      <circle cx="200" cy="145" r="100" fill="none" stroke="#1a1917" strokeWidth="26" />
      <circle cx="200" cy="145" r="100" fill="none" stroke="#5f5d58" strokeWidth="26" strokeDasharray="3 9" />
      <circle cx="200" cy="145" r="84" fill="none" stroke="#e30618" strokeWidth="2" />
    </g>
  );
}
