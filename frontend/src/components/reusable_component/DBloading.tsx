
type DbLoadingProps = {
  message?: string;
  className?: string;
};

/**
 * DbLoading
 * - Scales to fill parent (100% width & height). Make the parent have an explicit height.
 * - Uses SVG animations (SMIL) plus small CSS guard for reduced motion.
 */
export default function DbLoading({ message = "Fetching data…", className = "" }: DbLoadingProps) {
  return (
    <div
      role="status"
      aria-busy="true"
      className={`w-full h-full flex items-center justify-center bg-transparent ${className}`}
      style={{ minHeight: 120 }}
    >
      <div className="w-full h-full p-6 flex flex-col items-center justify-center">
        {/* SVG container scales to parent */}
        <svg
          viewBox="0 0 800 360"
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full max-h-[420px]"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="g1" x1="0" x2="1">
              <stop offset="0" stopColor="#60a5fa" stopOpacity="0.95" />
              <stop offset="1" stopColor="#7c3aed" stopOpacity="0.95" />
            </linearGradient>

            <filter id="f-shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000" floodOpacity="0.12" />
            </filter>

            <symbol id="packet">
              <rect x="0" y="0" width="34" height="18" rx="3" ry="3" fill="#fff" stroke="#111827" strokeOpacity="0.08" />
            </symbol>
          </defs>

          {/* LEFT: Database cylinder */}
          <g transform="translate(110,100)">
            <ellipse cx="0" cy="0" rx="80" ry="26" fill="url(#g1)" fillOpacity="0.14" />
            <g transform="translate(0,20)">
              <ellipse cx="0" cy="0" rx="80" ry="26" fill="url(#g1)" />
              <rect x={-80} y={0} width={160} height={120} rx={14} fill="url(#g1)" />
              {/* top rim */}
              <ellipse cx="0" cy={-6} rx="80" ry="18" fill="#fff" fillOpacity="0.06" />
              <text x="0" y="70" textAnchor="middle" fontSize="20" fill="#0f172a" fillOpacity="0.7">Database</text>
            </g>
            {/* stacked rings to suggest DB rows */}
            <g transform="translate(-60,10)" fill="#fff" fillOpacity="0.06">
              <ellipse cx="60" cy="10" rx="60" ry="9" />
              <ellipse cx="60" cy="40" rx="60" ry="9" />
              <ellipse cx="60" cy="70" rx="60" ry="9" />
            </g>
          </g>

          {/* RIGHT: Server rack */}
          <g transform="translate(620,80)">
            <rect x={-68} y={0} width={136} height={160} rx={12} fill="#0b1220" filter="url(#f-shadow)" />
            {/* rack shelves */}
            {Array.from({ length: 5 }).map((_, i) => (
              <g key={i} transform={`translate(${-52},${12 + i * 30})`}>
                <rect x={0} y={0} width={104} height={18} rx={6} fill="#111827" stroke="#111827" strokeOpacity="0.18" />
                <circle cx={86} cy={9} r={3} fill={i % 2 ? "#10b981" : "#f97316"} />
              </g>
            ))}
            <text x={0} y={140} textAnchor="middle" fontSize="18" fill="#e6eef8" fillOpacity="0.9">Server</text>
          </g>

          {/* Center: animated welcome / pipeline */}
          <g transform="translate(300,160)">
            {/* pipeline baseline */}
            <rect x={-160} y={-6} width={320} height={12} rx={6} fill="#e6eef8" fillOpacity="0.12" />

            {/* moving data packets (three copies, phased) */}
            <g id="packets">
              <use href="#packet" x="-150" y="-14" opacity="0.95">
                <animateTransform attributeName="transform" type="translate" values="-150 0; 150 0" dur="1.6s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0;1;1;0" dur="1.6s" repeatCount="indefinite" />
              </use>
              <use href="#packet" x="-190" y="8" opacity="0.9">
                <animateTransform attributeName="transform" type="translate" values="-150 0; 150 0" dur="1.6s" begin="0.3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0;1;1;0" dur="1.6s" begin="0.3s" repeatCount="indefinite" />
              </use>
              <use href="#packet" x="-210" y="-4" opacity="0.88">
                <animateTransform attributeName="transform" type="translate" values="-150 0; 150 0" dur="1.6s" begin="0.6s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0;1;1;0" dur="1.6s" begin="0.6s" repeatCount="indefinite" />
              </use>
            </g>

            {/* "query" pulse on DB side */}
            <circle cx={-158} cy={0} r="8" fill="#60a5fa" fillOpacity="0.22">
              <animate attributeName="r" values="6;12;18" dur="1.8s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;0.18;0" dur="1.8s" repeatCount="indefinite" />
            </circle>

            {/* "response" glow on Server side */}
            <circle cx={158} cy={0} r="8" fill="#7c3aed" fillOpacity="0.22">
              <animate attributeName="r" values="6;12;20" dur="1.8s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;0.18;0" dur="1.8s" repeatCount="indefinite" />
            </circle>
          </g>

          {/* Caption */}
          <g transform="translate(400,300)">
            <rect x={-220} y={-22} width={440} height={44} rx={8} fill="#111827" fillOpacity="0.04" />
            <text x={0} y={0} textAnchor="middle" fontSize="16" fill="#0b1220" fontWeight={600}>
              {message}
            </text>
          </g>

          {/* reduced motion CSS: stops SMIL animations if user prefers reduced motion */}
          <style>
            {`@media (prefers-reduced-motion: reduce) {
                /* Pause SMIL animations by setting animation duration to 0 where applicable */
                svg * { animation-duration: 0s !important; }
                svg use, svg animate, svg animateTransform { display: none !important; }
              }`}
          </style>
        </svg>

        {/* small textual hint for screen readers (visually hidden for others) */}
        <span className="sr-only">{message}</span>
      </div>
    </div>
  );
}
