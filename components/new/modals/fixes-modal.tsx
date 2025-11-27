import { Feather } from '@expo/vector-icons';
import { FlatList, ListRenderItemInfo, Platform, Pressable, StyleSheet, View } from 'react-native';

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
  onApply: () => void | Promise<void>;
  isApplying?: boolean;
};

export function FixesModal({
  visible,
  issues,
  selectedIssues,
  onClose,
  onIssueToggle,
  onSelectAll,
  onApply,
  isApplying = false,
}: FixesModalProps) {
  const renderIssue = ({ item }: ListRenderItemInfo<IssueBlock>) => (
    <Pressable style={fixesModalStyles.issueItem} onPress={() => onIssueToggle(item.id)}>
      <View style={fixesModalStyles.issueCheckbox}>
        {selectedIssues.has(item.id) && <Feather name="check" size={16} color="#111827" />}
      </View>
      <View style={fixesModalStyles.issueContent}>
        <ThemedText style={fixesModalStyles.issueTitle}>{item.title}</ThemedText>
        <ThemedText style={fixesModalStyles.issueScore}>
          <ThemedText style={{ fontWeight: 'bold', color: '#111827' }}>Priority:</ThemedText>
          {' '}
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
          <ThemedText style={fixesModalStyles.issueAdvice}>{item.description}</ThemedText>
        ) : null}
        {item.advice ? (
          <ThemedText style={fixesModalStyles.issueAdvice}>
            <ThemedText style={{ fontWeight: 'bold', color: '#111827' }}>Advice:</ThemedText>
            {' '}
            {item.advice}
          </ThemedText>
        ) : null}
        {item.suggested_fix ? (
          <ThemedText style={fixesModalStyles.issueAdvice}>
            <ThemedText style={{ fontWeight: 'bold', color: '#111827' }}>Fix:</ThemedText>
            {' '}
            {item.suggested_fix}
          </ThemedText>
        ) : null}
      </View>
    </Pressable>
  );

  const keyExtractor = (item: IssueBlock) => item.id;

  if (!visible) {
    return null;
  }

  return (
    <View style={[styles.modalOverlay, Platform.OS === 'web' && styles.modalOverlayWeb]} pointerEvents="box-none">
      <View style={[fixesModalStyles.fixesModal, Platform.OS === 'web' && fixesModalStyles.fixesModalWeb]} pointerEvents="box-none">
        <View style={fixesModalStyles.fixesModalContent} pointerEvents="box-none">
          <View style={fixesModalStyles.fixesHeader} pointerEvents="auto">
            <View style={fixesModalStyles.fixesHeaderSpacer} />
            <Pressable onPress={onSelectAll}>
              <ThemedText style={fixesModalStyles.selectAllText}>Select all</ThemedText>
            </Pressable>
          </View>

          <View style={fixesModalStyles.issuesListContainer} pointerEvents="auto">
            <FlatList
              data={issues}
              keyExtractor={keyExtractor}
              renderItem={renderIssue}
              ItemSeparatorComponent={() => <View style={fixesModalStyles.issueDivider} />}
              style={fixesModalStyles.issuesList}
              contentContainerStyle={
                issues.length === 0 ? fixesModalStyles.issuesListEmpty : fixesModalStyles.issuesListContent
              }
              ListEmptyComponent={
                <View style={fixesModalStyles.emptyState}>
                  <ThemedText style={fixesModalStyles.emptyStateTitle}>No issues yet</ThemedText>
                  <ThemedText style={fixesModalStyles.emptyStateDescription}>
                    Run Analyze to see personalized fixes for your post.
                  </ThemedText>
                </View>
              }
              showsVerticalScrollIndicator
              bounces
              nestedScrollEnabled
              keyboardShouldPersistTaps="handled"
            />
          </View>
        </View>

        <View style={fixesModalStyles.fixesButtons} pointerEvents="auto">
          <Pressable style={styles.cancelButton} onPress={onClose} disabled={isApplying}>
            <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
          </Pressable>
          <Pressable
            style={[
              styles.applyButton,
              (isApplying || selectedIssues.size === 0) && fixesModalStyles.applyButtonDisabled,
            ]}
            onPress={onApply}
            disabled={isApplying || selectedIssues.size === 0}>
            <ThemedText style={styles.applyButtonText}>
              {isApplying ? 'Applying…' : 'Apply advice'}
            </ThemedText>
          </Pressable>
        </View>
      </View>
      </View>
  );
}


const fixesModalStyles = StyleSheet.create({
  fixesModal: {
    height: '60%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 18,
    flexDirection: 'column',
  },
  fixesModalContent: {
    flex: 1,
    paddingTop: 12,
    paddingHorizontal: 24,
    gap: 16,
  },
  fixesModalWeb: {
    maxWidth: 800,
    width: '100%',
  },
  fixesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  fixesHeaderSpacer: {
    flex: 1,
  },
  selectAllText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  issuesListContainer: {
    flex: 1,
  },
  issuesList: {
    flex: 1,
  },
  issuesListContent: {
    gap: 0,
    paddingBottom: 16,
    flexGrow: 1,
  },
  issuesListEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  issueItem: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 16,
    alignItems: 'flex-start',
  },
  issueCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  issueContent: {
    flex: 1,
    gap: 4,
  },
  issueTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  issueScore: {
    fontSize: 14,
    color: '#6B7280',
  },
  issueAdvice: {
    fontSize: 14,
    color: '#6B7280',
  },
  issueDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginLeft: 36,
  },
  emptyState: {
    alignItems: 'center',
    gap: 8,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  emptyStateDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  fixesButtons: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 24,
    paddingBottom: 6,
    paddingTop: 6,  
    backgroundColor: '#fff',
  },
  applyButtonDisabled: {
    backgroundColor: '#9CA3AF',
    opacity: 0.6,
  },
});