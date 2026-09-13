import { Routes, Route } from 'react-router-dom';
import { useAuth, useUser } from './lib/auth';
import { useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import HotelsPage from './pages/HotelsPage';
import HotelDetailPage from './pages/HotelDetailPage';
import BookingPage from './pages/BookingPage';
import BookingConfirmPage from './pages/BookingConfirmPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import NotFoundPage from './pages/NotFoundPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import HelpCenterPage from './pages/HelpCenterPage';
import CareersPage from './pages/CareersPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import CancellationPolicyPage from './pages/CancellationPolicyPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
import CustomerRoute from './components/auth/CustomerRoute';
import ChatAssistant from './components/chatbot/ChatAssistant';
import ScrollToTop from './components/common/ScrollToTop';
import { setAuthTokenGetter } from './lib/api';

export default function App() {
  const { getToken, isSignedIn } = useAuth();
  const { user } = useUser();
  const isAdmin = isSignedIn && (user?.role === 'ADMIN' || user?.publicMetadata?.role === 'ADMIN' || localStorage.getItem('role') === 'ADMIN');
  
  useEffect(() => {
    setAuthTokenGetter(getToken);
  }, [getToken]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<CustomerRoute><HomePage /></CustomerRoute>} />
          <Route path="/hotels" element={<CustomerRoute><HotelsPage /></CustomerRoute>} />
          <Route path="/hotels/:id" element={<CustomerRoute><HotelDetailPage /></CustomerRoute>} />
          <Route path="/book/:roomId" element={<CustomerRoute><ProtectedRoute><BookingPage /></ProtectedRoute></CustomerRoute>} />
          <Route path="/booking/confirm" element={<CustomerRoute><ProtectedRoute><BookingConfirmPage /></ProtectedRoute></CustomerRoute>} />
          <Route path="/dashboard" element={<CustomerRoute><ProtectedRoute><DashboardPage /></ProtectedRoute></CustomerRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
          <Route path="/about" element={<CustomerRoute><AboutPage /></CustomerRoute>} />
          <Route path="/contact" element={<CustomerRoute><ContactPage /></CustomerRoute>} />
          <Route path="/help" element={<CustomerRoute><HelpCenterPage /></CustomerRoute>} />
          <Route path="/careers" element={<CustomerRoute><CareersPage /></CustomerRoute>} />
          <Route path="/privacy" element={<CustomerRoute><PrivacyPolicyPage /></CustomerRoute>} />
          <Route path="/terms" element={<CustomerRoute><TermsPage /></CustomerRoute>} />
          <Route path="/cancellation-policy" element={<CustomerRoute><CancellationPolicyPage /></CustomerRoute>} />
          <Route path="/sign-in/*" element={<CustomerRoute><SignInPage /></CustomerRoute>} />
          <Route path="/sign-up/*" element={<CustomerRoute><SignUpPage /></CustomerRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {!isAdmin ? (
        <>
          <Footer />
          <ChatAssistant />
        </>
      ) : (
        <footer className="py-4 text-center text-xs text-gray-400 bg-white border-t border-gray-100">
          StayEase Admin Console • Authorized Administrator Access Only
        </footer>
      )}
    </div>
  );
}
