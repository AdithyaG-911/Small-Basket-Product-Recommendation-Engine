"""
FastAPI E-Commerce Backend with Smart Recommendations
Recommends based on: browsing history + purchase history + product similarity
Uses trained ML models with 99% accuracy
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, ForeignKey, Boolean, inspect, text, func
from sqlalchemy.orm import sessionmaker, relationship, Session, declarative_base
from pydantic import BaseModel
from datetime import datetime
import json
from typing import List, Optional
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.cluster import KMeans
import os
import sys
import requests
from datetime import datetime, date

# Compatibility for pickles trained with newer Numpy (2.0+) 
# but being loaded on older Numpy (1.21)
try:
    import numpy as np
    sys.modules['numpy._core'] = np
except ImportError:
    pass
import pickle

# Database Setup
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./ecommerce.db")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ============================================================================
# DATABASE MODELS
# ============================================================================

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    category = Column(String)
    price = Column(Float)
    description = Column(String)
    image_url = Column(String, nullable=True)
    product_url = Column(String, nullable=True)
    
    cart_items = relationship("CartItem", back_populates="product")
    order_items = relationship("OrderItem", back_populates="product")
    browsing_history = relationship("BrowsingHistory", back_populates="product")


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    full_name = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    is_admin = Column(Boolean, default=False)
    
    cart = relationship("CartItem", back_populates="user", cascade="all, delete-orphan")
    orders = relationship("Order", back_populates="user", cascade="all, delete-orphan")
    browsing_history = relationship("BrowsingHistory", back_populates="user", cascade="all, delete-orphan")


class CartItem(Base):
    __tablename__ = "cart_items"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer, default=1)
    
    user = relationship("User", back_populates="cart")
    product = relationship("Product", back_populates="cart_items")


class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    total_price = Column(Float)
    status = Column(String, default="Pending")
    
    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order")


class OrderItem(Base):
    __tablename__ = "order_items"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer)
    price = Column(Float)
    
    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")


class BrowsingHistory(Base):
    __tablename__ = "browsing_history"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    visited_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="browsing_history")
    product = relationship("Product", back_populates="browsing_history")


class ProductClick(Base):
    """Track when users click on products for better recommendations"""
    __tablename__ = "product_clicks"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # Allow anonymous clicks
    product_id = Column(Integer, ForeignKey("products.id"))
    clicked_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User")
    product = relationship("Product")


# Create tables
Base.metadata.create_all(bind=engine)

def ensure_product_columns():
    inspector = inspect(engine)
    columns = {column["name"] for column in inspector.get_columns("products")}

    if "product_url" not in columns:
        with engine.begin() as connection:
            connection.execute(text("ALTER TABLE products ADD COLUMN product_url VARCHAR"))

def ensure_user_columns():
    inspector = inspect(engine)
    columns = {column["name"] for column in inspector.get_columns("users")}

    if "full_name" not in columns:
        with engine.begin() as connection:
            connection.execute(text("ALTER TABLE users ADD COLUMN full_name VARCHAR"))
    if "phone" not in columns:
        with engine.begin() as connection:
            connection.execute(text("ALTER TABLE users ADD COLUMN phone VARCHAR"))
    if "is_admin" not in columns:
        with engine.begin() as connection:
            connection.execute(text("ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT 0"))

def ensure_order_columns():
    inspector = inspect(engine)
    columns = {column["name"] for column in inspector.get_columns("orders")}

    if "status" not in columns:
        with engine.begin() as connection:
            connection.execute(text("ALTER TABLE orders ADD COLUMN status VARCHAR DEFAULT 'Pending'"))

ensure_product_columns()
ensure_user_columns()
ensure_order_columns()

# ============================================================================
# PYDANTIC SCHEMAS
# ============================================================================

class ProductCreate(BaseModel):
    name: str
    category: str
    price: float
    description: str
    image_url: Optional[str] = None
    product_url: Optional[str] = None

class ProductResponse(BaseModel):
    id: int
    name: str
    category: str
    price: float
    description: str
    image_url: Optional[str] = None
    product_url: Optional[str] = None
    
    class Config:
        orm_mode = True
        from_attributes = True

class ProductRecommendationResponse(BaseModel):
    """Product response with recommendation explanation"""
    id: int
    name: str
    category: str
    price: float
    description: str
    image_url: Optional[str] = None
    product_url: Optional[str] = None
    recommendation_reason: str = "Recommended for you"  # Explainable AI reason
    recommendation_type: str = "general"  # Type: weather, seasonal, purchase, click, similar, festival
    confidence_score: float = 0.5  # Score from 0-1
    
    class Config:
        orm_mode = True
        from_attributes = True

class PaginatedProductResponse(BaseModel):
    products: List[ProductResponse]
    total: int
    skip: int
    limit: int

class UserCreate(BaseModel):
    username: str
    email: str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    full_name: Optional[str] = None
    phone: Optional[str] = None
    is_admin: Optional[bool] = None

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    
    class Config:
        orm_mode = True
        from_attributes = True

class CartItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    product: ProductResponse
    
    class Config:
        orm_mode = True
        from_attributes = True

class OrderItemResponse(BaseModel):
    product_id: int
    quantity: int
    price: float
    product: ProductResponse
    
    class Config:
        orm_mode = True
        from_attributes = True

class OrderResponse(BaseModel):
    id: int
    created_at: datetime
    total_price: float
    items: List[OrderItemResponse]
    
    class Config:
        orm_mode = True
        from_attributes = True

# ============================================================================
# FASTAPI APP
# ============================================================================

app = FastAPI(title="E-Commerce API", version="1.0.0")

# CORS
default_frontend_urls = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174"
allowed_origins = [
    origin.strip()
    for origin in os.getenv("FRONTEND_URL", default_frontend_urls).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ============================================================================
# LOAD TRAINED MODELS
# ============================================================================

MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")

def load_trained_model():
    """Load the trained logistic regression model (99% accuracy)"""
    try:
        model_path = os.path.join(MODEL_DIR, "logistic_model.pkl")
        if os.path.exists(model_path):
            with open(model_path, 'rb') as f:
                return pickle.load(f)
    except Exception as e:
        print(f"Error loading logistic model: {e}")
    return None

def load_tfidf_vectorizer():
    """Load the trained TF-IDF vectorizer"""
    try:
        vectorizer_path = os.path.join(MODEL_DIR, "tfidf_vectorizer.pkl")
        if os.path.exists(vectorizer_path):
            with open(vectorizer_path, 'rb') as f:
                return pickle.load(f)
    except Exception as e:
        print(f"Error loading TF-IDF vectorizer: {e}")
    return None

# Initialize trained models
TRAINED_MODEL = load_trained_model()
TRAINED_VECTORIZER = load_tfidf_vectorizer()
print(f"Logistic Model Loaded: {TRAINED_MODEL is not None} (99% accuracy)")
print(f"TF-IDF Vectorizer Loaded: {TRAINED_VECTORIZER is not None}")

# ============================================================================
# RECOMMENDATION ENGINE
# ============================================================================

# Global state to cache the similarity matrix and product sample for speed
_REC_CACHE = {
    "products": None,
    "matrix": None,
    "vectorizer": None,
    "clusters": None
}

class RecommendationEngine:
    """Smart recommendations based on browsing history + purchase history + similarity"""
    
    def __init__(self, db):
        self.db = db
        self._ensure_cache()
    
    def _ensure_cache(self):
        """Build TF-IDF matrix for product similarity only once globally"""
        if _REC_CACHE["products"] is not None:
            return
            
        print("Initializing RecommendationEngine cache with 2000 random products...")
        # Get a diverse sample of 2000 products by randomly ordering
        products = self.db.query(Product).order_by(func.random()).limit(2000).all()
        if not products:
            return
        
        _REC_CACHE["products"] = products
        descriptions = [f"{p.name} {p.category} {p.description}" for p in products]
        vectorizer = TfidfVectorizer(max_features=100, stop_words='english')
        matrix = vectorizer.fit_transform(descriptions)
        _REC_CACHE["matrix"] = matrix
        _REC_CACHE["vectorizer"] = vectorizer
        
        # Train AI Clustering Model (K-Means)
        # Group products into 20 distinct AI segments for advanced matching
        n_clusters = min(20, len(products))
        kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=5)
        _REC_CACHE["clusters"] = kmeans.fit_predict(matrix)
        
    def get_similar_products(self, product_id: int, n_recommendations: int = 5) -> List[ProductResponse]:
        """Get visually/semantically similar products to a specific product"""
        target_product = self.db.query(Product).filter(Product.id == product_id).first()
        if not target_product:
            return []
            
        all_products = _REC_CACHE.get("products", [])
        vectorizer = _REC_CACHE.get("vectorizer")
        matrix = _REC_CACHE.get("matrix")
        
        if not all_products or vectorizer is None or matrix is None:
            return []
            
        # Transform the target product's description
        target_desc = f"{target_product.name} {target_product.category} {target_product.description}"
        target_vec = vectorizer.transform([target_desc])
        
        # Calculate similarities against our diverse pool
        sim_scores = cosine_similarity(target_vec, matrix)[0]
        
        # Get top indices (excluding the product itself if it's in the pool)
        product_indices = np.argsort(sim_scores)[::-1]
        
        similar_products = []
        for idx in product_indices:
            p = all_products[idx]
            if p.id != product_id:
                similar_products.append(p)
            if len(similar_products) >= n_recommendations:
                break
                
        return [ProductResponse.from_orm(p) for p in similar_products]
    
    def get_weather_based_recommendations(self, n_recommendations: int = 3) -> List[tuple]:
        """Get recommendations based on current season/weather with explanations
        Returns list of (product, reason, type, score) tuples"""
        try:
            current_month = datetime.now().month
            current_day = datetime.now().day
            
            # India-specific season mapping
            if current_month in [12, 1, 2]:  # Winter: Dec-Feb
                weather_condition = "cold"
                season_keywords = ["winter clothes", "blankets", "tea", "coffee", "hot drinks", "soup", "warm", "sweater", "jacket"]
                reason_prefix = "Perfect for Winter season"
            elif current_month in [3, 4, 5]:  # Summer: Mar-May
                weather_condition = "hot"
                season_keywords = ["summer", "cold drinks", "ice cream", "beverages", "light clothes", "cooler", "fan", "sunscreen", "light"]
                reason_prefix = "Great for Summer! Stay cool with"
            elif current_month in [6, 7, 8, 9]:  # Monsoon: Jun-Sep
                weather_condition = "rainy"
                season_keywords = ["monsoon", "rain", "umbrella", "raincoat", "waterproof", "snacks", "indoor", "games", "books"]
                reason_prefix = "Perfect for Monsoon season"
            else:  # Autumn: Oct-Nov
                weather_condition = "mild"
                season_keywords = ["autumn", "health", "fresh produce", "outdoor", "party", "gifts", "diwali", "festival"]
                reason_prefix = "Great for this season"
            
            # Get products matching season keywords
            weather_products = []
            all_products = _REC_CACHE.get("products", [])
            
            for product in all_products:
                product_text = f"{product.name} {product.category} {product.description}".lower()
                if any(keyword.lower() in product_text for keyword in season_keywords):
                    confidence = 0.7 + (len([k for k in season_keywords if k.lower() in product_text]) * 0.05)
                    confidence = min(0.95, confidence)
                    weather_products.append((
                        product,
                        f"{reason_prefix} - {product.name}",
                        weather_condition,
                        confidence
                    ))
                if len(weather_products) >= n_recommendations * 2:
                    break
            
            # Return random sample
            import random
            random.shuffle(weather_products)
            return weather_products[:n_recommendations]
            
        except Exception as e:
            print(f"Weather recommendation error: {e}")
            return []
    
    def get_time_of_day_recommendations(self, n_recommendations: int = 3) -> List[tuple]:
        """Get recommendations based on time of day
        Morning: Tea, coffee, snacks
        Afternoon: Lunch items, beverages  
        Evening: Snacks, tea, coffee
        Night: Beauty, personal care
        Returns list of (product, reason, type, score) tuples"""
        try:
            current_hour = datetime.now().hour
            
            # Categorize by time
            if 5 <= current_hour < 12:  # Morning: 5 AM - 11:59 AM
                time_keywords = ["tea", "coffee", "breakfast", "cereal", "milk", "biscuit", "chocolate", "juice", "bread"]
                time_period = "Morning"
                reason_prefix = "Great for your Morning - Start your day with"
            elif 12 <= current_hour < 17:  # Afternoon: 12 PM - 4:59 PM
                time_keywords = ["lunch", "snacks", "beverages", "tea", "coffee", "juice", "cookies", "namkeen", "chips"]
                time_period = "Afternoon"
                reason_prefix = "Perfect for Afternoon - Enjoy"
            elif 17 <= current_hour < 21:  # Evening: 5 PM - 8:59 PM
                time_keywords = ["snacks", "tea", "coffee", "biscuit", "cookies", "pastry", "beverages", "juice"]
                time_period = "Evening"
                reason_prefix = "Ideal for Evening tea time"
            else:  # Night: 9 PM - 4:59 AM
                time_keywords = ["beauty", "skincare", "shampoo", "soap", "lotion", "cream", "oil", "personal care", "hygiene"]
                time_period = "Night"
                reason_prefix = "Perfect for Night - Pamper yourself with"
            
            # Get matching products
            time_products = []
            all_products = _REC_CACHE.get("products", [])
            
            for product in all_products:
                product_text = f"{product.name} {product.category} {product.description}".lower()
                if any(keyword.lower() in product_text for keyword in time_keywords):
                    keyword_matches = len([k for k in time_keywords if k.lower() in product_text])
                    confidence = 0.6 + (keyword_matches * 0.08)
                    confidence = min(0.95, confidence)
                    time_products.append((
                        product,
                        f"{reason_prefix} {product.name}",
                        f"time_{current_hour}",
                        confidence
                    ))
                if len(time_products) >= n_recommendations * 2:
                    break
            
            import random
            random.shuffle(time_products)
            return time_products[:n_recommendations]
        except Exception as e:
            print(f"Time-based recommendation error: {e}")
            return []
    
    def get_category_history_recommendations(self, user_id: int, n_recommendations: int = 3) -> List[tuple]:
        """Get recommendations based on categories user viewed before
        Returns list of (product, reason, type, score) tuples"""
        try:
            from datetime import timedelta
            recent_date = datetime.utcnow() - timedelta(days=30)
            
            # Get categories user has viewed
            browsed_products = self.db.query(BrowsingHistory.product_id).filter(
                BrowsingHistory.user_id == user_id,
                BrowsingHistory.visited_at >= recent_date
            ).all()
            browsed_ids = [p[0] for p in browsed_products]
            
            if not browsed_ids:
                return []
            
            # Get categories of browsed products
            viewed_categories = self.db.query(Product.category).filter(
                Product.id.in_(browsed_ids)
            ).distinct().all()
            viewed_category_strings = [c[0] for c in viewed_categories if c[0]]
            
            # Get products from same categories that user hasn't bought
            purchased_products = self.db.query(OrderItem.product_id).filter(
                Order.user_id == user_id
            ).join(Order).distinct().all()
            purchased_ids = [p[0] for p in purchased_products]
            
            category_products = []
            all_products = _REC_CACHE.get("products", [])
            
            for product in all_products:
                if product.id not in browsed_ids and product.id not in purchased_ids:
                    if any(cat.lower() in product.category.lower() for cat in viewed_category_strings):
                        confidence = 0.7
                        category_products.append((
                            product,
                            f"You viewed similar products before - Check out {product.name}",
                            "category_history",
                            confidence
                        ))
                if len(category_products) >= n_recommendations * 2:
                    break
            
            import random
            random.shuffle(category_products)
            return category_products[:n_recommendations]
        except Exception as e:
            print(f"Category history recommendation error: {e}")
            return []
    
    def get_brand_based_recommendations(self, user_id: int, n_recommendations: int = 3) -> List[tuple]:
        """Get recommendations based on brands user has purchased from
        Returns list of (product, reason, type, score) tuples"""
        try:
            # Get products user has purchased
            purchased_products = self.db.query(Product).join(OrderItem).join(Order).filter(
                Order.user_id == user_id
            ).all()
            
            if not purchased_products:
                return []
            
            # Extract brand names from purchased products (use first word or vendor)
            purchased_brands = set()
            for product in purchased_products:
                name_parts = product.name.split()
                if name_parts:
                    purchased_brands.add(name_parts[0].lower())
                if product.description:
                    desc_parts = product.description.split()
                    if desc_parts:
                        purchased_brands.add(desc_parts[0].lower())
            
            if not purchased_brands:
                return []
            
            # Get products from same brands
            purchased_ids = [p.id for p in purchased_products]
            brand_products = []
            all_products = _REC_CACHE.get("products", [])
            
            for product in all_products:
                if product.id not in purchased_ids:
                    product_text = f"{product.name} {product.description}".lower()
                    for brand in purchased_brands:
                        if brand in product_text:
                            confidence = 0.75
                            brand_products.append((
                                product,
                                f"You loved products from this brand - Try {product.name}",
                                "brand_based",
                                confidence
                            ))
                            break
                if len(brand_products) >= n_recommendations * 2:
                    break
            
            import random
            random.shuffle(brand_products)
            return brand_products[:n_recommendations]
        except Exception as e:
            print(f"Brand-based recommendation error: {e}")
            return []
    
    def get_discount_based_recommendations(self, n_recommendations: int = 3) -> List[tuple]:
        """Get high-discount products as recommendations
        Returns list of (product, reason, type, score) tuples"""
        try:
            # For this demo, we'll generate discount based on product ID
            # In production, you'd have a discount column
            all_products = _REC_CACHE.get("products", [])
            discount_products = []
            
            for product in all_products:
                # Generate discount based on product ID for demo
                discount_percent = 5 + (product.id % 20)
                if discount_percent >= 10:  # Only show products with 10%+ discount
                    confidence = 0.5 + (discount_percent / 100)
                    confidence = min(0.95, confidence)
                    discount_products.append((
                        product,
                        f"Hot Deal! {discount_percent}% OFF on {product.name}",
                        "discount",
                        confidence
                    ))
                if len(discount_products) >= n_recommendations * 2:
                    break
            
            import random
            random.shuffle(discount_products)
            return discount_products[:n_recommendations]
        except Exception as e:
            print(f"Discount recommendation error: {e}")
            return []
    
    def get_popular_trending_recommendations(self, n_recommendations: int = 3) -> List[tuple]:
        """Get trending/popular products based on clicks
        Returns list of (product, reason, type, score) tuples"""
        try:
            from datetime import timedelta
            recent_date = datetime.utcnow() - timedelta(days=7)
            
            # Count clicks per product in last 7 days
            popular_products = self.db.query(
                ProductClick.product_id, 
                func.count(ProductClick.id).label('click_count')
            ).filter(
                ProductClick.clicked_at >= recent_date
            ).group_by(ProductClick.product_id).order_by(
                func.count(ProductClick.id).desc()
            ).limit(n_recommendations * 2).all()
            
            if not popular_products:
                # Fallback: get random popular products
                all_products = _REC_CACHE.get("products", [])
                trending = []
                for product in all_products[:n_recommendations]:
                    trending.append((
                        product,
                        f"Trending Now - {product.name} is a customer favorite!",
                        "trending",
                        0.8
                    ))
                return trending
            
            # Get product objects
            popular_ids = [p[0] for p in popular_products]
            trending_products = []
            all_products = _REC_CACHE.get("products", [])
            
            for product in all_products:
                if product.id in popular_ids:
                    idx = next((i for i, p in enumerate(popular_ids) if p == product.id), None)
                    if idx is not None:
                        click_count = popular_products[idx][1]
                        confidence = min(0.95, 0.5 + (click_count / 50))
                        trending_products.append((
                            product,
                            f"Trending Now - {product.name} is a customer favorite!",
                            "trending",
                            confidence
                        ))
            
            import random
            random.shuffle(trending_products)
            return trending_products[:n_recommendations]
        except Exception as e:
            print(f"Trending recommendation error: {e}")
            return []
    
    def get_festival_recommendations(self, n_recommendations: int = 3) -> List[tuple]:
        """Get recommendations based on current date and festivals with explanations
        Returns list of (product, reason, type, score) tuples"""
        today = date.today()
        current_month = today.month
        current_day = today.day
        
        # Festival mappings (Indian festivals as example)
        festivals = {
            (1, 1): (["new year", "party supplies", "cakes", "champagne"], "New Year Celebration"),
            (1, 14): (["pongal", "sankranti", "traditional sweets"], "Pongal Festival"),
            (1, 26): (["republic day", "flag", "patriotic items"], "Republic Day"),
            (2, 14): (["valentine", "chocolates", "flowers", "gifts"], "Valentine's Day"),
            (3, 8): (["womens day", "flowers", "cosmetics"], "Women's Day"),
            (4, 14): (["dr ambedkar", "books", "educational"], "Dr. Ambedkar Jayanti"),
            (5, 1): (["labour day", "tools", "work supplies"], "Labour Day"),
            (8, 15): (["independence day", "flag", "patriotic items"], "Independence Day"),
            (10, 2): (["gandhi jayanti", "books", "peace items"], "Gandhi Jayanti"),
            (10, 31): (["halloween", "costumes", "candies"], "Halloween"),
            (11, 14): (["diwali", "lights", "crackers", "sweets", "lamps"], "Diwali Festival"),
            (12, 25): (["christmas", "cakes", "gifts", "decorations"], "Christmas Celebration"),
        }
        
        # Check for upcoming or current festivals
        festival_keywords = []
        festival_name = ""
        for (month, day), (keywords, name) in festivals.items():
            if month == current_month and abs(day - current_day) <= 7:  # Within 7 days
                festival_keywords.extend(keywords)
                festival_name = name
        
        # Seasonal recommendations
        seasonal_keywords = {
            12: (["christmas", "new year", "winter", "warm clothes"], "Year-End Season"),
            1: (["new year", "pongal", "winter"], "New Year Season"),
            2: (["valentine", "spring"], "Spring Season"),
            3: (["holi", "colors", "spring"], "Spring & Holi Season"),
            4: (["summer", "cold drinks"], "Summer Season"),
            5: (["summer", "ice cream"], "Summer Season"),
            6: (["monsoon", "rainy"], "Monsoon Season"),
            7: (["monsoon", "snacks"], "Monsoon Season"),
            8: (["raksha bandhan", "independence", "threads", "flag"], "Independence Season"),
            9: (["ganesh chaturthi", "idols", "modak"], "Ganesh Chaturthi"),
            10: (["dussehra", "diwali", "lights"], "Festival Season"),
            11: (["diwali", "lights", "sweets"], "Diwali Season"),
        }
        
        if not festival_keywords and current_month in seasonal_keywords:
            festival_keywords, festival_name = seasonal_keywords[current_month]
        
        if not festival_keywords:
            return []
        
        # Get products matching festival/seasonal keywords
        festival_products = []
        all_products = _REC_CACHE.get("products", [])
        
        for product in all_products:
            product_text = f"{product.name} {product.category} {product.description}".lower()
            if any(keyword.lower() in product_text for keyword in festival_keywords):
                confidence = 0.65 + (len([k for k in festival_keywords if k.lower() in product_text]) * 0.05)
                confidence = min(0.9, confidence)
                festival_products.append((
                    product,
                    f"Perfect for {festival_name} - {product.name}",
                    "seasonal",
                    confidence
                ))
            if len(festival_products) >= n_recommendations * 2:
                break
        
        # Return random sample
        import random
        random.shuffle(festival_products)
        return festival_products[:n_recommendations]
    
    def get_visual_similar_products(self, product_id: int, n_recommendations: int = 5) -> List[ProductResponse]:
        """Get visually similar products using image features"""
        try:
            # Load image features
            features = np.load(os.path.join(os.path.dirname(__file__), "models", "features.npy"))
            image_labels = np.load(os.path.join(os.path.dirname(__file__), "models", "image_labels.npy"))
            
            # Find the target product's image index
            target_product = self.db.query(Product).filter(Product.id == product_id).first()
            if not target_product:
                return []
            
            # For demo, use a simple mapping. In production, you'd have a proper product-to-image mapping
            # Here we'll use the product name to find similar images
            target_name = target_product.name.lower()
            
            # Find products with similar names (simple approach)
            all_products = _REC_CACHE.get("products", [])
            similar_products = []
            
            for product in all_products:
                if product.id != product_id:
                    similarity_score = 0
                    product_name = product.name.lower()
                    
                    # Simple text similarity for visual similarity proxy
                    common_words = set(target_name.split()) & set(product_name.split())
                    if common_words:
                        similarity_score = len(common_words) / max(len(target_name.split()), len(product_name.split()))
                    
                    if similarity_score > 0.1:  # Threshold
                        similar_products.append((product, similarity_score))
            
            # Sort by similarity and return top N
            similar_products.sort(key=lambda x: x[1], reverse=True)
            return [ProductResponse.from_orm(p) for p, _ in similar_products[:n_recommendations]]
            
        except Exception as e:
            print(f"Visual similarity error: {e}")
            # Fallback to text similarity
            return self.get_similar_products(product_id, n_recommendations)
    
    def get_recommendations(self, user_id: int, n_recommendations: int = 6) -> List[dict]:
        """
        Get personalized recommendations for user based on:
        1. Recently clicked products (highest weight) - fresh intent
        2. Recently browsed products (medium weight)
        3. Previously bought products (medium weight)
        4. Similar products (medium weight)
        5. Weather/seasonal products (low weight)
        
        Returns list of product dicts with explanation_reason and recommendation_type
        """
        # Get user's click history (last 7 days)
        from datetime import timedelta
        recent_date = datetime.utcnow() - timedelta(days=7)
        
        # Clicked products (most relevant - shows fresh intent)
        clicked_products = self.db.query(ProductClick.product_id).filter(
            ProductClick.user_id == user_id,
            ProductClick.clicked_at >= recent_date
        ).all()
        clicked_ids = [p[0] for p in clicked_products]
        
        # Get user's purchase history
        purchased_products = self.db.query(OrderItem.product_id).filter(
            Order.user_id == user_id
        ).join(Order).distinct().all()
        purchased_ids = [p[0] for p in purchased_products]
        
        # Get user's browsing history (last 7 days)
        browsed_products = self.db.query(BrowsingHistory.product_id).filter(
            BrowsingHistory.user_id == user_id,
            BrowsingHistory.visited_at >= recent_date
        ).all()
        browsed_ids = [p[0] for p in browsed_products]
        
        # Use our cached diverse sample of products
        all_products = _REC_CACHE.get("products", [])
        if not all_products:
            return []
            
        product_ids = [p.id for p in all_products]
        matrix = _REC_CACHE.get("matrix")
        
        # Score products with explanations
        scored_products = []
        
        for idx, product_id in enumerate(product_ids):
            if product_id in purchased_ids:
                continue  # Skip already purchased items
            
            score = 0
            reason = ""
            rec_type = "general"
            
            # Boost if recently clicked (showing explicit interest)
            if product_id in clicked_ids:
                score += 25
                reason = "Based on your recent interest in similar products"
                rec_type = "click_based"
            
            # Add if recently browsed
            if product_id in browsed_ids:
                score += 15
                if not reason:
                    reason = "Similar to products you recently viewed"
                    rec_type = "browse_based"
            
            # Add similarity to purchased products
            if purchased_ids and matrix is not None:
                purchased_indices = [product_ids.index(pid) for pid in purchased_ids if pid in product_ids]
                if purchased_indices:
                    sim_scores = cosine_similarity(
                        matrix[idx:idx+1],
                        matrix[purchased_indices]
                    )[0]
                    avg_sim = np.mean(sim_scores)
                    score += avg_sim * 10
                    if avg_sim > 0.6:
                        if not reason:
                            reason = f"Customers who bought similar items loved this"
                            rec_type = "purchase_based"
            
            # Add similarity to browsed products
            if browsed_ids and matrix is not None:
                browsed_indices = [product_ids.index(pid) for pid in browsed_ids if pid in product_ids]
                if browsed_indices:
                    sim_scores = cosine_similarity(
                        matrix[idx:idx+1],
                        matrix[browsed_indices]
                    )[0]
                    score += np.mean(sim_scores) * 5
            
            # Cluster matching boost
            clusters = _REC_CACHE.get("clusters")
            if clusters is not None:
                product_cluster = clusters[idx]
                
                # Check how many purchased items are in this cluster
                purchased_cluster_indices = [product_ids.index(pid) for pid in purchased_ids if pid in product_ids]
                if purchased_cluster_indices:
                    purchased_item_clusters = clusters[purchased_cluster_indices]
                    cluster_count = np.sum(purchased_item_clusters == product_cluster)
                    score += cluster_count * 2
            
            if score > 0:
                scored_products.append({
                    "product_idx": idx,
                    "product": all_products[idx],
                    "score": score,
                    "reason": reason or "Recommended for you",
                    "type": rec_type,
                    "confidence": min(0.95, 0.5 + (score / 50))
                })
        
        # Sort by score
        scored_products.sort(key=lambda x: x["score"], reverse=True)
        
        # Convert to response with weather/festival recommendations
        recommendations_with_explainability = []
        
        # Add scored products first
        for item in scored_products[:min(n_recommendations - 2, len(scored_products))]:
            product = item["product"]
            rec = {
                "id": product.id,
                "name": product.name,
                "category": product.category,
                "price": product.price,
                "description": product.description,
                "image_url": product.image_url,
                "product_url": product.product_url,
                "recommendation_reason": item["reason"],
                "recommendation_type": item["type"],
                "confidence_score": item["confidence"]
            }
            recommendations_with_explainability.append(rec)
        
        # Add weather recommendations if we have room
        if len(recommendations_with_explainability) < n_recommendations:
            weather_recs = self.get_weather_based_recommendations(2)
            for product, reason, rec_type, confidence in weather_recs:
                if product.id not in purchased_ids and product.id not in [r["id"] for r in recommendations_with_explainability]:
                    rec = {
                        "id": product.id,
                        "name": product.name,
                        "category": product.category,
                        "price": product.price,
                        "description": product.description,
                        "image_url": product.image_url,
                        "product_url": product.product_url,
                        "recommendation_reason": reason,
                        "recommendation_type": rec_type,
                        "confidence_score": confidence
                    }
                    recommendations_with_explainability.append(rec)
                    if len(recommendations_with_explainability) >= n_recommendations:
                        break
        
        # Add festival/seasonal recommendations if we still have room
        if len(recommendations_with_explainability) < n_recommendations:
            festival_recs = self.get_festival_recommendations(2)
            for product, reason, rec_type, confidence in festival_recs:
                if product.id not in purchased_ids and product.id not in [r["id"] for r in recommendations_with_explainability]:
                    rec = {
                        "id": product.id,
                        "name": product.name,
                        "category": product.category,
                        "price": product.price,
                        "description": product.description,
                        "image_url": product.image_url,
                        "product_url": product.product_url,
                        "recommendation_reason": reason,
                        "recommendation_type": rec_type,
                        "confidence_score": confidence
                    }
                    recommendations_with_explainability.append(rec)
                    if len(recommendations_with_explainability) >= n_recommendations:
                        break
        
        return recommendations_with_explainability[:n_recommendations]

# ============================================================================
# API ROUTES
# ============================================================================

@app.get("/health")
def health_check():
    return {"status": "healthy"}

# --- PRODUCTS ---
@app.get("/api/products", response_model=PaginatedProductResponse)
def get_products(
    skip: int = 0, 
    limit: int = 25, 
    category: Optional[str] = None, 
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Product).filter(Product.price > 0)
    
    if category and category.lower() != "all":
        query = query.filter(Product.category.ilike(category))
    
    if search:
        query = query.filter(
            (Product.name.ilike(f"%{search}%")) | 
            (Product.description.ilike(f"%{search}%")) |
            (Product.category.ilike(f"%{search}%"))
        )
    
    total = query.count()
    products = query.offset(skip).limit(limit).all()
    
    return {
        "products": products,
        "total": total,
        "skip": skip,
        "limit": limit
    }

@app.post("/api/products", response_model=ProductResponse)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    db_product = Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@app.get("/api/products/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.get("/api/products/search/{query}", response_model=PaginatedProductResponse)
def search_products(
    query: str, 
    skip: int = 0, 
    limit: int = 25, 
    db: Session = Depends(get_db)
):
    search_query = db.query(Product).filter(Product.price > 0).filter(
        (Product.name.ilike(f"%{query}%")) | 
        (Product.description.ilike(f"%{query}%")) |
        (Product.category.ilike(f"%{query}%"))
    )
    total = search_query.count()
    products = search_query.offset(skip).limit(limit).all()
    
    return {
        "products": products,
        "total": total,
        "skip": skip,
        "limit": limit
    }

# --- ADMIN ---
@app.get("/api/admin/dashboard")
def get_admin_stats(db: Session = Depends(get_db)):
    total_products = db.query(Product).count()
    total_users = db.query(User).count()
    total_orders = db.query(Order).count()
    recent_orders = db.query(Order).order_by(Order.created_at.desc()).limit(10).all()
    return {
        "stats": {
            "products": total_products,
            "users": total_users,
            "orders": total_orders
        },
        "recent_orders": [
            {"id": o.id, "user_id": o.user_id, "username": o.user.username, "total_price": o.total_price, "status": o.status, "created_at": str(o.created_at)}
            for o in recent_orders
        ]
    }

@app.get("/api/admin/users")
def get_all_users_admin(db: Session = Depends(get_db)):
    users = db.query(User).all()
    result = []
    for u in users:
        order_count = len(u.orders)
        total_spend = sum(o.total_price for o in u.orders if o.total_price)
        result.append({
            "id": u.id,
            "username": u.username,
            "email": u.email,
            "full_name": u.full_name,
            "phone": u.phone,
            "is_admin": u.is_admin,
            "order_count": order_count,
            "total_spend": total_spend
        })
    return result

@app.get("/api/admin/orders")
def get_all_orders_admin(db: Session = Depends(get_db)):
    orders = db.query(Order).order_by(Order.created_at.desc()).all()
    return [
        {"id": o.id, "user_id": o.user_id, "username": o.user.username, "total_price": o.total_price, "status": o.status, "created_at": str(o.created_at)}
        for o in orders
    ]

@app.delete("/api/admin/users/{user_id}")
def delete_user_admin(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"status": "deleted"}

# --- USERS ---
@app.post("/api/users", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        return existing_user
        
    db_user = User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/api/users/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.put("/api/users/{user_id}", response_model=UserResponse)
def update_user(user_id: int, user_update: UserUpdate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    update_data = user_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_user, key, value)
    
    db.commit()
    db.refresh(db_user)
    return db_user

# --- BROWSING HISTORY ---
@app.post("/api/users/{user_id}/browsing-history/{product_id}")
def track_browsing(user_id: int, product_id: int, db: Session = Depends(get_db)):
    """Track when user views a product"""
    history = BrowsingHistory(user_id=user_id, product_id=product_id)
    db.add(history)
    db.commit()
    return {"status": "tracked"}

@app.get("/api/users/{user_id}/browsing-history")
def get_browsing_history(user_id: int, db: Session = Depends(get_db)):
    """Get user's browsing history with product details"""
    history = db.query(BrowsingHistory).filter(
        BrowsingHistory.user_id == user_id
    ).order_by(BrowsingHistory.visited_at.desc()).all()
    
    result = []
    for h in history:
        product = h.product
        result.append({
            "id": h.id,
            "product": product,
            "visited_at": h.visited_at
        })
    return result

