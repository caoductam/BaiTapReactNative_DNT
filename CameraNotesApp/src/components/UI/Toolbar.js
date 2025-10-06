// src/components/UI/Toolbar.js
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { SORT_OPTIONS } from '../../constants/constants';

const Toolbar = ({ 
  sortBy, 
  viewMode, 
  selectionMode, 
  darkMode, 
  hasPhotos,
  onFilterPress, 
  onViewToggle, 
  onSelectionToggle 
}) => {
  const getSortLabel = () => {
    switch (sortBy) {
      case SORT_OPTIONS.NEWEST: return 'Mới nhất';
      case SORT_OPTIONS.OLDEST: return 'Cũ nhất';
      case SORT_OPTIONS.CAPTION: return 'Theo ghi chú';
      default: return 'Mới nhất';
    }
  };

  return (
    <View style={[styles.container, darkMode && styles.containerDark]}>
      <View style={styles.toolbar}>
        <TouchableOpacity style={styles.toolbarBtn} onPress={onFilterPress}>
          <Text style={styles.toolbarIcon}>🔽</Text>
          <Text style={[styles.toolbarText, darkMode && styles.textDark]}>
            {getSortLabel()}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.toolbarBtn} onPress={onViewToggle}>
          <Text style={styles.toolbarIcon}>{viewMode === 'grid' ? '☷' : '≡'}</Text>
        </TouchableOpacity>

        {hasPhotos && (
          <TouchableOpacity style={styles.toolbarBtn} onPress={onSelectionToggle}>
            <Text style={styles.toolbarIcon}>{selectionMode ? '✓' : '◻'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  containerDark: {
    backgroundColor: '#2A2A2A',
    borderBottomColor: '#3A3A3A',
  },
  toolbar: {
    flexDirection: 'row',
    gap: 8,
  },
  toolbarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  toolbarIcon: {
    fontSize: 16,
  },
  toolbarText: {
    fontSize: 13,
    color: '#495057',
    fontWeight: '500',
  },
  textDark: {
    color: '#FFFFFF',
  },
});

export default Toolbar;