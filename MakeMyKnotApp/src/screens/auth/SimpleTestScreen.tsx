import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';

export default function SimpleTestScreen() {
  const handlePress = () => {
    console.log('🔥 BUTTON PRESSED!');
    Alert.alert('Success!', 'Button works!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Simple Test Screen</Text>
      
      <TouchableOpacity 
        onPress={handlePress}
        style={styles.button}
      >
        <Text style={styles.buttonText}>PRESS ME</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 50,
  },
  button: {
    backgroundColor: '#ff0000',
    padding: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
