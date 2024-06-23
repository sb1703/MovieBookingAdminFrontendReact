import { useState, useEffect } from "react"

function useDebounce(value, delay, cancel) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    if(cancel === true) return
    
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export default useDebounce
