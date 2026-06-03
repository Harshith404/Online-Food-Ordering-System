import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { restaurantService } from '../../services/restaurantService';
import { orderService } from '../../services/orderService';
import OrderTable from '../../components/admin/OrderTable';
import Loader from '../../components/common/Loader';
import { MdReceiptLong } from 'react-icons/md';

const ManageOrders = () => {
  const { currentUser } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'past'

  useEffect(() => {
    if (!currentUser) return;
    
    let unsubscribeFn;
    const loadData = async () => {
      try {
        const resData = await restaurantService.getRestaurantByOwnerId(currentUser.uid);
        if (resData) {
          setRestaurant(resData);
          unsubscribeFn = orderService.subscribeToRestaurantOrders(resData.id, (data) => {
            setOrders(data);
            setLoading(false);
          });
        }
      } catch (error) {
        console.error("Error loading restaurant order details", error);
        setLoading(false);
      }
    };
    
    loadData();
    
    return () => {
      if (unsubscribeFn) unsubscribeFn();
    };
  }, [currentUser]);

  const handleStatusUpdate = async (orderId, nextStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, nextStatus);
    } catch (error) {
      console.error("Error updating order status", error);
      alert("Failed to update status.");
    }
  };

  if (loading) return <Loader fullPage />;

  const filteredOrders = orders.filter((order) => {
    const isActive = ['pending', 'accepted', 'preparing', 'out_for_delivery'].includes(order.status);
    return activeTab === 'active' ? isActive : !isActive;
  });

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Order Logs
          </span>
          <h1 className="font-display text-2xl font-black text-slate-800 mt-1 flex items-center gap-2">
            <MdReceiptLong className="text-primary-500" />
            Manage Incoming Orders
          </h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 gap-6">
        <button
          onClick={() => setActiveTab('active')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'active'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Active Orders ({orders.filter(o => ['pending', 'accepted', 'preparing', 'out_for_delivery'].includes(o.status)).length})
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'past'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Past Orders ({orders.filter(o => ['delivered', 'cancelled'].includes(o.status)).length})
        </button>
      </div>

      {/* Table List */}
      <OrderTable orders={filteredOrders} onStatusUpdate={handleStatusUpdate} />
    </div>
  );
};

export default ManageOrders;
