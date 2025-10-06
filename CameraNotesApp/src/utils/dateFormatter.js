// src/utils/dateFormatter.js

/**
 * Format date relative to now (e.g., "Hôm nay", "Hôm qua", "2 ngày trước")
 * @param {string|Date} timestamp - Date to format
 * @param {boolean} showDate - Whether to show date
 * @returns {string} Formatted date string
 */
export const formatDate = (timestamp, showDate = true) => {
  if (!showDate) return '';
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const now = new Date();
  
  // Check if date is valid
  if (isNaN(date.getTime())) return '';
  
  const diff = now - date;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor(diff / (1000 * 60));
  
  // Today
  if (days === 0) {
    if (hours === 0) {
      if (minutes === 0) return 'Vừa xong';
      if (minutes === 1) return '1 phút trước';
      return `${minutes} phút trước`;
    }
    if (hours === 1) return '1 giờ trước';
    if (hours < 24) return `${hours} giờ trước`;
    return `Hôm nay, ${date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })}`;
  }
  
  // Yesterday
  if (days === 1) {
    return `Hôm qua, ${date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })}`;
  }
  
  // This week
  if (days < 7) {
    return `${days} ngày trước`;
  }
  
  // This month
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return weeks === 1 ? '1 tuần trước' : `${weeks} tuần trước`;
  }
  
  // This year
  if (days < 365) {
    const months = Math.floor(days / 30);
    return months === 1 ? '1 tháng trước' : `${months} tháng trước`;
  }
  
  // More than a year
  return date.toLocaleDateString('vi-VN', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
};

/**
 * Format date to full Vietnamese format
 * @param {string|Date} timestamp - Date to format
 * @returns {string} Formatted date (e.g., "Thứ Hai, 06/10/2025")
 */
export const formatFullDate = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return '';
  
  const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const dayName = dayNames[date.getDay()];
  
  const dateStr = date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  
  return `${dayName}, ${dateStr}`;
};

/**
 * Format date to short format (e.g., "06/10/2025")
 * @param {string|Date} timestamp - Date to format
 * @returns {string} Formatted date
 */
export const formatShortDate = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return '';
  
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

/**
 * Format time only (e.g., "14:30")
 * @param {string|Date} timestamp - Date to format
 * @returns {string} Formatted time
 */
export const formatTime = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return '';
  
  return date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format date and time (e.g., "06/10/2025 14:30")
 * @param {string|Date} timestamp - Date to format
 * @returns {string} Formatted date and time
 */
export const formatDateTime = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return '';
  
  return `${formatShortDate(timestamp)} ${formatTime(timestamp)}`;
};

/**
 * Get month name in Vietnamese
 * @param {number} month - Month number (0-11)
 * @returns {string} Month name
 */
export const getMonthName = (month) => {
  const months = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
    'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
    'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];
  
  return months[month] || '';
};

/**
 * Format date for grouping (e.g., "Tháng 10, 2025")
 * @param {string|Date} timestamp - Date to format
 * @returns {string} Formatted month and year
 */
export const formatMonthYear = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return '';
  
  return `${getMonthName(date.getMonth())}, ${date.getFullYear()}`;
};

/**
 * Check if date is today
 * @param {string|Date} timestamp - Date to check
 * @returns {boolean} True if today
 */
export const isToday = (timestamp) => {
  if (!timestamp) return false;
  
  const date = new Date(timestamp);
  const today = new Date();
  
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

/**
 * Check if date is yesterday
 * @param {string|Date} timestamp - Date to check
 * @returns {boolean} True if yesterday
 */
export const isYesterday = (timestamp) => {
  if (!timestamp) return false;
  
  const date = new Date(timestamp);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
};

/**
 * Get time ago string
 * @param {string|Date} timestamp - Date to format
 * @returns {string} Time ago string
 */
export const getTimeAgo = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  const intervals = {
    năm: 31536000,
    tháng: 2592000,
    tuần: 604800,
    ngày: 86400,
    giờ: 3600,
    phút: 60,
    giây: 1,
  };
  
  for (const [name, value] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / value);
    if (interval >= 1) {
      return `${interval} ${name} trước`;
    }
  }
  
  return 'Vừa xong';
};