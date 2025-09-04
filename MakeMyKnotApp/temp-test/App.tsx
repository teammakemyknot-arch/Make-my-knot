import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TouchableOpacity, Alert } from 'react-native';

export default function App() {
  const handleButtonPress = () => {
    console.log('FRESH TEMPLATE: Button pressed!');
    Alert.alert('SUCCESS!', 'Touch events work in fresh template!');
  };

  const handleTouchablePress = () => {
    console.log('FRESH TEMPLATE: TouchableOpacity pressed!');
    Alert.alert('SUCCESS!', 'TouchableOpacity works in fresh template!');
  };

  return (
    <View style={styles.container}>
      <Text>Fresh Expo Template - Touch Test</Text>
      
      <View style={{ marginTop: 30 }}>
        <Button 
          title="TEST BUTTON - FRESH TEMPLATE" 
          onPress={handleButtonPress}
        />
      </View>
      
      <TouchableOpacity 
        style={styles.touchable} 
        onPress={handleTouchablePress}
      >
        <Text style={styles.touchableText}>TEST TOUCHABLE - FRESH TEMPLATE</Text>
      </TouchableOpacity>
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchable: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  touchableText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
