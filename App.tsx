import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { generateImageFromReference, type GenerationStyle } from "./src/services/aiService";

type PositionKey = "left" | "center" | "right";

type HistoryItem = {
  uri: string;
  prompt: string;
  position: PositionKey;
  style: GenerationStyle;
  createdAt: number;
};

const POSITION_OPTIONS: Array<{ label: string; value: PositionKey }> = [
  { label: "Esquerda", value: "left" },
  { label: "Centro", value: "center" },
  { label: "Direita", value: "right" },
];

const STYLE_OPTIONS: Array<{ label: string; value: GenerationStyle }> = [
  { label: "Mesmo estilo", value: "same" },
  { label: "Mais detalhado", value: "detailed" },
  { label: "Mais dinâmico", value: "dynamic" },
  { label: "Mais limpo", value: "clean" },
];

const DEFAULT_PROMPT =
  "mesmo desenho, mesma arte, mesma identidade visual, mas em outra posição e com composição mais dinâmica";

export default function App() {
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [position, setPosition] = useState<PositionKey>("right");
  const [style, setStyle] = useState<GenerationStyle>("same");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const previewText = useMemo(() => {
    if (!selectedImage) return "Selecione uma imagem de referência para começar.";
    return `Referência: ${selectedImage.fileName ?? "imagem"}`;
  }, [selectedImage]);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permissão necessária", "Precisamos da sua autorização para acessar a galeria.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setSelectedImage(result.assets[0]);
      setResultImage(null);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage) {
      Alert.alert("Imagem obrigatória", "Escolha uma imagem da galeria antes de gerar.");
      return;
    }

    setIsGenerating(true);

    try {
      const generated = await generateImageFromReference({
        sourceUri: selectedImage.uri,
        prompt,
        position,
        style,
      });

      setResultImage(generated.uri);
      setHistory((prev) => [
        {
          uri: generated.uri,
          prompt,
          position,
          style,
          createdAt: Date.now(),
        },
        ...prev,
      ].slice(0, 6));
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Erro",
        error instanceof Error ? error.message : "Não foi possível gerar a imagem neste momento."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!resultImage) {
      Alert.alert("Sem resultado", "Gere uma imagem antes de baixar.");
      return;
    }

    const canOpen = await Linking.canOpenURL(resultImage);

    if (!canOpen) {
      Alert.alert("Não foi possível abrir", "A imagem gerada não pôde ser aberta no dispositivo.");
      return;
    }

    await Linking.openURL(resultImage);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#020817" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerCard}>
          <Text style={styles.title}>AI Image Studio</Text>
          <Text style={styles.subtitle}>Mesma referência, nova composição.</Text>
        </View>

        <Pressable style={styles.uploadButton} onPress={pickImage}>
          <Text style={styles.uploadButtonText}>Selecionar imagem da galeria</Text>
        </Pressable>

        {selectedImage ? (
          <View style={styles.previewCard}>
            <Image
              source={{ uri: selectedImage.uri }}
              style={styles.referenceImage}
              resizeMode="cover"
            />
            <Text style={styles.previewText}>{previewText}</Text>
          </View>
        ) : null}

        <Text style={styles.label}>Prompt</Text>
        <TextInput
          style={styles.input}
          multiline
          numberOfLines={5}
          value={prompt}
          onChangeText={setPrompt}
          placeholder="Ex.: mesma ilustração, mas em outra posição e composição"
          placeholderTextColor="#94a3b8"
          textAlignVertical="top"
        />

        <Text style={styles.label}>Estilo visual</Text>
        <View style={styles.optionGrid}>
          {STYLE_OPTIONS.map((item) => {
            const active = item.value === style;

            return (
              <Pressable
                key={item.value}
                onPress={() => setStyle(item.value)}
                style={[styles.optionButton, active && styles.optionButtonActive]}
              >
                <Text style={[styles.optionButtonText, active && styles.optionButtonTextActive]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>Posição do desenho</Text>
        <View style={styles.positionRow}>
          {POSITION_OPTIONS.map((item) => {
            const active = item.value === position;

            return (
              <Pressable
                key={item.value}
                onPress={() => setPosition(item.value)}
                style={[styles.positionButton, active && styles.positionButtonActive]}
              >
                <Text style={[styles.positionButtonText, active && styles.positionButtonTextActive]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          style={[styles.generateButton, isGenerating && styles.generateButtonDisabled]}
          onPress={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.generateButtonText}>Gerar imagem</Text>
          )}
        </Pressable>

        {!!resultImage && (
          <Pressable style={styles.downloadButton} onPress={handleDownload}>
            <Text style={styles.downloadButtonText}>Baixar imagem</Text>
          </Pressable>
        )}

        <View style={styles.resultContainer}>
          <Text style={styles.label}>Resultado</Text>

          {resultImage ? (
            <Image source={{ uri: resultImage }} style={styles.resultImage} resizeMode="cover" />
          ) : (
            <View style={styles.emptyResult}>
              <Text style={styles.emptyText}>Aguardando geração...</Text>
            </View>
          )}
        </View>

        {!!history.length && (
          <View style={styles.historyBox}>
            <Text style={styles.label}>Últimas criações</Text>

            {history.map((item) => (
              <Pressable
                key={`${item.uri}-${item.createdAt}`}
                onPress={() => setResultImage(item.uri)}
                style={styles.historyCard}
              >
                <Image source={{ uri: item.uri }} style={styles.historyImage} resizeMode="cover" />
                <View style={styles.historyTextBox}>
                  <Text style={styles.historyTitle}>{item.position}</Text>
                  <Text style={styles.historyMeta}>{item.style}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#020817",
  },
  container: {
    padding: 20,
    paddingBottom: 48,
  },
  headerCard: {
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#1e293b",
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
  },
  title: {
    color: "#f8fafc",
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#cbd5e1",
  },
  uploadButton: {
    backgroundColor: "#2563eb",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 18,
  },
  uploadButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 15,
  },
  previewCard: {
    backgroundColor: "#111827",
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#1f2937",
    marginBottom: 18,
  },
  referenceImage: {
    width: "100%",
    height: 220,
    backgroundColor: "#0f172a",
  },
  previewText: {
    color: "#cbd5e1",
    padding: 12,
    fontSize: 13,
  },
  label: {
    color: "#f8fafc",
    fontWeight: "700",
    marginBottom: 10,
    fontSize: 15,
  },
  input: {
    minHeight: 120,
    backgroundColor: "#0f172a",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#334155",
    color: "#f8fafc",
    padding: 14,
    marginBottom: 18,
    fontSize: 15,
  },
  optionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 18,
  },
  optionButton: {
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  optionButtonActive: {
    backgroundColor: "#7c3aed",
    borderColor: "#8b5cf6",
  },
  optionButtonText: {
    color: "#cbd5e1",
    fontWeight: "600",
    fontSize: 12,
  },
  optionButtonTextActive: {
    color: "#ffffff",
  },
  positionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 10,
  },
  positionButton: {
    flex: 1,
    backgroundColor: "#0f172a",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#334155",
    paddingVertical: 12,
    alignItems: "center",
  },
  positionButtonActive: {
    backgroundColor: "#7c3aed",
    borderColor: "#8b5cf6",
  },
  positionButtonText: {
    color: "#cbd5e1",
    fontWeight: "600",
  },
  positionButtonTextActive: {
    color: "#ffffff",
  },
  generateButton: {
    backgroundColor: "#22c55e",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  generateButtonDisabled: {
    opacity: 0.7,
  },
  generateButtonText: {
    color: "#06130a",
    fontWeight: "800",
    fontSize: 16,
  },
  downloadButton: {
    backgroundColor: "#0ea5e9",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  downloadButtonText: {
    color: "#f8fafc",
    fontWeight: "700",
    fontSize: 14,
  },
  resultContainer: {
    marginTop: 4,
  },
  resultImage: {
    width: "100%",
    height: 320,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#334155",
    backgroundColor: "#0f172a",
  },
  emptyResult: {
    height: 220,
    borderRadius: 18,
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#334155",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#94a3b8",
    fontSize: 15,
  },
  historyBox: {
    marginTop: 22,
  },
  historyCard: {
    marginTop: 12,
    backgroundColor: "#0f172a",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#334155",
  },
  historyImage: {
    width: "100%",
    height: 150,
  },
  historyTextBox: {
    padding: 12,
  },
  historyTitle: {
    color: "#f8fafc",
    fontWeight: "700",
    textTransform: "capitalize",
  },
  historyMeta: {
    color: "#cbd5e1",
    fontSize: 12,
    marginTop: 4,
    textTransform: "capitalize",
  },
});

"use strict";

// Este trecho garante que o código permaneça em modo de produção e sem warnings extras.
