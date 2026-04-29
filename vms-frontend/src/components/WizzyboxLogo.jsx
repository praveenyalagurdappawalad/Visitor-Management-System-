export default function WizzyboxLogo({ size = 'md', showTagline = false, light = false }) {
  const scales = { sm: 0.55, md: 1, lg: 1.4, xl: 2 };
  const s      = scales[size] || 1;
  const iconSz = Math.round(52 * s);
  const textSz = Math.round(28 * s);
  const tagSz  = Math.round(11 * s);
  const gap    = Math.round(6 * s);

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap }}>

        {/* ══════════════ SVG ICON ══════════════ */}
        <svg
          width={iconSz}
          height={iconSz}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* ── Blue "W" — rotated 45° ── */}
          {/*
            The W is drawn as a filled path, then rotated.
            W shape: two V's side by side, thick strokes.
            Rotated ~-45deg around its center.
          */}
          <g transform="rotate(-40, 35, 50)">
            {/* W body — thick filled letter */}
            <path
              d="M8,10 L16,42 L24,22 L32,42 L40,10 L48,10 L36,52 L24,28 L12,52 L0,10 Z"
              fill="#2563c8"
            />
          </g>

          {/* ── Orange "B" — rotated 45° ── */}
          <g transform="rotate(-40, 68, 52)">
            {/* B body — thick filled letter */}
            <path
              d="M44,18 L44,62 L60,62 Q72,62 72,54 Q72,48 64,46 Q72,44 72,36 Q72,18 60,18 Z
                 M52,26 L58,26 Q64,26 64,33 Q64,40 58,40 L52,40 Z
                 M52,48 L60,48 Q66,48 66,55 Q66,62 60,62 L52,62 Z"
              fill="#e8531a"
              fillRule="evenodd"
            />
          </g>

          {/* ── Pixel dots — scattered around ── */}
          {/* Top center — orange */}
          <rect x="46" y="2"  width="8" height="8" rx="1.5" fill="#e8531a" transform="rotate(45,50,6)"/>
          {/* Top right — orange small */}
          <rect x="66" y="8"  width="6" height="6" rx="1"   fill="#e8531a" transform="rotate(45,69,11)"/>
          {/* Right — orange */}
          <rect x="82" y="28" width="6" height="6" rx="1"   fill="#e8531a" transform="rotate(45,85,31)"/>
          {/* Bottom right — blue */}
          <rect x="72" y="72" width="6" height="6" rx="1"   fill="#2563c8" transform="rotate(45,75,75)"/>
          {/* Bottom center — blue */}
          <rect x="44" y="84" width="8" height="8" rx="1.5" fill="#2563c8" transform="rotate(45,48,88)"/>
          {/* Bottom left — blue small */}
          <rect x="22" y="76" width="6" height="6" rx="1"   fill="#2563c8" transform="rotate(45,25,79)"/>
          {/* Left — blue */}
          <rect x="4"  y="52" width="6" height="6" rx="1"   fill="#2563c8" transform="rotate(45,7,55)"/>
        </svg>

        {/* ══════════════ BRAND TEXT ══════════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 0 }}>
            <span style={{
              fontSize: textSz,
              fontWeight: 900,
              color: light ? 'white' : '#2563c8',
              fontFamily: "'Inter','Arial Black','Helvetica Neue',sans-serif",
              letterSpacing: '-0.5px',
              lineHeight: 1,
            }}>
              WIZZY
            </span>
            <span style={{
              fontSize: textSz,
              fontWeight: 900,
              color: '#e8531a',
              fontFamily: "'Inter','Arial Black','Helvetica Neue',sans-serif",
              letterSpacing: '-0.5px',
              lineHeight: 1,
            }}>
              BOX
            </span>
          </div>
          {showTagline && (
            <span style={{
              fontSize: tagSz,
              color: light ? 'rgba(255,255,255,0.55)' : '#7b9fd4',
              fontStyle: 'italic',
              fontWeight: 500,
              letterSpacing: '0.04em',
              paddingLeft: 2,
            }}>
              Pvt. Ltd.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
