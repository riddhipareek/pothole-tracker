import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/** /map and /report are React routes; the real pages are *.html */
const htmlAliases = {
  '/map': '/map.html',
  '/map/': '/map.html',
  '/report': '/report.html',
  '/report/': '/report.html',
  '/admin': '/admin.html',
  '/admin/': '/admin.html',
}

function redirectHtmlPages() {
  return {
    name: 'redirect-html-pages',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = req.url?.split('?')[0]
        const target = htmlAliases[path]
        if (target) {
          res.writeHead(302, { Location: target })
          res.end()
          return
        }
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [redirectHtmlPages(), react()],
  server: {
    port: 5173,
    open: true,
  },
})
