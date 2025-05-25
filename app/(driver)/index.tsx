import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { router } from 'expo-router';
import { fetchBookings } from '@/store/slices/bookingSlice';
import { RootState, AppDispatch } from '@/store/store';
import { COLORS } from '@/constants/colors';
import DashboardCard from '@/components/ui/DashboardCard';
import { MaterialIcons } from '@expo/vector-icons';

export default function DriverDashboardScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { bookings } = useSelector((state: RootState) => state.bookings);
  const { theme } = useSelector((state: RootState) => state.settings);

  useEffect(() => {
    if (user) {
      // Get bookings where this driver is assigned
      dispatch(fetchBookings({ status: 'Pending' }));
    }
  }, [dispatch, user]);

  // Get pending requests for quick access
  const pendingRequests = bookings.filter(booking => 
    booking.status === 'Pending' && !booking.driverId
  ).slice(0, 3);
  
  // Get current active bookings for this driver
  const activeBookings = bookings.filter(booking => 
    (booking.status === 'Confirmed') && booking.driverId === user?.id
  ).slice(0, 3);

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
      {/* Hero Section */}
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
      
      {/* Stats Overview */}
      <View style={styles.statsContainer}>
        <View 
          style={[
            styles.statCard,
            { backgroundColor: theme === 'dark' ? COLORS.DARK_CARD : 'white' }
          ]}
        >
          <View style={[styles.statIconContainer, { backgroundColor: COLORS.PRIMARY + '20' }]}>
            <MaterialIcons name="pending-actions" size={24} color={COLORS.PRIMARY} />
          </View>
          <Text style={styles.statValue}>
            {pendingRequests.length}
          </Text>
          <Text style={styles.statLabel}>Pending Requests</Text>
        </View>
        
        <View 
          style={[
            styles.statCard,
            { backgroundColor: theme === 'dark' ? COLORS.DARK_CARD : 'white' }
          ]}
        >
          <View style={[styles.statIconContainer, { backgroundColor: COLORS.SUCCESS + '20' }]}>
            <MaterialIcons name="local-taxi" size={24} color={COLORS.SUCCESS} />
          </View>
          <Text style={styles.statValue}>
            {activeBookings.length}
          </Text>
          <Text style={styles.statLabel}>Active Rides</Text>
        </View>
        
        <View 
          style={[
            styles.statCard,
            { backgroundColor: theme === 'dark' ? COLORS.DARK_CARD : 'white' }
          ]}
        >
          <View style={[styles.statIconContainer, { backgroundColor: COLORS.WARNING + '20' }]}>
            <MaterialIcons name="verified" size={24} color={COLORS.WARNING} />
          </View>
          <Text style={styles.statValue}>
            {bookings.filter(b => b.status === 'Completed' && b.driverId === user?.id).length}
          </Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>
      
      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <TouchableOpacity 
          style={styles.quickActionButton}
          onPress={() => router.push('/driver/requests')}
        >
          <View style={[styles.iconCircle, { backgroundColor: COLORS.PRIMARY_LIGHT }]}>
            <MaterialIcons name="pending-actions" size={24} color="white" />
          </View>
          <Text style={styles.quickActionText}>View Requests</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickActionButton}
          onPress={() => router.push('/driver/history')}
        >
          <View style={[styles.iconCircle, { backgroundColor: COLORS.SUCCESS_LIGHT }]}>
            <MaterialIcons name="history" size={24} color="white" />
          </View>
          <Text style={styles.quickActionText}>My History</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickActionButton}
          onPress={() => router.push('/driver/profile')}
        >
          <View style={[styles.iconCircle, { backgroundColor: COLORS.WARNING_LIGHT }]}>
            <MaterialIcons name="person" size={24} color="white" />
          </View>
          <Text style={styles.quickActionText}>Profile</Text>
        </TouchableOpacity>
      </View>
      
      {/* Pending Ride Requests */}
      <DashboardCard 
        title="New Ride Requests" 
        viewAllRoute="/driver/requests"
        emptyStateText="No pending requests at the moment"
        emptyStateIcon="pending-actions"
      >
        {pendingRequests.length > 0 ? (
          pendingRequests.map((request) => (
            <TouchableOpacity
              key={request.id}
              style={styles.requestItem}
              onPress={() => router.push(`/driver/requests/${request.bookingId}`)}
            >
              <View style={styles.requestLeftSection}>
                <MaterialIcons name="location-on" size={24} color={COLORS.PRIMARY} />
                <View style={styles.requestDetails}>
                  <Text style={styles.requestDestination}>{request.destination}</Text>
                  <Text style={styles.requestInfo}>
                    {new Date(request.dateTime).toLocaleDateString()} • {request.rideType}
                  </Text>
                </View>
              </View>
              <View>
                <View style={[styles.statusBadge, { backgroundColor: getBadgeColor('Pending') }]}>
                  <Text style={styles.statusText}>Pending</Text>
                </View>
                <Text style={styles.requestCost}>{request.cost} RWF</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : null}
      </DashboardCard>
      
      {/* Active Rides */}
      <DashboardCard 
        title="Active Rides" 
        viewAllRoute="/driver/history"
        emptyStateText="No active rides at the moment"
        emptyStateIcon="local-taxi"
      >
        {activeBookings.length > 0 ? (
          activeBookings.map((booking) => (
            <TouchableOpacity
              key={booking.id}
              style={styles.bookingItem}
              onPress={() => router.push(`/driver/history/${booking.bookingId}`)}
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
                <Text style={styles.bookingCost}>{booking.cost} RWF</Text>
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.SECONDARY_DARK,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.SECONDARY,
    textAlign: 'center',
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
  requestItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GREY_LIGHT,
  },
  requestLeftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  requestDetails: {
    marginLeft: 12,
  },
  requestDestination: {
    fontWeight: '500',
    fontSize: 16,
    color: COLORS.SECONDARY_DARK,
  },
  requestInfo: {
    fontSize: 12,
    color: COLORS.SECONDARY,
  },
  requestCost: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    textAlign: 'right',
    marginTop: 4,
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
  bookingCost: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    textAlign: 'right',
    marginTop: 4,
  },
});