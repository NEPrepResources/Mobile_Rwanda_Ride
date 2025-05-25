import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator 
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
  validateAddress
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
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  
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
      setProfilePicture(user.profilePicture || null);
    }
  }, [user]);
  
  useEffect(() => {
    if (error) {
      setIsErrorModalVisible(true);
    }
  }, [error]);
  
  const closeSuccessModal = () => {
    setIsSuccessModalVisible(false);
  };
  
  const closeErrorModal = () => {
    setIsErrorModalVisible(false);
    dispatch(resetError());
  };
  
  const selectImage = async () => {
    if (!isEditing) return;
    
    try {
      const result = await ImagePicker.launchImagePickerAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
      
      if (!result.canceled) {
        // Check file size (5MB limit)
        const response = await fetch(result.assets[0].uri);
        const blob = await response.blob();
        
        if (blob.size > 5 * 1024 * 1024) {
          setProfilePictureError('Image size must be less than 5MB');
          return;
        }
        
        setProfilePicture(result.assets[0].uri);
        setProfilePictureError('');
      }
    } catch (error) {
      setProfilePictureError('Failed to select image');
    }
  };
  
  const validateForm = () => {
    let isValid = true;
    
    const fullNameValidation = validateFullName(fullName);
    if (!fullNameValidation.isValid) {
      setFullNameError(fullNameValidation.error);
      isValid = false;
    } else {
      setFullNameError('');
    }
    
    const phoneValidation = validatePhone(phone);
    if (!phoneValidation.isValid) {
      setPhoneError(phoneValidation.error);
      isValid = false;
    } else {
      setPhoneError('');
    }
    
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error);
      isValid = false;
    } else {
      setEmailError('');
    }
    
    const addressValidation = validateAddress(address);
    if (!addressValidation.isValid) {
      setAddressError(addressValidation.error);
      isValid = false;
    } else {
      setAddressError('');
    }
    
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
      dispatch(updateProfile({
        fullName,
        phone,
        email,
        address,
        profilePicture,
      })).then((result) => {
        if (result.meta.requestStatus === 'fulfilled') {
          setIsSuccessModalVisible(true);
          setIsEditing(false);
        }
      });
    }
  };
  
  const handleCancelEdit = () => {
    // Reset to user's current values
    if (user) {
      setFullName(user.fullName);
      setPhone(user.phone);
      setEmail(user.email);
      setAddress(user.address);
      setProfilePicture(user.profilePicture || null);
    }
    
    // Clear error states
    setFullNameError('');
    setPhoneError('');
    setEmailError('');
    setAddressError('');
    setProfilePictureError('');
    
    // Exit edit mode
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
        { backgroundColor: theme === 'dark' ? COLORS.DARK_BG : COLORS.LIGHT_BG }
      ]}
      contentContainerStyle={styles.contentContainer}
    >
      <View 
        style={[
          styles.profileCard,
          { backgroundColor: theme === 'dark' ? COLORS.DARK_CARD : 'white' }
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
        
        {profilePictureError && isEditing ? (
          <Text style={styles.errorText}>{profilePictureError}</Text>
        ) : null}
        
        <View style={styles.headerContainer}>
          <Text style={styles.nameText}>{user.fullName}</Text>
          <Text style={styles.roleText}>
            {user.isDriver ? 'Driver' : 'Passenger'}
          </Text>
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
            <FormInput
              label="Full Name"
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your full name"
              error={fullNameError}
            />
            
            <FormInput
              label="Phone Number"
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              error={phoneError}
            />
            
            <FormInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              error={emailError}
            />
            
            <FormInput
              label="Address"
              value={address}
              onChangeText={setAddress}
              placeholder="Enter your address"
              error={addressError}
            />
          </View>
        )}
        
        <View style={styles.buttonsContainer}>
          {isEditing ? (
            <>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={handleCancelEdit}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <PrimaryButton
                title={isLoading ? "Saving..." : "Save Changes"}
                onPress={handleSaveProfile}
                disabled={isLoading}
                style={styles.saveButton}
              />
            </>
          ) : (
            <PrimaryButton
              title="Edit Profile"
              onPress={() => setIsEditing(true)}
              icon={<MaterialIcons name="edit" size={20} color="white" />}
            />
          )}
        </View>
      </View>
      
      {/* Success Modal */}
      <Modal isVisible={isSuccessModalVisible} onBackdropPress={closeSuccessModal}>
        <View style={styles.modalContainer}>
          <View style={styles.successIconContainer}>
            <MaterialIcons name="check-circle" size={60} color={COLORS.SUCCESS} />
          </View>
          <Text style={styles.modalTitle}>Profile Updated</Text>
          <Text style={styles.modalMessage}>
            Your profile information has been updated successfully.
          </Text>
          <TouchableOpacity style={styles.modalButton} onPress={closeSuccessModal}>
            <Text style={styles.modalButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      
      {/* Error Modal */}
      <Modal isVisible={isErrorModalVisible} onBackdropPress={closeErrorModal}>
        <View style={styles.modalContainer}>
          <View style={styles.errorIconContainer}>
            <MaterialIcons name="error" size={60} color={COLORS.ERROR} />
          </View>
          <Text style={[styles.modalTitle, { color: COLORS.ERROR }]}>Update Failed</Text>
          <Text style={styles.modalMessage}>{error}</Text>
          <TouchableOpacity 
            style={[styles.modalButton, { backgroundColor: COLORS.ERROR }]} 
            onPress={closeErrorModal}
          >
            <Text style={styles.modalButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.LIGHT_BG,
  },
  contentContainer: {
    padding: 16,
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profilePictureContainer: {
    alignSelf: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profilePicturePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.PRIMARY_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePicturePlaceholderText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
  },
  editOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.PRIMARY,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.SECONDARY_DARK,
    marginBottom: 4,
  },
  roleText: {
    fontSize: 16,
    color: COLORS.PRIMARY,
    fontWeight: '500',
  },
  infoContainer: {
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GREY_LIGHT,
  },
  infoText: {
    marginLeft: 12,
    fontSize: 16,
    color: COLORS.SECONDARY_DARK,
  },
  formContainer: {
    marginBottom: 24,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 10,
  },
  cancelButtonText: {
    color: COLORS.PRIMARY,
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    flex: 1,
  },
  errorText: {
    color: COLORS.ERROR,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  successIconContainer: {
    marginBottom: 16,
  },
  errorIconContainer: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.SUCCESS,
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 16,
    color: COLORS.SECONDARY_DARK,
    textAlign: 'center',
    marginBottom: 16,
  },
  modalButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});