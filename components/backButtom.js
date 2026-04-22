import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

export default function BackButton({ onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={{ padding: 10 }}>
      <Text style={{ fontSize: 16 }}>← Voltar</Text>
    </TouchableOpacity>
  );
}


// <BackButton onPress={() => navigation.goBack()} />