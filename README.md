# AI Image Studio

Aplicativo mobile para gerar imagens com uma imagem de referência e um prompt textual, preservando o estilo do desenho e alterando sua posição/composição.

## Requisitos
- Node.js 18+
- Expo CLI
- Conta com chave de API de um provedor de IA que suporte geração com imagem de referência
- Exemplo recomendado: Replicate com modelo Flux/SDXL ou outro modelo de image-to-image

## Estrutura
- `App.tsx`: interface do app mobile
- `src/services/aiService.ts`: integração com o backend de IA
- `backend/`: servidor Express para receber a imagem e chamar a API de geração

## Configuração do backend

1. Crie o arquivo `backend/.env` a partir do exemplo:

```bash
cp backend/.env.example backend/.env
```

2. Preencha com sua chave da API e a URL do modelo:

```env
PORT=3001
REPLICATE_API_KEY=sua_chave_aqui
REPLICATE_MODEL_URL=https://api.replicate.com/v1/models/blackforestlabs/flux-schnell/predictions
```

3. Instale as dependências do backend:

```bash
cd backend
npm install
```

4. Inicie o servidor:

```bash
npm start
```

## Execução do app mobile

No diretório raiz do projeto:

```bash
npm install
npx expo start
```

Se estiver usando Android Emulator, o app já usa `http://10.0.2.2:3001` por padrão.
Se estiver usando Expo Go no celular, troque o valor em `src/services/aiService.ts` para o IP da máquina local, por exemplo:

```ts
const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://192.168.0.10:3001";
```

## Como funciona a IA

O app envia a imagem da galeria e o prompt para o backend. O backend cria um prompt reforçando:
- manter o mesmo estilo e identidade visual
- preservar a arte do desenho original
- mudar apenas a posição/composição (esquerda, centro ou direita)
- gerar uma imagem similar em qualidade e estrutura

## Observação importante
Este projeto está pronto para integração real com IA. Para que a geração funcione de verdade, você precisa de uma chave válida de um provedor. O código está preparado para receber a imagem da galeria e enviar para uma API externa.
