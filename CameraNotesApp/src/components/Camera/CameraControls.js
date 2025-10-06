// src/components/Camera/CameraControls.js
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const CameraControls = ({ 
  facing, 
  flashMode, 
  onClose, 
  onFlipCamera, 
  onFlashToggle,
  onCapture 
}) => {
  const getFlashIcon = () => {
    if (flashMode === 'off') return '⚡';
    if (flashMode === 'on') return '💡';
    return '🔆';
  };

  const getFlashLabel = () => {
    if (flashMode === 'off') return 'Off';
    if (flashMode === 'on') return 'On';
    return 'Auto';
  };

  return (
    <>
      {/* Top Controls */}
      <View style={styles.topControls}>
        <TouchableOpacity style={styles.controlBtn} onPress={onClose}>
          <Text style={styles.controlIcon}>✕</Text>
          <Text style={styles.controlLabel}>Đóng</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlBtn} onPress={onFlashToggle}>
          <Text style={styles.controlIcon}>{getFlashIcon()}</Text>
          <Text style={styles.controlLabel}>{getFlashLabel()}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlBtn} onPress={onFlipCamera}>
          <Text style={styles.controlIcon}>🔄</Text>
          <Text style={styles.controlLabel}>Lật</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        <View style={styles.captureWrapper}>
          <TouchableOpacity style={styles.captureBtn} onPress={onCapture}>
            <View style={styles.captureBtnInner} />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  controlBtn: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 70,
  },
  controlIcon: {
    color: '#FFFFFF',
    fontSize: 24,
    marginBottom: 2,
  },
  controlLabel: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  captureWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  captureBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  captureBtnInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#007AFF',
  },
});

export default CameraControls;