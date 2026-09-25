// Reconstrução geométrica do símbolo VDN (engrenagem + rolamento + perfis + cantoneira).
// Coordenadas centradas na origem; viewBox -600 -600 1200 1360.

const f = (n: number) => +n.toFixed(2)

function gearPath(teeth: number, rRoot: number, rTip: number): string {
  const step = (Math.PI * 2) / teeth
  // proporções do dente: base larga, topo estreito (perfil trapezoidal do desenho original)
  const baseHalf = step * 0.3
  const tipHalf = step * 0.13
  let d = ''
  for (let i = 0; i < teeth; i++) {
    const a = i * step - Math.PI / 2
    const pts: [number, number][] = [
      [a - step / 2, rRoot],
      [a - baseHalf, rRoot],
      [a - tipHalf, rTip],
      [a + tipHalf, rTip],
      [a + baseHalf, rRoot],
    ]
    pts.forEach(([ang, r], j) => {
      const x = f(Math.cos(ang) * r)
      const y = f(Math.sin(ang) * r)
      d += (i === 0 && j === 0 ? 'M' : 'L') + x + ' ' + y + ' '
    })
  }
  return d + 'Z'
}

const circle = (r: number, cls = '') => `<circle r="${r}"${cls ? ` class="${cls}"` : ''}/>`

export interface LogoOptions {
  stroke?: number
  detail?: 'full' | 'mark'
  idPrefix?: string
}

export function buildLogo({ stroke = 6, detail = 'full', idPrefix = 'vdn' }: LogoOptions = {}): string {
  const full = detail === 'full'
  const teeth = full ? 60 : 40
  const elements = 16

  // corpo rolante: esferas e roletes alternados
  let rolling = ''
  for (let i = 0; i < elements; i++) {
    const a = (i / elements) * 360
    const isBall = i % 2 === 0
    rolling += `<g transform="rotate(${f(a)}) translate(0 -302)">`
    rolling += isBall
      ? `<circle r="47" class="p"/>${full ? '<path d="M-26 -18 A32 32 0 0 1 -6 -34" class="hl"/>' : ''}`
      : `<rect x="-34" y="-34" width="68" height="68" rx="6" class="p"/>${full ? '<rect x="-24" y="-24" width="48" height="48" rx="4" class="n"/><circle r="15" class="n"/>' : ''}`
    rolling += '</g>'
  }

  // perfis internos (feixe de barras vistas em perspectiva)
  const bars = `
    <g clip-path="url(#${idPrefix}-bore)">
      <rect x="-230" y="-230" width="460" height="460" class="shade"/>
      <path d="M-200 30 L-150 30 L-120 70 L-120 260 L-200 260 Z" class="p"/>
      <path d="M200 30 L150 30 L120 70 L120 260 L200 260 Z" class="p"/>
      <path d="M-128 -20 L-112 -40 L-18 -40 L-18 260 L-128 260 Z" class="p"/>
      <path d="M-112 -40 L-96 -24 L-96 260" class="n"/>
      <path d="M-4 -12 L12 -30 L108 -30 L108 260 L-4 260 Z" class="p"/>
      <path d="M12 -30 L28 -14 L28 260" class="n"/>
      <path d="M-18 -40 L-4 -12" class="n"/>
    </g>`

  // cantoneira (perfil L) em primeiro plano, sobre pedestal
  const angle = `
    <g class="angle">
      <path d="M-150 640 L-150 760 L330 760 L330 640 Z" class="p"/>
      <path d="M-150 640 L-122 612 L352 612 L330 640" class="p"/>
      <path d="M352 612 L352 732 L330 760" class="p"/>
      <path d="M-312 300 Q-312 270 -282 270 L-212 270 Q-186 270 -186 296 L-186 540 L360 540 L392 564 L392 640 L-292 640 Q-312 640 -312 620 Z" class="p"/>
      <path d="M-186 540 L-160 566 L392 566" class="n"/>
      <path d="M-160 566 L-160 640" class="n"/>
    </g>`

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-600 -600 1200 1370" role="img" aria-label="Símbolo VDN Engenharia" style="--sw:${stroke}">
  <defs><clipPath id="${idPrefix}-bore"><circle r="200"/></clipPath></defs>
  <g class="vdn-logo">
    <g class="gear">
      <path d="${gearPath(teeth, 522, 578)}" class="p teeth"/>
      ${circle(522, 'p')}
      ${circle(440, 'p')}
      ${full ? circle(420, 'n') : ''}
      ${circle(358, 'shade')}
    </g>
    <g class="cage">${rolling}</g>
    <g class="race">
      ${circle(252, 'p')}
      ${full ? circle(236, 'n') : ''}
      ${circle(200, 'p')}
    </g>
    ${full ? bars : ''}
    ${angle}
  </g>
</svg>`
}
