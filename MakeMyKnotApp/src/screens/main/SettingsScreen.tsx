import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Colors, Typography, GlobalStyles } from '../../styles/GlobalStyles';

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Customize your experience and privacy settings!</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...GlobalStyles.container,
  },
  content: {
    ...GlobalStyles.centerContent,
    flex: 1,
  },
  title: {
    ...Typography.h2,
    color: Colors.text.primary,
    marginBottom: 16,
  },
  subtitle: {
    ...Typography.body1,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});
