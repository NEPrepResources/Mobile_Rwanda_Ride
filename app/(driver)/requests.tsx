import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  BackHandler,
  Platform
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { router } from 'expo-router';
import { RootState, AppDispatch } from '@/store/store';
import { fetchBookings, updateBookingStatus } from '@/store/slices/bookingSlice';
import { COLORS } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RequestsScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { bookings, isLoading } = useSelector((state: RootState) => state.bookings);
  const { user } = useSelector((state: RootState) => state.auth);
  const { theme } = useSelector((state: RootState) => state.settings);

  useEffect(() => {
    dispatch(fetchBookings());

    if (Platform.OS !== 'web') {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        router.back();
        return true;
      });

      return () => backHandler.remove();
    }
  }, [dispatch]);

  const handleBack = () => {
    router.back();
  };

  const pendingBookings = bookings.filter(booking => 
    booking.status === 'Pending' && booking.driverId === user?.id
  );

  const handleAcceptRequest = async (bookingId: string) => {
    try {
      await dispatch(updateBookingStatus({ bookingId, status: 'Confirmed' })).unwrap();
      Alert.alert('Success', 'Ride request accepted successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to accept ride request. Please try again.');
    }
  };

  const handleRejectRequest = async (bookingId: string) => {
    try {
      await dispatch(updateBookingStatus({ bookingId, status: 'Rejected' })).unwrap();
      Alert.alert('Success', 'Ride request rejected successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to reject ride request. Please try again.');
    }
  };

  const renderRequestItem = ({ item }) => (
    <View 
      style={[
        styles.requestCard,
        { backgroundColor: theme === 'dark' ? COLORS.DARK_CARD : 'white' }
      ]}
    >
      <View style={styles.requestHeader}>
        <View style={styles.userInfo}>
          <MaterialIcons name="person" size={24} color={COLORS.PRIMARY} />
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{item.userName}</Text>
            <Text style={styles.requestTime}>
              {new Date(item.dateTime).toLocaleString()}
            </Text>
          </View>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.locationContainer}>
        <View style={styles.locationItem}>
          <MaterialIcons name="my-location" size={20} color={COLORS.PRIMARY} />
          <Text style={styles.locationText}>{item.pickupLocation}</Text>
        </View>
        <View style={styles.locationDivider} />
        <View style={styles.locationItem}>
          <MaterialIcons name="location-on" size={20} color={COLORS.ERROR} />
          <Text style={styles.locationText}>{item.destination}</Text>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <MaterialIcons name="person" size={16} color={COLORS.SECONDARY} />
          <Text style={styles.detailText}>
            {item.passengers} Passenger{item.passengers > 1 ? 's' : ''}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <MaterialIcons name="access-time" size={16} color={COLORS.SECONDARY} />
          <Text style={styles.detailText}>{item.duration} hours</Text>
        </View>
        <View style={styles.detailItem}>
          <MaterialIcons name="attach-money" size={16} color={COLORS.SECONDARY} />
          <Text style={styles.detailText}>{item.cost} RWF</Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.acceptButton]}
          onPress={() => handleAcceptRequest(item.bookingId)}
        >
          <MaterialIcons name="check" size={20} color="white" />
          <Text style={styles.actionButtonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.rejectButton]}
          onPress={() => handleRejectRequest(item.bookingId)}
        >
          <MaterialIcons name="close" size={20} color="white" />
          <Text style={styles.actionButtonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="notifications-none" size={60} color={COLORS.SECONDARY_LIGHT} />
      <Text style={styles.emptyText}>No pending requests</Text>
      <Text style={styles.emptySubtext}>
        New ride requests will appear here
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme === 'dark' ? COLORS.DARK_BG : COLORS.LIGHT_BG }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Ride Requests</Text>
        {isLoading && (
          <ActivityIndicator size="small" color={COLORS.PRIMARY} />
        )}
      </View>

      <FlatList
        data={pendingBookings}
        renderItem={renderRequestItem}
        keyExtractor={(item) => item.bookingId}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyList}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  listContainer: {
    padding: 16,
  },
  requestCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userDetails: {
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.SECONDARY_DARK,
  },
  requestTime: {
    fontSize: 12,
    color: COLORS.SECONDARY,
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: COLORS.WARNING + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: COLORS.WARNING,
    fontSize: 12,
    fontWeight: '500',
  },
  locationContainer: {
    marginBottom: 16,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  locationText: {
    marginLeft: 12,
    fontSize: 14,
    color: COLORS.SECONDARY_DARK,
    flex: 1,
  },
  locationDivider: {
    height: 20,
    width: 1,
    backgroundColor: COLORS.GREY,
    marginLeft: 10,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.GREY_LIGHT,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 4,
    fontSize: 14,
    color: COLORS.SECONDARY,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  acceptButton: {
    backgroundColor: COLORS.SUCCESS,
  },
  rejectButton: {
    backgroundColor: COLORS.ERROR,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '500',
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.SECONDARY_DARK,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.SECONDARY,
    marginTop: 8,
    textAlign: 'center',
  },
});