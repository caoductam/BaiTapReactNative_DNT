// src/utils/photoUtils.js
import { Platform } from 'react-native';

/**
 * Generate unique photo ID
 * @returns {string} Unique ID
 */
export const generatePhotoId = () => {
  return `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Get file extension from URI
 * @param {string} uri - Photo URI
 * @returns {string} File extension
 */
export const getFileExtension = (uri) => {
  if (!uri) return 'jpg';
  
  const match = uri.match(/\.(\w+)(\?|$)/);
  return match ? match[1] : 'jpg';
};

/**
 * Generate filename from timestamp
 * @param {string} prefix - Filename prefix
 * @returns {string} Generated filename
 */
export const generateFilename = (prefix = 'photo') => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `${prefix}_${timestamp}.jpg`;
};

/**
 * Calculate photo dimensions while maintaining aspect ratio
 * @param {number} originalWidth - Original width
 * @param {number} originalHeight - Original height
 * @param {number} maxWidth - Maximum width
 * @param {number} maxHeight - Maximum height
 * @returns {object} {width, height}
 */
export const calculateDimensions = (originalWidth, originalHeight, maxWidth, maxHeight) => {
  let width = originalWidth;
  let height = originalHeight;

  if (width > maxWidth) {
    height = (maxWidth / width) * height;
    width = maxWidth;
  }

  if (height > maxHeight) {
    width = (maxHeight / height) * width;
    height = maxHeight;
  }

  return { width: Math.round(width), height: Math.round(height) };
};

/**
 * Estimate file size from quality
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {number} quality - Quality (0-1)
 * @returns {string} Estimated size (e.g., "2.5 MB")
 */
export const estimateFileSize = (width, height, quality) => {
  const pixels = width * height;
  const bytesPerPixel = 3; // RGB
  const compressionRatio = quality * 0.1; // Rough estimate
  const sizeInBytes = pixels * bytesPerPixel * compressionRatio;
  
  if (sizeInBytes < 1024) {
    return `${Math.round(sizeInBytes)} B`;
  } else if (sizeInBytes < 1024 * 1024) {
    return `${(sizeInBytes / 1024).toFixed(1)} KB`;
  } else {
    return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
  }
};

/**
 * Check if URI is valid
 * @param {string} uri - Photo URI
 * @returns {boolean} True if valid
 */
export const isValidPhotoUri = (uri) => {
  if (!uri || typeof uri !== 'string') return false;
  
  // Check for common photo URI patterns
  const patterns = [
    /^file:\/\//,
    /^content:\/\//,
    /^data:image/,
    /^https?:\/\//,
    /^ph:\/\//,
  ];
  
  return patterns.some(pattern => pattern.test(uri));
};

/**
 * Convert data URI to blob (for web)
 * @param {string} dataUri - Data URI
 * @returns {Blob} Blob object
 */
export const dataUriToBlob = (dataUri) => {
  if (Platform.OS !== 'web') return null;
  
  const byteString = atob(dataUri.split(',')[1]);
  const mimeString = dataUri.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  
  return new Blob([ab], { type: mimeString });
};

/**
 * Get MIME type from extension
 * @param {string} extension - File extension
 * @returns {string} MIME type
 */
export const getMimeType = (extension) => {
  const mimeTypes = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    heic: 'image/heic',
  };
  
  return mimeTypes[extension.toLowerCase()] || 'image/jpeg';
};

/**
 * Sort photos by different criteria
 * @param {array} photos - Array of photos
 * @param {string} sortBy - Sort criteria
 * @returns {array} Sorted photos
 */
export const sortPhotos = (photos, sortBy) => {
  const sorted = [...photos];
  
  switch (sortBy) {
    case 'newest':
      return sorted.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      );
    
    case 'oldest':
      return sorted.sort((a, b) => 
        new Date(a.timestamp) - new Date(b.timestamp)
      );
    
    case 'caption':
      return sorted.sort((a, b) => 
        (a.caption || '').localeCompare(b.caption || '')
      );
    
    case 'favorites':
      return sorted.sort((a, b) => {
        if (a.favorite && !b.favorite) return -1;
        if (!a.favorite && b.favorite) return 1;
        return new Date(b.timestamp) - new Date(a.timestamp);
      });
    
    default:
      return sorted;
  }
};

/**
 * Filter photos by search query
 * @param {array} photos - Array of photos
 * @param {string} query - Search query
 * @returns {array} Filtered photos
 */
export const searchPhotos = (photos, query) => {
  if (!query || query.trim() === '') return photos;
  
  const normalizedQuery = query.toLowerCase().trim();
  
  return photos.filter(photo => {
    const caption = (photo.caption || '').toLowerCase();
    const tags = (photo.tags || []).join(' ').toLowerCase();
    
    return caption.includes(normalizedQuery) || tags.includes(normalizedQuery);
  });
};

/**
 * Group photos by date
 * @param {array} photos - Array of photos
 * @returns {object} Photos grouped by date
 */
export const groupPhotosByDate = (photos) => {
  const grouped = {};
  
  photos.forEach(photo => {
    const date = new Date(photo.timestamp);
    const dateKey = date.toLocaleDateString('vi-VN');
    
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    
    grouped[dateKey].push(photo);
  });
  
  return grouped;
};

/**
 * Get photo statistics
 * @param {array} photos - Array of photos
 * @returns {object} Statistics object
 */
export const getPhotoStatistics = (photos) => {
  if (!photos || photos.length === 0) {
    return {
      total: 0,
      withCaptions: 0,
      withoutCaptions: 0,
      favorites: 0,
      totalTags: 0,
      uniqueTags: 0,
    };
  }
  
  const withCaptions = photos.filter(p => p.caption && p.caption.trim() !== '').length;
  const favorites = photos.filter(p => p.favorite).length;
  const allTags = photos.flatMap(p => p.tags || []);
  const uniqueTags = new Set(allTags);
  
  return {
    total: photos.length,
    withCaptions,
    withoutCaptions: photos.length - withCaptions,
    favorites,
    totalTags: allTags.length,
    uniqueTags: uniqueTags.size,
  };
};

/**
 * Validate photo object structure
 * @param {object} photo - Photo object to validate
 * @returns {boolean} True if valid
 */
export const isValidPhoto = (photo) => {
  if (!photo || typeof photo !== 'object') return false;
  
  return (
    photo.id &&
    photo.path &&
    photo.timestamp &&
    typeof photo.id === 'string' &&
    typeof photo.path === 'string' &&
    typeof photo.timestamp === 'string'
  );
};