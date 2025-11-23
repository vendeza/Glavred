import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { RootStore, RootStoreProvider } from '@stores/RootStore';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const rootStore = useMemo(() => new RootStore(), []);

  return (
    <RootStoreProvider value={rootStore}>
      <GestureHandlerRootView style={styles.root}>
        <BottomSheetModalProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <View style={styles.shell}>
              <View style={[styles.content, Platform.OS === 'web' && styles.contentWeb]}>
                <Stack>
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
                </Stack>
              </View>
            </View>
            <StatusBar style="auto" />
          </ThemeProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </RootStoreProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f2f2f7',
  },
  shell: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
  },
  contentWeb: {
    maxWidth: 800,
    width: '100%',
  },
});
