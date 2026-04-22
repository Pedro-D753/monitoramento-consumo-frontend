import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

export default function ProfileUserButton({ onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: '#2196F3',
        padding: 12,
        borderRadius: 8,
        marginVertical: 5
      }}
    >
      <Text style={{ color: '#fff', textAlign: 'center' }}>
        Perfil
      </Text>
    </TouchableOpacity>
  );
} 


// <ProfileUserButton onPress={() => navigation.navigate('Perfil')} />