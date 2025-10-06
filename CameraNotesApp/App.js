import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  Modal,
  Alert,
  Dimensions,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Platform,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@camera_notes_photos';
const SETTINGS_KEY = '@camera_notes_settings';
const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

export default function App() {
  const [facing, setFacing] = useState(isWeb ? 'user' : 'back');
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [photos, setPhotos] = useState([]);
  const [filteredPhotos, setFilteredPhotos] = useState([]);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [caption, setCaption] = useState('');
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, caption
  const [viewMode, setViewMode] = useState('grid'); // grid, list
  const [flashMode, setFlashMode] = useState('off'); // off, on, auto
  const [quality, setQuality] = useState(0.8);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const cameraRef = useRef(null);

  // Settings
  const [settings, setSettings] = useState({
    autoSave: true,
    showDate: true,
    darkMode: false,
    gridColumns: 2,
    enableHaptic: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterAndSortPhotos();
  }, [photos, searchQuery, sortBy]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [savedPhotos, savedSettings] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY),
        AsyncStorage.getItem(SETTINGS_KEY),
      ]);
      
      if (savedPhotos) setPhotos(JSON.parse(savedPhotos));
      if (savedSettings) setSettings(JSON.parse(savedSettings));
    } catch (error) {
      console.error('Lỗi khi load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const savePhotos = async (newPhotos) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newPhotos));
      setPhotos(newPhotos);
    } catch (error) {
      console.error('Lỗi khi lưu photos:', error);
      showAlert('Lỗi', 'Không thể lưu ảnh');
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Lỗi khi lưu settings:', error);
    }
  };

  const filterAndSortPhotos = () => {
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

    setFilteredPhotos(filtered);
  };

  const showAlert = (title, message) => {
    if (isWeb) {
      alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const requestCameraPermissionHandler = async () => {
    const { status } = await requestCameraPermission();
    if (status === 'granted') {
      setShowCamera(true);
    } else {
      showAlert('Quyền bị từ chối', 'Cần quyền camera để chụp ảnh');
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: quality,
          flash: flashMode,
        });
        setCapturedPhoto(photo.uri);
        setShowCamera(false);
      } catch (error) {
        console.error('Lỗi khi chụp ảnh:', error);
        showAlert('Lỗi', 'Không thể chụp ảnh');
      }
    }
  };

  const savePhotoWithCaption = async () => {
    if (!capturedPhoto) return;

    try {
      const newPhoto = {
        id: Date.now().toString(),
        path: capturedPhoto,
        caption: caption,
        timestamp: new Date().toISOString(),
        tags: extractTags(caption),
        favorite: false,
      };

      const updatedPhotos = [newPhoto, ...photos];
      await savePhotos(updatedPhotos);

      setCapturedPhoto(null);
      setCaption('');
      showAlert('✓ Thành công', 'Đã lưu ảnh với ghi chú!');
    } catch (error) {
      console.error('Lỗi khi lưu ảnh:', error);
      showAlert('Lỗi', 'Không thể lưu ảnh');
    }
  };

  const extractTags = (text) => {
    if (!text) return [];
    const matches = text.match(/#\w+/g);
    return matches ? matches.map(tag => tag.toLowerCase()) : [];
  };

  const cancelPhoto = () => {
    setCapturedPhoto(null);
    setCaption('');
  };

  const openEditModal = (photo) => {
    setEditingPhoto(photo);
    setCaption(photo.caption);
    setShowEditModal(true);
  };

  const updateCaption = async () => {
    if (!editingPhoto) return;

    try {
      const updatedPhotos = photos.map((photo) =>
        photo.id === editingPhoto.id
          ? { ...photo, caption: caption, tags: extractTags(caption) }
          : photo
      );
      await savePhotos(updatedPhotos);
      setShowEditModal(false);
      setEditingPhoto(null);
      setCaption('');
      showAlert('✓ Thành công', 'Đã cập nhật ghi chú!');
    } catch (error) {
      console.error('Lỗi khi cập nhật:', error);
      showAlert('Lỗi', 'Không thể cập nhật ghi chú');
    }
  };

  const toggleFavorite = async (photoId) => {
    const updatedPhotos = photos.map(photo =>
      photo.id === photoId ? { ...photo, favorite: !photo.favorite } : photo
    );
    await savePhotos(updatedPhotos);
  };

  const deletePhoto = async (photoId) => {
    const confirmDelete = () => {
      const updatedPhotos = photos.filter((photo) => photo.id !== photoId);
      savePhotos(updatedPhotos);
      showAlert('✓ Thành công', 'Đã xóa ảnh!');
    };

    if (isWeb) {
      if (window.confirm('Bạn có chắc muốn xóa ảnh này không?')) {
        confirmDelete();
      }
    } else {
      Alert.alert(
        'Xác nhận xóa',
        'Bạn có chắc muốn xóa ảnh này không?',
        [
          { text: 'Hủy', style: 'cancel' },
          { text: 'Xóa', style: 'destructive', onPress: confirmDelete },
        ]
      );
    }
  };

  const deleteSelectedPhotos = async () => {
    if (selectedPhotos.length === 0) return;

    const confirmDelete = () => {
      const updatedPhotos = photos.filter(
        photo => !selectedPhotos.includes(photo.id)
      );
      savePhotos(updatedPhotos);
      setSelectedPhotos([]);
      setSelectionMode(false);
      showAlert('✓ Thành công', `Đã xóa ${selectedPhotos.length} ảnh!`);
    };

    if (isWeb) {
      if (window.confirm(`Xóa ${selectedPhotos.length} ảnh đã chọn?`)) {
        confirmDelete();
      }
    } else {
      Alert.alert(
        'Xác nhận xóa',
        `Xóa ${selectedPhotos.length} ảnh đã chọn?`,
        [
          { text: 'Hủy', style: 'cancel' },
          { text: 'Xóa', style: 'destructive', onPress: confirmDelete },
        ]
      );
    }
  };

  const togglePhotoSelection = (photoId) => {
    setSelectedPhotos(prev =>
      prev.includes(photoId)
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    );
  };

  const selectAllPhotos = () => {
    if (selectedPhotos.length === filteredPhotos.length) {
      setSelectedPhotos([]);
    } else {
      setSelectedPhotos(filteredPhotos.map(p => p.id));
    }
  };

  const downloadPhoto = (photoPath) => {
    if (isWeb) {
      const link = document.createElement('a');
      link.href = photoPath;
      link.download = `photo_${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showAlert('✓ Thành công', 'Đã tải ảnh về máy!');
    }
  };

  const exportAllPhotos = async () => {
    if (isWeb) {
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

  const importPhotos = async () => {
    if (isWeb) {
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
              await savePhotos([...imported, ...photos]);
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

  const sharePhoto = async (photoPath) => {
    if (isWeb) {
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

  const toggleCameraFacing = () => {
    setFacing(current => {
      if (isWeb) {
        return current === 'user' ? 'environment' : 'user';
      } else {
        return current === 'back' ? 'front' : 'back';
      }
    });
  };

  const formatDate = (timestamp) => {
    if (!settings.showDate) return '';
    
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

  const getStats = () => {
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

  const renderPhotoItem = ({ item }) => {
    const isSelected = selectedPhotos.includes(item.id);

    return (
      <TouchableOpacity
        style={[
          viewMode === 'grid' ? styles.photoCardGrid : styles.photoCardList,
          isSelected && styles.photoCardSelected
        ]}
        onPress={() => selectionMode ? togglePhotoSelection(item.id) : openEditModal(item)}
        onLongPress={() => {
          setSelectionMode(true);
          togglePhotoSelection(item.id);
        }}
        activeOpacity={0.9}
      >
        <View style={viewMode === 'grid' ? styles.photoImageContainer : styles.photoImageContainerList}>
          <Image 
            source={{ uri: item.path }} 
            style={viewMode === 'grid' ? styles.photoImageGrid : styles.photoImageList} 
          />
          {selectionMode && (
            <View style={styles.selectionOverlay}>
              <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                {isSelected && <Text style={styles.checkmark}>✓</Text>}
              </View>
            </View>
          )}
          {!selectionMode && (
            <View style={styles.photoOverlay}>
              <TouchableOpacity
                style={styles.favoriteBtn}
                onPress={(e) => {
                  e.stopPropagation();
                  toggleFavorite(item.id);
                }}
              >
                <Text style={styles.favoriteIcon}>{item.favorite ? '❤️' : '🤍'}</Text>
              </TouchableOpacity>
              {settings.showDate && (
                <View style={styles.photoBadge}>
                  <Text style={styles.photoBadgeText}>{formatDate(item.timestamp)}</Text>
                </View>
              )}
            </View>
          )}
        </View>
        
        {viewMode === 'list' && (
          <View style={styles.photoContentList}>
            <Text style={styles.photoCaptionList} numberOfLines={2}>
              {item.caption || 'Không có ghi chú'}
            </Text>
            {item.tags && item.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {item.tags.slice(0, 3).map((tag, index) => (
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

  if (showCamera) {
    return (
      <View style={styles.container}>
        {!isWeb && <StatusBar barStyle="light-content" />}
        <CameraView 
          style={styles.camera} 
          facing={facing} 
          ref={cameraRef}
          flash={flashMode}
        >
          <SafeAreaView style={styles.cameraContainer}>
            <View style={styles.cameraHeader}>
              <TouchableOpacity style={styles.cameraIconBtn} onPress={() => setShowCamera(false)}>
                <Text style={styles.cameraIconText}>✕</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.cameraIconBtn} 
                onPress={() => setFlashMode(f => f === 'off' ? 'on' : f === 'on' ? 'auto' : 'off')}
              >
                <Text style={styles.cameraIconText}>
                  {flashMode === 'off' ? '⚡' : flashMode === 'on' ? '💡' : '🔆'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cameraIconBtn} onPress={toggleCameraFacing}>
                <Text style={styles.cameraIconText}>🔄</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.cameraFooter}>
              <TouchableOpacity style={styles.captureBtn} onPress={takePicture}>
                <View style={styles.captureBtnInner} />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </CameraView>
      </View>
    );
  }

  if (capturedPhoto) {
    return (
      <SafeAreaView style={styles.container}>
        {!isWeb && <StatusBar barStyle="dark-content" />}
        <ScrollView style={styles.previewContainer}>
          <Image source={{ uri: capturedPhoto }} style={styles.previewImage} />
          
          <View style={styles.previewContent}>
            <Text style={styles.previewTitle}>Thêm ghi chú cho ảnh</Text>
            <Text style={styles.previewHint}>Sử dụng #hashtag để thêm thẻ</Text>
            <TextInput
              style={styles.previewInput}
              placeholder="Nhập ghi chú của bạn... #travel #food"
              placeholderTextColor="#999"
              value={caption}
              onChangeText={setCaption}
              multiline
              autoFocus
            />
            {extractTags(caption).length > 0 && (
              <View style={styles.tagsPreview}>
                <Text style={styles.tagsPreviewLabel}>Thẻ:</Text>
                {extractTags(caption).map((tag, index) => (
                  <View key={index} style={styles.tagPreview}>
                    <Text style={styles.tagPreviewText}>{tag}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>

        <View style={styles.previewActions}>
          <TouchableOpacity style={[styles.previewBtn, styles.previewCancelBtn]} onPress={cancelPhoto}>
            <Text style={styles.previewBtnText}>Hủy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.previewBtn, styles.previewSaveBtn]} onPress={savePhotoWithCaption}>
            <Text style={[styles.previewBtnText, styles.previewSaveBtnText]}>Lưu lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, settings.darkMode && styles.containerDark]}>
      {!isWeb && <StatusBar barStyle={settings.darkMode ? "light-content" : "dark-content"} />}
      
      <View style={[styles.header, settings.darkMode && styles.headerDark]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.headerTitle, settings.darkMode && styles.textDark]}>Camera Notes</Text>
            <Text style={[styles.headerSubtitle, settings.darkMode && styles.textDarkSub]}>
              {filteredPhotos.length} ảnh {searchQuery && '(đã lọc)'} {isWeb && '• Web'}
            </Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.headerIconBtn} onPress={() => setShowStatsModal(true)}>
              <Text style={styles.headerIconText}>📊</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIconBtn} onPress={() => setShowSettingsModal(true)}>
              <Text style={styles.headerIconText}>⚙️</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={[styles.searchInput, settings.darkMode && styles.searchInputDark]}
            placeholder="Tìm kiếm theo ghi chú..."
            placeholderTextColor={settings.darkMode ? "#999" : "#666"}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.searchClear}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.toolbar}>
          <TouchableOpacity style={styles.toolbarBtn} onPress={() => setShowFilterModal(true)}>
            <Text style={styles.toolbarIcon}>🔽</Text>
            <Text style={[styles.toolbarText, settings.darkMode && styles.textDark]}>
              {sortBy === 'newest' ? 'Mới nhất' : sortBy === 'oldest' ? 'Cũ nhất' : 'Theo ghi chú'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.toolbarBtn} 
            onPress={() => setViewMode(v => v === 'grid' ? 'list' : 'grid')}
          >
            <Text style={styles.toolbarIcon}>{viewMode === 'grid' ? '☷' : '≡'}</Text>
          </TouchableOpacity>

          {photos.length > 0 && (
            <TouchableOpacity 
              style={styles.toolbarBtn}
              onPress={() => {
                if (selectionMode) {
                  setSelectionMode(false);
                  setSelectedPhotos([]);
                } else {
                  setSelectionMode(true);
                }
              }}
            >
              <Text style={styles.toolbarIcon}>{selectionMode ? '✓' : '◻'}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {selectionMode && (
        <View style={styles.selectionBar}>
          <TouchableOpacity style={styles.selectionBtn} onPress={selectAllPhotos}>
            <Text style={styles.selectionText}>
              {selectedPhotos.length === filteredPhotos.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.selectionCount}>{selectedPhotos.length} đã chọn</Text>
          {selectedPhotos.length > 0 && (
            <TouchableOpacity style={styles.selectionBtn} onPress={deleteSelectedPhotos}>
              <Text style={styles.selectionTextDanger}>Xóa</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <TouchableOpacity style={styles.fabButton} onPress={requestCameraPermissionHandler}>
        <Text style={styles.fabIcon}>📷</Text>
        <Text style={styles.fabText}>Chụp ảnh mới</Text>
      </TouchableOpacity>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      ) : filteredPhotos.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>{searchQuery ? '🔍' : '📸'}</Text>
          <Text style={[styles.emptyTitle, settings.darkMode && styles.textDark]}>
            {searchQuery ? 'Không tìm thấy' : 'Chưa có ảnh nào'}
          </Text>
          <Text style={[styles.emptySubtitle, settings.darkMode && styles.textDarkSub]}>
            {searchQuery ? 'Thử tìm kiếm với từ khóa khác' : 'Nhấn nút "Chụp ảnh mới" để bắt đầu\n(Hỗ trợ camera trên trình duyệt)'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredPhotos}
          renderItem={renderPhotoItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.gallery}
          numColumns={viewMode === 'grid' ? settings.gridColumns : 1}
          key={viewMode + settings.gridColumns}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Edit Modal */}
      <Modal visible={showEditModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, settings.darkMode && styles.modalContentDark]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, settings.darkMode && styles.textDark]}>Chỉnh sửa</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowEditModal(false);
                  setEditingPhoto(null);
                  setCaption('');
                }}
              >
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            {editingPhoto && (
              <>
                <Image source={{ uri: editingPhoto.path }} style={styles.modalImage} />
                
                <TextInput
                  style={[styles.modalInput, settings.darkMode && styles.modalInputDark]}
                  placeholder="Nhập ghi chú... #tag"
                  placeholderTextColor="#999"
                  value={caption}
                  onChangeText={setCaption}
                  multiline
                  autoFocus
                />

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.modalActionBtn}
                    onPress={() => downloadPhoto(editingPhoto.path)}
                  >
                    <Text style={styles.modalActionIcon}>⬇️</Text>
                    <Text style={styles.modalActionText}>Tải về</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.modalActionBtn}
                    onPress={() => sharePhoto(editingPhoto.path)}
                  >
                    <Text style={styles.modalActionIcon}>📤</Text>
                    <Text style={styles.modalActionText}>Chia sẻ</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalActionBtn, styles.modalActionBtnDanger]}
                    onPress={() => {
                      setShowEditModal(false);
                      deletePhoto(editingPhoto.id);
                    }}
                  >
                    <Text style={styles.modalActionIcon}>🗑️</Text>
                    <Text style={[styles.modalActionText, styles.modalActionTextDanger]}>Xóa</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalBtn, styles.modalCancelBtn]}
                    onPress={() => {
                      setShowEditModal(false);
                      setEditingPhoto(null);
                      setCaption('');
                    }}
                  >
                    <Text style={styles.modalBtnText}>Hủy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalBtn, styles.modalSaveBtn]}
                    onPress={updateCaption}
                  >
                    <Text style={[styles.modalBtnText, styles.modalSaveBtnText]}>Lưu thay đổi</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Settings Modal */}
      <Modal visible={showSettingsModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, settings.darkMode && styles.modalContentDark]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, settings.darkMode && styles.textDark]}>Cài đặt</Text>
              <TouchableOpacity onPress={() => setShowSettingsModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.settingsList}>
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingLabel, settings.darkMode && styles.textDark]}>Chế độ tối</Text>
                  <Text style={[styles.settingDesc, settings.darkMode && styles.textDarkSub]}>Giao diện tối dễ nhìn</Text>
                </View>
                <Switch
                  value={settings.darkMode}
                  onValueChange={(value) => saveSettings({ ...settings, darkMode: value })}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingLabel, settings.darkMode && styles.textDark]}>Hiển thị ngày</Text>
                  <Text style={[styles.settingDesc, settings.darkMode && styles.textDarkSub]}>Hiện thời gian trên ảnh</Text>
                </View>
                <Switch
                  value={settings.showDate}
                  onValueChange={(value) => saveSettings({ ...settings, showDate: value })}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingLabel, settings.darkMode && styles.textDark]}>Tự động lưu</Text>
                  <Text style={[styles.settingDesc, settings.darkMode && styles.textDarkSub]}>Lưu ảnh ngay khi chụp</Text>
                </View>
                <Switch
                  value={settings.autoSave}
                  onValueChange={(value) => saveSettings({ ...settings, autoSave: value })}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingLabel, settings.darkMode && styles.textDark]}>Số cột lưới</Text>
                  <Text style={[styles.settingDesc, settings.darkMode && styles.textDarkSub]}>Hiện tại: {settings.gridColumns}</Text>
                </View>
                <View style={styles.settingButtons}>
                  <TouchableOpacity
                    style={styles.settingBtn}
                    onPress={() => saveSettings({ ...settings, gridColumns: Math.max(1, settings.gridColumns - 1) })}
                  >
                    <Text style={styles.settingBtnText}>-</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.settingBtn}
                    onPress={() => saveSettings({ ...settings, gridColumns: Math.min(4, settings.gridColumns + 1) })}
                  >
                    <Text style={styles.settingBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingLabel, settings.darkMode && styles.textDark]}>Chất lượng ảnh</Text>
                  <Text style={[styles.settingDesc, settings.darkMode && styles.textDarkSub]}>Hiện tại: {Math.round(quality * 100)}%</Text>
                </View>
                <View style={styles.settingButtons}>
                  <TouchableOpacity
                    style={[styles.settingBtn, quality === 0.5 && styles.settingBtnActive]}
                    onPress={() => setQuality(0.5)}
                  >
                    <Text style={styles.settingBtnText}>Thấp</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.settingBtn, quality === 0.8 && styles.settingBtnActive]}
                    onPress={() => setQuality(0.8)}
                  >
                    <Text style={styles.settingBtnText}>Vừa</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.settingBtn, quality === 1.0 && styles.settingBtnActive]}
                    onPress={() => setQuality(1.0)}
                  >
                    <Text style={styles.settingBtnText}>Cao</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.settingDivider} />

              <TouchableOpacity style={styles.settingActionItem} onPress={exportAllPhotos}>
                <Text style={styles.settingActionIcon}>📤</Text>
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingLabel, settings.darkMode && styles.textDark]}>Xuất dữ liệu</Text>
                  <Text style={[styles.settingDesc, settings.darkMode && styles.textDarkSub]}>Sao lưu tất cả ảnh và ghi chú</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingActionItem} onPress={importPhotos}>
                <Text style={styles.settingActionIcon}>📥</Text>
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingLabel, settings.darkMode && styles.textDark]}>Nhập dữ liệu</Text>
                  <Text style={[styles.settingDesc, settings.darkMode && styles.textDarkSub]}>Khôi phục từ bản sao lưu</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.settingActionItem}
                onPress={() => {
                  if (isWeb) {
                    if (window.confirm('Xóa tất cả dữ liệu?')) {
                      savePhotos([]);
                      setShowSettingsModal(false);
                    }
                  } else {
                    Alert.alert('Xóa tất cả', 'Bạn có chắc chắn?', [
                      { text: 'Hủy', style: 'cancel' },
                      { text: 'Xóa', style: 'destructive', onPress: () => {
                        savePhotos([]);
                        setShowSettingsModal(false);
                      }},
                    ]);
                  }
                }}
              >
                <Text style={styles.settingActionIcon}>🗑️</Text>
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingLabel, styles.settingLabelDanger]}>Xóa tất cả dữ liệu</Text>
                  <Text style={[styles.settingDesc, settings.darkMode && styles.textDarkSub]}>Không thể khôi phục</Text>
                </View>
              </TouchableOpacity>
            </ScrollView>

            <TouchableOpacity
              style={[styles.modalBtn, styles.modalSaveBtn, { marginTop: 16 }]}
              onPress={() => setShowSettingsModal(false)}
            >
              <Text style={[styles.modalBtnText, styles.modalSaveBtnText]}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Filter Modal */}
      <Modal visible={showFilterModal} animationType="fade" transparent={true}>
        <TouchableOpacity 
          style={styles.filterOverlay} 
          activeOpacity={1} 
          onPress={() => setShowFilterModal(false)}
        >
          <View style={[styles.filterMenu, settings.darkMode && styles.filterMenuDark]}>
            <Text style={[styles.filterTitle, settings.darkMode && styles.textDark]}>Sắp xếp theo</Text>
            
            <TouchableOpacity
              style={[styles.filterItem, sortBy === 'newest' && styles.filterItemActive]}
              onPress={() => {
                setSortBy('newest');
                setShowFilterModal(false);
              }}
            >
              <Text style={styles.filterIcon}>🆕</Text>
              <Text style={[styles.filterText, settings.darkMode && styles.textDark]}>Mới nhất</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterItem, sortBy === 'oldest' && styles.filterItemActive]}
              onPress={() => {
                setSortBy('oldest');
                setShowFilterModal(false);
              }}
            >
              <Text style={styles.filterIcon}>📅</Text>
              <Text style={[styles.filterText, settings.darkMode && styles.textDark]}>Cũ nhất</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterItem, sortBy === 'caption' && styles.filterItemActive]}
              onPress={() => {
                setSortBy('caption');
                setShowFilterModal(false);
              }}
            >
              <Text style={styles.filterIcon}>🔤</Text>
              <Text style={[styles.filterText, settings.darkMode && styles.textDark]}>Theo ghi chú</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Stats Modal */}
      <Modal visible={showStatsModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, settings.darkMode && styles.modalContentDark]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, settings.darkMode && styles.textDark]}>Thống kê</Text>
              <TouchableOpacity onPress={() => setShowStatsModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.statsList}>
              {(() => {
                const stats = getStats();
                return (
                  <>
                    <View style={styles.statsCard}>
                      <Text style={styles.statsNumber}>{stats.totalPhotos}</Text>
                      <Text style={[styles.statsLabel, settings.darkMode && styles.textDarkSub]}>Tổng số ảnh</Text>
                    </View>

                    <View style={styles.statsCard}>
                      <Text style={styles.statsNumber}>{stats.withCaptions}</Text>
                      <Text style={[styles.statsLabel, settings.darkMode && styles.textDarkSub]}>Ảnh có ghi chú</Text>
                    </View>

                    <View style={styles.statsCard}>
                      <Text style={styles.statsNumber}>{stats.favorites}</Text>
                      <Text style={[styles.statsLabel, settings.darkMode && styles.textDarkSub]}>Ảnh yêu thích</Text>
                    </View>

                    <View style={styles.statsCard}>
                      <Text style={styles.statsNumber}>{stats.uniqueTags}</Text>
                      <Text style={[styles.statsLabel, settings.darkMode && styles.textDarkSub]}>Thẻ duy nhất</Text>
                    </View>

                    <View style={styles.statsCard}>
                      <Text style={styles.statsNumber}>{stats.avgCaptionLength}</Text>
                      <Text style={[styles.statsLabel, settings.darkMode && styles.textDarkSub]}>Độ dài ghi chú TB</Text>
                    </View>

                    {stats.oldestPhoto && (
                      <View style={styles.statsInfo}>
                        <Text style={[styles.statsInfoLabel, settings.darkMode && styles.textDark]}>Ảnh đầu tiên:</Text>
                        <Text style={[styles.statsInfoValue, settings.darkMode && styles.textDarkSub]}>
                          {stats.oldestPhoto.toLocaleDateString('vi-VN')}
                        </Text>
                      </View>
                    )}

                    {stats.newestPhoto && (
                      <View style={styles.statsInfo}>
                        <Text style={[styles.statsInfoLabel, settings.darkMode && styles.textDark]}>Ảnh gần nhất:</Text>
                        <Text style={[styles.statsInfoValue, settings.darkMode && styles.textDarkSub]}>
                          {stats.newestPhoto.toLocaleDateString('vi-VN')}
                        </Text>
                      </View>
                    )}
                  </>
                );
              })()}
            </ScrollView>

            <TouchableOpacity
              style={[styles.modalBtn, styles.modalSaveBtn, { marginTop: 16 }]}
              onPress={() => setShowStatsModal(false)}
            >
              <Text style={[styles.modalBtnText, styles.modalSaveBtnText]}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  headerDark: {
    backgroundColor: '#2A2A2A',
    borderBottomColor: '#3A3A3A',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#212529',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6C757D',
    marginTop: 4,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  headerIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIconText: {
    fontSize: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
    color: '#212529',
  },
  searchInputDark: {
    color: '#FFFFFF',
    backgroundColor: '#3A3A3A',
  },
  searchClear: {
    fontSize: 18,
    color: '#999',
    padding: 4,
  },
  toolbar: {
    flexDirection: 'row',
    gap: 8,
  },
  toolbarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  toolbarIcon: {
    fontSize: 16,
  },
  toolbarText: {
    fontSize: 13,
    color: '#495057',
    fontWeight: '500',
  },
  selectionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  selectionBtn: {
    padding: 4,
  },
  selectionText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  selectionTextDanger: {
    color: '#FFE5E5',
    fontWeight: '600',
    fontSize: 14,
  },
  selectionCount: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
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
  photoCardGrid: {
    flex: 1,
    margin: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
  },
  photoCardList: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  photoCardSelected: {
    borderWidth: 3,
    borderColor: '#007AFF',
  },
  photoImageContainer: {
    position: 'relative',
  },
  photoImageContainerList: {
    position: 'relative',
    width: 120,
  },
  photoImageGrid: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#E9ECEF',
  },
  photoImageList: {
    width: 120,
    height: 120,
    backgroundColor: '#E9ECEF',
  },
  photoOverlay: {
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
  photoBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  photoBadgeText: {
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
  photoContentList: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  photoCaptionList: {
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#ADB5BD',
    textAlign: 'center',
    lineHeight: 22,
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
  camera: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
  },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  cameraIconBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIconText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
  },
  cameraFooter: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  captureBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureBtnInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#007AFF',
  },
  previewContainer: {
    flex: 1,
  },
  previewImage: {
    width: width,
    height: width * 1.2,
    backgroundColor: '#E9ECEF',
  },
  previewContent: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  previewTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 4,
  },
  previewHint: {
    fontSize: 13,
    color: '#6C757D',
    marginBottom: 12,
  },
  previewInput: {
    borderWidth: 1,
    borderColor: '#DEE2E6',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#212529',
    minHeight: 120,
    textAlignVertical: 'top',
    backgroundColor: '#F8F9FA',
  },
  tagsPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  tagsPreviewLabel: {
    fontSize: 14,
    color: '#6C757D',
    fontWeight: '600',
  },
  tagPreview: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagPreviewText: {
    color: '#1976D2',
    fontSize: 13,
    fontWeight: '600',
  },
  previewActions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  previewBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  previewCancelBtn: {
    backgroundColor: '#F8F9FA',
  },
  previewSaveBtn: {
    backgroundColor: '#007AFF',
  },
  previewBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
  },
  previewSaveBtnText: {
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: height * 0.85,
  },
  modalContentDark: {
    backgroundColor: '#2A2A2A',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#212529',
  },
  modalClose: {
    fontSize: 28,
    color: '#ADB5BD',
    fontWeight: '300',
  },
  modalImage: {
    width: '100%',
    height: 240,
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: '#E9ECEF',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#DEE2E6',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#212529',
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 16,
    backgroundColor: '#F8F9FA',
  },
  modalInputDark: {
    backgroundColor: '#3A3A3A',
    borderColor: '#4A4A4A',
    color: '#FFFFFF',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  modalActionBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
  },
  modalActionBtnDanger: {
    backgroundColor: '#FFF5F5',
  },
  modalActionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  modalActionText: {
    fontSize: 12,
    color: '#495057',
    fontWeight: '600',
  },
  modalActionTextDanger: {
    color: '#DC3545',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCancelBtn: {
    backgroundColor: '#F8F9FA',
  },
  modalSaveBtn: {
    backgroundColor: '#007AFF',
  },
  modalBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
  },
  modalSaveBtnText: {
    color: '#FFFFFF',
  },
  settingsList: {
    maxHeight: height * 0.6,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 2,
  },
  settingLabelDanger: {
    color: '#DC3545',
  },
  settingDesc: {
    fontSize: 13,
    color: '#6C757D',
  },
  settingButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  settingBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    minWidth: 60,
    alignItems: 'center',
  },
  settingBtnActive: {
    backgroundColor: '#007AFF',
  },
  settingBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
  },
  settingDivider: {
    height: 1,
    backgroundColor: '#E9ECEF',
    marginVertical: 16,
  },
  settingActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
    gap: 12,
  },
  settingActionIcon: {
    fontSize: 24,
  },
  filterOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 120,
    paddingHorizontal: 20,
  },
  filterMenu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  filterMenuDark: {
    backgroundColor: '#2A2A2A',
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6C757D',
    paddingHorizontal: 12,
    paddingVertical: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 12,
  },
  filterItemActive: {
    backgroundColor: '#E3F2FD',
  },
  filterIcon: {
    fontSize: 20,
  },
  filterText: {
    fontSize: 16,
    color: '#212529',
    fontWeight: '500',
  },
  statsList: {
    maxHeight: height * 0.6,
  },
  statsCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    alignItems: 'center',
  },
  statsNumber: {
    fontSize: 36,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 14,
    color: '#6C757D',
    fontWeight: '500',
  },
  statsInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  statsInfoLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#212529',
  },
  statsInfoValue: {
    fontSize: 15,
    color: '#6C757D',
  },
  textDark: {
    color: '#FFFFFF',
  },
  textDarkSub: {
    color: '#AAAAAA',
  },
});