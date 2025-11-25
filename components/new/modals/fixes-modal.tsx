import { Feather } from '@expo/vector-icons';
import { ListRenderItemInfo, Modal, Platform, Pressable, View, FlatList } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { styles } from '@/components/new/styles';
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
          Impact: {Math.round(item.score_impact)} · Priority: {item.priority ?? 'medium'}
        </ThemedText>
        {item.description ? (
          <ThemedText style={styles.issueAdvice}>{item.description}</ThemedText>
        ) : null}
        {item.advice ? (
          <ThemedText style={styles.issueAdvice}>Advice: {item.advice}</ThemedText>
        ) : null}
        {item.suggested_fix ? (
          <ThemedText style={styles.issueAdvice}>Fix: {item.suggested_fix}</ThemedText>
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

