# 🍽️ Online Food Ordering System — Full Project Description

> **DBMS Mini Project** | Frontend: React.js | Backend: Firebase

---

## 📌 Project Overview

The **Online Food Ordering System** is a full-stack web application that allows customers to browse restaurants, view menus, place orders, and track delivery status in real-time. The system supports multiple user roles — **Customer**, **Restaurant Admin**, and **Delivery Agent** — each with a dedicated interface.

The backend is powered by **Firebase** (Firestore + Auth + Storage + Realtime DB), and the frontend is built using **React.js** with a clean component-based architecture.

---

## 🎯 Objectives

- Allow customers to register, browse menus, and place food orders online
- Enable restaurant admins to manage their menu, accept/reject orders
- Allow delivery agents to view and update delivery status
- Store and manage all data efficiently using Firebase Firestore (NoSQL DBMS)
- Demonstrate core DBMS concepts: data modeling, CRUD operations, queries, relationships, and real-time updates

---

## 👥 User Roles

| Role | Description |
|------|-------------|
| **Customer** | Register/Login, Browse restaurants, Add to cart, Place orders, Track order |
| **Restaurant Admin** | Manage menu items, View & accept orders, Update order status |
| **Delivery Agent** | View assigned orders, Update delivery status |
| **Super Admin** *(optional)* | Manage restaurants and users platform-wide |

---

## 🗂️ Folder Architecture

### 📁 Frontend — React.js

```
frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
│
├── src/
│   ├── assets/                  # Images, icons, fonts
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── components/              # Reusable UI Components
│   │   ├── common/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── customer/
│   │   │   ├── RestaurantCard.jsx
│   │   │   ├── MenuItemCard.jsx
│   │   │   ├── CartItem.jsx
│   │   │   └── OrderStatusTracker.jsx
│   │   │
│   │   ├── admin/
│   │   │   ├── MenuForm.jsx
│   │   │   ├── OrderTable.jsx
│   │   │   └── DashboardStats.jsx
│   │   │
│   │   └── delivery/
│   │       └── DeliveryCard.jsx
│   │
│   ├── pages/                   # Route-level Page Components
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── ForgotPassword.jsx
│   │   │
│   │   ├── customer/
│   │   │   ├── Home.jsx
│   │   │   ├── RestaurantList.jsx
│   │   │   ├── RestaurantMenu.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── OrderHistory.jsx
│   │   │   └── TrackOrder.jsx
│   │   │
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── ManageMenu.jsx
│   │   │   ├── ManageOrders.jsx
│   │   │   └── RestaurantProfile.jsx
│   │   │
│   │   └── delivery/
│   │       ├── DeliveryDashboard.jsx
│   │       └── DeliveryHistory.jsx
│   │
│   ├── context/                 # React Context (Global State)
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   └── OrderContext.jsx
│   │
│   ├── hooks/                   # Custom React Hooks
│   │   ├── useAuth.js
│   │   ├── useCart.js
│   │   ├── useOrders.js
│   │   └── useRestaurants.js
│   │
│   ├── services/                # Firebase API Calls (Business Logic Layer)
│   │   ├── authService.js
│   │   ├── orderService.js
│   │   ├── menuService.js
│   │   ├── restaurantService.js
│   │   └── userService.js
│   │
│   ├── firebase/                # Firebase Config & Initialization
│   │   ├── config.js
│   │   ├── firestore.js
│   │   └── storage.js
│   │
│   ├── routes/                  # App Routing
│   │   └── AppRoutes.jsx
│   │
│   ├── utils/                   # Helper Functions
│   │   ├── formatDate.js
│   │   ├── formatPrice.js
│   │   └── validators.js
│   │
│   ├── styles/                  # Global CSS / Tailwind config
│   │   ├── global.css
│   │   └── tailwind.config.js
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── .env                         # Firebase keys (never commit)
├── .gitignore
├── package.json
└── README.md
```

---

### 📁 Backend — Firebase

```
backend/
├── firebase.json                # Firebase project config
├── .firebaserc                  # Project alias config
├── .env                         # Secret keys
│
├── firestore/
│   ├── firestore.rules          # Security rules for Firestore
│   ├── firestore.indexes.json   # Composite index definitions
│   └── schema/                  # (Reference) Collection schema docs
│       ├── users.md
│       ├── restaurants.md
│       ├── menu_items.md
│       ├── orders.md
│       └── delivery_agents.md
│
└── README.md
```

