export const TTL = {
  LOCATION_LIST: 30 * 60,
  LOCATION_DETAIL: 30 * 60,
  ROOM_LIST: 60,
  ROOM_DETAIL: 10 * 60,
  USER_ME: 15,
  USER_PUBLIC: 60,
};
export const ttlMs = (seconds: number) => seconds * 1000;
