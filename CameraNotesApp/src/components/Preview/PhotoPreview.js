import React from 'react';
import { 
  View, 
  Image, 
  TextInput, 
  TouchableOpacity, 
  Text, 
  ScrollView, 
  SafeAreaView,
  StatusBar,
  StyleSheet 
} from 'react-native';
import { extractTags } from '../../utils/helpers';
import { SCREEN_WIDTH, IS_WEB } from '../../constants/constants';

const PhotoPreview = ({ 
  photoUri, 
  caption, 
  onCaptionChange, 
  onSave, 
  onCancel 
}) => {
  const tags = extractTags(caption);

  return (
    <SafeAreaView style={styles.container}>
      {!IS_WEB && <StatusBar barStyle="dark-content" />}
      
      <ScrollView style={styles.scrollView}>
        <Image source={{ uri: photoUri }} style={styles.image} />
        
        <View style={styles.content}>
          <Text style={styles.title}>Thêm ghi chú cho ảnh</Text>
          <Text style={styles.hint}>Sử dụng #hashtag để thêm thẻ</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Nhập ghi chú của bạn... #travel #food"
            placeholderTextColor="#999"
            value={caption}
            onChangeText={onCaptionChange}
            multiline
            autoFocus
          />
          
          {tags.length > 0 && (
            <View style={styles.tagsPreview}>
              <Text style={styles.tagsLabel}>Thẻ:</Text>
              {tags.map((tag, index) => (
                <View key={index} style={styles.tagPreview}>
                  <Text style={styles.tagPreviewText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.btn, styles.cancelBtn]} 
          onPress={onCancel}
        >
          <Text style={styles.btnText}>Hủy</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.btn, styles.saveBtn]} 
          onPress={onSave}
        >
          <Text style={[styles.btnText, styles.saveBtnText]}>Lưu lại</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 1.2,
    backgroundColor: '#E9ECEF',
  },
  content: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 4,
  },
  hint: {
    fontSize: 13,
    color: '#6C757D',
    marginBottom: 12,
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
    backgroundColor: '#F8F9FA',
  },
  tagsPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  tagsLabel: {
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
  actions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
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
});

export default PhotoPreview;