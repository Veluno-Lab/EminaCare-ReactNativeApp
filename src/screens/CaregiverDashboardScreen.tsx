import React, { useState, useEffect } from 'react';
import { Alert, Platform, Linking } from 'react-native';
import { Box, VStack, HStack, Button, Center, Divider, ScrollView, Text } from 'native-base';
import NavBarDashboard from '../components/NavbarDashboard';
import { getCurrentLocation, checkLocationPermission, testLocationSetup } from '../services/locationService.js';

export default function CaregiverDashboardScreen({ navigation }: any) {
    // Gọi test này trước khi gọi getCurrentLocation
  const runTest = async () => {
    console.log('Bắt đầu test...');
    const result = await testLocationSetup();
    console.log('Test result:', result);
  };// Gọi trong useEffect hoặc button press
  runTest();
  const [currentLocation, setCurrentLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [locationError, setLocationError] = useState<string>('');
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(true);
  const [hasTriedLocation, setHasTriedLocation] = useState<boolean>(false);
  
  // Default location (Ho Chi Minh City)
  const defaultLocation = {
    latitude: 10.762622,
    longitude: 106.660172
  };

  // Error message mapping
  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case 'USER_DENIED_CONSENT':
        return 'Bạn có thể bật vị trí trong cài đặt để có trải nghiệm tốt hơn';
      case 'PERMISSION_DENIED':
        return 'Quyền truy cập vị trí bị từ chối';
      case 'LOCATION_SERVICE_DISABLED':
        return 'Dịch vụ vị trí chưa được bật';
      case 'LOCATION_TIMEOUT':
        return 'Không thể lấy vị trí (timeout)';
      case 'INVALID_POSITION_DATA':
        return 'Dữ liệu vị trí không hợp lệ';
      case 'GEOLOCATION_CALL_ERROR':
        return 'Lỗi khi gọi dịch vụ vị trí';
      default:
        return 'Đang sử dụng vị trí mặc định';
    }
  };

  const showLocationErrorAlert = (errorCode: string) => {
    switch (errorCode) {
      case 'PERMISSION_DENIED':
        Alert.alert(
          'Cần quyền truy cập vị trí',
          'Để sử dụng tính năng này, vui lòng vào Cài đặt > Ứng dụng > [Tên ứng dụng] > Quyền và bật quyền Vị trí.',
          [
            { text: 'Hủy', style: 'cancel' },
            { 
              text: 'Đi đến Cài đặt', 
              onPress: () => {
                if (Platform.OS === 'android') {
                  Linking.openSettings();
                }
              }
            },
          ]
        );
        break;
      case 'LOCATION_SERVICE_DISABLED':
        Alert.alert(
          'Dịch vụ vị trí bị tắt',
          'Vui lòng bật dịch vụ vị trí trong cài đặt thiết bị để sử dụng tính năng này.',
          [{ text: 'OK' }]
        );
        break;
      // Không hiển thị alert cho các lỗi khác
    }
  };
  
  useEffect(() => {
    const fetchLocation = async () => {
      if (hasTriedLocation) return; // Tránh multiple calls
      
      try {
        setIsLoadingLocation(true);
        setHasTriedLocation(true);
        console.log('Đang thử lấy vị trí...');
        
        // Kiểm tra quyền trước khi gọi getCurrentLocation
        const hasPermission = await checkLocationPermission();
        
        if (hasPermission) {
          console.log('Đã có quyền, lấy vị trí trực tiếp...');
          const location = await getCurrentLocation();
          
          if (location) {
            console.log('Lấy vị trí thành công:', location);
            setCurrentLocation(location);
            setLocationError('');
          }
        } else {
          // Chưa có quyền, sử dụng vị trí mặc định
          console.log('Chưa có quyền, sử dụng vị trí mặc định');
          setCurrentLocation(defaultLocation);
          setLocationError('Sử dụng vị trí mặc định');
        }
      } catch (error: any) {
        console.error('Lỗi khi lấy vị trí:', error);
        
        // Sử dụng vị trí mặc định khi có lỗi
        setCurrentLocation(defaultLocation);
        
        // Xử lý error message
        const errorCode = error.message || 'UNKNOWN_ERROR';
        setLocationError(getErrorMessage(errorCode));
        
        // Chỉ hiển thị alert cho một số lỗi cụ thể
        if (errorCode === 'PERMISSION_DENIED' || errorCode === 'LOCATION_SERVICE_DISABLED') {
          setTimeout(() => {
            showLocationErrorAlert(errorCode);
          }, 500); // Delay để tránh conflict với các alert khác
        }
      } finally {
        setIsLoadingLocation(false);
      }
    };

    fetchLocation();
  }, [hasTriedLocation]);

  // Hàm để người dùng thử lại việc lấy vị trí
  const handleRetryLocation = async () => {
    if (isLoadingLocation) return; // Tránh multiple calls
    
    try {
      setIsLoadingLocation(true);
      setLocationError('');
      
      console.log('Người dùng thử lại lấy vị trí...');
      // const location = await getCurrentLocation();
      const location = false;
      
      if (location) {
        setCurrentLocation(location);
        setLocationError('');
        Alert.alert('Thành công', 'Đã cập nhật vị trí của bạn!');
      }
    } catch (error: any) {
      console.error('Lỗi khi thử lại lấy vị trí:', error);
      
      // Giữ nguyên vị trí mặc định
      setCurrentLocation(defaultLocation);
      
      const errorCode = error.message || 'UNKNOWN_ERROR';
      setLocationError(getErrorMessage(errorCode));
      
      // Chỉ hiển thị alert cho permission denied
      if (errorCode === 'PERMISSION_DENIED') {
        showLocationErrorAlert(errorCode);
      } else if (errorCode !== 'USER_DENIED_CONSENT') {
        // Hiển thị thông báo chung cho các lỗi khác (trừ user deny)
        Alert.alert(
          'Thông báo',
          'Không thể lấy vị trí của bạn. Ứng dụng sẽ tiếp tục sử dụng vị trí mặc định.',
          [{ text: 'OK' }]
        );
      }
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const [stats, setStats] = useState({
    todayBookings: 0,
    thisMonthIncome: 0,
    pendingBookings: 0,
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    const data = {
      todayBookings: 3,
      thisMonthIncome: 1500000,
      pendingBookings: 2,
    };
    setStats(data);
  };

  return (
    <Box flex={1} bg="#fceff1">
      <NavBarDashboard
        fullName="Nguyen Ngoc Hieu"
        onProfilePress={() => console.log('Profile pressed')}
        onLogout={() => console.log('Logout pressed')}
      />
      
      <ScrollView 
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <VStack space={1} mb={6}>
          <Text fontSize="3xl" fontWeight="bold" color="gray.800">
            Tổng quan
          </Text>
          <Text fontSize="md" color="gray.600">
            Chào mừng bạn trở lại! 👋
          </Text>
          
          {/* Hiển thị thông tin vị trí */}
          {isLoadingLocation ? (
            <Box mt={2} p={3} bg="gray.50" borderRadius={8}>
              <Text fontSize="sm" color="gray.600">
                Đang lấy thông tin vị trí...
              </Text>
            </Box>
          ) : currentLocation ? (
            <Box mt={2} p={3} bg="blue.50" borderRadius={8} borderLeftWidth={4} borderLeftColor="blue.500">
              <HStack justifyContent="space-between" alignItems="center">
                <VStack flex={1}>
                  <Text fontSize="sm" color="gray.700" fontWeight="medium">
                    Vị trí hiện tại:
                  </Text>
                  <Text fontSize="xs" color="gray.600">
                    Kinh độ: {currentLocation.longitude.toFixed(6)}
                  </Text>
                  <Text fontSize="xs" color="gray.600">
                    Vĩ độ: {currentLocation.latitude.toFixed(6)}
                  </Text>
                </VStack>
                {locationError && (
                  <Button
                    size="sm"
                    variant="outline"
                    colorScheme="blue"
                    onPress={handleRetryLocation}
                    isLoading={isLoadingLocation}
                    isDisabled={isLoadingLocation}
                  >
                    Thử lại
                  </Button>
                )}
              </HStack>
              {locationError && (
                <Text fontSize="xs" color="orange.600" mt={1}>
                  {locationError}
                </Text>
              )}
            </Box>
          ) : (
            <Box mt={2} p={3} bg="orange.50" borderRadius={8} borderLeftWidth={4} borderLeftColor="orange.500">
              <HStack justifyContent="space-between" alignItems="center">
                <VStack flex={1}>
                  <Text fontSize="sm" color="orange.700">
                    Không thể lấy vị trí
                  </Text>
                  <Text fontSize="xs" color="orange.600">
                    Đang sử dụng vị trí mặc định
                  </Text>
                </VStack>
                <Button
                  size="sm"
                  variant="outline"
                  colorScheme="orange"
                  onPress={handleRetryLocation}
                  isLoading={isLoadingLocation}
                  isDisabled={isLoadingLocation}
                >
                  Thử lại
                </Button>
              </HStack>
            </Box>
          )}
        </VStack>

        {/* Stats Cards */}
        <VStack space={4} mb={6}>
          {/* Top row */}
          <HStack space={4}>
            <Box 
              flex={1} 
              bg="white" 
              p={5} 
              borderRadius="xl" 
              shadow={2}
              alignItems="center"
              borderWidth={1}
              borderColor="gray.100"
            >
              <Text fontSize="md" color="gray.700" fontWeight="medium" mb={2}>
                Hôm nay
              </Text>
              <Text fontSize="2xl" fontWeight="bold" color="#ff6b81" mb={1}>
                {stats.todayBookings}
              </Text>
              <Text fontSize="sm" color="gray.700">
                Booking
              </Text>
            </Box>

            <Box 
              flex={1} 
              bg="white" 
              p={5} 
              borderRadius="xl" 
              shadow={2}
              alignItems="center"
              borderWidth={1}
              borderColor="gray.100"
            >
              <Text fontSize="md" color="gray.700" fontWeight="medium" mb={2}>
                Đang chờ
              </Text>
              <Text fontSize="2xl" fontWeight="bold" color="#ff6b81" mb={1}>
                {stats.pendingBookings}
              </Text>
              <Text fontSize="sm" color="gray.700">
                Booking
              </Text>
            </Box>
          </HStack>
          
          {/* Bottom row - Income card full width */}
          <Box 
            bg="#ff6b81" 
            p={5} 
            borderRadius="xl" 
            shadow={2}
            alignItems="center"
            borderWidth={1}
            borderColor="gray.100"
          >
            <Text fontSize="md" color="white" fontWeight="medium" mb={2}>
              Thu nhập tháng này
            </Text>
            <Text fontSize="2xl" fontWeight="bold" color="white" mb={1}>
              {stats.thisMonthIncome.toLocaleString()}đ
            </Text>
            <Text fontSize="sm" color="white">
              Doanh thu
            </Text>
          </Box>
        </VStack>

        {/* Decorative Divider */}
        <Center mb={6}>
          <Box w="50%" h="1" bg="gray.200" borderRadius="full" />
        </Center>

        {/* Quick Actions */}
        <VStack space={1} mb={4}>
          <Text fontSize="2xl" fontWeight="bold" color="gray.800">
            Quản lý nhanh
          </Text>
          <Text fontSize="sm" color="gray.600" mb={4}>
            Các tính năng thường dùng
          </Text>
        </VStack>

        <VStack space={3}>
          <Button 
            colorScheme="pink" 
            borderRadius="full" 
            size="lg"
            onPress={() => navigation.navigate('ManageServices')}
            _text={{ fontSize: "md", fontWeight: "semibold" }}
          >
            Quản lý dịch vụ
          </Button>
          
          <Button 
            variant="outline" 
            borderRadius="full" 
            size="lg"
            onPress={() => navigation.navigate('Profile')}
            _text={{ fontSize: "md", fontWeight: "semibold" }}
            borderColor="#ff6b81"
          >
            Cập nhật hồ sơ
          </Button>
          
          <Button 
            variant="outline" 
            borderRadius="full" 
            size="lg"
            onPress={() => navigation.navigate('BookingHistory')}
            _text={{ fontSize: "md", fontWeight: "semibold" }}
            borderColor="#ff6b81"
          >
            Lịch sử booking
          </Button>
        </VStack>

        {/* Bottom spacing */}
        <Box h={8} />
      </ScrollView>
    </Box>
  );
}