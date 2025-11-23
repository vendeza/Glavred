import { FlatList, ListRenderItem, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type HistoryItem = {
  id: string;
  title: string;
  score: string;
  updatedAt: string;
  summary: string;
};

const HISTORY: HistoryItem[] = [
  {
    id: '1',
    title: 'Product landing hero copy',
    score: '92 / 100',
    updatedAt: '2 min ago',
    summary: 'Rephrased CTA and removed jargon.',
  },
  {
    id: '2',
    title: 'Push notification (RU)',
    score: '77 / 100',
    updatedAt: '1 hour ago',
    summary: 'Needs a shorter hook and one verb.',
  },
  {
    id: '3',
    title: 'Welcome email draft',
    score: '84 / 100',
    updatedAt: 'Yesterday',
    summary: 'Highlighted key benefit and simplified intro.',
  },
];

export default function HistoryScreen() {
  const renderItem: ListRenderItem<HistoryItem> = ({ item }) => (
    <ThemedView style={styles.card}>
      <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
      <ThemedText style={styles.summary}>{item.summary}</ThemedText>
      <ThemedView style={styles.metaRow}>
        <ThemedText type="mono">{item.score}</ThemedText>
        <ThemedText style={styles.meta}>{item.updatedAt}</ThemedText>
      </ThemedView>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">History</ThemedText>
      <ThemedText style={styles.subtitle}>
        Последние тексты, с которыми вы работали. Историю можно будет связать с Firestore.
      </ThemedText>
      <FlatList
        data={HISTORY}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <ThemedView style={styles.separator} />}
      />
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
  listContent: {
    paddingTop: 8,
    paddingBottom: 40,
    gap: 12,
  },
  separator: {
    height: 4,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    gap: 8,
  },
  summary: {
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  meta: {
    opacity: 0.6,
  },
});

