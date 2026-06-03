import React from 'react';
import useCart from '../../hooks/useCart';
import { formatPrice } from '../../utils/formatPrice';
import { MdAdd, MdRemove, MdDelete } from 'react-icons/md';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { id, name, price, imageUrl, quantity } = item;

  return (
    <div className="flex items-center gap-4 py-4 border-b border-slate-100 last:border-0">
      {/* Item Image */}
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
        <img 
          src={imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&auto=format&fit=crop&q=60'} 
          alt={name}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Item details */}
      <div className="flex-1 min-w-0">
        <h5 className="font-display text-sm font-bold text-slate-800 truncate">{name}</h5>
        <p className="text-xs text-slate-400 mt-0.5">{formatPrice(price)} each</p>
      </div>

      {/* Quantity controls */}
      <div className="flex items-center gap-2.5 rounded-full bg-slate-50 border border-slate-200 px-2 py-1">
        <button
          onClick={() => updateQuantity(id, quantity - 1)}
          className="rounded-full bg-white p-0.5 text-slate-500 hover:text-primary-600 transition-colors shadow-sm"
        >
          <MdRemove size={14} />
        </button>
        <span className="font-sans text-xs font-bold text-slate-700 w-5 text-center">{quantity}</span>
        <button
          onClick={() => updateQuantity(id, quantity + 1)}
          className="rounded-full bg-white p-0.5 text-slate-500 hover:text-primary-600 transition-colors shadow-sm"
        >
          <MdAdd size={14} />
        </button>
      </div>

      {/* Total price for the item */}
      <div className="text-right shrink-0 min-w-[70px]">
        <span className="font-sans text-sm font-black text-slate-800">
          {formatPrice(price * quantity)}
        </span>
      </div>

      {/* Delete button */}
      <button
        onClick={() => removeFromCart(id)}
        className="rounded-full p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all"
      >
        <MdDelete size={18} />
      </button>
    </div>
  );
};

export default CartItem;
