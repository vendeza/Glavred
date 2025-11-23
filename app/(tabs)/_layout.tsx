import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Text } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const tint = Colors[colorScheme ?? 'light'].tint;
  const isWeb = Platform.OS === 'web';
  const labelStyle = {
    fontSize: isWeb ? 14 : 12,
    lineHeight: isWeb ? 18 : 16,
    marginTop: isWeb ? 6 : 2,
    textAlign: 'center' as const,
  };
  const getTabBarLabel =
    (title: string) =>
    ({ color }: { color: string }) =>
      <Text style={[labelStyle, { color }]}>{title}</Text>;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: tint,
        tabBarInactiveTintColor: colorScheme === 'dark' ? '#8E8E93' : '#8A8A8E',
        tabBarStyle: {
          height: isWeb ? 84 : 64,
          paddingBottom: isWeb ? 28 : 12,
          paddingTop: isWeb ? 12 : 8,
          backgroundColor: '#fff',
          borderTopWidth: 0,
        },
        tabBarItemStyle: {
          paddingBottom: isWeb ? 6 : 0,
        },
        tabBarLabelStyle: {
          paddingBottom: isWeb ? 4 : 0,
        },
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen name="index" options={{ href: null }} />

      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarLabel: getTabBarLabel('History'),
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="clock.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="new/index"
        options={{
          title: 'New',
          tabBarLabel: getTabBarLabel('New'),
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="square.and.pencil" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          title: 'Setting',
          tabBarLabel: getTabBarLabel('Setting'),
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="gear" color={color} />,
        }}
      />
    </Tabs>
  );
}