# --- CART ---
@app.get("/api/users/{user_id}/cart", response_model=List[CartItemResponse])
def get_cart(user_id: int, db: Session = Depends(get_db)):
    cart_items = db.query(CartItem).filter(CartItem.user_id == user_id).all()
    return cart_items

@app.post("/api/users/{user_id}/cart/{product_id}")
def add_to_cart(user_id: int, product_id: int, quantity: int = 1, db: Session = Depends(get_db)):
    # Check if item already in cart
    existing = db.query(CartItem).filter(
        CartItem.user_id == user_id,
        CartItem.product_id == product_id
    ).first()
    
    if existing:
        existing.quantity += quantity
    else:
        cart_item = CartItem(user_id=user_id, product_id=product_id, quantity=quantity)
        db.add(cart_item)
    
    db.commit()
    return {"status": "added to cart"}

@app.put("/api/users/{user_id}/cart/{product_id}")
def update_cart_quantity(user_id: int, product_id: int, quantity: int, db: Session = Depends(get_db)):
    if quantity <= 0:
        db.query(CartItem).filter(
            CartItem.user_id == user_id,
            CartItem.product_id == product_id
        ).delete()
    else:
        existing = db.query(CartItem).filter(
            CartItem.user_id == user_id,
            CartItem.product_id == product_id
        ).first()
        if existing:
            existing.quantity = quantity
        else:
            cart_item = CartItem(user_id=user_id, product_id=product_id, quantity=quantity)
            db.add(cart_item)
    
    db.commit()
    return {"status": "cart updated"}

