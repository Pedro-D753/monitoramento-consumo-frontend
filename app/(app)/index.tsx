//No momento este ambiente está sendo usado para testes, mas futuramente será a tela de inicial do app

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button"; // Trazendo o botão que fizemos antes
import { theme } from "@/config/Theme";

export default function Home() {
  // Estados para simular a digitação do usuário
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
    
        <View style={styles.container2}>
        <Text style={styles.title}>Validação do UI Kit</Text>

        {/* 1. Input Normal */}
        <Input
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address" // Traz o teclado com o "@"
          autoCapitalize="none" // Evita letra maiúscula automática no e-mail
        />

        {/* 2. Input com Simulação de Erro */}
        <Input
          label="Nome Completo"
          value={name}
          onChangeText={setName}
          // Simula um erro: se tiver digitado algo, mas for menor que 3 letras
          error={
            name.length > 0 && name.length < 3
              ? "O nome deve ter no mínimo 3 caracteres."
              : undefined
          }
        />

        {/* 3. Input de Senha */}
        <Input
          label="Senha de Acesso"
          value={password}
          onChangeText={setPassword}
          isPassword
        />

        {/* 4. Input Desativado (Disabled) */}
        <Input
          label="ID do Cadastro"
          value="LQ-98765" // Valor fixo
          editable={false}
        />

        {/* Testando tudo junto com o Botão */}
        <Button
          title="Validar Formulário"
          onPress={() => console.log({ email, name, password })}
          style={{ marginTop: 24 }} // Espaço extra antes do botão
        />
      </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, // Faz o ScrollView ocupar a tela toda
    backgroundColor: theme.colors.background.primary,
    padding: 24,
    justifyContent: "center", // Centraliza verticalmente
  },
  container2: {
    backgroundColor: theme.colors.card.subCard,
    borderRadius: theme.borderRadius.md,
    justifyContent: "center",
    padding: theme.spacing.lg,
  },
  title: {
    color: theme.colors.text.primary,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
  },
});
