import { Feather } from '@expo/vector-icons';
import Clipboard from '@react-native-clipboard/clipboard';
import { Modal, Platform, Pressable, View, FlatList } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { styles } from '@/components/new/styles';

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
};

export function HistoryModal({ visible, versions, onClose }: HistoryModalProps) {
  const handleCopy = (content: string) => {
    Clipboard.setString(content);
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
          <View style={styles.fixesModalHandle} />

          <View style={styles.historyHeader}>
            <ThemedText style={styles.historyTitle}>Post versions</ThemedText>
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
                <Pressable
                  onPress={() => handleCopy(item.content)}
                  style={styles.versionCopyButton}>
                  <Feather name="copy" size={16} color="#111827" />
                  <ThemedText style={styles.versionCopyButtonText}>Copy</ThemedText>
                </Pressable>
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

