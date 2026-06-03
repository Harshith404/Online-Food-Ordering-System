import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { orderService } from '../../services/orderService';
import DeliveryCard from '../../components/delivery/DeliveryCard';
import Loader from '../../components/common/Loader';
import { MdDeliveryDining, MdAssignment } from 'react-icons/md';

const DeliveryDashboard = () => {
  const { currentUser } = useAuth();
  const [availableOrders, setAvailableOrders] = useState([]);
  const [assignedOrders, setAssignedOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    // Listen to available unclaimed orders
    const unsubscribeAvailable = orderService.subscribeToAvailableDeliveries((data) => {
      setAvailableOrders(data);
      setLoading(false);
    });

    // Listen to orders assigned to this agent
    const unsubscribeAssigned = orderService.subscribeToAgentDeliveries(currentUser.uid, (data) => {
      setAssignedOrders(data);
    });

    return () => {
      unsubscribeAvailable();
      unsubscribeAssigned();
    };
  }, [currentUser]);

  const handleClaim = async (orderId) => {
    try {
      await orderService.claimDelivery(orderId, currentUser.uid);
    } catch (error) {
      console.error("Error claiming delivery", error);
      alert("Failed to claim delivery. It may have already been claimed by another rider.");
    }
  };

  const handleComplete = async (orderId) => {
    try {
      await orderService.updateOrderStatus(orderId, 'delivered');
    } catch (error) {
      console.error("Error completing delivery", error);
      alert("Failed to update delivery status.");
    }
  };

  if (loading) return <Loader fullPage />;

  // Filter active delivery items
  const activeDeliveries = assignedOrders.filter(
    (order) => order.status === 'out_for_delivery'
  );

  return (
    <div className="space-y-8 pb-24">
      {/* Title Header */}
      <div className="pb-4 border-b border-slate-100">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Delivery Console
        </span>
        <h1 className="font-display text-2xl font-black text-slate-800 mt-1 flex items-center gap-2">
          <MdDeliveryDining className="text-primary-500" size={28} />
          Rider Delivery Dashboard
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Active Deliveries */}
        <div className="space-y-4">
          <h2 className="font-display text-lg font-bold text-slate-800 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-500 animate-ping"></span>
            My Active Shipments ({activeDeliveries.length})
          </h2>
          
          {activeDeliveries.length > 0 ? (
            <div className="space-y-4">
              {activeDeliveries.map((order) => (
                <DeliveryCard
                  key={order.id}
                  order={order}
                  onComplete={handleComplete}
                  agentId={currentUser.uid}
                />
              ))}
            </div>
          ) : (
            <p className="p-8 text-center text-sm font-medium text-slate-400 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
              You don't have any active deliveries. Claim an order below to start!
            </p>
          )}
        </div>

        {/* Claimable Deliveries */}
        <div className="space-y-4">
          <h2 className="font-display text-lg font-bold text-slate-800 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
            Orders Ready to Ship ({availableOrders.length})
          </h2>
          
          {availableOrders.length > 0 ? (
            <div className="space-y-4">
              {availableOrders.map((order) => (
                <DeliveryCard
                  key={order.id}
                  order={order}
                  onClaim={handleClaim}
                  agentId={currentUser.uid}
                />
              ))}
            </div>
          ) : (
            <p className="p-8 text-center text-sm font-medium text-slate-400 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
              No new orders available to claim right now. Check back shortly!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryDashboard;
