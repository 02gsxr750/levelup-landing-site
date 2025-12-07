import express from "express";
import path from "path";
import fs from "fs";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from dist/public
const publicPath = path.join(__dirname, "../dist/public");
if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath));
}

// Catch-all: serve index.html for SPA routing
app.get("*", (req, res) => {
  const indexPath = path.join(publicPath, "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send("Not found - index.html missing");
  }
});

export default app;
