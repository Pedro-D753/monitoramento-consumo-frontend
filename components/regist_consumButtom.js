import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

export default function RegistConsumButton({ onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: '#FF9800',
        padding: 12,
        borderRadius: 8,
        marginVertical: 5
      }}
    >
      <Text style={{ color: '#fff', textAlign: 'center' }}>
        Registrar Consumo
      </Text>
    </TouchableOpacity>
  );
}

//<RegistConsumButton onPress={() => navigation.navigate('Consumo')} />