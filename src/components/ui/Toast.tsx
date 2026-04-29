/**
 * Toast notification animado com auto-hide.
 * Animações paralelas de opacity/translateY.
 * Cleanup em unmount para evitar memory leaks.
 */

import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Typography } from "./Typography";
import { theme } from "@/config/Theme";

interface ToastProps {
  /** Visibilidade do toast */
  visible: boolean;
  /** Mensagem a exibir */
  message: string;
  /** Callback ao esconder */
  onHide: () => void;
}

export function Toast({ visible, message, onHide }: ToastProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    if (!visible) return;

    // Flag para evitar setState em unmount
    let isMounted = true;

    const entryAnimation = Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        speed: 12,
        useNativeDriver: true,
      }),
    ]);
    entryAnimation.start();

    const timer = setTimeout(() => {
      const exitAnimation = Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -20,
          duration: 300,
          useNativeDriver: true,
        }),
      ]);
      exitAnimation.start(() => {
        if (isMounted) onHide();
      });
    }, 2500);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      entryAnimation.stop();
      // Reset para próxima instância
      opacity.setValue(0);
      translateY.setValue(-20);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[styles.container, { opacity, transform: [{ translateY }] }]}
    >
      <View style={styles.iconContainer}>
        <Feather name="check" size={16} color="#fff" />
      </View>
      <Typography variant="medium" size="sm">
        {message}
      </Typography>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 60,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
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
    backgroundColor: "#0bc53a",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
});
