import React from 'react';
import { formatDate } from '../../utils/formatDate';
import { formatPrice } from '../../utils/formatPrice';

const OrderTable = ({ orders, onStatusUpdate }) => {
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

  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-white border border-slate-100 text-center">
        <p className="text-slate-400 font-medium">No orders found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm">
      <table className="w-full border-collapse text-left text-sm text-slate-500">
        <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-700 border-b border-slate-100">
          <tr>
            <th className="px-6 py-4">Order ID & Date</th>
            <th className="px-6 py-4">Customer & Address</th>
            <th className="px-6 py-4">Items</th>
            <th className="px-6 py-4">Total Amount</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-slate-50/50">
              <td className="px-6 py-4">
                <span className="font-mono text-xs font-bold text-slate-800">#{order.id.slice(-6).toUpperCase()}</span>
                <span className="block text-xs text-slate-400 mt-1">{formatDate(order.createdAt)}</span>
              </td>
              <td className="px-6 py-4 max-w-[200px]">
                <strong className="block text-slate-800 font-semibold">{order.customerName || 'Customer'}</strong>
                <span className="block text-xs text-slate-400 truncate mt-0.5" title={order.deliveryAddress}>
                  {order.deliveryAddress}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="space-y-1">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="text-xs text-slate-700">
                      <span className="font-semibold text-slate-800">{item.name}</span>
                      <span className="text-slate-400 font-mono ml-1">x{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="font-sans font-bold text-slate-800">{formatPrice(order.totalAmount)}</span>
                <span className="block text-[10px] uppercase font-bold text-slate-400 mt-0.5">
                  {order.paymentMethod}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${getStatusStyle(order.status)}`}>
                  {order.status.replace(/_/g, ' ')}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  {order.status === 'pending' && (
                    <>
                      <button
                        onClick={() => onStatusUpdate(order.id, 'accepted')}
                        className="rounded-lg bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700 transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => onStatusUpdate(order.id, 'cancelled')}
                        className="rounded-lg bg-rose-50 hover:bg-rose-100 px-3 py-1.5 text-xs font-bold text-rose-700 transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {order.status === 'accepted' && (
                    <button
                      onClick={() => onStatusUpdate(order.id, 'preparing')}
                      className="rounded-lg bg-primary-500 hover:bg-primary-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-colors"
                    >
                      Start Preparing
                    </button>
                  )}

                  {order.status === 'preparing' && (
                    <button
                      onClick={() => onStatusUpdate(order.id, 'out_for_delivery')}
                      className="rounded-lg bg-indigo-500 hover:bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-colors"
                    >
                      Out for Delivery
                    </button>
                  )}

                  {order.status === 'out_for_delivery' && (
                    <span className="text-xs text-slate-400 font-medium">On delivery...</span>
                  )}

                  {order.status === 'delivered' && (
                    <span className="text-xs text-emerald-500 font-bold">Completed</span>
                  )}

                  {order.status === 'cancelled' && (
                    <span className="text-xs text-rose-500 font-bold">Cancelled</span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
