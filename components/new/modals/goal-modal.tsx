import { Modal, Platform, Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { styles } from '@/app/(tabs)/new/styles';

type PostGoal = {
  id: string;
  label: string;
};

type GoalModalProps = {
  visible: boolean;
  goals: PostGoal[];
  selectedGoal: string;
  onClose: () => void;
  onSelectGoal: (goalId: string) => void;
};

export function GoalModal({
  visible,
  goals,
  selectedGoal,
  onClose,
  onSelectGoal,
}: GoalModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      presentationStyle="overFullScreen">
      <View style={[styles.modalOverlay, Platform.OS === 'web' && styles.modalOverlayWeb]}>
        <Pressable style={styles.modalBackdrop} onPress={onClose} />
        <View style={[styles.goalModal, Platform.OS === 'web' && styles.goalModalWeb]}>
          <View style={styles.fixesModalHandle} />

          <View style={styles.goalHeader}>
            <ThemedText style={styles.goalTitle}>Post goal</ThemedText>
          </View>

          <View style={styles.goalButtonsContainer}>
            {goals.map((goal) => (
              <Pressable
                key={goal.id}
                style={[
                  styles.goalButton,
                  selectedGoal === goal.id && styles.goalButtonSelected,
                ]}
                onPress={() => onSelectGoal(goal.id)}>
                <ThemedText
                  style={[
                    styles.goalButtonText,
                    selectedGoal === goal.id && styles.goalButtonTextSelected,
                  ]}>
                  {goal.label}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

