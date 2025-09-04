import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  FlatList,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

interface SearchFilters {
  ageRange: { min: number; max: number };
  heightRange: { min: string; max: string };
  religion: string[];
  caste: string[];
  motherTongue: string[];
  education: string[];
  profession: string[];
  location: string[];
  maritalStatus: string[];
  diet: string[];
}

interface SearchResult {
  id: string;
  name: string;
  age: number;
  height: string;
  location: string;
  profession: string;
  education: string;
  religion: string;
  caste: string;
  motherTongue: string;
  image: string;
  isOnline: boolean;
  lastActive: string;
  verificationLevel: 'Basic' | 'Verified' | 'Premium';
  compatibility: number;
}

const SearchScreen = ({ navigation }: any) => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    ageRange: { min: 21, max: 35 },
    heightRange: { min: '5\'0"', max: '6\'0"' },
    religion: [],
    caste: [],
    motherTongue: [],
    education: [],
    profession: [],
    location: [],
    maritalStatus: ['Never Married'],
    diet: [],
  });

  const [searchResults, setSearchResults] = useState<SearchResult[]>([
    {
      id: '1',
      name: 'Priya Sharma',
      age: 26,
      height: '5\'4"',
      location: 'Mumbai, Maharashtra',
      profession: 'Software Engineer',
      education: 'B.Tech - IIT Delhi',
      religion: 'Hindu',
      caste: 'Brahmin',
      motherTongue: 'Hindi',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
      isOnline: true,
      lastActive: 'Online now',
      verificationLevel: 'Verified',
      compatibility: 92
    },
    {
      id: '2',
      name: 'Anjali Patel',
      age: 28,
      height: '5\'2"',
      location: 'Ahmedabad, Gujarat',
      profession: 'Doctor',
      education: 'MBBS - AIIMS Delhi',
      religion: 'Hindu',
      caste: 'Patel',
      motherTongue: 'Gujarati',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop',
      isOnline: false,
      lastActive: '2 hours ago',
      verificationLevel: 'Premium',
      compatibility: 89
    },
    {
      id: '3',
      name: 'Kavya Singh',
      age: 25,
      height: '5\'6"',
      location: 'Delhi, Delhi',
      profession: 'Teacher',
      education: 'M.Ed - Delhi University',
      religion: 'Hindu',
      caste: 'Rajput',
      motherTongue: 'Hindi',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop',
      isOnline: false,
      lastActive: '1 day ago',
      verificationLevel: 'Basic',
      compatibility: 87
    },
    {
      id: '4',
      name: 'Sneha Reddy',
      age: 29,
      height: '5\'5"',
      location: 'Hyderabad, Telangana',
      profession: 'Chartered Accountant',
      education: 'CA - ICAI',
      religion: 'Hindu',
      caste: 'Reddy',
      motherTongue: 'Telugu',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
      isOnline: true,
      lastActive: 'Online now',
      verificationLevel: 'Verified',
      compatibility: 85
    }
  ]);

  const filterOptions = {
    religions: ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Other'],
    castes: ['Brahmin', 'Kshatriya', 'Vaishya', 'Shudra', 'Patel', 'Reddy', 'Nair', 'Other'],
    motherTongues: ['Hindi', 'English', 'Bengali', 'Telugu', 'Marathi', 'Tamil', 'Gujarati', 'Urdu', 'Kannada', 'Malayalam'],
    educations: ['Graduate', 'Post Graduate', 'Doctorate', 'Professional', 'Engineering', 'Medical', 'MBA', 'Other'],
    professions: ['Software Engineer', 'Doctor', 'Teacher', 'Lawyer', 'CA', 'Manager', 'Business', 'Government', 'Other'],
    locations: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad', 'Other'],
    maritalStatuses: ['Never Married', 'Divorced', 'Widowed'],
    diets: ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Jain Vegetarian']
  };

  const sendInterest = (profileId: string) => {
    Alert.alert(
      'Send Interest',
      'Are you sure you want to send interest to this profile?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Send', 
          onPress: () => {
            console.log('Interest sent to:', profileId);
            Alert.alert('Success', 'Interest sent successfully!');
          }
        }
      ]
    );
  };

  const getVerificationIcon = (level: string) => {
    switch (level) {
      case 'Premium': return { name: 'diamond', color: theme.colors.accent };
      case 'Verified': return { name: 'checkmark-circle', color: theme.colors.success };
      default: return { name: 'person-circle', color: theme.colors.textSecondary };
    }
  };

  const renderSearchResult = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity 
      style={styles.resultCard}
      onPress={() => navigation.navigate('ProfileDetails', { profileId: item.id })}
    >
      <View style={styles.resultHeader}>
        <Image source={{ uri: item.image }} style={styles.resultImage} />
        
        <View style={styles.onlineIndicator}>
          {item.isOnline ? (
            <View style={styles.onlineDot} />
          ) : null}
        </View>
        
        <View style={styles.resultInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.resultName}>{item.name}</Text>
            <Ionicons 
              name={getVerificationIcon(item.verificationLevel).name as any}
              size={16} 
              color={getVerificationIcon(item.verificationLevel).color} 
            />
          </View>
          <Text style={styles.resultAge}>{item.age} years, {item.height}</Text>
          <Text style={styles.resultLocation}>{item.location}</Text>
          <Text style={styles.resultProfession}>{item.profession}</Text>
          <Text style={styles.resultEducation}>{item.education}</Text>
          
          <View style={styles.compatibilityRow}>
            <Text style={styles.compatibilityText}>{item.compatibility}% Match</Text>
            <Text style={styles.lastActiveText}>{item.lastActive}</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.interestButton}
          onPress={() => sendInterest(item.id)}
        >
          <Ionicons name="heart" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const FilterSection = ({ title, options, selected, onSelect }: {
    title: string;
    options: string[];
    selected: string[];
    onSelect: (option: string) => void;
  }) => (
    <View style={styles.filterSection}>
      <Text style={styles.filterTitle}>{title}</Text>
      <View style={styles.filterOptions}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.filterOption,
              selected.includes(option) && styles.filterOptionSelected
            ]}
            onPress={() => onSelect(option)}
          >
            <Text style={[
              styles.filterOptionText,
              selected.includes(option) && styles.filterOptionTextSelected
            ]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const toggleFilterOption = (category: keyof SearchFilters, option: string) => {
    if (category === 'ageRange' || category === 'heightRange') return;
    
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(option)
        ? prev[category].filter((item: string) => item !== option)
        : [...prev[category], option]
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, profession, location..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={theme.colors.textSecondary}
          />
        </View>
        <TouchableOpacity 
          style={[styles.filterButton, showFilters && styles.filterButtonActive]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons 
            name="options" 
            size={20} 
            color={showFilters ? theme.colors.primary : theme.colors.textSecondary} 
          />
        </TouchableOpacity>
      </View>

      {/* Results Count */}
      <View style={styles.resultsCount}>
        <Text style={styles.resultsCountText}>{searchResults.length} profiles found</Text>
        <TouchableOpacity style={styles.sortButton}>
          <Ionicons name="swap-vertical" size={16} color={theme.colors.primary} />
          <Text style={styles.sortText}>Sort by Match %</Text>
        </TouchableOpacity>
      </View>

      {/* Filters Panel */}
      {showFilters && (
        <ScrollView style={styles.filtersPanel} showsVerticalScrollIndicator={false}>
          <FilterSection
            title="Religion"
            options={filterOptions.religions}
            selected={filters.religion}
            onSelect={(option) => toggleFilterOption('religion', option)}
          />
          <FilterSection
            title="Caste"
            options={filterOptions.castes}
            selected={filters.caste}
            onSelect={(option) => toggleFilterOption('caste', option)}
          />
          <FilterSection
            title="Mother Tongue"
            options={filterOptions.motherTongues}
            selected={filters.motherTongue}
            onSelect={(option) => toggleFilterOption('motherTongue', option)}
          />
          <FilterSection
            title="Education"
            options={filterOptions.educations}
            selected={filters.education}
            onSelect={(option) => toggleFilterOption('education', option)}
          />
          <FilterSection
            title="Profession"
            options={filterOptions.professions}
            selected={filters.profession}
            onSelect={(option) => toggleFilterOption('profession', option)}
          />
          
          <View style={styles.filterActions}>
            <TouchableOpacity style={styles.clearFiltersButton}>
              <Text style={styles.clearFiltersText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyFiltersButton}>
              <Text style={styles.applyFiltersText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* Search Results */}
      <FlatList
        data={searchResults}
        renderItem={renderSearchResult}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.resultsList}
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchHeader: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.medium,
    marginRight: theme.spacing.md,
  },
  searchInput: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    fontSize: theme.fonts.sizes.medium,
    color: theme.colors.text,
  },
  filterButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.small,
    backgroundColor: theme.colors.background,
  },
  filterButtonActive: {
    backgroundColor: theme.colors.primary + '20',
  },
  resultsCount: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  resultsCountText: {
    fontSize: theme.fonts.sizes.medium,
    color: theme.colors.text,
    fontWeight: '500',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortText: {
    fontSize: theme.fonts.sizes.small,
    color: theme.colors.primary,
    marginLeft: theme.spacing.xs,
  },
  filtersPanel: {
    maxHeight: 300,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  filterSection: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  filterTitle: {
    fontSize: theme.fonts.sizes.medium,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterOption: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.background,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterOptionSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterOptionText: {
    fontSize: theme.fonts.sizes.small,
    color: theme.colors.text,
  },
  filterOptionTextSelected: {
    color: '#FFFFFF',
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  clearFiltersButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.medium,
  },
  clearFiltersText: {
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  applyFiltersButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
    marginLeft: theme.spacing.sm,
  },
  applyFiltersText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  resultsList: {
    paddingHorizontal: theme.spacing.lg,
  },
  resultCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.small,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  resultImage: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.large,
  },
  onlineIndicator: {
    position: 'absolute',
    top: 2,
    left: 58,
  },
  onlineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.success,
    borderWidth: 2,
    borderColor: theme.colors.surface,
  },
  resultInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  resultName: {
    fontSize: theme.fonts.sizes.large,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginRight: theme.spacing.sm,
  },
  resultAge: {
    fontSize: theme.fonts.sizes.medium,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  resultLocation: {
    fontSize: theme.fonts.sizes.medium,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  resultProfession: {
    fontSize: theme.fonts.sizes.medium,
    color: theme.colors.primary,
    fontWeight: '500',
    marginBottom: theme.spacing.xs,
  },
  resultEducation: {
    fontSize: theme.fonts.sizes.small,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  compatibilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  compatibilityText: {
    fontSize: theme.fonts.sizes.small,
    color: theme.colors.success,
    fontWeight: '600',
  },
  lastActiveText: {
    fontSize: theme.fonts.sizes.small,
    color: theme.colors.textSecondary,
  },
  interestButton: {
    backgroundColor: theme.colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: theme.spacing.sm,
  },
});

export default SearchScreen;
