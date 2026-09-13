import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  BarChart3, Hotel, BedDouble, Calendar, DollarSign,
  Plus, Pencil, Trash2, X, Loader2, TrendingUp
} from 'lucide-react';
import {
  adminGetAnalytics, adminGetBookings, adminCreateHotel,
  adminUpdateHotel, adminDeleteHotel, adminAddRoom,
  adminUpdateBookingStatus, getHotels
} from '../lib/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import BookingStatusBadge from '../components/common/BookingStatusBadge';
import toast from 'react-hot-toast';

const hotelSchema = z.object({
  name: z.string().min(2, 'Name required'),
  description: z.string().optional(),
  city: z.string().min(1, 'City required'),
  country: z.string().min(1, 'Country required'),
  address: z.string().optional(),
  starRating: z.coerce.number().min(1).max(5),
  priceFrom: z.coerce.number().min(1, 'Price required'),
  amenities: z.string().optional(),
  imageUrls: z.string().optional(),
});

const roomSchema = z.object({
  hotelId: z.coerce.number().min(1, 'Hotel required'),
  roomNumber: z.string().min(1, 'Room number required'),
  type: z.enum(['SINGLE', 'DOUBLE', 'SUITE', 'DELUXE']),
  pricePerNight: z.coerce.number().min(1, 'Price required'),
  maxOccupancy: z.coerce.number().min(1).max(20),
  description: z.string().optional(),
  amenities: z.string().optional(),
});

