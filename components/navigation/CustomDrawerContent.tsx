import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ScrollView 
} from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useDispatch, useSelector } from 'react-redux';
import { router } from 'expo-router';
import { logout } from '@/store/slices/authSlice';
import { RootState, AppDispatch } from '@/store/store';
import { COLORS } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';

export default function CustomDrawerContent(props: any) {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { theme } = useSelector((state: RootState) => state.settings);
  
  const handleLogout = () => {
    dispatch(logout()).then(() => {
      router.replace('/(auth)/login');
    });
  };
  
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View 
          style={[
            styles.drawerHeader,
            { backgroundColor: theme === 'dark' ? COLORS.PRIMARY_DARK : COLORS.PRIMARY }
          ]}
        >
          {user?.profilePicture ? (
            <Image source={{ uri: user.profilePicture }} style={styles.profilePic} />
          ) : (
            <View style={styles.profilePicPlaceholder}>
              <Text style={styles.profilePicText}>
                {user?.fullName?.charAt(0) || ''}
              </Text>
            </View>
          )}
          
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.fullName}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
        </View>
        
        <ScrollView style={styles.drawerItemsContainer}>
          {props.state.routes.map((route: any, index: number) => {
            const { title, drawerIcon } = props.descriptors[route.key].options;
            const isFocused = props.state.index === index;
            
            const onPress = () => {
              if (!isFocused) {
                router.navigate(route.name);
              }
            };
            
            return (
              <TouchableOpacity
                key={route.key}
                style={[
                  styles.drawerItem,
                  isFocused && styles.drawerItemActive
                ]}
                onPress={onPress}
              >
                {drawerIcon && drawerIcon({ 
                  color: isFocused ? 'white' : (theme === 'dark' ? 'white' : COLORS.SECONDARY_DARK), 
                  size: 24 
                })}
                <Text 
                  style={[
                    styles.drawerItemText,
                    { color: isFocused ? 'white' : (theme === 'dark' ? 'white' : COLORS.SECONDARY_DARK) }
                  ]}
                >
                  {title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </DrawerContentScrollView>
      
      <View style={styles.drawerFooter}>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <MaterialIcons name="logout" size={20} color={theme === 'dark' ? 'white' : COLORS.SECONDARY_DARK} />
          <Text 
            style={[
              styles.logoutText,
              { color: theme === 'dark' ? 'white' : COLORS.SECONDARY_DARK }
            ]}
          >
            Logout
          </Text>
        </TouchableOpacity>
        
        <Text style={styles.versionText}>RwandaRide v1.0.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    backgroundColor: COLORS.PRIMARY,
    padding: 16,
    paddingTop: 40,
  },
  profilePic: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 12,
  },
  profilePicPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  profilePicText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  userInfo: {
    marginBottom: 8,
  },
  userName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    color: 'white',
    opacity: 0.8,
    fontSize: 14,
  },
  drawerItemsContainer: {
    paddingTop: 8,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    marginVertical: 4,
    borderRadius: 8,
  },
  drawerItemActive: {
    backgroundColor: COLORS.PRIMARY_LIGHT,
  },
  drawerItemText: {
    fontSize: 16,
    marginLeft: 16,
  },
  drawerFooter: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.GREY_LIGHT,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  logoutText: {
    fontSize: 16,
    marginLeft: 16,
  },
  versionText: {
    fontSize: 12,
    color: COLORS.SECONDARY,
    textAlign: 'center',
    marginTop: 16,
  },
});