---

## 🗃️ Database Design (Firestore Collections)

### Collection: `users`
```
users/{userId}
├── uid: string
├── name: string
├── email: string
├── phone: string
├── role: "customer" | "admin" | "delivery"
├── address: string
└── createdAt: timestamp
```

### Collection: `restaurants`
```
restaurants/{restaurantId}
├── name: string
├── ownerId: string (ref → users)
├── cuisineType: string
├── imageUrl: string
├── rating: number
├── isOpen: boolean
├── address: string
└── createdAt: timestamp
```

### Collection: `menu_items`
```
menu_items/{itemId}
├── restaurantId: string (ref → restaurants)
├── name: string
├── description: string
├── price: number
├── category: string
├── imageUrl: string
└── isAvailable: boolean
```

### Collection: `orders`
```
orders/{orderId}
├── customerId: string (ref → users)
├── restaurantId: string (ref → restaurants)
├── items: [
│   { itemId, name, quantity, price }
│   ]
├── totalAmount: number
├── status: "pending" | "accepted" | "preparing" | "out_for_delivery" | "delivered" | "cancelled"
├── deliveryAgentId: string (ref → users)
├── deliveryAddress: string
├── paymentMethod: "COD" | "online"
├── isPaid: boolean
└── createdAt: timestamp
```

### Collection: `cart` *(optional — can also be local state)*
```
cart/{userId}
└── items: [
    { itemId, name, quantity, price, restaurantId }
    ]
```

---

## 🔑 Core Features

### Customer
- Sign up / Login (Firebase Auth)
- Browse restaurants with filters (cuisine, rating)
- View menu of a restaurant
- Add items to cart (same restaurant only)
- Place order with delivery address
- Real-time order status tracking
- View order history

### Restaurant Admin
- Login with admin account
- Dashboard with order statistics
- Add / Edit / Delete menu items
- View incoming orders in real-time
- Accept / Reject / Update order status

### Delivery Agent
- Login and view assigned orders
- Update delivery status (picked up → delivered)
- View delivery history

---

## 🔄 Application Flow

```
Customer Registers / Logs In
        ↓
Browse Restaurants → Select Restaurant
        ↓
View Menu → Add to Cart
        ↓
Checkout → Enter Address → Place Order
        ↓
Order stored in Firestore (status: "pending")
        ↓
Restaurant Admin sees order → Accepts it (status: "accepted")
        ↓
Admin updates → "preparing" → "out_for_delivery"
        ↓
Delivery Agent picks up → Updates (status: "delivered")
        ↓
Customer sees real-time status update
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js (Vite), Tailwind CSS |
| Routing | React Router v6 |
| State Management | React Context API |
| Backend | Firebase |
| Database | Firestore (NoSQL) |
| Auth | Firebase Authentication |
| File Storage |
| Real-time | Firestore onSnapshot listeners |
| Hosting | Firebase Hosting |

---

## 🔐 Security Rules (Firestore Overview)

- Only authenticated users can read/write
- Customers can only read their own orders
- Admins can only modify their own restaurant's data
- Delivery agents can only update order status (not create/delete)
- Menu items are readable by all, writable only by restaurant admin

---

## 📦 NPM Packages (Frontend)

```json
{
  "dependencies": {
    "react": "^18.x",
    "react-dom": "^18.x",
    "react-router-dom": "^6.x",
    "firebase": "^10.x",
    "tailwindcss": "^3.x",
    "axios": "^1.x",
    "react-toastify": "^9.x",
    "react-icons": "^4.x"
  }
}
```

---

## 📋 DBMS Concepts Demonstrated

| Concept | How it's used |
|---------|--------------|
| **Data Modeling** | Firestore collections with structured documents |
| **CRUD Operations** | Create orders, Read menus, Update status, Delete cart items |
| **Relationships** | orders → users, orders → restaurants, menu_items → restaurants |
| **Indexing** | Firestore composite indexes for order queries |
| **Real-time Queries** | `onSnapshot` for live order tracking |
| **Transactions** | Atomic order placement (decrement stock + create order) |
| **Authentication** | Firebase Auth with role-based access |
| **Security** | Firestore Security Rules |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- `.env` file with Firebase config keys

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables (`.env`)
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```
---

*Project for DBMS Course | Online Food Ordering System*
