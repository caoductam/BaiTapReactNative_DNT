// src/utils/tagExtractor.js

/**
 * Extract hashtags from text
 * @param {string} text - Text containing hashtags
 * @returns {array} Array of hashtags (lowercase, without #)
 */
export const extractTags = (text) => {
  if (!text || typeof text !== 'string') return [];
  
  // Match hashtags: #word or #word123 or #word_with_underscore
  const matches = text.match(/#[\w\u00C0-\u024F\u1E00-\u1EFF]+/g);
  
  if (!matches) return [];
  
  // Remove # symbol, convert to lowercase, and remove duplicates
  const tags = matches.map(tag => tag.toLowerCase());
  return [...new Set(tags)]; // Remove duplicates
};

/**
 * Extract mentions from text (@username)
 * @param {string} text - Text containing mentions
 * @returns {array} Array of mentions (without @)
 */
export const extractMentions = (text) => {
  if (!text || typeof text !== 'string') return [];
  
  const matches = text.match(/@[\w]+/g);
  
  if (!matches) return [];
  
  return [...new Set(matches.map(mention => mention.slice(1)))];
};

/**
 * Highlight hashtags in text
 * @param {string} text - Text to highlight
 * @returns {string} Text with highlighted hashtags
 */
export const highlightTags = (text) => {
  if (!text) return '';
  
  return text.replace(/#[\w\u00C0-\u024F\u1E00-\u1EFF]+/g, (match) => {
    return `<span class="hashtag">${match}</span>`;
  });
};

/**
 * Get all unique tags from multiple photos
 * @param {array} photos - Array of photo objects
 * @returns {array} Array of unique tags
 */
export const getAllUniqueTags = (photos) => {
  if (!photos || !Array.isArray(photos)) return [];
  
  const allTags = photos.flatMap(photo => photo.tags || []);
  return [...new Set(allTags)].sort();
};

/**
 * Get tag frequency (how many times each tag appears)
 * @param {array} photos - Array of photo objects
 * @returns {object} Object with tag as key and count as value
 */
export const getTagFrequency = (photos) => {
  if (!photos || !Array.isArray(photos)) return {};
  
  const frequency = {};
  
  photos.forEach(photo => {
    if (photo.tags && Array.isArray(photo.tags)) {
      photo.tags.forEach(tag => {
        frequency[tag] = (frequency[tag] || 0) + 1;
      });
    }
  });
  
  return frequency;
};

/**
 * Get most popular tags
 * @param {array} photos - Array of photo objects
 * @param {number} limit - Number of top tags to return
 * @returns {array} Array of {tag, count} objects
 */
export const getPopularTags = (photos, limit = 10) => {
  const frequency = getTagFrequency(photos);
  
  return Object.entries(frequency)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

/**
 * Filter photos by tag
 * @param {array} photos - Array of photo objects
 * @param {string} tag - Tag to filter by
 * @returns {array} Filtered photos
 */
export const filterPhotosByTag = (photos, tag) => {
  if (!photos || !tag) return [];
  
  const normalizedTag = tag.toLowerCase();
  
  return photos.filter(photo => 
    photo.tags && photo.tags.includes(normalizedTag)
  );
};

/**
 * Validate hashtag format
 * @param {string} tag - Tag to validate
 * @returns {boolean} True if valid
 */
export const isValidTag = (tag) => {
  if (!tag || typeof tag !== 'string') return false;
  
  // Must start with # and contain only letters, numbers, underscores
  return /^#[\w\u00C0-\u024F\u1E00-\u1EFF]+$/.test(tag);
};

/**
 * Suggest tags based on partial input
 * @param {array} photos - Array of photo objects
 * @param {string} input - Partial tag input
 * @returns {array} Array of suggested tags
 */
export const suggestTags = (photos, input) => {
  if (!input || !photos) return [];
  
  const allTags = getAllUniqueTags(photos);
  const normalized = input.toLowerCase().replace('#', '');
  
  return allTags.filter(tag => 
    tag.toLowerCase().includes(normalized)
  ).slice(0, 5);
};