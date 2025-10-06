// src/hooks/useSettings.js
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SETTINGS_KEY, DEFAULT_SETTINGS } from '../constants/constants';

export const useSettings = () => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const savedSettings = await AsyncStorage.getItem(SETTINGS_KEY);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      }
    } catch (error) {
      console.error('Lỗi khi load settings:', error);
    } finally {
      setIsLoading(false);
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

  const resetSettings = async () => {
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
      setSettings(DEFAULT_SETTINGS);
    } catch (error) {
      console.error('Lỗi khi reset settings:', error);
    }
  };

  const toggleDarkMode = async () => {
    await updateSettings({ darkMode: !settings.darkMode });
  };

  const toggleShowDate = async () => {
    await updateSettings({ showDate: !settings.showDate });
  };

  const toggleAutoSave = async () => {
    await updateSettings({ autoSave: !settings.autoSave });
  };

  const setGridColumns = async (columns) => {
    const validColumns = Math.max(1, Math.min(4, columns));
    await updateSettings({ gridColumns: validColumns });
  };

  return {
    settings,
    isLoading,
    updateSettings,
    resetSettings,
    toggleDarkMode,
    toggleShowDate,
    toggleAutoSave,
    setGridColumns,
  };
};