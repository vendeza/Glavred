import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const previewText =
  'Получите персональную подборку редакторских советов для вашей команды уже сегодня.';

export default function PreviewScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Preview</ThemedText>
      <ThemedText style={styles.subtitle}>
        Так текст будет выглядеть после применения всех рекомендаций.
      </ThemedText>

      <ThemedView style={styles.preview}>
        <ThemedText style={styles.previewLabel}>Hero block</ThemedText>
        <ThemedText type="defaultSemiBold" style={styles.previewText}>
          {previewText}
        </ThemedText>
        <ThemedText style={styles.previewMeta}>CTA: «Улучшить текст»</ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 12,
  },
  subtitle: {
    opacity: 0.7,
  },
  preview: {
    flex: 1,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    padding: 24,
    gap: 12,
    justifyContent: 'center',
  },
  previewLabel: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    opacity: 0.6,
  },
  previewText: {
    fontSize: 20,
    lineHeight: 28,
  },
  previewMeta: {
    opacity: 0.6,
  },
});