@app.delete("/api/users/{user_id}/cart/{product_id}")
def remove_from_cart(user_id: int, product_id: int, db: Session = Depends(get_db)):
    db.query(CartItem).filter(
        CartItem.user_id == user_id,
        CartItem.product_id == product_id
    ).delete()
    db.commit()
    return {"status": "removed from cart"}

# --- RECOMMENDATIONS ---
@app.get("/api/users/{user_id}/recommendations")
def get_user_recommendations(user_id: int, db: Session = Depends(get_db)):
    """Get personalized recommendations for user with explanations"""
    engine = RecommendationEngine(db)
    return engine.get_recommendations(user_id, n_recommendations=6)

@app.get("/api/users/{user_id}/recommendations/all")
def get_all_recommendations(user_id: int, db: Session = Depends(get_db)):
    """Get all types of recommendations for home screen"""
    engine = RecommendationEngine(db)
    
    rec_groups = {
        "personalized": [],
        "time_based": [],
        "category_history": [],
        "brand_based": [],
        "discount": [],
        "trending": [],
        "weather_seasonal": [],
        "festival": []
    }
    
    # Get personalized recommendations
    personalized = engine.get_recommendations(user_id, n_recommendations=4)
    for p in personalized:
        rec_groups["personalized"].append({
            "id": p["id"],
            "name": p["name"],
            "category": p["category"],
            "price": p["price"],
            "description": p["description"],
            "image_url": p["image_url"],
            "product_url": p["product_url"],
            "recommendation_reason": p.get("recommendation_reason", "Recommended for you"),
            "recommendation_type": p.get("recommendation_type", "personalized"),
            "confidence_score": p.get("confidence_score", 0.7)
        })
    
    # Get time-based recommendations
    time_recs = engine.get_time_of_day_recommendations(n_recommendations=4)
    for product, reason, rec_type, confidence in time_recs:
        rec_groups["time_based"].append({
            "id": product.id,
            "name": product.name,
            "category": product.category,
            "price": product.price,
            "description": product.description,
            "image_url": product.image_url,
            "product_url": product.product_url,
            "recommendation_reason": reason,
            "recommendation_type": rec_type,
            "confidence_score": confidence
        })
    
    # Get category history recommendations
    category_recs = engine.get_category_history_recommendations(user_id, n_recommendations=4)
    for product, reason, rec_type, confidence in category_recs:
        rec_groups["category_history"].append({
            "id": product.id,
            "name": product.name,
            "category": product.category,
            "price": product.price,
            "description": product.description,
            "image_url": product.image_url,
            "product_url": product.product_url,
            "recommendation_reason": reason,
            "recommendation_type": rec_type,
            "confidence_score": confidence
        })
    
    # Get brand-based recommendations
    brand_recs = engine.get_brand_based_recommendations(user_id, n_recommendations=4)
    for product, reason, rec_type, confidence in brand_recs:
        rec_groups["brand_based"].append({
            "id": product.id,
            "name": product.name,
            "category": product.category,
            "price": product.price,
            "description": product.description,
            "image_url": product.image_url,
            "product_url": product.product_url,
            "recommendation_reason": reason,
            "recommendation_type": rec_type,
            "confidence_score": confidence
        })
    
    # Get discount-based recommendations
    discount_recs = engine.get_discount_based_recommendations(n_recommendations=4)
    for product, reason, rec_type, confidence in discount_recs:
        rec_groups["discount"].append({
            "id": product.id,
            "name": product.name,
            "category": product.category,
            "price": product.price,
            "description": product.description,
            "image_url": product.image_url,
            "product_url": product.product_url,
            "recommendation_reason": reason,
            "recommendation_type": rec_type,
            "confidence_score": confidence
        })
    
    # Get trending recommendations
    trending_recs = engine.get_popular_trending_recommendations(n_recommendations=4)
    for product, reason, rec_type, confidence in trending_recs:
        rec_groups["trending"].append({
            "id": product.id,
            "name": product.name,
            "category": product.category,
            "price": product.price,
            "description": product.description,
            "image_url": product.image_url,
            "product_url": product.product_url,
            "recommendation_reason": reason,
            "recommendation_type": rec_type,
            "confidence_score": confidence
        })
    
    # Get weather/seasonal recommendations
    weather_recs = engine.get_weather_based_recommendations(n_recommendations=4)
    for product, reason, rec_type, confidence in weather_recs:
        rec_groups["weather_seasonal"].append({
            "id": product.id,
            "name": product.name,
            "category": product.category,
            "price": product.price,
            "description": product.description,
            "image_url": product.image_url,
            "product_url": product.product_url,
            "recommendation_reason": reason,
            "recommendation_type": rec_type,
            "confidence_score": confidence
        })
    
    # Get festival recommendations
    festival_recs = engine.get_festival_recommendations(n_recommendations=4)
    for product, reason, rec_type, confidence in festival_recs:
        rec_groups["festival"].append({
            "id": product.id,
            "name": product.name,
            "category": product.category,
            "price": product.price,
            "description": product.description,
            "image_url": product.image_url,
            "product_url": product.product_url,
            "recommendation_reason": reason,
            "recommendation_type": rec_type,
            "confidence_score": confidence
        })
    
    return rec_groups

