import { Codes } from '../utils/codeStatus'
import { JsonApiResponseError } from '../utils/jsonApiResponses'
import env from '../config/callEnv'

export const baseRoute = (_req: any, res: any, _next: any): void => {
  const html = `<!doctype html>
  <html lang="es">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>API Template JSONAPI · Ivan Madera</title>
      <style>
        body { margin: 0; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial; color: #e5e7eb; background: #0f172a; display: grid; place-items: center; min-height: 100vh; padding: 24px; }
        .card { max-width: 920px; width: 100%; background: linear-gradient(180deg, rgba(17,24,39,.9), rgba(17,24,39,.85)); border: 1px solid rgba(255,255,255,.06); border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.04); overflow: hidden; }
        .header { display: flex; align-items: center; gap: 14px; padding: 22px 24px; border-bottom: 1px solid rgba(255,255,255,.06); }
        .logo { width: 40px; height: 40px; border-radius: 10px; background: linear-gradient(135deg, #22c55e, #06b6d4); display: grid; place-items: center; color: #052e16; font-weight: 800; box-shadow: 0 6px 20px rgba(34,197,94,.35); }
        .title { font-size: 18px; font-weight: 700; letter-spacing: .2px; }
        .subtitle { color: #9ca3af; font-size: 13px; margin-top: 2px; }
        .content { padding: 28px 24px; display: grid; gap: 18px; }
        .badge-row { display: flex; flex-wrap: wrap; gap: 10px; }
        .badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 12px; background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.08); border-radius: 999px; font-size: 12px; color: #e5e7eb; }
        .dot { width: 8px; height: 8px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 0 3px rgba(34,197,94,.18); }
        .grid { display: grid; gap: 14px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
        .tile { padding: 14px; border-radius: 12px; background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.08); }
        .k { font-size: 12px; color: #9ca3af; }
        .v { font-weight: 700; margin-top: 4px; }
                 .footer { padding: 16px 24px; border-top: 1px solid rgba(255,255,255,.06); color: #9ca3af; font-size: 12px; }
      </style>
    </head>
    <body>
      <main class="card" role="main">
        <section class="header">
          <div class="logo" aria-hidden="true">🚀</div>
          <div>
            <div class="title">API Template JSONAPI · Ivan Madera</div>
            <div class="subtitle">Template de NodeJS para desarrollos cortos y sencillos implementando las respuestas con jsonapi</div>
          </div>
        </section>
        <section class="content">
          <div class="badge-row">
            <span class="badge"><span class="dot"></span> En línea</span>
            <span class="badge">Entorno: <strong>${env.ENV}</strong></span>
            <span class="badge">Puerto: <strong>${env.PORT}</strong></span>
            <span class="badge">Versión de Node: <strong>${
              process.versions.node
            }</strong></span>
          </div>
                     <div class="grid">
             <div class="tile">
               <div class="k">Tecnologías</div>
               <div class="v">Node.js, Express, TypeScript, MySQL, Sequelize</div>
             </div>
             <div class="tile">
               <div class="k">Documentación</div>
               <div class="v">Swagger UI integrado para documentación automática</div>
             </div>
             <div class="tile">
               <div class="k">Seguridad</div>
               <div class="v">Helmet, CORS, JWT, validaciones robustas</div>
             </div>
           </div>
        </section>
        <footer class="footer">© ${new Date().getFullYear()} · Made with ❤️ by Ivan Madera</footer>
      </main>
    </body>
  </html>`

  const status = Codes.success
  return res.status(status).type('html').send(html)
}

export const headerNoCache = (req: any, res: any, next: any): void => {
  const url = req.originalUrl
  const status = Codes.errorServer

  try {
    res.setHeader('Cache-Control', 'no-store')
    return next()
  } catch (error) {
    return res.status(status).json(JsonApiResponseError(error, url))
  }
}
