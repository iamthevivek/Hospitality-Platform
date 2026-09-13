import axios from 'axios';

let getTokenFn = null;
export const setAuthTokenGetter = (fn) => { getTokenFn = fn; };

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
});

api.interceptors.request.use(async (config) => {
  // Do NOT attach Bearer token to public endpoints or auth endpoints
  const isPublic = config.url?.startsWith('/api/public');
  const isAuth = config.url?.startsWith('/api/auth');
  if (!isPublic && !isAuth) {
    try {
      let token = null;
      if (getTokenFn) {
        token = await getTokenFn();
      }
      if (!token) {
        token = localStorage.getItem('stayease_token');
      }
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // Not signed in — proceed without token
    }
  }
  return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized — session expired or token invalid');
    }
    return Promise.reject(error);
  }
);

// Helper to safely extract payload from ApiResponse<T>
const unwrap = (res) => res.data?.data !== undefined ? res.data.data : res.data;
const unwrapList = (res) => {
  const d = res.data?.data !== undefined ? res.data.data : res.data;
  return d?.content !== undefined ? d.content : (Array.isArray(d) ? d : []);
};

// ─── Public: Hotels ───────────────────────────────────────────
export const getHotels = (params) =>
  api.get('/api/public/hotels', { params }).then(unwrapList);

export const getHotelById = (id) =>
  api.get(`/api/public/hotels/${id}`).then(unwrap);

export const searchHotels = (params) =>
  api.get('/api/public/hotels/search', { params }).then(unwrapList);

export const getAvailableRooms = (hotelId, params) =>
  api.get(`/api/public/hotels/${hotelId}/rooms/available`, { params }).then(unwrapList);

export const getHotelReviews = (hotelId) =>
  api.get(`/api/public/hotels/${hotelId}/reviews`).then(unwrapList);

export const sendAiChat = (message, history = []) =>
  api.post('/api/public/ai/chat', { message, history }).then(unwrap);

// ─── Authenticated: Bookings ──────────────────────────────────
export const createBooking = (data) =>
  api.post('/api/bookings', data).then(unwrap);

export const getMyBookings = () =>
  api.get('/api/bookings/my').then(unwrapList);

export const getBookingById = (id) =>
  api.get(`/api/bookings/${id}`).then(unwrap);

export const cancelBooking = (id) =>
  api.put(`/api/bookings/${id}/cancel`).then(unwrap);

// ─── Authenticated: Payments ──────────────────────────────────
export const createPaymentIntent = (bookingId) =>
  api.post('/api/payments/create-intent', { bookingId }).then(unwrap);

export const confirmDemoPayment = (bookingId) =>
  api.post(`/api/payments/confirm-demo/${bookingId}`).then(unwrap);

// ─── Authenticated: Reviews ───────────────────────────────────
export const createReview = (data) =>
  api.post('/api/reviews', data).then(unwrap);

export const deleteReview = (reviewId) =>
  api.delete(`/api/reviews/${reviewId}`).then(unwrap);

// ─── Authenticated: Users ─────────────────────────────────────
export const getProfile = () =>
  api.get('/api/users/me').then(unwrap);

export const updateProfile = (data) =>
  api.put('/api/users/me', data).then(unwrap);

// ─── Admin ────────────────────────────────────────────────────
export const adminGetAnalytics = () =>
  api.get('/api/admin/analytics').then(unwrap);

export const adminCreateHotel = (data) =>
  api.post('/api/admin/hotels', data).then(unwrap);

export const adminUpdateHotel = (id, data) =>
  api.put(`/api/admin/hotels/${id}`, data).then(unwrap);

export const adminDeleteHotel = (id) =>
  api.delete(`/api/admin/hotels/${id}`).then(unwrap);

export const adminAddRoom = (data) =>
  api.post('/api/admin/rooms', data).then(unwrap);

export const adminUpdateRoom = (id, data) =>
  api.put(`/api/admin/rooms/${id}`, data).then(unwrap);

export const adminDeleteRoom = (id) =>
  api.delete(`/api/admin/rooms/${id}`).then(unwrap);

export const adminGetBookings = (params) =>
  api.get('/api/admin/bookings', { params }).then(unwrapList);

export const adminUpdateBookingStatus = (id, data) =>
  api.put(`/api/admin/bookings/${id}/status`, data).then(unwrap);

// ─── Native Authentication ────────────────────────────────────
export const authLogin = (data) =>
  api.post('/api/auth/login', data).then(unwrap);

export const authRegister = (data) =>
  api.post('/api/auth/register', data).then(unwrap);

export const authGetMe = () =>
  api.get('/api/auth/me').then(unwrap);

export const authLogout = () =>
  api.post('/api/auth/logout').then(unwrap);

export default api;

