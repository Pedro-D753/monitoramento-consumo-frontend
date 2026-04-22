import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { login } from './services/authService';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleLogin = async () => {
    try {
      const response = await login({
        email: email,
        senha: senha
      });

      console.log(response.data);

      navigation.navigate('Home');

    } catch (err) {
      setErro('Email ou senha inválidos');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      {erro ? <Text>{erro}</Text> : null}

      <Button title="Entrar" onPress={handleLogin} />
    </View>
  );
}