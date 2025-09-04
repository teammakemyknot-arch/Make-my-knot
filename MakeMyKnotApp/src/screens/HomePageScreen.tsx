import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  StatusBar,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

const { width, height } = Dimensions.get('window');

// Lead Questionnaire Component (exact copy from your website)
const LeadQuestionnaire: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    lookingFor: '',
    city: ''
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    
    // Store lead data and navigate to signup
    Alert.alert('Success', 'Thank you for your interest! Let\'s create your profile.', [
      { text: 'Continue', onPress: () => navigation.navigate('Signup') }
    ]);
  };

  return (
    <View style={styles.questionnaireCard}>
      <View style={styles.questionnaireHeader}>
        <Text style={styles.questionnaireTitle}>Find Your Match Today</Text>
        <Text style={styles.questionnaireSubtitle}>
          75 years of matchmaking expertise now powered by AI
        </Text>
      </View>
      
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            placeholder="Your Name *"
            value={formData.name}
            onChangeText={(text) => setFormData({...formData, name: text})}
            placeholderTextColor="#666"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            placeholder="Email Address *"
            value={formData.email}
            onChangeText={(text) => setFormData({...formData, email: text})}
            keyboardType="email-address"
            placeholderTextColor="#666"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            placeholder="Phone Number *"
            value={formData.phone}
            onChangeText={(text) => setFormData({...formData, phone: text})}
            keyboardType="phone-pad"
            placeholderTextColor="#666"
          />
        </View>
        
        <View style={styles.rowInputs}>
          <TextInput
            style={[styles.input, { flex: 1, marginRight: 8 }]}
            placeholder="Age"
            value={formData.age}
            onChangeText={(text) => setFormData({...formData, age: text})}
            keyboardType="numeric"
            placeholderTextColor="#666"
          />
          <View style={[styles.input, { flex: 1, marginLeft: 8, justifyContent: 'center' }]}>
            <TouchableOpacity>
              <Text style={{ color: formData.gender ? '#333' : '#666' }}>
                {formData.gender || 'Gender'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            placeholder="Your City"
            value={formData.city}
            onChangeText={(text) => setFormData({...formData, city: text})}
            placeholderTextColor="#666"
          />
        </View>
        
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.secondary]}
            style={styles.submitGradient}
          >
            <Text style={styles.submitText}>Find My Perfect Match</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
        
        <Text style={styles.disclaimer}>
          ✓ 91% success rate • ✓ 4.9/5 rating • ✓ 50,000+ happy couples
        </Text>
      </View>
    </View>
  );
};

// Couple Slider Component (exact copy from your website)
const CoupleSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const couples = [
    {
      image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&h=600&fit=crop',
      names: 'Rajesh & Priya',
      story: 'Matched in Mumbai, married in 2023',
      quote: 'Make My Knot helped us find each other when we least expected it!'
    },
    {
      image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&h=600&fit=crop',
      names: 'Arjun & Kavya',
      story: 'Connected through shared values, engaged in 2024',
      quote: 'The AI matching was incredibly accurate. We share the same life goals!'
    },
    {
      image: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&h=600&fit=crop',
      names: 'Vikram & Sneha',
      story: 'Long-distance match, now living together in Delhi',
      quote: 'Distance was no barrier when you find your soulmate!'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % couples.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.sliderContainer}>
      <View style={styles.sliderHeader}>
        <Text style={styles.sliderTitle}>Happy Couples</Text>
        <Text style={styles.sliderSubtitle}>
          Over 50,000 couples have found love through Make My Knot
        </Text>
      </View>
      
      <View style={styles.slider}>
        <View style={styles.slideContainer}>
          {couples.map((couple, index) => (
            <View 
              key={index} 
              style={[
                styles.slide,
                { opacity: index === currentSlide ? 1 : 0.3 }
              ]}
            >
              <Image source={{ uri: couple.image }} style={styles.coupleImage} />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.slideGradient}
              >
                <View style={styles.slideContent}>
                  <Text style={styles.coupleNames}>{couple.names}</Text>
                  <Text style={styles.coupleStory}>{couple.story}</Text>
                  <Text style={styles.coupleQuote}>"{couple.quote}"</Text>
                </View>
              </LinearGradient>
            </View>
          ))}
        </View>
        
        <View style={styles.dots}>
          {couples.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dot,
                { backgroundColor: index === currentSlide ? theme.colors.primary : '#ccc' }
              ]}
              onPress={() => setCurrentSlide(index)}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

