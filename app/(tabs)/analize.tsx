import { ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const metrics = [
  { label: 'Clarity', value: '87%', hint: 'Уберите вводные конструкции и длинные цепочки.' },
  { label: 'Tone consistency', value: 'A-', hint: 'Добавьте больше глаголов в активном залоге.' },
  { label: 'Length', value: 'Perfect', hint: '120 слов — комфортный объём для push-кампании.' },
  { label: 'Spam risk', value: 'Safe', hint: 'Нет повторяющихся слов и восклицаний.' },
];

const suggestions = [
  'Сформулируйте CTA через пользу, например «Получить подборку»',
  'Уберите двойные отрицания — они усложняют чтение.',
  'Замените профессиональный жаргон понятной фразой.',
];

export default function AnalizeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedText type="title">Analize</ThemedText>
      <ThemedText style={styles.subtitle}>
        Здесь появятся результаты последнего анализа. Сейчас это мок-данные, которые можно связать
        с Firestore и Cloud Functions.
      </ThemedText>

      <ThemedView style={styles.card}>
        <ThemedText type="subtitle">Metrics</ThemedText>
        {metrics.map((metric) => (
          <ThemedView key={metric.label} style={styles.metricRow}>
            <ThemedText type="defaultSemiBold">{metric.label}</ThemedText>
            <ThemedText type="mono">{metric.value}</ThemedText>
            <ThemedText style={styles.metricHint}>{metric.hint}</ThemedText>
          </ThemedView>
        ))}
      </ThemedView>

      <ThemedView style={styles.card}>
        <ThemedText type="subtitle">Next steps</ThemedText>
        {suggestions.map((item, index) => (
          <ThemedText key={item} style={styles.suggestion}>
            {index + 1}. {item}
          </ThemedText>
        ))}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 16,
  },
  subtitle: {
    opacity: 0.7,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    padding: 16,
    gap: 12,
  },
  metricRow: {
    gap: 4,
  },
  metricHint: {
    opacity: 0.7,
    lineHeight: 18,
  },
  suggestion: {
    lineHeight: 22,
  },
});

