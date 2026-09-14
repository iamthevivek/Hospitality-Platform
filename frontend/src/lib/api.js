import axios from 'axios';

let getTokenFn = null;
export const setAuthTokenGetter = (fn) => { getTokenFn = fn; };

export const resolveBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.API_BASE_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    return envUrl.trim().replace(/\/+$/, '');
  }
  // When running on Vercel preview or production, default directly to the live Render backend
  if (typeof window !== 'undefined' && window.location.hostname && window.location.hostname.includes('vercel.app')) {
    return 'https://hospitality-platform-xjq9.onrender.com';
  }
  return 'http://localhost:8080';
};

const api = axios.create({
  baseURL: resolveBaseUrl(),
});

api.interceptors.request.use(async (config) => {
  if (!config.baseURL || config.baseURL === 'http://localhost:8080') {
    config.baseURL = resolveBaseUrl();
  }
  // Skip Bearer token ONLY for public or login/register endpoints
  const isPublic = config.url?.startsWith('/api/public');
  const isLoginOrRegister = config.url?.includes('/api/auth/login') || config.url?.includes('/api/auth/register');
  if (!isPublic && !isLoginOrRegister) {
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

// ─── Bookings ─────────────────────────────────────────────────
export const createBooking = (data) =>
  api.post('/api/bookings', data).then(unwrap);

export const getMyBookings = () =>
  api.get('/api/bookings/my').then(unwrapList);

export const getBookingById = (id) =>
  api.get(`/api/bookings/${id}`).then(unwrap);

export const cancelBooking = (id) =>
  api.put(`/api/bookings/${id}/cancel`).then(unwrap);

// ─── Payments ─────────────────────────────────────────────────
export const createPaymentIntent = (data) => {
  const payload = typeof data === 'object' ? data : { bookingId: data };
  return api.post('/api/payments/create-intent', payload).then(unwrap);
};

export const confirmDemoPayment = (data) => {
  const bookingId = typeof data === 'object' ? (data.bookingId || data.id) : data;
  return api.post(`/api/payments/confirm-demo/${bookingId}`).then(unwrap);
};

// ─── Reviews ──────────────────────────────────────────────────
export const createReview = (data) =>
  api.post('/api/reviews', data).then(unwrap);

export const deleteReview = (id) =>
  api.delete(`/api/reviews/${id}`).then(unwrap);

// ─── User Profile ─────────────────────────────────────────────
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

// ─── AI Concierge ─────────────────────────────────────────────
export const sendAiChat = (message, history) =>
  api.post('/api/public/ai/chat', { message, history }).then(unwrap);

export default api;
