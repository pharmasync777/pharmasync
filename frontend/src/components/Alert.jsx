import React, { useEffect } from 'react'
import './Alert.css'

export default function Alert({ type = 'info', message, onClose, duration = 4000 }) {
  useEffect(() => {
    if (!message) return
    const t = setTimeout(onClose, duration)
    return () => clearTimeout(t)
  }, [message, duration, onClose])

  if (!message) return null

  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' }

  return (
    <div className={`alert alert-${type}`}>
      <span className="alert-icon">{icons[type]}</span>
      <span className="alert-msg">{message}</span>
      <button className="alert-close" onClick={onClose}>✕</button>
    </div>
  )
}
