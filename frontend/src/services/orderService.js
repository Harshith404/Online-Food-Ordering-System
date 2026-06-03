import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase/config';

export const orderService = {
  // Place a new order
  placeOrder: async (orderData) => {
    const docRef = await addDoc(collection(db, 'orders'), {
      ...orderData,
      status: 'pending',
      deliveryAgentId: '',
      isPaid: orderData.paymentMethod === 'online' ? true : false,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  },

  // Subscribe to a single order (Real-time tracking)
  subscribeToOrderById: (orderId, callback) => {
    const docRef = doc(db, 'orders', orderId);
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        callback({ id: docSnap.id, ...docSnap.data() });
      } else {
        callback(null);
      }
    });
  },

  // Subscribe to customer orders (Sorted in-memory to prevent index errors)
  subscribeToCustomerOrders: (customerId, callback) => {
    const q = query(
      collection(db, 'orders'),
      where('customerId', '==', customerId)
    );
    return onSnapshot(q, (querySnapshot) => {
      const orders = [];
      querySnapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() });
      });
      // Sort in memory by createdAt descending
      orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      callback(orders);
    });
  },

  // Subscribe to restaurant orders (Sorted in-memory)
  subscribeToRestaurantOrders: (restaurantId, callback) => {
    const q = query(
      collection(db, 'orders'),
      where('restaurantId', '==', restaurantId)
    );
    return onSnapshot(q, (querySnapshot) => {
      const orders = [];
      querySnapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() });
      });
      // Sort in memory by createdAt descending
      orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      callback(orders);
    });
  },

  // Subscribe to available deliveries (for delivery agent to claim)
  subscribeToAvailableDeliveries: (callback) => {
    const q = query(
      collection(db, 'orders'),
      where('status', 'in', ['accepted', 'preparing', 'out_for_delivery'])
    );
    return onSnapshot(q, (querySnapshot) => {
      const orders = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Additional filter for unclaimed deliveries
        if (!data.deliveryAgentId) {
          orders.push({ id: doc.id, ...data });
        }
      });
      orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      callback(orders);
    });
  },

  // Subscribe to assigned agent deliveries
  subscribeToAgentDeliveries: (agentId, callback) => {
    const q = query(
      collection(db, 'orders'),
      where('deliveryAgentId', '==', agentId)
    );
    return onSnapshot(q, (querySnapshot) => {
      const orders = [];
      querySnapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() });
      });
      orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      callback(orders);
    });
  },

  // Claim a delivery
  claimDelivery: async (orderId, agentId) => {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      deliveryAgentId: agentId,
      status: 'out_for_delivery'
    });
  },

  // Assign a delivery agent to an order (by Restaurant Admin)
  assignDeliveryAgent: async (orderId, agentId) => {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      deliveryAgentId: agentId,
      status: 'out_for_delivery'
    });
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { status });
  }
};
