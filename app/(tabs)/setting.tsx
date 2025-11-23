import { useState } from 'react';
import { StyleSheet, Switch } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type Toggle = {
  key: string;
  label: string;
  description: string;
};

const toggles: Toggle[] = [
  {
    key: 'notifications',
    label: 'Push notifications',
    description: 'Напоминать о новых проверках и дедлайнах.',
  },
  {
    key: 'autoSave',
    label: 'Auto save to drafts',
    description: 'Сохранять черновики на устройстве через AsyncStorage.',
  },
  {
    key: 'appCheck',
    label: 'Firebase App Check',
    description: 'Включить защиту запросов перед продакшеном.',
  },
];

export default function SettingScreen() {
  const [state, setState] = useState<Record<string, boolean>>({
    notifications: true,
    autoSave: true,
    appCheck: false,
  });

  const toggle = (key: string) =>
    setState((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Settings</ThemedText>
      <ThemedText style={styles.subtitle}>
        Здесь появятся реальные флаги фич, интеграция с Firebase Remote Config и разрешениями.
      </ThemedText>

      <ThemedView style={styles.block}>
        {toggles.map((item) => (
          <ThemedView key={item.key} style={styles.row}>
            <ThemedView style={styles.rowText}>
              <ThemedText type="defaultSemiBold">{item.label}</ThemedText>
              <ThemedText style={styles.description}>{item.description}</ThemedText>
            </ThemedView>
            <Switch value={state[item.key]} onValueChange={() => toggle(item.key)} />
          </ThemedView>
        ))}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 12,
  },
  subtitle: {
    opacity: 0.7,
  },
  block: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    padding: 16,
    gap: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  rowText: {
    flex: 1,
    gap: 4,
  },
  description: {
    opacity: 0.7,
    lineHeight: 18,
  },
});

