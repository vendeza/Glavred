import { Modal, Platform, Pressable, View, FlatList } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { styles } from '@/app/(tabs)/new/styles';

type PostVersion = {
  id: string;
  label: string;
  content: string;
};

type HistoryModalProps = {
  visible: boolean;
  versions: PostVersion[];
  onClose: () => void;
};

export function HistoryModal({ visible, versions, onClose }: HistoryModalProps) {
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

