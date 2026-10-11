# AI Image Studio - Build Guide

## Compilar APK para Android

Existem 2 formas de compilar o APK:

### Opção 1: Script automático (Recomendado)

```bash
chmod +x build-apk.sh
./build-apk.sh
```

O script vai:
1. Verificar as dependências
2. Instalar Node.js/npm se necessário
3. Instalar EAS CLI
4. Compilar o APK automaticamente
5. Fornecer o link para download

### Opção 2: Comando manual

1. Instale EAS CLI:
```bash
npm install -g eas-cli
```

2. Faça login com sua conta Expo:
```bash
eas login
```

3. Compile:
```bash
eas build --platform android
```

## Após a compilação

1. O APK será gerado na nuvem Expo
2. Você receberá um link para download
3. Baixe o arquivo `.apk`
4. Transfira para seu celular Android
5. Instale tocando no arquivo
6. Aceite as permissões de galeria

## Requisitos

- Node.js 18+
- npm ou yarn
- Conta Expo (gratuita)
- Conexão com internet

## Configuração do Backend

Antes de usar o app, configure o backend:

```bash
cd backend
cp .env.example .env
# Edite .env com sua chave da API
npm install
npm start
```

O backend precisa estar rodando para a IA gerar imagens.

## Troubleshooting

Se der erro na compilação:

1. Verifique se tem espaço livre no disco
2. Verifique a conexão com internet
3. Tente fazer login novamente:
   ```bash
   eas logout
   eas login
   ```
4. Limpe o cache:
   ```bash
   npm cache clean --force
   rm -rf node_modules
   npm install
   ```

## Suporte

Para mais informações sobre EAS Build:
https://docs.expo.dev/eas/
