import { useState, useRef, useEffect, forwardRef } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Animated,
  TextInputProps,
  Pressable,
  Text,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { theme } from "@/config/Theme";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  isPassword?: boolean;
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      isPassword = false,
      value,
      style,
      onFocus,
      onBlur,
      ...rest
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [viewPassword, setViewPassword] = useState(false);

    const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

    useEffect(() => {
      // Mantém a label flutuante sincronizada com foco e conteúdo.
      Animated.timing(animatedValue, {
        toValue: isFocused || !!value ? 1 : 0,
        duration: 150,
        useNativeDriver: false,
      }).start();
    }, [isFocused, value]);

    const labelAxisY = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [14, -10],
    });
    const labelFontSize = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    });

    const isError = !!error;
    const isDisabled = rest.editable === false;

    let borderColor = theme.colors.border;
    if (isFocused) borderColor = theme.colors.primary.main;
    if (isError) borderColor = theme.colors.danger.main;

    const labelColor = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [
        theme.colors.text.disabled,
        isError
          ? theme.colors.danger.main
          : isFocused
            ? theme.colors.primary.main
            : theme.colors.text.neutral,
       ],
     });

    return (
      <View style={[styles.wrapper, { opacity: isDisabled ? 0.5 : 1 }]}>
        <View style={[styles.inputContainer, { borderColor }]}>
            {label && (
            <Animated.Text
              pointerEvents="none"
              style={[
                styles.label,
                {
                  top: labelAxisY,
                  fontSize: labelFontSize,
                  color: labelColor,
                },
              ]}
            >
              {label}
            </Animated.Text>
          )}

          <TextInput
            ref={ref}
            style={[styles.textInput, style]}
            value={value}
            onFocus={(e) => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            secureTextEntry={isPassword && !viewPassword}
            placeholderTextColor="transparent"
            {...rest}
          />

          {isPassword && (
            <Pressable
              onPress={() => setViewPassword(!viewPassword)}
              style={styles.eyeIcon}
            >
              <Feather
                name={viewPassword ? "eye" : "eye-off"}
                size={20}
                color={theme.colors.text.secondary}
              />
            </Pressable>
          )}
        </View>
        {isError && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    marginBottom: theme.spacing.md,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.background.input,
    height: 50,
    justifyContent: "center",
    paddingHorizontal: theme.spacing.md,
  },
  label: {
    position: "absolute",
    left: theme.spacing.md - 4,
    paddingHorizontal: 4,
    zIndex: 1,
    backgroundColor: theme.colors.background.input,
    borderRadius: 4,
  },
  textInput: {
    flex: 1,
    color: theme.colors.text.neutral,
    fontSize: 16,
    zIndex: 0,
  },
  eyeIcon: {
    position: "absolute",
    right: theme.spacing.md,
    height: "100%",
    justifyContent: "center",
  },
  errorText: {
    color: theme.colors.danger.main,
    fontSize: 12,
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.xs,
  },
});
