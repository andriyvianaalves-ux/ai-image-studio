const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://10.0.2.2:3001";

export type GenerationRequest = {
  sourceUri?: string;
  prompt: string;
  position?: "left" | "center" | "right";
};

export async function generateImageFromReference({
  sourceUri,
  prompt,
  position = "right",
}: GenerationRequest): Promise<{ uri: string }> {
  if (!sourceUri) {
    throw new Error("É necessário enviar uma imagem de referência.");
  }

  const formData = new FormData();
  const filename = `reference-${Date.now()}.jpg`;

  formData.append("image", {
    uri: sourceUri,
    name: filename,
    type: "image/jpeg",
  } as any);
  formData.append("prompt", prompt);
  formData.append("position", position);

  const response = await fetch(`${API_URL}/api/generate`, {
    method: "POST",
    body: formData,
    headers: {
      Accept: "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    const message = data?.error ?? "Falha ao gerar imagem.";
    throw new Error(message);
  }

  if (!data?.imageUrl) {
    throw new Error("Resposta da IA inválida.");
  }

  return { uri: data.imageUrl };
}
