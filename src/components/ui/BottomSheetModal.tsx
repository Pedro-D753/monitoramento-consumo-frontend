/**
 * BottomSheet modal responsivo com keyboard handling cross-platform.
 * SafeArea + keyboard offset dinâmico.
 * ScrollView + backdrop dismiss.
 */

import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Keyboard,
  type KeyboardEvent,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "@/config/Theme";
import { Typography } from "./Typography";
import { Feather } from "@expo/vector-icons";

interface BottomSheetModalProps {
  /** Visibilidade modal */
  visible: boolean;
  /** Callback fechar */
  onClose: () => void;
  /** Título header */
  title: string;
  /** Conteúdo scrollável */
  children: React.ReactNode;
}

export function BottomSheetModal({
  visible,
  onClose,
  title,
  children,
}: BottomSheetModalProps) {
  const insets = useSafeAreaInsets();
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  useEffect(() => {
    // Listeners keyboard platform-specific
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const onShow = (e: KeyboardEvent) =>
      setKeyboardOffset(e.endCoordinates.height);
    const onHide = () => setKeyboardOffset(0);

    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // Reset offset on close
  useEffect(() => {
    if (!visible) setKeyboardOffset(0);
  }, [visible]);

  const safeBottomPadding =
    Platform.OS === "android" && insets.bottom === 0 ? 34 : insets.bottom;
  const bottomPadding =
    Math.max(safeBottomPadding, theme.spacing.lg) + theme.spacing.md;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <View
          style={[
            styles.sheet,
            { paddingBottom: bottomPadding, marginBottom: keyboardOffset },
          ]}
        >
          <View style={styles.handle} />

          <View style={styles.header}>
            <Typography variant="bold" size="lg">
              {title}
            </Typography>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={24} color={theme.colors.text.secondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  sheet: {
    backgroundColor: theme.colors.background.paper,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    maxHeight: "90%",
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: theme.spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  closeButton: {
    padding: 4,
  },
  scrollContent: {
    paddingBottom: theme.spacing.sm,
  },
});