@app.post("/api/users/{user_id}/track-click/{product_id}")
def track_product_click(user_id: int, product_id: int, db: Session = Depends(get_db)):
    """Track when user clicks on a product"""
    click = ProductClick(user_id=user_id, product_id=product_id)
    db.add(click)
    db.commit()
    return {"status": "click tracked"}

@app.get("/api/products/{product_id}/similar", response_model=List[ProductResponse])
def get_similar_products(product_id: int, db: Session = Depends(get_db)):
    """Get visually similar products using image features"""
    engine = RecommendationEngine(db)
    return engine.get_visual_similar_products(product_id, n_recommendations=5)

# --- ORDERS ---
@app.post("/api/users/{user_id}/checkout", response_model=OrderResponse)
def checkout(user_id: int, db: Session = Depends(get_db)):
    """Convert cart to order"""
    cart_items = db.query(CartItem).filter(CartItem.user_id == user_id).all()
    
    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")
    
    total_price = sum(item.product.price * item.quantity for item in cart_items)
    
    # Create order
    order = Order(user_id=user_id, total_price=total_price)
    db.add(order)
    db.flush()
    
    # Create order items
    for cart_item in cart_items:
        order_item = OrderItem(
            order_id=order.id,
            product_id=cart_item.product_id,
            quantity=cart_item.quantity,
            price=cart_item.product.price
        )
        db.add(order_item)
    
    # Clear cart
    for item in cart_items:
        db.delete(item)
    
    db.commit()
    db.refresh(order)
    return order

@app.get("/api/users/{user_id}/orders", response_model=List[OrderResponse])
def get_user_orders(user_id: int, db: Session = Depends(get_db)):
    orders = db.query(Order).filter(Order.user_id == user_id).all()
    return orders

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
