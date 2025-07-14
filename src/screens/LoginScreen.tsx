import React, { useState } from 'react';
import { Center, VStack, Input, Button, Text, Image, Box } from 'native-base';
import { StyleSheet } from 'react-native';

export default function LoginScreen({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        console.log('Login with', email, password);
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
                <Text
                    style={styles.brandName}
                    fontSize="3xl"
                    fontWeight="extrabold"
                    mt={4}
                >
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
                    _focus={{ borderWidth: 1 }}
                />
                <Input
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    type="password"
                    variant="rounded"
                    bg="white"
                    _focus={{ borderWidth: 1 }}
                />
                <Button
                    onPress={handleLogin}
                    borderRadius="full"
                    bg="#ff6b81"
                    _text={{
                        fontWeight: 'bold',
                        fontSize: 'md',
                    }}
                    shadow={3}
                    py={3}
                >
                    Login
                </Button>
                <Text
                    onPress={() => navigation.navigate('Register')}
                    style={styles.text}
                    textAlign="center"
                    mt={2}
                    underline
                >
                    Don't have an account? Register
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
    brandName: {
        color: '#ff6b81',
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
        letterSpacing: 2,
    },
});
