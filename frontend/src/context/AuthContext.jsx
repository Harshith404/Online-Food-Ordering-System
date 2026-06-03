import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up customer/admin/delivery
  const registerUser = async (email, password, name, phone, address, role) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Save additional profile details to Firestore
    const userProfile = {
      uid: user.uid,
      name,
      email,
      phone,
      role, // "customer" | "admin" | "delivery"
      address,
      createdAt: new Date().toISOString()
    };
    
    await setDoc(doc(db, 'users', user.uid), userProfile);
    setCurrentUser(userProfile);
    return userCredential;
  };

  // Login
  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Fetch user details from Firestore
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      setCurrentUser(userDoc.data());
    } else {
      const fallbackProfile = {
        uid: user.uid,
        email: user.email,
        name: user.email.split('@')[0],
        role: 'customer',
        address: '',
        phone: '',
        createdAt: new Date().toISOString()
      };
      await setDoc(userRef, fallbackProfile);
      setCurrentUser(fallbackProfile);
    }
    return userCredential;
  };

  // Logout
  const logout = () => {
    return signOut(auth);
  };

  // Reset Password
  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            setCurrentUser(userDoc.data());
          } else {
            const fallbackProfile = {
              uid: user.uid,
              email: user.email,
              name: user.email.split('@')[0],
              role: 'customer',
              address: '',
              phone: '',
              createdAt: new Date().toISOString()
            };
            await setDoc(userRef, fallbackProfile);
            setCurrentUser(fallbackProfile);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setCurrentUser({
            uid: user.uid,
            email: user.email,
            role: 'customer',
          });
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    registerUser,
    login,
    logout,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
