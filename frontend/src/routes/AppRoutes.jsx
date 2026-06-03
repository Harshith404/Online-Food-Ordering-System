import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';
import useAuth from '../hooks/useAuth';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Customer Pages
import Home from '../pages/customer/Home';
import RestaurantMenu from '../pages/customer/RestaurantMenu';
import Cart from '../pages/customer/Cart';
import Checkout from '../pages/customer/Checkout';
import OrderHistory from '../pages/customer/OrderHistory';
import TrackOrder from '../pages/customer/TrackOrder';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageMenu from '../pages/admin/ManageMenu';
import ManageOrders from '../pages/admin/ManageOrders';
import RestaurantProfile from '../pages/admin/RestaurantProfile';

// Delivery Pages
import DeliveryDashboard from '../pages/delivery/DeliveryDashboard';
import DeliveryHistory from '../pages/delivery/DeliveryHistory';

const AppRoutes = () => {
  const { currentUser } = useAuth();

  return (
    <Routes>
      {/* Auth routes */}
      <Route 
        path="/login" 
        element={currentUser ? <Navigate to={currentUser.role === 'admin' ? '/admin' : currentUser.role === 'delivery' ? '/delivery' : '/'} replace /> : <Login />} 
      />
      <Route 
        path="/register" 
        element={currentUser ? <Navigate to={currentUser.role === 'admin' ? '/admin' : currentUser.role === 'delivery' ? '/delivery' : '/'} replace /> : <Register />} 
      />

      {/* Customer routes */}
      <Route path="/" element={
        <ProtectedRoute allowedRoles={['customer']}>
          <Home />
        </ProtectedRoute>
      } />
      <Route path="/restaurant/:id" element={
        <ProtectedRoute allowedRoles={['customer']}>
          <RestaurantMenu />
        </ProtectedRoute>
      } />
      <Route path="/cart" element={
        <ProtectedRoute allowedRoles={['customer']}>
          <Cart />
        </ProtectedRoute>
      } />
      <Route path="/checkout" element={
        <ProtectedRoute allowedRoles={['customer']}>
          <Checkout />
        </ProtectedRoute>
      } />
      <Route path="/orders" element={
        <ProtectedRoute allowedRoles={['customer']}>
          <OrderHistory />
        </ProtectedRoute>
      } />
      <Route path="/track/:id" element={
        <ProtectedRoute allowedRoles={['customer']}>
          <TrackOrder />
        </ProtectedRoute>
      } />

      {/* Admin routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/menu" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <ManageMenu />
        </ProtectedRoute>
      } />
      <Route path="/admin/orders" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <ManageOrders />
        </ProtectedRoute>
      } />
      <Route path="/admin/profile" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <RestaurantProfile />
        </ProtectedRoute>
      } />

      {/* Delivery routes */}
      <Route path="/delivery" element={
        <ProtectedRoute allowedRoles={['delivery']}>
          <DeliveryDashboard />
        </ProtectedRoute>
      } />
      <Route path="/delivery/history" element={
        <ProtectedRoute allowedRoles={['delivery']}>
          <DeliveryHistory />
        </ProtectedRoute>
      } />

      {/* Fallback */}
      <Route 
        path="*" 
        element={<Navigate to={currentUser ? (currentUser.role === 'admin' ? '/admin' : currentUser.role === 'delivery' ? '/delivery' : '/') : '/login'} replace />} 
      />
    </Routes>
  );
};

export default AppRoutes;
