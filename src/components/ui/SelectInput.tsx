/**
 * Select dropdown com Modal + FlatList.
 * Selected highlight + check icon.
 * Overlay dismiss.
 */

import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { theme } from "@/config/Theme";
import { Typography } from "./Typography";

interface Option {
  label: string;
  value: string;
}

interface SelectInputProps {
  /** Label do select */
  label: string;
  /** Opções disponíveis */
  options: Option[];
  /** Valor selecionado atual */
  value: string;
  /** Callback seleção */
  onSelect: (value: string) => void;
  /** Erro validção */
  error?: string;
  /** Placeholder inicial */
  placeholder?: string;
}

export function SelectInput({
  label,
  options,
  value,
  onSelect,
  error,
  placeholder,
}: SelectInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (val: string) => {
    onSelect(val);
    setIsVisible(false);
  };

  return (
    <View style={styles.wrapper}>
      <Typography
        variant="regular"
        size="sm"
        color={theme.colors.text.secondary}
        style={styles.label}
      >
        {label}
      </Typography>

      <TouchableOpacity
        style={[
          styles.container,
          error ? { borderColor: theme.colors.danger.main } : {},
        ]}
        onPress={() => setIsVisible(true)}
        activeOpacity={0.7}
      >
        <Typography
          color={value ? theme.colors.text.neutral : theme.colors.text.disabled}
        >
          {selectedOption
            ? selectedOption.label
            : placeholder || "Selecione..."}
        </Typography>
        <Feather
          name="chevron-down"
          size={20}
          color={theme.colors.text.secondary}
        />
      </TouchableOpacity>

      {error && (
        <Typography
          variant="regular"
          size="xs"
          color={theme.colors.danger.main}
          style={styles.error}
        >
          {error}
        </Typography>
      )}

      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
        >
          <View style={styles.modalContent}>
            <Typography variant="bold" size="lg" style={styles.modalTitle}>
              Selecione a Unidade
            </Typography>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => handleSelect(item.value)}
                >
                  <Typography
                    color={
                      item.value === value
                        ? theme.colors.primary.main
                        : theme.colors.text.primary
                    }
                  >
                    {item.label}
                  </Typography>
                  {item.value === value && (
                    <Feather
                      name="check"
                      size={18}
                      color={theme.colors.primary.main}
                    />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    marginBottom: theme.spacing.md,
  },
  label: {
    marginBottom: theme.spacing.xs,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.background.input,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    height: 50,
    paddingHorizontal: theme.spacing.md,
  },
  error: {
    marginTop: theme.spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: theme.spacing.xl,
  },
  modalContent: {
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    maxHeight: "60%",
  },
  modalTitle: {
    marginBottom: theme.spacing.md,
    textAlign: "center",
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
});
