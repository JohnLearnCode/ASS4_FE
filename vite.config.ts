import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/auth': {
        target: 'https://ass4-be.onrender.com',
        bypass: (req) => {
          if (req.headers.accept?.startsWith('text/html')) return '/index.html'
        },
      },
      '/quizzes': {
        target: 'https://ass4-be.onrender.com',
        bypass: (req) => {
          if (req.headers.accept?.startsWith('text/html')) return '/index.html'
        },
      },
      '/questions': {
        target: 'https://ass4-be.onrender.com',
        bypass: (req) => {
          if (req.headers.accept?.startsWith('text/html')) return '/index.html'
        },
      },
      '/users': {
        target: 'https://ass4-be.onrender.com',
        bypass: (req) => {
          if (req.headers.accept?.startsWith('text/html')) return '/index.html'
        },
      },
      '/results': {
        target: 'https://ass4-be.onrender.com',
        bypass: (req) => {
          if (req.headers.accept?.startsWith('text/html')) return '/index.html'
        },
      },
      '/health': {
        target: 'https://ass4-be.onrender.com',
        bypass: (req) => {
          if (req.headers.accept?.startsWith('text/html')) return '/index.html'
        },
      },
    },
  },
})
