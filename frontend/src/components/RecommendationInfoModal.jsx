import React from 'react';

const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
    backdropFilter: 'blur(4px)',
  },
  content: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '12px',
    maxWidth: '500px',
    width: '90%',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    position: 'relative',
    animation: 'modalFadeIn 0.3s ease-out',
  },
  closeBtn: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#666',
  },
  title: {
    fontSize: '22px',
    fontWeight: 700,
    color: '#202020',
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  description: {
    fontSize: '15px',
    color: '#4b5563',
    lineHeight: '1.6',
    marginBottom: '20px',
  },
  modelDetails: {
    backgroundColor: '#f9fafb',
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
  },
  modelLabel: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '8px',
    display: 'block',
  },
  modelName: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#059669',
    display: 'block',
    marginBottom: '5px',
  },
  modelInfo: {
    fontSize: '13px',
    color: '#6b7280',
  }
};

const infoMap = {
  session: {
    title: 'Session-Based Recommendations',
    description: 'These products are picked in real-time based on your current browsing session. Our AI analyzes your active search queries and the categories you are exploring to suggest relevant items that match your immediate intent.',
    model: 'TF-IDF Vectorizer + Cosine Similarity',
    details: 'Uses a natural language processing model to convert product metadata into mathematical vectors and finds the shortest distance between your intent and our catalog.'
  },
  seasonal: {
    title: 'Seasonal Intelligence',
    description: 'Our seasonal model monitors real-world temporal data and trends. It identifies products that have high demand during specific months or weather conditions (like summer essentials) to ensure you see the most timely items.',
    model: 'Temporal Trend Analysis Model',
    details: 'Weights products based on seasonal coefficients and keyword correlation scores matched against the current date.'
  },
  context: {
    title: 'Context-Aware Engine',
    description: 'This model understands the "when" of your shopping. By analyzing the current time of day, it prioritizes items traditionally bought during those hours—like breakfast items in the morning or dinner essentials in the evening.',
    model: 'Circadian Preference Classifier',
    details: 'A time-series model that maps purchase probability distributions across 24-hour cycles for various product categories.'
  },
  search: {
    title: 'Search Intent Retrieval',
    description: 'This engine looks deep into your search history to understand your long-term interests. It doesn\'t just look for exact matches but finds products that are semantically related to what you have searched for in the past.',
    model: 'Semantic Search Embeddings',
    details: 'Utilizes a lightweight embedding model to map your search queries to a high-dimensional feature space to retrieve semantically similar products.'
  },
  purchase: {
    title: 'Purchase Pattern Recognition',
    description: 'This is our most accurate model. It analyzes your past orders to identify cross-category associations. If you buy milk, it knows you might need cereal; if you buy soap, it suggests other personal care items from similar high-quality brands.',
    model: 'Collaborative Filtering / Market Basket Analysis',
    details: 'Uses association rule learning (Apriori) and clustering to find items frequently bought together by users with similar profiles.'
  },
  browsing: {
    title: 'Browsing Recency Model',
    description: 'Focuses on your short-term memory. It identifies products related to the specific items you have viewed recently, helping you compare alternatives or find complementary products to the ones you were just looking at.',
    model: 'Product-to-Product KNN',
    details: 'A K-Nearest Neighbors implementation that finds the closest products in feature space based on the specific attributes of your viewed items.'
  },
  discount: {
    title: 'High-Value Discount Engine',
    description: 'Scans our catalog for products with significant price drops and exclusive offers. We prioritize quality products that currently offer the best value for money based on their historical pricing.',
    model: 'Yield Optimization Scorer',
    details: 'Calculates the discount delta and sorts items by popularity-to-price ratio to ensure recommendations are both cheap and high-quality.'
  },
  brand: {
    title: 'Brand Affinity Model',
    description: 'Analyzes your interaction history to find brands you prefer. If you consistently buy or look at products from a specific company, this model surfaces other high-rated items from their catalog.',
    model: 'Collaborative Brand Filtering',
    details: 'Maps user-brand interaction matrices and applies weighted scoring to products belonging to frequently visited vendors.'
  },
  categoryInterest: {
    title: 'Category Depth Analyzer',
    description: 'Looks beyond individual products to understand the categories you are most interested in. It surfaces top-rated items in those categories that you have not seen yet to help you discover new favorites.',
    model: 'Interest Distribution Profiler',
    details: 'Aggregates browsing duration and frequency at the category level to build a probabilistic model of user interest areas.'
  },
  popularity: {
    title: 'Crowd-Sourced Popularity Engine',
    description: 'Surfaces products that are currently trending based on high average ratings and a large volume of positive reviews. We prioritize items that the community consistently validates as high quality.',
    model: 'Bayesian Rating Estimator',
    details: 'Calculates a weighted average of ratings against review volume to prevent low-volume products from skewing the trending list.'
  },
  healthy: {
    title: 'Wellness & Nutrition Classifier',
    description: 'Identifies products that promote a healthy lifestyle. Our model scans ingredients and product attributes for keywords like "organic", "natural", and "fresh" to help you find nutritious options easily.',
    model: 'Semantic Health Filter',
    details: 'Uses keyword clustering and category-based filtering to isolate products with positive health-related attributes.'
  },
  budget: {
    title: 'Value-for-Money Optimizer',
    description: 'Specifically designed to find the best quality products at the lowest price points. It looks for items under ₹150 that maintain high customer satisfaction scores.',
    model: 'Price-to-Quality Scorer',
    details: 'Sorts the catalog by price while maintaining a quality floor based on customer feedback and brand reliability.'
  },
  newArrival: {
    title: 'Catalog Freshness Detector',
    description: 'Monitors the latest additions to our warehouse. This model ensures you are always aware of new product launches and seasonal stock updates as soon as they become available.',
    model: 'Temporal Ingestion Tracker',
    details: 'A simple recency-based filter that prioritizes items with the latest entry timestamps in our inventory database.'
  }
};

export default function RecommendationInfoModal({ type, onClose }) {
  const info = infoMap[type] || infoMap.session;

  if (!type) return null;

  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div style={modalStyles.content} onClick={e => e.stopPropagation()}>
        <button style={modalStyles.closeBtn} onClick={onClose}>&times;</button>
        <div style={modalStyles.title}>
          <span>🤖</span> {info.title}
        </div>
        <p style={modalStyles.description}>{info.description}</p>
        <div style={modalStyles.modelDetails}>
          <span style={modalStyles.modelLabel}>AI Model in Use</span>
          <span style={modalStyles.modelName}>{info.model}</span>
          <p style={modalStyles.modelInfo}>{info.details}</p>
        </div>
        <button
          onClick={onClose}
          style={{
            marginTop: '25px',
            width: '100%',
            padding: '12px',
            backgroundColor: '#059669',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          GOT IT
        </button>
      </div>
    </div>
  );
}
