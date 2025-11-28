import { Feather, FontAwesome6 } from '@expo/vector-icons';
import Clipboard from '@react-native-clipboard/clipboard';
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import {
  NativeSyntheticEvent,
  Pressable,
  TextInput,
  TextInputContentSizeChangeEventData,
  View
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
const engagementStats = [
  { icon: 'message-circle', value: '4' },
  { icon: 'repeat', value: '2' },
  { icon: 'heart', value: '14' },
  { icon: 'bar-chart-2', value: '313' },
] as const;

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

  const handleCopy = useCallback(() => {
    if (post.trim()) {
      Clipboard.setString(post);
    }
  }, [post]);

  if (selectedNetwork === 'x' || selectedNetwork === 'threads' || selectedNetwork === 'doc') {
    const isThreads = selectedNetwork === 'threads';
    const isDoc = selectedNetwork === 'doc';

    return (
      <View style={[styles.card, styles.xCard, styles.fullHeightCard]}>
        {!isDoc && <View style={styles.xAvatar} />}

        <View style={styles.xContent}>
          {!isDoc && (
            <View style={styles.xHeader}>
              <View style={styles.xHeaderText}>
                <ThemedText style={styles.xUserName}>User Name</ThemedText>
                {!isThreads && (
                  <ThemedText style={styles.xUserMeta}>@user_name · 1 d.</ThemedText>
                )}
              </View>

              {!isThreads && <FontAwesome6 name="x-twitter" size={18} color="#0F1419" />}
            </View>
          )}

          <TextInput
            multiline
            value={post}
            onChangeText={onChangePost}
            textAlignVertical="top"
            placeholder={isDoc ? 'Вставьте текст или заметку…' : "Share what's new…"}
            placeholderTextColor={isDoc ? '#A3A6AF' : '#9AA0A6'}
            numberOfLines={40}
            scrollEnabled={false}
            //onContentSizeChange={handleContentSizeChange}
            style={[
              styles.editor,
              styles.xEditor,
              // { height: computedEditorHeight },
               { outline: 'none' },
            ]}
            showSoftInputOnFocus
            blurOnSubmit={false}
          />

          {!isDoc && (
            <View style={styles.xFooter}>
              <View style={isThreads ? styles.threadsEngagementRow : styles.xEngagementRow}>
                {engagementStats.map(({ icon, value }) => (
                  <View
                    key={icon}
                    style={isThreads ? styles.threadsEngagementItem : styles.xEngagementItem}>
                    <Feather name={icon} size={15} color="#6B7280" />
                    <ThemedText style={styles.xEngagementValue}>{value}</ThemedText>
                  </View>
                ))}
              </View>
            </View>
          )}
          <View style={styles.postDivider} />
          <Pressable
            onPress={handleCopy}
            style={styles.copyButton}
            disabled={!post.trim()}>
            <Feather name="copy" size={16} color={post.trim() ? '#111827' : '#9CA3AF'} />
            <ThemedText
              style={[
                styles.copyButtonText,
                !post.trim() && { color: '#9CA3AF' },
              ]}>
              Copy
            </ThemedText>
          </Pressable>
        </View>
      </View>
    );
  }

  return null;
}

