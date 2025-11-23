import { Feather, FontAwesome6 } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { ComponentProps, ReactNode, useCallback, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
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

export default function NewScreen() {
  const [post, setPost] = useState(defaultPost);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<HeaderAction['key']>(
    headerActions[0].key,
  );
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['34%'], []);

  const handleAnalyze = useCallback(() => {
    if (isAnalyzing) {
      return;
    }

    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 1200);
  }, [isAnalyzing]);

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
                <Pressable key={label} style={styles.quickAction}>
                  <View style={styles.quickActionIcon}>
                    <Feather name={icon} size={18} color="#0F172A" />
                  </View>
                  <ThemedText style={styles.quickActionLabel}>{label}</ThemedText>
                </Pressable>
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
      </View>
    </SafeAreaView>
  );
}


