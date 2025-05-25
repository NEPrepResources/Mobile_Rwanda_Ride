export const validateFullName = (fullName: string) => {
  if (!fullName) {
    return { isValid: false, error: 'Full Name is required' };
  }
  
  if (fullName.length < 3 || fullName.length > 50) {
    return { isValid: false, error: 'Full Name must be between 3 and 50 characters' };
  }
  
  return { isValid: true, error: '' };
};

export const validatePhone = (phone: string) => {
  if (!phone) {
    return { isValid: false, error: 'Phone Number is required' };
  }
  
  // Check if phone number contains exactly 10 digits
  const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(phone)) {
    return { isValid: false, error: 'Phone Number must be 10 digits' };
  }
  
  return { isValid: true, error: '' };
};

export const validateEmail = (email: string) => {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }
  
  // Basic email regex validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  return { isValid: true, error: '' };
};

export const validatePassword = (password: string) => {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters' };
  }
  
  // Check for mixed case (at least one uppercase and one lowercase letter)
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  if (!hasUppercase || !hasLowercase) {
    return { isValid: false, error: 'Password must contain both uppercase and lowercase letters' };
  }
  
  // Check for at least one number
  if (!/\d/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number' };
  }
  
  // Check for at least one special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one special character' };
  }
  
  return { isValid: true, error: '' };
};

export const validateAddress = (address: string) => {
  if (!address) {
    return { isValid: false, error: 'Address is required' };
  }
  
  if (address.length < 3 || address.length > 100) {
    return { isValid: false, error: 'Address must be between 3 and 100 characters' };
  }
  
  return { isValid: true, error: '' };
};

export const validateLicenseNumber = (licenseNumber: string) => {
  if (!licenseNumber) {
    return { isValid: false, error: 'Driver License Number is required' };
  }
  
  // Check if license number is 8 characters alphanumeric
  const licenseRegex = /^[A-Za-z0-9]{8}$/;
  if (!licenseRegex.test(licenseNumber)) {
    return { isValid: false, error: 'License Number must be 8 alphanumeric characters' };
  }
  
  return { isValid: true, error: '' };
};