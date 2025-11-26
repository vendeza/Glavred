import { Feather } from '@expo/vector-icons';
import { Modal, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { styles } from '@/components/new/styles';
import { ThemedText } from '@/components/themed-text';

type PlatformOption = {
  id: string;
  label: string;
  icon: string;
};

type GoalOption = {
  id: string;
  label: string;
};

type Option = {
  id: string;
  label: string;
};

type BrandPersonaOption = {
  id: string;
  label: string;
  value: string;
  description: string;
};

type TuneModalProps = {
  visible: boolean;
  selectedPlatform: string;
  selectedGoal: string;
  selectedTargetAudience?: string;
  selectedTone?: string;
  selectedLanguage?: string;
  selectedPostType?: string;
  selectedBrandPersona?: string;
  referenceTexts: string[];
  referenceTextInput: string;
  onClose: () => void;
  onSelectPlatform: (platformId: string) => void;
  onSelectGoal: (goalId: string) => void;
  onSelectTargetAudience: (value: string) => void;
  onSelectTone: (value: string) => void;
  onSelectLanguage: (value: string) => void;
  onSelectPostType: (value: string) => void;
  onSelectBrandPersona: (value: string) => void;
  onReferenceTextInputChange: (text: string) => void;
  onAddReferenceText: () => void;
  onRemoveReferenceText: (index: number) => void;
  onApply: () => void;
};

const platforms: PlatformOption[] = [
  { id: 'x', label: 'X', icon: 'x' },
  { id: 'threads', label: 'Threads', icon: 'threads' },
  { id: 'linkedin', label: 'LinkedIn', icon: 'linkedin' },
  { id: 'instagram', label: 'Instagram', icon: 'instagram' },
];

const goals: GoalOption[] = [
  { id: 'neutral', label: 'Neutral' },
  { id: 'comments', label: 'Comments' },
  { id: 'reposts', label: 'Reposts' },
  { id: 'subscribes', label: 'Subscribes' },
  { id: 'likes', label: 'Likes' },
];

const targetAudiences: Option[] = [
  { id: 'general', label: 'General' },
  { id: 'tech', label: 'Tech' },
  { id: 'business', label: 'Business' },
  { id: 'creatives', label: 'Creatives' },
];

const tones: Option[] = [
  { id: 'professional', label: 'Professional' },
  { id: 'casual', label: 'Casual' },
  { id: 'friendly', label: 'Friendly' },
  { id: 'authoritative', label: 'Authoritative' },
];

const languages: Option[] = [
  { id: 'en', label: 'English' },
  { id: 'ru', label: 'Russian' },
  { id: 'es', label: 'Spanish' },
  { id: 'fr', label: 'French' },
];

const postTypes: Option[] = [
  { id: 'post', label: 'Post' },
  { id: 'thread', label: 'Thread' },
  { id: 'story', label: 'Story' },
  { id: 'reel', label: 'Reel' },
];

const brandPersonas: BrandPersonaOption[] = [
  {
    id: 'none',
    label: 'None',
    value: '',
    description: 'без указания какого-либо человека',
  },
  {
    id: 'naval',
    label: 'Naval',
    value: '@naval',
    description: 'афористичность, философия, покой, лаконичность, краткие истины',
  },
  {
    id: 'sam_altman',
    label: 'Sam Altman',
    value: '@sama',
    description: 'стратегические мысли, спокойный рациональный тон',
  },
  {
    id: 'levelsio',
    label: 'Levelsio',
    value: '@levelsio',
    description: 'короткие резкие фразы, юмор, практичность, DIY подход',
  },
];

export function TuneModal({
  visible,
  selectedPlatform,
  selectedGoal,
  selectedTargetAudience,
  selectedTone,
  selectedLanguage,
  selectedPostType,
  selectedBrandPersona,
  referenceTexts,
  referenceTextInput,
  onClose,
  onSelectPlatform,
  onSelectGoal,
  onSelectTargetAudience,
  onSelectTone,
  onSelectLanguage,
  onSelectPostType,
  onSelectBrandPersona,
  onReferenceTextInputChange,
  onAddReferenceText,
  onRemoveReferenceText,
  onApply,
}: TuneModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      presentationStyle="overFullScreen">
      <View style={[styles.modalOverlay, Platform.OS === 'web' && styles.modalOverlayWeb]}>
        <Pressable style={styles.modalBackdrop} onPress={onClose} />
        <View style={[tuneModalStyles.tuneModal, Platform.OS === 'web' && tuneModalStyles.tuneModalWeb]}>

          <View style={tuneModalStyles.tuneHeader}>
            <ThemedText style={tuneModalStyles.tuneTitle}>Tune</ThemedText>
            <Pressable onPress={onClose} style={tuneModalStyles.tuneCloseButton}>
              <Feather name="x" size={24} color="#111827" />
            </Pressable>
          </View>

          <ScrollView
            style={tuneModalStyles.tuneContent}
            contentContainerStyle={tuneModalStyles.tuneContentContainer}
            showsVerticalScrollIndicator>
            {/* Brand Persona Section */}
            <View style={tuneModalStyles.section}>
              <ThemedText style={tuneModalStyles.sectionTitle}>Brand persona from X</ThemedText>
              <View style={tuneModalStyles.brandPersonaOptionsContainer}>
                {brandPersonas.map((persona) => (
                  <Pressable
                    key={persona.id}
                    style={[
                      tuneModalStyles.brandPersonaButton,
                      selectedBrandPersona === persona.id && tuneModalStyles.optionButtonSelected,
                    ]}
                    onPress={() => onSelectBrandPersona(persona.id)}>
                    <ThemedText
                      style={[
                        tuneModalStyles.optionButtonText,
                        selectedBrandPersona === persona.id && tuneModalStyles.optionButtonTextSelected,
                      ]}>
                      {persona.label}
                    </ThemedText>
                    {persona.description && (
                      <ThemedText
                        style={[
                          tuneModalStyles.brandPersonaDescription,
                          selectedBrandPersona === persona.id && tuneModalStyles.brandPersonaDescriptionSelected,
                        ]}>
                        {persona.description}
                      </ThemedText>
                    )}
                  </Pressable>
                ))}
              </View>
            </View>

            {/* References Texts Section */}
            <View style={tuneModalStyles.section}>
              <ThemedText style={tuneModalStyles.sectionTitle}>References texts</ThemedText>
              {referenceTexts.length > 0 && (
                <View style={tuneModalStyles.referenceList}>
                  {referenceTexts.map((text, index) => (
                    <View key={index} style={tuneModalStyles.referenceItem}>
                      <ThemedText style={tuneModalStyles.referenceItemText} numberOfLines={1}>
                        {text.length > 30 ? `${text.substring(0, 30)}...` : text}
                      </ThemedText>
                      <Pressable
                        style={tuneModalStyles.referenceRemoveButton}
                        onPress={() => onRemoveReferenceText(index)}>
                        <Feather name="x" size={16} color="#EF4444" />
                      </Pressable>
                    </View>
                  ))}
                </View>
              )}
              <View style={tuneModalStyles.referenceInputContainer}>
                <TextInput
                  style={tuneModalStyles.referenceInput}
                  placeholder="Enter reference text"
                  placeholderTextColor="#9CA3AF"
                  value={referenceTextInput}
                  onChangeText={onReferenceTextInputChange}
                  multiline
                />
                <Pressable
                  style={[
                    tuneModalStyles.addReferenceButton,
                    !referenceTextInput.trim() && tuneModalStyles.addReferenceButtonDisabled,
                  ]}
                  onPress={onAddReferenceText}
                  disabled={!referenceTextInput.trim()}>
                  <ThemedText
                    style={[
                      tuneModalStyles.addReferenceButtonText,
                      !referenceTextInput.trim() && tuneModalStyles.addReferenceButtonTextDisabled,
                    ]}>
                    Add
                  </ThemedText>
                </Pressable>
              </View>
            </View>

            {/* Platform Section */}
            <View style={tuneModalStyles.section}>
              <ThemedText style={tuneModalStyles.sectionTitle}>Platform</ThemedText>
              <View style={tuneModalStyles.optionsContainer}>
                {platforms.map((platform) => (
                  <Pressable
                    key={platform.id}
                    style={[
                      tuneModalStyles.optionButton,
                      selectedPlatform === platform.id && tuneModalStyles.optionButtonSelected,
                    ]}
                    onPress={() => onSelectPlatform(platform.id)}>
                    <ThemedText
                      style={[
                        tuneModalStyles.optionButtonText,
                        selectedPlatform === platform.id && tuneModalStyles.optionButtonTextSelected,
                      ]}>
                      {platform.label}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Goal Section */}
            <View style={tuneModalStyles.section}>
              <ThemedText style={tuneModalStyles.sectionTitle}>Goal</ThemedText>
              <View style={tuneModalStyles.optionsContainer}>
                {goals.map((goal) => (
                  <Pressable
                    key={goal.id}
                    style={[
                      tuneModalStyles.optionButton,
                      selectedGoal === goal.id && tuneModalStyles.optionButtonSelected,
                    ]}
                    onPress={() => onSelectGoal(goal.id)}>
                    <ThemedText
                      style={[
                        tuneModalStyles.optionButtonText,
                        selectedGoal === goal.id && tuneModalStyles.optionButtonTextSelected,
                      ]}>
                      {goal.label}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Target Audience Section */}
            <View style={tuneModalStyles.section}>
              <ThemedText style={tuneModalStyles.sectionTitle}>Target audience</ThemedText>
              <View style={tuneModalStyles.optionsContainer}>
                {targetAudiences.map((audience) => (
                  <Pressable
                    key={audience.id}
                    style={[
                      tuneModalStyles.optionButton,
                      selectedTargetAudience === audience.id && tuneModalStyles.optionButtonSelected,
                    ]}
                    onPress={() => onSelectTargetAudience(audience.id)}>
                    <ThemedText
                      style={[
                        tuneModalStyles.optionButtonText,
                        selectedTargetAudience === audience.id && tuneModalStyles.optionButtonTextSelected,
                      ]}>
                      {audience.label}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Tone Section */}
            <View style={tuneModalStyles.section}>
              <ThemedText style={tuneModalStyles.sectionTitle}>Tone</ThemedText>
              <View style={tuneModalStyles.optionsContainer}>
                {tones.map((tone) => (
                  <Pressable
                    key={tone.id}
                    style={[
                      tuneModalStyles.optionButton,
                      selectedTone === tone.id && tuneModalStyles.optionButtonSelected,
                    ]}
                    onPress={() => onSelectTone(tone.id)}>
                    <ThemedText
                      style={[
                        tuneModalStyles.optionButtonText,
                        selectedTone === tone.id && tuneModalStyles.optionButtonTextSelected,
                      ]}>
                      {tone.label}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Language Section */}
            {/* <View style={tuneModalStyles.section}>
              <ThemedText style={tuneModalStyles.sectionTitle}>Language</ThemedText>
              <View style={tuneModalStyles.optionsContainer}>
                {languages.map((language) => (
                  <Pressable
                    key={language.id}
                    style={[
                      tuneModalStyles.optionButton,
                      selectedLanguage === language.id && tuneModalStyles.optionButtonSelected,
                    ]}
                    onPress={() => onSelectLanguage(language.id)}>
                    <ThemedText
                      style={[
                        tuneModalStyles.optionButtonText,
                        selectedLanguage === language.id && tuneModalStyles.optionButtonTextSelected,
                      ]}>
                      {language.label}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            </View> */}

            {/* Post Type Section */}
            {/* <View style={tuneModalStyles.section}>
              <ThemedText style={tuneModalStyles.sectionTitle}>Post type</ThemedText>
              <View style={tuneModalStyles.optionsContainer}>
                {postTypes.map((postType) => (
                  <Pressable
                    key={postType.id}
                    style={[
                      tuneModalStyles.optionButton,
                      selectedPostType === postType.id && tuneModalStyles.optionButtonSelected,
                    ]}
                    onPress={() => onSelectPostType(postType.id)}>
                    <ThemedText
                      style={[
                        tuneModalStyles.optionButtonText,
                        selectedPostType === postType.id && tuneModalStyles.optionButtonTextSelected,
                      ]}>
                      {postType.label}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            </View> */}

          </ScrollView>

          <View style={tuneModalStyles.tuneButtons}>
            <Pressable style={styles.cancelButton} onPress={onClose}>
              <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
            </Pressable>
            <Pressable style={styles.applyButton} onPress={onApply}>
              <ThemedText style={styles.applyButtonText}>Apply</ThemedText>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const tuneModalStyles = StyleSheet.create({
  tuneModal: {
    height: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 12,
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 18,
    flexDirection: 'column',
  },
  tuneModalWeb: {
    maxWidth: 800,
    width: '100%',
  },
  tuneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  tuneTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
  },
  tuneCloseButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  tuneContent: {
    flex: 1,
  },
  tuneContentContainer: {
    gap: 24,
    paddingBottom: 20,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  brandPersonaOptionsContainer: {
    flexDirection: 'column',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 13,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  optionButtonSelected: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  optionButtonText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#6B7280',
  },
  optionButtonTextSelected: {
    color: '#fff',
  },
  brandPersonaButton: {
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderRadius: 13,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'flex-start',
    gap: 4,
    width: '100%',
  },
  brandPersonaDescription: {
    fontSize: 10,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  brandPersonaDescriptionSelected: {
    color: '#D1D5DB',
  },
  referenceInputContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-end',
  },
  referenceInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    fontSize: 11,
    color: '#111827',
    textAlignVertical: 'top',
  },
  addReferenceButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#111827',
  },
  addReferenceButtonDisabled: {
    backgroundColor: '#9CA3AF',
    opacity: 0.6,
  },
  addReferenceButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  addReferenceButtonTextDisabled: {
    color: '#D1D5DB',
  },
  referenceList: {
    marginTop: 8,
    gap: 8,
  },
  referenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  referenceItemText: {
    flex: 1,
    fontSize: 11,
    color: '#111827',
  },
  referenceRemoveButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  tuneButtons: {
    flexDirection: 'row',
    gap: 6,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
});

