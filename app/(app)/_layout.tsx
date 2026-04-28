import React from 'react';
import { Stack } from 'expo-router';
import { theme } from '@/config/Theme';

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Esconde os cabeçalhos feios nativos
        contentStyle: { backgroundColor: theme.colors.background.primary },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="history" />
      <Stack.Screen name="simulations" />
      <Stack.Screen name="goals" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="change-password" />
    </Stack>
  );
}