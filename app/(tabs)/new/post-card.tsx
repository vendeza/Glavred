import { Feather, FontAwesome6 } from '@expo/vector-icons';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import {
    NativeSyntheticEvent,
    TextInput,
    TextInputContentSizeChangeEventData,
    View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';

import { styles } from './styles';

type PostCardProps = {
  post: string;
  onChangePost: Dispatch<SetStateAction<string>>;
  selectedNetwork: string;
};

const MIN_EDITOR_HEIGHT = 220;

const useAutoGrowingHeight = () => {
  const [editorHeight, setEditorHeight] = useState(MIN_EDITOR_HEIGHT);

  const handleContentSizeChange = useCallback(
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

  return {
    computedEditorHeight: Math.max(editorHeight, MIN_EDITOR_HEIGHT),
    handleContentSizeChange,
  };
};

export function PostCard({ post, onChangePost, selectedNetwork }: PostCardProps) {
  const { computedEditorHeight, handleContentSizeChange } = useAutoGrowingHeight();

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
            onChangeText={onChangePost}
            textAlignVertical="top"
            placeholder="Share what’s new…"
            placeholderTextColor="#9AA0A6"
            scrollEnabled={false}
            onContentSizeChange={handleContentSizeChange}
            style={[styles.editor, styles.xEditor, { minHeight: computedEditorHeight }]}
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
        onChangeText={onChangePost}
        textAlignVertical="top"
        placeholder="Вставьте текст или заметку…"
        placeholderTextColor="#A3A6AF"
        scrollEnabled={false}
        onContentSizeChange={handleContentSizeChange}
        style={[styles.editor, { minHeight: computedEditorHeight }]}
      />
    </View>
  );
}

