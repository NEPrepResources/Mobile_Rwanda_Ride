# RwandaRide

RwandaRide is a comprehensive ride-booking mobile application built using React Native and Expo. The app provides a platform for passengers to book rides and for drivers to accept ride requests in Rwanda.

## Features

### Client Interface
- **Authentication**: Secure signup and login with form validation
- **Profile Management**: View and update personal details
- **Ride Booking**: Book rides with various options (economy, premium, shared)
- **Booking Management**: Update or cancel pending bookings
- **Booking History**: View past and current bookings
- **Vehicle Listing**: Browse available vehicles with filtering options
- **Settings**: Theme selection, language preferences, notifications

### Driver Interface
- **Authentication**: Driver-specific signup and login
- **Ride Request Management**: View and respond to pending ride requests
- **Booking History**: Track completed, cancelled, and rejected bookings

## Tech Stack

- **Frontend**: React Native with Expo
- **State Management**: Redux Toolkit
- **Navigation**: Expo Router with Drawer Navigation
- **Styling**: StyleSheet API with customized themes
- **Validation**: Yup validation schemas
- **Data Persistence**: AsyncStorage for offline capability
- **UI Components**: Custom components for consistent design
- **Mock Backend**: JSON Server for simulated API

## Installation and Setup

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Expo CLI

### Installation
1. Clone the repository:
```bash
git clone https://github.com/yourusername/rwandaride.git
cd rwandaride
```

2. Install dependencies:
```bash
npm install
```

3. Start the mock API server:
```bash
npx json-server --watch mock/db.json --port 3000
```

4. Start the Expo development server:
```bash
npm run dev
```

### Using the App
- Use the Expo Go app on your phone to scan the QR code from the terminal
- Or run in web browser (limited functionality)

## User Guide

### Client Users

1. **Sign up/Login**:
   - Create an account or log in with your email and password
   - Enter required information including phone number and address

2. **Book a Ride**:
   - Enter pickup location and destination
   - Select ride type (Economy: 500 RWF/km, Premium: 800 RWF/km, Shared: 300 RWF/km)
   - Choose number of passengers (1-4)
   - Select date and time (at least 30 minutes in advance)
   - Enter duration (0.5-12 hours)

3. **Manage Bookings**:
   - View all bookings in the Bookings screen
   - Filter by status (Pending, Confirmed, Completed, Cancelled)
   - Update or cancel pending bookings

4. **Profile Management**:
   - Update personal information
   - Change profile picture

5. **Settings**:
   - Change theme (Light/Dark)
   - Select language (English, Kinyarwanda, French)
   - Toggle notifications

### Driver Users

1. **Sign up/Login**:
   - Register as a driver (requires driver license number)
   - Log in with your credentials

2. **Manage Ride Requests**:
   - View pending ride requests
   - Accept or reject requests
   - Provide reason when rejecting

3. **Track Bookings**:
   - View confirmed and completed bookings
   - See history of past bookings

## Testing Accounts

### Client Users
- Email: john.mugabo@example.com
- Password: Password123!

### Driver Users
- Email: james.kamanzi@example.com
- Password: Password123!

## License
This project is licensed under the MIT License.