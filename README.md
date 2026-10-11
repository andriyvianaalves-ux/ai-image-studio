# AI Image Studio

Aplicativo mobile para gerar imagens com uma imagem de referência e prompt textual, mantendo o estilo do desenho original e alterando a posição/composição.

## Funcionalidades
- seleção de imagem da galeria
- prompt em português
- estilo visual: mesmo estilo, mais detalhado, mais dinâmico, mais limpo
- posição: esquerda, centro, direita
- resultado em tela
- histórico das últimas criações
- botão para abrir a imagem gerada
- integração com backend de IA

## Requisitos
- Node.js 18+
- Expo CLI
- chave válida para um provedor de IA compatível

## Configuração do backend

1. Entre na pasta backend
2. Crie o arquivo `.env`:

```bash
cp .env.example .env
```

3. Preencha com sua chave da API:

```env
PORT=3001
REPLICATE_API_KEY=sua_chave_aqui
REPLICATE_MODEL_URL=https://api.replicate.com/v1/models/blackforestlabs/flux-schnell/predictions
```

4. Instale as dependências:

```bash
cd backend
npm install
```

5. Inicie o backend:

```bash
npm start
```

## Execução do app mobile

No diretório raiz:

```bash
npm install
npx expo start
```

Se o app estiver no Android Emulator, a URL padrão do backend em `src/services/aiService.ts` já funciona em `http://10.0.2.2:3001`.
Se estiver usando Expo Go, troque a URL para o IP da máquina local.

## Observação
Esse projeto foi preparado para gerar imagens com IA real. Sem uma chave válida da API, a geração não ocorrerá.
