# AI Image Studio Mobile

### Visão geral
Aplicativo mobile em React Native + Expo para criar um gerador de imagens com referência visual e prompt textual.

### Fluxo principal
- Usuário seleciona uma imagem da galeria
- Define um prompt, por exemplo:
  - "mesmo desenho, mas em outra posição"
  - "mantém o estilo da imagem, muda apenas a composição"
- Define a pose/posição: esquerda, centro ou direita
- O app simula a geração e mostra a imagem resultante

### Personalização real com IA
Para substituir a simulação por um modelo real, você pode conectar este projeto a APIs como:
- Replicate
- OpenAI Images
- Stability AI
- Flux / SDXL + ControlNet

### Execução local
```bash
npm install
npm start
```

### Observações
- Este app foi entregue como base funcional de interface e fluxo de geração.
- O serviço `src/services/aiService.ts` está em modo mock para não quebrar em ambientes sem API.
- Em produção, troque esse serviço por uma chamada HTTP para a sua API backend.
