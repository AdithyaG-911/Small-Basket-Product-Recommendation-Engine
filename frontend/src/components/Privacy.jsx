import React from 'react'

export default function Privacy({ onBack }) {
  return (
    <div className="static-page">
      <div className="static-content">
        <button className="back-button" onClick={onBack} type="button">Back</button>
        <h1>Privacy Policy — Small Basket</h1>
        <p>Small Basket respects your privacy. This policy explains how we collect, use, and protect your information.</p>
        <h2>Information We Collect</h2>
        <p>We collect information you provide when creating an account, placing orders, or interacting with our services.</p>
        <h2>How We Use Information</h2>
        <p>We use information to process orders, personalize your experience, and improve our services. We do not sell your personal data.</p>
        <h2>Contact</h2>
        <p>Questions about this policy? Email privacy@smallbasket.example</p>
      </div>
    </div>
  )
}
