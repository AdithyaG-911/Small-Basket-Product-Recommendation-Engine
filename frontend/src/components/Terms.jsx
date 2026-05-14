import React from 'react'

export default function Terms({ onBack }) {
  return (
    <div className="static-page">
      <div className="static-content">
        <button className="back-button" onClick={onBack} type="button">Back</button>
        <h1>Terms & Conditions — Small Basket</h1>
        <p>Welcome to Small Basket. By using our services, you agree to the following terms and conditions. Please read carefully.</p>
        <h2>Using the Service</h2>
        <p>Small Basket provides an online marketplace for grocery and household items. You agree to use the service in compliance with all laws and regulations.</p>
        <h2>Accounts</h2>
        <p>You are responsible for maintaining the confidentiality of your account. You may be held liable for any activity that occurs under your account.</p>
        <h2>Purchases</h2>
        <p>All purchases are subject to availability and acceptance. Orders may be cancelled or modified by Small Basket under certain conditions.</p>
        <h2>Contact</h2>
        <p>For questions about these Terms, contact support@smallbasket.example</p>
      </div>
    </div>
  )
}
