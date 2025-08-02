/**
 * @file Defines a custom hook to detect if the user is on a mobile device.
 */
import * as React from "react"

// The breakpoint width in pixels to distinguish between mobile and desktop.
const MOBILE_BREAKPOINT = 768

/**
 * A custom React hook that determines if the current viewport width is
 * considered 'mobile' (less than 768px).
 * @returns {boolean} `true` if the viewport is mobile, `false` otherwise.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Create a media query list object
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Handler to execute on window resize or media query change
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Add listener for changes
    mql.addEventListener("change", onChange)
    
    // Set the initial value
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    // Cleanup function to remove the listener
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
