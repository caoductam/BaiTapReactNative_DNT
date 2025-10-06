// src/components/Modals/SettingsModal.js
import React from 'react';
import { 
  Modal, 
  View, 
  TouchableOpacity, 
  Text, 
  ScrollView,
  Switch,
  StyleSheet 
} from 'react-native';
import { SCREEN_HEIGHT, QUALITY_OPTIONS } from '../../constants/constants';

const SettingsModal = ({ 
  visible, 
  settings, 
  quality,
  darkMode,
  onClose, 
  onSettingsChange,
  onQualityChange,
  onExport,
  onImport,
  onClearAll,
}) => {
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={[styles.content, darkMode && styles.contentDark]}>
          <View style={styles.header}>
            <Text style={[styles.title, darkMode && styles.textDark]}>Cài đặt</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.close}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {/* Appearance Section */}
            <Text style={styles.sectionTitle}>GIAO DIỆN</Text>

            {/* Dark Mode */}
            <View style={styles.item}>
              <View style={styles.info}>
                <Text style={[styles.label, darkMode && styles.textDark]}>
                  Chế độ tối
                </Text>
                <Text style={[styles.desc, darkMode && styles.textDarkSub]}>
                  Giao diện tối dễ nhìn
                </Text>
              </View>
              <Switch
                value={settings.darkMode}
                onValueChange={(value) => onSettingsChange({ darkMode: value })}
                trackColor={{ false: '#E9ECEF', true: '#007AFF' }}
                thumbColor={settings.darkMode ? '#FFFFFF' : '#F8F9FA'}
              />
            </View>

            {/* Show Date */}
            <View style={styles.item}>
              <View style={styles.info}>
                <Text style={[styles.label, darkMode && styles.textDark]}>
                  Hiển thị ngày
                </Text>
                <Text style={[styles.desc, darkMode && styles.textDarkSub]}>
                  Hiện thời gian trên ảnh
                </Text>
              </View>
              <Switch
                value={settings.showDate}
                onValueChange={(value) => onSettingsChange({ showDate: value })}
                trackColor={{ false: '#E9ECEF', true: '#007AFF' }}
                thumbColor={settings.showDate ? '#FFFFFF' : '#F8F9FA'}
              />
            </View>

            {/* Grid Columns */}
            <View style={styles.item}>
              <View style={styles.info}>
                <Text style={[styles.label, darkMode && styles.textDark]}>
                  Số cột lưới
                </Text>
                <Text style={[styles.desc, darkMode && styles.textDarkSub]}>
                  Hiện tại: {settings.gridColumns} cột
                </Text>
              </View>
              <View style={styles.buttons}>
                <TouchableOpacity
                  style={[styles.btn, settings.gridColumns === 1 && styles.btnDisabled]}
                  onPress={() => onSettingsChange({ 
                    gridColumns: Math.max(1, settings.gridColumns - 1) 
                  })}
                  disabled={settings.gridColumns === 1}
                >
                  <Text style={styles.btnText}>−</Text>
                </TouchableOpacity>
                <Text style={[styles.counterText, darkMode && styles.textDark]}>
                  {settings.gridColumns}
                </Text>
                <TouchableOpacity
                  style={[styles.btn, settings.gridColumns === 4 && styles.btnDisabled]}
                  onPress={() => onSettingsChange({ 
                    gridColumns: Math.min(4, settings.gridColumns + 1) 
                  })}
                  disabled={settings.gridColumns === 4}
                >
                  <Text style={styles.btnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Camera Section */}
            <Text style={styles.sectionTitle}>CAMERA</Text>

            {/* Auto Save */}
            <View style={styles.item}>
              <View style={styles.info}>
                <Text style={[styles.label, darkMode && styles.textDark]}>
                  Tự động lưu
                </Text>
                <Text style={[styles.desc, darkMode && styles.textDarkSub]}>
                  Lưu ảnh ngay khi chụp
                </Text>
              </View>
              <Switch
                value={settings.autoSave}
                onValueChange={(value) => onSettingsChange({ autoSave: value })}
                trackColor={{ false: '#E9ECEF', true: '#007AFF' }}
                thumbColor={settings.autoSave ? '#FFFFFF' : '#F8F9FA'}
              />
            </View>

            {/* Quality */}
            <View style={styles.item}>
              <View style={styles.info}>
                <Text style={[styles.label, darkMode && styles.textDark]}>
                  Chất lượng ảnh
                </Text>
                <Text style={[styles.desc, darkMode && styles.textDarkSub]}>
                  Hiện tại: {Math.round(quality * 100)}%
                </Text>
              </View>
              <View style={styles.buttons}>
                <TouchableOpacity
                  style={[
                    styles.qualityBtn, 
                    quality === QUALITY_OPTIONS.LOW && styles.qualityBtnActive
                  ]}
                  onPress={() => onQualityChange(QUALITY_OPTIONS.LOW)}
                >
                  <Text style={[
                    styles.qualityBtnText,
                    quality === QUALITY_OPTIONS.LOW && styles.qualityBtnTextActive
                  ]}>
                    Thấp
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.qualityBtn, 
                    quality === QUALITY_OPTIONS.MEDIUM && styles.qualityBtnActive
                  ]}
                  onPress={() => onQualityChange(QUALITY_OPTIONS.MEDIUM)}
                >
                  <Text style={[
                    styles.qualityBtnText,
                    quality === QUALITY_OPTIONS.MEDIUM && styles.qualityBtnTextActive
                  ]}>
                    Vừa
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.qualityBtn, 
                    quality === QUALITY_OPTIONS.HIGH && styles.qualityBtnActive
                  ]}
                  onPress={() => onQualityChange(QUALITY_OPTIONS.HIGH)}
                >
                  <Text style={[
                    styles.qualityBtnText,
                    quality === QUALITY_OPTIONS.HIGH && styles.qualityBtnTextActive
                  ]}>
                    Cao
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Data Section */}
            <Text style={styles.sectionTitle}>DỮ LIỆU</Text>

            {/* Export */}
            <TouchableOpacity style={styles.actionItem} onPress={onExport}>
              <Text style={styles.actionIcon}>📤</Text>
              <View style={styles.info}>
                <Text style={[styles.label, darkMode && styles.textDark]}>
                  Xuất dữ liệu
                </Text>
                <Text style={[styles.desc, darkMode && styles.textDarkSub]}>
                  Sao lưu tất cả ảnh và ghi chú
                </Text>
              </View>
              <Text style={styles.actionArrow}>›</Text>
            </TouchableOpacity>

            {/* Import */}
            <TouchableOpacity style={styles.actionItem} onPress={onImport}>
              <Text style={styles.actionIcon}>📥</Text>
              <View style={styles.info}>
                <Text style={[styles.label, darkMode && styles.textDark]}>
                  Nhập dữ liệu
                </Text>
                <Text style={[styles.desc, darkMode && styles.textDarkSub]}>
                  Khôi phục từ bản sao lưu
                </Text>
              </View>
              <Text style={styles.actionArrow}>›</Text>
            </TouchableOpacity>

            {/* Clear All */}
            <TouchableOpacity style={styles.actionItem} onPress={onClearAll}>
              <Text style={styles.actionIcon}>🗑️</Text>
              <View style={styles.info}>
                <Text style={[styles.label, styles.labelDanger]}>
                  Xóa tất cả dữ liệu
                </Text>
                <Text style={[styles.desc, darkMode && styles.textDarkSub]}>
                  Không thể khôi phục
                </Text>
              </View>
              <Text style={[styles.actionArrow, styles.actionArrowDanger]}>›</Text>
            </TouchableOpacity>

            <View style={styles.bottomPadding} />
          </ScrollView>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Đóng</Text>
          </TouchableOpacity>
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
  list: {
    maxHeight: SCREEN_HEIGHT * 0.6,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6C757D',
    letterSpacing: 0.5,
    marginTop: 8,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  info: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 2,
  },
  labelDanger: {
    color: '#DC3545',
  },
  desc: {
    fontSize: 13,
    color: '#6C757D',
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  btn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnDisabled: {
    opacity: 0.3,
  },
  btnText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#495057',
  },
  counterText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    minWidth: 30,
    textAlign: 'center',
  },
  qualityBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    minWidth: 55,
    alignItems: 'center',
  },
  qualityBtnActive: {
    backgroundColor: '#007AFF',
  },
  qualityBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#495057',
  },
  qualityBtnTextActive: {
    color: '#FFFFFF',
  },
  divider: {
    height: 1,
    backgroundColor: '#E9ECEF',
    marginVertical: 16,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
    gap: 12,
  },
  actionIcon: {
    fontSize: 24,
  },
  actionArrow: {
    fontSize: 24,
    color: '#ADB5BD',
    fontWeight: '300',
  },
  actionArrowDanger: {
    color: '#DC3545',
  },
  bottomPadding: {
    height: 20,
  },
  closeBtn: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  closeBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  textDark: {
    color: '#FFFFFF',
  },
  textDarkSub: {
    color: '#AAAAAA',
  },
});

export default SettingsModal;