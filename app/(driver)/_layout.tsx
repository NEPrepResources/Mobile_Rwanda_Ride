import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import DriverDrawerContent from '@/components/navigation/DriverDrawerContent';

export default function DriverLayout() {
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
      drawerContent={(props) => <DriverDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: 'Dashboard',
          headerTitle: 'RwandaRide Driver',
          drawerIcon: ({ color }) => (
            <MaterialIcons name="dashboard" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="profile"
        options={{
          title: 'My Profile',
          drawerIcon: ({ color }) => (
            <MaterialIcons name="person" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="requests"
        options={{
          title: 'Ride Requests',
          drawerIcon: ({ color }) => (
            <MaterialIcons name="pending-actions" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="history"
        options={{
          title: 'Booking History',
          drawerIcon: ({ color }) => (
            <MaterialIcons name="history" size={24} color={color} />
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