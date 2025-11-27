import { Feather } from '@expo/vector-icons';
import { Modal, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { styles } from '@/components/new/styles';
import { ThemedText } from '@/components/themed-text';
import { ScoreBlock } from '@services/SocialPostService';

type ScoreModalProps = {
  visible: boolean;
  scores?: ScoreBlock;
  onClose: () => void;
};

export function ScoreModal({ visible, scores, onClose }: ScoreModalProps) {
  if (!scores) {
    return null;
  }

  const scoreItems = [
    { label: 'Total', value: scores.total, key: 'total' },
    { label: 'Hook', value: scores.hook, key: 'hook' },
    { label: 'Clarity', value: scores.clarity, key: 'clarity' },
    { label: 'Emotional Charge', value: scores.emotional_charge, key: 'emotional_charge' },
    { label: 'Opinion Edge', value: scores.opinion_edge, key: 'opinion_edge' },
    { label: 'Shareability', value: scores.shareability, key: 'shareability' },
    { label: 'Value', value: scores.value, key: 'value' },
    { label: 'Identity Match', value: scores.identity_match, key: 'identity_match' },
    { label: 'CTA Strength', value: scores.cta_strength, key: 'cta_strength' },
    { label: 'Readability', value: scores.readability, key: 'readability' },
    { label: 'Uniqueness', value: scores.uniqueness, key: 'uniqueness' },
  ];

  const getScoreColor = (score: number) => {
    // Score values are already in 0-100 range
    const percentage = Math.min(100, Math.max(0, score));
    if (percentage >= 80) return '#22c55e'; // green
    if (percentage >= 60) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      presentationStyle="overFullScreen">
      <View style={[styles.modalOverlay, Platform.OS === 'web' && styles.modalOverlayWeb]}>
        <Pressable style={styles.modalBackdrop} onPress={onClose} />
        <View style={[scoreModalStyles.scoreModal, Platform.OS === 'web' && scoreModalStyles.scoreModalWeb]}>
          <View style={scoreModalStyles.scoreHeader}>
            <ThemedText style={scoreModalStyles.scoreTitle}>Score</ThemedText>
            <Pressable onPress={onClose} style={scoreModalStyles.scoreCloseButton}>
              <Feather name="x" size={24} color="#111827" />
            </Pressable>
          </View>

          <ScrollView
            style={scoreModalStyles.scoreContent}
            contentContainerStyle={scoreModalStyles.scoreContentContainer}
            showsVerticalScrollIndicator>
            {scoreItems.map((item) => (
              <View key={item.key} style={scoreModalStyles.scoreItem}>
                <View style={scoreModalStyles.scoreItemHeader}>
                  <ThemedText style={scoreModalStyles.scoreItemLabel}>{item.label}</ThemedText>
                  <View style={[scoreModalStyles.scoreBadge, { backgroundColor: getScoreColor(item.value) }]}>
                    <ThemedText style={scoreModalStyles.scoreBadgeText}>{item.value.toFixed(1)}</ThemedText>
                  </View>
                </View>
                <View style={scoreModalStyles.scoreBarContainer}>
                  <View
                    style={[
                      scoreModalStyles.scoreBar,
                      { 
                        width: `${Math.min(100, Math.max(0, item.value))}%`, 
                        backgroundColor: getScoreColor(item.value) 
                      },
                    ]}
                  />
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const scoreModalStyles = StyleSheet.create({
  scoreModal: {
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
  scoreModalWeb: {
    maxWidth: 800,
    width: '100%',
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  scoreTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
  },
  scoreCloseButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  scoreContent: {
    flex: 1,
  },
  scoreContentContainer: {
    gap: 16,
    paddingBottom: 20,
  },
  scoreItem: {
    gap: 8,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  scoreItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreItemLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  scoreBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 50,
    alignItems: 'center',
  },
  scoreBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  scoreBarContainer: {
    height: 8,
    backgroundColor: '#D1D5DB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  scoreBar: {
    height: '100%',
    borderRadius: 4,
  },
});

