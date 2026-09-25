import { defineConfig } from 'vite'

// GitHub Pages publica em /<repositório>/; em dev continua na raiz.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/vdn-engenharia/' : '/',
}))
