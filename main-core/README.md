# 🏠 ROOM BOOKING API

Backend API cho ứng dụng **đặt phòng / thuê phòng**, cho phép người dùng:

- Đăng ký, đăng nhập (JWT & Google)
- Quản lý người dùng (admin)
- Quản lý phòng, địa điểm
- Đặt phòng & kiểm tra lịch trống
- Bình luận, lưu phòng yêu thích
- Upload ảnh (avatar, room, location)

---

## ⚙️ Công nghệ sử dụng

- Node.js, Nestjs
- JWT Authentication (Access / Refresh Token)
- MySQL
- Multer (upload file)
- Google OAuth
- Redis
- RabbitMQ
- Elastic Search

---

## 🔐 Xác thực & Phân quyền

Hệ thống sử dụng **JWT** cho các API cần đăng nhập.

### Access Token

Gửi kèm header:

```http
Authorization: Bearer <accessToken>
```

### Phân quyền

- **Public**: không cần đăng nhập
- **JWT**: người dùng đã đăng nhập
- **OWNER**: chủ sở hữu tài nguyên
- **ADMIN**: quyền quản trị hệ thống

---

## 📌 Danh sách API chính

---

### 🔑 Authentication

| Method | Endpoint                | Mô tả                |
| ------ | ----------------------- | -------------------- |
| POST   | `/auth/signup`          | Đăng ký              |
| POST   | `/auth/signin`          | Đăng nhập (trả JWT)  |
| POST   | `/auth/refresh-token`   | Cấp lại access token |
| GET    | `/auth/google`          | Đăng nhập Google     |
| GET    | `/auth/google-callback` | Google callback      |

---

### 👤 User

| Method | Endpoint                 | Mô tả                      |
| ------ | ------------------------ | -------------------------- |
| GET    | `/users`                 | Lấy danh sách user (ADMIN) |
| GET    | `/users/me`              | Thông tin user hiện tại    |
| POST   | `/users`                 | Tạo user mới (ADMIN)       |
| DELETE | `/users/{id}`            | Xoá user (ADMIN)           |
| GET    | `/users/{id}`            | Lấy user theo id           |
| PATCH  | `/users/{id}`            | Cập nhật user              |
| GET    | `/users/search?keyword=` | Tìm kiếm user (ADMIN)      |
| POST   | `/users/upload-avatar`   | Upload avatar              |

---

### 🏠 Room

| Method | Endpoint                          | Mô tả                        |
| ------ | --------------------------------- | ---------------------------- |
| GET    | `/rooms`                          | Danh sách phòng (Public)     |
| GET    | `/rooms/by-location/{locationId}` | Phòng theo địa điểm          |
| GET    | `/rooms/{id}`                     | Chi tiết phòng               |
| GET    | `/rooms/search?keyword=`          | Tìm kiếm phòng               |
| POST   | `/rooms`                          | Tạo phòng (OWNER)            |
| PATCH  | `/rooms/{id}`                     | Cập nhật phòng (OWNER)       |
| POST   | `/rooms/upload-image`             | Upload ảnh phòng (OWNER)     |
| GET    | `/rooms/created/{userId}`         | Phòng đã tạo (OWNER / ADMIN) |
| GET    | `/rooms/saved/{userId}`           | Phòng đã lưu (OWNER / ADMIN) |
| DELETE | `/rooms/{id}`                     | Xoá phòng (OWNER / ADMIN)    |

---

### 📍 Location

| Method | Endpoint                  | Mô tả                                       |
| ------ | ------------------------- | ------------------------------------------- |
| GET    | `/locations`              | Danh sách location (filter: country, city…) |
| POST   | `/locations`              | Tạo location (ADMIN)                        |
| GET    | `/locations/{id}`         | Chi tiết location                           |
| PATCH  | `/locations/{id}`         | Cập nhật location (ADMIN)                   |
| DELETE | `/locations/{id}`         | Xoá location (ADMIN)                        |
| POST   | `/locations/upload-image` | Upload ảnh location (ADMIN)                 |

---

### 📅 Booking

| Method | Endpoint                                    | Mô tả                             |
| ------ | ------------------------------------------- | --------------------------------- |
| GET    | `/bookings`                                 | Danh sách booking (ADMIN, filter) |
| GET    | `/bookings/by-booking/{id}`                 | Chi tiết booking (OWNER / ADMIN)  |
| GET    | `/bookings/by-user/{userId}`                | Booking theo user (ADMIN)         |
| GET    | `/bookings/me`                              | Booking của tôi (OWNER, filter)   |
| GET    | `/bookings/availability/{roomId}?from=&to=` | Kiểm tra lịch trống (Public)      |
| GET    | `/bookings/calendar/{roomId}`               | Lịch booking phòng                |
| GET    | `/bookings/me/by-booking/{id}`              | Chi tiết booking của tôi          |
| POST   | `/bookings`                                 | Tạo booking (OWNER)               |
| PATCH  | `/bookings/{id}/cancel`                     | Huỷ booking (OWNER)               |
| PATCH  | `/bookings/{id}/admin-cancel`               | Huỷ booking (ADMIN)               |

---

### 💬 Comment

| Method | Endpoint                     | Mô tả                             |
| ------ | ---------------------------- | --------------------------------- |
| GET    | `/comments/by-room/{roomId}` | Comment theo phòng (Public)       |
| GET    | `/comments/by-user/{userId}` | Comment theo user (OWNER / ADMIN) |
| POST   | `/comments`                  | Tạo comment                       |
| PATCH  | `/comments/{id}`             | Cập nhật comment                  |
| DELETE | `/comments/{id}`             | Xoá comment                       |

---

### ⭐ Saved Rooms

| Method | Endpoint             | Mô tả                  |
| ------ | -------------------- | ---------------------- |
| GET    | `/saved-room`        | Danh sách phòng đã lưu |
| POST   | `/saved-room/save`   | Lưu phòng              |
| DELETE | `/saved-room/unsave` | Bỏ lưu phòng           |

---

### 🔍 Search

| Method | Endpoint            | Mô tả             |
| ------ | ------------------- | ----------------- |
| GET    | `/search-app?text=` | Tìm kiếm tổng hợp |

---

## ⚠️ Lưu ý

- Các API **ngoại trừ Public** đều yêu cầu access token hợp lệ
- Có kiểm tra **role & ownership** trước khi thao tác
- API phục vụ mục đích **học tập / demo / capstone**

---

## 👨‍🎓 Sinh viên thực hiện

**voniemanh**
Capstone: **NestJS – Cuối khoá**
