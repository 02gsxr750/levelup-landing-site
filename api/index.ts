import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "../server/routes";
import { createServer } from "http";
import path from "path";
import fs from "fs";

const app = express();

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  })
);

app.use(express.urlencoded({ extended: false }));

// Setup static file serving from dist/public
const distPublicPath = path.resolve(__dirname, "../dist/public");
if (fs.existsSync(distPublicPath)) {
  app.use(express.static(distPublicPath));
}

// Initialize routes on first request
let routesInitialized = false;
const initRoutes = async () => {
  if (!routesInitialized) {
    const httpServer = createServer(app);
    await registerRoutes(httpServer, app);
    routesInitialized = true;
  }
};

app.use(async (req: Request, res: Response, next: NextFunction) => {
  await initRoutes();
  next();
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

// Catch-all: serve index.html for SPA routing
app.use("*", (_req: Request, res: Response) => {
  const indexPath = path.resolve(distPublicPath, "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send("Not found");
  }
});

export default app;
