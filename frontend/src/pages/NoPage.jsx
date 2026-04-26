import React from 'react'
import { useNavigate } from 'react-router-dom'

const NoPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-6xl font-bold text-accent">404</h1>
      <p className="text-xl text-primary font-semibold">Page not found</p>
      <p className="text-muted text-sm">The page you're looking for doesn't exist.</p>
      <button onClick={() => navigate('/')} className="btnBlue mt-2">Go Home</button>
    </div>
  )
}

export default NoPage