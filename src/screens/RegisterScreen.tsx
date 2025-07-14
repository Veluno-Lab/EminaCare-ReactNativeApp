import React, { useState } from 'react';
import { Center, VStack, Box, Text, Button, HStack, Pressable, Image } from 'native-base';
import { TextInput } from 'react-native';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { Modal, View, ActivityIndicator} from 'react-native';
import { Alert } from 'react-native';

const BASE_URL = 'http://10.0.2.2:3000';
const apiClient = axios.create({
  baseURL: BASE_URL,
});
export default function RegisterScreen() {
  const navigation = useNavigation();
  const [role, setRole] = useState<'mommy' | 'caregiver' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formatted = selectedDate.toLocaleDateString('vi-VN');
      setBirthDate(formatted);
    }
  };
  const handleRegister = async () => {
    setIsLoading(true); // Bắt đầu loading
    let formattedDate = '';
    if (birthDate) {
      // Nếu birthDate là dạng dd/mm/yyyy
      const [day, month, year] = birthDate.split('/');
      formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    const payload = {
      email,
      password,
      fullName,
      phone,
      role,
      dateOfBirth: formattedDate,
    };

    console.log('Payload gửi API:', payload);
    try {
      const response = await axios.post('http://10.0.2.2:3000/auth/register', payload);
      console.log('Kết quả đăng ký:', response.data);
      setShowSuccessModal(true); // Hiện modal khi đăng ký thành công
      // Xử lý điều hướng hoặc thông báo ở đây nếu cần
    } catch (error: any) {
      console.log("ERROR:", error?.response?.data || error?.message);
      Alert.alert(
        'Đăng ký thất bại vl',
        error?.response?.data.message,
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false); // Kết thúc loading
    }
  };

  const renderRoleSelection = () => (
    <VStack space={6} width="85%">
      <VStack space={2}>
        <Text fontSize="2xl" fontWeight="bold" textAlign="center" color="#333">
          Bạn là ai?
        </Text>
        <Text fontSize="md" textAlign="center" color="#666">
          Chọn vai trò của bạn để tiếp tục
        </Text>
      </VStack>
      
      <HStack space={4} justifyContent="center">
        <Pressable onPress={() => setRole('mommy')}>
          <Box style={[
            styles.card,
            role === 'mommy' && styles.selectedCard
          ]}>
            <VStack space={3} alignItems="center">
              <Box 
                style={[
                  styles.logoContainer,
                  { backgroundColor: role === 'mommy' ? '#FF8FA3' : '#FFE5E9' }
                ]}
              >
                <Image
                  source={require('../../assets/mommy_icon.png')}
                  alt="Mommy"
                  size="xl"
                  resizeMode="contain"
                />
              </Box>
              <VStack space={1} alignItems="center">
                <Text 
                  fontSize="lg" 
                  fontWeight="bold" 
                  color={role === 'mommy' ? 'white' : '#333'}
                >
                  Mommy
                </Text>
                <Text 
                  fontSize="sm" 
                  textAlign="center"
                  color={role === 'mommy' ? 'rgba(255,255,255,0.8)' : '#666'}
                >
                  Tìm người chăm sóc
                </Text>
              </VStack>
            </VStack>
          </Box>
        </Pressable>

        <Pressable onPress={() => setRole('caregiver')}>
          <Box style={[
            styles.card,
            role === 'caregiver' && styles.selectedCard
          ]}>
            <VStack space={3} alignItems="center">
              <Box 
                style={[
                  styles.logoContainer,
                  { backgroundColor: role === 'caregiver' ? '#FF8FA3' : '#FFE5E9' }
                ]}
              >
                <Image
                  source={require('../../assets/caregiver_icon.png')}
                  alt="Caregiver"
                  size="xl"
                  resizeMode="contain"
                />
              </Box>
              <VStack space={1} alignItems="center">
                <Text 
                  fontSize="lg" 
                  fontWeight="bold" 
                  color={role === 'caregiver' ? 'white' : '#333'}
                >
                  Caregiver
                </Text>
                <Text 
                  fontSize="sm" 
                  textAlign="center"
                  color={role === 'caregiver' ? 'rgba(255,255,255,0.8)' : '#666'}
                >
                  Cung cấp dịch vụ chăm sóc
                </Text>
              </VStack>
            </VStack>
          </Box>
        </Pressable>
      </HStack>
    </VStack>
  );

  const renderForm = () => (
    <VStack space={4} width="85%">
      <VStack space={2}>
        <Center>
          <Image
            source={
              role === 'mommy'
                ? require('../../assets/mommy_icon.png')
                : require('../../assets/caregiver_icon.png')
            }
            alt="Logo"
            size="2xl"
            resizeMode="contain"
          />
        </Center>
        <Text fontSize="2xl" fontWeight="bold" textAlign="center" color="#333">
          Đăng ký tài khoản {role === 'mommy' ? 'Mommy' : 'Caregiver'}
        </Text>
        <Text fontSize="md" textAlign="center" color="#666">
          Vui lòng điền thông tin của bạn
        </Text>
      </VStack>
      
      <VStack space={3}>
        <TextInput 
          placeholder="Họ tên" 
          value={fullName} 
          onChangeText={setFullName} 
          style={{
            backgroundColor: 'white',
            borderRadius: 12,
            borderColor: '#FF6B81',
            borderWidth: 1,
            fontSize: 16,
            padding: 12,
          }}
        />

        <Pressable onPress={() => setShowDatePicker(true)}>
          <Box
            style={{
              backgroundColor: 'white',
              borderRadius: 12,
              borderColor: '#FF6B81',
              borderWidth: 1,
              padding: 12,
            }}
          >
            <Text color={birthDate ? "#333" : "#999"}>
              {birthDate ? birthDate : "Ngày sinh (dd/mm/yyyy)"}
            </Text>
          </Box>
        </Pressable>
        {showDatePicker && (
            <DateTimePicker
              value={birthDate ? new Date(birthDate.split('/').reverse().join('-')) : new Date()}
              mode="date"
              display="spinner"
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}
        
        <TextInput 
          placeholder="Số điện thoại" 
          value={phone} 
          onChangeText={setPhone} 
          style={{
            backgroundColor: 'white',
            borderRadius: 12,
            borderColor: '#FF6B81',
            borderWidth: 1,
            fontSize: 16,
            padding: 12,
          }}
          keyboardType="number-pad"
        />
        <TextInput 
          placeholder="Email" 
          value={email} 
          onChangeText={setEmail} 
          style={{
            backgroundColor: 'white',
            borderRadius: 12,
            borderColor: '#FF6B81',
            borderWidth: 1,
            fontSize: 16,
            padding: 12,
          }}
          keyboardType="email-address"
        />
        <TextInput 
          placeholder="Mật khẩu" 
          value={password} 
          onChangeText={setPassword} 
          style={{
            backgroundColor: 'white',
            borderRadius: 12,
            borderColor: '#FF6B81',
            borderWidth: 1,
            fontSize: 16,
            padding: 12,
          }}
          keyboardType="default"
        />
      </VStack>
      
      <VStack space={3} mt={3}>
        <Button 
          onPress={handleRegister} 
          borderRadius="full" 
          bg="#FF6B81" 
          shadow={3}
          py={3}
          px={10} // tăng padding ngang
          minWidth={220} // tăng minWidth
          _pressed={{ bg: "#FF5A6E" }}
        >
          <Text fontSize="sm" fontWeight="bold" color="white">
            Đăng ký
          </Text>
        </Button>
        <Button 
          variant="ghost" 
          onPress={() => setRole(null)}
          _pressed={{ bg: "rgba(255,107,129,0.1)" }}
        >
          <Text fontSize="sm" color="#FF6B81">
            Quay lại chọn vai trò
          </Text>
        </Button>
        <Pressable onPress={() => navigation.navigate('Login' as never)}>
          <Text fontSize="md" color="#666" textAlign="center" mt={2}>
            Đã có tài khoản? <Text color="#FF6B81" fontWeight="bold">Quay về đăng nhập</Text>
          </Text>
        </Pressable>
      </VStack>
    </VStack>
  );

  return (
    <Center flex={1} style={styles.container}>
      {role ? renderForm() : renderRoleSelection()}
      <Modal
        visible={showSuccessModal || isLoading}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.3)'
        }}>
          <View style={{
            backgroundColor: 'white',
            padding: 24,
            borderRadius: 12,
            alignItems: 'center',
            minWidth: 280
          }}>
            {isLoading ? (
              <>
                <Text style={{ marginTop: 16 }}>Đang xử lý đăng ký...</Text>
              </>
            ) : (
              <>
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
                  Đăng ký thành công!
                </Text>
                <Text style={{ marginBottom: 16, textAlign: 'center' }}>
                  Vui lòng kiểm tra email để xác nhận tài khoản.
                </Text>
                <Button
                  bg="#FF6B81"
                  onPress={() => {
                    setShowSuccessModal(false);
                    navigation.navigate('Login' as never);
                  }}
                >
                  <Text color="white">Quay về đăng nhập</Text>
                </Button>
              </>
            )}
          </View>
        </View>
      </Modal>
    </Center>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fceff1',
    width: '100%',
  },
  card: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFD1DC',
    backgroundColor: 'white',
    alignItems: 'center',
    width: 140,
    shadowColor: '#FF6B81',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  selectedCard: {
    backgroundColor: '#FF6B81',
    borderColor: '#FF6B81',
    shadowColor: '#FF6B81',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    transform: [{ scale: 1.02 }],
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B81',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
});