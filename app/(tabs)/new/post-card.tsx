import { Feather, FontAwesome6 } from '@expo/vector-icons';
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
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

const MIN_EDITOR_HEIGHT = 50;
const LINE_HEIGHT = 24;
const MIN_EDITOR_LINES = Math.ceil(MIN_EDITOR_HEIGHT / LINE_HEIGHT);

const useAutoGrowingHeight = (value: string) => {
  const [editorHeight, setEditorHeight] = useState(MIN_EDITOR_HEIGHT);
  const [lineCount, setLineCount] = useState(MIN_EDITOR_LINES);

  const handleContentSizeChange = useCallback(
    (event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
      const measuredHeight = Math.max(event.nativeEvent.contentSize.height, MIN_EDITOR_HEIGHT);
      const measuredLines = Math.max(Math.round(measuredHeight / LINE_HEIGHT), MIN_EDITOR_LINES);

      setEditorHeight(prev => {
        if (Math.abs(prev - measuredHeight) < 1) {
          return prev;
        }
        return measuredHeight;
      });
      setLineCount(prev => Math.max(prev, measuredLines));
    },
    [],
  );

  useEffect(() => {
    if (value.length === 0) {
      setEditorHeight(MIN_EDITOR_HEIGHT);
      setLineCount(MIN_EDITOR_LINES);
      return;
    }

    const explicitLines = Math.max(value.split('\n').length || 1, MIN_EDITOR_LINES);
    setLineCount(prev => {
      if (explicitLines < prev) {
        setEditorHeight(Math.max(explicitLines * LINE_HEIGHT, MIN_EDITOR_HEIGHT));
        return explicitLines;
      }
      return prev;
    });
  }, [value]);

  return {
    computedEditorHeight: Math.max(editorHeight, MIN_EDITOR_HEIGHT),
    lineCount,
    handleContentSizeChange,
  };
};

export function PostCard({ post, onChangePost, selectedNetwork }: PostCardProps) {
  const { computedEditorHeight, lineCount, handleContentSizeChange } = useAutoGrowingHeight(post);

  if (selectedNetwork === 'x') {
    return (
      <>
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
              numberOfLines={lineCount}
              scrollEnabled={false}
              onContentSizeChange={handleContentSizeChange}
              style={[styles.editor, styles.xEditor, { height: computedEditorHeight }]}
            />
            <View style={styles.xFooter}>
              <View style={styles.xEngagementRow}>
                <View style={styles.xEngagementItem}>
                  <Feather name="message-circle" size={15} color="#6B7280" />
                  <ThemedText style={styles.xEngagementValue}>4</ThemedText>
                </View>

                <View style={styles.xEngagementItem}>
                  <Feather name="repeat" size={15} color="#6B7280" />
                  <ThemedText style={styles.xEngagementValue}>2</ThemedText>
                </View>

                <View style={styles.xEngagementItem}>
                  <Feather name="heart" size={15} color="#6B7280" />
                  <ThemedText style={styles.xEngagementValue}>14</ThemedText>
                </View>

                <View style={styles.xEngagementItem}>
                  <Feather name="bar-chart-2" size={15} color="#6B7280" />
                  <ThemedText style={styles.xEngagementValue}>313</ThemedText>
                </View>
              </View>
            </View>
        
          </View> 
        </View>
  
      </>
    );
  }

  return (
    <>
      <View style={[styles.card, styles.fullHeightCard]}>
      <ThemedText style={styles.cardMeta}>Последнее обновление · 2 минуты назад</ThemedText>

      <TextInput
        multiline
        value={post}
        onChangeText={onChangePost}
        textAlignVertical="top"
        placeholder="Вставьте текст или заметку…"
        placeholderTextColor="#A3A6AF"
        numberOfLines={lineCount}
        scrollEnabled={false}
        onContentSizeChange={handleContentSizeChange}
        style={[styles.editor, { height: computedEditorHeight }]}
      />
    </View>
    </>
  );
}

