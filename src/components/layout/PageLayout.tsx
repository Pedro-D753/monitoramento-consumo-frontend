import React from 'react';
import { View, StyleSheet, ScrollView, ViewStyle, Image, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from './Header';
import { theme } from '@/config/Theme';

interface PageLayoutProps {
    children: React.ReactNode;
    showHeader?: boolean;
    userName?: string;
    scrollable?: boolean; // Algumas telas não precisaram de scroll
    contentStyle?: ViewStyle;
}

export function PageLayout({
    children,
    showHeader = true,
    userName,
    scrollable = true,
    contentStyle
}: PageLayoutProps) {
    
    const content = (
        <View style={[styles.content, contentStyle]}>
            {children}
        </View>
    );

    return (
        <View style={styles.rootContainer}>
            <ImageBackground
                source={require('@/assets/bgDetails.webp')}
                style={styles.overlay}
                resizeMode="cover"
            >
                <SafeAreaView style={styles.safeArea} edges={['top']}>
                        <View style={styles.container}>
                            {showHeader && <Header userName={userName} />}

                            {scrollable ? (
                                <ScrollView
                                    showsVerticalScrollIndicator={false}
                                    contentContainerStyle={styles.scrollGrow}
                                >
                                    {content}
                                </ScrollView>
                            ) : (
                                content
                            )}
                        </View>
                </SafeAreaView>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        backgroundColor: theme.colors.background.primary, // A cor de fundo principal vem para a base
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
  },
  scrollGrow: {
    flexGrow: 1,
    paddingBottom: 100, // Espaço sagrado para a Bottom Tab Bar não cobrir o final da lista!
  },
  overlay: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
  }
});