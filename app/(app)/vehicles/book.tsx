import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, BackHandler, Platform, Image } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { createBooking } from '@/store/slices/bookingSlice';
import { updateVehicleAvailability } from '@/store/slices/vehicleSlice';
import { COLORS } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormInput from '@/components/ui/FormInput';
import PrimaryButton from '@/components/ui/PrimaryButton';

export default function BookVehicleScreen() {
  const { vehicleId } = useLocalSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const { vehicles } = useSelector((state: RootState) => state.vehicles);
  const { user } = useSelector((state: RootState) => state.auth);
  const { theme } = useSelector((state: RootState) => state.settings);
  
  const vehicle = vehicles.find(v => v.vehicleId === vehicleId);
  
  const [pickupLocation, setPickupLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [passengers, setPassengers] = useState('1');
  const [duration, setDuration] = useState('1');
  const [isLoading, setIsLoading] = useState(false);

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
          <Text style={styles.title}>Book Vehicle</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.notFoundContainer}>
          <MaterialIcons name="error-outline" size={60} color={COLORS.SECONDARY} />
          <Text style={styles.notFoundText}>Vehicle not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleBooking = async () => {
    if (!pickupLocation || !destination || !passengers || !duration) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const bookingData = {
        vehicleId: vehicle.vehicleId,
        userId: user?.id,
        pickupLocation,
        destination,
        passengers: parseInt(passengers),
        duration: parseInt(duration),
        rideType: vehicle.type,
        dateTime: new Date().toISOString(),
        status: 'Pending',
        cost: vehicle.pricePerKm * parseInt(duration) * 10, // Assuming 10km per hour
      };

      await dispatch(createBooking(bookingData)).unwrap();
      await dispatch(updateVehicleAvailability({ vehicleId: vehicle.vehicleId, available: false })).unwrap();

      Alert.alert(
        'Success',
        'Your booking has been submitted successfully!',
        [
          {
            text: 'View Bookings',
            onPress: () => router.push('/(app)/bookings'),
          },
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme === 'dark' ? COLORS.DARK_BG : COLORS.LIGHT_BG }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.title}>Book Vehicle</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.vehicleInfo}>
          <Image source={{ uri: vehicle.image }} style={styles.vehicleImage} />
          <View style={styles.vehicleDetails}>
            <Text style={styles.vehicleType}>{vehicle.type}</Text>
            <Text style={styles.vehicleModel}>{vehicle.model}</Text>
            <Text style={styles.priceText}>{vehicle.pricePerKm} RWF/km</Text>
          </View>
        </View>

        <View style={styles.formContainer}>
          <FormInput
            label="Pickup Location"
            value={pickupLocation}
            onChangeText={setPickupLocation}
            placeholder="Enter pickup location"
          />

          <FormInput
            label="Destination"
            value={destination}
            onChangeText={setDestination}
            placeholder="Enter destination"
          />

          <FormInput
            label="Number of Passengers"
            value={passengers}
            onChangeText={setPassengers}
            placeholder="Enter number of passengers"
            keyboardType="numeric"
          />

          <FormInput
            label="Duration (hours)"
            value={duration}
            onChangeText={setDuration}
            placeholder="Enter duration in hours"
            keyboardType="numeric"
          />

          <View style={styles.estimatedCost}>
            <Text style={styles.estimatedCostLabel}>Estimated Cost</Text>
            <Text style={styles.estimatedCostValue}>
              {vehicle.pricePerKm * parseInt(duration || '0') * 10} RWF
            </Text>
            <Text style={styles.estimatedCostNote}>
              Based on average 10km per hour
            </Text>
          </View>

          <PrimaryButton
            title={isLoading ? 'Processing...' : 'Confirm Booking'}
            onPress={handleBooking}
            disabled={isLoading}
          />
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
  vehicleInfo: {
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  vehicleImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  vehicleDetails: {
    marginLeft: 16,
    flex: 1,
  },
  vehicleType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.SECONDARY_DARK,
  },
  vehicleModel: {
    fontSize: 14,
    color: COLORS.SECONDARY,
    marginTop: 4,
  },
  priceText: {
    fontSize: 16,
    color: COLORS.PRIMARY,
    fontWeight: '500',
    marginTop: 8,
  },
  formContainer: {
    padding: 16,
  },
  estimatedCost: {
    backgroundColor: COLORS.PRIMARY + '10',
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
    alignItems: 'center',
  },
  estimatedCostLabel: {
    fontSize: 14,
    color: COLORS.SECONDARY,
    marginBottom: 4,
  },
  estimatedCostValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  estimatedCostNote: {
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