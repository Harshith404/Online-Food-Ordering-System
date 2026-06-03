import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
import { orderService } from '../../services/orderService';
import { formatPrice } from '../../utils/formatPrice';
import { MdOutlineArrowBack, MdDirectionsBike, MdCreditCard } from 'react-icons/md';

const Checkout = () => {
  const { currentUser } = useAuth();
  const { cart, cartRestaurant, totalAmount, clearCart } = useCart();
  const [address, setAddress] = useState(currentUser?.address || '');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const deliveryFee = 40;
  const gstTax = totalAmount * 0.05;
  const grandTotal = totalAmount + deliveryFee + gstTax;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!address.trim()) {
      alert("Please provide a delivery address.");
      return;
    }
    setLoading(true);
    try {
      const orderId = await orderService.placeOrder({
        customerId: currentUser.uid,
        customerName: currentUser.name || currentUser.email?.split('@')[0] || 'Customer',
        restaurantId: cartRestaurant.id,
        restaurantName: cartRestaurant.name || 'Restaurant',
        restaurantAddress: cartRestaurant.address || 'Address not specified',
        items: cart.map((item) => ({
          itemId: item.id,
          name: item.name || 'Menu Item',
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: grandTotal,
        deliveryAddress: address || 'No address specified',
        paymentMethod: paymentMethod || 'COD'
      });
      
      clearCart();
      navigate(`/track/${orderId}`);
    } catch (error) {
      console.error("Error placing order", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center space-y-4">
        <h3 className="font-display text-xl font-bold text-slate-800">No items to checkout</h3>
        <Link to="/" className="text-primary-500 font-bold hover:underline">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Back Button */}
      <div>
        <Link to="/cart" className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-primary-600 transition-colors">
          <MdOutlineArrowBack size={18} />
          Back to Cart
        </Link>
      </div>

      <h1 className="font-display text-2xl font-black text-slate-800">
        Checkout
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Input Form */}
        <form onSubmit={handlePlaceOrder} className="lg:col-span-2 space-y-6">
          {/* Delivery Details */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-display text-lg font-bold text-slate-800">
              Delivery Details
            </h3>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Delivery Address</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                rows="4"
                placeholder="Enter complete address..."
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-800 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all resize-none"
              ></textarea>
            </div>
          </div>

          {/* Payment Method */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-display text-lg font-bold text-slate-800">
              Payment Method
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* COD */}
              <label className={`flex items-center gap-3 border-2 rounded-2xl p-4 cursor-pointer select-none transition-all ${
                paymentMethod === 'COD'
                  ? 'border-primary-500 bg-primary-50/20 text-primary-600'
                  : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
              }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className="sr-only"
                />
                <MdDirectionsBike size={24} />
                <div className="text-left">
                  <strong className="block text-sm font-semibold text-slate-800">Cash on Delivery</strong>
                  <span className="block text-xs text-slate-400">Pay cash when food arrives</span>
                </div>
              </label>

              {/* Online */}
              <label className={`flex items-center gap-3 border-2 rounded-2xl p-4 cursor-pointer select-none transition-all ${
                paymentMethod === 'online'
                  ? 'border-primary-500 bg-primary-50/20 text-primary-600'
                  : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
              }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online"
                  checked={paymentMethod === 'online'}
                  onChange={() => setPaymentMethod('online')}
                  className="sr-only"
                />
                <MdCreditCard size={24} />
                <div className="text-left">
                  <strong className="block text-sm font-semibold text-slate-800">Pay Online</strong>
                  <span className="block text-xs text-slate-400">UPI, Card or NetBanking</span>
                </div>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-primary-500 hover:bg-primary-600 text-white font-bold py-3.5 shadow-md hover:shadow-lg transition-all text-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing Order...' : `Place Order — ${formatPrice(grandTotal)}`}
          </button>
        </form>

        {/* Order Items review side panel */}
        <div className="lg:col-span-1">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-display text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">
              Order Review
            </h3>

            <div className="divide-y divide-slate-50">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between py-2 text-xs text-slate-600">
                  <span>
                    {item.name} <strong className="text-slate-400">x{item.quantity}</strong>
                  </span>
                  <span className="font-semibold text-slate-800">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-3 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span>{formatPrice(deliveryFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST Tax (5%)</span>
                <span>{formatPrice(gstTax)}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-800 border-t border-slate-50 pt-2">
                <span>Grand Total</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
