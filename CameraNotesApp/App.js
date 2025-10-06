import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  FlatList,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useCameraPermissions } from 'expo-camera';

// Hooks
import { usePhotos, useSettings } from './src/hooks/usePhotos';

// Utils
import { 
  showAlert, 
  filterAndSortPhotos, 
  exportAllPhotos, 
  importPhotos 
} from './src/utils/helpers';

// Constants
import { IS_WEB, VIEW_MODES, SORT_OPTIONS } from './src/constants/constants';

// Components
import Header from './src/components/UI/Header';
import SearchBar from './src/components/UI/SearchBar';
import Toolbar from './src/components/UI/Toolbar';
import SelectionBar from './src/components/UI/SelectionBar';
import EmptyState from './src/components/UI/EmptyState';
import PhotoCard from './src/components/Gallery/PhotoCard';
import CameraScreen from './src/components/Camera/CameraScreen';
import PhotoPreview from './src/components/Preview/PhotoPreview';
import EditModal from './src/components/Modals/EditModal';
import SettingsModal from './src/components/Modals/SettingsModal';
import StatsModal from './src/components/Modals/StatsModal';
import FilterModal from './src/components/Modals/FilterModal';

export default function App() {
  // Hooks
  const { 
    photos, 
    isLoading, 
    addPhoto, 
    updatePhoto, 
    deletePhoto, 
    deleteMultiplePhotos,
    toggleFavorite,
    clearAllPhotos,
    importPhotos: handleImportPhotos,
  } = usePhotos();

  const { settings, updateSettings } = useSettings();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  // States
  const [showCamera, setShowCamera] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [caption, setCaption] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.NEWEST);
  const [viewMode, setViewMode] = useState(VIEW_MODES.GRID);
  const [flashMode, setFlashMode] = useState('off');
  const [quality, setQuality] = useState(0.8);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [facing, setFacing] = useState(IS_WEB ? 'user' : 'back');

  // Modal States
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Filtered Photos
  const [filteredPhotos, setFilteredPhotos] = useState([]);

  useEffect(() => {
    const filtered = filterAndSortPhotos(photos, searchQuery, sortBy);
    setFilteredPhotos(filtered);
  }, [photos, searchQuery, sortBy]);

  // Camera Handlers
  const handleCameraOpen = async () => {
    const { status } = await requestCameraPermission();
    if (status === 'granted') {
      setShowCamera(true);
    } else {
      showAlert('Quyền bị từ chối', 'Cần quyền camera để chụp ảnh');
    }
  };

  const handlePhotoCapture = (photoUri) => {
    setCapturedPhoto(photoUri);
    setShowCamera(false);
  };

  const handlePhotoSave = async () => {
    if (!capturedPhoto) return;
    
    try {
      await addPhoto(capturedPhoto, caption);
      setCapturedPhoto(null);
      setCaption('');
      showAlert('✓ Thành công', 'Đã lưu ảnh với ghi chú!');
    } catch (error) {
      showAlert('Lỗi', 'Không thể lưu ảnh');
    }
  };

  const handlePhotoCancel = () => {
    setCapturedPhoto(null);
    setCaption('');
  };

  // Edit Handlers
  const handleEditOpen = (photo) => {
    setEditingPhoto(photo);
    setCaption(photo.caption);
    setShowEditModal(true);
  };

  const handleEditSave = async () => {
    if (!editingPhoto) return;
    
    try {
      await updatePhoto(editingPhoto.id, { caption });
      setShowEditModal(false);
      setEditingPhoto(null);
      setCaption('');
      showAlert('✓ Thành công', 'Đã cập nhật ghi chú!');
    } catch (error) {
      showAlert('Lỗi', 'Không thể cập nhật');
    }
  };

  const handleEditClose = () => {
    setShowEditModal(false);
    setEditingPhoto(null);
    setCaption('');
  };

  // Delete Handlers
  const handlePhotoDelete = (photoId) => {
    if (IS_WEB) {
      if (window.confirm('Bạn có chắc muốn xóa ảnh này không?')) {
        deletePhoto(photoId);
        showAlert('✓ Thành công', 'Đã xóa ảnh!');
      }
    } else {
      Alert.alert('Xác nhận xóa', 'Bạn có chắc muốn xóa ảnh này không?', [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Xóa', 
          style: 'destructive', 
          onPress: () => {
            deletePhoto(photoId);
            showAlert('✓ Thành công', 'Đã xóa ảnh!');
          }
        },
      ]);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedPhotos.length === 0) return;

    if (IS_WEB) {
      if (window.confirm(`Xóa ${selectedPhotos.length} ảnh đã chọn?`)) {
        deleteMultiplePhotos(selectedPhotos);
        setSelectedPhotos([]);
        setSelectionMode(false);
        showAlert('✓ Thành công', `Đã xóa ${selectedPhotos.length} ảnh!`);
      }
    } else {
      Alert.alert('Xác nhận xóa', `Xóa ${selectedPhotos.length} ảnh đã chọn?`, [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Xóa', 
          style: 'destructive', 
          onPress: () => {
            deleteMultiplePhotos(selectedPhotos);
            setSelectedPhotos([]);
            setSelectionMode(false);
            showAlert('✓ Thành công', `Đã xóa ${selectedPhotos.length} ảnh!`);
          }
        },
      ]);
    }
  };

  // Selection Handlers
  const handlePhotoSelect = (photoId) => {
    setSelectedPhotos(prev =>
      prev.includes(photoId)
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPhotos.length === filteredPhotos.length) {
      setSelectedPhotos([]);
    } else {
      setSelectedPhotos(filteredPhotos.map(p => p.id));
    }
  };

  const handlePhotoLongPress = (photoId) => {
    setSelectionMode(true);
    handlePhotoSelect(photoId);
  };

  // Settings Handlers
  const handleExport = () => {
    exportAllPhotos(photos);
  };

  const handleImport = () => {
    importPhotos((imported) => {
      handleImportPhotos(imported);
    });
  };

  const handleClearAll = () => {
    if (IS_WEB) {
      if (window.confirm('Xóa tất cả dữ liệu?')) {
        clearAllPhotos();
        setShowSettingsModal(false);
      }
    } else {
      Alert.alert('Xóa tất cả', 'Bạn có chắc chắn?', [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Xóa', 
          style: 'destructive', 
          onPress: () => {
            clearAllPhotos();
            setShowSettingsModal(false);
          }
        },
      ]);
    }
  };

  // Render Photo Item
  const renderPhotoItem = ({ item }) => (
    <PhotoCard
      photo={item}
      viewMode={viewMode}
      settings={settings}
      selectionMode={selectionMode}
      isSelected={selectedPhotos.includes(item.id)}
      onPress={() => selectionMode ? handlePhotoSelect(item.id) : handleEditOpen(item)}
      onLongPress={() => handlePhotoLongPress(item.id)}
      onFavoriteToggle={() => toggleFavorite(item.id)}
    />
  );

  // Camera Screen
  if (showCamera) {
    return (
      <CameraScreen
        facing={facing}
        flashMode={flashMode}
        quality={quality}
        onClose={() => setShowCamera(false)}
        onCapture={handlePhotoCapture}
        onFlipCamera={() => setFacing(f => IS_WEB ? (f === 'user' ? 'environment' : 'user') : (f === 'back' ? 'front' : 'back'))}
        onFlashToggle={() => setFlashMode(f => f === 'off' ? 'on' : f === 'on' ? 'auto' : 'off')}
      />
    );
  }

  // Preview Screen
  if (capturedPhoto) {
    return (
      <PhotoPreview
        photoUri={capturedPhoto}
        caption={caption}
        onCaptionChange={setCaption}
        onSave={handlePhotoSave}
        onCancel={handlePhotoCancel}
      />
    );
  }

  // Main Gallery Screen
  return (
    <SafeAreaView style={[styles.container, settings.darkMode && styles.containerDark]}>
      {!IS_WEB && <StatusBar barStyle={settings.darkMode ? "light-content" : "dark-content"} />}
      
      <Header
        photoCount={filteredPhotos.length}
        searchQuery={searchQuery}
        darkMode={settings.darkMode}
        onStatsPress={() => setShowStatsModal(true)}
        onSettingsPress={() => setShowSettingsModal(true)}
      />

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        darkMode={settings.darkMode}
      />

      <Toolbar
        sortBy={sortBy}
        viewMode={viewMode}
        selectionMode={selectionMode}
        darkMode={settings.darkMode}
        hasPhotos={photos.length > 0}
        onFilterPress={() => setShowFilterModal(true)}
        onViewToggle={() => setViewMode(v => v === VIEW_MODES.GRID ? VIEW_MODES.LIST : VIEW_MODES.GRID)}
        onSelectionToggle={() => {
          if (selectionMode) {
            setSelectionMode(false);
            setSelectedPhotos([]);
          } else {
            setSelectionMode(true);
          }
        }}
      />

      {selectionMode && (
        <SelectionBar
          selectedCount={selectedPhotos.length}
          totalCount={filteredPhotos.length}
          onSelectAll={handleSelectAll}
          onDelete={handleDeleteSelected}
        />
      )}

      <TouchableOpacity style={styles.fabButton} onPress={handleCameraOpen}>
        <Text style={styles.fabIcon}>📷</Text>
        <Text style={styles.fabText}>Chụp ảnh mới</Text>
      </TouchableOpacity>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      ) : filteredPhotos.length === 0 ? (
        <EmptyState
          hasSearchQuery={!!searchQuery}
          darkMode={settings.darkMode}
        />
      ) : (
        <FlatList
          data={filteredPhotos}
          renderItem={renderPhotoItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.gallery}
          numColumns={viewMode === VIEW_MODES.GRID ? settings.gridColumns : 1}
          key={viewMode + settings.gridColumns}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Modals */}
      <EditModal
        visible={showEditModal}
        photo={editingPhoto}
        caption={caption}
        darkMode={settings.darkMode}
        onCaptionChange={setCaption}
        onSave={handleEditSave}
        onClose={handleEditClose}
        onDelete={() => {
          handleEditClose();
          handlePhotoDelete(editingPhoto.id);
        }}
      />

      <SettingsModal
        visible={showSettingsModal}
        settings={settings}
        quality={quality}
        darkMode={settings.darkMode}
        onClose={() => setShowSettingsModal(false)}
        onSettingsChange={updateSettings}
        onQualityChange={setQuality}
        onExport={handleExport}
        onImport={handleImport}
        onClearAll={handleClearAll}
      />

      <StatsModal
        visible={showStatsModal}
        photos={photos}
        darkMode={settings.darkMode}
        onClose={() => setShowStatsModal(false)}
      />

      <FilterModal
        visible={showFilterModal}
        sortBy={sortBy}
        darkMode={settings.darkMode}
        onClose={() => setShowFilterModal(false)}
        onSortChange={(sort) => {
          setSortBy(sort);
          setShowFilterModal(false);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  containerDark: {
    backgroundColor: '#1A1A1A',
  },
  fabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    margin: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  fabIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  gallery: {
    padding: 16,
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
});