import React from 'react';
import { HStack, Text, VStack, Pressable, Box } from 'native-base';

interface NavBarDashboardProps {
  fullName: string;
  onProfilePress: () => void;
  onLogout: () => void;
}

const NavBarDashboard: React.FC<NavBarDashboardProps> = ({ fullName, onProfilePress, onLogout }) => {
  const [showMenu, setShowMenu] = React.useState(false);

  const menuItems = [
    { label: 'Hồ sơ cá nhân', onPress: onProfilePress },
    { label: 'Lịch sử Booking', onPress: () => {} },
    { label: 'Quản lý dịch vụ', onPress: () => {} },
    { label: 'Doanh thu & Thống kê', onPress: () => {} },
    { label: 'Cài đặt', onPress: () => {} },
    { label: 'Đăng xuất', onPress: onLogout },
  ];

  return (
    <Box position="relative">
      <HStack
        alignItems="center"
        justifyContent="space-between"
        px={4}
        py={3}
        bg="#ff6b81"
        shadow={2}
      >
        <Text fontSize="lg" color="white" fontWeight="bold">
          {fullName}
        </Text>
        
        <Pressable
          onPress={() => setShowMenu(!showMenu)}
          p={1}
        >
          <Box
            w={8}
            h={8}
            borderRadius="full"
            bg="rgba(255,255,255,0.2)"
            alignItems="center"
            justifyContent="center"
          >
            <Text color="white" fontSize="sm">👤</Text>
          </Box>
        </Pressable>
      </HStack>

      {showMenu && (
        <VStack
          position="absolute"
          top={16}
          right={4}
          w={48}
          bg="white"
          borderRadius="md"
          shadow={4}
          zIndex={1000}
        >
          {menuItems.map((item, index) => (
            <Pressable
              key={index}
              onPress={() => {
                setShowMenu(false);
                item.onPress();
              }}
              px={4}
              py={3}
              borderBottomWidth={index < menuItems.length - 1 ? 1 : 0}
              borderBottomColor="gray.200"
            >
              <Text fontSize="sm" color="gray.700">
                {item.label}
              </Text>
            </Pressable>
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default NavBarDashboard;