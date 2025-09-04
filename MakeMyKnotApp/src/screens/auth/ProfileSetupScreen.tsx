import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
  Dimensions,
  Image,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const { width, height } = Dimensions.get('window');

interface ProfileData {
  photos: string[];
  bio: string;
  occupation: string;
  education: string;
  height: string;
  religion: string;
  relationshipGoals: 'casual' | 'serious' | 'friendship' | 'unsure' | '';
  interests: string[];
  lifestyle: {
    smoking: 'never' | 'socially' | 'regularly' | '';
    drinking: 'never' | 'socially' | 'regularly' | '';
    exercise: 'never' | 'sometimes' | 'regularly' | 'daily' | '';
    diet: 'anything' | 'vegetarian' | 'vegan' | 'kosher' | 'halal' | 'other' | '';
  };
}

interface ProfileSetupScreenProps {
  navigation: any;
}

const INTERESTS_OPTIONS = [
  'Travel', 'Photography', 'Music', 'Dancing', 'Reading', 'Movies', 
  'Cooking', 'Fitness', 'Yoga', 'Hiking', 'Sports', 'Art',
  'Gaming', 'Technology', 'Fashion', 'Food', 'Wine', 'Coffee',
  'Animals', 'Nature', 'Writing', 'Languages', 'Meditation', 'Volunteer'
];

