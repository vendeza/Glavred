import { Feather, FontAwesome6 } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { observer } from 'mobx-react-lite';
import { ComponentProps, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FixesModal } from '@/components/new/modals/fixes-modal';
import { GoalModal } from '@/components/new/modals/goal-modal';
import { HistoryModal } from '@/components/new/modals/history-modal';
import { ReferencesModal } from '@/components/new/modals/references-modal';
import { PostCard } from '@/components/new/post-card';
import { styles } from '@/components/new/styles';
import { ThemedText } from '@/components/themed-text';
import { useStores } from '@/store/RootStore';

type FeatherIconName = ComponentProps<typeof Feather>['name'];
type FontAwesome6IconName = ComponentProps<typeof FontAwesome6>['name'];

type HeaderAction = {
  key: string;
  renderIcon: () => ReactNode;
};

const defaultPost = `🚀 I've launched my app — Holli

It’s a calorie tracker that doesn’t annoy you:

📸 Calculates calories from a photo
✏️ Calculates calories from a description
🤖 An AI assistant that knows what you ate

Holli focuses on being simple, clean, and fast.
No tables. No confusion.`;

const headerActions: HeaderAction[] = [
  {
    key: 'x',
    renderIcon: () => <FontAwesome6 name="x-twitter" size={18} color="#111827" />,
  },
  {
    key: 'threads',
    renderIcon: () => <FontAwesome6 name="threads" size={18} color="#111827" />,
  },
  {
    key: 'doc',
    renderIcon: () => <Feather name="file-text" size={18} color="#111827" />,
  },
];

const quickActions: { label: string; icon: FeatherIconName }[] = [
  { label: 'Fixes', icon: 'edit-3' },
  { label: 'Versions', icon: 'clock' },
  { label: 'Goal', icon: 'flag' },
  { label: 'References', icon: 'book-open' },
];

type PostGoal = {
  id: string;
  label: string;
};

const postGoals: PostGoal[] = [
  { id: 'neutral', label: 'Neutral' },
  { id: 'comments', label: 'Comments' },
  { id: 'reposts', label: 'Reposts' },
  { id: 'subscribes', label: 'Subscribes' },
  { id: 'likes', label: 'Likes' },
];

