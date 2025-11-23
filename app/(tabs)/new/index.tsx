import { Feather, FontAwesome6 } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { ComponentProps, ReactNode, useCallback, useMemo, useRef, useState } from 'react';
import { FlatList, ListRenderItemInfo, Modal, Platform, Pressable, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
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

  const renderIssue = useCallback(
    ({ item }: ListRenderItemInfo<Issue>) => (
      <Pressable style={styles.issueItem} onPress={() => handleIssueToggle(item.id)}>
        <View style={styles.issueCheckbox}>
          {selectedIssues.has(item.id) && <Feather name="check" size={16} color="#111827" />}
        </View>
        <View style={styles.issueContent}>
          <ThemedText style={styles.issueTitle}>Issue: {item.issue}</ThemedText>
          <ThemedText style={styles.issueScore}>Score: {item.score}</ThemedText>
          <ThemedText style={styles.issueAdvice}>Advice: {item.advice}</ThemedText>
        </View>
      </Pressable>
    ),
    [handleIssueToggle, selectedIssues],
  );

  const keyExtractor = useCallback((item: Issue) => item.id, []);

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

        <Modal
          visible={isFixesModalVisible}
          animationType="slide"
          transparent
          presentationStyle="overFullScreen">
          <View style={[styles.modalOverlay, Platform.OS === 'web' && styles.modalOverlayWeb]}>
            <Pressable style={styles.modalBackdrop} onPress={handleCloseFixes} />
            <View style={[styles.fixesModal, Platform.OS === 'web' && styles.fixesModalWeb]}>
              <View style={styles.fixesModalHandle} />

              <View style={styles.fixesHeader}>
                <View style={styles.fixesHeaderSpacer} />
                <Pressable onPress={handleSelectAll}>
                  <ThemedText style={styles.selectAllText}>Select all</ThemedText>
                </Pressable>
              </View>

              <FlatList
                data={mockIssues}
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
                <Pressable style={styles.cancelButton} onPress={handleCloseFixes}>
                  <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
                </Pressable>
                <Pressable style={styles.applyButton} onPress={handleApplyAdvice}>
                  <ThemedText style={styles.applyButtonText}>Apply advice</ThemedText>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          visible={isHistoryModalVisible}
          animationType="slide"
          transparent
          presentationStyle="overFullScreen">
          <View style={[styles.modalOverlay, Platform.OS === 'web' && styles.modalOverlayWeb]}>
            <Pressable style={styles.modalBackdrop} onPress={handleCloseHistory} />
            <View style={[styles.historyModal, Platform.OS === 'web' && styles.historyModalWeb]}>
              <View style={styles.fixesModalHandle} />

              <View style={styles.historyHeader}>
                <ThemedText style={styles.historyTitle}>Post versions</ThemedText>
              </View>

              <FlatList
                data={mockPostVersions}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.versionCard}>
                    <View style={styles.versionLabel}>
                      <ThemedText style={styles.versionLabelText}>{item.label}</ThemedText>
                    </View>
                    <ThemedText style={styles.versionContent}>{item.content}</ThemedText>
                  </View>
                )}
                ItemSeparatorComponent={() => <View style={styles.versionDivider} />}
                style={styles.versionsList}
                contentContainerStyle={styles.versionsListContent}
                showsVerticalScrollIndicator
                bounces
                nestedScrollEnabled
                keyboardShouldPersistTaps="handled"
              />
            </View>
          </View>
        </Modal>

        <Modal
          visible={isGoalModalVisible}
          animationType="slide"
          transparent
          presentationStyle="overFullScreen">
          <View style={[styles.modalOverlay, Platform.OS === 'web' && styles.modalOverlayWeb]}>
            <Pressable style={styles.modalBackdrop} onPress={handleCloseGoal} />
            <View style={[styles.goalModal, Platform.OS === 'web' && styles.goalModalWeb]}>
              <View style={styles.fixesModalHandle} />

              <View style={styles.goalHeader}>
                <ThemedText style={styles.goalTitle}>Post goal</ThemedText>
              </View>

              <View style={styles.goalButtonsContainer}>
                {postGoals.map((goal) => (
                  <Pressable
                    key={goal.id}
                    style={[
                      styles.goalButton,
                      selectedGoal === goal.id && styles.goalButtonSelected,
                    ]}
                    onPress={() => handleSelectGoal(goal.id)}>
                    <ThemedText
                      style={[
                        styles.goalButtonText,
                        selectedGoal === goal.id && styles.goalButtonTextSelected,
                      ]}>
                      {goal.label}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          visible={isReferencesModalVisible}
          animationType="slide"
          transparent
          presentationStyle="overFullScreen">
          <View style={[styles.modalOverlay, Platform.OS === 'web' && styles.modalOverlayWeb]}>
            <Pressable style={styles.modalBackdrop} onPress={handleCloseReferences} />
            <View style={[styles.referencesModal, Platform.OS === 'web' && styles.referencesModalWeb]}>
              <View style={styles.fixesModalHandle} />

              <View style={styles.referencesHeader}>
                <ThemedText style={styles.referencesTitle}>References for your post</ThemedText>
              </View>

              <Pressable style={styles.addScreenshotButton}>
                <Feather name="image" size={20} color="#6B7280" />
                <ThemedText style={styles.addScreenshotText}>Add screenshot</ThemedText>
              </Pressable>

              <View style={styles.referenceInputContainer}>
                <TextInput
                  style={styles.referenceInput}
                  placeholder="Add a reference text"
                  placeholderTextColor="#9CA3AF"
                  value={referenceText}
                  onChangeText={setReferenceText}
                  multiline
                />
                <Pressable style={styles.addReferenceButton} onPress={handleAddReference}>
                  <ThemedText style={styles.addReferenceButtonText}>Add</ThemedText>
                </Pressable>
              </View>

              <View style={styles.referencesButtons}>
                <Pressable style={styles.cancelButton} onPress={handleCloseReferences}>
                  <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
                </Pressable>
                <Pressable style={styles.applyButton} onPress={handleApplyReferences}>
                  <ThemedText style={styles.applyButtonText}>Apply</ThemedText>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}


