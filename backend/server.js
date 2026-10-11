import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const app = express();
const PORT = Number(process.env.PORT ?? 3001);
const REPLICATE_API_KEY = process.env.REPLICATE_API_KEY;
const REPLICATE_MODEL_URL =
  process.env.REPLICATE_MODEL_URL ??
  "https://api.replicate.com/v1/models/blackforestlabs/flux-schnell/predictions";

const uploadDir = path.resolve(process.cwd(), "tmp", "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});

app.use(cors());
app.use(express.json({ limit: "20mb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true, status: "backend-ok" });
});

app.post("/api/generate", upload.single("image"), async (req, res) => {
  try {
    const { prompt, position = "right" } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Imagem de referência obrigatória." });
    }

    if (!prompt) {
      return res.status(400).json({ error: "Prompt obrigatório." });
    }

    if (!REPLICATE_API_KEY) {
      return res.status(500).json({
        error: "REPLICATE_API_KEY não configurada. Configure o backend/.env.",
      });
    }

    const fileBuffer = fs.readFileSync(req.file.path);
    const mimeType = req.file.mimetype || "image/jpeg";
    const base64 = fileBuffer.toString("base64");
    const optimizedPrompt = `${prompt}, same illustration style, same colors, same character identity, same details, same reference subject, preserve art style, reposition subject to the ${position} side of the frame, balanced composition, clean background, high quality, detailed visual`;

    const payload = {
      input: {
        prompt: optimizedPrompt,
        image: `data:${mimeType};base64,${base64}`,
        width: 1024,
        height: 1024,
      },
    };

    const apiResponse = await fetch(REPLICATE_MODEL_URL, {
      method: "POST",
      headers: {
        Authorization: `Token ${REPLICATE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const raw = await apiResponse.text();
    let data;

    try {
      data = raw ? JSON.parse(raw) : {};
    } catch {
      return res.status(500).json({
        error: "Resposta inesperada da API de IA.",
        details: raw,
      });
    }

    if (!apiResponse.ok) {
      return res.status(500).json({
        error: data?.error || "Erro ao gerar imagem com a API de IA.",
        details: data,
      });
    }

    const predictionId = data?.id;
    let finalOutput = Array.isArray(data?.output) ? data.output[0] : data?.output;

    if (predictionId && !finalOutput) {
      for (let attempt = 0; attempt < 30; attempt += 1) {
        await new Promise((resolve) => setTimeout(resolve, 3000));

        const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
          headers: {
            Authorization: `Token ${REPLICATE_API_KEY}`,
            "Content-Type": "application/json",
          },
        });

        const statusData = await statusResponse.json();

        if (statusData?.status === "succeeded") {
          finalOutput = Array.isArray(statusData.output) ? statusData.output[0] : statusData.output;
          break;
        }

        if (statusData?.status === "failed") {
          return res.status(500).json({
            error: "Geração falhou no provedor de IA.",
            details: statusData,
          });
        }
      }
    }

    if (!finalOutput) {
      return res.status(202).json({
        message: "Geração iniciada. A imagem será processada em breve.",
        predictionId,
      });
    }

    if (req.file?.path) {
      fs.unlinkSync(req.file.path);
    }

    return res.json({
      success: true,
      imageUrl: finalOutput,
      predictionId,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Erro interno no backend de geração.",
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});
