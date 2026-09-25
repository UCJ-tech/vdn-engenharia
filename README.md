# VDN Engenharia: site institucional (prova de conceito)

## Rodar

```bash
cd web
npm install
npm run dev        # http://localhost:5173
npm run build      # gera web/dist (site estático, pode ir para qualquer hospedagem)
npm run logo       # regenera os SVGs do símbolo em web/public
```

## Estrutura

- `web/index.html`: todo o conteúdo e os textos
- `web/src/styles.css`: tokens de cor/tipografia e layout
- `web/src/main.ts`: animações (GSAP + ScrollTrigger, rolagem suave com Lenis), abas, formulário
- `web/src/logo.ts`: símbolo VDN reconstruído geometricamente (engrenagem Z=60, rolamento, perfis, cantoneira)
- `web/src/drawings.ts`: desenhos técnicos das áreas de atuação e esquema da patente
- `web/public/vdn-simbolo.svg`, `vdn-simbolo-negativo.svg`, `favicon.svg`: símbolo vetorizado
- `.claude/skills/frontend-design`: skill de design usada no projeto
- `.venv`: Python com Playwright (capturas de tela) e vtracer/Pillow

## Pendências antes de publicar

- **Formulário**: hoje só valida e mostra confirmação, sem enviar nada. Conectar a um serviço de envio (Formspree, Resend, CRM) em `main.ts`.
- **Confirmar com o cliente**:
  - 1996 como ano de abertura da V.D.N Consultoria (deduzido do CNPJ 01.100.275 e do "há 25 anos" no Instagram em 2021)
  - "Cinco décadas" de experiência (carreira na indústria desde 1975, segundo o perfil público)
  - Nº do modelo de utilidade formatado como BR 20 2021 018605-0
  - O esquema da patente é ilustrativo; trocar pelo desenho real do pedido ou por fotos do equipamento
  - E-mail e WhatsApp de contato (não encontrados)
- **Conteúdo que falta**: fotos de projetos/obras, logos de clientes (o Instagram tem um destaque "Clientes"), outros produtos.
