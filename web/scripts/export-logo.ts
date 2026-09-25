import { writeFileSync } from 'node:fs'
import { buildLogo } from '../src/logo.ts'

const style = (ink: string, paper: string, shade: string) => `<style>
.p{fill:${paper};stroke:${ink};stroke-width:var(--sw);stroke-linejoin:round}
.n{fill:none;stroke:${ink};stroke-width:calc(var(--sw)*.6);stroke-linejoin:round}
.hl{fill:none;stroke:${ink};stroke-width:calc(var(--sw)*.5);stroke-linecap:round;opacity:.5}
.shade{fill:${shade};stroke:${ink};stroke-width:var(--sw)}
.teeth{fill:${shade}}
</style>`
const inject = (svg: string, css: string) => svg.replace('<defs>', css + '<defs>')

writeFileSync('public/vdn-simbolo.svg', inject(buildLogo({ stroke: 7 }), style('#172633', '#F4F6F7', '#DCE3E8')))
writeFileSync('public/vdn-simbolo-negativo.svg', inject(buildLogo({ stroke: 7 }), style('#E8EEF2', '#172633', '#22364A')))
writeFileSync('public/favicon.svg', inject(buildLogo({ stroke: 22, detail: 'mark', idPrefix: 'fav' }), style('#172633', '#F4F6F7', '#DCE3E8')))
console.log('ok')
