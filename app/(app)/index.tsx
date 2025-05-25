import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { router } from 'expo-router';
import { fetchBookings } from '@/store/slices/bookingSlice';
import { fetchVehicles } from '@/store/slices/vehicleSlice';
import { RootState, AppDispatch } from '@/store/store';
import { COLORS } from '@/constants/colors';
import DashboardCard from '@/components/ui/DashboardCard';
import { MaterialIcons } from '@expo/vector-icons';

export default function HomeScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { bookings } = useSelector((state: RootState) => state.bookings);
  const { vehicles } = useSelector((state: RootState) => state.vehicles);
  const { theme } = useSelector((state: RootState) => state.settings);

  useEffect(() => {
    if (user) {
      dispatch(fetchBookings({ userId: user.id }));
      dispatch(fetchVehicles());
    }
  }, [dispatch, user]);

  // Get the most recent bookings
  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);
  
  // Get a few available vehicles
  const availableVehicles = vehicles
    .filter(vehicle => vehicle.available)
    .slice(0, 3);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getBadgeColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return COLORS.SUCCESS;
      case 'Pending': return COLORS.WARNING;
      case 'Completed': return COLORS.PRIMARY;
      case 'Cancelled':
      case 'Rejected': return COLORS.ERROR;
      default: return COLORS.SECONDARY;
    }
  };

  return (
    <ScrollView 
      style={[
        styles.container, 
        { backgroundColor: theme === 'dark' ? COLORS.DARK_BG : COLORS.LIGHT_BG }
      ]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.heroSection}>
        <View>
          <Text style={styles.greeting}>{getGreeting()},</Text>
          <Text style={styles.userName}>{user?.fullName}</Text>
        </View>
        
        {user?.profilePicture ? (
          <Image source={{ uri: user.profilePicture }} style={styles.profilePic} />
        ) : (
          <View style={styles.profilePicPlaceholder}>
            <Text style={styles.profilePicText}>
              {user?.fullName?.charAt(0) || ''}
            </Text>
          </View>
        )}
      </View>
      
      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <TouchableOpacity 
          style={styles.quickActionButton}
          onPress={() => router.push('./bookRide')}
        >
          <View style={[styles.iconCircle, { backgroundColor: COLORS.PRIMARY_LIGHT }]}>
            <MaterialIcons name="directions-car" size={24} color="white" />
          </View>
          <Text style={styles.quickActionText}>Book Ride</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickActionButton}
          onPress={() => router.push('./bookings')}
        >
          <View style={[styles.iconCircle, { backgroundColor: COLORS.SUCCESS_LIGHT }]}>
            <MaterialIcons name="history" size={24} color="white" />
          </View>
          <Text style={styles.quickActionText}>My Rides</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickActionButton}
          onPress={() => router.push('./vehicles')}
        >
          <View style={[styles.iconCircle, { backgroundColor: COLORS.WARNING_LIGHT }]}>
            <MaterialIcons name="car-rental" size={24} color="white" />
          </View>
          <Text style={styles.quickActionText}>Vehicles</Text>
        </TouchableOpacity>
      </View>
      
      <DashboardCard 
        title="Recent Bookings" 
        viewAllRoute="./bookings"
        emptyStateText="No bookings yet. Book your first ride!"
        emptyStateIcon="directions-car"
      >
        {recentBookings.length > 0 ? (
          recentBookings.map((booking) => (
            <TouchableOpacity
              key={booking.id}
              style={styles.bookingItem}
              onPress={() => router.push(`./bookings/${booking.bookingId}`)}
            >
              <View style={styles.bookingLeftSection}>
                <MaterialIcons name="location-on" size={24} color={COLORS.PRIMARY} />
                <View style={styles.bookingDetails}>
                  <Text style={styles.bookingDestination}>{booking.destination}</Text>
                  <Text style={styles.bookingInfo}>
                    {new Date(booking.dateTime).toLocaleDateString()} • {booking.rideType}
                  </Text>
                </View>
              </View>
              <View>
                <View style={[styles.statusBadge, { backgroundColor: getBadgeColor(booking.status) }]}>
                  <Text style={styles.statusText}>{booking.status}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : null}
      </DashboardCard>
      
      {/* Available Vehicles */}
      <DashboardCard 
        title="Available Vehicles" 
        viewAllRoute="./vehicles"
        emptyStateText="No vehicles available at the moment"
        emptyStateIcon="car-rental"
      >
        {availableVehicles.length > 0 ? (
          availableVehicles.map((vehicle) => (
            <TouchableOpacity
              key={vehicle.id}
              style={styles.vehicleItem}
              onPress={() => router.push(`./vehicles/${vehicle.id}`)}
            >
              <Image 
                source={{ uri: vehicle.image }} 
                style={styles.vehicleImage} 
              />
              <View style={styles.vehicleDetails}>
                <Text style={styles.vehicleType}>{vehicle.type}</Text>
                <Text style={styles.vehicleInfo}>
                  {vehicle.driverName} • Capacity: {vehicle.capacity}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : null}
      </DashboardCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.LIGHT_BG,
  },
  contentContainer: {
    padding: 16,
  },
  heroSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: COLORS.SECONDARY_DARK,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profilePicPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.PRIMARY_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePicText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  quickActionButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.SECONDARY_DARK,
  },
  bookingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GREY_LIGHT,
  },
  bookingLeftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bookingDetails: {
    marginLeft: 12,
  },
  bookingDestination: {
    fontWeight: '500',
    fontSize: 16,
    color: COLORS.SECONDARY_DARK,
  },
  bookingInfo: {
    fontSize: 12,
    color: COLORS.SECONDARY,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  vehicleItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GREY_LIGHT,
  },
  vehicleImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  vehicleDetails: {
    justifyContent: 'center',
  },
  vehicleType: {
    fontWeight: '500',
    fontSize: 16,
    color: COLORS.SECONDARY_DARK,
  },
  vehicleInfo: {
    fontSize: 12,
    color: COLORS.SECONDARY,
  },
});