// Testimonials Component (exact copy from your website)
const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: 'Priya Sharma',
      age: '28, Marketing Manager',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=faces',
      quote: 'I was skeptical about online matchmaking, but Make My Knot changed my perspective completely. The AI understood my preferences better than I did myself!',
      rating: 5
    },
    {
      name: 'Arjun Patel',
      age: '31, Software Engineer',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces',
      quote: 'The quality of matches was exceptional. Every profile I received was thoughtfully curated. Found my life partner within 3 months!',
      rating: 5
    }
  ];

  return (
    <View style={styles.testimonialsContainer}>
      <Text style={styles.testimonialsTitle}>What Our Members Say</Text>
      <Text style={styles.testimonialsSubtitle}>
        Don't just take our word for it. Here's what our successful members have to say.
      </Text>
      
      <View style={styles.testimonialsList}>
        {testimonials.map((testimonial, index) => (
          <View key={index} style={styles.testimonialCard}>
            <View style={styles.testimonialHeader}>
              <Image source={{ uri: testimonial.image }} style={styles.testimonialImage} />
              <View style={styles.testimonialInfo}>
                <Text style={styles.testimonialName}>{testimonial.name}</Text>
                <Text style={styles.testimonialAge}>{testimonial.age}</Text>
              </View>
            </View>
            
            <View style={styles.rating}>
              {Array(testimonial.rating).fill(0).map((_, i) => (
                <Ionicons key={i} name="star" size={16} color="#FFD700" />
              ))}
            </View>
            
            <Text style={styles.testimonialQuote}>"{testimonial.quote}"</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const HomePageScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />
      
      {/* Navigation */}
      <View style={styles.nav}>
        <View style={styles.navContent}>
          <View style={styles.logo}>
            <Ionicons name="heart" size={32} color={theme.colors.primary} />
            <Text style={styles.logoText}>Make My Knot</Text>
          </View>
          <View style={styles.navButtons}>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.navLink}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.navButton}
              onPress={() => navigation.navigate('Signup')}
            >
              <Text style={styles.navButtonText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Hero Section */}
      <LinearGradient
        colors={['rgba(233, 30, 99, 0.05)', 'rgba(255, 255, 255, 1)', 'rgba(255, 193, 7, 0.05)']}
        style={styles.hero}
      >
        <View style={styles.heroContent}>
          {/* Left Side - Questionnaire */}
          <LeadQuestionnaire navigation={navigation} />
          
          {/* Right Side - Content */}
          <View style={styles.heroText}>
            <Text style={styles.heroTitle}>
              Meet Your <Text style={styles.heroHighlight}>Perfect</Text>{'\n'}
              Life Partner
            </Text>
            <Text style={styles.heroSubtitle}>
              75 years of matchmaking expertise now powered by AI. We understand your values, lifestyle, and what truly matters to you.
            </Text>
            
            <View style={styles.heroButtons}>
              <TouchableOpacity 
                style={styles.heroPrimary}
                onPress={() => navigation.navigate('Signup')}
              >
                <Text style={styles.heroPrimaryText}>Start Your Journey</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            {/* Trust Indicators */}
            <View style={styles.trustIndicators}>
              <View style={styles.trustItem}>
                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                <Text style={styles.trustText}>91% success rate</Text>
              </View>
              <View style={styles.trustItem}>
                <Ionicons name="star" size={20} color="#FFD700" />
                <Text style={styles.trustText}>4.9/5 rating</Text>
              </View>
              <View style={styles.trustItem}>
                <Ionicons name="people" size={20} color={theme.colors.primary} />
                <Text style={styles.trustText}>50,000+ happy couples</Text>
              </View>
            </View>
            
            {/* Webinar Banner */}
            <View style={styles.webinarBanner}>
              <View style={styles.liveIndicator}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LIVE THIS WEEK</Text>
              </View>
              <Text style={styles.webinarTitle}>Relationship Mastery Webinar</Text>
              <Text style={styles.webinarDesc}>Join our expert therapists for insights on building lasting relationships</Text>
              <TouchableOpacity style={styles.webinarButton}>
                <Text style={styles.webinarButtonText}>Register Free</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* How It Works Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How Make My Knot Works</Text>
        <Text style={styles.sectionSubtitle}>
          Our intelligent matching process ensures you meet people who truly align with your values and life goals
        </Text>
        
        <View style={styles.steps}>
          <View style={styles.step}>
            <View style={[styles.stepIcon, { backgroundColor: theme.colors.primary }]}>
              <Ionicons name="chatbubbles" size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.stepTitle}>Meet Your Matchmaker</Text>
            <Text style={styles.stepDesc}>
              Have a conversation with your AI matchmaker about your values, lifestyle, and what you're looking for in a life partner.
            </Text>
          </View>
          
          <View style={styles.step}>
            <View style={[styles.stepIcon, { backgroundColor: theme.colors.accent }]}>
              <Ionicons name="people" size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.stepTitle}>Get Curated Matches</Text>
            <Text style={styles.stepDesc}>
              Receive 3-5 carefully selected profiles each week, chosen based on deep compatibility rather than just photos.
            </Text>
          </View>
          
          <View style={styles.step}>
            <View style={[styles.stepIcon, { backgroundColor: '#4CAF50' }]}>
              <Ionicons name="heart" size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.stepTitle}>Connect & Meet</Text>
            <Text style={styles.stepDesc}>
              When both parties are interested, your matchmaker introduces you personally and helps facilitate your first meeting.
            </Text>
          </View>
        </View>
      </View>

      {/* Happy Couples Slider */}
      <CoupleSlider />

      {/* Testimonials */}
      <Testimonials />

      {/* CTA Section */}
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.cta}
      >
        <Text style={styles.ctaTitle}>
          Ready to Find Your{'\n'}
          <Text style={styles.ctaHighlight}>Life Partner?</Text>
        </Text>
        <Text style={styles.ctaSubtitle}>
          Join thousands of people who have found meaningful relationships through our premium matchmaking platform.
        </Text>
        <TouchableOpacity 
          style={styles.ctaButton}
          onPress={() => navigation.navigate('Signup')}
        >
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.secondary]}
            style={styles.ctaButtonGradient}
          >
            <Text style={styles.ctaButtonText}>Start Your Journey Today</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  nav: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 16,
    paddingTop: 50,
  },
  navContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  navButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  navLink: {
    color: '#666',
    fontSize: 16,
  },
  navButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  navButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  hero: {
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  heroContent: {
    gap: 40,
  },
  questionnaireCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    ...theme.shadows.medium,
  },
  questionnaireHeader: {
    marginBottom: 20,
  },
  questionnaireTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  questionnaireSubtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  formContainer: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
  },
  rowInputs: {
    flexDirection: 'row',
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  submitGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disclaimer: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
  heroText: {
    gap: 20,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 42,
  },
  heroHighlight: {
    color: theme.colors.primary,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#666',
    lineHeight: 26,
  },
  heroButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  heroPrimary: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heroPrimaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  trustIndicators: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trustText: {
    fontSize: 14,
    color: '#666',
  },
  webinarBanner: {
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 7, 0.2)',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  liveDot: {
    width: 8,
    height: 8,
    backgroundColor: '#FF4444',
    borderRadius: 4,
  },
  liveText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6600',
  },
  webinarTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  webinarDesc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  webinarButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  webinarButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: '#F8F9FA',
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 40,
  },
  steps: {
    gap: 32,
  },
  step: {
    alignItems: 'center',
    maxWidth: 300,
    alignSelf: 'center',
  },
  stepIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  stepDesc: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  sliderContainer: {
    paddingVertical: 40,
    backgroundColor: 'rgba(233, 30, 99, 0.05)',
  },
  sliderHeader: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sliderTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  sliderSubtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    lineHeight: 26,
  },
  slider: {
    height: 400,
  },
  slideContainer: {
    height: 350,
    paddingHorizontal: 20,
  },
  slide: {
    position: 'absolute',
    width: width - 40,
    height: 350,
    borderRadius: 20,
    overflow: 'hidden',
  },
  coupleImage: {
    width: '100%',
    height: '100%',
  },
  slideGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    justifyContent: 'flex-end',
  },
  slideContent: {
    padding: 24,
  },
  coupleNames: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  coupleStory: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  coupleQuote: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontStyle: 'italic',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  testimonialsContainer: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  testimonialsTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  testimonialsSubtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 40,
  },
  testimonialsList: {
    gap: 20,
  },
  testimonialCard: {
    backgroundColor: '#F8F9FA',
    padding: 20,
    borderRadius: 16,
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  testimonialImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  testimonialInfo: {
    flex: 1,
  },
  testimonialName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  testimonialAge: {
    fontSize: 14,
    color: '#666',
  },
  rating: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 4,
  },
  testimonialQuote: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  cta: {
    paddingVertical: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  ctaHighlight: {
    color: theme.colors.secondary,
  },
  ctaSubtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 32,
  },
  ctaButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  ctaButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default HomePageScreen;
