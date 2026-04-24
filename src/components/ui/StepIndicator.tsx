import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '@/config/Theme';

// Definição da Interface (Contrato)
interface StepIndicatorProps {
  totalSteps: number;
  currentStep: number; // Esperamos o número da etapa (1, 2, 3...)
}

export function StepIndicator({ totalSteps, currentStep }: StepIndicatorProps) {
  return (
    <View style={styles.container}>
      {/* Lógica de transformação de número em lista JSX */}
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber <= currentStep;
        const isCurrent = stepNumber === currentStep;

        return (
          <React.Fragment key={stepNumber}>
            {/* Círculo do Step */}
            <View
              style={[
                styles.stepCircle,
                isActive ? styles.activeCircle : styles.inactiveCircle,
                isCurrent && styles.currentCircleHighlight
              ]}
            />
            
            {/* Linha conectora entre os círculos (exceto após o último) */}
            {stepNumber < totalSteps && (
              <View 
                style={[
                  styles.line,
                  stepNumber < currentStep ? styles.activeLine : styles.inactiveLine
                ]} 
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: theme.spacing.md,
  },
  stepCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
  },
  activeCircle: {
    backgroundColor: theme.colors.primary.main,
    borderColor: theme.colors.primary.main,
  },
  inactiveCircle: {
    backgroundColor: 'transparent',
    borderColor: theme.colors.border,
  },
  currentCircleHighlight: {
    transform: [{ scale: 1.2 }],
    shadowColor: theme.colors.primary.main,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5, // Para Android
  },
  line: {
    height: 2,
    flex: 1,
    maxWidth: 40, // Define o espaçamento entre círculos
    marginHorizontal: 4,
  },
  activeLine: {
    backgroundColor: theme.colors.primary.main,
  },
  inactiveLine: {
    backgroundColor: theme.colors.border,
  },
});