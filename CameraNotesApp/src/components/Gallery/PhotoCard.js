import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { formatDate } from '../../utils/helpers';
import { VIEW_MODES } from '../../constants/constants';

const PhotoCard = ({ 
  photo, 
  viewMode, 
  settings, 
  selectionMode, 
  isSelected,
  onPress,
  onLongPress,
  onFavoriteToggle,
}) => {
  const isGrid = viewMode === VIEW_MODES.GRID;

  return (
    <TouchableOpacity
      style={[
        isGrid ? styles.cardGrid : styles.cardList,
        isSelected && styles.cardSelected
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.9}
    >
      <View style={isGrid ? styles.imageContainer : styles.imageContainerList}>
        <Image 
          source={{ uri: photo.path }} 
          style={isGrid ? styles.imageGrid : styles.imageList} 
        />
        
        {selectionMode && (
          <View style={styles.selectionOverlay}>
            <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
              {isSelected && <Text style={styles.checkmark}>✓</Text>}
            </View>
          </View>
        )}
        
        {!selectionMode && (
          <View style={styles.overlay}>
            <TouchableOpacity
              style={styles.favoriteBtn}
              onPress={(e) => {
                e.stopPropagation();
                onFavoriteToggle();
              }}
            >
              <Text style={styles.favoriteIcon}>{photo.favorite ? '❤️' : '🤍'}</Text>
            </TouchableOpacity>
            
            {settings.showDate && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {formatDate(photo.timestamp, settings.showDate)}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
      
      {!isGrid && (
        <View style={styles.contentList}>
          <Text style={styles.captionList} numberOfLines={2}>
            {photo.caption || 'Không có ghi chú'}
          </Text>
          {photo.tags && photo.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {photo.tags.slice(0, 3).map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardGrid: {
    flex: 1,
    margin: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardList: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  cardSelected: {
    borderWidth: 3,
    borderColor: '#007AFF',
  },
  imageContainer: {
    position: 'relative',
  },
  imageContainerList: {
    position: 'relative',
    width: 120,
  },
  imageGrid: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#E9ECEF',
  },
  imageList: {
    width: 120,
    height: 120,
    backgroundColor: '#E9ECEF',
  },
  overlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    left: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  favoriteBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteIcon: {
    fontSize: 16,
  },
  badge: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  selectionOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 122, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  contentList: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  captionList: {
    fontSize: 15,
    color: '#212529',
    fontWeight: '500',
    marginBottom: 6,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  tagText: {
    color: '#1976D2',
    fontSize: 11,
    fontWeight: '600',
  },
});

export default PhotoCard;