import { useState, useEffect } from 'react'

const OfflineBanner = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (isOnline) return null

  return (
    <div className="fixed top-0 left-0 w-full bg-red-600 text-white text-center py-2 px-4 z-[100] font-medium shadow-md transition-all duration-300">
      You are currently offline. Check your internet connection.
    </div>
  )
}

export default OfflineBanner