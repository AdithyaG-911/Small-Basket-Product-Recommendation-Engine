import React from 'react';
import '../TopLoader.css';

export default function TopLoader({ isVisible }) {
  if (!isVisible) return null;

  return (
    <div className="top-loader-container">
      <div className="top-loader-bar">
        <div className="top-loader-highlight"></div>
      </div>
    </div>
  );
}
