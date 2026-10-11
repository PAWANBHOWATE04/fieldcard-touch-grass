import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Load .env.local first, then .env if present (server-side only)
dotenv.config({ path: resolve(process.cwd(), '.env.local') });
dotenv.config({ path: resolve(process.cwd(), '.env') });

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'api-plan-middleware',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (!req.url.startsWith('/api/plan')) {
            return next();
          }

          try {
            // Dynamically import the handler so edits reload
            const handlerModule = await server.ssrLoadModule('/api/plan.js');
            const handler = handlerModule.default;

            // Read request body if POST
            let body = {};
            if (req.method === 'POST') {
              const buffers = [];
              for await (const chunk of req) {
                buffers.push(chunk);
              }
              const rawBody = Buffer.concat(buffers).toString();
              if (rawBody) {
                try {
                  body = JSON.parse(rawBody);
                } catch {
                  body = {};
                }
              }
            }

            // Adapt node http res to express/vercel res helpers
            const adaptedRes = {
              statusCode: 200,
              headers: {},
              setHeader(name, val) {
                res.setHeader(name, val);
                this.headers[name] = val;
              },
              status(code) {
                this.statusCode = code;
                res.statusCode = code;
                return this;
              },
              json(data) {
                this.setHeader('Content-Type', 'application/json');
                res.statusCode = this.statusCode;
                res.end(JSON.stringify(data));
              },
              end(data) {
                res.statusCode = this.statusCode;
                res.end(data);
              }
            };

            const adaptedReq = {
              method: req.method,
              url: req.url,
              headers: req.headers,
              body
            };

            await handler(adaptedReq, adaptedRes);
          } catch (err) {
            console.error('API middleware error:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message || 'Internal server error' }));
          }
        });
      }
    }
  ],
  server: {
    port: 5173,
    host: true
  }
});
