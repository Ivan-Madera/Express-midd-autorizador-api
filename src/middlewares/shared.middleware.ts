import { NextFunction, Request, Response } from 'express'
import { Codes } from '../utils/codeStatus'
import { JsonApiResponseError } from '../utils/jsonApiResponses'
import env from '../config/callEnv'

export const baseRoute = (
  req: Request,
  res: Response,
  _next: NextFunction
): Response | void => {
  const protocol = req.protocol
  const host = req.get('host')
  const baseUrl = `${protocol}://${host}`

  const html = `<!doctype html>
  <html lang="es">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Midd Autorizador API · Panel de Control</title>
      <style>
        :root {
          --bg: #0b0f1a;
          --card-bg: rgba(17, 24, 39, 0.7);
          --primary: #10b981;
          --primary-glow: rgba(16, 185, 129, 0.2);
          --secondary: #06b6d4;
          --text: #f3f4f6;
          --text-muted: #9ca3af;
          --border: rgba(255, 255, 255, 0.08);
        }

        body { 
          margin: 0; 
          font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif; 
          color: var(--text); 
          background: var(--bg); 
          background-image: 
            radial-gradient(circle at 0% 0%, rgba(16, 185, 129, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 100% 100%, rgba(6, 182, 212, 0.05) 0%, transparent 50%);
          display: grid; 
          place-items: center; 
          min-height: 100vh; 
          padding: 20px;
          overflow-x: hidden;
        }

        .dashboard { 
          max-width: 800px; 
          width: 100%; 
          background: var(--card-bg); 
          backdrop-filter: blur(12px);
          border: 1px solid var(--border); 
          border-radius: 24px; 
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          overflow: hidden;
          animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .header { 
          padding: 40px 40px 24px;
          display: flex;
          align-items: center;
          gap: 20px;
          border-bottom: 1px solid var(--border);
        }

        .icon-box {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          display: grid;
          place-items: center;
          font-size: 28px;
          box-shadow: 0 10px 20px -5px rgba(16, 185, 129, 0.4);
        }

        .title-area h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.025em; }
        .title-area p { margin: 4px 0 0; color: var(--text-muted); font-size: 14px; }

        .content { padding: 32px 40px; }

        .status-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }

        .stat-card {
          padding: 20px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border);
          border-radius: 16px;
          transition: all 0.2s ease;
        }

        .stat-card:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }

        .stat-label { font-size: 12px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; }
        .stat-value { font-size: 16px; font-weight: 700; margin-top: 8px; display: flex; align-items: center; gap: 8px; }

        .pulse {
          width: 8px;
          height: 8px;
          background: var(--primary);
          border-radius: 50%;
          box-shadow: 0 0 0 0 var(--primary-glow);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 var(--primary-glow); }
          70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }

        .info-box {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 24px;
        }

        .info-box h3 { margin: 0 0 16px; font-size: 14px; color: var(--text-muted); }

        .copy-url {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #000;
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid var(--border);
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .copy-url:hover { border-color: var(--primary); }
        .copy-url code { color: var(--primary); flex: 1; }
        .copy-url span { font-size: 11px; color: var(--text-muted); background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px; }

        .feature-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 24px;
        }

        .tag {
          font-size: 11px;
          padding: 4px 10px;
          background: rgba(16, 185, 129, 0.1);
          color: var(--primary);
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: 6px;
          font-weight: 600;
        }

        .footer {
          padding: 20px 40px;
          background: rgba(0, 0, 0, 0.2);
          border-top: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: var(--text-muted);
        }

        .toast {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%) translateY(100px);
          background: var(--primary);
          color: #fff;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 100;
        }

        .toast.show { transform: translateX(-50%) translateY(0); }
      </style>
    </head>
    <body>
      <div id="toast" class="toast">URL copiada al portapapeles</div>
      
      <main class="dashboard">
        <header class="header">
          <div class="icon-box">🛡️</div>
          <div class="title-area">
            <h1>Midd Autorizador API</h1>
            <p>Sistema centralizado de seguridad y control de acceso</p>
          </div>
        </header>

        <section class="content">
          <div class="status-grid">
            <div class="stat-card">
              <span class="stat-label">Estado</span>
              <div class="stat-value">
                <div class="pulse"></div> 
                En línea
              </div>
            </div>
            <div class="stat-card">
              <span class="stat-label">Entorno</span>
              <div class="stat-value">${env.ENV}</div>
            </div>
            <div class="stat-card">
              <span class="stat-label">Node Instance</span>
              <div class="stat-value">v${process.versions.node}</div>
            </div>
          </div>

          <div class="info-box">
            <h3>Endpoint Base de la API</h3>
            <div class="copy-url" onclick="copyUrl()">
              <code>${baseUrl}</code>
              <span>Haga clic para copiar</span>
            </div>

            <div class="feature-tags">
              <span class="tag">JWT Auth</span>
              <span class="tag">MySQL + Sequelize</span>
              <span class="tag">Security Helmet</span>
              <span class="tag">CORS Enabled</span>
              <span class="tag">Rate Limiting</span>
              <span class="tag">Input Validation</span>
            </div>
          </div>
        </section>

        <footer class="footer">
          <div>© ${new Date().getFullYear()} · Midd Autorizador</div>
          <div>Desarrollado por Ivan Madera</div>
        </footer>
      </main>

      <script>
        function copyUrl() {
          const url = '${baseUrl}';
          navigator.clipboard.writeText(url).then(() => {
            const toast = document.getElementById('toast');
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 2000);
          });
        }
      </script>
    </body>
  </html>`

  const status = Codes.success
  return res.status(status).type('html').send(html)
}

export const headerNoCache = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const url = req.originalUrl
  const status = Codes.errorServer

  try {
    res.setHeader('Cache-Control', 'no-store')
    return next()
  } catch (error: unknown) {
    return res.status(status).json(JsonApiResponseError(error, url))
  }
}
