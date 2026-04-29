/**
 * Tabs selector pílula para views (history/simulations/goals).
 * Active state background.
 */

import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Typography } from "./Typography";
import { theme } from "@/config/Theme";

export type ViewType = "history" | "simulations" | "goals";

interface ViewSelectorProps {
  /** View ativa */
  activeView: ViewType;
  /** Callback select */
  onSelect: (view: ViewType) => void;
}

export function ViewSelector({ activeView, onSelect }: ViewSelectorProps) {
  const views: { id: ViewType; label: string }[] = [
    { id: "history", label: "Consumos" },
    { id: "simulations", label: "Simulações" },
    { id: "goals", label: "Metas" },
  ];

  return (
    <View style={styles.container}>
      {views.map((view) => {
        const isActive = activeView === view.id;
        return (
          <TouchableOpacity
            key={view.id}
            style={[styles.tab, isActive && styles.activeTab]}
            onPress={() => onSelect(view.id)}
            activeOpacity={0.8}
          >
            <Typography
              variant={isActive ? "bold" : "medium"}
              size="sm"
              color={isActive ? "#ffffff" : theme.colors.text.secondary}
            >
              {view.label}
            </Typography>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: theme.colors.card.subCard,
    borderRadius: 24,
    padding: 4,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: theme.colors.primary.main,
  },
});
