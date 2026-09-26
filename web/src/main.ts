import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { buildLogo } from './logo'
import { solutions, patentDrawing } from './drawings'

gsap.registerPlugin(ScrollTrigger)

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector(sel) as T
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => [...root.querySelectorAll(sel)] as T[]

document.documentElement.classList.toggle('js', !reduced)

/* Símbolo ---------------------------------------------------------------- */
// o nome já aparece ao lado do símbolo: a marca pequena é decorativa para leitores de tela
$$('[data-logo="mark"]').forEach((el, i) => {
  el.innerHTML = buildLogo({ stroke: 26, detail: 'mark', idPrefix: `mk${i}` })
  el.firstElementChild!.setAttribute('aria-hidden', 'true')
})
const heroLogo = $('[data-logo="hero"]')
heroLogo.innerHTML = buildLogo({ stroke: 5, idPrefix: 'hero' })

/* Folha de desenho: coordenadas nas bordas ------------------------------- */
$('.sheet-ticks.top').innerHTML = 'ABCDEFGH'.split('').map((c) => `<span>${c}</span>`).join('')
$('.sheet-ticks.left').innerHTML = [1, 2, 3, 4, 5, 6].map((n) => `<span>${n}</span>`).join('')

/* Rolagem suave ---------------------------------------------------------- */
let lenis: Lenis | null = null
if (!reduced) {
  lenis = new Lenis({ duration: 1.1, smoothWheel: true })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((t) => lenis!.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
}

const header = $('.site-header')
const menuBtn = $<HTMLButtonElement>('.menu-toggle')
const menu = $('#menu-mobile')
const closeMenu = () => {
  menuBtn.setAttribute('aria-expanded', 'false')
  menu.hidden = true
  updateHeader()
}
menuBtn.addEventListener('click', () => {
  const open = menuBtn.getAttribute('aria-expanded') !== 'true'
  menuBtn.setAttribute('aria-expanded', String(open))
  menu.hidden = !open
  updateHeader()
})
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape' || menu.hidden) return
  closeMenu()
  menuBtn.focus()
})

$$<HTMLAnchorElement>('a[href^="#"]').forEach((a) =>
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href')!
    const target = id === '#topo' ? document.body : $(id)
    if (!target) return
    e.preventDefault()
    closeMenu()
    if (lenis) lenis.scrollTo(id === '#topo' ? 0 : target, { offset: -76 })
    else target.scrollIntoView()
    history.replaceState(null, '', id === '#topo' ? location.pathname + location.search : id)
    // leva o foco junto com a rolagem (link de pular conteúdo, navegação por teclado)
    const focusTarget = target === document.body ? $('.brand') : target
    if (!focusTarget.matches('a, button, input, textarea, [tabindex]')) focusTarget.setAttribute('tabindex', '-1')
    focusTarget.focus({ preventScroll: true })
  }),
)

/* Cabeçalho: transparente sobre o hero, sólido depois -------------------- */
const hero = $('.hero')
let heroHeight = hero.offsetHeight
window.addEventListener('resize', () => (heroHeight = hero.offsetHeight))
function updateHeader() {
  const past = window.scrollY > heroHeight - 90
  header.classList.toggle('is-solid', past || menuBtn.getAttribute('aria-expanded') === 'true')
  header.classList.toggle('is-scrolled', window.scrollY > 24)
}
window.addEventListener('scroll', updateHeader, { passive: true })
updateHeader()

const navLinks = $$<HTMLAnchorElement>('.nav a')
const io = new IntersectionObserver(
  (entries) =>
    entries.forEach((en) => {
      if (!en.isIntersecting) return
      navLinks.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === `#${en.target.id}`))
    }),
  { rootMargin: '-45% 0px -50% 0px' },
)
$$('main section[id]').forEach((s) => io.observe(s))

/* Hero: desenho do símbolo e mecanismo girando --------------------------- */
const gear = $('.gear', heroLogo)
const cage = $('.cage', heroLogo)
const heroShapes = $$<SVGGeometryElement>('path, circle, rect', heroLogo)

