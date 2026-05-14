# 📝 Internship Report Documentation: Small Basket

## Project Title
**Small Basket: Smart Product Recommendations with Explainable AI**

---

## 📄 Abstract

**Introduction:** 
Small Basket is a next-generation e-commerce platform designed to address the challenge of "choice overload" in digital marketplaces. While modern recommendation engines effectively filter large datasets, they often function as "black boxes," providing suggestions without clear justification, which can diminish user trust and engagement. 

**Problem:** 
Traditional e-commerce systems lack transparency, failing to explain why certain products are recommended to users. This opacity often results in lower conversion rates and a disconnected user experience, especially in massive catalogs where users struggle to find relevant items quickly.

**Our Solution:** 
To solve this, we developed a high-fidelity platform featuring a hybrid AI recommendation engine integrated with **Explainable AI (XAI)**. The system utilizes **TF-IDF Vectorization** and **K-Means Clustering** to analyze user behavior across three primary dimensions: search intent, browsing history, and purchase patterns. By grouping products into semantic segments, the engine delivers context-aware suggestions tailored to the time of day and seasonal trends. 

**Innovation:** 
The core innovation lies in the XAI layer, which provides real-time, human-readable explanations for every recommendation via visual badges and interactive model-info modals. This transparency allows users to understand whether a product is suggested based on their unique profile, seasonal trends, or AI-identified clusters.

**Conclusion:** 
Built using a modern stack of **React 18** and **FastAPI** with an **SQLite** backend, the platform demonstrates superior performance in managing a catalog of over 53,000 products. The integration of advanced AI models with transparent decision-making transforms the shopping experience into an interactive, trustworthy, and highly personalized dialogue.

**Keywords:** Explainable AI (XAI), E-commerce, Machine Learning, Recommendation Systems, K-Means Clustering, FastAPI, React, Data Transparency.

---

## 🛠️ Technical Framework (For Report)

| Layer | Technology | Role |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite | High-fidelity UI with real-time XAI badges |
| **Backend** | FastAPI (Python) | High-performance API and ML inference |
| **Database** | SQLite | Storage for 53k+ products and user history |
| **ML Models** | Scikit-learn (K-Means, TF-IDF) | Clustering and semantic similarity engine |
| **Explainability** | Custom XAI Logic | Rule-based and model-driven justifications |
| **Contextual AI** | Temporal Classifiers | Time-of-day and Seasonal intent mapping |

---

# Chapter 1: Introduction

## 1.1 Overview
The e-commerce industry has witnessed exponential growth over the last decade, transitioning from a luxury to a necessity. With millions of products available at a click, modern consumers face the "paradox of choice"—having too many options often leads to decision fatigue. **Small Basket** is an advanced e-commerce application designed to streamline the shopping experience by integrating state-of-the-art recommendation systems with Explainable AI (XAI). Inspired by industry leaders like BigBasket, this project serves as a high-fidelity replica that enhances the traditional shopping journey with intelligent, transparent, and contextually aware product suggestions.

## 1.2 Motivation
The primary motivation behind Small Basket is to humanize the digital shopping experience. While most platforms use complex algorithms to suggest products, the logic behind these suggestions remains hidden from the user. This "black-box" approach can lead to skepticism and missed opportunities for engagement. We were motivated to build a system that not only understands *what* a user wants but also explains *why* it is suggesting it. Furthermore, the lack of real-time contextual awareness in standard platforms—such as failing to recognize the difference between a morning breakfast run and a late-night snack craving—provided the impetus to develop a context-aware engine that adapts to time and season.

## 1.3 Problem Statement
Current e-commerce platforms suffer from three major shortcomings:
1.  **Information Overload:** Users are often overwhelmed by a catalog of thousands of items without a clear path to finding what they truly need.
2.  **Lack of Transparency:** Recommendations are often perceived as random or purely profit-driven, as users have no insight into the underlying selection criteria.
3.  **Static Context:** Most recommendation systems do not account for temporal factors like the time of day or changing seasons, leading to irrelevant suggestions (e.g., suggesting heavy cooking ingredients during peak breakfast hours).

