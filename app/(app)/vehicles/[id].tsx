import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, BackHandler, Platform } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { COLORS } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function VehicleDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { vehicles } = useSelector((state: RootState) => state.vehicles);
  const { theme } = useSelector((state: RootState) => state.settings);
  
  const vehicle = vehicles.find(v => v.vehicleId === id);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        router.back();
        return true;
      });

      return () => backHandler.remove();
    }
  }, []);
  
  const handleBack = () => {
    router.back();
  };
  
  if (!vehicle) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme === 'dark' ? COLORS.DARK_BG : COLORS.LIGHT_BG }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack}>
            <MaterialIcons name="arrow-back" size={24} color={COLORS.PRIMARY} />
          </TouchableOpacity>
          <Text style={styles.title}>Vehicle Details</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.notFoundContainer}>
          <MaterialIcons name="error-outline" size={60} color={COLORS.SECONDARY} />
          <Text style={styles.notFoundText}>Vehicle not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleBookNow = () => {
    router.push({
      pathname: '/vehicles/book',
      params: { vehicleId: vehicle.vehicleId }
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme === 'dark' ? COLORS.DARK_BG : COLORS.LIGHT_BG }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.title}>Vehicle Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <Image source={{ uri: vehicle.image }} style={styles.vehicleImage} />

        <View style={styles.card}>
          <View style={styles.vehicleHeader}>
            <View>
              <Text style={styles.vehicleType}>{vehicle.type}</Text>
              <Text style={styles.vehicleModel}>{vehicle.model}</Text>
            </View>
            <View style={[
              styles.availabilityBadge,
              { backgroundColor: vehicle.available ? COLORS.SUCCESS + '20' : COLORS.ERROR + '20' }
            ]}>
              <Text style={[
                styles.availabilityText,
                { color: vehicle.available ? COLORS.SUCCESS : COLORS.ERROR }
              ]}>
                {vehicle.available ? 'Available' : 'Unavailable'}
              </Text>
            </View>
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <MaterialIcons name="event-seat" size={20} color={COLORS.SECONDARY} />
                <Text style={styles.detailLabel}>Capacity</Text>
                <Text style={styles.detailValue}>
                  {vehicle.capacity} Passenger{vehicle.capacity > 1 ? 's' : ''}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <MaterialIcons name="attach-money" size={20} color={COLORS.SECONDARY} />
                <Text style={styles.detailLabel}>Price per KM</Text>
                <Text style={styles.detailValue}>{vehicle.pricePerKm} RWF</Text>
              </View>
            </View>

            <View style={styles.driverInfo}>
              <MaterialIcons name="person" size={24} color={COLORS.PRIMARY} />
              <View style={styles.driverDetails}>
                <Text style={styles.driverName}>{vehicle.driverName}</Text>
                <View style={styles.ratingContainer}>
                  <MaterialIcons name="star" size={16} color={COLORS.WARNING} />
                  <Text style={styles.ratingText}>{vehicle.rating.toFixed(1)}</Text>
                </View>
              </View>
            </View>

            {vehicle.available && (
              <TouchableOpacity style={styles.bookButton} onPress={handleBookNow}>
                <Text style={styles.bookButtonText}>Book This Vehicle</Text>
              </TouchableOpacity>
            )}
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
  },
  vehicleImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    margin: 16,
    marginTop: -20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  vehicleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  vehicleType: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.SECONDARY_DARK,
  },
  vehicleModel: {
    fontSize: 16,
    color: COLORS.SECONDARY,
    marginTop: 4,
  },
  availabilityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: '500',
  },
  detailsContainer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.GREY_LIGHT,
    paddingTop: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
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
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: COLORS.GREY_LIGHT,
    borderRadius: 8,
    marginBottom: 16,
  },
  driverDetails: {
    marginLeft: 12,
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.SECONDARY_DARK,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: COLORS.SECONDARY,
  },
  bookButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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