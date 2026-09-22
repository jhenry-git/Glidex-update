/**
 * App.tsx — Root router for the GlideX website.
 * 
 * Routes:
 *   /           → HomePage (GSAP landing page)
 *   /listings   → ListingsPage (live car marketplace)
 *   /car/:id    → CarDetailPage (single car detail)
 *   /dashboard  → HostDashboard (render pipeline / marketing studio)
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

import { SmartAppBanner } from '@/components/SmartAppBanner';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';

// Lazy load all pages except HomePage for better initial load performance
const HomePage = lazy(() => import('@/pages/HomePage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const ListingsPage = lazy(() => import('@/pages/ListingsPage'));
const CarDetailPage = lazy(() => import('@/pages/CarDetailPage'));
const HostDashboard = lazy(() => import('@/components/dashboard/HostDashboard'));
const SignDocumentPage = lazy(() => import('@/pages/SignDocumentPage'));
const FounderProfilePage = lazy(() => import('@/pages/FounderProfilePage'));
const SafarisPage = lazy(() => import('@/pages/SafarisPage'));

function PageLoader() {
  return (
    <div className="min-h-screen bg-[#F4F6F8] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#D7A04D]" />
        <p className="text-sm text-gray-500">Loading…</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <SmartAppBanner />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/listings" element={<ListingsPage />} />
            <Route path="/car/:id" element={<CarDetailPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><HostDashboard /></ProtectedRoute>} />
            <Route path="/sign/:id" element={<SignDocumentPage />} />
            <Route path="/founder" element={<FounderProfilePage />} />
            <Route path="/founder-profile" element={<FounderProfilePage />} />
            <Route path="/safaris" element={<SafarisPage />} />
            <Route path="/tours" element={<SafarisPage />} />
            <Route path="/safaris-and-tours" element={<SafarisPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
