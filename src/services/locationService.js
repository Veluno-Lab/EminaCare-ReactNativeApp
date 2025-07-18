// import { Platform, Alert, PermissionsAndroid } from 'react-native';

// // Import với try-catch để tránh crash
// let Geolocation = null;
// try {
//   Geolocation = require('react-native-geolocation-service');
// } catch (error) {
//   console.error('Không thể import Geolocation module:', error);
// }

// const safeLog = (message, data = null) => {
//   try {
//     if (data) {
//       console.log(`[LOCATION_SAFE] ${message}`, JSON.stringify(data, null, 2));
//     } else {
//       console.log(`[LOCATION_SAFE] ${message}`);
//     }
//   } catch (e) {
//     console.log(`[LOCATION_SAFE] ${message}`);
//   }
// };

// const safeError = (message, error = null) => {
//   try {
//     console.error(`[LOCATION_ERROR] ${message}`, error);
//   } catch (e) {
//     console.error(`[LOCATION_ERROR] ${message}`);
//   }
// };

// // Kiểm tra module có sẵn không
// export const isLocationModuleAvailable = () => {
//   const available = !!(Geolocation && typeof Geolocation.getCurrentPosition === 'function');
//   safeLog('Location module available:', available);
//   return available;
// };

// // Version an toàn của requestLocationPermission
// export const requestLocationPermission = async () => {
//   safeLog('=== requestLocationPermission SAFE ===');
  
//   try {
//     if (Platform.OS !== 'android') {
//       safeLog('Không phải Android, trả về true');
//       return true;
//     }

//     if (!PermissionsAndroid || !PermissionsAndroid.request) {
//       safeError('PermissionsAndroid không có sẵn');
//       return false;
//     }

//     safeLog('Yêu cầu quyền Android...');
    
//     const granted = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//       {
//         title: 'Yêu cầu quyền truy cập vị trí',
//         message: 'Ứng dụng cần quyền truy cập vị trí để hiển thị thông tin phù hợp.',
//         buttonNeutral: 'Hỏi lại sau',
//         buttonNegative: 'Từ chối',
//         buttonPositive: 'Đồng ý',
//       },
//     );
    
//     safeLog('Kết quả quyền:', granted);
    
//     const result = granted === PermissionsAndroid.RESULTS.GRANTED;
//     safeLog('Permission granted:', result);
    
//     return result;
    
//   } catch (error) {
//     safeError('Lỗi trong requestLocationPermission:', error);
//     return false;
//   }
// };

// // Version an toàn của user consent
// export const askUserForLocationPermission = () => {
//   safeLog('=== askUserForLocationPermission SAFE ===');
  
//   return new Promise((resolve) => {
//     try {
//       if (!Alert || !Alert.alert) {
//         safeError('Alert không có sẵn');
//         resolve(false);
//         return;
//       }

//       Alert.alert(
//         'Sử dụng vị trí',
//         'Ứng dụng cần truy cập vị trí của bạn để cung cấp thông tin phù hợp. Bạn có muốn cho phép không?',
//         [
//           {
//             text: 'Từ chối',
//             onPress: () => {
//               safeLog('User từ chối');
//               resolve(false);
//             },
//             style: 'cancel',
//           },
//           {
//             text: 'Đồng ý',
//             onPress: () => {
//               safeLog('User đồng ý');
//               resolve(true);
//             },
//           },
//         ],
//         { cancelable: false }
//       );
//     } catch (error) {
//       safeError('Lỗi trong askUserForLocationPermission:', error);
//       resolve(false);
//     }
//   });
// };

// // Version cực kỳ an toàn của getCurrentLocation
// export const getCurrentLocation = async () => {
//   safeLog('=== getCurrentLocation ULTRA SAFE ===');
  
//   try {
//     // Kiểm tra module có sẵn
//     if (!isLocationModuleAvailable()) {
//       throw new Error('Geolocation module không có sẵn hoặc chưa được cài đặt đúng cách');
//     }

//     // Hỏi user consent
//     safeLog('Hỏi user consent...');
//     const userConsent = await askUserForLocationPermission();
//     safeLog('User consent:', userConsent);
    
