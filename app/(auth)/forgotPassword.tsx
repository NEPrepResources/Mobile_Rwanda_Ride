import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/colors';
import FormInput from '@/components/ui/FormInput';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { validateEmail } from '@/utils/validation';
import LogoHeader from '@/components/ui/LogoHeader';

const fetchUserFromMockDB = async (email: string) => {
  try {
    const db = require('../../mock/db.json');
    const user = db.users.find((user: any) => user.email === email);
    return user;
  } catch (error) {
    console.error('Error accessing mock DB:', error);
    return null;
  }
};

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    const emailValidation = validateEmail(email);
    
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error);
      return;
    }
    
    setEmailError('');
    setIsLoading(true);
    
    try {
      const user = await fetchUserFromMockDB(email);
      
      if (user) {
        Alert.alert(
          'Password Recovery',
          `We found your account.\n\nEmail: ${user.email}\nPassword: ${user.password}`,
          [
            { text: 'OK', onPress: () => router.back() }
          ]
        );
      } else {
        Alert.alert(
          'Account Not Found',
          'No account found with this email address. Please check your email or sign up for a new account.',
          [
            { text: 'OK' }
          ]
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'An error occurred while processing your request. Please try again.',
        [
          { text: 'OK' }
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LogoHeader />

      <View style={styles.formContainer}>
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subtitle}>Enter your email to recover your password</Text>

        <FormInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your registered email"
          keyboardType="email-address"
          autoCapitalize="none"
          error={emailError}
        />

        <PrimaryButton
          title={isLoading ? 'Processing...' : 'Recover Password'}
          onPress={handleSubmit}
          disabled={isLoading}
        />

        <TouchableOpacity
          style={styles.backToLogin}
          onPress={() => router.back()}
        >
          <Text style={styles.backToLoginText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
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
  backToLogin: {
    alignSelf: 'center',
    marginTop: 20,
  },
  backToLoginText: {
    color: COLORS.PRIMARY,
    fontSize: 14,
    fontWeight: 'bold',
  },
});