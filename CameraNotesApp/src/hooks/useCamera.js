// src/hooks/useCamera.js
import { useState } from 'react';
import { useCameraPermissions } from 'expo-camera';
import { showAlert } from '../utils/helpers';
import { IS_WEB, FLASH_MODES } from '../constants/constants';

export const useCamera = () => {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [facing, setFacing] = useState(IS_WEB ? 'user' : 'back');
  const [flashMode, setFlashMode] = useState(FLASH_MODES.OFF);
  const [quality, setQuality] = useState(0.8);

  const requestPermission = async () => {
    const { status } = await requestCameraPermission();
    if (status === 'granted') {
      return true;
    } else {
      showAlert('Quyền bị từ chối', 'Cần quyền camera để chụp ảnh');
      return false;
    }
  };

  const toggleFacing = () => {
    setFacing(current => {
      if (IS_WEB) {
        return current === 'user' ? 'environment' : 'user';
      } else {
        return current === 'back' ? 'front' : 'back';
      }
    });
  };

  const toggleFlash = () => {
    setFlashMode(current => {
      if (current === FLASH_MODES.OFF) return FLASH_MODES.ON;
      if (current === FLASH_MODES.ON) return FLASH_MODES.AUTO;
      return FLASH_MODES.OFF;
    });
  };

  const cycleFlash = () => {
    setFlashMode(current => {
      switch (current) {
        case FLASH_MODES.OFF:
          return FLASH_MODES.ON;
        case FLASH_MODES.ON:
          return FLASH_MODES.AUTO;
        default:
          return FLASH_MODES.OFF;
      }
    });
  };

  return {
    cameraPermission,
    facing,
    flashMode,
    quality,
    requestPermission,
    toggleFacing,
    toggleFlash,
    cycleFlash,
    setQuality,
  };
};