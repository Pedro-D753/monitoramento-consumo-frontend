import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Typography } from './Typography';
import { theme } from '@/config/Theme';

interface ToastProps {
  visible: boolean;
  message: string;
  onHide: () => void;
}

export function Toast({ visible, message, onHide }: ToastProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    if (visible) {
      // Animação de entrada fluida (Fade + Slide)
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(translateY, { toValue: 0, speed: 12, useNativeDriver: true })
      ]).start();

      // Tempo na tela (2.5 segundos) e animação de saída
      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.timing(translateY, { toValue: -20, duration: 300, useNativeDriver: true })
        ]).start(() => onHide());
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { opacity, transform: [{ translateY }] }]}>
      <View style={styles.iconContainer}>
        <Feather name="check" size={16} color="#fff" />
      </View>
      <Typography variant="medium" size="sm">{message}</Typography>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60, // Logo abaixo do Header
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 30,
    elevation: 6,
    zIndex: 9999,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  iconContainer: {
    backgroundColor: '#0bc53a', // Verde Sucesso
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  }
});