//     if (!userConsent) {
//       throw new Error('Người dùng từ chối sử dụng vị trí');
//     }

//     // Kiểm tra quyền
//     safeLog('Kiểm tra quyền...');
//     const hasPermission = await requestLocationPermission();
//     safeLog('Has permission:', hasPermission);
    
//     if (!hasPermission) {
//       throw new Error('Quyền truy cập vị trí bị từ chối');
//     }

//     // Lấy vị trí
//     safeLog('Bắt đầu lấy vị trí...');
    
//     return new Promise((resolve, reject) => {
//       let isCompleted = false;
      
//       const options = {
//         enableHighAccuracy: false, // Giảm xuống false để tránh lỗi
//         timeout: 10000, // Giảm timeout xuống 10s
//         maximumAge: 60000, // Tăng maximumAge để dùng cache
//       };

//       safeLog('Options:', options);

//       // Timeout backup
//       const timeoutId = setTimeout(() => {
//         if (!isCompleted) {
//           isCompleted = true;
//           safeError('Timeout sau 15 giây');
//           reject(new Error('Timeout khi lấy vị trí'));
//         }
//       }, 15000);

//       try {
//         if (!Geolocation || typeof Geolocation.getCurrentPosition !== 'function') {
//           throw new Error('getCurrentPosition không có sẵn');
//         }

//         Geolocation.getCurrentPosition(
//           (position) => {
//             safeLog('Success callback called');
            
//             if (isCompleted) {
//               safeLog('Đã completed, bỏ qua');
//               return;
//             }
            
//             isCompleted = true;
//             clearTimeout(timeoutId);
            
//             try {
//               if (!position || !position.coords) {
//                 throw new Error('Dữ liệu vị trí không hợp lệ');
//               }
              
//               const { latitude, longitude } = position.coords;
              
//               if (typeof latitude !== 'number' || typeof longitude !== 'number' || 
//                   isNaN(latitude) || isNaN(longitude)) {
//                 throw new Error('Tọa độ không hợp lệ');
//               }
              
//               safeLog('Thành công:', { latitude, longitude });
//               resolve({ latitude, longitude });
              
//             } catch (processError) {
//               safeError('Lỗi xử lý position:', processError);
//               reject(processError);
//             }
//           },
//           (error) => {
//             safeLog('Error callback called');
            
//             if (isCompleted) {
//               safeLog('Đã completed, bỏ qua error');
//               return;
//             }
            
//             isCompleted = true;
//             clearTimeout(timeoutId);
            
//             safeError('Geolocation error:', error);
            
//             let errorMessage = 'Lỗi không xác định';
            
//             try {
//               switch (error?.code) {
//                 case 1:
//                   errorMessage = 'Quyền truy cập vị trí bị từ chối';
//                   break;
//                 case 2:
//                   errorMessage = 'Vị trí không khả dụng - Vui lòng bật GPS';
//                   break;
//                 case 3:
//                   errorMessage = 'Timeout khi lấy vị trí';
//                   break;
//                 default:
//                   errorMessage = error?.message || 'Lỗi không xác định';
//               }
//             } catch (e) {
//               safeError('Lỗi xử lý error:', e);
//             }

//             reject(new Error(errorMessage));
//           },
//           options
//         );
        
//         safeLog('Đã gọi getCurrentPosition');
        
//       } catch (callError) {
//         safeError('Lỗi khi gọi getCurrentPosition:', callError);
//         if (!isCompleted) {
//           isCompleted = true;
//           clearTimeout(timeoutId);
//           reject(new Error(`Lỗi khi gọi getCurrentPosition: ${callError.message}`));
//         }
//       }
//     });
    
//   } catch (error) {
//     safeError('Lỗi trong getCurrentLocation:', error);
//     throw error;
//   }
// };

// // Hàm kiểm tra quyền an toàn
// export const checkLocationPermission = async () => {
//   safeLog('=== checkLocationPermission SAFE ===');
  
