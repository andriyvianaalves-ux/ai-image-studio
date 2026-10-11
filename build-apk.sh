#!/bin/bash

echo "Iniciando a compilação automatizada do APK..."
echo ""

# Verifica se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "Erro: Node.js não está instalado."
    echo "Baixe em: https://nodejs.org/"
    exit 1
fi

echo "Node.js detectado: $(node --version)"
echo ""

# Verifica se npm está instalado
if ! command -v npm &> /dev/null; then
    echo "Erro: npm não está instalado."
    exit 1
fi

echo "npm detectado: $(npm --version)"
echo ""

# Instala dependências
echo "Instalando dependências do projeto..."
npm install

if [ $? -ne 0 ]; then
    echo "Erro ao instalar dependências."
    exit 1
fi

echo ""
echo "Dependências instaladas com sucesso!"
echo ""

# Instala EAS CLI globalmente se não estiver instalado
echo "Verificando EAS CLI..."
if ! command -v eas &> /dev/null; then
    echo "Instalando EAS CLI globalmente..."
    npm install -g eas-cli
fi

echo ""
echo "====================================="
echo "Iniciando build do APK para Android"
echo "====================================="
echo ""
echo "Isto pode levar 5-15 minutos dependendo da conexão."
echo ""

# Executa o build
eas build --platform android

if [ $? -eq 0 ]; then
    echo ""
    echo "====================================="
    echo "✓ Build concluído com sucesso!"
    echo "====================================="
    echo ""
    echo "O APK foi compilado e pode ser baixado em:"
    echo "https://expo.dev/accounts/[seu-usuario]/projects/ai-image-studio/builds"
    echo ""
    echo "Para instalar no seu celular:"
    echo "1. Baixe o APK do link acima"
    echo "2. Transfira para seu celular Android"
    echo "3. Toque no arquivo APK para instalar"
    echo "4. Aceite as permissões solicitadas"
else
    echo ""
    echo "Erro durante a compilação."
    echo "Verifique os logs acima para mais detalhes."
    exit 1
fi
