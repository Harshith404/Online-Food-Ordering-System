import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const userService = {
  getUserProfile: async (uid) => {
    const userDoc = await getDoc(doc(db, 'users', uid));
    return userDoc.exists() ? userDoc.data() : null;
  },
  
  updateUserProfile: async (uid, data) => {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, data);
  }
};
