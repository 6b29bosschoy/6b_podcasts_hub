import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";
import { injectSeoDocument } from "./seo";
import { getPrerenderedSeoDocument } from "./prerenderCache";

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );

      // Always reload the template and inject route-level pre-rendered public metadata/body.
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      const seoDocument = await getPrerenderedSeoDocument(req.originalUrl);
      template = injectSeoDocument(template, seoDocument);
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res
        .status(200)
        .set({ "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-cache" })
        .end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  app.use(express.static(distPath, {
    index: false,
    redirect: false,
    setHeaders(res, filePath) {
      if (/\.(?:js|mjs|css|png|jpe?g|webp|avif|svg|ico|woff2?|ttf)$/i.test(filePath)) {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      }
    },
  }));

  // HTML stays short-lived because the head and crawler fallback are route-specific.
  app.use("*", async (req, res, next) => {
    try {
      const template = await fs.promises.readFile(path.resolve(distPath, "index.html"), "utf-8");
      const seoDocument = await getPrerenderedSeoDocument(req.originalUrl);
      res
        .status(200)
        .set({ "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-cache" })
        .end(injectSeoDocument(template, seoDocument));
    } catch (error) {
      next(error);
    }
  });
}
