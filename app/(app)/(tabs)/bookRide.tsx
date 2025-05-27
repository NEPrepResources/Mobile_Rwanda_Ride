import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { router } from 'expo-router';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import FormInput from '@/components/ui/FormInput';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { RootState, AppDispatch } from '@/store/store';
import { COLORS } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

interface FormErrors {
  pickupLocation: string;
  destination: string;
  rideType: string;
  passengers: string;
  dateTime: string;
  duration: string;
  vehicle: string;
}

const RIDE_TYPES = {
  Economy: 1000,
  Premium: 1500,
  Shared: 800,
};

export default function BookRideScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { theme } = useSelector((state: RootState) => state.settings);
  const { vehicles } = useSelector((state: RootState) => state.vehicles);

  const [pickupLocation, setPickupLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [rideType, setRideType] = useState<'Economy' | 'Premium' | 'Shared'>('Economy');
  const [passengers, setPassengers] = useState('1');
  const [dateTime, setDateTime] = useState(new Date());
  const [duration, setDuration] = useState('1');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({
    pickupLocation: '',
    destination: '',
    rideType: '',
    passengers: '',
    dateTime: '',
    duration: '',
    vehicle: '',
  });
  const [estimatedCost, setEstimatedCost] = useState(0);

  useEffect(() => {
    if (rideType) {
      const basePrice = RIDE_TYPES[rideType];
      const durationHours = parseFloat(duration) || 1;
      setEstimatedCost(basePrice * durationHours);
    }
  }, [rideType, duration]);

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || dateTime;
    setShowDatePicker(Platform.OS === 'ios');
    setDateTime(currentDate);
  };

  const handleTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    const currentTime = selectedTime || dateTime;
    setShowTimePicker(Platform.OS === 'ios');
    setDateTime(currentTime);
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {
      pickupLocation: '',
      destination: '',
      rideType: '',
      passengers: '',
      dateTime: '',
      duration: '',
      vehicle: '',
    };
    let isValid = true;

    if (!pickupLocation || pickupLocation.length < 3 || pickupLocation.length > 50) {
      errors.pickupLocation = 'Pickup location must be between 3 and 50 characters';
      isValid = false;
    }

    if (!destination || destination.length < 3 || destination.length > 50) {
      errors.destination = 'Destination must be between 3 and 50 characters';
      isValid = false;
    }

    const passengersNum = parseInt(passengers, 10);
    if (isNaN(passengersNum) || passengersNum < 1 || passengersNum > 4) {
      errors.passengers = 'Number of passengers must be between 1 and 4';
      isValid = false;
    }

    const now = new Date();
    const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60000);
    if (dateTime < thirtyMinutesFromNow) {
      errors.dateTime = 'Booking time must be at least 30 minutes from now';
      isValid = false;
    }

    const durationNum = parseFloat(duration);
    if (isNaN(durationNum) || durationNum < 0.5 || durationNum > 12) {
      errors.duration = 'Duration must be between 0.5 and 12 hours';
      isValid = false;
    }

    if (!selectedVehicle) {
      errors.vehicle = 'Please select a vehicle';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      Alert.alert(
        'Booking Successful',
        'Your ride has been booked successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              router.push('/(app)/(tabs)');
            },
          }
        ],
        { cancelable: false }
      );
    }
  };

  const showDateTimePicker = (mode: 'date' | 'time') => {
    if (mode === 'date') {
      setShowDatePicker(true);
    } else {
      setShowTimePicker(true);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={[
          styles.container,
          { backgroundColor: theme === 'dark' ? COLORS.DARK_BG : COLORS.LIGHT_BG },
        ]}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Book a Ride</Text>

          <FormInput
            label="Pickup Location"
            value={pickupLocation}
            onChangeText={setPickupLocation}
            placeholder="Enter pickup location"
            error={formErrors.pickupLocation}
            leftIcon={<MaterialIcons name="location-on" size={20} color={COLORS.PRIMARY} />}
          />

          <FormInput
            label="Destination"
            value={destination}
            onChangeText={setDestination}
            placeholder="Enter destination"
            error={formErrors.destination}
            leftIcon={<MaterialIcons name="flag" size={20} color={COLORS.PRIMARY} />}
          />

          <Text style={styles.label}>Select Vehicle</Text>
          <View style={styles.vehicleContainer}>
            {vehicles.map((vehicle) => (
              <TouchableOpacity
                key={vehicle.vehicleId}
                style={[
                  styles.vehicleButton,
                  selectedVehicle === vehicle.vehicleId && styles.vehicleButtonActive,
                ]}
                onPress={() => setSelectedVehicle(vehicle.vehicleId)}
              >
                <Text
                  style={[
                    styles.vehicleText,
                    selectedVehicle === vehicle.vehicleId && styles.vehicleTextActive,
                  ]}
                >
                  {vehicle.type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {formErrors.vehicle ? <Text style={styles.errorText}>{formErrors.vehicle}</Text> : null}

          <Text style={styles.label}>Ride Type</Text>
          <View style={styles.rideTypeContainer}>
            {(['Economy', 'Premium', 'Shared'] as const).map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.rideTypeButton,
                  rideType === type && styles.rideTypeButtonActive,
                ]}
                onPress={() => setRideType(type)}
              >
                <Text
                  style={[
                    styles.rideTypeText,
                    rideType === type && styles.rideTypeTextActive,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {formErrors.rideType ? <Text style={styles.errorText}>{formErrors.rideType}</Text> : null}

          <FormInput
            label="Number of Passengers"
            value={passengers}
            onChangeText={setPassengers}
            placeholder="Enter number of passengers (1-4)"
            keyboardType="numeric"
            error={formErrors.passengers}
            leftIcon={<MaterialIcons name="person" size={20} color={COLORS.PRIMARY} />}
          />

          <Text style={styles.label}>Date & Time</Text>
          <TouchableOpacity
            style={styles.dateTimeInput}
            onPress={() => showDateTimePicker('date')}
          >
            <MaterialIcons name="calendar-today" size={20} color={COLORS.PRIMARY} />
            <Text style={styles.dateTimeText}>{dateTime.toLocaleDateString()}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dateTimeInput}
            onPress={() => showDateTimePicker('time')}
          >
            <MaterialIcons name="access-time" size={20} color={COLORS.PRIMARY} />
            <Text style={styles.dateTimeText}>
              {dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </TouchableOpacity>
          {formErrors.dateTime ? <Text style={styles.errorText}>{formErrors.dateTime}</Text> : null}

          {showDatePicker && (
            <DateTimePicker
              value={dateTime}
              mode="date"
              is24Hour={true}
              display="default"
              minimumDate={new Date()}
              onChange={handleDateChange}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={dateTime}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={handleTimeChange}
            />
          )}

          <FormInput
            label="Duration (hours)"
            value={duration}
            onChangeText={setDuration}
            placeholder="Enter duration (0.5-12)"
            keyboardType="numeric"
            error={formErrors.duration}
            leftIcon={<MaterialIcons name="hourglass-bottom" size={20} color={COLORS.PRIMARY} />}
          />

          <View style={styles.costContainer}>
            <Text style={styles.costLabel}>Estimated Cost:</Text>
            <Text style={styles.costValue}>{estimatedCost} RWF</Text>
          </View>

          <PrimaryButton
            title="Book Ride"
            onPress={handleSubmit}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.LIGHT_BG,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.LIGHT_BG,
  },
  contentContainer: {
    padding: 16,
    paddingTop: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: COLORS.SECONDARY_DARK,
  },
  vehicleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  vehicleButton: {
    flex: 1,
    minWidth: '30%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.GREY_LIGHT,
    alignItems: 'center',
  },
  vehicleButtonActive: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  vehicleText: {
    color: COLORS.SECONDARY_DARK,
    fontWeight: '500',
  },
  vehicleTextActive: {
    color: 'white',
  },
  rideTypeContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  rideTypeButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.GREY_LIGHT,
    alignItems: 'center',
  },
  rideTypeButtonActive: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  rideTypeText: {
    color: COLORS.SECONDARY_DARK,
    fontWeight: '500',
  },
  rideTypeTextActive: {
    color: 'white',
  },
  dateTimeInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.GREY_LIGHT,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginBottom: 16,
  },
  dateTimeText: {
    marginLeft: 12,
    fontSize: 16,
    color: COLORS.SECONDARY_DARK,
  },
  costContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.PRIMARY_LIGHT + '20',
    borderRadius: 8,
  },
  costLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.SECONDARY_DARK,
  },
  costValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  errorText: {
    color: COLORS.ERROR,
    fontSize: 12,
    marginTop: -12,
    marginBottom: 16,
  },
});