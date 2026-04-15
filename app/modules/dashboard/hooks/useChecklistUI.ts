import { useEffect, useRef, useState } from "react"
import { EXIT_ANIMATION_MS, EXPANDED_DURATION_MS } from "../constants/checklist"

export const useChecklistUI = (isCompleted: boolean) => {
  const [expanded, setExpanded] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const [hasExited, setHasExited] = useState(false)

  const wasVisibleRef = useRef(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isCompleted && wasVisibleRef.current) {
      setIsExiting(true)
      const timer = setTimeout(() => {
        setHasExited(true)
      }, EXIT_ANIMATION_MS)
      return () => clearTimeout(timer)
    }
  }, [isCompleted])

  const onMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setExpanded(true)
  }

  const onMouseLeave = () => {
    timeoutRef.current = setTimeout(
      () => setExpanded(false),
      EXPANDED_DURATION_MS,
    )
  }

  return {
    expanded,
    isExiting,
    hasExited,
    onMouseEnter,
    onMouseLeave,
  }
}
