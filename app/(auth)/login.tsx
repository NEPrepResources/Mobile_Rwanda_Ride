import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'; // Added Alert
import { router, Link } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-native-modal';
import { login, resetError } from '@/store/slices/authSlice';
import { RootState, AppDispatch } from '@/store/store';
import FormInput from '@/components/ui/FormInput';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { validateEmail, validatePassword } from '@/utils/validation';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/colors';
import LogoHeader from '@/components/ui/LogoHeader';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, isAuthenticated, error, user } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated && user) {
      Alert.alert(
        'Success',
        'Login Successful',
        [
          {
            text: 'OK',
            onPress: () => {
              if (user.isDriver) {
                router.push('/(driver)');
              } else {
              router.push('/(app)');
              }
            },
          },
        ],
        { cancelable: false }
      );
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (error) {
      setIsModalVisible(true);
    }
  }, [error]);

  const closeModal = () => {
    setIsModalVisible(false);
    dispatch(resetError());
  };

  const validateForm = () => {
    let isValid = true;
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error);
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!passwordValidation.isValid) {
      setPasswordError(passwordValidation.error);
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleLogin = () => {
    if (validateForm()) {
      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();
      dispatch(login({ email: trimmedEmail, password: trimmedPassword }));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LogoHeader />
      <View style={styles.formContainer}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>

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
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
          error={passwordError}
        />

        <TouchableOpacity
          style={styles.forgotPassword}
          onPress={() => router.push('./forgotPassword')}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <PrimaryButton
          title={isLoading ? 'Signing in...' : 'Sign In'}
          onPress={handleLogin}
          disabled={isLoading}
        />

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Don't have an account? </Text>
          <Link href="./signup" asChild>
            <TouchableOpacity>
              <Text style={styles.registerLink}>Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
      <Modal isVisible={isModalVisible} onBackdropPress={closeModal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Login Failed</Text>
          <Text style={styles.modalMessage}>
            {error ? (typeof error === 'string' ? error : JSON.stringify(error)) : 'An unknown error occurred'}
          </Text>
          <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
            <Text style={styles.modalButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  formContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
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
    marginBottom: 30,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: COLORS.PRIMARY,
    fontSize: 14,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerText: {
    color: COLORS.SECONDARY,
  },
  registerLink: {
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
    marginBottom: 10,
    color: COLORS.ERROR,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});