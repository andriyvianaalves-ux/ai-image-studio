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

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        uri: sourceUri,
      });
    }, 1400);
  });
}
