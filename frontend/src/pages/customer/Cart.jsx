import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useCart from '../../hooks/useCart';
import CartItem from '../../components/customer/CartItem';
import { formatPrice } from '../../utils/formatPrice';
import { MdOutlineArrowBack, MdShoppingCartCheckout, MdDeleteSweep } from 'react-icons/md';

const Cart = () => {
  const { cart, cartRestaurant, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();

  const deliveryFee = cart.length > 0 ? 40 : 0;
  const gstTax = totalAmount * 0.05; // 5% GST
  const grandTotal = totalAmount + deliveryFee + gstTax;

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center space-y-4">
        <span className="text-6xl">🛒</span>
        <h3 className="font-display text-xl font-bold text-slate-800">Your Cart is Empty</h3>
        <p className="text-sm text-slate-400 max-w-xs animate-pulse">
          Explore cuisines and fill your cart with gourmet meals.
        </p>
        <Link 
          to="/" 
          className="rounded-full bg-primary-500 hover:bg-primary-600 text-white font-bold px-6 py-2.5 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
        >
          Browse Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Back Button */}
      <div>
        <Link 
          to={cartRestaurant ? `/restaurant/${cartRestaurant.id}` : '/'} 
          className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-primary-600 transition-colors"
        >
          <MdOutlineArrowBack size={18} />
          Back to Restaurant Menu
        </Link>
      </div>

      <h1 className="font-display text-2xl font-black text-slate-800">
        Review Your Cart
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Cart items list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Ordering from: <strong className="text-slate-700">{cartRestaurant?.name}</strong>
              </span>
              <button
                onClick={clearCart}
                className="flex items-center gap-1.5 text-xs font-bold text-rose-500 hover:text-rose-600 hover:underline transition-colors"
              >
                <MdDeleteSweep size={16} />
                Clear Cart
              </button>
            </div>

            <div className="divide-y divide-slate-50">
              {cart.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>

        {/* Bill summary side panel */}
        <div className="lg:col-span-1">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm space-y-5">
            <h3 className="font-display text-lg font-bold text-slate-800 pb-2 border-b border-slate-100">
              Bill Summary
            </h3>

            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-slate-800">{formatPrice(totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Partner Fee</span>
                <span className="font-medium text-slate-800">{formatPrice(deliveryFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>Govt Taxes & Charges (5% GST)</span>
                <span className="font-medium text-slate-800">{formatPrice(gstTax)}</span>
              </div>
              
              <div className="border-t border-slate-100 pt-4 flex justify-between items-baseline">
                <span className="text-base font-extrabold text-slate-800">Grand Total</span>
                <span className="font-sans text-2xl font-black text-slate-800">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full rounded-2xl bg-primary-500 hover:bg-primary-600 text-white font-bold py-3.5 shadow-md hover:shadow-lg transition-all text-center flex items-center justify-center gap-2"
            >
              <MdShoppingCartCheckout size={20} />
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
