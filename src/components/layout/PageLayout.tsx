import React from 'react';
import { View, StyleSheet, ScrollView, ViewStyle, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/modules/auth/context/AuthContext';
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
    const { user } = useAuth();
    const resolvedUserName =
        userName ?? user?.real_name ?? user?.username ?? 'Usuário';
    
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
                            {showHeader && <Header userName={resolvedUserName} />}

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
        backgroundColor: theme.colors.background.primary,
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
    paddingBottom: 100,
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
