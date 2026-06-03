import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where
} from 'firebase/firestore';
import { db } from '../firebase/config';

export const restaurantService = {
  // Get all restaurants
  getRestaurants: async () => {
    const querySnapshot = await getDocs(collection(db, 'restaurants'));
    const restaurants = [];
    querySnapshot.forEach((doc) => {
      restaurants.push({ id: doc.id, ...doc.data() });
    });
    return restaurants;
  },

  // Get restaurant by ID
  getRestaurantById: async (id) => {
    const docRef = doc(db, 'restaurants', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },

  // Get restaurant by Owner ID (for admin)
  getRestaurantByOwnerId: async (ownerId) => {
    const q = query(collection(db, 'restaurants'), where('ownerId', '==', ownerId));
    const querySnapshot = await getDocs(q);
    let restaurant = null;
    querySnapshot.forEach((doc) => {
      restaurant = { id: doc.id, ...doc.data() };
    });
    return restaurant;
  },

  // Create or update restaurant (for admin)
  saveRestaurant: async (restaurantId, data) => {
    const restaurantRef = doc(db, 'restaurants', restaurantId);
    const docSnap = await getDoc(restaurantRef);
    if (docSnap.exists()) {
      await updateDoc(restaurantRef, data);
      return { id: restaurantId, ...docSnap.data(), ...data };
    } else {
      const newRestaurant = {
        ...data,
        createdAt: new Date().toISOString(),
        rating: 4.5, // Default rating
        isOpen: true
      };
      await setDoc(restaurantRef, newRestaurant);
      return { id: restaurantId, ...newRestaurant };
    }
  }
};
