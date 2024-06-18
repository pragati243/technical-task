'use client'

import { useRef } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import the Scene component, disabling server-side rendering (SSR)
const Scene = dynamic(() => import('@/components/canvas/Scene'), { ssr: false })

const Layout = ({ children }) => {
  const ref = useRef()

  return (
    // Container div for the layout, with a ref to track it
    <div
      ref={ref}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        touchAction: 'auto',
      }}
    >
      {/* Render any children elements passed to the Layout component */}
      {children}
      {/* Render the Scene component with specific styles and event handling */}
      <Scene
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',  // Prevents the Scene from capturing pointer events
        }}
        eventSource={ref}  // Pass the ref as the event source for the Scene
        eventPrefix='client'  // Prefix for the events
      />
    </div>
  )
}

export { Layout }
