import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { orderService } from '../../services/orderService';
import Loader from '../../components/common/Loader';
import { formatDate } from '../../utils/formatDate';
import { formatPrice } from '../../utils/formatPrice';
import { MdTrackChanges, MdFastfood } from 'react-icons/md';

const OrderHistory = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    const unsubscribe = orderService.subscribeToCustomerOrders(currentUser.uid, (data) => {
      setOrders(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [currentUser]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'accepted': return 'bg-sky-100 text-sky-700';
      case 'preparing': return 'bg-purple-100 text-purple-700';
      case 'out_for_delivery': return 'bg-indigo-100 text-indigo-700';
      case 'delivered': return 'bg-emerald-100 text-emerald-700';
      case 'cancelled': return 'bg-rose-100 text-rose-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  if (loading) return <Loader fullPage />;

  return (
    <div className="space-y-6 pb-24">
      <h1 className="font-display text-2xl font-black text-slate-800">
        Your Order History
      </h1>

      {orders.length > 0 ? (
        <div className="grid grid-cols-1 gap-5">
          {orders.map((order) => (
            <div 
              key={order.id} 
              className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow transition-all duration-300"
            >
              {/* Order Metadata */}
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-slate-500 uppercase">
                    Order #{order.id.slice(-6).toUpperCase()}
                  </span>
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${getStatusStyle(order.status)}`}>
                    {order.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-lg font-bold text-slate-800 flex items-center gap-1.5">
                    <MdFastfood className="text-primary-500" />
                    {order.restaurantName || 'Restaurant'}
                  </h3>
                  <span className="block text-xs text-slate-400 mt-1">{formatDate(order.createdAt)}</span>
                </div>

                {/* Items preview */}
                <div className="text-xs text-slate-600 flex flex-wrap gap-x-4 gap-y-1 pt-1 border-t border-slate-50">
                  {order.items.map((item, idx) => (
                    <span key={idx}>
                      {item.name} <strong className="text-slate-400 font-mono">x{item.quantity}</strong>
                    </span>
                  ))}
                </div>
              </div>

              {/* Total & Action */}
              <div className="flex items-center md:items-end justify-between md:flex-col gap-4 border-t border-slate-50 pt-4 md:border-0 md:pt-0 shrink-0">
                <div className="text-left md:text-right">
                  <span className="text-xs text-slate-400 block">Total Paid</span>
                  <span className="font-sans text-xl font-black text-slate-800">{formatPrice(order.totalAmount)}</span>
                </div>

                {/* Track Order button */}
                {['pending', 'accepted', 'preparing', 'out_for_delivery'].includes(order.status) ? (
                  <Link
                    to={`/track/${order.id}`}
                    className="rounded-full bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs px-5 py-2.5 shadow-sm hover:shadow transition-all flex items-center gap-1.5"
                  >
                    <MdTrackChanges size={16} />
                    Track Order
                  </Link>
                ) : (
                  <Link
                    to={`/track/${order.id}`}
                    className="rounded-full border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs px-5 py-2.5 transition-all"
                  >
                    View Details
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-16 text-center space-y-4 rounded-3xl bg-white border border-slate-100">
          <span className="text-4xl">🍔</span>
          <h3 className="font-display text-lg font-bold text-slate-800">No Orders Yet</h3>
          <p className="text-sm text-slate-400 max-w-xs">
            Hungry? Start exploring restaurants and place your first order.
          </p>
          <Link 
            to="/" 
            className="rounded-full bg-primary-500 hover:bg-primary-600 text-white font-bold px-6 py-2.5 shadow-md transition-all"
          >
            Order Now
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
