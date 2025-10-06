import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { IS_WEB } from '../../constants/constants';

const Header = ({ 
  photoCount, 
  searchQuery, 
  darkMode, 
  onStatsPress, 
  onSettingsPress 
}) => {
  return (
    <View style={[styles.header, darkMode && styles.headerDark]}>
      <View style={styles.headerTop}>
        <View>
          <Text style={[styles.headerTitle, darkMode && styles.textDark]}>
            Camera Notes
          </Text>
          <Text style={[styles.headerSubtitle, darkMode && styles.textDarkSub]}>
            {photoCount} ảnh {searchQuery && '(đã lọc)'} {IS_WEB && '• Web'}
          </Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.headerIconBtn} onPress={onStatsPress}>
            <Text style={styles.headerIconText}>📊</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconBtn} onPress={onSettingsPress}>
            <Text style={styles.headerIconText}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  headerDark: {
    backgroundColor: '#2A2A2A',
    borderBottomColor: '#3A3A3A',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#212529',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6C757D',
    marginTop: 4,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  headerIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIconText: {
    fontSize: 20,
  },
  textDark: {
    color: '#FFFFFF',
  },
  textDarkSub: {
    color: '#AAAAAA',
  },
});

export default Header;