import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // relative base so the built app works from any subpath (e.g. GitHub Pages
  // project sites at /<repo>/) without hardcoding the repo name here
  base: './',
  plugins: [react(), tailwindcss()],
})
