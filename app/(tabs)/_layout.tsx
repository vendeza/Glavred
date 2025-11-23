import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Text } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';

export default function TabLayout() {
  const tint = Colors.light.tint;
  const isWeb = Platform.OS === 'web';
  const labelStyle = {
    fontSize: isWeb ? 14 : 12,  
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
        tabBarInactiveTintColor: '#8A8A8E',
        tabBarStyle: {
          height: 60
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
