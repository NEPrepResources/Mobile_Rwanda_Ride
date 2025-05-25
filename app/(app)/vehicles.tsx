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
import { fetchVehicles, filterVehicles, Vehicle } from '@/store/slices/vehicleSlice';
import { RootState, AppDispatch } from '@/store/store';
import { COLORS } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';

export default function VehiclesScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { vehicles, filteredVehicles, isLoading } = useSelector((state: RootState) => state.vehicles);
  const { theme } = useSelector((state: RootState) => state.settings);
  
  const [selectedType, setSelectedType] = useState<string>('All');
  const [showAvailableOnly, setShowAvailableOnly] = useState<boolean>(true);

  useEffect(() => {
    dispatch(fetchVehicles());
  }, [dispatch]);

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
    <View 
      style={[
        styles.vehicleCard,
        { backgroundColor: theme === 'dark' ? COLORS.DARK_CARD : 'white' }
      ]}
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
        
        {item.available && (
          <TouchableOpacity style={styles.bookButton} onPress={() => {}}>
            <Text style={styles.bookButtonText}>Book This Vehicle</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
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
    <View 
      style={[
        styles.container,
        { backgroundColor: theme === 'dark' ? COLORS.DARK_BG : COLORS.LIGHT_BG }
      ]}
    >
      <Text style={styles.title}>Available Vehicles</Text>
      
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
    </View>
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
    shadowRadius: 1,
    elevation: 2,
  },
  typeFilterItemActive: {
    backgroundColor: COLORS.PRIMARY,
  },
  typeFilterText: {
    color: COLORS.SECONDARY,
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
    marginLeft: 4,
    fontWeight: '500',
  },
  listContainer: {
    padding: 16,
    paddingTop: 0,
  },
  vehicleCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  vehicleImage: {
    width: '100%',
    height: 160,
  },
  vehicleInfo: {
    padding: 16,
  },
  vehicleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  vehicleType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.SECONDARY_DARK,
  },
  availabilityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  vehicleDetails: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  detailText: {
    marginLeft: 8,
    color: COLORS.SECONDARY,
    fontSize: 14,
  },
  bookButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.SECONDARY_DARK,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.SECONDARY,
    marginTop: 8,
    textAlign: 'center',
  },
});