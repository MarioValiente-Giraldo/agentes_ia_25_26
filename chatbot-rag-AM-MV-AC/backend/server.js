// server.js
import express from "express";
import cors from "cors";
import { config } from "dotenv";

config();

const app = express();

const PORT = Number(process.env.PORT) || 3002;
const HOST = process.env.HOST || "0.0.0.0";

const OLLAMA_URL = process.env.OLLAMA_URL;
const OLLAMA_MODEL_LLM = process.env.OLLAMA_MODEL_LLM;

app.use(cors());
app.use(express.json());

app.post("/api/consulta", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Debe enviar un prompt válido." });
  }

  try {
    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL_LLM,
        prompt,
        stream: false
      })
    });

    const data = await response.json();

    res.json({ respuesta: data.response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al comunicarse con Ollama." });
  }
});

app.listen(PORT, HOST, () => {
  console.log(`Servidor listo en http://${HOST}:${PORT}`);
});
