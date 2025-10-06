import React from 'react';
import { 
  Modal, 
  View, 
  Image, 
  TextInput, 
  TouchableOpacity, 
  Text, 
  StyleSheet 
} from 'react-native';
import { downloadPhoto, sharePhoto } from '../../utils/helpers';
import { SCREEN_HEIGHT } from '../../constants/constants';

const EditModal = ({ 
  visible, 
  photo, 
  caption, 
  darkMode,
  onCaptionChange, 
  onSave, 
  onClose,
  onDelete,
}) => {
  if (!photo) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={[styles.content, darkMode && styles.contentDark]}>
          <View style={styles.header}>
            <Text style={[styles.title, darkMode && styles.textDark]}>
              Chỉnh sửa
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.close}>✕</Text>
            </TouchableOpacity>
          </View>

          <Image source={{ uri: photo.path }} style={styles.image} />
          
          <TextInput
            style={[styles.input, darkMode && styles.inputDark]}
            placeholder="Nhập ghi chú... #tag"
            placeholderTextColor="#999"
            value={caption}
            onChangeText={onCaptionChange}
            multiline
            autoFocus
          />

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => downloadPhoto(photo.path)}
            >
              <Text style={styles.actionIcon}>⬇️</Text>
              <Text style={styles.actionText}>Tải về</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => sharePhoto(photo.path)}
            >
              <Text style={styles.actionIcon}>📤</Text>
              <Text style={styles.actionText}>Chia sẻ</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnDanger]}
              onPress={onDelete}
            >
              <Text style={styles.actionIcon}>🗑️</Text>
              <Text style={[styles.actionText, styles.actionTextDanger]}>Xóa</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.btn, styles.cancelBtn]}
              onPress={onClose}
            >
              <Text style={styles.btnText}>Hủy</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.btn, styles.saveBtn]}
              onPress={onSave}
            >
              <Text style={[styles.btnText, styles.saveBtnText]}>
                Lưu thay đổi
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: SCREEN_HEIGHT * 0.85,
  },
  contentDark: {
    backgroundColor: '#2A2A2A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#212529',
  },
  close: {
    fontSize: 28,
    color: '#ADB5BD',
    fontWeight: '300',
  },
  image: {
    width: '100%',
    height: 240,
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: '#E9ECEF',
  },
  input: {
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
  inputDark: {
    backgroundColor: '#3A3A3A',
    borderColor: '#4A4A4A',
    color: '#FFFFFF',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
  },
  actionBtnDanger: {
    backgroundColor: '#FFF5F5',
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  actionText: {
    fontSize: 12,
    color: '#495057',
    fontWeight: '600',
  },
  actionTextDanger: {
    color: '#DC3545',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  btn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#F8F9FA',
  },
  saveBtn: {
    backgroundColor: '#007AFF',
  },
  btnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
  },
  saveBtnText: {
    color: '#FFFFFF',
  },
  textDark: {
    color: '#FFFFFF',
  },
});

export default EditModal;