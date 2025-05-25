import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { COLORS } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';

export default function BookingDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { bookings } = useSelector((state: RootState) => state.bookings);
  const { theme } = useSelector((state: RootState) => state.settings);
  
  const booking = bookings.find(b => b.bookingId === id);
  
  if (!booking) {
    return (
      <View style={[styles.container, { backgroundColor: theme === 'dark' ? COLORS.DARK_BG : COLORS.LIGHT_BG }]}>
        <Text style={styles.notFoundText}>Booking not found</Text>
      </View>
    );
  }
  
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

  return (
    <View style={[
      styles.container,
      { backgroundColor: theme === 'dark' ? COLORS.DARK_BG : COLORS.LIGHT_BG }
    ]}>
      <View style={[
        styles.bookingCard,
        { backgroundColor: theme === 'dark' ? COLORS.DARK_CARD : 'white' }
      ]}>
        <View style={styles.cardHeader}>
          <Text style={styles.sectionTitle}>Booking Details</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
            <MaterialIcons name={getStatusIcon(booking.status)} size={16} color="white" />
            <Text style={styles.statusText}>{booking.status}</Text>
          </View>
        </View>
        
        <View style={styles.detailSection}>
          <Text style={styles.detailLabel}>Booking ID:</Text>
          <Text style={styles.detailValue}>{booking.bookingId}</Text>
        </View>
        
        <View style={styles.detailSection}>
          <Text style={styles.detailLabel}>Date & Time:</Text>
          <Text style={styles.detailValue}>{new Date(booking.dateTime).toLocaleString()}</Text>
        </View>
        
        <View style={styles.detailSection}>
          <Text style={styles.detailLabel}>Ride Type:</Text>
          <Text style={styles.detailValue}>{booking.rideType}</Text>
        </View>
        
        <View style={styles.detailSection}>
          <Text style={styles.detailLabel}>Passengers:</Text>
          <Text style={styles.detailValue}>{booking.passengers}</Text>
        </View>
        
        <View style={styles.detailSection}>
          <Text style={styles.detailLabel}>Duration:</Text>
          <Text style={styles.detailValue}>{booking.duration} hr{booking.duration > 1 ? 's' : ''}</Text>
        </View>
        
        <View style={styles.detailSection}>
          <Text style={styles.detailLabel}>Total Cost:</Text>
          <Text style={[styles.detailValue, styles.costText]}>{booking.cost} RWF</Text>
        </View>
        
        <View style={styles.locationSection}>
          <Text style={styles.sectionTitle}>Locations</Text>
          <View style={styles.locationItem}>
            <MaterialIcons name="my-location" size={20} color={COLORS.PRIMARY} />
            <Text style={styles.locationText}>{booking.pickupLocation}</Text>
          </View>
          <View style={styles.locationDivider} />
          <View style={styles.locationItem}>
            <MaterialIcons name="location-on" size={20} color={COLORS.ERROR} />
            <Text style={styles.locationText}>{booking.destination}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  bookingCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
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
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
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
  detailSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.SECONDARY,
  },
  detailValue: {
    fontSize: 14,
    color: COLORS.SECONDARY_DARK,
    fontWeight: '500',
  },
  costText: {
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
  },
  locationSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderColor: COLORS.GREY_LIGHT,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
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
  notFoundText: {
    fontSize: 18,
    color: COLORS.ERROR,
    textAlign: 'center',
    marginTop: 20,
  },
});