export default function ProfileSetupScreen({ navigation }: ProfileSetupScreenProps) {
  const [step, setStep] = useState(1);
  const [profileData, setProfileData] = useState<ProfileData>({
    photos: [],
    bio: '',
    occupation: '',
    education: '',
    height: '',
    religion: '',
    relationshipGoals: '',
    interests: [],
    lifestyle: {
      smoking: '',
      drinking: '',
      exercise: '',
      diet: '',
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
      scrollViewRef.current?.scrollTo({ x: step * width, animated: true });
    } else {
      handleCompleteProfile();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      scrollViewRef.current?.scrollTo({ x: (step - 2) * width, animated: true });
    }
  };

  const handleCompleteProfile = async () => {
    setIsLoading(true);
    try {
      console.log('Profile setup complete:', profileData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Profile Complete!',
        'Welcome to Make My Knot! Your profile is now ready.',
        [
          {
            text: 'Start Swiping',
            onPress: () => navigation.replace('Main'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to complete profile setup. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions to upload photos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 5],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const newPhotos = [...profileData.photos, result.assets[0].uri];
        setProfileData(prev => ({ ...prev, photos: newPhotos }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = profileData.photos.filter((_, i) => i !== index);
    setProfileData(prev => ({ ...prev, photos: newPhotos }));
  };

  const toggleInterest = (interest: string) => {
    const newInterests = profileData.interests.includes(interest)
      ? profileData.interests.filter(i => i !== interest)
      : [...profileData.interests, interest];
    
    setProfileData(prev => ({ ...prev, interests: newInterests }));
  };

  const updateLifestyle = (key: keyof ProfileData['lifestyle'], value: any) => {
    setProfileData(prev => ({
      ...prev,
      lifestyle: { ...prev.lifestyle, [key]: value },
    }));
  };

  // Step 1: Photos
  const renderPhotosStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Add Your Photos</Text>
      <Text style={styles.stepSubtitle}>
        Show your best self! Add at least 2 photos to get started.
      </Text>

      <View style={styles.photosGrid}>
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <TouchableOpacity
            key={index}
            style={styles.photoSlot}
            onPress={() => {
              if (profileData.photos[index]) {
                removePhoto(index);
              } else {
                pickImage();
              }
            }}
          >
            {profileData.photos[index] ? (
              <>
                <Image source={{ uri: profileData.photos[index] }} style={styles.photo} />
                <TouchableOpacity style={styles.removeButton} onPress={() => removePhoto(index)}>
                  <Ionicons name="close" size={16} color="white" />
                </TouchableOpacity>
                {index === 0 && (
                  <View style={styles.mainPhotoLabel}>
                    <Text style={styles.mainPhotoText}>MAIN</Text>
                  </View>
                )}
              </>
            ) : (
              <View style={styles.addPhotoContainer}>
                <Ionicons name="camera" size={32} color="#E91E63" />
                <Text style={styles.addPhotoText}>
                  {index === 0 ? 'Main Photo' : 'Add Photo'}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.photoHelper}>
        Your main photo will be shown first. Add multiple photos to increase your matches!
      </Text>
    </View>
  );

  // Step 2: Bio & Basic Info
  const renderBioStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Tell Your Story</Text>
      <Text style={styles.stepSubtitle}>Share what makes you unique</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Bio</Text>
        <TextInput
          style={styles.bioInput}
          placeholder="Tell people about yourself, your interests, what you're looking for..."
          value={profileData.bio}
          onChangeText={(value) => setProfileData(prev => ({ ...prev, bio: value }))}
          multiline
          maxLength={500}
          textAlignVertical="top"
        />
        <Text style={styles.charCount}>{profileData.bio.length}/500</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Occupation</Text>
        <TextInput
          style={styles.textInput}
          placeholder="What do you do for work?"
          value={profileData.occupation}
          onChangeText={(value) => setProfileData(prev => ({ ...prev, occupation: value }))}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Education</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Your education background"
          value={profileData.education}
          onChangeText={(value) => setProfileData(prev => ({ ...prev, education: value }))}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Height (cm)</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Your height in centimeters"
          value={profileData.height}
          onChangeText={(value) => setProfileData(prev => ({ ...prev, height: value }))}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Religion (Optional)</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Your religious beliefs"
          value={profileData.religion}
          onChangeText={(value) => setProfileData(prev => ({ ...prev, religion: value }))}
        />
      </View>
    </View>
  );

  // Step 3: Interests & Goals
  const renderInterestsStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Your Interests</Text>
      <Text style={styles.stepSubtitle}>Select what you're passionate about</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Looking for</Text>
        <View style={styles.optionsGrid}>
          {[
            { key: 'serious', label: 'Long-term relationship' },
            { key: 'casual', label: 'Something casual' },
            { key: 'friendship', label: 'New friends' },
            { key: 'unsure', label: 'Still figuring it out' },
          ].map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.option,
                profileData.relationshipGoals === option.key && styles.optionSelected,
              ]}
              onPress={() => setProfileData(prev => ({ 
                ...prev, 
                relationshipGoals: option.key as any 
              }))}
            >
              <Text style={[
                styles.optionText,
                profileData.relationshipGoals === option.key && styles.optionTextSelected,
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Interests ({profileData.interests.length} selected)</Text>
        <View style={styles.interestsGrid}>
          {INTERESTS_OPTIONS.map((interest) => (
            <TouchableOpacity
              key={interest}
              style={[
                styles.interestChip,
                profileData.interests.includes(interest) && styles.interestChipSelected,
              ]}
              onPress={() => toggleInterest(interest)}
            >
              <Text style={[
                styles.interestChipText,
                profileData.interests.includes(interest) && styles.interestChipTextSelected,
              ]}>
                {interest}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  // Step 4: Lifestyle
  const renderLifestyleStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Lifestyle</Text>
      <Text style={styles.stepSubtitle}>Help others understand your lifestyle</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Smoking</Text>
        <View style={styles.optionsRow}>
          {[
            { key: 'never', label: 'Never' },
            { key: 'socially', label: 'Socially' },
            { key: 'regularly', label: 'Regularly' },
          ].map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.lifestyleOption,
                profileData.lifestyle.smoking === option.key && styles.optionSelected,
              ]}
              onPress={() => updateLifestyle('smoking', option.key)}
            >
              <Text style={[
                styles.optionText,
                profileData.lifestyle.smoking === option.key && styles.optionTextSelected,
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Drinking</Text>
        <View style={styles.optionsRow}>
          {[
            { key: 'never', label: 'Never' },
            { key: 'socially', label: 'Socially' },
            { key: 'regularly', label: 'Regularly' },
          ].map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.lifestyleOption,
                profileData.lifestyle.drinking === option.key && styles.optionSelected,
              ]}
              onPress={() => updateLifestyle('drinking', option.key)}
            >
              <Text style={[
                styles.optionText,
                profileData.lifestyle.drinking === option.key && styles.optionTextSelected,
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Exercise</Text>
        <View style={styles.optionsRow}>
          {[
            { key: 'never', label: 'Never' },
            { key: 'sometimes', label: 'Sometimes' },
            { key: 'regularly', label: 'Regularly' },
            { key: 'daily', label: 'Daily' },
          ].map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.lifestyleOption,
                profileData.lifestyle.exercise === option.key && styles.optionSelected,
              ]}
              onPress={() => updateLifestyle('exercise', option.key)}
            >
              <Text style={[
                styles.optionText,
                profileData.lifestyle.exercise === option.key && styles.optionTextSelected,
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Diet</Text>
        <View style={styles.optionsGrid}>
          {[
            { key: 'anything', label: 'Anything' },
            { key: 'vegetarian', label: 'Vegetarian' },
            { key: 'vegan', label: 'Vegan' },
            { key: 'kosher', label: 'Kosher' },
            { key: 'halal', label: 'Halal' },
            { key: 'other', label: 'Other' },
          ].map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.option,
                profileData.lifestyle.diet === option.key && styles.optionSelected,
              ]}
              onPress={() => updateLifestyle('diet', option.key)}
            >
              <Text style={[
                styles.optionText,
                profileData.lifestyle.diet === option.key && styles.optionTextSelected,
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${(step / 4) * 100}%` }]} />
      </View>
      <Text style={styles.progressText}>Step {step} of 4</Text>
    </View>
  );

  const canProceed = () => {
    switch (step) {
      case 1:
        return profileData.photos.length >= 2;
      case 2:
        return profileData.bio.length >= 50;
      case 3:
        return profileData.interests.length >= 3;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#E91E63', '#C2185B']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          {step > 1 && (
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
          )}
          
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>Profile Setup</Text>
          </View>
          
          {renderProgressBar()}
        </View>
      </LinearGradient>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        style={styles.content}
      >
        <View style={styles.slide}>{renderPhotosStep()}</View>
        <View style={styles.slide}>{renderBioStep()}</View>
        <View style={styles.slide}>{renderInterestsStep()}</View>
        <View style={styles.slide}>{renderLifestyleStep()}</View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            (!canProceed() || isLoading) && styles.nextButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={!canProceed() || isLoading}
        >
          <LinearGradient
            colors={['#E91E63', '#C2185B']}
            style={styles.nextButtonGradient}
          >
            <Text style={styles.nextButtonText}>
              {isLoading
                ? 'Setting up...'
                : step === 4
                ? 'Complete Profile'
                : 'Continue'
              }
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {step === 1 && (
          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => navigation.replace('Main')}
          >
            <Text style={styles.skipButtonText}>Skip for now</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
  },
  headerContent: {
    paddingHorizontal: 24,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: '80%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 2,
  },
  progressText: {
    color: 'white',
    fontSize: 14,
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
  },
  slide: {
    width,
    flex: 1,
  },
  stepContainer: {
    padding: 24,
    flex: 1,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  photoSlot: {
    width: (width - 72) / 3,
    height: (width - 72) / 3 * 1.25,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    marginBottom: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  addPhotoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    borderRadius: 12,
  },
  addPhotoText: {
    fontSize: 12,
    color: '#E91E63',
    marginTop: 8,
    textAlign: 'center',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainPhotoLabel: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: '#E91E63',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  mainPhotoText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  photoHelper: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
  },
  bioInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
    height: 120,
  },
  charCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FAFAFA',
    flex: 1,
    alignItems: 'center',
  },
  lifestyleOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FAFAFA',
    flex: 1,
    alignItems: 'center',
  },
  optionSelected: {
    borderColor: '#E91E63',
    backgroundColor: '#E91E63',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: 'white',
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FAFAFA',
  },
  interestChipSelected: {
    borderColor: '#E91E63',
    backgroundColor: '#E91E63',
  },
  interestChipText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  interestChipTextSelected: {
    color: 'white',
  },
  footer: {
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  nextButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  skipButton: {
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 14,
    color: '#666',
  },
});
