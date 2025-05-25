import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { router } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookings, Booking } from '@/store/slices/bookingSlice';
import { RootState, AppDispatch } from '@/store/store';
import { COLORS } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';

type BookingStatus = 'All' | 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'Rejected';

export default function BookingsScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { bookings, isLoading } = useSelector((state: RootState) => state.bookings);
  const { theme } = useSelector((state: RootState) => state.settings);
  
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus>('All');
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  
  useEffect(() => {
    if (user) {
      dispatch(fetchBookings({ userId: user.id }));
    }
  }, [dispatch, user]);
  
  useEffect(() => {
    if (selectedStatus === 'All') {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(bookings.filter(booking => booking.status === selectedStatus));
    }
  }, [selectedStatus, bookings]);
  
  const getStatusIcon = (status: string) => {
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
  
  const renderBookingItem = ({ item }: { item: Booking }) => (
    <TouchableOpacity
      style={[
        styles.bookingCard,
        { backgroundColor: theme === 'dark' ? COLORS.DARK_CARD : 'white' }
      ]}
      onPress={() => router.push(`/app/bookings/${item.bookingId}`)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.bookingIdContainer}>
          <Text style={styles.bookingIdLabel}>Booking ID:</Text>
          <Text style={styles.bookingId}>{item.bookingId}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <MaterialIcons name={getStatusIcon(item.status)} size={16} color="white" />
          <Text style={styles.statusText}>{item.status}</Text>
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
          onPress={() => router.push('/app/bookRide')}
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
          keyExtractor={(item) => item.id}
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
    backgroundColor: COLORS.LIGHT_BG,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    margin: 16,
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
  listContainer: {
    padding: 16,
    paddingTop: 0,
  },
  bookingCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bookingIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookingIdLabel: {
    fontSize: 12,
    color: COLORS.SECONDARY,
    marginRight: 4,
  },
  bookingId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.SECONDARY_DARK,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  locationContainer: {
    marginBottom: 12,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.SECONDARY_DARK,
    flex: 1,
  },
  locationDivider: {
    height: 16,
    width: 1,
    backgroundColor: COLORS.GREY,
    marginLeft: 10,
  },
  bookingDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.GREY_LIGHT,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 4,
    fontSize: 12,
    color: COLORS.SECONDARY,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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