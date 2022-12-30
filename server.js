import { config } from "dotenv";
import express from "express";
import morgan from "morgan";

config();

const PORT = process.env.PORT || 3000;
const SERVER = process.env.SERVER || "SERVER_NULL";
const app = express();

app.use(morgan("dev", { skip: () => true }));

function randomDelay(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

app.get("/", async (_req, res) => {
  const time = randomDelay(50, 250);
  await delay(time);
  res.status(200).json({ message: `Response from ${SERVER}` });
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}...`);
});
