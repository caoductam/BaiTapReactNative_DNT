// src/components/Modals/FilterModal.js
import React from 'react';
import { 
  Modal, 
  View, 
  TouchableOpacity, 
  Text, 
  StyleSheet 
} from 'react-native';
import { SORT_OPTIONS } from '../../constants/constants';

const FilterModal = ({ visible, sortBy, darkMode, onClose, onSortChange }) => {
  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={[styles.menu, darkMode && styles.menuDark]}>
          <Text style={[styles.title, darkMode && styles.textDark]}>
            Sắp xếp theo
          </Text>
          
          <TouchableOpacity
            style={[
              styles.item, 
              sortBy === SORT_OPTIONS.NEWEST && styles.itemActive
            ]}
            onPress={() => onSortChange(SORT_OPTIONS.NEWEST)}
          >
            <Text style={styles.icon}>🆕</Text>
            <Text style={[styles.text, darkMode && styles.textDark]}>
              Mới nhất
            </Text>
            {sortBy === SORT_OPTIONS.NEWEST && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.item, 
              sortBy === SORT_OPTIONS.OLDEST && styles.itemActive
            ]}
            onPress={() => onSortChange(SORT_OPTIONS.OLDEST)}
          >
            <Text style={styles.icon}>📅</Text>
            <Text style={[styles.text, darkMode && styles.textDark]}>
              Cũ nhất
            </Text>
            {sortBy === SORT_OPTIONS.OLDEST && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.item, 
              sortBy === SORT_OPTIONS.CAPTION && styles.itemActive
            ]}
            onPress={() => onSortChange(SORT_OPTIONS.CAPTION)}
          >
            <Text style={styles.icon}>🔤</Text>
            <Text style={[styles.text, darkMode && styles.textDark]}>
              Theo ghi chú
            </Text>
            {sortBy === SORT_OPTIONS.CAPTION && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 120,
    paddingHorizontal: 20,
  },
  menu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  menuDark: {
    backgroundColor: '#2A2A2A',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6C757D',
    paddingHorizontal: 12,
    paddingVertical: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 12,
  },
  itemActive: {
    backgroundColor: '#E3F2FD',
  },
  icon: {
    fontSize: 20,
  },
  text: {
    flex: 1,
    fontSize: 16,
    color: '#212529',
    fontWeight: '500',
  },
  checkmark: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  textDark: {
    color: '#FFFFFF',
  },
});

export default FilterModal;