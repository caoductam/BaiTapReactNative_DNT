import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEY, SETTINGS_KEY, DEFAULT_SETTINGS } from '../constants/constants';
import { extractTags, showAlert } from '../utils/helpers';

export const usePhotos = () => {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    setIsLoading(true);
    try {
      const savedPhotos = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedPhotos) {
        setPhotos(JSON.parse(savedPhotos));
      }
    } catch (error) {
      console.error('Lỗi khi load photos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const savePhotos = async (newPhotos) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newPhotos));
      setPhotos(newPhotos);
    } catch (error) {
      console.error('Lỗi khi lưu photos:', error);
      showAlert('Lỗi', 'Không thể lưu ảnh');
    }
  };

  const addPhoto = async (photoUri, caption) => {
    const newPhoto = {
      id: Date.now().toString(),
      path: photoUri,
      caption: caption,
      timestamp: new Date().toISOString(),
      tags: extractTags(caption),
      favorite: false,
    };

    const updatedPhotos = [newPhoto, ...photos];
    await savePhotos(updatedPhotos);
    return newPhoto;
  };

  const updatePhoto = async (photoId, updates) => {
    const updatedPhotos = photos.map(photo =>
      photo.id === photoId
        ? { ...photo, ...updates, tags: updates.caption ? extractTags(updates.caption) : photo.tags }
        : photo
    );
    await savePhotos(updatedPhotos);
  };

  const deletePhoto = async (photoId) => {
    const updatedPhotos = photos.filter(photo => photo.id !== photoId);
    await savePhotos(updatedPhotos);
  };

  const deleteMultiplePhotos = async (photoIds) => {
    const updatedPhotos = photos.filter(photo => !photoIds.includes(photo.id));
    await savePhotos(updatedPhotos);
  };

  const toggleFavorite = async (photoId) => {
    const updatedPhotos = photos.map(photo =>
      photo.id === photoId ? { ...photo, favorite: !photo.favorite } : photo
    );
    await savePhotos(updatedPhotos);
  };

  const clearAllPhotos = async () => {
    await savePhotos([]);
  };

  const importPhotos = async (importedPhotos) => {
    const updatedPhotos = [...importedPhotos, ...photos];
    await savePhotos(updatedPhotos);
  };

  return {
    photos,
    isLoading,
    addPhoto,
    updatePhoto,
    deletePhoto,
    deleteMultiplePhotos,
    toggleFavorite,
    clearAllPhotos,
    importPhotos,
    savePhotos,
  };
};

export const useSettings = () => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem(SETTINGS_KEY);
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Lỗi khi load settings:', error);
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      const updated = { ...settings, ...newSettings };
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
      setSettings(updated);
    } catch (error) {
      console.error('Lỗi khi lưu settings:', error);
    }
  };

  return { settings, updateSettings };
};