# E-Commerce Recommendation Platform 🛍️

A full-stack e-commerce MVP with AI-powered product recommendations based on purchase and browsing history. Built with React, FastAPI, SQLAlchemy, and TF-IDF similarity.

## Features ✨

- **Smart Recommendations**: Personalized product suggestions based on:
  - Purchase history (40% weight)
  - Browsing history (35% weight)
  - Product similarity (25% weight)
- **Product Grid**: Browse all 51K+ products in responsive grid
- **Shopping Cart**: Add/remove items and checkout
- **Browsing History**: Track your product viewing history with timestamps
- **Guest Users**: Automatic guest account creation for instant access
- **Professional UI**: Modern design with gradient headers, smooth animations

## Project Structure

```
ecommerce/
├── backend/
│   ├── main.py              # FastAPI application with all endpoints
│   ├── requirements.txt      # Python dependencies
│   ├── ecommerce.db         # SQLite database (auto-created)
│   └── .gitignore
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main React component with state management
│   │   ├── App.css          # Professional styling (gradients, animations)
│   │   ├── main.jsx         # React entry point
│   │   └── components/
│   │       ├── Header.jsx   # Navigation header with cart counter
│   │       ├── ProductGrid.jsx  # Product display grid
│   │       ├── Cart.jsx     # Shopping cart display
│   │       ├── Recommendations.jsx  # Personalized recommendations
│   │       └── BrowsingHistory.jsx  # Viewing history
│   ├── index.html           # HTML entry point
│   ├── package.json         # Node dependencies (React, Vite)
│   ├── vite.config.js       # Vite build configuration
│   ├── .gitignore
│   └── dist/                # Built frontend (after `npm run build`)
└── README.md                # This file
```

## Quick Start 🚀

For a full clone/pull setup guide, including why `backend/ecommerce.db` is not pushed and how to restore product data, see [GITHUB_SETUP.md](GITHUB_SETUP.md).

### Prerequisites
- Python 3.9 or 3.10 recommended
- Node.js 14+
- npm

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python main.py
```

The API will start at `http://localhost:8000`
API docs available at `http://localhost:8000/docs`

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will start at `http://localhost:5173`

### 3. Load Sample Data

The backend expects products to be in database. The first API call to `/api/products` will trigger initialization or you can seed data.

## API Endpoints 📡

### Products
- `GET /api/products` - Get all products
- `GET /api/products/{product_id}` - Get single product

### Users
- `POST /api/users` - Create guest user
- `GET /api/users/{user_id}` - Get user details

### Cart
- `GET /api/users/{user_id}/cart` - Get user's cart
- `POST /api/users/{user_id}/cart/{product_id}` - Add to cart
- `DELETE /api/users/{user_id}/cart/{product_id}` - Remove from cart

### Recommendations
- `GET /api/users/{user_id}/recommendations` - Get personalized recommendations

### Browsing History
- `GET /api/users/{user_id}/browsing-history` - Get browsing history
- `POST /api/users/{user_id}/browsing-history/{product_id}` - Track product view

### Orders
- `POST /api/users/{user_id}/checkout` - Create order
- `GET /api/users/{user_id}/orders` - Get user orders

## Frontend Components 🎨

### Header
Navigation bar with logo, products button, account button, and cart counter

### ProductGrid
Responsive grid displaying all products with:
- Product image (or emoji placeholder 📦)
- Name, category, description
- Price and add-to-cart button
- Hover animations and zoom effects

### Recommendations
Section showing 6 personalized products for the user with:
- "For You" badge
- Same product card design as ProductGrid
- Based on purchase + browsing history + similarity

### Cart
Shopping cart page with:
- List of cart items with remove buttons
- Item quantity and total price
- Order summary with subtotal/tax/shipping
- Checkout button

### BrowsingHistory
User account page showing:
- All viewed products with timestamps
- "Viewed 2 hours ago" format
- Add-to-cart buttons for quick purchase
- Responsive timeline layout

## Styling 🎨

Professional design with:
- **Color Scheme**: Purple gradient (#667eea to #764ba2)
- **Typography**: System fonts with 600 font-weight headers
- **Spacing**: Consistent 1rem/2rem padding
- **Animations**: Hover effects, shadow depth, fade-in transitions
- **Responsive**: Mobile-first design (breakpoints at 768px, 480px)

### CSS Features
- Gradient backgrounds on buttons and headers
- Box shadows for depth (hover states have larger shadows)
- Transform animations (scale, translateY, translateX)
- Responsive grid (auto-fill with minmax)
- Professional loading states and empty states

## Recommendation Algorithm 📊

Weighted scoring system:
1. **Purchase History (40%)**: Products user has already purchased are scored
2. **Browsing History (35%)**: Products user has viewed get higher scores
3. **Product Similarity (25%)**: Similar products to what user has viewed/purchased
   - Uses TF-IDF vectorization
   - Cosine similarity for product comparison
   - On-demand computation (memory efficient)

## Deployment 🌐

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy dist folder to Vercel
```

### Backend (Replit/Railway)
- Push code to GitHub
- Connect to Replit/Railway
- Set environment variable: `API_URL=https://your-backend.herokuapp.com`

## Known Limitations ⚠️

- Product images currently use emoji placeholders; you can add image URLs to products
- No authentication system (guest users only)
- SQLite database (works for MVP; use PostgreSQL for production)
- No real payment processing (checkout creates order only)
- No search functionality (but you can add to ProductGrid)

## Adding Product Images 🖼️

To add product images:
1. Update products in database with `image_url` field
2. ProductGrid will automatically display images instead of emoji placeholders
3. Images will appear in recommendations, cart, and browsing history

## Future Enhancements 🚀

- [ ] Search functionality with autocomplete
- [ ] Filters by category, price range
- [ ] User authentication and registration
- [ ] Real payment integration (Stripe/Razorpay)
- [ ] Product reviews and ratings
- [ ] Wishlist/saved items
- [ ] Order tracking
- [ ] Admin dashboard
- [ ] Email notifications

## Tech Stack 🛠️

**Backend**
- FastAPI - Modern Python web framework
- SQLAlchemy - ORM for database
- Pydantic - Data validation
- scikit-learn - ML (TF-IDF, cosine similarity)
- pandas - Data processing

**Frontend**
- React 18 - UI library
- Vite - Build tool
- CSS3 - Styling with gradients and animations
- Fetch API - HTTP requests

**Database**
- SQLite - Development database

## License

MIT License - feel free to use for your project submission!

---

Built with ❤️ for your e-commerce MVP needs. Good luck with your project submission! 🎉
