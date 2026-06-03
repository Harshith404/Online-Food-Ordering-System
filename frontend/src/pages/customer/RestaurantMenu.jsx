import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { restaurantService } from '../../services/restaurantService';
import { menuService } from '../../services/menuService';
import useCart from '../../hooks/useCart';
import MenuItemCard from '../../components/customer/MenuItemCard';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import { MdStar, MdLocationOn, MdShoppingCart, MdArrowBack } from 'react-icons/md';
import { formatPrice } from '../../utils/formatPrice';

const RestaurantMenu = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const { cart, cartRestaurant, totalAmount, totalItems, forceAddToCart } = useCart();

  // Conflict Modal State
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);
  const [conflictData, setConflictData] = useState(null); // { existingRestaurant, pendingItem, pendingRestaurant }

  useEffect(() => {
    const loadRestaurantAndMenu = async () => {
      try {
        const resData = await restaurantService.getRestaurantById(id);
        const menuData = await menuService.getMenuItems(id);
        setRestaurant(resData);
        setMenuItems(menuData);
      } catch (error) {
        console.error("Error loading restaurant menu", error);
      } finally {
        setLoading(false);
      }
    };
    loadRestaurantAndMenu();
  }, [id]);

  const handleConflict = (existingRestaurant, item, restaurant) => {
    setConflictData({ existingRestaurant, pendingItem: item, pendingRestaurant: restaurant });
    setIsConflictModalOpen(true);
  };

  const handleResolveConflict = () => {
    if (conflictData) {
      forceAddToCart(conflictData.pendingItem, conflictData.pendingRestaurant);
      setIsConflictModalOpen(false);
      setConflictData(null);
    }
  };

  const categories = ['All', 'Veg', 'Non-Veg', 'Beverage', 'Dessert'];

  const filteredItems = menuItems.filter((item) => {
    return selectedCategory === 'All' || item.category === selectedCategory;
  });

  if (loading) return <Loader fullPage />;
  if (!restaurant) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center">
        <h3 className="font-display text-xl font-bold text-slate-800">Restaurant Not Found</h3>
        <Link to="/" className="mt-4 text-primary-500 font-bold hover:underline">Back to Home</Link>
      </div>
    );
  }

  // Show checkout box if cart has items from this restaurant
  const showCheckoutBar = cart.length > 0 && cartRestaurant && cartRestaurant.id === restaurant.id;

  return (
    <div className="space-y-6 pb-24">
      {/* Back Button */}
      <div>
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-primary-600 transition-colors">
          <MdArrowBack size={18} />
          Back to Restaurants
        </Link>
      </div>

      {/* Restaurant Header */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-md">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/50 to-transparent z-10" />
        <img 
          src={restaurant.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80'} 
          alt={restaurant.name}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="relative z-20 px-6 py-12 sm:px-10 sm:py-16 max-w-2xl space-y-4">
          <h1 className="font-display text-3xl font-black sm:text-4xl tracking-tight">
            {restaurant.name}
          </h1>

          <p className="text-sm text-slate-200 capitalize font-semibold">
            {restaurant.cuisineType}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-sm font-semibold">
            <div className="flex items-center gap-1 rounded bg-amber-500 px-2.5 py-0.5 text-slate-950 font-bold">
              <MdStar size={16} />
              <span>{restaurant.rating?.toFixed(1) || '4.5'}</span>
            </div>
            
            <div className="flex items-center gap-1 text-slate-200">
              <MdLocationOn size={16} className="text-primary-400" />
              <span>{restaurant.address}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Menu Listings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-display text-xl font-bold text-slate-800">Menu Items</h2>
            
            {/* Category tabs */}
            <div className="flex gap-1.5 overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? 'bg-slate-800 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {filteredItems.length > 0 ? (
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <MenuItemCard 
                  key={item.id} 
                  item={item} 
                  restaurant={restaurant} 
                  onConflict={handleConflict}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-white border border-slate-100 text-slate-400 font-medium">
              No items in this category.
            </div>
          )}
        </div>

        {/* Floating Cart Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-display text-lg font-bold text-slate-800 flex items-center gap-2">
              <MdShoppingCart size={22} className="text-primary-500" />
              Your Cart Summary
            </h3>
            
            {showCheckoutBar ? (
              <div className="space-y-4 pt-2">
                <div className="max-h-[250px] overflow-y-auto divide-y divide-slate-50 pr-1">
                  {cart.map((cartItem) => (
                    <div key={cartItem.id} className="flex justify-between py-2 text-sm text-slate-600">
                      <span>{cartItem.name} <strong className="text-slate-400">x{cartItem.quantity}</strong></span>
                      <span className="font-medium text-slate-800">{formatPrice(cartItem.price * cartItem.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline">
                  <span className="text-sm font-semibold text-slate-500">Subtotal</span>
                  <span className="font-sans text-xl font-black text-slate-800">{formatPrice(totalAmount)}</span>
                </div>

                <button
                  onClick={() => navigate('/cart')}
                  className="w-full rounded-2xl bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 shadow-md hover:shadow-lg transition-all text-center flex items-center justify-center gap-2"
                >
                  Go to Checkout ({totalItems} items)
                </button>
              </div>
            ) : (
              <p className="text-sm text-slate-400 py-4 text-center">
                Your cart is empty. Add items from this menu to build your plate!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Cart Conflict Resolution Modal */}
      <Modal 
        isOpen={isConflictModalOpen} 
        onClose={() => setIsConflictModalOpen(false)}
        title="Replace Cart Items?"
      >
        <div className="space-y-4 text-center">
          <p className="text-slate-600 text-sm leading-relaxed">
            Your cart already contains items from{' '}
            <strong className="text-slate-800">
              "{conflictData?.existingRestaurant?.name}"
            </strong>
            . Ordering from multiple restaurants at once is not supported.
          </p>
          
          <p className="text-slate-500 text-xs">
            Would you like to clear your cart and start a new order with{' '}
            <strong className="text-slate-800">
              "{conflictData?.pendingRestaurant?.name}"
            </strong>
            ?
          </p>

          <div className="flex gap-3 pt-4 justify-center">
            <button
              onClick={() => setIsConflictModalOpen(false)}
              className="rounded-full px-5 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleResolveConflict}
              className="rounded-full bg-primary-500 hover:bg-primary-600 text-white font-bold px-6 py-2 text-sm shadow-md hover:shadow-lg transition-all"
            >
              Clear & Add Item
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RestaurantMenu;
