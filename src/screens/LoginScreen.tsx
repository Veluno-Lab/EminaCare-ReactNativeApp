import React, { useState } from 'react';
import { Center, VStack, Input, Button, Text, Image, Box } from 'native-base';
import { StyleSheet } from 'react-native';

export default function LoginScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    if (isLogin) {
      console.log('Login with', email, password);
    } else {
      console.log('Register with', email, password);
    }
  };

  return (
    <Center flex={1} px={6} style={styles.container}>
      <Box mb={10} alignItems="center">
        <Image
          source={require('../../assets/logo.png')}
          alt="Logo"
          size="2xl"
          resizeMode="contain"
        />
        <Text style={styles.text} fontSize="2xl" fontWeight="bold" mt={4}>
          Emina Care
        </Text>
      </Box>

      <VStack space={4} width="100%">
        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          variant="rounded"
          bg="white"
          _focus={{ borderColor: 'primary.500' }}
        />
        <Input
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          type="password"
          variant="rounded"
          bg="white"
          _focus={{ borderColor: 'primary.500' }}
        />
        <Button onPress={handleSubmit} colorScheme="emerald" borderRadius="full">
          {isLogin ? 'Login' : 'Register'}
        </Button>
        <Text
          onPress={() => setIsLogin(!isLogin)}
          style={styles.text}
          textAlign="center"
          mt={2}
          underline
        >
          {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
        </Text>
      </VStack>
    </Center>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fceff1',
  },
  text: {
    color: '#333',
  },
});
