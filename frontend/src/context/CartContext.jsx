import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartRestaurant, setCartRestaurant] = useState(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('food_cart');
    const savedRestaurant = localStorage.getItem('food_cart_restaurant');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error(e);
      }
    }
    if (savedRestaurant) {
      try {
        setCartRestaurant(JSON.parse(savedRestaurant));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Save cart to localStorage
  const saveCartToStorage = (newCart, newRestaurant) => {
    setCart(newCart);
    setCartRestaurant(newRestaurant);
    localStorage.setItem('food_cart', JSON.stringify(newCart));
    if (newRestaurant) {
      localStorage.setItem('food_cart_restaurant', JSON.stringify(newRestaurant));
    } else {
      localStorage.removeItem('food_cart_restaurant');
    }
  };

  const addToCart = (item, restaurant) => {
    // Check if adding from another restaurant
    if (cart.length > 0 && cartRestaurant && cartRestaurant.id !== restaurant.id) {
      return { conflict: true, existingRestaurant: cartRestaurant };
    }

    const existingItemIndex = cart.findIndex((i) => i.id === item.id);
    let newCart = [...cart];

    if (existingItemIndex > -1) {
      newCart[existingItemIndex].quantity += 1;
    } else {
      newCart.push({ ...item, quantity: 1, restaurantId: restaurant.id });
    }

    const newRestaurant = cartRestaurant || restaurant;
    saveCartToStorage(newCart, newRestaurant);
    return { success: true };
  };

  const forceAddToCart = (item, restaurant) => {
    const newCart = [{ ...item, quantity: 1, restaurantId: restaurant.id }];
    saveCartToStorage(newCart, restaurant);
  };

  const removeFromCart = (itemId) => {
    const newCart = cart.filter((item) => item.id !== itemId);
    const newRestaurant = newCart.length === 0 ? null : cartRestaurant;
    saveCartToStorage(newCart, newRestaurant);
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    const newCart = cart.map((item) => 
      item.id === itemId ? { ...item, quantity } : item
    );
    saveCartToStorage(newCart, cartRestaurant);
  };

  const clearCart = () => {
    saveCartToStorage([], null);
  };

  const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const value = {
    cart,
    cartRestaurant,
    addToCart,
    forceAddToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalAmount,
    totalItems
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
