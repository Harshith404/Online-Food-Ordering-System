import React, { useState, useEffect } from 'react';
import { restaurantService } from '../../services/restaurantService';
import RestaurantCard from '../../components/customer/RestaurantCard';
import Loader from '../../components/common/Loader';
import { MdSearch } from 'react-icons/md';
import { seedDatabase } from '../../utils/seedData';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const data = await restaurantService.getRestaurants();
      setRestaurants(data);
    } catch (error) {
      console.error("Error fetching restaurants", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await seedDatabase();
      alert("Demo data seeded successfully! You can now browse restaurants.");
      await fetchRestaurants();
    } catch (error) {
      console.error("Seeding failed", error);
      alert("Failed to seed database: " + error.message);
    } finally {
      setSeeding(false);
    }
  };

  const cuisines = ['All', 'Fast Food', 'Indian', 'Chinese', 'Italian', 'Dessert', 'Beverages'];

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCuisine = selectedCuisine === 'All' || 
      (restaurant.cuisineType && restaurant.cuisineType.toLowerCase().includes(selectedCuisine.toLowerCase()));
    return matchesSearch && matchesCuisine;
  });

  if (loading) return <Loader fullPage />;

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 to-rose-600 text-white px-8 py-12 sm:px-12 sm:py-16 shadow-lg">
        <div className="relative z-10 max-w-xl space-y-4">
          <span className="inline-block rounded-full bg-white/20 backdrop-blur px-3.5 py-1 text-xs font-bold uppercase tracking-wider">
            DBMS Food Ordering
          </span>
          <h1 className="font-display text-4xl font-extrabold sm:text-5xl tracking-tight leading-tight">
            Delicious meals, delivered straight to your door
          </h1>
          <p className="text-sm sm:text-base text-orange-50 opacity-90 leading-relaxed font-medium">
            Browse top local kitchens, customize your plates, and track your delivery rider in real-time.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 h-64 w-64 translate-x-16 translate-y-16 rounded-full bg-white/10 blur-2xl"></div>
        <div className="absolute left-1/3 top-10 h-32 w-32 rounded-full bg-white/5 blur-xl"></div>
      </div>

      {restaurants.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 rounded-3xl bg-white border border-slate-100 text-center space-y-4 shadow-sm">
          <span className="text-5xl animate-bounce">🍕</span>
          <h3 className="font-display text-xl font-bold text-slate-800">No Restaurants Found</h3>
          <p className="text-sm text-slate-500 max-w-md leading-relaxed">
            Your Firestore database seems to be empty. Let's seed it with some mouth-watering restaurants and menu items to get you started immediately!
          </p>
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="rounded-full bg-primary-500 hover:bg-primary-600 text-white font-bold px-8 py-3 shadow-md hover:shadow-lg transition-all disabled:opacity-50"
          >
            {seeding ? 'Seeding Database...' : 'Seed Demo Data'}
          </button>
        </div>
      ) : (
        <>
          {/* Controls: Search & Filters */}
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
              <h2 className="font-display text-2xl font-black text-slate-800 shrink-0">
                Browse Restaurants
              </h2>

              {/* Search Box */}
              <div className="relative max-w-md w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <MdSearch size={22} />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by restaurant name..."
                  className="w-full rounded-full border border-slate-200 pl-11 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all shadow-sm bg-white"
                />
              </div>
            </div>

            {/* Cuisine Filter Chips */}
            <div className="flex flex-wrap gap-2.5 pb-2 overflow-x-auto">
              {cuisines.map((cuisine) => (
                <button
                  key={cuisine}
                  onClick={() => setSelectedCuisine(cuisine)}
                  className={`rounded-full px-5 py-2 text-xs font-bold transition-all shadow-sm ${
                    selectedCuisine === cuisine
                      ? 'bg-primary-500 text-white shadow-md'
                      : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
                  }`}
                >
                  {cuisine}
                </button>
              ))}
            </div>
          </div>

          {/* Restaurant Grid */}
          {filteredRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-16 rounded-3xl bg-white border border-slate-100 text-center space-y-3">
              <span className="text-4xl">🔍</span>
              <h3 className="font-display text-lg font-bold text-slate-800">No restaurants match your search</h3>
              <p className="text-sm text-slate-400 max-w-sm">Try clearing your filters or testing other search terms.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