//   try {
//     if (Platform.OS !== 'android') {
//       return true;
//     }

//     if (!PermissionsAndroid || !PermissionsAndroid.check) {
//       safeError('PermissionsAndroid.check không có sẵn');
//       return false;
//     }

//     const granted = await PermissionsAndroid.check(
//       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
//     );
    
//     safeLog('Check result:', granted);
//     return granted;
    
//   } catch (error) {
//     safeError('Lỗi check permission:', error);
//     return false;
//   }
// };

// // Hàm test đơn giản và an toàn
// export const testLocationSetup = async () => {
//   safeLog('=== TEST LOCATION SETUP ===');
  
//   try {
//     safeLog('1. Platform OS:', Platform.OS);
//     safeLog('2. Geolocation exists:', !!Geolocation);
    
//     if (Geolocation) {
//       safeLog('3. getCurrentPosition method exists:', typeof Geolocation.getCurrentPosition === 'function');
//     }
    
//     safeLog('4. PermissionsAndroid exists:', !!PermissionsAndroid);
    
//     if (PermissionsAndroid) {
//       safeLog('5. PermissionsAndroid.request exists:', typeof PermissionsAndroid.request === 'function');
//       safeLog('6. PermissionsAndroid.check exists:', typeof PermissionsAndroid.check === 'function');
//     }
    
//     safeLog('7. Alert exists:', !!Alert);
    
//     if (Alert) {
//       safeLog('8. Alert.alert exists:', typeof Alert.alert === 'function');
//     }
    
//     safeLog('=== TEST COMPLETED ===');
//     return true;
    
//   } catch (error) {
//     safeError('Test failed:', error);
//     return false;
//   }
// };

import { Platform, Alert, PermissionsAndroid } from 'react-native';

// Import và kiểm tra Geolocation module
let Geolocation = null;
let GeolocationError = null;

try {
  Geolocation = require('react-native-geolocation-service');
  console.log('[LOCATION_INIT] Geolocation module imported successfully');
  console.log('[LOCATION_INIT] Geolocation object:', Geolocation);
  console.log('[LOCATION_INIT] Available methods:', Object.keys(Geolocation || {}));
} catch (error) {
  console.error('[LOCATION_INIT] Không thể import Geolocation:', error);
  GeolocationError = error;
}

const safeLog = (message, data = null) => {
  try {
    if (data !== null && data !== undefined) {
      if (typeof data === 'object') {
        console.log(`[LOCATION_SAFE] ${message}`, JSON.stringify(data, null, 2));
      } else {
        console.log(`[LOCATION_SAFE] ${message}`, data);
      }
    } else {
      console.log(`[LOCATION_SAFE] ${message}`);
    }
  } catch (e) {
    console.log(`[LOCATION_SAFE] ${message}`);
  }
};

const safeError = (message, error = null) => {
  try {
    console.error(`[LOCATION_ERROR] ${message}`, error);
  } catch (e) {
    console.error(`[LOCATION_ERROR] ${message}`);
  }
};

// Kiểm tra chi tiết module
export const debugGeolocationModule = () => {
  safeLog('=== DEBUG GEOLOCATION MODULE ===');
  
  try {
    safeLog('1. Import error:', GeolocationError);
    safeLog('2. Geolocation exists:', !!Geolocation);
    safeLog('3. Geolocation type:', typeof Geolocation);
    
    if (Geolocation) {
      safeLog('4. Geolocation keys:', Object.keys(Geolocation));
      safeLog('5. getCurrentPosition exists:', 'getCurrentPosition' in Geolocation);
      safeLog('6. getCurrentPosition type:', typeof Geolocation.getCurrentPosition);
      safeLog('7. getCurrentPosition value:', Geolocation.getCurrentPosition);
      
      // Kiểm tra các method khác
      safeLog('8. watchPosition exists:', 'watchPosition' in Geolocation);
      safeLog('9. clearWatch exists:', 'clearWatch' in Geolocation);
      safeLog('10. requestAuthorization exists:', 'requestAuthorization' in Geolocation);
    }
    
    safeLog('=== DEBUG COMPLETED ===');
    return true;
    
  } catch (error) {
    safeError('Debug failed:', error);
    return false;
  }
};

