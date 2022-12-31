import { config } from "dotenv";
import express from "express";
import morgan from "morgan";
import os from "os";

config();

const PORT = process.env.PORT || 3000;
const SERVER = os.hostname() || "SERVER_NULL";
const app = express();

app.use(morgan("dev", { skip: () => false }));

function randomDelay(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

app.get("/", async (_req, res) => {
  res.status(200).json({ message: `Response from ${SERVER}` });
});

app.get("/delay", async (_req, res) => {
  const time = randomDelay(150, 200);
  await delay(time);
  res.status(200).json({ message: `Delayed response from ${SERVER}` });
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}...`);
});
