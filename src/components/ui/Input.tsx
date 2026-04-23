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

//Definindo as propriedades que o componente Input vai receber e tipando elas
interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  isPassword?: boolean;
}

//FowardRef é uma função do React que permite passar uma ref de um componente
//pai para um componente filho, facilitando o acesso a elementos DOM ou componentes React diretamente
//Estamos usando ele para permitir que o fomulario seja manipulado de maneira mais flexivel e rapida
export const Input = forwardRef<TextInput, InputProps>(
  ({ label, 
    error, 
    isPassword = false, 
    value, 
    style, 
    onFocus, 
    onBlur, 
    ...rest }, ref) => {
    //Estados locais
    //Estados para controlar o foco do input e a visibilidade da senha
    const [isFocused, setIsFocused] = useState(false);
    const [viewPassword, setViewPassword] = useState(false);

    //Animação para a label, será 1 quando tiver valor ou 0  quando nao tiver
    //nesse caso valor pode ser, ter texto dentro ou estar focused(clicado)
    const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

    //Ativando a animação quando o foco ou o valor do input mudar
    useEffect(() => {
      Animated.timing(animatedValue, {
        toValue: isFocused || !!value ? 1 : 0,
        duration: 150, // duração da animação
        useNativeDriver: false, // desativa o uso do driver nativo para animação
      }).start();
    }, [isFocused, value]);

    const labelAxisY = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [14, -10], // Move a label para cima , ficando sobre a borda do input
    });
    const labelFontSize = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12], // Diminui o tamanho da fonte da label quando o input estiver focado ou tiver valor
    });

    const isError = !!error;
    const isDisabled = rest.editable === false;

    let borderColor = theme.colors.border; // Default
    if (isFocused) borderColor = theme.colors.primary.main; // Focado
    if (isError) borderColor = theme.colors.danger.main; // Erro

    const labelColor = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [
        theme.colors.text.secondary,
        isError
          ? theme.colors.danger.main
          : isFocused
            ? theme.colors.primary.main
            : theme.colors.text.neutral,
      ], // Cor da label muda para vermelho se tiver erro, azul se estiver focado, ou a cor primária do texto caso contrário
    });

    return (
      <View style={[styles.wrapper, { opacity: isDisabled ? 0.5 : 1 }]}>
        <View style={[styles.inputContainer, { borderColor }]}>
          {/*Label com animação*/}
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

          {/* input de texto */}
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
            // Se for um campo de senha e a visualização estiver desativada, oculta o texto
            placeholderTextColor="transparent"
            // Esconde o placeholder, já que estamos usando a label animada
            {...rest}
          />

          {/* Ícone para mostrar/ocultar senha */}
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
        {/* Mensagem de Erro (Renderiza apenas se a prop error existir) */}
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
    // Garante que elementos filhos não vazem, mas a label precisa vazar para cima
    // logo, NÃO use overflow: 'hidden' aqui.
  },
  label: {
    position: "absolute",
    left: theme.spacing.md - 4, // Alinha com o padding do input
    paddingHorizontal: 4, // Espaço para a linha do border não cruzar o texto
    zIndex: 1, // Fica acima do input
    backgroundColor: theme.colors.background.input, // Mesma cor do fundo para "recortar" o border quando a label sobe
    borderRadius: 4, // Deixa a label com cantos arredondados para combinar com o input
  },
  textInput: {
    flex: 1,
    color: theme.colors.text.neutral,
    fontSize: 16,
    zIndex: 0, // Fica abaixo da label
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
