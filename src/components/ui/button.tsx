import React from "react"; //Biblioteca principal do React
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps, // Classe de propriedades para TouchableOpacity
  ActivityIndicator, // Componente de carregamento para indicar que algo está em andamento
} from "react-native";
import { theme } from "@/config/Theme"; // Importa o tema para usar as cores e estilos definidos no seu projeto

// Definindo as propriedades que o componente Button vai receber
interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "danger" | "outline"; // Variante de estado do botão, evitar criar multiplas classes para um mesmo componente
  isLoading?: boolean;
}

// Declarando a função do componente Button, que recebe as propriedades definidas acima, já construindo o componente de maneira visual
export function Button({
  title, // Texto que será exibido no botão
  variant = "primary", // Define a variante padrão como "primary" caso nenhuma seja especificada
  isLoading = false, // Resetando o estado de carregamento para false, ou seja, o botão não estará carregando por padrão
  style, // Permite que o usuário do componente passe estilos personalizados
  ...rest // Permite que o usuário do componente passe outras propriedades do TouchableOpacity, como onPress, disabled, etc.
}: ButtonProps) {
  // Lógica para determinar as propriedades do botão com base na variante selecionada
  const isOutLine = variant === "outline"; // Botões outline são botões secundarios, com cores invertidas
  const backgroundColor = isOutLine
    ? "#FFFFFF"
    : theme.colors[variant === "primary" ? "primary" : "danger"].main; // Operador ternário para definir a cor de fundo do botão com base na variante selecionada
  const textColor = isOutLine // Operador ternário para definir a cor do texto do botão, invertendo as cores para botões outline
    ? theme.colors.text.secondary
    : theme.colors.text.primary;

  return (
    // Componentes visuais contruidos
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor,
          // Borda apenas para botões outline, usando a cor primária do tema, caso contrário, a borda é transparente
          borderColor: isOutLine ? theme.colors.primary.main : "transparent",
        },
        style,
      ]}
      activeOpacity={0.8} // Suavidade ao clicar
      disabled={isLoading || rest.disabled} // Desabilita o botão se estiver carregando ou se a propriedade disabled for passada como true
      {...rest}
    >
      {isLoading ? ( // Se o botão estiver em estado de carregamento, exibe um indicador de atividade (spinner) no lugar do texto
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.text, { color: textColor }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

// Estilização comum ou complexa
const styles = StyleSheet.create({
  container: {
    width: "70%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: theme.borderRadius.sm, // Arredondamento do seu Figma
    borderWidth: 1, // Usado apenas quando for 'outline'
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
