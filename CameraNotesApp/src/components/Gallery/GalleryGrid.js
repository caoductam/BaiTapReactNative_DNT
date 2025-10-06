// src/components/Gallery/GalleryGrid.js
import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import PhotoCard from './PhotoCard';

const GalleryGrid = ({ 
  photos, 
  settings,
  selectionMode,
  selectedPhotos,
  onPhotoPress,
  onPhotoLongPress,
  onFavoriteToggle,
}) => {
  const renderItem = ({ item }) => (
    <PhotoCard
      photo={item}
      viewMode="grid"
      settings={settings}
      selectionMode={selectionMode}
      isSelected={selectedPhotos.includes(item.id)}
      onPress={() => onPhotoPress(item)}
      onLongPress={() => onPhotoLongPress(item.id)}
      onFavoriteToggle={() => onFavoriteToggle(item.id)}
    />
  );

  return (
    <FlatList
      data={photos}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      numColumns={settings.gridColumns}
      key={settings.gridColumns} // Force re-render when columns change
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 24,
  },
});

export default GalleryGrid;