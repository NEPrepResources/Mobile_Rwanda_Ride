import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { router } from 'expo-router';
import { RootState } from '@/store/store';
import { COLORS } from '@/constants/colors';
import DashboardCard from '@/components/ui/DashboardCard';
import { MaterialIcons } from '@expo/vector-icons';

export default function DriverHistoryScreen() {
  const { bookings } = useSelector((state: RootState) => state.bookings);
  const { theme } = useSelector((state: RootState) => state.settings);
  const { user } = useSelector((state: RootState) => state.auth);

  // Get all bookings for this driver (except pending)
  const driverBookings = bookings.filter(booking => 
    booking.driverId === user?.id && booking.status !== 'Pending'
  );

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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.title}>Ride History</Text>
        <View style={{ width: 24 }} />
      </View>

      <DashboardCard 
        title="All Rides" 
        emptyStateText="No ride history yet"
        emptyStateIcon="history"
        viewAllRoute={null} // Instead of noViewAll, pass null to viewAllRoute
      >
        {driverBookings.length > 0 ? (
          driverBookings.map((booking) => (
            <TouchableOpacity
              key={booking.id}
              style={styles.bookingItem}
              onPress={() => router.push(`./history/${booking.bookingId}`)}
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
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
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
});