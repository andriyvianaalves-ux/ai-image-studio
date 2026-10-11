# AI Image Studio Mobile

Aplicativo mobile para gerar imagens por IA com referência visual e prompt em português.

Funcionalidades:
- Upload de imagem da galeria
- Prompt em texto para direção da geração
- Seleção da posição da composição (esquerda, centro, direita)
- Prévia do resultado
- Suporte para conectar com API de IA real no futuro

## Tecnologias
- React Native Expo
- TypeScript
- expo-image-picker

## Como rodar

1. Instale as dependências:
   npm install
2. Inicie o app:
   npm start
3. Use o Expo Go no celular ou execute em emulador.

## Estrutura principal
- `App.tsx`: tela principal do app
- `src/services/aiService.ts`: serviço de geração de imagem

## Observação importante
Este projeto foi criado como base funcional para um app de geração com imagem de referência. Para ligar a um modelo real de IA, substitua o serviço mock por uma integração com Replicate, OpenAI Images, Stability ou outra API.
