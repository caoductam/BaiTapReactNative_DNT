// src/components/Camera/CameraScreen.js
import React, { useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { CameraView } from 'expo-camera';
import { IS_WEB } from '../../constants/constants';

const CameraScreen = ({ 
  facing, 
  flashMode, 
  quality, 
  onClose, 
  onCapture, 
  onFlipCamera, 
  onFlashToggle 
}) => {
  const cameraRef = useRef(null);

  const handleCapture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: quality,
          flash: flashMode,
        });
        onCapture(photo.uri);
      } catch (error) {
        console.error('Lỗi khi chụp ảnh:', error);
      }
    }
  };

  const getFlashIcon = () => {
    if (flashMode === 'off') return '⚡';
    if (flashMode === 'on') return '💡';
    return '🔆';
  };

  return (
    <View style={styles.container}>
      {!IS_WEB && <StatusBar barStyle="light-content" />}
      <CameraView 
        style={styles.camera} 
        facing={facing} 
        ref={cameraRef}
        flash={flashMode}
      >
        <SafeAreaView style={styles.cameraContainer}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.iconBtn} onPress={onClose}>
              <Text style={styles.iconText}>✕</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={onFlashToggle}>
              <Text style={styles.iconText}>{getFlashIcon()}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={onFlipCamera}>
              <Text style={styles.iconText}>🔄</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.captureBtn} onPress={handleCapture}>
              <View style={styles.captureBtnInner} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  iconBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  captureBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureBtnInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#007AFF',
  },
});

export default CameraScreen;