let spin = 0
let boost = 0
let paused = false
let heroVisible = true
if (!reduced) {
  const motionBtn = $<HTMLButtonElement>('.motion-toggle')
  motionBtn.hidden = false
  motionBtn.addEventListener('click', () => {
    paused = !paused
    motionBtn.setAttribute('aria-pressed', String(paused))
    $('.motion-label', motionBtn).textContent = paused ? 'Retomar movimento' : 'Pausar movimento'
  })
  new IntersectionObserver(([en]) => (heroVisible = en.isIntersecting)).observe(heroLogo)

  // gaiola do rolamento gira a ~40% da pista externa (cinemática de rolamento com pista interna fixa)
  gsap.ticker.add((_t, dt) => {
    if (paused || !heroVisible) return
    spin += (dt / 1000) * (6 + boost)
    boost *= 0.94
    gear.setAttribute('transform', `rotate(${spin.toFixed(3)})`)
    cage.setAttribute('transform', `rotate(${(spin * 0.4).toFixed(3)})`)
  })
  lenis?.on('scroll', ({ velocity }: { velocity: number }) => {
    boost = Math.min(80, boost + Math.abs(velocity) * 0.6)
  })

  heroShapes.forEach((s) => s.setAttribute('pathLength', '1'))
  gsap.set(heroShapes, { strokeDasharray: 1, strokeDashoffset: 1, fillOpacity: 0 })

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.15 })
  tl.to(heroShapes, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut', stagger: { amount: 0.9, from: 'end' } }, 0)
    .to(heroShapes, { fillOpacity: 1, duration: 0.8, ease: 'none' }, 1.3)
    .add(() => gsap.set(heroShapes, { clearProps: 'strokeDasharray,strokeDashoffset' }))
    .to('.hero-title .line > span', { y: 0, duration: 1.1, stagger: 0.12 }, 0.2)
    .to('.hero-lead, .hero-actions', { opacity: 1, y: 0, duration: 0.9, stagger: 0.1 }, 0.6)
    .to('.hero-callouts .callout', { opacity: 1, duration: 0.6, stagger: 0.15 }, 1.9)
    .to('.title-block', { opacity: 1, duration: 0.9 }, 1.2)
    .add(() => (boost = 90), 1.5)

  // o símbolo recua levemente ao sair do hero
  gsap.to('.hero-figure', {
    yPercent: 12,
    ease: 'none',
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
  })
}

/* Soluções --------------------------------------------------------------- */
const solList = $('.sol-list')
const solDrawing = $('.sol-drawing')
const solTitle = $('.sol-title')
const solSummary = $('.sol-summary')
const solScope = $('.sol-scope')

solList.innerHTML = solutions
  .map(
    (s, i) =>
      `<li role="presentation"><button role="tab" id="tab-${s.id}" aria-selected="${i === 0}" aria-controls="sol-panel" tabindex="${i === 0 ? 0 : -1}" data-id="${s.id}">${s.title}</button></li>`,
  )
  .join('')
const tabs = $$<HTMLButtonElement>('button', solList)

