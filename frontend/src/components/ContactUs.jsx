import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function ContactUs() {
  const navigate = useNavigate()

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '120px 2% 80px', fontFamily: 'ProximaNova, Helvetica, Arial, sans-serif' }}>
      {/* Breadcrumbs */}
      <div style={{ paddingTop: '8px', paddingBottom: '8px', borderColor: 'rgb(221, 221, 221)', borderBottomWidth: '0.8px', borderWidth: '0px 0px 0.8px', borderStyle: 'solid', marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', fontSize: '14px', color: 'rgb(13, 19, 0)' }}>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/') }} style={{ cursor: 'pointer', color: 'rgb(32, 32, 32)', textDecoration: 'none' }}>Home</a>
          <span style={{ padding: '0 8px' }}>/</span>
          <span style={{ fontWeight: 600 }}>Contact Us</span>
        </div>
      </div>

      <div style={{ background: '#fff', padding: '60px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '20px' }}>Contact Customer Service</h1>
        <p style={{ color: '#666', fontSize: '18px', marginBottom: '40px' }}>We are here to help you with any issues or queries you might have.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          {/* Email Support */}
          <div style={{ padding: '30px', background: '#f9f9f9', borderRadius: '8px', border: '1px solid #eee' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'rgb(94, 148, 0)', marginBottom: '15px' }}>Email Support</h3>
            <p style={{ color: '#444', marginBottom: '10px' }}>For order status or general queries:</p>
            <p style={{ fontWeight: 600, color: '#222' }}>support@smallbasket.com</p>
          </div>

          {/* Call Support */}
          <div style={{ padding: '30px', background: '#f9f9f9', borderRadius: '8px', border: '1px solid #eee' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'rgb(94, 148, 0)', marginBottom: '15px' }}>Call Us</h3>
            <p style={{ color: '#444', marginBottom: '10px' }}>Available 7 AM - 10 PM:</p>
            <p style={{ fontWeight: 600, color: '#222' }}>1800-SMALL-BASKET</p>
          </div>

          {/* Address */}
          <div style={{ padding: '30px', background: '#f9f9f9', borderRadius: '8px', border: '1px solid #eee' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'rgb(94, 148, 0)', marginBottom: '15px' }}>Headquarters</h3>
            <p style={{ color: '#444' }}>123 Green Lane, Tech Park</p>
            <p style={{ color: '#444' }}>Bangalore, Karnataka - 560001</p>
          </div>
        </div>

        <div style={{ marginTop: '50px', borderTop: '1px solid #eee', paddingTop: '40px' }}>
          <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '20px' }}>Send us a message</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <input type="text" placeholder="Your Name" style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd', outline: 'none' }} />
            <input type="email" placeholder="Your Email" style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd', outline: 'none' }} />
            <textarea placeholder="How can we help?" style={{ gridColumn: 'span 2', padding: '12px', height: '120px', borderRadius: '6px', border: '1px solid #ddd', outline: 'none', resize: 'none' }}></textarea>
            <button style={{ background: 'rgb(94, 148, 0)', color: '#fff', padding: '14px', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', gridColumn: 'span 2' }}>SUBMIT MESSAGE</button>
          </div>
        </div>
      </div>
    </div>
  )
}
