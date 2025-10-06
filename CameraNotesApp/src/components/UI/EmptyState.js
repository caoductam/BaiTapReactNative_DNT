// src/components/UI/EmptyState.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IS_WEB } from '../../constants/constants';

const EmptyState = ({ hasSearchQuery, darkMode }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{hasSearchQuery ? '🔍' : '📸'}</Text>
      <Text style={[styles.title, darkMode && styles.textDark]}>
        {hasSearchQuery ? 'Không tìm thấy' : 'Chưa có ảnh nào'}
      </Text>
      <Text style={[styles.subtitle, darkMode && styles.textDarkSub]}>
        {hasSearchQuery 
          ? 'Thử tìm kiếm với từ khóa khác' 
          : `Nhấn nút "Chụp ảnh mới" để bắt đầu\n${IS_WEB ? '(Hỗ trợ camera trên trình duyệt)' : ''}`
        }
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  icon: {
    fontSize: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#ADB5BD',
    textAlign: 'center',
    lineHeight: 22,
  },
  textDark: {
    color: '#FFFFFF',
  },
  textDarkSub: {
    color: '#AAAAAA',
  },
});

export default EmptyState;