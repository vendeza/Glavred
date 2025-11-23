import { Feather, FontAwesome6 } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { ComponentProps, ReactNode, useCallback, useMemo, useRef, useState } from 'react';
import { FlatList, ListRenderItemInfo, Modal, Platform, Pressable, ScrollView, TouchableOpacity, View } from 'react-native';
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
  { label: 'History', icon: 'clock' },
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

export default function NewScreen() {
  const [post, setPost] = useState(defaultPost);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<HeaderAction['key']>(
    headerActions[0].key,
  );
  const [selectedIssues, setSelectedIssues] = useState<Set<string>>(new Set(['1']));
  const [isFixesModalVisible, setIsFixesModalVisible] = useState(false);
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
      </View>
    </SafeAreaView>
  );
}


