import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { orderService } from '../../services/orderService';
import DeliveryCard from '../../components/delivery/DeliveryCard';
import Loader from '../../components/common/Loader';
import { MdHistory } from 'react-icons/md';

const DeliveryHistory = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    const unsubscribe = orderService.subscribeToAgentDeliveries(currentUser.uid, (data) => {
      setOrders(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [currentUser]);

  if (loading) return <Loader fullPage />;

  const completedDeliveries = orders.filter((order) => order.status === 'delivered');

  return (
    <div className="space-y-6 pb-24">
      {/* Title Header */}
      <div className="pb-4 border-b border-slate-100">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Logs
        </span>
        <h1 className="font-display text-2xl font-black text-slate-800 mt-1 flex items-center gap-2">
          <MdHistory className="text-primary-500" />
          Rider Delivery History
        </h1>
      </div>

      {/* List */}
      {completedDeliveries.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {completedDeliveries.map((order) => (
            <DeliveryCard
              key={order.id}
              order={order}
              agentId={currentUser.uid}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-16 text-center space-y-3 rounded-2xl border border-slate-100 bg-white shadow-sm">
          <span className="text-4xl">📦</span>
          <h3 className="font-display text-lg font-bold text-slate-800">No Delivery History</h3>
          <p className="text-sm text-slate-400 max-w-xs">
            You haven't completed any deliveries yet. Active shipments will appear here once delivered.
          </p>
        </div>
      )}
    </div>
  );
};

export default DeliveryHistory;
