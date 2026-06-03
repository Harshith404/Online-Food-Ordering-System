import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
import { MdFastfood, MdShoppingCart, MdHistory, MdLogout, MdDashboard, MdPerson, MdDeliveryDining } from 'react-icons/md';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Error logging out", error);
    }
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 font-display text-2xl font-black tracking-tight text-primary-600">
              <MdFastfood className="text-primary-500 animate-bounce" size={28} />
              <span>QuickBite</span>
            </Link>
          </div>

          {/* Navigation Links based on role */}
          <div className="hidden md:flex items-center gap-6">
            {currentUser && currentUser.role === 'customer' && (
              <>
                <Link to="/" className="text-sm font-semibold text-slate-600 hover:text-primary-600 transition-colors">
                  Restaurants
                </Link>
                <Link to="/orders" className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-primary-600 transition-colors">
                  <MdHistory size={18} />
                  My Orders
                </Link>
              </>
            )}

            {currentUser && currentUser.role === 'admin' && (
              <>
                <Link to="/admin" className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-primary-600 transition-colors">
                  <MdDashboard size={18} />
                  Dashboard
                </Link>
                <Link to="/admin/orders" className="text-sm font-semibold text-slate-600 hover:text-primary-600 transition-colors">
                  Orders
                </Link>
                <Link to="/admin/menu" className="text-sm font-semibold text-slate-600 hover:text-primary-600 transition-colors">
                  Menu
                </Link>
                <Link to="/admin/profile" className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-primary-600 transition-colors">
                  <MdPerson size={18} />
                  Restaurant Profile
                </Link>
              </>
            )}

            {currentUser && currentUser.role === 'delivery' && (
              <>
                <Link to="/delivery" className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-primary-600 transition-colors">
                  <MdDeliveryDining size={18} />
                  Deliveries
                </Link>
                <Link to="/delivery/history" className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-primary-600 transition-colors">
                  <MdHistory size={18} />
                  History
                </Link>
              </>
            )}
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-4">
            {currentUser ? (
              <div className="flex items-center gap-4">
                {currentUser.role === 'customer' && (
                  <Link to="/cart" className="relative flex items-center p-2 text-slate-600 hover:text-primary-600 transition-colors">
                    <MdShoppingCart size={24} />
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-500 font-sans text-xs font-bold text-white shadow-md">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                )}
                
                <span className="hidden lg:inline text-sm font-medium text-slate-500">
                  Welcome, <strong className="text-slate-700">{currentUser.name}</strong>
                  <span className="ml-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs font-semibold capitalize text-slate-600">
                    {currentUser.role}
                  </span>
                </span>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 rounded-full bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 px-4 py-2 text-sm font-semibold transition-all hover:shadow"
                >
                  <MdLogout size={16} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  to="/login" 
                  className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:text-primary-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="rounded-full bg-primary-500 hover:bg-primary-600 px-5 py-2 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
