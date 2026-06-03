import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { restaurantService } from '../../services/restaurantService';
import { orderService } from '../../services/orderService';
import DashboardStats from '../../components/admin/DashboardStats';
import OrderTable from '../../components/admin/OrderTable';
import Loader from '../../components/common/Loader';
import { MdStore } from 'react-icons/md';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return;

    let unsubscribeFn;
    const loadAdminData = async () => {
      try {
        const resData = await restaurantService.getRestaurantByOwnerId(currentUser.uid);
        if (resData) {
          setRestaurant(resData);
          
          // Subscribe to restaurant orders
          unsubscribeFn = orderService.subscribeToRestaurantOrders(resData.id, (orderList) => {
            setOrders(orderList);
            setLoading(false);
          });
        } else {
          // No restaurant found, redirect to profile to create/verify
          setLoading(false);
          navigate('/admin/profile');
        }
      } catch (error) {
        console.error("Error loading admin dashboard details", error);
        setLoading(false);
      }
    };

    loadAdminData();

    return () => {
      if (unsubscribeFn) unsubscribeFn();
    };
  }, [currentUser, navigate]);

  const handleStatusUpdate = async (orderId, nextStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, nextStatus);
    } catch (error) {
      console.error("Error updating order status", error);
      alert("Failed to update status.");
    }
  };

  if (loading) return <Loader fullPage />;

  const activeOrders = orders.filter(
    (order) => ['pending', 'accepted', 'preparing', 'out_for_delivery'].includes(order.status)
  );

  return (
    <div className="space-y-8 pb-24">
      {/* Restaurant Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Restaurant Admin Panel
          </span>
          <h1 className="font-display text-2xl font-black text-slate-800 mt-1 flex items-center gap-2">
            <MdStore className="text-primary-500" />
            {restaurant?.name}
          </h1>
        </div>

        <Link
          to="/admin/profile"
          className="rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 text-xs font-bold transition-colors"
        >
          Edit Restaurant Profile
        </Link>
      </div>

      {/* Dashboard Metrics */}
      <DashboardStats orders={orders} />

      {/* Active Orders List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-slate-800">
            Active Orders ({activeOrders.length})
          </h2>
          <Link
            to="/admin/orders"
            className="text-xs font-bold text-primary-500 hover:text-primary-600 hover:underline"
          >
            Manage All Orders
          </Link>
        </div>

        <OrderTable orders={activeOrders} onStatusUpdate={handleStatusUpdate} />
      </div>
    </div>
  );
};

export default AdminDashboard;
