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
import { fetchDriverRequests, Booking } from '@/store/slices/bookingSlice';
import { RootState, AppDispatch } from '@/store/store';
import { COLORS } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';

export default function RideRequestsScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { bookings, isLoading } = useSelector((state: RootState) => state.bookings);
  const { theme } = useSelector((state: RootState) => state.settings);
  
  // Filter for pending bookings without a driver assigned
  const pendingRequests = bookings.filter(
    booking => booking.status === 'Pending' && !booking.driverId
  );
  
  useEffect(() => {
    dispatch(fetchDriverRequests());
  }, [dispatch]);
  
  const renderRequestItem = ({ item }: { item: Booking }) => (
    <TouchableOpacity
      style={[
        styles.requestCard,
        { backgroundColor: theme === 'dark' ? COLORS.DARK_CARD : 'white' }
      ]}
      onPress={() => router.push(`./requests/${item.bookingId}`)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.bookingIdContainer}>
          <Text style={styles.bookingIdLabel}>Booking ID:</Text>
          <Text style={styles.bookingId}>{item.bookingId}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: COLORS.WARNING }]}>
          <MaterialIcons name="pending" size={16} color="white" />
          <Text style={styles.statusText}>Pending</Text>
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
      
      <View style={styles.requestDetails}>
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
      
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={styles.viewDetailsButton}
          onPress={() => router.push(`./requests/${item.bookingId}`)}
        >
          <Text style={styles.viewDetailsText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
  
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="pending-actions" size={60} color={COLORS.SECONDARY_LIGHT} />
      <Text style={styles.emptyText}>No ride requests</Text>
      <Text style={styles.emptySubtext}>
        There are no pending ride requests at this time.
      </Text>
    </View>
  );

  return (
    <View 
      style={[
        styles.container,
        { backgroundColor: theme === 'dark' ? COLORS.DARK_BG : COLORS.LIGHT_BG }
      ]}
    >
      <Text style={styles.title}>Ride Requests</Text>
      
      <Text style={styles.subtitle}>
        Available ride requests pending driver approval
      </Text>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        </View>
      ) : (
        <FlatList
          data={pendingRequests}
          renderItem={renderRequestItem}
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
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.SECONDARY,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  listContainer: {
    padding: 16,
    paddingTop: 0,
  },
  requestCard: {
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
  requestDetails: {
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
    marginBottom: 16,
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
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  viewDetailsButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: COLORS.PRIMARY,
  },
  viewDetailsText: {
    color: 'white',
    fontWeight: 'bold',
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
    marginTop: 8,
    textAlign: 'center',
  },
});