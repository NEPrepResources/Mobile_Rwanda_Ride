import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, BackHandler, Platform, Image } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { createBooking } from '@/store/slices/bookingSlice';
import { updateVehicleAvailability } from '@/store/slices/vehicleSlice';
import { fetchVehicles } from '@/store/slices/vehicleSlice';
import { COLORS } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormInput from '@/components/ui/FormInput';
import PrimaryButton from '@/components/ui/PrimaryButton';

const RIDE_TYPE_PRICES = {
  Economy: 1000, // Base price per km
  Shared: 800,   // 20% less than Economy
  Premium: 1500  // 50% more than Economy
};

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
  const [rideType, setRideType] = useState('Economy');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      const backAction = () => {
        router.back();
        return true;
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

      return () => {
        try {
          backHandler.remove();
        } catch (error) {
          console.log('Error removing back handler:', error);
        }
      };
    }
  }, []);

  const handleBack = () => {
    router.back();
  };
  const calculateEstimatedCost = () => {
    const basePrice = RIDE_TYPE_PRICES[rideType as keyof typeof RIDE_TYPE_PRICES] || RIDE_TYPE_PRICES.Economy;
    const durationHours = parseInt(duration) || 0;
    const avgKmPerHour = 10; // Average speed assumption
    return basePrice * durationHours * avgKmPerHour;
  };

  const handleRideTypeSelect = (type: string) => {
    setRideType(type);
  };

  const handleBooking = () => {
    if (!pickupLocation || !destination || !passengers || !duration) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    Alert.alert(
      'Booking Successful',
      'Your ride has been booked successfully!',
      [
        {
          text: 'OK',
          onPress: () => {
            // Navigate back to vehicles list
            router.push('/(app)/(tabs)');
          },
        }
      ],
      { cancelable: false }
    );
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
            <Text style={styles.priceText}>{RIDE_TYPE_PRICES[rideType as keyof typeof RIDE_TYPE_PRICES]} RWF/km</Text>
          </View>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.rideTypeContainer}>
            {Object.keys(RIDE_TYPE_PRICES).map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.rideTypeButton,
                  rideType === type && styles.rideTypeButtonActive
                ]}
                onPress={() => handleRideTypeSelect(type)}
              >
                <MaterialIcons
                  name={type === 'Premium' ? 'star' : type === 'Shared' ? 'people' : 'directions-car'}
                  size={24}
                  color={rideType === type ? 'white' : COLORS.PRIMARY}
                />
                <Text style={[
                  styles.rideTypeText,
                  rideType === type && styles.rideTypeTextActive
                ]}>
                  {type}
                </Text>
                <Text style={[
                  styles.rideTypePriceText,
                  rideType === type && styles.rideTypeTextActive
                ]}>
                  {RIDE_TYPE_PRICES[type as keyof typeof RIDE_TYPE_PRICES]} RWF/km
                </Text>
              </TouchableOpacity>
            ))}
          </View>

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
              {calculateEstimatedCost().toLocaleString()} RWF
            </Text>
          </View>

          <PrimaryButton
            title="Confirm Booking"
            onPress={handleBooking}
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
  rideTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  rideTypeButton: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'white',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
  },
  rideTypeButtonActive: {
    backgroundColor: COLORS.PRIMARY,
  },
  rideTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.PRIMARY,
    marginTop: 4,
  },
  rideTypeTextActive: {
    color: 'white',
  },
  rideTypePriceText: {
    fontSize: 12,
    color: COLORS.SECONDARY,
    marginTop: 2,
  },
}); 