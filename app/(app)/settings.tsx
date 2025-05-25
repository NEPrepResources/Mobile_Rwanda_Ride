import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Switch, 
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { router } from 'expo-router';
import { saveSettings, loadSettings, ThemeType, LanguageType } from '@/store/slices/settingsSlice';
import { logout } from '@/store/slices/authSlice';
import { RootState, AppDispatch } from '@/store/store';
import { COLORS } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { theme, language, notificationsEnabled, isLoading } = useSelector(
    (state: RootState) => state.settings
  );
  
  useEffect(() => {
    dispatch(loadSettings());
  }, [dispatch]);
  
  const updateTheme = (newTheme: ThemeType) => {
    dispatch(saveSettings({ theme: newTheme }));
  };
  
  const updateLanguage = (newLanguage: LanguageType) => {
    dispatch(saveSettings({ language: newLanguage }));
  };
  
  const toggleNotifications = () => {
    dispatch(saveSettings({ notificationsEnabled: !notificationsEnabled }));
  };
  
  const handleLogout = () => {
    dispatch(logout()).then(() => {
      router.replace('../(auth)/login');
    });
  };
  
  const renderThemeOption = (themeOption: ThemeType) => (
    <TouchableOpacity
      style={[
        styles.optionItem,
        theme === themeOption && styles.selectedOption
      ]}
      onPress={() => updateTheme(themeOption)}
    >
      <MaterialIcons 
        name={themeOption === 'light' ? 'wb-sunny' : 'nights-stay'} 
        size={24} 
        color={theme === themeOption ? 'white' : COLORS.SECONDARY_DARK} 
      />
      <Text
        style={[
          styles.optionText,
          theme === themeOption && styles.selectedOptionText
        ]}
      >
        {themeOption === 'light' ? 'Light Mode' : 'Dark Mode'}
      </Text>
    </TouchableOpacity>
  );
  
  const renderLanguageOption = (languageOption: LanguageType) => (
    <TouchableOpacity
      style={[
        styles.optionItem,
        language === languageOption && styles.selectedOption
      ]}
      onPress={() => updateLanguage(languageOption)}
    >
      <Text
        style={[
          styles.optionText,
          language === languageOption && styles.selectedOptionText
        ]}
      >
        {languageOption}
      </Text>
    </TouchableOpacity>
  );
  
  return (
    <ScrollView 
      style={[
        styles.container,
        { backgroundColor: theme === 'dark' ? COLORS.DARK_BG : COLORS.LIGHT_BG }
      ]}
    >
      <Text style={styles.title}>Settings</Text>
      
      {/* Theme Settings */}
      <View 
        style={[
          styles.section,
          { backgroundColor: theme === 'dark' ? COLORS.DARK_CARD : 'white' }
        ]}
      >
        <View style={styles.sectionHeader}>
          <MaterialIcons name="palette" size={24} color={COLORS.PRIMARY} />
          <Text style={styles.sectionTitle}>Theme</Text>
        </View>
        
        <View style={styles.optionsContainer}>
          {renderThemeOption('light')}
          {renderThemeOption('dark')}
        </View>
      </View>
      
      {/* Language Settings */}
      <View 
        style={[
          styles.section,
          { backgroundColor: theme === 'dark' ? COLORS.DARK_CARD : 'white' }
        ]}
      >
        <View style={styles.sectionHeader}>
          <MaterialIcons name="language" size={24} color={COLORS.PRIMARY} />
          <Text style={styles.sectionTitle}>Language</Text>
        </View>
        
        <View style={styles.optionsContainer}>
          {renderLanguageOption('English')}
          {renderLanguageOption('Kinyarwanda')}
          {renderLanguageOption('French')}
        </View>
      </View>
      
      {/* Notification Settings */}
      <View 
        style={[
          styles.section,
          { backgroundColor: theme === 'dark' ? COLORS.DARK_CARD : 'white' }
        ]}
      >
        <View style={styles.sectionHeader}>
          <MaterialIcons name="notifications" size={24} color={COLORS.PRIMARY} />
          <Text style={styles.sectionTitle}>Notifications</Text>
        </View>
        
        <View style={styles.notificationItem}>
          <Text 
            style={[
              styles.notificationText,
              { color: theme === 'dark' ? 'white' : COLORS.SECONDARY_DARK }
            ]}
          >
            Enable Notifications
          </Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
            trackColor={{ false: COLORS.GREY, true: COLORS.PRIMARY_LIGHT }}
            thumbColor={notificationsEnabled ? COLORS.PRIMARY : COLORS.GREY_LIGHT}
          />
        </View>
      </View>
      
      {/* Account Actions */}
      <View 
        style={[
          styles.section,
          { backgroundColor: theme === 'dark' ? COLORS.DARK_CARD : 'white' }
        ]}
      >
        <View style={styles.sectionHeader}>
          <MaterialIcons name="account-circle" size={24} color={COLORS.PRIMARY} />
          <Text style={styles.sectionTitle}>Account</Text>
        </View>
        
        <TouchableOpacity style={styles.accountActionItem} onPress={() => {}}>
          <MaterialIcons name="help" size={24} color={COLORS.SECONDARY} />
          <Text 
            style={[
              styles.accountActionText,
              { color: theme === 'dark' ? 'white' : COLORS.SECONDARY_DARK }
            ]}
          >
            Help & Support
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.accountActionItem} onPress={() => {}}>
          <MaterialIcons name="security" size={24} color={COLORS.SECONDARY} />
          <Text 
            style={[
              styles.accountActionText,
              { color: theme === 'dark' ? 'white' : COLORS.SECONDARY_DARK }
            ]}
          >
            Privacy Policy
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <MaterialIcons name="logout" size={20} color="white" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.versionText}>RwandaRide v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.LIGHT_BG,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    margin: 16,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginLeft: 8,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.GREY_LIGHT,
  },
  selectedOption: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  optionText: {
    color: COLORS.SECONDARY_DARK,
    fontWeight: '500',
    marginLeft: 8,
  },
  selectedOptionText: {
    color: 'white',
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  notificationText: {
    fontSize: 16,
    color: COLORS.SECONDARY_DARK,
  },
  accountActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GREY_LIGHT,
  },
  accountActionText: {
    marginLeft: 16,
    fontSize: 16,
    color: COLORS.SECONDARY_DARK,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.ERROR,
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  versionText: {
    textAlign: 'center',
    color: COLORS.SECONDARY,
    marginVertical: 20,
  },
});