import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { restaurantService } from '../../services/restaurantService';
import { menuService } from '../../services/menuService';
import MenuForm from '../../components/admin/MenuForm';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import { MdAdd, MdEdit, MdDelete, MdRestaurantMenu } from 'react-icons/md';
import { formatPrice } from '../../utils/formatPrice';

const ManageMenu = () => {
  const { currentUser } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // null means adding new

  const fetchMenu = async (resId) => {
    try {
      const data = await menuService.getMenuItems(resId);
      setMenuItems(data);
    } catch (error) {
      console.error("Error fetching menu items", error);
    }
  };

  useEffect(() => {
    if (!currentUser) return;
    const loadData = async () => {
      try {
        const resData = await restaurantService.getRestaurantByOwnerId(currentUser.uid);
        if (resData) {
          setRestaurant(resData);
          await fetchMenu(resData.id);
        }
      } catch (error) {
        console.error("Error loading restaurant info", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [currentUser]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingItem) {
        // Edit existing
        await menuService.updateMenuItem(editingItem.id, formData);
      } else {
        // Add new
        await menuService.addMenuItem({
          ...formData,
          restaurantId: restaurant.id
        });
      }
      setIsModalOpen(false);
      setEditingItem(null);
      await fetchMenu(restaurant.id);
    } catch (error) {
      console.error("Error saving menu item", error);
      alert("Failed to save menu item. Please check input parameters.");
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this menu item?")) return;
    try {
      await menuService.deleteMenuItem(itemId);
      await fetchMenu(restaurant.id);
    } catch (error) {
      console.error("Error deleting menu item", error);
      alert("Failed to delete menu item.");
    }
  };

  if (loading) return <Loader fullPage />;

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Menu Management
          </span>
          <h1 className="font-display text-2xl font-black text-slate-800 mt-1 flex items-center gap-2">
            <MdRestaurantMenu className="text-primary-500" />
            Manage Kitchen Menu
          </h1>
        </div>

        <button
          onClick={handleOpenAdd}
          className="rounded-full bg-primary-500 hover:bg-primary-600 text-white font-bold text-sm px-5 py-2.5 shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
        >
          <MdAdd size={20} />
          Add Menu Item
        </button>
      </div>

      {/* Menu List */}
      {menuItems.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm">
          <table className="w-full border-collapse text-left text-sm text-slate-500">
            <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-700 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Dish</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Availability</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {menuItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                        <img 
                          src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&auto=format&fit=crop&q=60'} 
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <strong className="block text-sm font-semibold text-slate-800">{item.name}</strong>
                        <span className="block text-xs text-slate-400 max-w-[200px] truncate" title={item.description}>
                          {item.description || 'No description'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600 capitalize">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-sans font-bold text-slate-800">{formatPrice(item.price)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${
                      item.isAvailable ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {item.isAvailable ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                        title="Edit Item"
                      >
                        <MdEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                        title="Delete Item"
                      >
                        <MdDelete size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-16 text-center space-y-3 rounded-2xl border border-slate-100 bg-white shadow-sm">
          <span className="text-4xl">🍳</span>
          <h3 className="font-display text-lg font-bold text-slate-800">Your Menu is Empty</h3>
          <p className="text-sm text-slate-400 max-w-xs">
            Start adding dishes to make your restaurant browseable by customers.
          </p>
          <button
            onClick={handleOpenAdd}
            className="rounded-full bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs px-6 py-2.5 shadow-sm transition-all"
          >
            Add First Item
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
      >
        <MenuForm
          initialData={editingItem || {}}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default ManageMenu;
