import { Feather } from '@expo/vector-icons';
import Clipboard from '@react-native-clipboard/clipboard';
import { FlatList, Modal, Platform, Pressable, View } from 'react-native';

import { styles } from '@/components/new/styles';
import { ThemedText } from '@/components/themed-text';

type PostVersion = {
  id: string;
  label: string;
  content: string;
  timestamp?: number;
};

type HistoryModalProps = {
  visible: boolean;
  versions: PostVersion[];
  onClose: () => void;
  onDeleteVersion?: (versionId: string) => void;
};

export function HistoryModal({ visible, versions, onClose, onDeleteVersion }: HistoryModalProps) {
  const handleCopy = (content: string) => {
    Clipboard.setString(content);
  };

  const handleDelete = (versionId: string) => {
    onDeleteVersion?.(versionId);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      presentationStyle="overFullScreen">
      <View style={[styles.modalOverlay, Platform.OS === 'web' && styles.modalOverlayWeb]}>
        <Pressable style={styles.modalBackdrop} onPress={onClose} />
        <View style={[styles.historyModal, Platform.OS === 'web' && styles.historyModalWeb]}>
          

          <View style={styles.historyHeader}>
            <ThemedText style={styles.historyTitle}>Post versions</ThemedText>
            <Pressable onPress={onClose} style={styles.historyCloseButton}>
              <Feather name="x" size={24} color="#111827" />
            </Pressable>
          </View>

          <FlatList
            data={versions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.versionCard}>
                <View style={styles.versionLabel}>
                  <ThemedText style={styles.versionLabelText}>{item.label}</ThemedText>
                </View>
                <ThemedText style={styles.versionContent}>{item.content}</ThemedText>
                <View style={styles.versionButtonsRow}>
                  <Pressable
                    onPress={() => handleCopy(item.content)}
                    style={styles.versionCopyButton}>
                    <Feather name="copy" size={16} color="#111827" />
                    <ThemedText style={styles.versionCopyButtonText}>Copy</ThemedText>
                  </Pressable>
                  {onDeleteVersion && (
                    <Pressable
                      onPress={() => handleDelete(item.id)}
                      style={styles.versionDeleteButton}>
                      <Feather name="trash-2" size={16} color="#EF4444" />
                      <ThemedText style={styles.versionDeleteButtonText}>Delete</ThemedText>
                    </Pressable>
                  )}
                </View>
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
  );
}

