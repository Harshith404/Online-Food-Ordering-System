import React from 'react';
import { MdLocationOn, MdPhone, MdDeliveryDining, MdAttachMoney } from 'react-icons/md';
import { formatPrice } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';

const DeliveryCard = ({ order, onClaim, onComplete, agentId }) => {
  const { id, restaurantName, restaurantAddress, customerName, deliveryAddress, items, totalAmount, status, paymentMethod, createdAt } = order;

  const isClaimedByMe = order.deliveryAgentId === agentId;
  const isUnclaimed = !order.deliveryAgentId;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <span className="font-mono text-xs font-bold text-slate-800">Order #{id.slice(-6).toUpperCase()}</span>
          <span className="block text-[10px] text-slate-400 mt-0.5">{formatDate(createdAt)}</span>
        </div>
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${
          status === 'out_for_delivery' ? 'bg-indigo-100 text-indigo-700' :
          status === 'delivered' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
        }`}>
          {status.replace(/_/g, ' ')}
        </span>
      </div>

      {/* Addresses */}
      <div className="space-y-3">
        {/* Pickup */}
        <div className="flex items-start gap-3">
          <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600 font-bold text-xs">
            P
          </div>
          <div>
            <h5 className="font-display text-xs font-bold text-slate-400 uppercase tracking-wider">Pickup (Restaurant)</h5>
            <strong className="block text-slate-800 text-sm font-semibold">{restaurantName || 'Restaurant'}</strong>
            <p className="text-xs text-slate-500 mt-0.5">{restaurantAddress}</p>
          </div>
        </div>

        {/* Dropoff */}
        <div className="flex items-start gap-3">
          <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 font-bold text-xs">
            D
          </div>
          <div>
            <h5 className="font-display text-xs font-bold text-slate-400 uppercase tracking-wider">Dropoff (Customer)</h5>
            <strong className="block text-slate-800 text-sm font-semibold">{customerName}</strong>
            <p className="text-xs text-slate-500 mt-0.5">{deliveryAddress}</p>
          </div>
        </div>
      </div>

      {/* Items list summary */}
      <div className="border-t border-b border-slate-50 py-3">
        <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Order Items</h5>
        <div className="space-y-1">
          {items.map((item, idx) => (
            <div key={idx} className="flex justify-between text-xs text-slate-600">
              <span>{item.name} <strong className="text-slate-400">x{item.quantity}</strong></span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="flex items-center justify-between mt-2">
        <div>
          <span className="text-xs font-medium text-slate-400 block">Total Amount</span>
          <span className="font-sans text-lg font-black text-slate-800">{formatPrice(totalAmount)}</span>
          <span className="block text-[10px] text-slate-400 uppercase mt-0.5 font-bold">{paymentMethod}</span>
        </div>

        <div className="flex gap-2">
          {isUnclaimed && (
            <button
              onClick={() => onClaim(id)}
              className="rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs px-4 py-2.5 shadow-sm hover:shadow transition-all flex items-center gap-1"
            >
              <MdDeliveryDining size={16} />
              Claim
            </button>
          )}

          {isClaimedByMe && status === 'out_for_delivery' && (
            <button
              onClick={() => onComplete(id)}
              className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-4 py-2.5 shadow-sm hover:shadow transition-all"
            >
              Mark Delivered
            </button>
          )}

          {status === 'delivered' && (
            <span className="text-emerald-500 font-bold text-xs flex items-center gap-1">
              ✓ Delivered
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryCard;
