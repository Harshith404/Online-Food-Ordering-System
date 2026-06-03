import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { userService } from '../../services/userService';
import OrderStatusTracker from '../../components/customer/OrderStatusTracker';
import Loader from '../../components/common/Loader';
import { formatDate } from '../../utils/formatDate';
import { formatPrice } from '../../utils/formatPrice';
import { MdOutlineArrowBack, MdDirectionsBike, MdFastfood } from 'react-icons/md';

const TrackOrder = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = orderService.subscribeToOrderById(id, async (data) => {
      setOrder(data);
      setLoading(false);

      // Fetch driver details if assigned
      if (data && data.deliveryAgentId) {
        try {
          const agentProfile = await userService.getUserProfile(data.deliveryAgentId);
          setAgent(agentProfile);
        } catch (error) {
          console.error("Error fetching agent profile", error);
        }
      } else {
        setAgent(null);
      }
    });

    return () => unsubscribe();
  }, [id]);

  if (loading) return <Loader fullPage />;

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center">
        <h3 className="font-display text-xl font-bold text-slate-800">Order Not Found</h3>
        <Link to="/orders" className="mt-4 text-primary-500 font-bold hover:underline">Back to Orders</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Back Button */}
      <div>
        <Link to="/orders" className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-primary-600 transition-colors">
          <MdOutlineArrowBack size={18} />
          Back to Order History
        </Link>
      </div>

      <h1 className="font-display text-2xl font-black text-slate-800">
        Track Your Order
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Stepper Status tracker */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="font-display text-lg font-bold text-slate-800 pb-3 border-b border-slate-100 mb-6">
              Live Status Tracker
            </h3>
            
            <OrderStatusTracker status={order.status} />
          </div>

          {/* Delivery Rider Assignment Panel */}
          {agent && (
            <div className="rounded-3xl border border-indigo-100 bg-indigo-50/30 p-6 flex items-center gap-4">
              <div className="rounded-2xl bg-indigo-100 p-3 text-indigo-600 shadow-inner">
                <MdDirectionsBike size={28} />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-500 block">
                  Delivery Agent Assigned
                </span>
                <strong className="block text-slate-800 font-bold text-base mt-0.5">{agent.name}</strong>
                <p className="text-xs text-slate-500 mt-1">Phone: <strong className="text-slate-700">{agent.phone}</strong></p>
              </div>
            </div>
          )}
        </div>

        {/* Order Details Preview Side Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-display text-lg font-bold text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-2">
              <MdFastfood size={20} className="text-primary-500" />
              Order Info
            </h3>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Order ID:</span>
                <span className="font-mono font-bold text-slate-700">#{order.id.slice(-6).toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date Placed:</span>
                <span className="font-medium text-slate-700">{formatDate(order.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Restaurant:</span>
                <span className="font-bold text-slate-700">{order.restaurantName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Delivery Address:</span>
                <span className="font-medium text-slate-700 text-right max-w-[150px] truncate" title={order.deliveryAddress}>
                  {order.deliveryAddress}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Type:</span>
                <span className="font-bold text-slate-700 uppercase">{order.paymentMethod}</span>
              </div>
            </div>

            <div className="border-t border-slate-50 pt-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Items ordered</h4>
              <div className="space-y-1.5">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs text-slate-600">
                    <span>
                      {item.name} <strong className="text-slate-400">x{item.quantity}</strong>
                    </span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-50 pt-3 flex justify-between items-baseline">
              <span className="text-sm font-bold text-slate-700">Grand Total</span>
              <span className="font-sans text-lg font-black text-slate-800">{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