function NewScreen() {
  const [post, setPost] = useState(defaultPost);
  const [selectedNetwork, setSelectedNetwork] = useState<HeaderAction['key']>(
    headerActions[0].key,
  );
  const [selectedIssues, setSelectedIssues] = useState<Set<string>>(new Set());
  const [isFixesModalVisible, setIsFixesModalVisible] = useState(false);
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);
  const [isGoalModalVisible, setIsGoalModalVisible] = useState(false);
  const [isReferencesModalVisible, setIsReferencesModalVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<string>('neutral');
  const [referenceText, setReferenceText] = useState<string>('');
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['34%'], []);
  const { socialPostStore } = useStores();
  const issues = socialPostStore.evaluation?.issues ?? [];
  const isAnalyzing = socialPostStore.isAnalyzing;

  useEffect(() => {
    if (issues.length) {
      setSelectedIssues(new Set(issues.map(issue => issue.id)));
    } else {
      setSelectedIssues(new Set());
    }
  }, [socialPostStore.evaluation]);

  const handleAnalyze = useCallback(async () => {
    if (socialPostStore.isAnalyzing) {
      return;
    }

    try {
      socialPostStore.updateInput({ post });
      await socialPostStore.analyzePost({ post });
    } catch (error) {
      console.error('Failed to analyze post', error);
    }
  }, [post, socialPostStore]);

  const handleFixesPress = useCallback(() => {
    setIsFixesModalVisible(true);
  }, []);

  const handleHistoryPress = useCallback(() => {
    setIsHistoryModalVisible(true);
  }, []);

  const handleCloseHistory = useCallback(() => {
    setIsHistoryModalVisible(false);
  }, []);

  const handleGoalPress = useCallback(() => {
    setIsGoalModalVisible(true);
  }, []);

  const handleCloseGoal = useCallback(() => {
    setIsGoalModalVisible(false);
  }, []);

  const handleSelectGoal = useCallback((goalId: string) => {
    setSelectedGoal(goalId);
  }, []);

  const handleReferencesPress = useCallback(() => {
    setIsReferencesModalVisible(true);
  }, []);

  const handleCloseReferences = useCallback(() => {
    setIsReferencesModalVisible(false);
  }, []);

  const handleAddReference = useCallback(() => {
    // TODO: Add reference logic
    setReferenceText('');
  }, []);

  const handleApplyReferences = useCallback(() => {
    // TODO: Apply references logic
    setIsReferencesModalVisible(false);
  }, []);

  const handleIssueToggle = useCallback((issueId: string) => {
    setSelectedIssues(prev => {
      const next = new Set(prev);
      if (next.has(issueId)) {
        next.delete(issueId);
      } else {
        next.add(issueId);
      }
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedIssues(new Set(issues.map(issue => issue.id)));
  }, [issues]);

  const handleCloseFixes = useCallback(() => {
    setIsFixesModalVisible(false);
  }, []);

  const handleSave = useCallback(() => {
    // Добавляем текущую версию поста
    if (post.trim()) {
      socialPostStore.addPostVersion(post, 'Your');
    }
  }, [post, socialPostStore]);

  const handleApplyAdvice = useCallback(async () => {
    if (socialPostStore.isApplyingChanges) {
      return;
    }

    if (selectedIssues.size === 0) {
      return;
    }

    try {
      // Сохраняем список ID примененных issues
      const appliedIssueIds = Array.from(selectedIssues);

      // Преобразуем выбранные issues в ChangeInstruction[]
      const changes = issues
        .filter(issue => selectedIssues.has(issue.id))
        .map(issue => ({
          id: issue.id,
          description: issue.suggested_fix || issue.advice || issue.description,
          context: issue.description,
          priority: issue.priority,
        }));

      // Применяем изменения через стор (версия будет добавлена автоматически в сторе)
      const response = await socialPostStore.applyChanges({
        post,
        changes,
      });

      // Удаляем примененные issues из списка
      socialPostStore.removeIssues(appliedIssueIds);

      // Обновляем пост в компоненте
      setPost(response.updatedPost);

      // Очищаем выбранные issues
      setSelectedIssues(new Set());

      // Закрываем модалку
      setIsFixesModalVisible(false);
    } catch (error) {
      console.error('Failed to apply advice', error);
      // Можно добавить показ ошибки пользователю
    }
  }, [selectedIssues, issues, socialPostStore, post]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.page}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.heading}>Your post</ThemedText>

            <View style={styles.headerActions}>
              {headerActions.map(({ key, renderIcon }) => (
                <Pressable
                  key={key}
                  hitSlop={12}
                  onPress={() => setSelectedNetwork(key)}
                  style={[
                    styles.headerAction,
                    selectedNetwork === key && styles.headerActionSelected,
                  ]}>
                  {renderIcon()}
                </Pressable>
              ))}
            </View>
          </View>

          <PostCard
            post={post}
            onChangePost={setPost}
            selectedNetwork={selectedNetwork}
          />
          
        </ScrollView>

        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          enablePanDownToClose={false}
          backgroundStyle={styles.sheetBackground}
          handleIndicatorStyle={styles.sheetIndicator}>
          <BottomSheetView style={styles.sheetContent}>
            <View style={styles.quickActionsRow}>
              {quickActions.map(({ label, icon }) => (
                <TouchableOpacity
                  key={label}
                  style={styles.quickAction}
                  activeOpacity={0.6}
                  onPress={() => {
                    if (label === 'Fixes') {
                      handleFixesPress();
                    } else if (label === 'Versions') {
                      handleHistoryPress();
                    } else if (label === 'Goal') {
                      handleGoalPress();
                    } else if (label === 'References') {
                      handleReferencesPress();
                    }
                  }}>
                  <View style={styles.quickActionIcon}>
                    <Feather name={icon} size={16} color="#0F172A" />
                  </View>
                  <ThemedText style={styles.quickActionLabel}>{label}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.sheetButtons}>
              <Pressable style={styles.secondaryButton}>
                <ThemedText style={styles.secondaryButtonText}>Fix</ThemedText>
              </Pressable>

              <Pressable
                onPress={handleAnalyze}
                style={[styles.primaryButton, isAnalyzing && styles.primaryButtonDisabled]}>
                <ThemedText style={styles.primaryButtonText}>
                  {isAnalyzing ? 'Analyzing…' : 'Analyze'}
                </ThemedText>
              </Pressable>

              <Pressable style={styles.ghostButton} onPress={handleSave}>
                <ThemedText style={styles.ghostButtonText}>Save</ThemedText>
              </Pressable>
            </View>
          </BottomSheetView>
        </BottomSheet>

        <FixesModal
          visible={isFixesModalVisible}
          issues={issues}
          selectedIssues={selectedIssues}
          onClose={handleCloseFixes}
          onIssueToggle={handleIssueToggle}
          onSelectAll={handleSelectAll}
          onApply={handleApplyAdvice}
          isApplying={socialPostStore.isApplyingChanges}
        />

        <HistoryModal
          visible={isHistoryModalVisible}
          versions={socialPostStore.postVersions}
          onClose={handleCloseHistory}
        />

        <GoalModal
          visible={isGoalModalVisible}
          goals={postGoals}
          selectedGoal={selectedGoal}
          onClose={handleCloseGoal}
          onSelectGoal={handleSelectGoal}
        />

        <ReferencesModal
          visible={isReferencesModalVisible}
          referenceText={referenceText}
          onClose={handleCloseReferences}
          onReferenceTextChange={setReferenceText}
          onAddReference={handleAddReference}
          onApply={handleApplyReferences}
        />
      </View>
    </SafeAreaView>
  );
}

export default observer(NewScreen);


