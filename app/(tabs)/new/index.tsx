import { Feather, FontAwesome6 } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { ComponentProps, ReactNode, useCallback, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FixesModal } from '@/components/new/modals/fixes-modal';
import { GoalModal } from '@/components/new/modals/goal-modal';
import { HistoryModal } from '@/components/new/modals/history-modal';
import { ReferencesModal } from '@/components/new/modals/references-modal';
import { ThemedText } from '@/components/themed-text';
import { useStores } from '@/store/RootStore';
import { PostCard } from './post-card';
import { styles } from './styles';

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

type Issue = {
  id: string;
  issue: string;
  score: string;
  advice: string;
};

const mockIssues: Issue[] = [
  {
    id: '1',
    issue: "First sentence doesn't hook",
    score: '10/100',
    advice: 'Add a question or bold statement to create a hook',
  },
  {
    id: '2',
    issue: "First sentence doesn't hook",
    score: '10/100',
    advice: 'Add a question or bold statement to create a hook',
  },
  {
    id: '3',
    issue: "First sentence doesn't hook",
    score: '10/100',
    advice: 'Add a question or bold statement to create a hook',
  },
  {
    id: '4',
    issue: "First sentence doesn't hook",
    score: '10/100',
    advice: 'Add a question or bold statement to create a hook',
  },
  {
    id: '5',
    issue: "First sentence doesn't hook",
    score: '10/100',
    advice: 'Add a question or bold statement to create a hook',
  },
  {
    id: '6',
    issue: "First sentence doesn't hook",
    score: '10/100',
    advice: 'Add a question or bold statement to create a hook',
  },
];

type PostVersion = {
  id: string;
  label: string;
  content: string;
};

const mockPostVersions: PostVersion[] = [
  {
    id: '1',
    label: 'Your',
    content: `Рады приветствовать вас на сайте
компании «Итком 2000»! Наша компания
является ведущим провайдером услуг по
ИТ-интеграции в регионе. Мы работаем
на рынке интеграционных и
телекоммуникационных услуг с 2010 года
и оказываем полный спектр
телекоммуникационных услуг под ключ!
За долгие годы работы мы успешно`,
  },
  {
    id: '2',
    label: 'AI',
    content: `Рады приветствовать вас на сайте
компании «Итком 2000»! Наша компания
является ведущим провайдером услуг по
ИТ-интеграции в регионе. Мы работаем
на рынке интеграционных и
телекоммуникационных услуг с 2010
года и оказываем полный спектр
телекоммуникационных услуг`,
  },
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

export default function NewScreen() {
  const [post, setPost] = useState(defaultPost);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<HeaderAction['key']>(
    headerActions[0].key,
  );
  const [selectedIssues, setSelectedIssues] = useState<Set<string>>(new Set(['1']));
  const [isFixesModalVisible, setIsFixesModalVisible] = useState(false);
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);
  const [isGoalModalVisible, setIsGoalModalVisible] = useState(false);
  const [isReferencesModalVisible, setIsReferencesModalVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<string>('neutral');
  const [referenceText, setReferenceText] = useState<string>('');
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['34%'], []);
const { userStore } = useStores();
  const handleAnalyze = useCallback(() => {
    if (isAnalyzing) {
      return;
    }

    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 1200);
  }, [isAnalyzing]);

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
    setSelectedIssues(new Set(mockIssues.map(issue => issue.id)));
  }, []);

  const handleCloseFixes = useCallback(() => {
    setIsFixesModalVisible(false);
  }, []);

  const handleApplyAdvice = useCallback(() => {
    // TODO: Apply selected advice
    setIsFixesModalVisible(false);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.page}>
        <ThemedText>{userStore.name}</ThemedText>
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
          <View style={styles.postDivider} />
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
                    <Feather name={icon} size={18} color="#0F172A" />
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

              <Pressable style={styles.ghostButton}>
                <ThemedText style={styles.ghostButtonText}>Save</ThemedText>
              </Pressable>
            </View>
          </BottomSheetView>
        </BottomSheet>

        <FixesModal
          visible={isFixesModalVisible}
          issues={mockIssues}
          selectedIssues={selectedIssues}
          onClose={handleCloseFixes}
          onIssueToggle={handleIssueToggle}
          onSelectAll={handleSelectAll}
          onApply={handleApplyAdvice}
        />

        <HistoryModal
          visible={isHistoryModalVisible}
          versions={mockPostVersions}
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


