import React, { useState } from 'react';

const MenuForm = ({ initialData = {}, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    description: initialData.description || '',
    price: initialData.price || '',
    category: initialData.category || 'Veg',
    imageUrl: initialData.imageUrl || '',
    isAvailable: initialData.isAvailable !== undefined ? initialData.isAvailable : true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert("Name and Price are required.");
      return;
    }
    onSubmit({
      ...formData,
      price: Number(formData.price)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Item Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="e.g. Butter Chicken, Veg Pizza"
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-800 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all"
        />
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Price (₹) *</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          min="1"
          placeholder="e.g. 250"
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-800 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-800 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all bg-white"
        >
          <option value="Veg">Veg</option>
          <option value="Non-Veg">Non-Veg</option>
          <option value="Beverage">Beverage</option>
          <option value="Dessert">Dessert</option>
        </select>
      </div>

      {/* Image URL */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Image URL</label>
        <input
          type="url"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          placeholder="e.g. https://images.unsplash.com/..."
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-800 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          placeholder="Describe ingredients, taste, or portion size..."
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-800 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all resize-none"
        ></textarea>
      </div>

      {/* Availability Switch */}
      <div className="flex items-center gap-3 py-2">
        <input
          type="checkbox"
          name="isAvailable"
          id="isAvailable"
          checked={formData.isAvailable}
          onChange={handleChange}
          className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
        />
        <label htmlFor="isAvailable" className="text-sm font-medium text-slate-700 select-none cursor-pointer">
          Available in Stock
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full px-5 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-full bg-primary-500 hover:bg-primary-600 px-6 py-2 text-sm font-bold text-white shadow-md hover:shadow-lg transition-all"
        >
          {initialData.id ? 'Update Item' : 'Add Item'}
        </button>
      </div>
    </form>
  );
};

export default MenuForm;
