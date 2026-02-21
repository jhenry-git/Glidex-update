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

// Eager load HomePage (initial route)
import HomePage from '@/pages/HomePage';

// Lazy load marketplace pages to keep landing page fast
const ListingsPage = lazy(() => import('@/pages/ListingsPage'));
const CarDetailPage = lazy(() => import('@/pages/CarDetailPage'));
const HostDashboard = lazy(() => import('@/components/dashboard/HostDashboard'));

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
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/listings" element={<ListingsPage />} />
          <Route path="/car/:id" element={<CarDetailPage />} />
          <Route path="/dashboard" element={<HostDashboard />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
