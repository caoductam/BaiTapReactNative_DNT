// src/components/Gallery/GalleryList.js
import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import PhotoCard from './PhotoCard';

const GalleryList = ({ 
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
      viewMode="list"
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

export default GalleryList;