import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { COLORS } from '@/constants/colors';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface FormInputProps extends TextInputProps {
  label: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export default function FormInput({ 
  label, 
  error, 
  leftIcon, 
  ...props 
}: FormInputProps) {
  const { theme } = useSelector((state: RootState) => state.settings);
  
  return (
    <View style={styles.container}>
      <Text 
        style={[
          styles.label,
          { color: theme === 'dark' ? 'white' : COLORS.SECONDARY_DARK }
        ]}
      >
        {label}
      </Text>
      <View 
        style={[
          styles.inputContainer,
          error ? styles.inputError : null,
          { backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'white' }
        ]}
      >
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
        <TextInput
          {...props}
          style={[
            styles.input,
            leftIcon ? styles.inputWithIcon : null,
            { color: theme === 'dark' ? 'white' : COLORS.SECONDARY_DARK }
          ]}
          placeholderTextColor={theme === 'dark' ? 'rgba(255,255,255,0.5)' : COLORS.SECONDARY}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: COLORS.SECONDARY_DARK,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.GREY_LIGHT,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  iconContainer: {
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    fontSize: 16,
    color: COLORS.SECONDARY_DARK,
  },
  inputWithIcon: {
    paddingLeft: 0,
  },
  inputError: {
    borderColor: COLORS.ERROR,
  },
  errorText: {
    color: COLORS.ERROR,
    fontSize: 12,
    marginTop: 4,
  },
});