import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const base = path.resolve(
    process.env.GIO_ROOT || fileURLToPath(new URL("../public/", import.meta.url)),
  ),
  port = Number(process.env.PORT || 3000);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".vtt": "text/vtt",
  ".zip": "application/zip",
  ".gz": "application/gzip",
  ".json": "application/json",
};
http
  .createServer((req, res) => {
    let p;
    try {
      p = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    } catch {
      res.writeHead(400);
      return res.end("Solicitud no válida");
    }
    let f = path.resolve(base, "." + p);
    if (!f.startsWith(base + path.sep) && f !== base) {
      res.writeHead(403);
      return res.end();
    }
    if (fs.existsSync(f) && fs.statSync(f).isDirectory())
      f = path.join(f, "index.html");
    if (!fs.existsSync(f)) {
      const isDemoRoute = /^\/(inicio|agenda|pacientes|cobros|finanzas|tratamientos|profesionales|inventario|reportes|usuarios|perfil|configuracion|login|ayuda|privacidad|terminos)(\/|$)/.test(p);
      if (!isDemoRoute) res.statusCode = 404;
      f = path.join(
        base,
        isDemoRoute ? "demo.html" : "404.html",
      );
    }
    if (!fs.existsSync(f)) {
      res.writeHead(404);
      return res.end("No encontrado");
    }
    const size = fs.statSync(f).size;
    res.setHeader(
      "Content-Type",
      types[path.extname(f)] || "application/octet-stream",
    );
    res.setHeader("X-Content-Type-Options", "nosniff");
    const range = req.headers.range;
    if (range && f.endsWith(".mp4")) {
      const m = /bytes=(\d+)-(\d*)/.exec(range);
      if (m) {
        let a = Number(m[1]),
          b = m[2] ? Math.min(Number(m[2]), size - 1) : size - 1;
        if (a >= size || a > b) {
          res.writeHead(416, { "Content-Range": `bytes */${size}` });
          return res.end();
        }
        res.writeHead(206, {
          "Content-Range": `bytes ${a}-${b}/${size}`,
          "Accept-Ranges": "bytes",
          "Content-Length": b - a + 1,
        });
        return fs.createReadStream(f, { start: a, end: b }).pipe(res);
      }
    }
    res.setHeader("Content-Length", size);
    fs.createReadStream(f).pipe(res);
  })
  .listen(port, "0.0.0.0", () =>
    console.log("GIO preview http://localhost:" + port),
  );
