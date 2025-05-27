import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator 
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { router } from 'expo-router';
import { fetchVehicles, filterVehicles, Vehicle } from '@/store/slices/vehicleSlice';
import { RootState, AppDispatch } from '@/store/store';
import { COLORS } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

export default function VehiclesScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { vehicles, filteredVehicles, isLoading } = useSelector((state: RootState) => state.vehicles);
  const { theme } = useSelector((state: RootState) => state.settings);
  
  const [selectedType, setSelectedType] = useState<string>('All');
  const [showAvailableOnly, setShowAvailableOnly] = useState<boolean>(false);

  // Refresh vehicles list when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      const refreshData = async () => {
        await dispatch(fetchVehicles());
        // Apply filters after fetching
        dispatch(filterVehicles({ 
          type: selectedType === 'All' ? undefined : selectedType,
          available: showAvailableOnly ? true : undefined
        }));
      };
      
      refreshData();
    }, [dispatch])
  );

  // Apply filters when selection changes
  useEffect(() => {
    dispatch(filterVehicles({ 
      type: selectedType === 'All' ? undefined : selectedType,
      available: showAvailableOnly ? true : undefined
    }));
  }, [dispatch, selectedType, showAvailableOnly, vehicles]);

  const vehicleTypes = ['All', 'Sedan', 'SUV', 'Minivan'];

  const renderTypeFilter = () => (
    <View style={styles.filterContainer}>
      <FlatList
        data={vehicleTypes}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.typeFilterItem,
              selectedType === item && styles.typeFilterItemActive
            ]}
            onPress={() => setSelectedType(item)}
          >
            <Text
              style={[
                styles.typeFilterText,
                selectedType === item && styles.typeFilterTextActive
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
      />
      
      <TouchableOpacity
        style={styles.availabilityFilter}
        onPress={() => setShowAvailableOnly(!showAvailableOnly)}
      >
        <MaterialIcons
          name={showAvailableOnly ? "check-box" : "check-box-outline-blank"}
          size={24}
          color={showAvailableOnly ? COLORS.PRIMARY : COLORS.SECONDARY}
        />
        <Text style={[
          styles.availabilityText,
          { color: showAvailableOnly ? COLORS.PRIMARY : COLORS.SECONDARY }
        ]}>
          Available Only
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderVehicleItem = ({ item }: { item: Vehicle }) => (
    <TouchableOpacity 
      style={[
        styles.vehicleCard,
        { backgroundColor: theme === 'dark' ? COLORS.DARK_CARD : 'white' }
      ]}
      onPress={() => router.push(`/vehicles/${item.vehicleId}`)}
    >
      <Image source={{ uri: item.image }} style={styles.vehicleImage} />
      
      <View style={styles.vehicleInfo}>
        <View style={styles.vehicleHeader}>
          <Text style={styles.vehicleType}>{item.type}</Text>
          <View style={[
            styles.availabilityBadge,
            { backgroundColor: item.available ? COLORS.SUCCESS + '20' : COLORS.ERROR + '20' }
          ]}>
            <Text style={[
              styles.availabilityText,
              { color: item.available ? COLORS.SUCCESS : COLORS.ERROR }
            ]}>
              {item.available ? 'Available' : 'Unavailable'}
            </Text>
          </View>
        </View>
        
        <View style={styles.vehicleDetails}>
          <View style={styles.detailItem}>
            <MaterialIcons name="directions-car" size={16} color={COLORS.SECONDARY} />
            <Text style={styles.detailText}>Vehicle ID: {item.vehicleId}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <MaterialIcons name="person" size={16} color={COLORS.SECONDARY} />
            <Text style={styles.detailText}>Driver: {item.driverName}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <MaterialIcons name="event-seat" size={16} color={COLORS.SECONDARY} />
            <Text style={styles.detailText}>Capacity: {item.capacity} Passenger{item.capacity > 1 ? 's' : ''}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="car-rental" size={60} color={COLORS.SECONDARY_LIGHT} />
      <Text style={styles.emptyText}>No vehicles found</Text>
      <Text style={styles.emptySubtext}>
        Try changing your filter settings
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme === 'dark' ? COLORS.DARK_BG : COLORS.LIGHT_BG }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.title}>Available Vehicles</Text>
        <View style={{ width: 24 }} />
      </View>
      
      {renderTypeFilter()}
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        </View>
      ) : (
        <FlatList
          data={filteredVehicles}
          renderItem={renderVehicleItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={renderEmptyList}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.LIGHT_BG,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginLeft: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  typeFilterItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  typeFilterItemActive: {
    backgroundColor: COLORS.PRIMARY,
  },
  typeFilterText: {
    color: COLORS.SECONDARY_DARK,
    fontWeight: '500',
  },
  typeFilterTextActive: {
    color: 'white',
  },
  availabilityFilter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availabilityText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  vehicleCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  vehicleImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  vehicleInfo: {
    flex: 1,
    marginLeft: 12,
  },
  vehicleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  vehicleType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.SECONDARY_DARK,
  },
  availabilityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  vehicleDetails: {
    marginTop: 4,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.SECONDARY,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.SECONDARY_DARK,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.SECONDARY,
    marginTop: 8,
  },
}); 