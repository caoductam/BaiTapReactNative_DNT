import { Dimensions, Platform } from 'react-native';

export const STORAGE_KEY = '@camera_notes_photos';
export const SETTINGS_KEY = '@camera_notes_settings';

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const IS_WEB = Platform.OS === 'web';

export const DEFAULT_SETTINGS = {
  autoSave: true,
  showDate: true,
  darkMode: false,
  gridColumns: 2,
  enableHaptic: true,
};

export const SORT_OPTIONS = {
  NEWEST: 'newest',
  OLDEST: 'oldest',
  CAPTION: 'caption',
};

export const VIEW_MODES = {
  GRID: 'grid',
  LIST: 'list',
};

export const FLASH_MODES = {
  OFF: 'off',
  ON: 'on',
  AUTO: 'auto',
};

export const QUALITY_OPTIONS = {
  LOW: 0.5,
  MEDIUM: 0.8,
  HIGH: 1.0,
};