import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

export const userService = {
  getUserProfile: async (uid) => {
    const userDoc = await getDoc(doc(db, 'users', uid));
    return userDoc.exists() ? userDoc.data() : null;
  },
  
  updateUserProfile: async (uid, data) => {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, data);
  },

  getDeliveryAgents: async () => {
    const q = query(collection(db, 'users'), where('role', '==', 'delivery'));
    const querySnapshot = await getDocs(q);
    const agents = [];
    querySnapshot.forEach((doc) => {
      agents.push({ id: doc.id, ...doc.data() });
    });
    return agents;
  }
};
