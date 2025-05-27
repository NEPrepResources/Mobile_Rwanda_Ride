import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { COLORS } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DriverHistoryDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { bookings } = useSelector((state: RootState) => state.bookings);
  const { theme } = useSelector((state: RootState) => state.settings);
  
  const booking = bookings.find(b => b.bookingId === id);
  
  if (!booking) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme === 'dark' ? COLORS.DARK_BG : COLORS.LIGHT_BG }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color={COLORS.PRIMARY} />
          </TouchableOpacity>
          <Text style={styles.title}>Ride Details</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.notFoundContainer}>
          <MaterialIcons name="error-outline" size={60} color={COLORS.SECONDARY} />
          <Text style={styles.notFoundText}>Ride not found</Text>
        </View>
      </SafeAreaView>
    );
  }

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
    <SafeAreaView style={[styles.container, { backgroundColor: theme === 'dark' ? COLORS.DARK_BG : COLORS.LIGHT_BG }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.title}>Ride Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <View style={styles.statusContainer}>
            <Text style={styles.bookingId}>Ride #{booking.bookingId}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
              <Text style={styles.statusText}>{booking.status}</Text>
            </View>
          </View>

          <View style={styles.passengerInfo}>
            <MaterialIcons name="person" size={24} color={COLORS.PRIMARY} />
            <View style={styles.passengerDetails}>
              <Text style={styles.passengerName}>{booking.passengers}</Text>
              <Text style={styles.passengerPhone}>{booking.passengers}</Text>
            </View>
          </View>

          <View style={styles.locationContainer}>
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

          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <MaterialIcons name="event" size={20} color={COLORS.SECONDARY} />
                <Text style={styles.detailLabel}>Date</Text>
                <Text style={styles.detailValue}>
                  {new Date(booking.dateTime).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <MaterialIcons name="access-time" size={20} color={COLORS.SECONDARY} />
                <Text style={styles.detailLabel}>Time</Text>
                <Text style={styles.detailValue}>
                  {new Date(booking.dateTime).toLocaleTimeString()}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <MaterialIcons name="directions-car" size={20} color={COLORS.SECONDARY} />
                <Text style={styles.detailLabel}>Vehicle Type</Text>
                <Text style={styles.detailValue}>{booking.rideType}</Text>
              </View>
              <View style={styles.detailItem}>
                <MaterialIcons name="person" size={20} color={COLORS.SECONDARY} />
                <Text style={styles.detailLabel}>Passengers</Text>
                <Text style={styles.detailValue}>{booking.passengers}</Text>
              </View>
            </View>

            <View style={styles.costContainer}>
              <Text style={styles.costLabel}>Earnings</Text>
              <Text style={styles.costValue}>{booking.cost} RWF</Text>
              <Text style={styles.commissionText}>
                Commission: {(booking.cost * 0.15).toFixed(0)} RWF (15%)
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  bookingId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.SECONDARY_DARK,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  passengerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: COLORS.GREY_LIGHT,
    borderRadius: 8,
    marginBottom: 16,
  },
  passengerDetails: {
    marginLeft: 12,
  },
  passengerName: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.SECONDARY_DARK,
  },
  passengerPhone: {
    fontSize: 14,
    color: COLORS.SECONDARY,
    marginTop: 2,
  },
  locationContainer: {
    marginBottom: 24,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
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
    borderTopWidth: 1,
    borderTopColor: COLORS.GREY_LIGHT,
    paddingTop: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.SECONDARY,
    marginTop: 4,
  },
  detailValue: {
    fontSize: 14,
    color: COLORS.SECONDARY_DARK,
    fontWeight: '500',
    marginTop: 2,
  },
  costContainer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.GREY_LIGHT,
    paddingTop: 16,
    marginTop: 8,
    alignItems: 'center',
  },
  costLabel: {
    fontSize: 14,
    color: COLORS.SECONDARY,
    marginBottom: 4,
  },
  costValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  commissionText: {
    fontSize: 12,
    color: COLORS.SECONDARY,
    marginTop: 4,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: 18,
    color: COLORS.SECONDARY,
    marginTop: 16,
  },
}); 