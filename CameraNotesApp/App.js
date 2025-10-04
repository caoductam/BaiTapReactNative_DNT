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
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@camera_notes_photos';
const { width, height } = Dimensions.get('window');

export default function App() {
  const [facing, setFacing] = useState('back');
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const [photos, setPhotos] = useState([]);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [caption, setCaption] = useState('');
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      const savedPhotos = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedPhotos) {
        setPhotos(JSON.parse(savedPhotos));
      }
    } catch (error) {
      console.error('Lỗi khi load photos:', error);
    }
  };

  const savePhotos = async (newPhotos) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newPhotos));
      setPhotos(newPhotos);
    } catch (error) {
      console.error('Lỗi khi lưu photos:', error);
      Alert.alert('Lỗi', 'Không thể lưu ảnh');
    }
  };

  const requestCameraPermissionHandler = async () => {
    const { status } = await requestCameraPermission();
    if (status === 'granted') {
      setShowCamera(true);
    } else {
      Alert.alert('Quyền bị từ chối', 'Cần quyền camera để chụp ảnh');
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
        });
        setCapturedPhoto(photo.uri);
        setShowCamera(false);
      } catch (error) {
        console.error('Lỗi khi chụp ảnh:', error);
        Alert.alert('Lỗi', 'Không thể chụp ảnh');
      }
    }
  };

  const savePhotoWithCaption = async () => {
    if (!capturedPhoto) return;

    try {
      const fileName = `photo_${Date.now()}.jpg`;
      const newPath = `${FileSystem.documentDirectory}${fileName}`;
      
      await FileSystem.copyAsync({
        from: capturedPhoto,
        to: newPath,
      });

      const newPhoto = {
        id: Date.now().toString(),
        path: newPath,
        caption: caption,
        timestamp: new Date().toISOString(),
      };

      const updatedPhotos = [newPhoto, ...photos];
      await savePhotos(updatedPhotos);

      setCapturedPhoto(null);
      setCaption('');
      Alert.alert('✓ Thành công', 'Đã lưu ảnh với ghi chú!');
    } catch (error) {
      console.error('Lỗi khi lưu ảnh:', error);
      Alert.alert('Lỗi', 'Không thể lưu ảnh');
    }
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
          ? { ...photo, caption: caption }
          : photo
      );
      await savePhotos(updatedPhotos);
      setShowEditModal(false);
      setEditingPhoto(null);
      setCaption('');
      Alert.alert('✓ Thành công', 'Đã cập nhật ghi chú!');
    } catch (error) {
      console.error('Lỗi khi cập nhật:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật ghi chú');
    }
  };

  const deletePhoto = async (photoId, photoPath) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc muốn xóa ảnh này không?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              const fileInfo = await FileSystem.getInfoAsync(photoPath);
              if (fileInfo.exists) {
                await FileSystem.deleteAsync(photoPath, { idempotent: true });
              }
              
              const updatedPhotos = photos.filter((photo) => photo.id !== photoId);
              await savePhotos(updatedPhotos);
              Alert.alert('✓ Thành công', 'Đã xóa ảnh!');
            } catch (error) {
              console.error('Lỗi khi xóa:', error);
              Alert.alert('Lỗi', 'Không thể xóa ảnh');
            }
          },
        },
      ]
    );
  };

  const saveToMediaLibrary = async (photoPath) => {
    try {
      if (!mediaPermission?.granted) {
        const { status } = await requestMediaPermission();
        if (status !== 'granted') {
          Alert.alert('Quyền bị từ chối', 'Cần quyền truy cập thư viện ảnh');
          return;
        }
      }

      await MediaLibrary.saveToLibraryAsync(photoPath);
      Alert.alert('✓ Thành công', 'Đã lưu ảnh vào thư viện!');
    } catch (error) {
      console.error('Lỗi khi lưu vào thư viện:', error);
      Alert.alert('Lỗi', 'Không thể lưu vào thư viện ảnh');
    }
  };

  const sharePhoto = async (photoPath) => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(photoPath);
      } else {
        Alert.alert('Lỗi', 'Chia sẻ không khả dụng');
      }
    } catch (error) {
      console.error('Lỗi khi chia sẻ:', error);
      Alert.alert('Lỗi', 'Không thể chia sẻ ảnh');
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const formatDate = (timestamp) => {
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

  const renderPhotoItem = ({ item }) => (
    <View style={styles.photoCard}>
      <TouchableOpacity onPress={() => openEditModal(item)} activeOpacity={0.9}>
        <Image source={{ uri: item.path }} style={styles.photoImage} />
        <View style={styles.photoOverlay}>
          <View style={styles.photoBadge}>
            <Text style={styles.photoBadgeText}>{formatDate(item.timestamp)}</Text>
          </View>
        </View>
      </TouchableOpacity>
      
      <View style={styles.photoContent}>
        <Text style={styles.photoCaption} numberOfLines={2}>
          {item.caption || 'Không có ghi chú'}
        </Text>
      </View>

      <View style={styles.photoActions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => openEditModal(item)}
        >
          <Text style={styles.actionIcon}>✏️</Text>
          <Text style={styles.actionText}>Sửa</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => saveToMediaLibrary(item.path)}
        >
          <Text style={styles.actionIcon}>💾</Text>
          <Text style={styles.actionText}>Lưu</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => sharePhoto(item.path)}
        >
          <Text style={styles.actionIcon}>📤</Text>
          <Text style={styles.actionText}>Chia sẻ</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.deleteBtn]}
          onPress={() => deletePhoto(item.id, item.path)}
        >
          <Text style={styles.actionIcon}>🗑️</Text>
          <Text style={[styles.actionText, styles.deleteText]}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (showCamera) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          <SafeAreaView style={styles.cameraContainer}>
            <View style={styles.cameraHeader}>
              <TouchableOpacity style={styles.cameraIconBtn} onPress={() => setShowCamera(false)}>
                <Text style={styles.cameraIconText}>✕</Text>
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
        <StatusBar barStyle="dark-content" />
        <ScrollView style={styles.previewContainer}>
          <Image source={{ uri: capturedPhoto }} style={styles.previewImage} />
          
          <View style={styles.previewContent}>
            <Text style={styles.previewTitle}>Thêm ghi chú cho ảnh</Text>
            <TextInput
              style={styles.previewInput}
              placeholder="Nhập ghi chú của bạn..."
              placeholderTextColor="#999"
              value={caption}
              onChangeText={setCaption}
              multiline
              autoFocus
            />
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Camera Notes</Text>
        <Text style={styles.headerSubtitle}>{photos.length} ảnh đã lưu</Text>
      </View>

      <TouchableOpacity style={styles.fabButton} onPress={requestCameraPermissionHandler}>
        <Text style={styles.fabIcon}>📷</Text>
        <Text style={styles.fabText}>Chụp ảnh mới</Text>
      </TouchableOpacity>

      {photos.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📸</Text>
          <Text style={styles.emptyTitle}>Chưa có ảnh nào</Text>
          <Text style={styles.emptySubtitle}>Nhấn nút "Chụp ảnh mới" để bắt đầu</Text>
        </View>
      ) : (
        <FlatList
          data={photos}
          renderItem={renderPhotoItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.gallery}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Modal visible={showEditModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chỉnh sửa ghi chú</Text>
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
              <Image source={{ uri: editingPhoto.path }} style={styles.modalImage} />
            )}

            <TextInput
              style={styles.modalInput}
              placeholder="Nhập ghi chú..."
              placeholderTextColor="#999"
              value={caption}
              onChangeText={setCaption}
              multiline
              autoFocus
            />

            <View style={styles.modalActions}>
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
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#212529',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#6C757D',
    marginTop: 4,
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
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  fabIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  gallery: {
    padding: 16,
    paddingBottom: 24,
  },
  photoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  photoImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#E9ECEF',
  },
  photoOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  photoBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backdropFilter: 'blur(10px)',
  },
  photoBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  photoContent: {
    padding: 16,
  },
  photoCaption: {
    fontSize: 16,
    color: '#212529',
    lineHeight: 24,
    fontWeight: '500',
  },
  photoActions: {
    flexDirection: 'row',
    padding: 12,
    paddingTop: 0,
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
  },
  actionIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  actionText: {
    fontSize: 13,
    color: '#495057',
    fontWeight: '600',
  },
  deleteBtn: {
    backgroundColor: '#FFF5F5',
  },
  deleteText: {
    color: '#DC3545',
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
    backdropFilter: 'blur(10px)',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
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
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
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
  modalActions: {
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
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  modalBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
  },
  modalSaveBtnText: {
    color: '#FFFFFF',
  },
});