// Kiểm tra module có sẵn và hoạt động
export const isLocationModuleAvailable = () => {
  try {
    const hasModule = !!(Geolocation && typeof Geolocation.getCurrentPosition === 'function');
    safeLog('Location module available:', hasModule);
    
    if (!hasModule) {
      safeLog('Module check details:', {
        geolocationExists: !!Geolocation,
        getCurrentPositionType: typeof Geolocation?.getCurrentPosition,
        hasGetCurrentPosition: Geolocation && 'getCurrentPosition' in Geolocation
      });
    }
    
    return hasModule;
  } catch (error) {
    safeError('Error checking module availability:', error);
    return false;
  }
};

// Alternative implementation sử dụng navigator.geolocation
export const getCurrentLocationFallback = async () => {
  safeLog('=== FALLBACK GEOLOCATION ===');
  
  return new Promise((resolve, reject) => {
    try {
      // Kiểm tra navigator.geolocation (web API)
      if (typeof navigator !== 'undefined' && navigator.geolocation) {
        safeLog('Sử dụng navigator.geolocation');
        
        const options = {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000
        };
        
        navigator.geolocation.getCurrentPosition(
          (position) => {
            safeLog('Navigator geolocation success:', position);
            const { latitude, longitude } = position.coords;
            resolve({ latitude, longitude });
          },
          (error) => {
            safeError('Navigator geolocation error:', error);
            reject(new Error(`Navigator geolocation error: ${error.message}`));
          },
          options
        );
      } else {
        reject(new Error('Không có geolocation API nào khả dụng'));
      }
    } catch (error) {
      safeError('Fallback error:', error);
      reject(error);
    }
  });
};

// Version an toàn của requestLocationPermission
export const requestLocationPermission = async () => {
  safeLog('=== requestLocationPermission SAFE ===');
  
  try {
    if (Platform.OS !== 'android') {
      safeLog('Không phải Android, trả về true');
      return true;
    }

    if (!PermissionsAndroid || !PermissionsAndroid.request) {
      safeError('PermissionsAndroid không có sẵn');
      return false;
    }

    safeLog('Yêu cầu quyền Android...');
    
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Yêu cầu quyền truy cập vị trí',
        message: 'Ứng dụng cần quyền truy cập vị trí để hiển thị thông tin phù hợp.',
        buttonNeutral: 'Hỏi lại sau',
        buttonNegative: 'Từ chối',
        buttonPositive: 'Đồng ý',
      },
    );
    
    safeLog('Kết quả quyền:', granted);
    safeLog('GRANTED constant:', PermissionsAndroid.RESULTS.GRANTED);
    
    const result = granted === PermissionsAndroid.RESULTS.GRANTED;
    safeLog('Permission granted:', result);
    
    return result;
    
  } catch (error) {
    safeError('Lỗi trong requestLocationPermission:', error);
    return false;
  }
};

