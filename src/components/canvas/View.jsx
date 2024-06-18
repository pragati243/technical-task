'use client'

// Import necessary modules and components
import { forwardRef, Suspense, useImperativeHandle, useRef } from 'react'
import {
  Environment,
  OrbitControls,
  PerspectiveCamera,
  useEnvironment,
  useHelper,
  View as ViewImpl,
} from '@react-three/drei'
import { Three } from '@/helpers/components/Three'
import { PointLightHelper } from 'three'
import envMapImage from 'public/img/night-sky.jpg'

// Common component to set up environment and lighting for the 3D scene
export const Common = ({ color }) => {
  const refLight = useRef()

  // Helper to visualize the PointLight with a red color
  useHelper(refLight, PointLightHelper, 0.5, 'red')

  // Load the environment map image
  const envMap = useEnvironment({ files: envMapImage.src })

  return (
    // Suspense to handle asynchronous loading of the environment map
    <Suspense fallback={null}>
      {/* Set the environment map as the background */}
      <Environment background map={envMap} />
      {/* Add ambient light to the scene */}
      <ambientLight intensity={8.5} />
      {/* Set up a perspective camera */}
      <PerspectiveCamera makeDefault fov={40} position={[0, 0, 500]} />
    </Suspense>
  )
}

// View component to render the 3D view and optionally add orbit controls
const View = forwardRef(({ children, orbit, ...props }, ref) => {
  const localRef = useRef(null)

  // Expose the localRef through the forwarded ref
  useImperativeHandle(
    ref,
    () => {
      return localRef.current
    },
    [],
  )

  return (
    <>
      {/* Div to track the view */}
      <div ref={localRef} {...props} />
      {/* Render the 3D scene inside the Three component */}
      <Three>
        {/* ViewImpl is used to track and render the view */}
        <ViewImpl track={localRef}>
          {/* Render children elements */}
          {children}
          {/* Add orbit controls if the orbit prop is true */}
          {orbit && (
            <OrbitControls
              makeDefault
              enablePan={false}  // Disable panning
              enableRotate={false}  // Disable rotating
              target={[0, 0, 0]}  // Set target for the controls
              enableZoom={true}  // Enable zooming
              zoomSpeed={2}  // Set zoom speed
              dampingFactor={1}  // Set damping factor
            />
          )}
        </ViewImpl>
      </Three>
    </>
  )
})

// Set the display name for the View component
View.displayName = 'View'

export { View }
