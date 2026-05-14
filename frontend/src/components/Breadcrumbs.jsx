import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Breadcrumbs({ items = [] }) {
  const navigate = useNavigate()

  return (
    <div style={{ paddingTop: '8px', paddingBottom: '8px', borderColor: 'rgb(221, 221, 221)', borderBottomWidth: '0.8px', borderWidth: '0px 0px 0.8px', borderStyle: 'solid', marginBottom: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', fontSize: '14px', color: 'rgb(13, 19, 0)' }}>
        
        {/* Home Link always first */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/') }} style={{ alignItems: 'center', display: 'flex', cursor: 'pointer', color: 'rgb(13, 19, 0)', textDecoration: 'none' }}>
            <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ height: '20px', marginRight: '2px' }}>
              <path fillRule="evenodd" clipRule="evenodd" d="M14.242 15H12V9.75a.75.75 0 0 0-.75-.75h-4.5a.75.75 0 0 0-.75.75V15H3.75l.005-6.313 5.244-5.363 5.251 5.394L14.242 15ZM7.5 15h3v-4.5h-3V15Zm7.818-7.361L9.536 1.726a.772.772 0 0 0-1.072 0L2.68 7.64a1.556 1.556 0 0 0-.431 1.078V15c0 .827.635 1.5 1.416 1.5h10.667c.781 0 1.417-.673 1.417-1.5V8.718c0-.404-.158-.797-.432-1.08Z" fill="#202020" />
            </svg>
            <span style={{ lineHeight: '20px', fontSize: '16px', color: 'rgb(32, 32, 32)' }}>Home</span>
          </a>
          <span style={{ padding: '0 8px', display: 'block' }}>/</span>
        </div>

        {items.map((item, idx) => {
          const isLast = idx === items.length - 1
          return (
            <div key={idx} style={{ display: 'flex', alignItems: 'center' }}>
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); !isLast && item.path && navigate(item.path) }} 
                style={{ 
                  display: 'flex', alignItems: 'center', cursor: isLast ? 'default' : 'pointer', 
                  color: 'rgb(13, 19, 0)', textDecoration: 'none' 
                }}
              >
                <span style={{ 
                  lineHeight: '20px', fontSize: '16px', color: 'rgb(32, 32, 32)', 
                  fontWeight: isLast ? 600 : 400 
                }}>
                  {item.label}
                </span>
              </a>
              {!isLast && <span style={{ padding: '0 8px', display: 'block' }}>/</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
