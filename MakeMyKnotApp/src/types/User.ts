// Personal Information
export interface PersonalInfo {
  name: string;
  age: number;
  dateOfBirth: string;
  height: string;
  weight?: string;
  bodyType?: string;
  complexion?: string;
  motherTongue: string;
  languages: string[];
  maritalStatus: 'Never Married' | 'Divorced' | 'Widowed';
  children?: 'None' | 'Living with me' | 'Not living with me';
  physicalStatus?: 'Normal' | 'Physically challenged';
  aboutMe: string;
}

// Religious Information
export interface ReligiousInfo {
  religion: string;
  caste: string;
  subcaste?: string;
  sect?: string;
  gotra?: string;
  manglik?: 'Yes' | 'No' | 'Anshik';
  horoscope?: string;
}

// Family Information
export interface FamilyInfo {
  fatherName: string;
  fatherOccupation: string;
  motherName: string;
  motherOccupation: string;
  brothers: number;
  sisters: number;
  familyType: 'Joint Family' | 'Nuclear Family';
  familyStatus: 'Middle Class' | 'Upper Middle Class' | 'Rich' | 'Affluent';
  familyValues: 'Traditional' | 'Moderate' | 'Liberal';
  aboutFamily: string;
}

// Education and Career
export interface EducationCareer {
  highestEducation: string;
  educationDetails: string;
  occupation: string;
  company?: string;
  jobTitle?: string;
  workLocation: string;
  annualIncome: string;
  workingWith: 'Private Company' | 'Government' | 'Business' | 'Self Employed' | 'Not Working';
}

// Location Information
export interface LocationInfo {
  country: string;
  state: string;
  city: string;
  residenceStatus: 'Citizen' | 'Permanent Resident' | 'Temporary Visa' | 'Work Permit';
  grewUpIn: string;
}

// Lifestyle Information
export interface LifestyleInfo {
  diet: 'Vegetarian' | 'Non-Vegetarian' | 'Eggetarian' | 'Vegan';
  smoking: 'Never' | 'Socially' | 'Regularly' | 'Trying to quit';
  drinking: 'Never' | 'Socially' | 'Regularly' | 'Trying to quit';
  interests: string[];
  hobbies: string[];
  sports: string[];
  music: string[];
  movies: string[];
  books: string[];
}

// Partner Preferences
export interface PartnerPreferences {
  ageRange: {
    min: number;
    max: number;
  };
  heightRange: {
    min: string;
    max: string;
  };
  maritalStatus: string[];
  religion: string[];
  caste: string[];
  motherTongue: string[];
  education: string[];
  occupation: string[];
  annualIncome: {
    min: string;
    max: string;
  };
  location: {
    countries: string[];
    states: string[];
  };
  diet: string[];
  smoking: string[];
  drinking: string[];
  manglik?: 'Yes' | 'No' | 'No Preference';
}

// Main User Interface
export interface User {
  id: string;
  email: string;
  phone: string;
  profileImages: string[];
  profileFor: 'Self' | 'Son' | 'Daughter' | 'Brother' | 'Sister' | 'Friend' | 'Relative';
  createdBy: string;
  relationWithProfileOwner?: string;
  gender: 'Male' | 'Female';
  
  personalInfo: PersonalInfo;
  religiousInfo: ReligiousInfo;
  familyInfo: FamilyInfo;
  educationCareer: EducationCareer;
  locationInfo: LocationInfo;
  lifestyleInfo: LifestyleInfo;
  partnerPreferences: PartnerPreferences;
  
  isProfileComplete: boolean;
  isVerified: boolean;
  isPremium: boolean;
  lastActive: string;
  joinedDate: string;
  profileViews: number;
  interestsSent: number;
  interestsReceived: number;
  
  privacySettings: {
    showContactDetails: 'All' | 'Premium' | 'Matched Only';
    showLastActive: boolean;
    showProfileViews: boolean;
  };
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPhoto {
  id: string;
  url: string;
  thumbnailUrl: string;
  order: number;
  isMain: boolean;
  uploadedAt: Date;
  isVerified?: boolean;
}

export interface UserMatch {
  id: string;
  users: [string, string]; // user IDs
  matchedAt: Date;
  isActive: boolean;
  lastMessageAt?: Date;
  conversationId: string;
}

// Matrimonial specific interfaces
export interface Interest {
  id: string;
  fromUserId: string;
  toUserId: string;
  message?: string;
  status: 'Sent' | 'Accepted' | 'Declined' | 'Expired';
  sentAt: string;
  respondedAt?: string;
}

export interface Match {
  id: string;
  userId: string;
  user: User;
  compatibilityScore: number;
  distance?: number;
  matchedOn: string;
  commonInterests: string[];
  mutualConnections?: number;
}

export interface Shortlist {
  id: string;
  userId: string;
  profileId: string;
  addedAt: string;
  notes?: string;
}

export interface UserReport {
  id: string;
  reporterId: string;
  reportedUserId: string;
  reason: 'inappropriate_photos' | 'harassment' | 'spam' | 'fake_profile' | 'underage' | 'other';
  description?: string;
  evidence?: string[]; // photo/message URLs
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: Date;
  resolvedAt?: Date;
}

export interface UserBlock {
  id: string;
  blockerId: string;
  blockedUserId: string;
  reason?: string;
  createdAt: Date;
}
