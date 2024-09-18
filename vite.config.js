import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base:'https://diamondstalker.github.io/PorfolioV2/',
  server: {
    host: '0.0.0.0',
  },
})
