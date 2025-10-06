// src/components/UI/SearchBar.js
import React from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';

const SearchBar = ({ value, onChange, darkMode }) => {
  return (
    <View style={[styles.container, darkMode && styles.containerDark]}>
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={[styles.searchInput, darkMode && styles.searchInputDark]}
          placeholder="Tìm kiếm theo ghi chú..."
          placeholderTextColor={darkMode ? "#999" : "#666"}
          value={value}
          onChangeText={onChange}
        />
        {value !== '' && (
          <TouchableOpacity onPress={() => onChange('')}>
            <Text style={styles.searchClear}>✕</Text>
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
    color: '#212529',
  },
  searchInputDark: {
    color: '#FFFFFF',
  },
  searchClear: {
    fontSize: 18,
    color: '#999',
    padding: 4,
  },
});

export default SearchBar;