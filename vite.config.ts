import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/auth': {
        target: 'http://localhost:3000',
        bypass: (req) => {
          if (req.headers.accept?.startsWith('text/html')) return '/index.html'
        },
      },
      '/quizzes': {
        target: 'http://localhost:3000',
        bypass: (req) => {
          if (req.headers.accept?.startsWith('text/html')) return '/index.html'
        },
      },
      '/questions': {
        target: 'http://localhost:3000',
        bypass: (req) => {
          if (req.headers.accept?.startsWith('text/html')) return '/index.html'
        },
      },
      '/users': {
        target: 'http://localhost:3000',
        bypass: (req) => {
          if (req.headers.accept?.startsWith('text/html')) return '/index.html'
        },
      },
      '/results': {
        target: 'http://localhost:3000',
        bypass: (req) => {
          if (req.headers.accept?.startsWith('text/html')) return '/index.html'
        },
      },
      '/health': {
        target: 'http://localhost:3000',
        bypass: (req) => {
          if (req.headers.accept?.startsWith('text/html')) return '/index.html'
        },
      },
    },
  },
})
