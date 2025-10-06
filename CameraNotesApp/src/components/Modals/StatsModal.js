import React from 'react';
import { 
  Modal, 
  View, 
  TouchableOpacity, 
  Text, 
  ScrollView,
  StyleSheet 
} from 'react-native';
import { getStats } from '../../utils/helpers';
import { SCREEN_HEIGHT } from '../../constants/constants';

const StatsModal = ({ visible, photos, darkMode, onClose }) => {
  const stats = getStats(photos);

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={[styles.content, darkMode && styles.contentDark]}>
          <View style={styles.header}>
            <Text style={[styles.title, darkMode && styles.textDark]}>Thống kê</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.close}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.list}>
            <View style={styles.card}>
              <Text style={styles.number}>{stats.totalPhotos}</Text>
              <Text style={[styles.label, darkMode && styles.textDarkSub]}>
                Tổng số ảnh
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.number}>{stats.withCaptions}</Text>
              <Text style={[styles.label, darkMode && styles.textDarkSub]}>
                Ảnh có ghi chú
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.number}>{stats.favorites}</Text>
              <Text style={[styles.label, darkMode && styles.textDarkSub]}>
                Ảnh yêu thích
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.number}>{stats.uniqueTags}</Text>
              <Text style={[styles.label, darkMode && styles.textDarkSub]}>
                Thẻ duy nhất
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.number}>{stats.avgCaptionLength}</Text>
              <Text style={[styles.label, darkMode && styles.textDarkSub]}>
                Độ dài ghi chú TB
              </Text>
            </View>

            {stats.oldestPhoto && (
              <View style={styles.info}>
                <Text style={[styles.infoLabel, darkMode && styles.textDark]}>
                  Ảnh đầu tiên:
                </Text>
                <Text style={[styles.infoValue, darkMode && styles.textDarkSub]}>
                  {stats.oldestPhoto.toLocaleDateString('vi-VN')}
                </Text>
              </View>
            )}

            {stats.newestPhoto && (
              <View style={styles.info}>
                <Text style={[styles.infoLabel, darkMode && styles.textDark]}>
                  Ảnh gần nhất:
                </Text>
                <Text style={[styles.infoValue, darkMode && styles.textDarkSub]}>
                  {stats.newestPhoto.toLocaleDateString('vi-VN')}
                </Text>
              </View>
            )}
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
  card: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    alignItems: 'center',
  },
  number: {
    fontSize: 36,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: '#6C757D',
    fontWeight: '500',
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  infoLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#212529',
  },
  infoValue: {
    fontSize: 15,
    color: '#6C757D',
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

export default StatsModal;