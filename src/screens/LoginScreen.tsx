import React, { useState } from 'react';
import { Center, VStack, Input, Button, Text, Image, Box } from 'native-base';
import { StyleSheet, Alert, TextInput } from 'react-native';
import axios from 'axios';

export default function LoginScreen({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        try {
            setLoading(true);
            const response = await axios.post('http://10.0.2.2:3000/auth/login', {
                email,
                password
            });

            const { token, user } = response.data;
            console.log(response.data)

            console.log('User logged in:', user);

            if (user.role === 'caregiver') {
                navigation.replace('CaregiverDashboardScreen');
            } else {
                // Navigate sang màn phù hợp khác (mommy chẳng hạn)
                navigation.replace('MommyDashboardScreen'); 
            }
        } catch (error: any) {
            console.error('Login failed', error);
            Alert.alert('Error', 'Login failed: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
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
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <Button
                    onPress={handleLogin}
                    isLoading={loading}
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
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: 'white',
        borderRadius: 25,
        paddingHorizontal: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
});