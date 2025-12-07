import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "../dist/public")));

app.get("*", (req: Request, res: Response) => {
  const indexPath = path.join(__dirname, "../dist/public/index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send("index.html not found");
  }
});

module.exports = app;
