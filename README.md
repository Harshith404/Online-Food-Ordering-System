# Online Food Ordering System - Architecture and Specifications

> **DBMS Capstone Project** | Frontend: React.js | Backend: Firebase Serverless Architecture

---

## Project Overview

The **Online Food Ordering System** is a full-stack, enterprise-grade web application designed to facilitate seamless interactions between customers, restaurant administrators, and delivery personnel. The system features a client interface built with React.js and a real-time serverless backend powered by Firebase (Firestore, Auth, and Realtime Database).

The architecture leverages role-based views and security policies to isolate operations, ensuring that customers can place and track orders, restaurant admins can manage menu inventories and assign dispatch drivers, and delivery agents can efficiently claim and complete deliveries.

---

## Core System Architecture

### Frontend React.js Architecture

The client-side application is structured to decouple core business logic (services and state management) from presentational UI components.

```
frontend/
├── public/
│   ├── index.html
│   ├── favicon.png              # Custom QuickBite Logo Favicon
│   └── icons.svg
│
├── src/
│   ├── assets/                  # Static assets and design files
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
│   ├── pages/                   # Route-level View Components
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   │
│   │   ├── Profile.jsx          # Shared User Settings and Preferences Page
│   │   │
│   │   ├── customer/
│   │   │   ├── Home.jsx
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
│   ├── context/                 # Context Providers (Global State Management)
│   │   ├── AuthContext.jsx
│   │   └── CartContext.jsx
│   │
│   ├── hooks/                   # Custom Hooks
│   │   └── useAuth.js
│   │
│   ├── services/                # Backend API & Firebase Service Layer
│   │   ├── restaurantService.js
│   │   ├── menuService.js
│   │   ├── orderService.js
│   │   └── userService.js
│   │
│   ├── firebase/                # Firebase Config and Initialization SDK
│   │   └── config.js
│   │
│   ├── routes/                  # Client-side Declarative Routes
│   │   └── AppRoutes.jsx
│   │
│   ├── utils/                   # Shared Utility Modules
│   │   └── seedData.js          # Database seeding utility
│   │
│   ├── styles/                  # Styling & Global CSS
│   │   └── global.css
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── .env                         # Environment keys (ignored by git)
├── .gitignore
├── package.json
└── README.md
```

---

### Backend Serverless Architecture

The backend configuration defines security policies and indexing options applied to the Firebase service layer.

```
backend/
├── firebase.json                # Project deployment settings
├── .firebaserc                  # Project environment target alias
├── .env                         # Backend environment configurations
│
├── firestore/
│   ├── firestore.rules          # Security rules for Firestore data isolation
│   └── firestore.indexes.json   # Composite indexing configuration
│
└── README.md
```

---

## Database Design (Firestore Collections)

### Collection: `users`
```
users/{userId}
├── uid: string
├── name: string
├── email: string
├── phone: string
├── role: "customer" | "admin" | "delivery"
├── address: string
├── profileImage: string (Compressed Base64 data URL or validated external link)
├── profilePicUrl: string (Compressed Base64 data URL or validated external link)
└── createdAt: timestamp
```

### Collection: `restaurants`
```
restaurants/{restaurantId}
├── name: string
├── ownerId: string (Reference -> users.uid)
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
├── restaurantId: string (Reference -> restaurants.id)
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
├── customerId: string (Reference -> users.uid)
├── restaurantId: string (Reference -> restaurants.id)
├── items: [
│   { itemId, name, quantity, price }
│   ]
├── totalAmount: number
├── status: "pending" | "accepted" | "preparing" | "out_for_delivery" | "delivered" | "cancelled"
├── deliveryAgentId: string (Reference -> users.uid)
├── deliveryAddress: string
├── paymentMethod: "COD" | "online"
├── isPaid: boolean
└── createdAt: timestamp
```

---

## Technical Specifications and Features

### User Profile Management & Resource Optimization
* **Direct Image Upload (Base64 Compression)**: Bypasses external object storage storage constraints by utilizing client-side image compression. Local file selections undergo HTML5 Canvas downscaling (max resolution: 300x300 pixels, JPEG quality: 70%). The resulting compact Base64 data string (typically 10-30KB) is written directly to the user's Firestore document.
* **External URL Validation**: Accepts direct image URLs (e.g., Unsplash, Cloudinary). Implements a browser-level DOM validation mechanism (`new Image()`) that performs cross-origin checking via `onload` and `onerror` handlers.
* **Google Drive Link Resolver**: Automatically intercepts Google Drive sharing URLs (e.g., `drive.google.com` or `drive.usercontent.google.com`) and resolves them into web-renderable content stream links (`docs.google.com/uc?export=view&id={id}`).
* **Preset Avatar System**: Implements a zero-latency fallback grid containing pre-defined, vector-rendered avatars representing different profiles.

