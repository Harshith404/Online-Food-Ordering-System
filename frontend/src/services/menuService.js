import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where 
} from 'firebase/firestore';
import { db } from '../firebase/config';

export const menuService = {
  // Fetch menu items for a restaurant
  getMenuItems: async (restaurantId) => {
    const q = query(collection(db, 'menu_items'), where('restaurantId', '==', restaurantId));
    const querySnapshot = await getDocs(q);
    const menuItems = [];
    querySnapshot.forEach((doc) => {
      menuItems.push({ id: doc.id, ...doc.data() });
    });
    return menuItems;
  },

  // Add menu item
  addMenuItem: async (menuItemData) => {
    const docRef = await addDoc(collection(db, 'menu_items'), {
      ...menuItemData,
      price: Number(menuItemData.price),
      isAvailable: menuItemData.isAvailable !== undefined ? menuItemData.isAvailable : true
    });
    return { id: docRef.id, ...menuItemData };
  },

  // Update menu item
  updateMenuItem: async (itemId, data) => {
    const itemRef = doc(db, 'menu_items', itemId);
    const updateData = { ...data };
    if (data.price !== undefined) updateData.price = Number(data.price);
    await updateDoc(itemRef, updateData);
  },

  // Delete menu item
  deleteMenuItem: async (itemId) => {
    const itemRef = doc(db, 'menu_items', itemId);
    await deleteDoc(itemRef);
  }
};
