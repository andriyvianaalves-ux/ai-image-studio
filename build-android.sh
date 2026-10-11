#!/bin/bash

echo "=== Compilando APK do AI Image Studio ==="
echo ""
echo "Instalando dependências..."
npm install

echo ""
echo "Iniciando build para Android..."
echo "Nota: Este processo pode levar alguns minutos."
echo ""

# Verifica se EAS CLI está instalado
if ! command -v eas &> /dev/null; then
    echo "Instalando EAS CLI..."
    npm install -g eas-cli
fi

echo "Compilando APK..."
eas build --platform android --local

echo ""
echo "=== Build concluído ==="
echo "O APK estará disponível após a compilação."
