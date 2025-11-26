import { Feather } from '@expo/vector-icons';
import { FlatList, ListRenderItemInfo, Modal, Platform, Pressable, View } from 'react-native';

import { styles } from '@/components/new/styles';
import { ThemedText } from '@/components/themed-text';
import { IssueBlock } from '@services/SocialPostService';

type FixesModalProps = {
  visible: boolean;
  issues: IssueBlock[];
  selectedIssues: Set<string>;
  onClose: () => void;
  onIssueToggle: (issueId: string) => void;
  onSelectAll: () => void;
  onApply: () => void;
};

export function FixesModal({
  visible,
  issues,
  selectedIssues,
  onClose,
  onIssueToggle,
  onSelectAll,
  onApply,
}: FixesModalProps) {
  const renderIssue = ({ item }: ListRenderItemInfo<IssueBlock>) => (
    <Pressable style={styles.issueItem} onPress={() => onIssueToggle(item.id)}>
      <View style={styles.issueCheckbox}>
        {selectedIssues.has(item.id) && <Feather name="check" size={16} color="#111827" />}
      </View>
      <View style={styles.issueContent}>
        <ThemedText style={styles.issueTitle}>{item.title}</ThemedText>
        <ThemedText style={styles.issueScore}>
          <ThemedText style={{ fontWeight: 'bold', color: '#111827' }}>Impact:</ThemedText>
          {' '}
          <ThemedText
            style={[
              Math.round(item.score_impact) >= 8 && Math.round(item.score_impact) <= 10
                ? { color: '#22c55e' }
                : {},
            ]}>
            {Math.round(item.score_impact)}
          </ThemedText>
          {' · Priority: '}
          <ThemedText
            style={[
              (item.priority ?? 'medium').toLowerCase() === 'high'
                ? { color: '#22c55e' }
                : {},
            ]}>
            {item.priority ?? 'medium'}
          </ThemedText>
        </ThemedText>
        {item.description ? (
          <ThemedText style={styles.issueAdvice}>{item.description}</ThemedText>
        ) : null}
        {item.advice ? (
          <ThemedText style={styles.issueAdvice}>
            <ThemedText style={{ fontWeight: 'bold', color: '#111827' }}>Advice:</ThemedText>
            {' '}
            {item.advice}
          </ThemedText>
        ) : null}
        {item.suggested_fix ? (
          <ThemedText style={styles.issueAdvice}>
            <ThemedText style={{ fontWeight: 'bold', color: '#111827' }}>Fix:</ThemedText>
            {' '}
            {item.suggested_fix}
          </ThemedText>
        ) : null}
      </View>
    </Pressable>
  );

  const keyExtractor = (item: IssueBlock) => item.id;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      presentationStyle="overFullScreen">
      <View style={[styles.modalOverlay, Platform.OS === 'web' && styles.modalOverlayWeb]}>
        <Pressable style={styles.modalBackdrop} onPress={onClose} />
        <View style={[styles.fixesModal, Platform.OS === 'web' && styles.fixesModalWeb]}>
          <View style={styles.fixesModalHandle} />

          <View style={styles.fixesHeader}>
            <View style={styles.fixesHeaderSpacer} />
            <Pressable onPress={onSelectAll}>
              <ThemedText style={styles.selectAllText}>Select all</ThemedText>
            </Pressable>
          </View>

          <FlatList
            data={issues}
            keyExtractor={keyExtractor}
            renderItem={renderIssue}
            ItemSeparatorComponent={() => <View style={styles.issueDivider} />}
            style={styles.issuesList}
            contentContainerStyle={
              issues.length === 0 ? styles.issuesListEmpty : styles.issuesListContent
            }
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <ThemedText style={styles.emptyStateTitle}>No issues yet</ThemedText>
                <ThemedText style={styles.emptyStateDescription}>
                  Run Analyze to see personalized fixes for your post.
                </ThemedText>
              </View>
            }
            showsVerticalScrollIndicator
            bounces
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
          />

          <View style={styles.fixesButtons}>
            <Pressable style={styles.cancelButton} onPress={onClose}>
              <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
            </Pressable>
            <Pressable style={styles.applyButton} onPress={onApply}>
              <ThemedText style={styles.applyButtonText}>Apply advice</ThemedText>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

