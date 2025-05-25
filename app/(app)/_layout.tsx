import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { Tabs } from 'expo-router/tabs';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import CustomDrawerContent from '@/components/navigation/CustomDrawerContent';

export default function AppLayout() {
  const { theme } = useSelector((state: RootState) => state.settings);
  
  return (
    <Drawer
      screenOptions={{
        headerTintColor: theme === 'dark' ? 'white' : COLORS.PRIMARY,
        headerStyle: {
          backgroundColor: theme === 'dark' ? COLORS.PRIMARY_DARK : 'white',
        },
        drawerActiveBackgroundColor: COLORS.PRIMARY_LIGHT,
        drawerActiveTintColor: 'white',
        drawerInactiveTintColor: theme === 'dark' ? 'white' : COLORS.SECONDARY_DARK,
        drawerStyle: {
          backgroundColor: theme === 'dark' ? COLORS.PRIMARY_DARK : 'white',
          width: 280,
        },
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          title: 'Home',
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="bookings"
        options={{
          title: 'My Bookings',
          drawerIcon: ({ color }) => (
            <MaterialIcons name="history" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="vehicles"
        options={{
          title: 'Available Vehicles',
          drawerIcon: ({ color }) => (
            <MaterialIcons name="car-rental" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          title: 'Settings',
          drawerIcon: ({ color }) => (
            <MaterialIcons name="settings" size={24} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}