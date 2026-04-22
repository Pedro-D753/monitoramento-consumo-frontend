import { View, Text } from 'react-native';
import { Button } from '@/components/ui/button'; // Nosso novo componente
import { theme } from '@/config/themes';

export default function Home() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background.primary, padding: 24, gap: 16 }}>
      
      <Text style={{ color: theme.colors.text.primary, fontSize: 24, marginBottom: 20 }}>
        Testando o UI Kit
      </Text>

      {/* Testando as 3 variantes que identificamos no seu Figma */}
      <Button title="Entrar na Conta" variant="primary" onPress={() => console.log('Clicou Primary!')} />
      <Button title="Criar nova conta" variant="outline" onPress={() => console.log('Clicou Outline!')} />
      <Button title="Excluir Consumo" variant="danger" onPress={() => console.log('Clicou Danger!')} />
      
    </View>
  );
}