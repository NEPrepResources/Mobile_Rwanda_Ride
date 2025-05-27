import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { router } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { COLORS } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';

type MaterialIconName = React.ComponentProps<typeof MaterialIcons>['name'];
type BookingStatus = 'All' | 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'Rejected';

export default function BookingsScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { bookings, isLoading } = useSelector((state: RootState) => state.bookings);
  const { theme } = useSelector((state: RootState) => state.settings);

  const [selectedStatus, setSelectedStatus] = useState<BookingStatus>('All');
  const [filteredBookings, setFilteredBookings] = useState(bookings);

  useEffect(() => {
    if (user) {
      dispatch({ type: 'bookings/fetchBookings', payload: { userId: user.id } });
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (selectedStatus === 'All') {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(bookings.filter(booking => booking.status === selectedStatus));
    }
  }, [selectedStatus, bookings]);

  const handleCancelBooking = (booking: any) => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => {
            const updatedBookings = bookings.map(b => 
              b.bookingId === booking.bookingId 
                ? { ...b, status: 'Cancelled' } 
                : b
            );
            dispatch({ type: 'bookings/updateBookings', payload: updatedBookings });
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleBookingPress = (bookingId: string) => {
    router.push({
      pathname: '/bookings/[id]',
      params: { id: bookingId }
    });
  };

  const getStatusIcon = (status: string): MaterialIconName => {
    switch (status) {
      case 'Confirmed': return 'check-circle';
      case 'Pending': return 'pending';
      case 'Completed': return 'done-all';
      case 'Cancelled': return 'cancel';
      case 'Rejected': return 'highlight-off';
      default: return 'help';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return COLORS.SUCCESS;
      case 'Pending': return COLORS.WARNING;
      case 'Completed': return COLORS.PRIMARY;
      case 'Cancelled': return COLORS.ERROR;
      case 'Rejected': return COLORS.ERROR;
      default: return COLORS.SECONDARY;
    }
  };

  const renderBookingItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.bookingCard,
        { backgroundColor: theme === 'dark' ? COLORS.DARK_CARD : 'white' }
      ]}
      onPress={() => handleBookingPress(item.bookingId)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.bookingIdContainer}>
          <Text style={styles.bookingIdLabel}>Booking ID:</Text>
          <Text style={styles.bookingId}>{item.bookingId}</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <MaterialIcons name={getStatusIcon(item.status)} size={16} color="white" />
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
          {(item.status === 'Pending' || item.status === 'Confirmed') && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={(e) => {
                e.stopPropagation();
                handleCancelBooking(item);
              }}
            >
              <MaterialIcons name="close" size={20} color={COLORS.ERROR} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.locationContainer}>
        <View style={styles.locationItem}>
          <MaterialIcons name="my-location" size={20} color={COLORS.PRIMARY} />
          <Text style={styles.locationText} numberOfLines={1}>
            {item.pickupLocation}
          </Text>
        </View>
        <View style={styles.locationDivider} />
        <View style={styles.locationItem}>
          <MaterialIcons name="location-on" size={20} color={COLORS.ERROR} />
          <Text style={styles.locationText} numberOfLines={1}>
            {item.destination}
          </Text>
        </View>
      </View>

      <View style={styles.bookingDetails}>
        <View style={styles.detailItem}>
          <MaterialIcons name="directions-car" size={16} color={COLORS.SECONDARY} />
          <Text style={styles.detailText}>{item.rideType}</Text>
        </View>

        <View style={styles.detailItem}>
          <MaterialIcons name="person" size={16} color={COLORS.SECONDARY} />
          <Text style={styles.detailText}>{item.passengers} Passenger{item.passengers > 1 ? 's' : ''}</Text>
        </View>

        <View style={styles.detailItem}>
          <MaterialIcons name="access-time" size={16} color={COLORS.SECONDARY} />
          <Text style={styles.detailText}>{item.duration} hr{item.duration > 1 ? 's' : ''}</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.dateText}>
          {new Date(item.dateTime).toLocaleString()}
        </Text>
        <Text style={styles.costText}>{item.cost} RWF</Text>
      </View>
    </TouchableOpacity>
  );

  const renderStatusFilter = () => {
    const statuses: BookingStatus[] = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled', 'Rejected'];

    return (
      <View style={styles.filterContainer}>
        <FlatList
          data={statuses}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterItem,
                selectedStatus === item && styles.filterItemActive
              ]}
              onPress={() => setSelectedStatus(item)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedStatus === item && styles.filterTextActive
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.filterList}
        />
      </View>
    );
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="directions-car" size={60} color={COLORS.SECONDARY_LIGHT} />
      <Text style={styles.emptyText}>No bookings found</Text>
      <Text style={styles.emptySubtext}>
        {selectedStatus === 'All'
          ? 'Start by booking your first ride!'
          : `No ${selectedStatus.toLowerCase()} bookings`}
      </Text>
      {selectedStatus === 'All' && (
        <TouchableOpacity
          style={styles.bookNowButton}
          onPress={() => router.push('/(app)/bookRide')}
        >
          <Text style={styles.bookNowText}>Book Now</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme === 'dark' ? COLORS.DARK_BG : COLORS.LIGHT_BG }
      ]}
    >
      <Text style={styles.title}>My Bookings</Text>

      {renderStatusFilter()}

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        </View>
      ) : (
        <FlatList
          data={filteredBookings}
          renderItem={renderBookingItem}
          keyExtractor={(item) => item.bookingId}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={renderEmptyList}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    color: COLORS.PRIMARY,
  },
  listContainer: {
    padding: 16,
  },
  bookingCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  bookingIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookingIdLabel: {
    fontSize: 14,
    color: COLORS.SECONDARY,
    marginRight: 4,
  },
  bookingId: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.PRIMARY,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  cancelButton: {
    padding: 4,
    borderRadius: 4,
    backgroundColor: COLORS.ERROR + '20',
  },
  locationContainer: {
    marginBottom: 16,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.SECONDARY_DARK,
  },
  locationDivider: {
    height: 16,
    width: 1,
    backgroundColor: COLORS.GREY_LIGHT,
    marginLeft: 10,
    marginVertical: 4,
  },
  bookingDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    color: COLORS.SECONDARY_DARK,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.GREY_LIGHT,
  },
  dateText: {
    fontSize: 12,
    color: COLORS.SECONDARY,
  },
  costText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterList: {
    paddingVertical: 4,
  },
  filterItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  filterItemActive: {
    backgroundColor: COLORS.PRIMARY,
  },
  filterText: {
    color: COLORS.SECONDARY,
    fontWeight: '500',
  },
  filterTextActive: {
    color: 'white',
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
    marginVertical: 8,
    textAlign: 'center',
  },
  bookNowButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  bookNowText: {
    color: 'white',
    fontWeight: 'bold',
  },
});