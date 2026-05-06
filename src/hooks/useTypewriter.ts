import { useState, useEffect, useCallback } from 'react'

interface UseTypewriterOptions {
  text: string
  speed?: number
  onComplete?: () => void
}

interface UseTypewriterReturn {
  displayText: string
  isComplete: boolean
  reset: () => void
}

export function useTypewriter({
  text,
  speed = 300,
  onComplete
}: UseTypewriterOptions): UseTypewriterReturn {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (!text) {
      setDisplayText('')
      setCurrentIndex(0)
      setIsComplete(false)
      return
    }

    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, speed)

      return () => clearTimeout(timer)
    } else if (currentIndex === text.length && !isComplete) {
      setIsComplete(true)
      onComplete?.()
    }
  }, [text, currentIndex, speed, isComplete, onComplete])

  const reset = useCallback(() => {
    setDisplayText('')
    setCurrentIndex(0)
    setIsComplete(false)
  }, [])

  return { displayText, isComplete, reset }
}
