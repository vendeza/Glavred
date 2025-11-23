import { Feather, FontAwesome6 } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { ComponentProps, ReactNode, useCallback, useMemo, useRef, useState } from 'react';
import {
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TextInputContentSizeChangeEventData,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';

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

const MIN_EDITOR_HEIGHT = 120;

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
  const [editorHeight, setEditorHeight] = useState(MIN_EDITOR_HEIGHT);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['34%'], []);

  const handleAnalyze = useCallback(() => {
    if (isAnalyzing) {
      return;
    }

    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 1200);
  }, [isAnalyzing]);

  const handleEditorContentSize = useCallback(
    (event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
      const nextHeight = event.nativeEvent.contentSize.height;
      setEditorHeight(prev => {
        if (Math.abs(prev - nextHeight) < 1) {
          return prev;
        }
        return Math.max(nextHeight, MIN_EDITOR_HEIGHT);
      });
    },
    [],
  );

  const computedEditorHeight = Math.max(editorHeight, MIN_EDITOR_HEIGHT);

  const renderPostCard = () => {
    if (selectedNetwork === 'x') {
      return (
        <View style={[styles.card, styles.xCard, styles.fullHeightCard]}>
          <View style={styles.xAvatar} />

          <View style={styles.xContent}>
            <View style={styles.xHeader}>
              <View style={styles.xHeaderText}>
                <ThemedText style={styles.xUserName}>User Name</ThemedText>
                <ThemedText style={styles.xUserMeta}>@user_name · 1 d.</ThemedText>
              </View>

              <FontAwesome6 name="x-twitter" size={18} color="#0F1419" />
            </View>

            <TextInput
              multiline
              value={post}
              onChangeText={setPost}
              textAlignVertical="top"
              placeholder="Share what’s new…"
              placeholderTextColor="#9AA0A6"
              scrollEnabled={false}
              onContentSizeChange={handleEditorContentSize}
              style={[styles.editor, styles.xEditor, { height: computedEditorHeight }]}
            />

            <View style={styles.xDivider} />

            <View style={styles.xFooter}>
              <View style={styles.xMetaRow}>
                <ThemedText style={styles.xMetaText}>513 Likes</ThemedText>
                <View style={styles.xSeparatorDot} />
                <ThemedText style={styles.xMetaText}>87 Replies</ThemedText>
                <View style={styles.xSeparatorDot} />
                <ThemedText style={styles.xMetaText}>13.2K Views</ThemedText>
              </View>

              <View style={styles.xFooterActions}>
                <Feather name="heart" size={16} color="#6B7280" />
                <Feather name="message-circle" size={16} color="#6B7280" />
                <Feather name="repeat" size={16} color="#6B7280" />
                <Feather name="bookmark" size={16} color="#6B7280" />
              </View>
            </View>
          </View>
        </View>
      );
    }

    return (
      <View style={[styles.card, styles.fullHeightCard]}>
        <ThemedText style={styles.cardMeta}>Последнее обновление · 2 минуты назад</ThemedText>

        <TextInput
          multiline
          value={post}
          onChangeText={setPost}
          textAlignVertical="top"
          placeholder="Вставьте текст или заметку…"
          placeholderTextColor="#A3A6AF"
          scrollEnabled={false}
          onContentSizeChange={handleEditorContentSize}
          style={[styles.editor, { height: computedEditorHeight }]}
        />
      </View>
    );
  };

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

          {renderPostCard()}
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  page: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 260,
    gap: 16,
    flexGrow: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  heading: {
    fontSize: 32,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerAction: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  headerActionSelected: {
    borderWidth: 1,
    borderColor: '#111827',
    backgroundColor: '#1118270D',
  },
  card: {
    borderRadius: 20,  
    gap: 16, 
  },
  fullHeightCard: {
    flexGrow: 1,
    alignSelf: 'stretch',
    minHeight: 0,
  },
  cardMeta: {
    fontSize: 14,
    color: '#6B7280',
  },
  editor: {
    fontSize: 16,
    lineHeight: 24,
    minHeight: 220,
    flex: 0,
  },
  sheetBackground: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    backgroundColor: '#fff',
  },
  sheetIndicator: {
    width: 40,
    height: 4,
    borderRadius: 999,
    backgroundColor: '#D1D5DB',
  },
  sheetContent: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    gap: 20,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAction: {
    alignItems: 'center',
    gap: 8,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionLabel: {
    fontSize: 13,
    color: '#374151',
  },
  sheetButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontWeight: '600',
    color: '#111827',
  },
  primaryButton: {
    flex: 1.4,
    height: 52,
    borderRadius: 18,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonDisabled: {
    backgroundColor: '#F3F4F6',
  },
  primaryButtonText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
  },
  ghostButton: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostButtonText: {
    fontWeight: '600',
    color: '#fff',
  },
  xCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  xAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E5E7EB',
  },
  xContent: {
    flex: 1,
    gap: 12,
  },
  xHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  xHeaderText: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  xUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F1419',
  },
  xUserMeta: {
    fontSize: 14,
    color: '#6B7280',
  },
  xEditor: {
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: 0,
    paddingVertical: 0,
    color: '#0F1419',
    flex: 1,
    minHeight: 0,
  },
  xDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  xFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  xMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    flex: 1,
  },
  xMetaText: {
    fontSize: 13,
    color: '#6B7280',
  },
  xSeparatorDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
  },
  xFooterActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
});

