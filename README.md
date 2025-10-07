# Thông tin cá nhân
- Họ tên: Cao Đức Tâm
- MSSV: 22IT257
- Lớp: 22GIT
- Lớp học phần: Phát triển ứng dụng đa nền tảng (1) GITTA
# Camera Notes App
Camera Notes App là ứng dụng React Native đa nền tảng cho phép bạn chụp ảnh, thêm chú thích và hashtag, sắp xếp thư viện ảnh và quản lý ghi chú hiệu quả. Ứng dụng hỗ trợ cả nền tảng di động và web thông qua Expo.
## Các chức năng chính
- Chụp ảnh bằng camera thiết bị (hỗ trợ di động và web)
- Thêm chú thích và hashtag vào ảnh
- Sắp xếp ảnh theo dạng lưới hoặc danh sách
- Tìm kiếm và lọc ảnh theo chú thích hoặc thẻ
- Đánh dấu ảnh là mục yêu thích
- Chỉnh sửa hoặc xóa ảnh
- Xuất và nhập dữ liệu ảnh (sao lưu JSON)
- Chế độ tối và cài đặt giao diện người dùng có thể tùy chỉnh
- Thống kê và thông tin chi tiết về bộ sưu tập ảnh của bạn
## Cấu trúc dự án
```
CameraNotesApp/
  App.js
  index.js
  package.json
  app.json
  assets/
  src/
    components/
      Camera/
      Gallery/
      Modals/
      Preview/
      UI/
    constants/
    hooks/
    styles/
    utils/
```

## Điều kiện tiên quyết

- [Node.js](https://nodejs.org/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

## Cài đặt

1. Clone the repository:
   ```sh
   git clone <your-repo-url>
   cd CameraNotesApp
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

## Chạy ứng dụng

- **Bắt đầu ở chế độ phát triển:**
  ```sh
  npm start
  ```
- **Chạy trên Android:**
  ```sh
  npm run android
  ```
- **Chạy trên iOS:**
  ```sh
  npm run ios
  ```
- **Chạy trên Web:**
  ```sh
  npm run web
  ```

## Cách sử dụng

- Tap "Chụp ảnh mới" to take a photo.
- Add a caption and hashtags (e.g., `#travel #food`).
- Browse, search, and filter your gallery.
- Edit, delete, or favorite photos.
- Export or import your photo data from settings.

## Công cụ, ngôn ngữ hỗ trợ

- React Native
- Expo
- AsyncStorage
- Expo Camera
- Expo Media Library

## Giấy phép

MIT

---
