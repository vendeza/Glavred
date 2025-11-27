import { Feather, FontAwesome6 } from '@expo/vector-icons';
import { observer } from 'mobx-react-lite';
import { ComponentProps, ReactNode, useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LoadingOverlay } from '@/components/loading-overlay';
import { FixesModal } from '@/components/new/modals/fixes-modal';
import { HistoryModal } from '@/components/new/modals/history-modal';
import { TuneModal } from '@/components/new/modals/tune-modal';
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

const defaultPost = `🚀 Я выпустил своё приложение — Holli

Это трекер калорий, который не бесит:

📸 Рассчитывает калории по фото
📝 Рассчитывает калории по описанию 
🤖 ИИ ассистент знает что ты ел 

Фокус Holli:
простой, чистый и быстрый интерфейс.
Без таблиц. Без перегруза. Без путаницы.

Я сделал его под свою реальную проблему:
хотел контролировать питание, но не хотел тратить на это время.`;

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
  { label: 'Tune', icon: 'settings' },
];

function NewScreen() {
  const [post, setPost] = useState(defaultPost);
  const [selectedNetwork, setSelectedNetwork] = useState<HeaderAction['key']>(
    headerActions[0].key,
  );
  const [selectedIssues, setSelectedIssues] = useState<Set<string>>(new Set());
  const [isFixesModalVisible, setIsFixesModalVisible] = useState(false);
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);
  const [isTuneModalVisible, setIsTuneModalVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<string>('neutral');
  const [selectedTargetAudience, setSelectedTargetAudience] = useState<string>('general');
  const [selectedTone, setSelectedTone] = useState<string>('friendly');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [selectedPostType, setSelectedPostType] = useState<string>('');
  const [selectedBrandPersona, setSelectedBrandPersona] = useState<string>('none');
  const [referenceTexts, setReferenceTexts] = useState<string[]>([]);
  const [referenceTextInput, setReferenceTextInput] = useState<string>('');
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
      socialPostStore.updateInput({ post, goal: selectedGoal });
      await socialPostStore.analyzePost({ post, goal: selectedGoal });
    } catch (error) {
      console.error('Failed to analyze post', error);
    }
  }, [post, selectedGoal, socialPostStore]);

  const handleFixesPress = useCallback(() => {
    setIsFixesModalVisible(true);
  }, []);

  const handleHistoryPress = useCallback(() => {
    setIsHistoryModalVisible(true);
  }, []);

  const handleCloseHistory = useCallback(() => {
    setIsHistoryModalVisible(false);
  }, []);

  const handleTunePress = useCallback(() => {
    setIsTuneModalVisible(true);
  }, []);

  const handleCloseTune = useCallback(() => {
    setIsTuneModalVisible(false);
  }, []);

  const handleSelectPlatform = useCallback((platformId: string) => {
    setSelectedNetwork(platformId);
    
    // Устанавливаем max_length в зависимости от платформы
    const platformMaxLengths: Record<string, number> = {
      x: 280,
      threads: 500,
      linkedin: 3000,
      instagram: 2200,
    };
    
    const maxLength = platformMaxLengths[platformId];
    if (maxLength) {
      socialPostStore.updateInput({ max_length: maxLength });
    }
  }, [socialPostStore]);

  const handleSelectGoal = useCallback((goalId: string) => {
    setSelectedGoal(goalId);
  }, []);

  const handleSelectTargetAudience = useCallback((value: string) => {
    setSelectedTargetAudience(value);
  }, []);

  const handleSelectTone = useCallback((value: string) => {
    setSelectedTone(value);
  }, []);

  const handleSelectLanguage = useCallback((value: string) => {
    setSelectedLanguage(value);
  }, []);

  const handleSelectPostType = useCallback((value: string) => {
    setSelectedPostType(value);
  }, []);

  const handleSelectBrandPersona = useCallback((value: string) => {
    setSelectedBrandPersona(value);
  }, []);

  const handleAddReferenceText = useCallback(() => {
    if (referenceTextInput.trim()) {
      setReferenceTexts(prev => [...prev, referenceTextInput.trim()]);
      setReferenceTextInput('');
    }
  }, [referenceTextInput]);

  const handleRemoveReferenceText = useCallback((index: number) => {
    setReferenceTexts(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleApplyTune = useCallback(() => {
    // Маппинг brand persona в значение
    const brandPersonaMap: Record<string, string> = {
      none: '',
      naval: '@naval',
      sam_altman: '@sama',
      levelsio: '@levelsio',
    };
    const brandPersonaValue = selectedBrandPersona ? brandPersonaMap[selectedBrandPersona] : undefined;

    // Сохраняем настройки в стор
    socialPostStore.updateInput({ 
      platform: selectedNetwork,
      goal: selectedGoal,
      target_audience: selectedTargetAudience,
      tone: selectedTone,
      language: selectedLanguage || undefined,
      post_type: selectedPostType || undefined,
      brand_persona: brandPersonaValue || undefined,
      reference_twitter_handles: brandPersonaValue && brandPersonaValue !== '' ? [brandPersonaValue] : [],
      reference_texts: referenceTexts.length > 0 ? referenceTexts : undefined,
    });
    setIsTuneModalVisible(false);
  }, [selectedNetwork, selectedGoal, selectedTargetAudience, selectedTone, selectedLanguage, selectedPostType, selectedBrandPersona, referenceTexts, socialPostStore]);

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

        <View style={styles.actionsModalContainer} pointerEvents="box-none">
          <View style={styles.actionsModalContent} pointerEvents="box-none">
            <View style={[styles.sheetBackground, styles.actionsModalSheet]} pointerEvents="box-none">
              <View style={styles.sheetContent} pointerEvents="auto">
                <View style={styles.sheetButtons}>
                  {quickActions.map(({ label, icon }) => {
                    const isFixes = label === 'Fixes';
                    const issuesCount = isFixes ? issues.length : 0;
                    
                    return (
                      <View key={label} style={styles.quickActionWrapper}>
                        <TouchableOpacity
                          style={styles.quickAction}
                          activeOpacity={0.6}
                          onPress={() => {
                            if (label === 'Fixes') {
                              handleFixesPress();
                            } else if (label === 'Versions') {
                              handleHistoryPress();
                            } else if (label === 'Tune') {
                              handleTunePress();
                            }
                          }}>
                          <View style={styles.quickActionIcon}>
                            <Feather name={icon} size={16} color="#0F172A" />
                          </View>
                          <ThemedText style={styles.quickActionLabel}>{label}</ThemedText>
                        </TouchableOpacity>
                        {isFixes && issuesCount > 0 && (
                          <View style={styles.badge}>
                            <ThemedText style={styles.badgeText}>{issuesCount}</ThemedText>
                          </View>
                        )}
                      </View>
                    );
                  })}

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
              </View>
            </View>
          </View>
        </View>

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
          onDeleteVersion={(versionId) => socialPostStore.removePostVersion(versionId)}
        />

        <TuneModal
          visible={isTuneModalVisible}
          selectedPlatform={selectedNetwork}
          selectedGoal={selectedGoal}
          selectedTargetAudience={selectedTargetAudience}
          selectedTone={selectedTone}
          selectedLanguage={selectedLanguage}
          selectedPostType={selectedPostType}
          selectedBrandPersona={selectedBrandPersona}
          referenceTexts={referenceTexts}
          referenceTextInput={referenceTextInput}
          onClose={handleCloseTune}
          onSelectPlatform={handleSelectPlatform}
          onSelectGoal={handleSelectGoal}
          onSelectTargetAudience={handleSelectTargetAudience}
          onSelectTone={handleSelectTone}
          onSelectLanguage={handleSelectLanguage}
          onSelectPostType={handleSelectPostType}
          onSelectBrandPersona={handleSelectBrandPersona}
          onReferenceTextInputChange={setReferenceTextInput}
          onAddReferenceText={handleAddReferenceText}
          onRemoveReferenceText={handleRemoveReferenceText}
          onApply={handleApplyTune}
        />

        <LoadingOverlay visible={isAnalyzing || socialPostStore.isApplyingChanges} />
      </View>
    </SafeAreaView>
  );
}

export default observer(NewScreen);


