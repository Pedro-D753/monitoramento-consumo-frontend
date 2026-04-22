import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

export default function MetasButton({ onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: '#4CAF50',
        padding: 12,
        borderRadius: 8,
        marginVertical: 5
      }}
    >
      <Text style={{ color: '#fff', textAlign: 'center' }}>
         Metas
      </Text>
    </TouchableOpacity>
  );
}