// Version an toàn của user consent
export const askUserForLocationPermission = () => {
  safeLog('=== askUserForLocationPermission SAFE ===');
  
  return new Promise((resolve) => {
    try {
      Alert.alert(
        'Sử dụng vị trí',
        'Ứng dụng cần truy cập vị trí của bạn để cung cấp thông tin phù hợp. Bạn có muốn cho phép không?',
        [
          {
            text: 'Từ chối',
            onPress: () => {
              safeLog('User từ chối');
              resolve(false);
            },
            style: 'cancel',
          },
          {
            text: 'Đồng ý',
            onPress: () => {
              safeLog('User đồng ý');
              resolve(true);
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      safeError('Lỗi trong askUserForLocationPermission:', error);
      resolve(false);
    }
  });
};

// Version chính với fallback
export const getCurrentLocation = async () => {
  safeLog('=== getCurrentLocation WITH FALLBACK ===');
  
  try {
    // Hỏi user consent
    safeLog('Hỏi user consent...');
    const userConsent = await askUserForLocationPermission();
    safeLog('User consent:', userConsent);
    
    if (!userConsent) {
      throw new Error('Người dùng từ chối sử dụng vị trí');
    }

    // Kiểm tra quyền
    safeLog('Kiểm tra quyền...');
    const hasPermission = await requestLocationPermission();
    safeLog('Has permission:', hasPermission);
    
    if (!hasPermission) {
      throw new Error('Quyền truy cập vị trí bị từ chối');
    }

    // Thử dùng react-native-geolocation-service trước
    if (isLocationModuleAvailable()) {
      safeLog('Sử dụng react-native-geolocation-service');
      
      return new Promise((resolve, reject) => {
        let isCompleted = false;
        
        const options = {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 60000,
        };

        const timeoutId = setTimeout(() => {
          if (!isCompleted) {
            isCompleted = true;
            safeLog('Timeout, thử fallback...');
            // Thử fallback
            getCurrentLocationFallback()
              .then(resolve)
              .catch(reject);
          }
        }, 12000);

        try {
          Geolocation.getCurrentPosition(
            (position) => {
              if (isCompleted) return;
              isCompleted = true;
              clearTimeout(timeoutId);
              
              const { latitude, longitude } = position.coords;
              safeLog('Native geolocation success:', { latitude, longitude });
              resolve({ latitude, longitude });
            },
            (error) => {
              if (isCompleted) return;
              isCompleted = true;
              clearTimeout(timeoutId);
              
              safeError('Native geolocation error, thử fallback:', error);
              // Thử fallback
              getCurrentLocationFallback()
                .then(resolve)
                .catch(reject);
            },
            options
          );
        } catch (callError) {
          if (!isCompleted) {
            isCompleted = true;
            clearTimeout(timeoutId);
            safeError('Lỗi gọi native geolocation, thử fallback:', callError);
            // Thử fallback
            getCurrentLocationFallback()
              .then(resolve)
              .catch(reject);
          }
        }
      });
    } else {
      // Dùng fallback ngay
      safeLog('Native module không khả dụng, dùng fallback');
      return await getCurrentLocationFallback();
    }
    
  } catch (error) {
    safeError('Lỗi trong getCurrentLocation:', error);
    throw error;
  }
};

// Test function cải tiến
export const testLocationSetup = () => {
  safeLog('=== TEST LOCATION SETUP ===');
  
  try {
    safeLog('1. Platform OS:', Platform.OS);
    safeLog('2. Geolocation exists:', !!Geolocation);
    safeLog('3. Geolocation type:', typeof Geolocation);
    
    if (Geolocation) {
      safeLog('4. getCurrentPosition exists:', 'getCurrentPosition' in Geolocation);
      safeLog('5. getCurrentPosition type:', typeof Geolocation.getCurrentPosition);
      safeLog('6. getCurrentPosition function:', typeof Geolocation.getCurrentPosition === 'function');
    }
    
    safeLog('7. Navigator geolocation exists:', !!(typeof navigator !== 'undefined' && navigator.geolocation));
    safeLog('8. PermissionsAndroid exists:', !!PermissionsAndroid);
    safeLog('9. Alert exists:', !!Alert);
    
    // Test module availability
    const moduleAvailable = isLocationModuleAvailable();
    safeLog('10. Module available:', moduleAvailable);
    
    safeLog('=== TEST COMPLETED ===');
    return true;
    
  } catch (error) {
    safeError('Test failed:', error);
    return false;
  }
};

// Hàm để fix module nếu cần
export const tryFixGeolocationModule = async () => {
  safeLog('=== TRY FIX GEOLOCATION MODULE ===');
  
  try {
    // Thử import lại
    const GeolocationService = require('react-native-geolocation-service');
    
    if (GeolocationService && typeof GeolocationService.getCurrentPosition === 'function') {
      Geolocation = GeolocationService;
      safeLog('Module fixed successfully');
      return true;
    } else {
      safeLog('Module vẫn có vấn đề');
      return false;
    }
  } catch (error) {
    safeError('Không thể fix module:', error);
    return false;
  }
};