import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Tambahan untuk mencegah pinch zoom gesture touchpad
document.addEventListener('wheel', function (e) {
  if (e.ctrlKey) {
    e.preventDefault()
  }
}, { passive: false })

document.addEventListener('gesturestart', function (e) {
  e.preventDefault()
})

document.addEventListener('gesturechange', function (e) {
  e.preventDefault()
})

document.addEventListener('gestureend', function (e) {
  e.preventDefault()
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)