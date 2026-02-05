AUTH
POST auth/signup Đăng ký
POST auth/signin Đăng nhập → trả JWT
POST auth/refresh-token
GET auth/google
GET auth/google-callback

USER
GET users JWT (ADMIN)
GET users/me (jwt)
POST users JWT (ADMIN)
DELETE users/{id} JWT (ADMIN)
GET users/{id} JWT
PATCH users/{id} JWT
GET users/search?keyword= JWT (ADMIN)
POST users/upload-avatar JWT

ROOM
GET rooms Public
GET rooms/by-location/{locationId} Public
GET rooms/{id} Public
GET rooms/search/?keyword= Public
POST rooms JWT (owner)
PATCH rooms/{id} JWT (owner)
POST rooms/upload-image JWT (owner)
GET rooms/created/:userId JWT (owner/ADMIN)
GET rooms/saved/:userId JWT (owner/ADMIN)
DELETE rooms/{id} JWT (owner / ADMIN)

LOCATION
GET locations Public (filters(country, city, name))
POST locations JWT (ADMIN)
GET locations/{id} Public
PATCH locations/{id} JWT (ADMIN)
DELETE locations/{id} JWT (ADMIN)
POST locations/upload-image JWT (ADMIN)

BOOKING
GET bookings JWT (ADMIN) (filter{ status, fromto, roomId})
GET bookings/by-booking/{id} JWT (owner / ADMIN)
GET bookings/by-user/{userId} JWT (ADMIN)
GET bookings/me JWT (owner) (filter{ status, fromto, roomId})
GET bookings/availability/{roomId}/?from= & to= Public
GET bookings/calendar/{roomId} JWT
GET bookings/me/by-booking/{id} JWT
POST bookings JWT (owner)
PATCH bookings/{id}/cancel JWT (owner)
PATCH bookings/{id}/admin-cancel JWT (ADMIN)

COMMENT
GET comments/by-room/{roomId} Public
GET comments/by-user/{userId} JWT (owner / ADMIN)
POST comments JWT
PATCH comments/{id} JWT (owner / ADMIN)
DELETE comments/{id} JWT (owner / ADMIN)

SAVED-ROOMS
GET saved-room JWT
POST saved-room/save JWT
DELETE saved-room/unsave JWT

SEARCH

GET search-app/?text= ()

=========Booking flow=======

[Start Booking]
|
v
[Check Room Exists] --❌-> [Error: Room Not Found]
|
v
[Acquire Lock] (20s)
|
v
[Inside Lock]
|
+--> [Assert Room Available] --❌-> [Error: Room Not Available]
|
+--> [Calculate Total Price]
|
+--> [Start DB Transaction]
|
+--> [Create Booking Record]
|
+--> [Create Booking Log]
|
+--> [Return Booking + TotalPrice]
|
v
[Release Lock]
|
v
[End Booking]
