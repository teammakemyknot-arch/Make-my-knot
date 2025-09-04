import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, Card } from '../components/ui';
import { theme } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  duration: string;
  discount?: string;
  features: string[];
  isPopular?: boolean;
  color: string[];
}

export default function SubscriptionScreen({ navigation }: { navigation: any }) {
  const [selectedPlan, setSelectedPlan] = useState<string>('premium_monthly');

  const plans: SubscriptionPlan[] = [
    {
      id: 'premium_monthly',
      name: 'Premium',
      price: '₹999',
      duration: '/month',
      features: [
        'Unlimited Likes',
        'Super Likes Daily',
        'See Who Likes You',
        'Read Receipts',
        'Priority Support',
        'Advanced Filters',
      ],
      color: [theme.colors.primary, theme.colors.secondary],
    },
    {
      id: 'premium_yearly',
      name: 'Premium Annual',
      price: '₹8,999',
      originalPrice: '₹11,988',
      duration: '/year',
      discount: 'Save 25%',
      features: [
        'Unlimited Likes',
        'Super Likes Daily',
        'See Who Likes You',
        'Read Receipts',
        'Priority Support',
        'Advanced Filters',
        'Compatibility Insights',
        'Profile Boost Monthly',
      ],
      isPopular: true,
      color: [theme.colors.primary, theme.colors.gold],
    },
    {
      id: 'platinum',
      name: 'Platinum',
      price: '₹1,999',
      duration: '/month',
      features: [
        'Everything in Premium',
        'Unlimited Super Likes',
        'Top Profile Priority',
        'Exclusive Matches',
        'Video Chat Priority',
        'Relationship Coach Access',
        'Premium Badge',
        'Advanced Analytics',
      ],
      color: [theme.colors.gold, '#C9B037'],
    },
  ];

  const premiumFeatures = [
    {
      icon: 'heart',
      title: 'Unlimited Likes',
      description: 'Like as many profiles as you want without daily limits',
    },
    {
      icon: 'star',
      title: 'Super Likes',
      description: 'Stand out with Super Likes and get 3x more matches',
    },
    {
      icon: 'eye',
      title: 'See Who Likes You',
      description: 'Know who is interested before you swipe',
    },
    {
      icon: 'checkmark-done',
      title: 'Read Receipts',
      description: 'See when your messages are read',
    },
    {
      icon: 'filter',
      title: 'Advanced Filters',
      description: 'Filter by education, lifestyle, and more',
    },
    {
      icon: 'trending-up',
      title: 'Profile Boost',
      description: 'Get up to 10x more profile views',
    },
  ];

  const handleSubscribe = async (planId: string) => {
    Alert.alert(
      'Subscribe to Premium',
      'Start your premium experience and find your perfect match faster!',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Subscribe',
          onPress: () => {
            // Implement subscription logic here
            Alert.alert('Success!', 'Welcome to Make My Knot Premium! 🎉');
            navigation.goBack();
          },
        },
      ]
    );
  };

  const renderPlan = (plan: SubscriptionPlan) => (
    <TouchableOpacity
      key={plan.id}
      style={[
        styles.planCard,
        selectedPlan === plan.id && styles.selectedPlan,
        plan.isPopular && styles.popularPlan,
      ]}
      onPress={() => setSelectedPlan(plan.id)}
    >
      {plan.isPopular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularText}>Most Popular</Text>
        </View>
      )}
      
      <LinearGradient
        colors={plan.color}
        style={styles.planGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.planHeader}>
          <Text style={styles.planName}>{plan.name}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.planPrice}>{plan.price}</Text>
            <Text style={styles.planDuration}>{plan.duration}</Text>
          </View>
          {plan.originalPrice && (
            <View style={styles.discountContainer}>
              <Text style={styles.originalPrice}>{plan.originalPrice}</Text>
              <Text style={styles.discount}>{plan.discount}</Text>
            </View>
          )}
        </View>
      </LinearGradient>
      
      <View style={styles.planFeatures}>
        {plan.features.map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={16} color={theme.colors.success} />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>
      
      {selectedPlan === plan.id && (
        <View style={styles.selectedIndicator}>
          <Ionicons name="radio-button-on" size={24} color={theme.colors.primary} />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upgrade to Premium</Text>
        <View style={styles.headerSpace} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.secondary]}
          style={styles.heroSection}
        >
          <View style={styles.heroContent}>
            <Ionicons name="diamond" size={60} color="white" />
            <Text style={styles.heroTitle}>Find Your Perfect Match Faster</Text>
            <Text style={styles.heroSubtitle}>
              Join millions of users who found love with Premium features
            </Text>
          </View>
        </LinearGradient>

        {/* Premium Features */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Premium Features</Text>
          <View style={styles.featuresGrid}>
            {premiumFeatures.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Ionicons name={feature.icon} size={24} color={theme.colors.primary} />
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Pricing Plans */}
        <View style={styles.plansSection}>
          <Text style={styles.sectionTitle}>Choose Your Plan</Text>
          <View style={styles.plansContainer}>
            {plans.map(renderPlan)}
          </View>
        </View>

        {/* Success Stories */}
        <View style={styles.storiesSection}>
          <Text style={styles.sectionTitle}>Success Stories</Text>
          <Card variant="elevated" padding="medium" margin="small">
            <View style={styles.storyContent}>
              <Text style={styles.storyText}>
                "Make My Knot Premium helped me find my soulmate! The advanced filters 
                and unlimited likes made all the difference."
              </Text>
              <Text style={styles.storyAuthor}>- Priya & Rahul, Mumbai</Text>
            </View>
          </Card>
          
          <Card variant="elevated" padding="medium" margin="small">
            <View style={styles.storyContent}>
              <Text style={styles.storyText}>
                "We matched through Super Like and are getting married next month! 
                Thank you Make My Knot Premium!"
              </Text>
              <Text style={styles.storyAuthor}>- Anjali & Vikash, Delhi</Text>
            </View>
          </Card>
        </View>

        {/* Subscribe Button */}
        <View style={styles.subscribeSection}>
          <Button
            title={`Subscribe to ${plans.find(p => p.id === selectedPlan)?.name} - ${plans.find(p => p.id === selectedPlan)?.price}${plans.find(p => p.id === selectedPlan)?.duration}`}
            onPress={() => handleSubscribe(selectedPlan)}
            variant="gradient"
            size="large"
            fullWidth
          />
          
          <Text style={styles.disclaimer}>
            • Cancel anytime in your account settings{'\n'}
            • Secure payments with 256-bit encryption{'\n'}
            • 7-day money-back guarantee
          </Text>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  headerSpace: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    paddingVertical: theme.spacing.xxl,
    alignItems: 'center',
  },
  heroContent: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 22,
  },
  featuresSection: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.sm,
  },
  featureIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  plansSection: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
  },
  plansContainer: {
    gap: theme.spacing.md,
  },
  planCard: {
    borderRadius: theme.borderRadius.large,
    backgroundColor: theme.colors.background,
    borderWidth: 2,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    position: 'relative',
  },
  selectedPlan: {
    borderColor: theme.colors.primary,
    ...theme.shadows.medium,
  },
  popularPlan: {
    borderColor: theme.colors.gold,
  },
  popularBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: theme.colors.gold,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderBottomLeftRadius: theme.borderRadius.medium,
    zIndex: 1,
  },
  popularText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  planGradient: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
  },
  planHeader: {
    alignItems: 'center',
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: theme.spacing.sm,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  planPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  planDuration: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 4,
  },
  discountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  originalPrice: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textDecorationLine: 'line-through',
  },
  discount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  planFeatures: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  featureText: {
    fontSize: 14,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  selectedIndicator: {
    position: 'absolute',
    top: theme.spacing.md,
    left: theme.spacing.md,
  },
  storiesSection: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
  },
  storyContent: {
    alignItems: 'center',
  },
  storyText: {
    fontSize: 14,
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic',
    marginBottom: theme.spacing.sm,
  },
  storyAuthor: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  subscribeSection: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
  },
  disclaimer: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.md,
    lineHeight: 16,
  },
  bottomSpacer: {
    height: theme.spacing.xl,
  },
});