const TABS = ['Analytics', 'Hotels', 'Rooms', 'Bookings'];

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
      <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('Analytics');
  const [showHotelModal, setShowHotelModal] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const queryClient = useQueryClient();

  // Analytics
  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: adminGetAnalytics,
    enabled: activeTab === 'Analytics',
  });

  // Hotels
  const { data: hotelsData, isLoading: hotelsLoading } = useQuery({
    queryKey: ['admin-hotels'],
    queryFn: () => getHotels({ page: 0, size: 50 }),
    enabled: activeTab === 'Hotels' || activeTab === 'Rooms',
  });

  // Bookings
  const { data: bookingsData, isLoading: bookingsLoading } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: () => adminGetBookings({ page: 0, size: 50 }),
    enabled: activeTab === 'Bookings',
  });

  // Hotel form
  const hotelForm = useForm({ resolver: zodResolver(hotelSchema) });
  const roomForm = useForm({ resolver: zodResolver(roomSchema) });

  const createHotelMutation = useMutation({
    mutationFn: (data) => adminCreateHotel({
      ...data,
      imageUrls: data.imageUrls ? data.imageUrls.split(',').map(s => s.trim()) : [],
      amenities: data.amenities ? data.amenities.split(',').map(s => s.trim()) : [],
    }),
    onSuccess: () => {
      toast.success('Hotel created!');
      queryClient.invalidateQueries({ queryKey: ['admin-hotels'] });
      setShowHotelModal(false);
      hotelForm.reset();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create hotel'),
  });

  const updateHotelMutation = useMutation({
    mutationFn: ({ id, data }) => adminUpdateHotel(id, {
      ...data,
      imageUrls: data.imageUrls ? data.imageUrls.split(',').map(s => s.trim()) : [],
      amenities: data.amenities ? data.amenities.split(',').map(s => s.trim()) : [],
    }),
    onSuccess: () => {
      toast.success('Hotel updated!');
      queryClient.invalidateQueries({ queryKey: ['admin-hotels'] });
      setShowHotelModal(false);
      setEditingHotel(null);
      hotelForm.reset();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update hotel'),
  });

  const deleteHotelMutation = useMutation({
    mutationFn: (id) => adminDeleteHotel(id),
    onSuccess: () => {
      toast.success('Hotel deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-hotels'] });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete hotel'),
  });

  const createRoomMutation = useMutation({
    mutationFn: (data) => adminAddRoom({
      ...data,
      amenities: data.amenities ? data.amenities.split(',').map(s => s.trim()) : [],
    }),
    onSuccess: () => {
      toast.success('Room added!');
      setShowRoomModal(false);
      roomForm.reset();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to add room'),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => adminUpdateBookingStatus(id, { status }),
    onSuccess: () => {
      toast.success('Status updated');
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
    },
    onError: (err) => toast.error('Failed to update status'),
  });

  const analytics = analyticsData?.data || analyticsData;
  const hotels = Array.isArray(hotelsData) ? hotelsData : (hotelsData?.data?.content || hotelsData?.content || []);
  const bookings = Array.isArray(bookingsData) ? bookingsData : (bookingsData?.data?.content || bookingsData?.content || []);

  const onHotelSubmit = (data) => {
    if (editingHotel) {
      updateHotelMutation.mutate({ id: editingHotel.id, data });
    } else {
      createHotelMutation.mutate(data);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage your hospitality platform</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg mb-8 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* === ANALYTICS TAB === */}
      {activeTab === 'Analytics' && (
        analyticsLoading ? <LoadingSpinner /> : (
          <div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard icon={DollarSign} label="Total Revenue" value={`$${Number(analytics?.totalRevenue || 0).toLocaleString()}`} color="bg-green-500" />
              <StatCard icon={Calendar} label="Total Bookings" value={analytics?.totalBookings || 0} color="bg-indigo-500" />
              <StatCard icon={Hotel} label="Total Hotels" value={analytics?.totalHotels || 0} color="bg-purple-500" />
              <StatCard icon={BedDouble} label="Total Rooms" value={analytics?.totalRooms || 0} color="bg-amber-500" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl border border-gray-100 p-6 text-center">
                <p className="text-3xl font-bold text-green-600">{analytics?.confirmedBookings || 0}</p>
                <p className="text-gray-500 mt-1">Confirmed Bookings</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-6 text-center">
                <p className="text-3xl font-bold text-yellow-600">{analytics?.pendingBookings || 0}</p>
                <p className="text-gray-500 mt-1">Pending Bookings</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-6 text-center">
                <p className="text-3xl font-bold text-red-600">{analytics?.cancelledBookings || 0}</p>
                <p className="text-gray-500 mt-1">Cancelled Bookings</p>
              </div>
            </div>
          </div>
        )
      )}

      {/* === HOTELS TAB === */}
      {activeTab === 'Hotels' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Hotels ({hotels.length})</h2>
            <button
              onClick={() => { setEditingHotel(null); hotelForm.reset(); setShowHotelModal(true); }}
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
              <Plus className="h-4 w-4" />
              Add Hotel
            </button>
          </div>
          {hotelsLoading ? <LoadingSpinner /> : (
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">Hotel</th>
                    <th className="px-4 py-3 text-left">City</th>
                    <th className="px-4 py-3 text-left">Stars</th>
                    <th className="px-4 py-3 text-left">Price From</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {hotels.map((hotel) => (
                    <tr key={hotel.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{hotel.name}</td>
                      <td className="px-4 py-3 text-gray-600">{hotel.city}, {hotel.country}</td>
                      <td className="px-4 py-3 text-gray-600">{'⭐'.repeat(hotel.starRating)}</td>
                      <td className="px-4 py-3 text-gray-600">${hotel.priceFrom}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingHotel(hotel);
                              hotelForm.reset({
                                ...hotel,
                                amenities: hotel.amenities?.join(', '),
                                imageUrls: hotel.imageUrls?.join(', '),
                              });
                              setShowHotelModal(true);
                            }}
                            className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Delete this hotel?')) deleteHotelMutation.mutate(hotel.id);
                            }}
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {hotels.length === 0 && (
                <div className="py-12 text-center text-gray-500">No hotels yet. Add one!</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* === ROOMS TAB === */}
      {activeTab === 'Rooms' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Add Room</h2>
            <button
              onClick={() => { roomForm.reset(); setShowRoomModal(true); }}
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
              <Plus className="h-4 w-4" />
              Add Room
            </button>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-500">
            <BedDouble className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>Use the "Add Room" button to add rooms to existing hotels.</p>
          </div>
        </div>
      )}

      {/* === BOOKINGS TAB === */}
      {activeTab === 'Bookings' && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">All Bookings ({bookings.length})</h2>
          {bookingsLoading ? <LoadingSpinner /> : (
            <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">ID</th>
                    <th className="px-4 py-3 text-left">Hotel / Room</th>
                    <th className="px-4 py-3 text-left">Dates</th>
                    <th className="px-4 py-3 text-left">Amount</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-500">#{booking.id}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{booking.hotelName}</p>
                        <p className="text-gray-500 text-xs">Room {booking.roomNumber}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        <p>{booking.checkInDate}</p>
                        <p className="text-xs text-gray-400">to {booking.checkOutDate}</p>
                      </td>
                      <td className="px-4 py-3 font-medium">${booking.totalAmount}</td>
                      <td className="px-4 py-3"><BookingStatusBadge status={booking.status} /></td>
                      <td className="px-4 py-3">
                        <select
                          value={booking.status}
                          onChange={(e) => updateStatusMutation.mutate({ id: booking.id, status: e.target.value })}
                          className="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                          {['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'].map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {bookings.length === 0 && (
                <div className="py-12 text-center text-gray-500">No bookings yet.</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Hotel Modal */}
      {showHotelModal && (
        <Modal title={editingHotel ? 'Edit Hotel' : 'Add Hotel'} onClose={() => { setShowHotelModal(false); setEditingHotel(null); }}>
          <form onSubmit={hotelForm.handleSubmit(onHotelSubmit)} className="space-y-4">
            {[
              { name: 'name', label: 'Hotel Name', type: 'text', placeholder: 'Grand Hotel' },
              { name: 'city', label: 'City', type: 'text', placeholder: 'New York' },
              { name: 'country', label: 'Country', type: 'text', placeholder: 'United States' },
              { name: 'address', label: 'Address', type: 'text', placeholder: '123 Main St' },
              { name: 'starRating', label: 'Star Rating (1-5)', type: 'number', placeholder: '4' },
              { name: 'priceFrom', label: 'Price From ($)', type: 'number', placeholder: '150' },
              { name: 'amenities', label: 'Amenities (comma-separated)', type: 'text', placeholder: 'WiFi, Pool, Gym' },
              { name: 'imageUrls', label: 'Image URLs (comma-separated)', type: 'text', placeholder: 'https://...' },
            ].map(({ name, label, type, placeholder }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input
                  type={type}
                  placeholder={placeholder}
                  {...hotelForm.register(name)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {hotelForm.formState.errors[name] && (
                  <p className="text-red-500 text-xs mt-1">{hotelForm.formState.errors[name].message}</p>
                )}
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                {...hotelForm.register('description')}
                rows={3}
                placeholder="A beautiful hotel..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={createHotelMutation.isPending || updateHotelMutation.isPending}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {(createHotelMutation.isPending || updateHotelMutation.isPending) && <Loader2 className="h-4 w-4 animate-spin" />}
              {editingHotel ? 'Update Hotel' : 'Create Hotel'}
            </button>
          </form>
        </Modal>
      )}

      {/* Room Modal */}
      {showRoomModal && (
        <Modal title="Add Room" onClose={() => setShowRoomModal(false)}>
          <form onSubmit={roomForm.handleSubmit((d) => createRoomMutation.mutate(d))} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hotel</label>
              <select
                {...roomForm.register('hotelId')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select hotel...</option>
                {hotels.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
              </select>
              {roomForm.formState.errors.hotelId && (
                <p className="text-red-500 text-xs mt-1">{roomForm.formState.errors.hotelId.message}</p>
              )}
            </div>
            {[
              { name: 'roomNumber', label: 'Room Number', type: 'text', placeholder: '101' },
              { name: 'pricePerNight', label: 'Price per Night ($)', type: 'number', placeholder: '150' },
              { name: 'maxOccupancy', label: 'Max Occupancy', type: 'number', placeholder: '2' },
              { name: 'description', label: 'Description', type: 'text', placeholder: 'Cozy room...' },
              { name: 'amenities', label: 'Amenities (comma-separated)', type: 'text', placeholder: 'WiFi, TV, Safe' },
            ].map(({ name, label, type, placeholder }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input
                  type={type}
                  placeholder={placeholder}
                  {...roomForm.register(name)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
              <select
                {...roomForm.register('type')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="SINGLE">Single</option>
                <option value="DOUBLE">Double</option>
                <option value="SUITE">Suite</option>
                <option value="DELUXE">Deluxe</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={createRoomMutation.isPending}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {createRoomMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Add Room
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
