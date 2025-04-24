import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Share,
  Platform,
  SafeAreaView,
  ScrollView,
  Clipboard
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useUserStore } from '@/store/userStore';
import { colors } from '@/constants/colors';
import { Check, Copy, Share as ShareIcon } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function SuccessPage() {
  const router = useRouter();
  const currentUser = useUserStore(state => state.currentUser);
  const [copied, setCopied] = useState(false);
  
  const referralLink = `https://subx.ng/r/${currentUser?.referralCode || ''}`;
  
  useEffect(() => {
    if (!currentUser) {
      router.replace('/');
    }
  }, [currentUser, router]);
  
  const handleShare = async () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    try {
      if (Platform.OS === 'web') {
        // Web sharing
        if (navigator.share) {
          await navigator.share({
            title: 'Join Subx Early Access',
            text: 'I just joined Subx, Nigeria\'s biggest real estate investment community. Join me with my referral link:',
            url: referralLink,
          });
        } else {
          // Fallback for browsers that don't support Web Share API
          copyToClipboard();
        }
      } else {
        // Native sharing
        await Share.share({
          message: `I just joined Subx, Nigeria's biggest real estate investment community. Join me with my referral link: ${referralLink}`,
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };
  
  const copyToClipboard = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    try {
      if (Platform.OS === 'web') {
        // Web clipboard
        navigator.clipboard.writeText(referralLink);
      } else {
        // React Native clipboard
        Clipboard.setString(referralLink);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };
  
  if (!currentUser) {
    return null;
  }
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <View style={styles.checkCircle}>
            <Check size={40} color={colors.buttonText} strokeWidth={3} />
          </View>
          
          <Text style={styles.title}>Thanks for registering!</Text>
          
          <Text style={styles.message}>
            You'll be among the first to get access when we go live. We'll send you updates about our launch and exclusive investment opportunities.
          </Text>
          
          <View style={styles.referralSection}>
            <Text style={styles.referralTitle}>Invite others and get early access priority</Text>
            
            <View style={styles.referralLinkContainer}>
              <Text style={styles.referralLink} numberOfLines={1}>
                {referralLink}
              </Text>
              <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
                {copied ? (
                  <Check size={20} color={colors.success} />
                ) : (
                  <Copy size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
              <ShareIcon size={20} color={colors.buttonText} />
              <Text style={styles.shareButtonText}>Share Invitation</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.replace('/')}
          >
            <Text style={styles.backButtonText}>Back to Home</Text>
          </TouchableOpacity>
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
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: colors.lightText,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  referralSection: {
    width: '100%',
    marginTop: 16,
    marginBottom: 24,
  },
  referralTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  referralLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  referralLink: {
    flex: 1,
    fontSize: 14,
    color: colors.lightText,
  },
  copyButton: {
    padding: 4,
  },
  shareButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButtonText: {
    color: colors.buttonText,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  backButton: {
    marginTop: 16,
    padding: 12,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});