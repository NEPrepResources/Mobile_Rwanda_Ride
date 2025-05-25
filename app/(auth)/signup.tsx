import React, { useState, useEffect } from 'react';
import { useNavigation } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Image,
  Alert
} from 'react-native';
import { router, Link } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-native-modal';
import * as ImagePicker from 'expo-image-picker';
import { register, resetError } from '@/store/slices/authSlice';
import { RootState, AppDispatch } from '@/store/store';
import FormInput from '@/components/ui/FormInput';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { BackHandler } from 'react-native';
import {
  validateFullName,
  validatePhone,
  validateEmail,
  validatePassword,
  validateAddress,
  validateLicenseNumber
} from '@/utils/validation';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/colors';
import LogoHeader from '@/components/ui/LogoHeader';

export default function SignupScreen() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [isDriver, setIsDriver] = useState(false);
  const [licenseNumber, setLicenseNumber] = useState('');
  const [profilePicture, setProfilePicture] = useState<string | undefined>(undefined);

  const [fullNameError, setFullNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [licenseNumberError, setLicenseNumberError] = useState('');
  const [profilePictureError, setProfilePictureError] = useState('');

  const [isModalVisible, setIsModalVisible] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, isAuthenticated, error, user } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission required',
          'Please enable permissions to access your photo library.'
        );
      }
    })();
  }, []);


  const closeModal = () => {
    setIsModalVisible(false);
    dispatch(resetError());
  };

  const selectImage = async () => {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, 
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setProfilePicture(result.assets[0].uri);
      setProfilePictureError('');
    }
  } catch (error) {
    console.log('Image picker error:', error);
    setProfilePictureError('Failed to select image');
  }
};

  const validateForm = () => {
    let isValid = true;

    const validations = [
      { validator: validateFullName, value: fullName, setError: setFullNameError },
      { validator: validatePhone, value: phone, setError: setPhoneError },
      { validator: validateEmail, value: email, setError: setEmailError },
      { validator: validatePassword, value: password, setError: setPasswordError },
      { validator: validateAddress, value: address, setError: setAddressError },
    ];

    validations.forEach(({ validator, value, setError }) => {
      const result = validator(value);
      if (!result.isValid) {
        setError(result.error);
        isValid = false;
      } else {
        setError('');
      }
    });

    if (isDriver) {
      const result = validateLicenseNumber(licenseNumber);
      if (!result.isValid) {
        setLicenseNumberError(result.error);
        isValid = false;
      } else {
        setLicenseNumberError('');
      }
    }

    if (!profilePicture) {
      setProfilePictureError('Profile picture is required');
      isValid = false;
    } else {
      setProfilePictureError('');
    }

    return isValid;
  };

useEffect(() => {
  if (error) {
    setIsModalVisible(true);
  }
}, [error]);

useEffect(() => {
  const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
  return () => backHandler.remove();
}, []);

const handleRegister = async () => {
  if (validateForm()) {
    const userData = {
      fullName,
      phone,
      email,
      password,
      address,
      profilePicture: profilePicture || undefined, 
      isDriver,
      ...(isDriver && { licenseNumber })
    };

    try {
      const result = await dispatch(register(userData)).unwrap();
      
      if (result.success) {
        Alert.alert(
          'Registration Successful',
          'Your account has been created successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                setFullName('');
                setPhone('');
                setEmail('');
                setPassword('');
                setAddress('');
                setLicenseNumber('');
                setProfilePicture(undefined);
                setIsDriver(false);
                router.push('/(auth)/login');
              }
            }
          ]
        );
      }
    } catch (error) {
    }
  }
};

  return (
    <SafeAreaView style={styles.safeArea}>
      <LogoHeader small />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join RwandaRide today</Text>

        <View style={styles.accountTypeContainer}>
          <Text style={styles.accountTypeLabel}>Register as a Driver?</Text>
          <Switch
            value={isDriver}
            onValueChange={setIsDriver}
            trackColor={{ false: COLORS.SECONDARY_LIGHT, true: COLORS.PRIMARY_LIGHT }}
            thumbColor={isDriver ? COLORS.PRIMARY : COLORS.GREY}
          />
        </View>

        <View style={styles.profilePictureContainer}>
          <TouchableOpacity onPress={selectImage} style={styles.profilePictureButton}>
            {profilePicture ? (
              <Image source={{ uri: profilePicture }} style={styles.profileImage} />
            ) : (
              <View style={styles.profilePlaceholder}>
                <Text style={styles.profilePlaceholderText}>Add Photo</Text>
              </View>
            )}
          </TouchableOpacity>
          {profilePictureError && <Text style={styles.errorText}>{profilePictureError}</Text>}
        </View>

        <FormInput label="Full Name" value={fullName} onChangeText={setFullName} placeholder="Enter your full name" error={fullNameError} />
        <FormInput label="Phone Number" value={phone} onChangeText={setPhone} placeholder="Enter your phone number" keyboardType="phone-pad" error={phoneError} />
        <FormInput label="Email" value={email} onChangeText={setEmail} placeholder="Enter your email" keyboardType="email-address" autoCapitalize="none" error={emailError} />
        <FormInput label="Password" value={password} onChangeText={setPassword} placeholder="Create a password" secureTextEntry error={passwordError} />
        <FormInput label="Address" value={address} onChangeText={setAddress} placeholder="Enter your address" error={addressError} />

        {isDriver && (
          <FormInput
            label="Driver License Number"
            value={licenseNumber}
            onChangeText={setLicenseNumber}
            placeholder="Enter your license number"
            error={licenseNumberError}
          />
        )}

        <PrimaryButton title={isLoading ? 'Creating Account...' : 'Create Account'} onPress={handleRegister} disabled={isLoading} />

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <Link href="./login" asChild>
            <TouchableOpacity>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>

      <Modal isVisible={isModalVisible} onBackdropPress={closeModal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Registration Failed</Text>
          <Text style={styles.modalMessage}>{error}</Text>
          <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
            <Text style={styles.modalButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.SECONDARY,
    marginBottom: 20,
  },
  accountTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  accountTypeLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.SECONDARY_DARK,
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePictureButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    marginBottom: 10,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profilePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.GREY_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePlaceholderText: {
    color: COLORS.SECONDARY,
    fontSize: 14,
  },
  errorText: {
    color: COLORS.ERROR,
    fontSize: 12,
    marginTop: 5,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    fontSize: 14,
    color: COLORS.SECONDARY,
  },
  loginLink: {
    fontSize: 14,
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.ERROR,
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 14,
    color: COLORS.SECONDARY,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});