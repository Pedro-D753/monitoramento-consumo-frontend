/**
 * Header principal com user info, tip do dia e nav profile.
 * Fetch tip on mount com fallback.
 */

import React, { useEffect, useState } from "react";
import { getTip } from "@/modules/tips/services/TipService";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Typography } from "@/components/ui/Typography";
import { theme } from "@/config/Theme";
import { useRouter } from "expo-router";

interface HeaderProps {
  /** Nome usuário display */
  userName?: string;
}

export function Header({ userName = "Usuário" }: HeaderProps) {
  const router = useRouter();
  const [tip, setTip] = useState("Continue se esforçando para economizar!");

  useEffect(() => {
    getTip("kwh")
      .then((data) => setTip(data.tip))
      .catch(() => {}); // Fallback state já set
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Feather name="user" size={24} color={theme.colors.text.primary} />
          </View>

          <View>
            <Typography
              variant="regular"
              size="sm"
              color={theme.colors.text.secondary}
            >
              Bem-vindo de volta,
            </Typography>
            <Typography
              variant="bold"
              size="lg"
              color={theme.colors.text.primary}
            >
              {userName}
            </Typography>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.actionButton}
          onPress={() => router.push("/(app)/profile")}
        >
          <Feather
            name="settings"
            size={20}
            color={theme.colors.text.primary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.tips}>
        <Typography variant="bold" size="md">
          Dica do dia:
        </Typography>
        <Typography variant="regular" size="sm" style={styles.tipText}>
          {tip}
        </Typography>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card.infoCard,
    borderRadius: theme.borderRadius.lg,
    width: "90%",
    gap: theme.spacing.lg,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.card.subCard,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.primary.main,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.tools,
    justifyContent: "center",
    alignItems: "center",
  },
  tips: {
    backgroundColor: theme.colors.tools,
    borderRadius: theme.borderRadius.xl,
    alignItems: "flex-start",
    width: "100%",
    padding: theme.spacing.md,
  },
  tipText: {
    marginTop: theme.spacing.xs,
    lineHeight: 20,
  },
});
