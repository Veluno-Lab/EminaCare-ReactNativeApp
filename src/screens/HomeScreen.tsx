import React from 'react';
import { View, Text, Alert } from 'react-native';
import CustomButton from '../components/CustomButton';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to EminaCare!</Text>
      <CustomButton label="Click Me" onPress={() => Alert.alert('Hello!')} />
    </View>
  );    
}