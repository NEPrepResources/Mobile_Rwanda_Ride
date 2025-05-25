import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import Modal from 'react-native-modal';
import { updateProfile, resetError } from '@/store/slices/authSlice';
import { RootState, AppDispatch } from '@/store/store';
import FormInput from '@/components/ui/FormInput';
import PrimaryButton from '@/components/ui/PrimaryButton';
import {
  validateFullName,
  validatePhone,
  validateEmail,
  validateAddress,
} from '@/utils/validation';
import { COLORS } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isLoading, error } = useSelector((state: RootState) => state.auth);
  const { theme } = useSelector((state: RootState) => state.settings);

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [profilePicture, setProfilePicture] = useState<string | undefined>(undefined);


  const [fullNameError, setFullNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [profilePictureError, setProfilePictureError] = useState('');

  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setPhone(user.phone);
      setEmail(user.email);
      setAddress(user.address);
      setProfilePicture(user.profilePicture || undefined);
    }
  }, [user]);

  useEffect(() => {
    if (error) {
      setIsErrorModalVisible(true);
    }
  }, [error]);

  const closeSuccessModal = () => setIsSuccessModalVisible(false);
  const closeErrorModal = () => {
    setIsErrorModalVisible(false);
    dispatch(resetError());
  };

  const selectImage = async () => {
    if (!isEditing) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        const response = await fetch(result.assets[0].uri);
        const blob = await response.blob();

        if (blob.size > 5 * 1024 * 1024) {
          setProfilePictureError('Image size must be less than 5MB');
          return;
        }

        setProfilePicture(result.assets[0].uri);
        setProfilePictureError('');
      }
    } catch (err) {
      setProfilePictureError('Failed to select image');
    }
  };

  const validateForm = () => {
    let isValid = true;

    const validations = [
      { value: fullName, validate: validateFullName, setError: setFullNameError },
      { value: phone, validate: validatePhone, setError: setPhoneError },
      { value: email, validate: validateEmail, setError: setEmailError },
      { value: address, validate: validateAddress, setError: setAddressError },
    ];

    validations.forEach(({ value, validate, setError }) => {
      const result = validate(value);
      if (!result.isValid) {
        setError(result.error);
        isValid = false;
      } else {
        setError('');
      }
    });

    if (!profilePicture) {
      setProfilePictureError('Profile picture is required');
      isValid = false;
    } else {
      setProfilePictureError('');
    }

    return isValid;
  };

  const handleSaveProfile = () => {
    if (validateForm()) {
      dispatch(
        updateProfile({ fullName, phone, email, address, profilePicture })
      ).then((result) => {
        if (result.meta.requestStatus === 'fulfilled') {
          setIsSuccessModalVisible(true);
          setIsEditing(false);
        }
      });
    }
  };

  const handleCancelEdit = () => {
    if (user) {
      setFullName(user.fullName);
      setPhone(user.phone);
      setEmail(user.email);
      setAddress(user.address);
      setProfilePicture(user.profilePicture || undefined);
    }

    setFullNameError('');
    setPhoneError('');
    setEmailError('');
    setAddressError('');
    setProfilePictureError('');
    setIsEditing(false);
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      </View>
    );
  }

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: theme === 'dark' ? COLORS.DARK_BG : COLORS.LIGHT_BG },
      ]}
      contentContainerStyle={styles.contentContainer}
    >
      <View
        style={[
          styles.profileCard,
          { backgroundColor: theme === 'dark' ? COLORS.DARK_CARD : 'white' },
        ]}
      >
        <TouchableOpacity
          style={styles.profilePictureContainer}
          onPress={selectImage}
          disabled={!isEditing}
        >
          {profilePicture ? (
            <>
              <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
              {isEditing && (
                <View style={styles.editOverlay}>
                  <MaterialIcons name="edit" size={24} color="white" />
                </View>
              )}
            </>
          ) : (
            <View style={styles.profilePicturePlaceholder}>
              <Text style={styles.profilePicturePlaceholderText}>
                {user.fullName.charAt(0)}
              </Text>
              {isEditing && (
                <View style={styles.editOverlay}>
                  <MaterialIcons name="edit" size={24} color="white" />
                </View>
              )}
            </View>
          )}
        </TouchableOpacity>

        {profilePictureError && isEditing && (
          <Text style={styles.errorText}>{profilePictureError}</Text>
        )}

        <View style={styles.headerContainer}>
          <Text style={styles.nameText}>{user.fullName}</Text>
          <Text style={styles.roleText}>{user.isDriver ? 'Driver' : 'Passenger'}</Text>
        </View>

        {!isEditing ? (
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <MaterialIcons name="email" size={20} color={COLORS.PRIMARY} />
              <Text style={styles.infoText}>{user.email}</Text>
            </View>
            <View style={styles.infoItem}>
              <MaterialIcons name="phone" size={20} color={COLORS.PRIMARY} />
              <Text style={styles.infoText}>{user.phone}</Text>
            </View>
            <View style={styles.infoItem}>
              <MaterialIcons name="location-on" size={20} color={COLORS.PRIMARY} />
              <Text style={styles.infoText}>{user.address}</Text>
            </View>
            {user.isDriver && (
              <View style={styles.infoItem}>
                <MaterialIcons name="badge" size={20} color={COLORS.PRIMARY} />
                <Text style={styles.infoText}>License: {user.licenseNumber}</Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.formContainer}>
            <FormInput label="Full Name" value={fullName} onChangeText={setFullName} placeholder="Enter your full name" error={fullNameError} />
            <FormInput label="Phone Number" value={phone} onChangeText={setPhone} placeholder="Enter your phone number" keyboardType="phone-pad" error={phoneError} />
            <FormInput label="Email" value={email} onChangeText={setEmail} placeholder="Enter your email" keyboardType="email-address" autoCapitalize="none" error={emailError} />
            <FormInput label="Address" value={address} onChangeText={setAddress} placeholder="Enter your address" error={addressError} />
          </View>
        )}

        <View style={styles.buttonsContainer}>
          {isEditing ? (
            <>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEdit}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <PrimaryButton title={isLoading ? 'Saving...' : 'Save Changes'} onPress={handleSaveProfile} disabled={isLoading} style={styles.saveButton} />
            </>
          ) : (
            <PrimaryButton title="Edit Profile" onPress={() => setIsEditing(true)} icon={<MaterialIcons name="edit" size={20} color="white" />} />
          )}
        </View>
      </View>

      {/* Success Modal */}
      <Modal isVisible={isSuccessModalVisible} onBackdropPress={closeSuccessModal}>
        <View style={styles.modalContainer}>
          <MaterialIcons name="check-circle" size={60} color={COLORS.SUCCESS} />
          <Text style={styles.modalTitle}>Profile Updated</Text>
          <Text style={styles.modalMessage}>Your profile information has been updated successfully.</Text>
          <TouchableOpacity style={styles.modalButton} onPress={closeSuccessModal}>
            <Text style={styles.modalButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Error Modal */}
      <Modal isVisible={isErrorModalVisible} onBackdropPress={closeErrorModal}>
        <View style={styles.modalContainer}>
          <MaterialIcons name="error-outline" size={60} color={COLORS.ERROR} />
          <Text style={styles.modalTitle}>Update Failed</Text>
          <Text style={styles.modalMessage}>{error}</Text>
          <TouchableOpacity style={styles.modalButton} onPress={closeErrorModal}>
            <Text style={styles.modalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { padding: 20 },
  profileCard: {
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  profilePictureContainer: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  profilePicture: {
    width: 100, height: 100, borderRadius: 50,
  },
  profilePicturePlaceholder: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: COLORS.GREY,
    alignItems: 'center', justifyContent: 'center',
  },
  profilePicturePlaceholderText: {
    fontSize: 36, color: 'white',
  },
  editOverlay: {
    position: 'absolute', bottom: 0, right: 0,
    backgroundColor: COLORS.PRIMARY, borderRadius: 20, padding: 5,
  },
  headerContainer: { alignItems: 'center', marginBottom: 20 },
  nameText: { fontSize: 20, fontWeight: 'bold' },
  roleText: { fontSize: 14, color: COLORS.SECONDARY },
  infoContainer: { gap: 12 },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoText: { fontSize: 16 },
  formContainer: { gap: 16 },
  buttonsContainer: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  cancelButton: {
    backgroundColor: COLORS.ERROR,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  cancelButtonText: { color: 'white', fontWeight: 'bold' },
  saveButton: { flex: 1 },
  errorText: { color: COLORS.ERROR, marginTop: 8, textAlign: 'center' },
  modalContainer: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 12 },
  modalMessage: { textAlign: 'center', marginVertical: 12 },
  modalButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 6,
  },
  modalButtonText: { color: 'white', fontWeight: 'bold' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
