import { Feather } from '@expo/vector-icons';
import { Modal, Platform, Pressable, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { styles } from '@/components/new/styles';

type ReferencesModalProps = {
  visible: boolean;
  referenceText: string;
  onClose: () => void;
  onReferenceTextChange: (text: string) => void;
  onAddReference: () => void;
  onApply: () => void;
};

export function ReferencesModal({
  visible,
  referenceText,
  onClose,
  onReferenceTextChange,
  onAddReference,
  onApply,
}: ReferencesModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      presentationStyle="overFullScreen">
      <View style={[styles.modalOverlay, Platform.OS === 'web' && styles.modalOverlayWeb]}>
        <Pressable style={styles.modalBackdrop} onPress={onClose} />
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
              onChangeText={onReferenceTextChange}
              multiline
            />
            <Pressable style={styles.addReferenceButton} onPress={onAddReference}>
              <ThemedText style={styles.addReferenceButtonText}>Add</ThemedText>
            </Pressable>
          </View>

          <View style={styles.referencesButtons}>
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

