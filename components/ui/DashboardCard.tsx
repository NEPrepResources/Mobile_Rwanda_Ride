import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

// Define the valid MaterialIcons names
type MaterialIconName = React.ComponentProps<typeof MaterialIcons>['name'];

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  viewAllRoute?: any; // Changed from string to any to bypass the router type issue
  emptyStateText?: string;
  emptyStateIcon?: MaterialIconName; 
}

export default function DashboardCard({
  title,
  children,
  viewAllRoute,
  emptyStateText,
  emptyStateIcon = 'info',
}: DashboardCardProps) {
  const { theme } = useSelector((state: RootState) => state.settings);
  
  const hasContent = React.Children.count(children) > 0;
  
  return (
    <View 
      style={[
        styles.card,
        { backgroundColor: theme === 'dark' ? COLORS.DARK_CARD : 'white' }
      ]}
    >
      <View style={styles.cardHeader}>
        <Text 
          style={[
            styles.cardTitle,
            { color: theme === 'dark' ? 'white' : COLORS.SECONDARY_DARK }
          ]}
        >
          {title}
        </Text>
        
        {viewAllRoute && hasContent && (
          <TouchableOpacity onPress={() => router.push(viewAllRoute)}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {hasContent ? (
        <View style={styles.cardContent}>
          {children}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <MaterialIcons name={emptyStateIcon} size={48} color={COLORS.GREY} />
          <Text 
            style={[
              styles.emptyStateText,
              { color: theme === 'dark' ? COLORS.GREY_LIGHT : COLORS.SECONDARY }
            ]}
          >
            {emptyStateText || 'No data available'}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.SECONDARY_DARK,
  },
  viewAllText: {
    fontSize: 14,
    color: COLORS.PRIMARY,
  },
  cardContent: {
    // Content styling will be handled by children
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  emptyStateText: {
    marginTop: 8,
    color: COLORS.SECONDARY,
    textAlign: 'center',
  },
});