import { Alert } from 'react-native';
import { IS_WEB } from '../constants/constants';

// Date Formatter
export const formatDate = (timestamp, showDate) => {
  if (!showDate) return '';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) {
    return `Hôm nay, ${date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
  } else if (days === 1) {
    return 'Hôm qua';
  } else if (days < 7) {
    return `${days} ngày trước`;
  } else {
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
};

// Tag Extractor
export const extractTags = (text) => {
  if (!text) return [];
  const matches = text.match(/#\w+/g);
  return matches ? matches.map(tag => tag.toLowerCase()) : [];
};

// Alert Helper
export const showAlert = (title, message) => {
  if (IS_WEB) {
    alert(`${title}: ${message}`);
  } else {
    Alert.alert(title, message);
  }
};

// Photo Download
export const downloadPhoto = (photoPath) => {
  if (IS_WEB) {
    const link = document.createElement('a');
    link.href = photoPath;
    link.download = `photo_${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showAlert('✓ Thành công', 'Đã tải ảnh về máy!');
  }
};

// Photo Share
export const sharePhoto = async (photoPath) => {
  if (IS_WEB) {
    try {
      if (navigator.share) {
        const response = await fetch(photoPath);
        const blob = await response.blob();
        const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
        
        await navigator.share({
          files: [file],
          title: 'Chia sẻ ảnh',
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        showAlert('✓ Đã copy', 'Đã copy link!');
      }
    } catch (err) {
      downloadPhoto(photoPath);
    }
  }
};

// Export Photos
export const exportAllPhotos = async (photos) => {
  if (IS_WEB) {
    const data = JSON.stringify(photos, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `camera_notes_backup_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showAlert('✓ Thành công', 'Đã xuất dữ liệu!');
  }
};

// Import Photos
export const importPhotos = async (onImport) => {
  if (IS_WEB) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const imported = JSON.parse(event.target.result);
            onImport(imported);
            showAlert('✓ Thành công', `Đã nhập ${imported.length} ảnh!`);
          } catch (error) {
            showAlert('Lỗi', 'File không hợp lệ');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }
};

// Get Statistics
export const getStats = (photos) => {
  const totalPhotos = photos.length;
  const withCaptions = photos.filter(p => p.caption).length;
  const favorites = photos.filter(p => p.favorite).length;
  const allTags = photos.flatMap(p => p.tags || []);
  const uniqueTags = [...new Set(allTags)];
  const oldestPhoto = photos.length > 0 ? new Date(Math.min(...photos.map(p => new Date(p.timestamp)))) : null;
  const newestPhoto = photos.length > 0 ? new Date(Math.max(...photos.map(p => new Date(p.timestamp)))) : null;

  return {
    totalPhotos,
    withCaptions,
    favorites,
    uniqueTags: uniqueTags.length,
    avgCaptionLength: withCaptions > 0 ? Math.round(photos.reduce((sum, p) => sum + (p.caption?.length || 0), 0) / withCaptions) : 0,
    oldestPhoto,
    newestPhoto,
  };
};

// Filter and Sort Photos
export const filterAndSortPhotos = (photos, searchQuery, sortBy) => {
  let filtered = [...photos];

  // Filter by search
  if (searchQuery) {
    filtered = filtered.filter(photo => 
      photo.caption?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Sort
  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.timestamp) - new Date(a.timestamp);
      case 'oldest':
        return new Date(a.timestamp) - new Date(b.timestamp);
      case 'caption':
        return (a.caption || '').localeCompare(b.caption || '');
      default:
        return 0;
    }
  });

  return filtered;
};