## 1.4 Objective of the Project
The core objective of this project is to develop a comprehensive e-commerce platform that provides:
-   **Intelligent Personalization:** Leveraging a massive dataset of 53,106 products from BigBasket to deliver suggestions based on search history, purchase history, and real-time session activity.
-   **Explainable AI Integration:** Implementing visual justifications for every recommendation to build user trust and transparency.
-   **Context-Aware Intelligence:** Delivering seasonal and time-based suggestions (e.g., cool drinks in summer, hot foods in winter, and specific items for morning, afternoon, and evening).
-   **Administrative Control:** Providing a robust admin portal with data visualizations to monitor user activity and manage product inventory effectively.

## 1.5 Scope of the Project
Small Basket covers the full lifecycle of a modern e-commerce application. It includes a responsive frontend built with React for high performance, a FastAPI backend for efficient ML inference, and an SQLite database for scalable data management. The project scope encompasses extensive data preprocessing of the BigBasket dataset, implementation of clustering and similarity algorithms, and the development of an intuitive administrative dashboard for business intelligence.
---

# Chapter 2: System Analysis and Requirements

## 2.1 Functional Requirements
The system is designed to provide a seamless and transparent e-commerce experience. The core functional requirements include:

*   **Intelligent Product Retrieval:** A robust search and filtering engine that allows users to navigate a massive catalog of 53,106 products with sub-second latency.
*   **Hybrid Recommendation Engine:** Unlike traditional systems, this engine combines **TF-IDF Semantic Similarity** with **K-Means Clustering** to suggest products based on search intent, browsing history, and purchase patterns.
*   **Explainable AI (XAI) Integration:** A primary feature that provides real-time "Reasoning Badges" (e.g., *"Based on your recent search"*) for every recommendation to enhance user trust.
*   **Contextual & Seasonal Intelligence:** The system adapts to the **Time of Day** (Time-series mapping for breakfast, lunch, snacks, and dinner categories) and **Seasonal Keywords** (e.g., Summer/Winter highlights).
*   **Interactive Model Explainer:** An educational UI component that allows users to view the technical AI model (e.g., KNN, Cosine Similarity, or Clustering) behind their specific recommendations.
*   **Admin Dashboard & Analytics:** A secure administrative panel with real-time data visualizations to monitor user activity, system health, and product distribution.

## 2.2 Non-Functional Requirements
*   **Performance:** The system utilizes global backend caching (`_REC_CACHE`) to ensure recommendations are generated in under 500ms.
*   **Scalability:** The architecture is designed to handle the BigBasket dataset (53k+ items) efficiently using optimized vector matrices.
*   **Usability:** A premium, "BigBasket-inspired" UI/UX built with modern React patterns, ensuring mobile-first responsiveness.
*   **Maintainability:** A modular codebase with a clear separation between the FastAPI inference engine and the React frontend.

## 2.3 System Requirements

### 2.3.1 Hardware Requirements
*   **Processor:** Intel Core i3 or higher (Recommended i5/i7 for ML vectorization)
*   **RAM:** Minimum 8 GB (Required for in-memory processing of 53k product vectors)
*   **Storage:** 5 GB free space (For SQLite database and local project files)
*   **OS:** Windows 10/11, Linux, or macOS

### 2.3.2 Software Requirements
*   **Frontend Technologies:** React 18, Vite, Lucide React, Recharts (Visualizations)
*   **Backend Technologies:** FastAPI (Python), SQLAlchemy ORM, Pydantic
*   **Machine Learning Libraries:** Scikit-learn (TF-IDF, KMeans, Cosine Similarity), NumPy, Pandas
*   **Database:** SQLite (Relational)
*   **Development Tools:** Visual Studio Code, Git

## 2.4 Algorithms & Methodology
The project moves away from "Black Box" models by implementing interpretable algorithms:
1.  **TF-IDF (Term Frequency-Inverse Document Frequency):** Used for extracting semantic features from product metadata (Name, Category, Description).
2.  **K-Means Clustering:** An unsupervised ML model used to group products into **20 distinct AI segments** for advanced segment-based matching.
3.  **Cosine Similarity:** A mathematical metric used to calculate the distance between product vectors to find "Visually and Semantically Similar" items.
4.  **Temporal Categorization:** A rule-based logic that maps product categories to specific hours of the day for context-aware suggestions.

---

## 2.5 Security and UI Design
*   **Authentication:** The system uses a session-based guest user generation and a secure admin login mechanism.
*   **Data Protection:** Input validation and ORM-based queries are used to prevent SQL injection and ensure data integrity.
*   **UI Philosophy:** The design follows **Atomic Design principles**, ensuring that components like `ProductCard` and `XAI-Badge` are reusable and consistent across the application.
