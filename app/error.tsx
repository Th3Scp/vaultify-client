'use client' 
 
import { useEffect } from 'react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])
 
  return (
    <div>
      <h2>
        مشکلی پیش آمده است
      </h2>
      <button
        onClick={
          () => reset()
        }
      >
        دوباره امتحان کردن
      </button>
    </div>
  )
}