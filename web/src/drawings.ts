// Desenhos técnicos em traço (line-art). Cada <path class="d"> recebe pathLength=1
// para a animação de "desenho" quando a área é selecionada.

const svg = (body: string, label: string) =>
  `<svg viewBox="0 0 520 320" role="img" aria-label="${label}" class="drawing">${body}</svg>`

const d = (path: string, cls = 'd') => `<path class="${cls}" pathLength="1" d="${path}"/>`
const ground = d('M20 300 H500', 'd ground')
const dim = (x1: number, x2: number, y: number, text: string) => `
  <g class="dim">
    <path d="M${x1} ${y - 8} V${y + 8} M${x2} ${y - 8} V${y + 8} M${x1} ${y} H${x2}"/>
    <path class="arrow" d="M${x1 + 10} ${y - 4} L${x1} ${y} L${x1 + 10} ${y + 4} M${x2 - 10} ${y - 4} L${x2} ${y} L${x2 - 10} ${y + 4}"/>
    <text x="${(x1 + x2) / 2}" y="${y + 20}">${text}</text>
  </g>`

export interface Solution {
  id: string
  title: string
  summary: string
  scope: string[]
  drawing: string
}

export const solutions: Solution[] = [
  {
    id: 'dinamicas',
    title: 'Estruturas dinâmicas',
    summary:
      'Suportes, bases e mezaninos para equipamentos que vibram. Calculamos frequências naturais e fadiga para que a estrutura não entre em ressonância com a máquina.',
    scope: ['Análise modal e de fadiga', 'Bases de peneiras, britadores e motores', 'Reforço de estruturas existentes'],
    drawing: svg(
      [
        ground,
        d('M80 300 V140 M260 300 V140 M440 300 V140'),
        d('M60 120 H460 M60 140 H460'),
        d('M80 140 L260 300 M260 140 L80 300 M260 140 L440 300 M440 140 L260 300'),
        d('M160 120 l12 -6 l-24 -6 l24 -6 l-24 -6 l12 -6 M360 120 l12 -6 l-24 -6 l24 -6 l-24 -6 l12 -6'),
        d('M120 90 V36 H400 V90 Z M120 60 H400'),
        d('M430 40 q8 -14 16 0 t16 0 t16 0 t16 0', 'd accent'),
        dim(80, 440, 318 - 6, 'vão livre'),
      ].join(''),
      'Estrutura metálica com equipamento vibratório apoiado em molas',
    ),
  },
  {
    id: 'ferroviario',
    title: 'Equipamentos ferroviários',
    summary:
      'Vagões, componentes e dispositivos em construção soldada, projetados para ciclos de carga severos e manutenção simples no pátio.',
    scope: ['Estruturas soldadas e detalhamento de soldas', 'Verificação por normas ferroviárias', 'Dispositivos de manutenção e oficina'],
    drawing: svg(
      [
        d('M20 292 H500 M20 300 H500', 'd ground'),
        d('M60 100 H460 V214 H60 Z'),
        d('M110 100 V214 M160 100 V214 M210 100 V214 M260 100 V214 M310 100 V214 M360 100 V214 M410 100 V214'),
        d('M44 214 H476 M44 228 H476 M44 214 V228 M476 214 V228'),
        d('M44 221 H20 M476 221 H500'),
        d('M92 240 H208 M312 240 H428'),
        d('M150 228 V240 M370 228 V240'),
        `<circle class="d" pathLength="1" cx="120" cy="264" r="26"/><circle class="d" pathLength="1" cx="180" cy="264" r="26"/>`,
        `<circle class="d" pathLength="1" cx="340" cy="264" r="26"/><circle class="d" pathLength="1" cx="400" cy="264" r="26"/>`,
        d('M260 100 L292 60 H352', 'd accent'),
        d('M300 50 L316 62 L332 50 Z', 'd accent'),
      ].join(''),
      'Vagão ferroviário em vista lateral com símbolo de solda',
    ),
  },
  {
    id: 'icamento',
    title: 'Movimentação e içamento de cargas',
    summary:
      'Pontes rolantes, pórticos, vigas de içamento e dispositivos especiais, dimensionados para a carga real e para a segurança de quem opera.',
    scope: ['Pontes rolantes e pórticos', 'Balancins e dispositivos de içamento', 'Plano de rigging e memória de cálculo'],
    drawing: svg(
      [
        ground,
        d('M60 300 V64 M460 300 V64'),
        d('M40 60 H480 V84 H40 Z'),
        d('M220 84 V104 H300 V84'),
        d('M250 104 V200 M270 104 V200'),
        d('M240 200 H280 V224 H240 Z'),
        d('M260 224 v12 a14 14 0 1 1 -14 14', 'd accent'),
        d('M246 250 L206 262 M246 250 L314 262'),
        d('M196 262 H324 V300 H196 Z'),
        `<g class="dim"><path d="M490 60 V300 M482 60 H498 M482 300 H498"/><text transform="translate(506 180) rotate(-90)">altura útil</text></g>`,
      ].join(''),
      'Ponte rolante içando uma carga',
    ),
  },
  {
    id: 'vasos',
    title: 'Vasos de pressão',
    summary:
      'Projeto e verificação de vasos, reservatórios e silos, com memória de cálculo e documentação para inspeção e conformidade com a NR-13.',
    scope: ['Dimensionamento de costado e tampos', 'Bocais, suportes e selas', 'Documentação para NR-13'],
    drawing: svg(
      [
        ground,
        d('M60 170 H460', 'd center'),
        d('M140 110 H380 M140 230 H380'),
        d('M140 110 C80 110 80 230 140 230 M380 110 C440 110 440 230 380 230'),
        d('M140 110 V230 M380 110 V230', 'd thin'),
        d('M170 230 L150 300 M230 230 L250 300 M290 230 L270 300 M350 230 L370 300'),
        d('M200 110 V78 M186 78 H214 M320 110 V64 M304 64 H336'),
        `<circle class="d" pathLength="1" cx="260" cy="170" r="30"/>`,
        d('M260 110 V92 M250 92 H270', 'd accent'),
      ].join(''),
      'Vaso de pressão horizontal sobre selas',
    ),
  },
  {
    id: 'tubulacoes',
    title: 'Tubulações industriais',
    summary:
      'Traçado, suportação e análise de flexibilidade de linhas de processo, utilidades e ar comprimido, do isométrico à lista de materiais.',
    scope: ['Análise de tensões e flexibilidade', 'Suportes e ancoragens', 'Isométricos e lista de materiais'],
    drawing: svg(
      [
        ground,
        d('M40 205 H240 Q300 205 300 145 V40 M40 235 H240 Q330 235 330 145 V40'),
        d('M118 190 V250 M130 190 V250 M285 92 H345 M285 80 H345'),
        d('M170 205 L200 235 V205 L170 235 Z'),
        d('M185 220 V186 M172 186 H198'),
        d('M80 235 V300 M60 300 H100 M230 235 V300 M210 300 H250'),
        d('M60 184 H104 M96 178 L104 184 L96 190', 'd accent'),
      ].join(''),
      'Linha de tubulação com válvula, flanges e suportes',
    ),
  },
  {
    id: 'edificacoes',
    title: 'Edificações e estruturas metálicas',
    summary:
      'Galpões, coberturas, plataformas e passarelas industriais, com cálculo estrutural, fundações e detalhamento para fabricação.',
    scope: ['Galpões e coberturas', 'Plataformas, escadas e passarelas', 'Detalhamento para fabricação e montagem'],
    drawing: svg(
      [
        ground,
        d('M80 300 V140 M440 300 V140'),
        d('M64 142 L260 58 L456 142 M80 156 L260 80 L440 156'),
        d('M120 125 V139 M170 104 V118 M220 83 V97 M300 83 V97 M350 104 V118 M400 125 V139', 'd thin'),
        d('M80 300 L440 156 M440 300 L80 156', 'd thin'),
        d('M64 300 H96 V314 H64 Z M424 300 H456 V314 H424 Z'),
        d('M260 58 V28 M244 28 H276', 'd accent'),
        dim(80, 440, 44 - 26, ''),
      ].join(''),
      'Pórtico de galpão metálico com contraventamento',
    ),
  },
]

