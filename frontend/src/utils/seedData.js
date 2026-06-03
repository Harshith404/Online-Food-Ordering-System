import { collection, writeBatch, doc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const seedDatabase = async () => {
  try {
    const r1Ref = doc(collection(db, 'restaurants'));
    const r2Ref = doc(collection(db, 'restaurants'));
    const r3Ref = doc(collection(db, 'restaurants'));

    const r1Id = r1Ref.id;
    const r2Id = r2Ref.id;
    const r3Id = r3Ref.id;

    const batch = writeBatch(db);

    // Restaurant 1: Pizza Palace
    batch.set(r1Ref, {
      name: 'Pizza Palace',
      cuisineType: 'Italian, Fast Food',
      imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=60',
      rating: 4.3,
      isOpen: true,
      address: '12 Main Street, Food Sector, Bangalore',
      ownerId: 'demo_owner_1',
      createdAt: new Date().toISOString()
    });

    // Restaurant 2: The Spice Route
    batch.set(r2Ref, {
      name: 'The Spice Route',
      cuisineType: 'Indian, Curry',
      imageUrl: 'https://images.unsplash.com/photo-1585938338392-50a59970d8ee?w=600&auto=format&fit=crop&q=60',
      rating: 4.7,
      isOpen: true,
      address: '45 Culinary Lane, Spice Market, Bangalore',
      ownerId: 'demo_owner_2',
      createdAt: new Date().toISOString()
    });

    // Restaurant 3: Wok & Roll
    batch.set(r3Ref, {
      name: 'Wok & Roll',
      cuisineType: 'Chinese, Noodles',
      imageUrl: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=600&auto=format&fit=crop&q=60',
      rating: 4.5,
      isOpen: true,
      address: '89 Lantern Ave, Chinatown, Bangalore',
      ownerId: 'demo_owner_3',
      createdAt: new Date().toISOString()
    });

    // Seed Menu Items for Pizza Palace
    const m1 = doc(collection(db, 'menu_items'));
    batch.set(m1, {
      restaurantId: r1Id,
      name: 'Margherita Pizza',
      description: 'Classic mozzarella, basil, and red tomato sauce on thin crust.',
      price: 249,
      category: 'Veg',
      imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&auto=format&fit=crop&q=60',
      isAvailable: true
    });

    const m2 = doc(collection(db, 'menu_items'));
    batch.set(m2, {
      restaurantId: r1Id,
      name: 'Spicy Pepperoni Pizza',
      description: 'Loaded with double pepperoni, jalapenos, and mozzarella.',
      price: 399,
      category: 'Non-Veg',
      imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&auto=format&fit=crop&q=60',
      isAvailable: true
    });

    const m3 = doc(collection(db, 'menu_items'));
    batch.set(m3, {
      restaurantId: r1Id,
      name: 'Garlic Bread Sticks',
      description: 'Baked bread sticks brushed with garlic butter and herbs.',
      price: 129,
      category: 'Veg',
      imageUrl: 'https://images.unsplash.com/photo-1544982503-9f984c14501a?w=400&auto=format&fit=crop&q=60',
      isAvailable: true
    });

    // Seed Menu Items for The Spice Route
    const m4 = doc(collection(db, 'menu_items'));
    batch.set(m4, {
      restaurantId: r2Id,
      name: 'Butter Chicken Masala',
      description: 'Tender chicken tikka cooked in rich tomato and butter sauce.',
      price: 320,
      category: 'Non-Veg',
      imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&auto=format&fit=crop&q=60',
      isAvailable: true
    });

    const m5 = doc(collection(db, 'menu_items'));
    batch.set(m5, {
      restaurantId: r2Id,
      name: 'Paneer Butter Masala',
      description: 'Cottage cheese cubes in cream gravy with mild Indian spices.',
      price: 280,
      category: 'Veg',
      imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&auto=format&fit=crop&q=60',
      isAvailable: true
    });

    const m6 = doc(collection(db, 'menu_items'));
    batch.set(m6, {
      restaurantId: r2Id,
      name: 'Garlic Naan Flatbread',
      description: 'Traditional leavened clay-oven flatbread topped with garlic.',
      price: 60,
      category: 'Veg',
      imageUrl: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=400&auto=format&fit=crop&q=60',
      isAvailable: true
    });

    // Seed Menu Items for Wok & Roll
    const m7 = doc(collection(db, 'menu_items'));
    batch.set(m7, {
      restaurantId: r3Id,
      name: 'Schezwan Fried Rice',
      description: 'Wok-tossed basmati rice with vegetables in spicy Schezwan paste.',
      price: 180,
      category: 'Veg',
      imageUrl: 'https://images.unsplash.com/photo-1603133872878-68550a50f0cf?w=400&auto=format&fit=crop&q=60',
      isAvailable: true
    });

    const m8 = doc(collection(db, 'menu_items'));
    batch.set(m8, {
      restaurantId: r3Id,
      name: 'Chilli Chicken Dry',
      description: 'Crispy chicken pieces tossed with bell peppers, onion, and soy sauce.',
      price: 240,
      category: 'Non-Veg',
      imageUrl: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&auto=format&fit=crop&q=60',
      isAvailable: true
    });

    const m9 = doc(collection(db, 'menu_items'));
    batch.set(m9, {
      restaurantId: r3Id,
      name: 'Spring Rolls (4 pcs)',
      description: 'Crispy wrapper rolls filled with seasoned sautéed vegetables.',
      price: 140,
      category: 'Veg',
      imageUrl: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&auto=format&fit=crop&q=60',
      isAvailable: true
    });

    await batch.commit();
    return true;
  } catch (error) {
    console.error("Error seeding database", error);
    throw error;
  }
};
