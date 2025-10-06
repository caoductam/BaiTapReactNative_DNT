// src/components/UI/SelectionBar.js
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const SelectionBar = ({ selectedCount, totalCount, onSelectAll, onDelete }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.btn} onPress={onSelectAll}>
        <Text style={styles.text}>
          {selectedCount === totalCount ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
        </Text>
      </TouchableOpacity>
      
      <Text style={styles.count}>{selectedCount} đã chọn</Text>
      
      {selectedCount > 0 && (
        <TouchableOpacity style={styles.btn} onPress={onDelete}>
          <Text style={styles.textDanger}>Xóa</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  btn: {
    padding: 4,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  textDanger: {
    color: '#FFE5E5',
    fontWeight: '600',
    fontSize: 14,
  },
  count: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default SelectionBar;