// Esquema ilustrativo da patente: carreta sobre balança sob pórtico com carro de lona.
export const patentDrawing = `
<svg viewBox="0 0 1200 560" role="img" aria-label="Esquema ilustrativo do equipamento de movimentação de lona sobre carretas em balança rodoviária" class="patent-svg">
  <defs>
    <pattern id="hatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="10" class="hatch-line"/>
    </pattern>
    <clipPath id="tarp-clip"><rect id="tarp-clip-rect" x="250" y="150" width="0" height="140"/></clipPath>
  </defs>

  <!-- solo e fosso da balança -->
  <path class="ln" d="M20 460 H1180"/>
  <rect x="140" y="460" width="920" height="36" fill="url(#hatch)" class="hatch-box"/>
  <path class="ln" d="M140 460 V496 H1060 V460"/>
  <path class="ln thin" d="M140 448 H1060 V460 H140 Z"/>
  <g class="ln thin">
    <path d="M220 460 v-6 M420 460 v-6 M620 460 v-6 M820 460 v-6 M1000 460 v-6"/>
  </g>

  <!-- pórtico -->
  <g class="portico">
    <path class="ln strong" d="M110 460 V96 M1090 460 V96"/>
    <path class="ln strong" d="M86 70 H1114 V96 H86 Z"/>
    <path class="ln thin" d="M110 460 L140 430 M1090 460 L1060 430"/>
    <path class="ln thin" d="M110 150 L170 96 M1090 150 L1030 96"/>
    <path class="ln thin" d="M86 108 H1114"/>
  </g>

  <!-- caminhão -->
  <g id="truck">
    <!-- caçamba -->
    <path class="ln strong fill" d="M240 264 H880 V372 H240 Z"/>
    <path class="ln thin" d="M320 264 V372 M400 264 V372 M480 264 V372 M560 264 V372 M640 264 V372 M720 264 V372 M800 264 V372"/>
    <!-- carga -->
    <path class="ln thin cargo" d="M252 264 C330 214 420 226 520 222 C640 218 760 214 868 264"/>
    <!-- chassi -->
    <path class="ln" d="M226 372 H1040 M226 386 H1040"/>
    <!-- cavalo -->
    <path class="ln strong fill" d="M910 386 V262 Q910 248 924 248 H990 L1040 300 V386 Z"/>
    <path class="ln thin" d="M930 268 H984 L1016 300 H930 Z"/>
    <path class="ln thin" d="M896 372 V320 H910"/>
    <!-- rodas -->
    <g class="wheels">
      <circle class="ln fill" cx="300" cy="420" r="30"/><circle class="ln thin" cx="300" cy="420" r="11"/>
      <circle class="ln fill" cx="370" cy="420" r="30"/><circle class="ln thin" cx="370" cy="420" r="11"/>
      <circle class="ln fill" cx="760" cy="420" r="30"/><circle class="ln thin" cx="760" cy="420" r="11"/>
      <circle class="ln fill" cx="830" cy="420" r="30"/><circle class="ln thin" cx="830" cy="420" r="11"/>
      <circle class="ln fill" cx="990" cy="420" r="30"/><circle class="ln thin" cx="990" cy="420" r="11"/>
    </g>
  </g>

  <!-- lona estendida (revelada pelo clip) -->
  <g clip-path="url(#tarp-clip)">
    <path class="tarp" d="M244 262 Q250 240 270 238 H870 Q884 240 886 262 V282 H244 Z"/>
    <path class="ln tarp-line" d="M244 262 Q250 240 270 238 H870 Q884 240 886 262"/>
  </g>

  <!-- carro de translação com rolo de lona -->
  <g id="trolley">
    <path class="ln fill" d="M-36 96 H36 V122 H-36 Z"/>
    <circle class="ln fill" cx="-20" cy="92" r="6"/><circle class="ln fill" cx="20" cy="92" r="6"/>
    <path class="ln" d="M-8 122 V196 M8 122 V196"/>
    <circle class="ln fill roll" cx="0" cy="212" r="20"/>
    <circle class="ln thin" cx="0" cy="212" r="7"/>
    <path class="ln tarp-line drop" d="M0 232 V238"/>
    <g class="co" data-step="2"><path class="leader" d="M18 200 L60 160"/><circle cx="70" cy="150" r="14"/><text x="70" y="155">2</text></g>
  </g>

  <!-- chamadas -->
  <g class="callouts">
    <g class="co" data-step="1"><path class="leader" d="M1090 200 L1146 170"/><circle cx="1160" cy="162" r="14"/><text x="1160" y="167">1</text></g>
    <g class="co" data-step="3"><path class="leader" d="M1000 478 L1060 530"/><circle cx="1074" cy="536" r="14"/><text x="1074" y="541">3</text></g>
    <g class="co" data-step="4"><path class="leader" d="M560 330 L520 530"/><circle cx="506" cy="536" r="14"/><text x="506" y="541">4</text></g>
  </g>

  <!-- cota do comprimento coberto -->
  <g class="dim patent-dim">
    <path d="M244 176 V192 M886 176 V192 M244 184 H886"/>
    <path class="arrow" d="M256 180 L244 184 L256 188 M874 180 L886 184 L874 188"/>
    <text x="565" y="174">comprimento coberto</text>
  </g>
</svg>`
