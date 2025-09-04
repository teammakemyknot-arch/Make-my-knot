# Make My Knot - Mobile App

A React Native mobile application for finding your perfect match based on compatibility, values, and shared interests.

## Features

- **Onboarding Experience**: Beautiful introductory carousel with app features
- **Authentication**: Secure login and signup with form validation
- **Profile Management**: Complete profile setup with photo upload
- **Smart Matching**: Compatibility-based matching algorithm
- **Real-time Chat**: Messaging system for matched users
- **Compatibility Quiz**: Detailed questionnaire for better matches
- **Native Features**: Camera integration, location services, push notifications

## Tech Stack

- **Framework**: Expo (React Native)
- **Language**: TypeScript
- **Navigation**: React Navigation v6
- **UI Components**: Custom components with consistent design system
- **State Management**: React Hooks
- **Image Handling**: Expo Image Picker
- **Notifications**: Expo Notifications
- **Location**: Expo Location

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- Expo CLI: `npm install -g @expo/cli`
- EAS CLI: `npm install -g eas-cli`

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd MakeMyKnotApp
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npx expo start
```

4. Run on device/simulator:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your device

## Development Commands

```bash
# Start development server
npm start

# Start with clear cache
npm run start:clear

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web

# Type checking
npm run type-check

# Lint code
npm run lint
```

## Project Structure

```
src/
├── components/          # Reusable UI components
├── screens/            # App screens
│   ├── auth/          # Authentication screens
│   └── main/          # Main app screens
├── navigation/         # Navigation configuration
├── services/          # API and external services
├── styles/            # Global styles and themes
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
└── hooks/             # Custom React hooks
```

## Building for Production

### Development Build

```bash
eas build --profile development --platform all
```

### Preview Build

```bash
eas build --profile preview --platform all
```

### Production Build

```bash
eas build --profile production --platform all
```

## Deployment

### iOS App Store

1. Configure your Apple Developer account in `eas.json`
2. Build for production: `eas build --profile production --platform ios`
3. Submit to App Store: `eas submit --profile production --platform ios`

### Google Play Store

1. Configure your Google Play Console credentials in `eas.json`
2. Build for production: `eas build --profile production --platform android`
3. Submit to Play Store: `eas submit --profile production --platform android`

## Environment Configuration

Create environment-specific configurations:

1. Development: Uses Expo development client
2. Preview: Internal distribution for testing
3. Production: App store builds

## Key Features Implementation

### Authentication Flow
- Onboarding carousel with app introduction
- Login/signup forms with validation
- Password strength checking
- Social login integration ready

### Navigation System
- Stack navigation for auth flow
- Tab navigation for main app
- Modal screens for detailed views

### UI/UX Design
- Consistent color scheme and typography
- Responsive design for all screen sizes
- Loading states and error handling
- Pull-to-refresh functionality

### Native Integrations
- Camera and photo library access
- Location services for nearby matches
- Push notifications for real-time updates
- Biometric authentication (ready to implement)

## Customization

### Theming
Modify `src/styles/GlobalStyles.ts` to customize:
- Colors
- Typography
- Spacing
- Border radius
- Shadows

### App Configuration
Update `app.json` for:
- App name and description
- Icons and splash screen
- Permissions
- Build configuration

## Performance Optimization

- Image optimization with proper sizing
- Lazy loading for lists
- Memoization for expensive calculations
- Optimized re-renders with React.memo

## Security Considerations

- Form validation on both client and server
- Secure token storage
- Image upload size limits
- Privacy controls for user data

## Support

For questions and support:
- Email: support@makemyknot.com
- Documentation: [Link to docs]

## License

Copyright © 2024 Make My Knot. All rights reserved.