function showSolution(id: string, animate = true) {
  const s = solutions.find((x) => x.id === id)!
  const url = new URL(location.href)
  if (id === solutions[0].id) url.searchParams.delete('area')
  else url.searchParams.set('area', id)
  history.replaceState(null, '', url)
  tabs.forEach((t) => {
    const on = t.dataset.id === id
    t.setAttribute('aria-selected', String(on))
    t.tabIndex = on ? 0 : -1
  })
  $('.sol-panel').setAttribute('aria-labelledby', `tab-${id}`)
  solDrawing.innerHTML = s.drawing
  solTitle.textContent = s.title
  solSummary.textContent = s.summary
  solScope.innerHTML = s.scope.map((x) => `<li>${x}</li>`).join('')
  if (!animate || reduced) return
  const strokes = $$('.d', solDrawing)
  gsap.fromTo(strokes, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut', stagger: 0.06 })
  gsap.fromTo($$('.dim', solDrawing), { opacity: 0 }, { opacity: 1, duration: 0.5, delay: 0.7 })
  gsap.fromTo([solTitle, solSummary, solScope], { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out' })
}
tabs.forEach((t, i) => {
  t.addEventListener('click', () => showSolution(t.dataset.id!))
  t.addEventListener('keydown', (e) => {
    const moves: Record<string, number> = { ArrowDown: i + 1, ArrowRight: i + 1, ArrowUp: i - 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }
    if (!(e.key in moves)) return
    e.preventDefault()
    const next = tabs[(moves[e.key] + tabs.length) % tabs.length]
    next.focus()
    showSolution(next.dataset.id!)
  })
})
// ?area=vasos abre direto na área (link compartilhável)
const initialArea = solutions.find((s) => s.id === new URLSearchParams(location.search).get('area'))?.id ?? solutions[0].id
showSolution(initialArea, false)
if (!reduced) {
  ScrollTrigger.create({ trigger: '.solutions', start: 'top 60%', once: true, onEnter: () => showSolution(tabs.find((t) => t.getAttribute('aria-selected') === 'true')!.dataset.id!) })
}

/* Patente: ciclo de operação conduzido pela rolagem ---------------------- */
$('.patent-drawing').innerHTML = patentDrawing
const truck = $('#truck')
const trolley = $('#trolley')
const clipRect = $('#tarp-clip-rect')
const legend = $$('.patent-legend li')
const callouts = $$('.patent-svg .co')
const patentDim = $('.patent-dim')
const TARP_START = 244
const TARP_END = 886

const state = { truck: -1150, trolley: TARP_START, tarp: 0 }
const renderPatent = () => {
  truck.setAttribute('transform', `translate(${state.truck} 0)`)
  trolley.setAttribute('transform', `translate(${state.trolley} 0)`)
  clipRect.setAttribute('width', String(Math.max(0, state.trolley - TARP_START + 4)))
}
let lastSteps = ''
const setSteps = (active: number[]) => {
  const key = active.join()
  if (key === lastSteps) return
  lastSteps = key
  const on = (el: Element) => active.includes(Number((el as HTMLElement).dataset.step))
  legend.forEach((li) => li.classList.toggle('is-on', on(li)))
  callouts.forEach((c) => gsap.to(c, { opacity: on(c) ? 1 : 0.15, duration: 0.3 }))
}

if (reduced) {
  Object.assign(state, { truck: 0, trolley: TARP_END })
  renderPatent()
  setSteps([1, 2, 3, 4])
} else {
  renderPatent()
  setSteps([1])
  gsap.set(patentDim, { opacity: 0 })
  const mm = gsap.matchMedia()
  mm.add({ desktop: '(min-width: 861px)', mobile: '(max-width: 860px)' }, (ctx) => {
    const desktop = ctx.conditions!.desktop
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      onUpdate() {
        renderPatent()
        const p = tl.progress()
        // sequência: pórtico → carreta chega à balança → carro estende a lona → carreta coberta
        setSteps(p < 0.05 ? [1] : p < 0.3 ? [1, 3] : p < 0.86 ? [1, 3, 2] : [1, 2, 3, 4])
      },
      scrollTrigger: desktop
        ? { trigger: '.patent', start: 'top top', end: '+=220%', pin: '.patent-pin', scrub: 0.8 }
        : { trigger: '.patent-drawing', start: 'top 85%', end: 'bottom 25%', scrub: 0.6 },
    })
    tl.to(state, { truck: 0, duration: 0.3, ease: 'power2.out' })
      .to(state, { trolley: TARP_END, duration: 0.55, ease: 'power1.inOut' }, 0.32)
      .to(patentDim, { opacity: 1, duration: 0.08 }, 0.88)
      .to({}, { duration: 0.06 })
    return () => {
      Object.assign(state, { truck: -1150, trolley: TARP_START })
      renderPatent()
    }
  })
}

/* Processo: linha de cota que avança ------------------------------------ */
const steps = $('.steps')
const stepItems = $$('.steps li')
if (!reduced) {
  ScrollTrigger.create({
    trigger: steps,
    start: 'top 75%',
    end: 'bottom 55%',
    scrub: true,
    onUpdate: (self) => {
      steps.style.setProperty('--progress', self.progress.toFixed(3))
      stepItems.forEach((li, i) => li.classList.toggle('is-on', self.progress >= i / (stepItems.length - 1) - 0.02))
    },
  })
} else {
  steps.style.setProperty('--progress', '1')
  stepItems.forEach((li) => li.classList.add('is-on'))
}

/* Trajetória: régua desliza com a rolagem ------------------------------- */
if (!reduced) {
  gsap.fromTo('.ruler', { x: 0 }, {
    x: -300,
    ease: 'none',
    scrollTrigger: { trigger: '.history', start: 'top bottom', end: 'bottom top', scrub: true },
  })
}

/* Contato ---------------------------------------------------------------- */
const areas = [...solutions.map((s) => s.title), 'Desenvolvimento de produto']
$('#f-area').innerHTML = areas
  .map((a) => `<label><input type="checkbox" name="area" value="${a}" />${a}</label>`)
  .join('')

const form = $<HTMLFormElement>('.contact-form')
const status = $('.form-status', form)
const submitBtn = $<HTMLButtonElement>('button[type="submit"]', form)

// mensagem ao lado do campo, dizendo como corrigir
function fieldError(f: HTMLInputElement | HTMLTextAreaElement) {
  if (f.value.trim() === '') {
    if (f.name === 'nome') return 'Informe seu nome.'
    if (f.name === 'email') return 'Informe um e-mail para a resposta.'
    return 'Descreva brevemente o equipamento ou a estrutura.'
  }
  if (f.name === 'email' && !f.checkValidity()) return 'Confira o e-mail: use o formato nome@empresa.com.br.'
  return ''
}
const showError = (f: HTMLInputElement | HTMLTextAreaElement, msg: string) => {
  f.setAttribute('aria-invalid', String(msg !== ''))
  const el = document.getElementById(f.getAttribute('aria-describedby') ?? '')
  if (el) el.textContent = msg
}

form.addEventListener('submit', (e) => {
  e.preventDefault()
  const required = $$<HTMLInputElement>('[required]', form)
  const invalid = required.filter((f) => {
    const msg = fieldError(f)
    showError(f, msg)
    return msg !== ''
  })
  if (invalid.length) {
    status.className = 'form-status is-error'
    status.textContent = invalid.length === 1 ? 'Corrija o campo destacado para enviar.' : `Corrija os ${invalid.length} campos destacados para enviar.`
    invalid[0].focus()
    return
  }
  // Prova de conceito: conectar aqui ao serviço de envio (e-mail, CRM ou formulário hospedado).
  const nome = (form.elements.namedItem('nome') as HTMLInputElement).value.trim().split(' ')[0]
  submitBtn.setAttribute('aria-busy', 'true')
  submitBtn.disabled = true
  submitBtn.textContent = 'Enviando…'
  status.className = 'form-status'
  status.textContent = ''
  setTimeout(() => {
    submitBtn.removeAttribute('aria-busy')
    submitBtn.disabled = false
    submitBtn.textContent = 'Enviar mensagem'
    status.className = 'form-status is-ok'
    status.textContent = `Mensagem enviada. Obrigado, ${nome}; retornamos em até um dia útil.`
    form.reset()
  }, 900)
})
// ao corrigir, a mensagem some assim que o campo fica válido
form.addEventListener('input', (e) => {
  const t = e.target as HTMLInputElement
  if (t.getAttribute('aria-invalid') === 'true' && fieldError(t) === '') showError(t, '')
})

$('[data-year]').textContent = String(new Date().getFullYear())
