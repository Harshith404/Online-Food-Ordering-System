import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { restaurantService } from '../../services/restaurantService';
import Loader from '../../components/common/Loader';
import { MdStorefront, MdSave } from 'react-icons/md';

const RestaurantProfile = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    cuisineType: 'Fast Food',
    address: '',
    imageUrl: '',
    isOpen: true
  });

  useEffect(() => {
    if (!currentUser) return;
    const loadRestaurant = async () => {
      try {
        const resData = await restaurantService.getRestaurantByOwnerId(currentUser.uid);
        if (resData) {
          setFormData({
            name: resData.name || '',
            cuisineType: resData.cuisineType || 'Fast Food',
            address: resData.address || '',
            imageUrl: resData.imageUrl || '',
            isOpen: resData.isOpen !== undefined ? resData.isOpen : true
          });
        }
      } catch (error) {
        console.error("Error loading restaurant profile", error);
      } finally {
        setLoading(false);
      }
    };
    loadRestaurant();
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.address.trim()) {
      alert("Restaurant Name and Address are required.");
      return;
    }
    
    setSaving(true);
    setSuccess(false);
    try {
      await restaurantService.saveRestaurant(currentUser.uid, {
        ...formData,
        ownerId: currentUser.uid
      });
      setSuccess(true);
    } catch (error) {
      console.error("Error saving restaurant profile", error);
      alert("Failed to save restaurant details.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader fullPage />;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24">
      {/* Header */}
      <div className="pb-4 border-b border-slate-100">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Restaurant Settings
        </span>
        <h1 className="font-display text-2xl font-black text-slate-800 mt-1 flex items-center gap-2">
          <MdStorefront className="text-primary-500" />
          Edit Restaurant Profile
        </h1>
      </div>

      {success && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4 text-sm font-semibold text-emerald-600">
          ✓ Restaurant profile updated successfully!
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Restaurant Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g. The Spicy Tandoor"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-800 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Cuisine Type */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Cuisine Specialties</label>
            <input
              type="text"
              name="cuisineType"
              value={formData.cuisineType}
              onChange={handleChange}
              placeholder="e.g. North Indian, Fast Food, Desserts"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-800 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all"
            />
          </div>

          {/* Image Link */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Restaurant Image URL</label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="e.g. https://images.unsplash.com/..."
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-800 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Physical Restaurant Address *</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            placeholder="e.g. 1st Cross, Gandhi Road, Bangalore"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-800 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all"
          />
        </div>

        {/* Status Switch */}
        <div className="flex items-center gap-3 py-3 border-t border-slate-50">
          <input
            type="checkbox"
            name="isOpen"
            id="isOpen"
            checked={formData.isOpen}
            onChange={handleChange}
            className="h-5 w-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
          />
          <div>
            <label htmlFor="isOpen" className="text-sm font-bold text-slate-700 cursor-pointer select-none">
              Open for Ordering
            </label>
            <p className="text-xs text-slate-400 mt-0.5">Toggle whether customers can view and place orders from your menu.</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-primary-500 hover:bg-primary-600 text-white font-bold text-sm px-6 py-3 shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <MdSave size={18} />
            {saving ? 'Saving Details...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RestaurantProfile;
