import { Feather } from '@expo/vector-icons';
import { ListRenderItemInfo, Modal, Platform, Pressable, View, FlatList } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { styles } from '@/components/new/styles';

type Issue = {
  id: string;
  issue: string;
  score: string;
  advice: string;
};

type FixesModalProps = {
  visible: boolean;
  issues: Issue[];
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
  const renderIssue = ({ item }: ListRenderItemInfo<Issue>) => (
    <Pressable style={styles.issueItem} onPress={() => onIssueToggle(item.id)}>
      <View style={styles.issueCheckbox}>
        {selectedIssues.has(item.id) && <Feather name="check" size={16} color="#111827" />}
      </View>
      <View style={styles.issueContent}>
        <ThemedText style={styles.issueTitle}>Issue: {item.issue}</ThemedText>
        <ThemedText style={styles.issueScore}>Score: {item.score}</ThemedText>
        <ThemedText style={styles.issueAdvice}>Advice: {item.advice}</ThemedText>
      </View>
    </Pressable>
  );

  const keyExtractor = (item: Issue) => item.id;

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
            contentContainerStyle={styles.issuesListContent}
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

