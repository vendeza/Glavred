import { Feather } from '@expo/vector-icons';
import { Modal, Platform, Pressable, ScrollView, TextInput, View } from 'react-native';

import { styles } from '@/components/new/styles';
import { ThemedText } from '@/components/themed-text';

import {
  brandPersonas,
  goals,
  languages,
  modes,
  platforms,
  postTypes,
  targetAudiences,
  tones,
} from './constants';
import { tuneModalStyles } from './styles';

type TuneModalProps = {
  visible: boolean;
  selectedPlatform: string;
  selectedGoal: string;
  selectedTargetAudience?: string;
  selectedTone?: string;
  selectedLanguage: string;
  selectedPostType?: string;
  selectedBrandPersona?: string;
  selectedMode: 'basic' | 'pro';
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
  onSelectMode: (mode: 'basic' | 'pro') => void;
  onReferenceTextInputChange: (text: string) => void;
  onAddReferenceText: () => void;
  onRemoveReferenceText: (index: number) => void;
  onApply: () => void;
};

export function TuneModal({
  visible,
  selectedPlatform,
  selectedGoal,
  selectedTargetAudience,
  selectedTone,
  selectedLanguage,
  selectedPostType,
  selectedBrandPersona,
  selectedMode,
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
  onSelectMode,
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
            {/* Mode Section */}
            <View style={tuneModalStyles.section}>
              <ThemedText style={tuneModalStyles.sectionTitle}>Mode</ThemedText>
              <View style={tuneModalStyles.optionsContainer}>
                {modes.map((mode) => (
                  <Pressable
                    key={mode.id}
                    style={[
                      tuneModalStyles.optionButton,
                      selectedMode === mode.id && tuneModalStyles.optionButtonSelected,
                    ]}
                    onPress={() => onSelectMode(mode.id)}>
                    <ThemedText
                      style={[
                        tuneModalStyles.optionButtonText,
                        selectedMode === mode.id && tuneModalStyles.optionButtonTextSelected,
                      ]}>
                      {mode.label}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Language Section */}
            <View style={tuneModalStyles.section}>
              <ThemedText style={tuneModalStyles.sectionTitle}>Language</ThemedText>
              <View style={tuneModalStyles.optionsContainer}>
                {languages.map(language => (
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
                        selectedLanguage === language.id &&
                          tuneModalStyles.optionButtonTextSelected,
                      ]}>
                      {language.label}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            </View>

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
            <View style={tuneModalStyles.section}>
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
            </View>
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

