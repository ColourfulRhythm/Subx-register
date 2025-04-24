import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ImageBackground, 
  SafeAreaView,
  Platform,
  useWindowDimensions
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Header } from '@/components/Header';
import { SignupForm } from '@/components/SignupForm';
import { Counter } from '@/components/Counter';
import { colors } from '@/constants/colors';

export default function LandingPage() {
  const { height } = useWindowDimensions();
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80' }}
          style={[styles.heroImage, { height: height * 0.4 }]}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
            style={styles.gradient}
          >
            <Header />
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>
                Join Nigeria's Biggest Real Estate Investment Community
              </Text>
              <Text style={styles.heroSubtitle}>
                Get early access to invest in property with as little as ₦35,000. Limited to 500,000 spots only.
              </Text>
            </View>
          </LinearGradient>
        </ImageBackground>
        
        <View style={styles.formSection}>
          <Counter />
          <SignupForm />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    flexGrow: 1,
  },
  heroImage: {
    width: '100%',
  },
  gradient: {
    flex: 1,
    justifyContent: 'space-between',
  },
  heroContent: {
    padding: 20,
    paddingBottom: 40,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  formSection: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingTop: 20,
    flex: 1,
  },
});