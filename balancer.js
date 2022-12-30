import axios from "axios";
import { config } from "dotenv";
import express from "express";
import morgan from "morgan";

config();

const PORT = process.env.PORT || 8000;
const app = express();

app.use(morgan("dev"));

let current = 0;
app.get("/", async (_req, res) => {
  current = current === 4 ? 1 : current + 1;
  const response = await axios.get(`http://server_${current}:300${current}`);
  res.status(200).send(response.data);
});

app.listen(PORT, () => {
  console.log(`Load balancer started on http://localhost:${PORT}...`);
});
