import React from 'react';
import useCart from '../../hooks/useCart';
import { formatPrice } from '../../utils/formatPrice';
import { MdAdd, MdRemove } from 'react-icons/md';

const MenuItemCard = ({ item, restaurant, onConflict }) => {
  const { cart, addToCart, updateQuantity } = useCart();
  const { id, name, description, price, imageUrl, isAvailable, category } = item;

  // Find if item already exists in cart
  const cartItem = cart.find((i) => i.id === id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAdd = () => {
    if (!isAvailable) return;
    const res = addToCart({ id, name, price, imageUrl }, restaurant);
    if (res && res.conflict) {
      if (onConflict) {
        onConflict(res.existingRestaurant, item, restaurant);
      } else {
        alert(`Your cart has items from another restaurant.`);
      }
    }
  };

  return (
    <div className={`flex flex-col sm:flex-row items-center gap-6 rounded-2xl bg-white p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 ${
      !isAvailable ? 'opacity-60 select-none' : ''
    }`}>
      {/* Item Image */}
      <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-slate-100">
        <img 
          src={imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=60'} 
          alt={name}
          className="h-full w-full object-cover"
        />
        {!isAvailable && (
          <span className="absolute inset-0 flex items-center justify-center bg-slate-950/60 text-xs font-bold text-white uppercase tracking-wider">
            Sold Out
          </span>
        )}
      </div>

      {/* Item Details */}
      <div className="flex-1 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
          <h4 className="font-display text-lg font-bold text-slate-800">{name}</h4>
          <span className="font-sans text-base font-extrabold text-primary-600">
            {formatPrice(price)}
          </span>
        </div>
        <p className="text-sm text-slate-500 line-clamp-2 mb-3">{description || 'No description available.'}</p>
        <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 capitalize">
          {category}
        </span>
      </div>

      {/* Add / Quantity Controls */}
      <div className="shrink-0 flex items-center justify-center">
        {quantity > 0 ? (
          <div className="flex items-center gap-3 rounded-full bg-primary-50 px-3 py-1.5 border border-primary-100 shadow-sm">
            <button
              onClick={() => updateQuantity(id, quantity - 1)}
              className="rounded-full bg-white p-1 text-primary-600 hover:bg-primary-100 transition-colors shadow-sm"
            >
              <MdRemove size={16} />
            </button>
            <span className="font-sans font-bold text-primary-800 w-6 text-center">{quantity}</span>
            <button
              onClick={() => updateQuantity(id, quantity + 1)}
              className="rounded-full bg-white p-1 text-primary-600 hover:bg-primary-100 transition-colors shadow-sm"
            >
              <MdAdd size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={handleAdd}
            disabled={!isAvailable}
            className={`rounded-full px-6 py-2 text-sm font-bold shadow-md hover:shadow-lg transition-all ${
              isAvailable 
                ? 'bg-primary-500 hover:bg-primary-600 text-white hover:-translate-y-0.5' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default MenuItemCard;