### Access Control and Authentication
* **Role-Based Routing**: Restricts application views via route-level guards (`ProtectedRoute`). Only authenticated users with valid permissions can access their corresponding dashboard (Customer, Admin, Delivery).
* **Credential Masking**: Offers secure authentication pages with character visibility toggles (Show/Hide password) implemented natively in custom input fields.
* **Secure Firestore Policies**: Data-isolation policies are configured via Firestore Rules to restrict database writes based on current authentication state and role.

### Customer Client interface
* User Authentication powered by Firebase Auth.
* Interactive restaurant directory.
* Advanced menu viewing with real-time item availability indicators.
* Cart subsystem with business rules preventing cross-restaurant item additions.
* One-click checkout with automatic shipping address retrieval.
* Reactive order tracker utilizing real-time Firestore listeners.

### Restaurant Administration Dashboard
* Inventory Management: Full CRUD interfaces to manage menu items.
* Live Order Monitor: Active listeners tracking incoming order streams.
* Order Lifecycle Control: Interactive state transitions (Pending, Preparing, Out for Delivery).
* Direct Driver Dispatch: Direct delivery agent assignment from a dropdown query of active delivery personnel.

### Delivery Agent Subsystem
* Regional Dispatch Console: Claims pending delivery runs.
* Real-time Delivery Tracking: Updates dispatch status in real-time.
* Historical delivery logs tracking completed tasks.

---

## Application Transaction Workflow

```
Customer Registers / Authenticates
        ↓
Browse Restaurant Directory → Choose Target Restaurant
        ↓
Explore Menu Inventory → Populate Cart (enforces single restaurant)
        ↓
Initiate Checkout → Resolve Delivery Address → Dispatch Order
        ↓
Document Saved to Firestore (status: "pending")
        ↓
Admin Panel Receives Event Stream → Accept Order & Assign Delivery Agent
        ↓
State Transition: "preparing" → "out_for_delivery"
        ↓
Rider Claims Order → Complete Run → State Transition: "delivered"
        ↓
Customer View updates Reactively via onSnapshot Listener
```

---

## Technology Stack

| Layer | Component | Specification |
|-------|-----------|---------------|
| Frontend | Library | React.js (Vite configuration) |
| Styling | Architecture | Tailwind CSS v3 |
| Routing | Library | React Router v7 |
| State | Framework | React Context API |
| Backend | Platform | Firebase Serverless |
| Database | System | Cloud Firestore NoSQL DBMS |
| Identity | Security | Firebase Authentication |
| Storage | Technique | Inline Base64 Data URL Compression |
| Updates | Protocol | Firestore Real-Time Streams (onSnapshot) |
| Hosting | Environment | Vercel Deployment |

---

## Database Management System Concepts Demonstrated

* **Data Modeling**: Logical schema abstraction represented within schema-less, document-oriented Firestore collections.
* **Data Isolation and Security Rules**: Server-side validation rules specifying access-control policies based on user authentication tokens.
* **CRUD Execution**: Standardized read/write patterns covering user signups, menu modifications, status updates, and order creation.
* **Database Relationships**: One-to-Many and Many-to-Many logical connections across `orders`, `users`, `restaurants`, and `menu_items` handled via document reference fields.
* **Composite Query Optimization**: Index configurations defined to allow multi-parameter querying (e.g., sorting orders by creation time while filtering by agent ID).
* **Real-time Event Subscriptions**: Bypasses traditional HTTP polling by leveraging WebSockets-based real-time event streaming (`onSnapshot`).
* **Atomicity & Batch Writes**: Guarantees database integrity during order placement by atomically creating orders and managing transaction logs.

---

## Setup and Deployment

### Prerequisites
* Node.js v18.0.0 or higher
* Configured Firebase project credentials
* `.env` file containing client configuration targets

### Installation
1. Install client-side dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Launch the developer environment:
   ```bash
   npm run dev
   ```

### Client Environment Variables (`.env`)
Create a file named `.env` in the root of the `/frontend` directory:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_DATABASE_URL=your_firebase_database_url
```

---

*Project for DBMS Course | Online Food Ordering System*
