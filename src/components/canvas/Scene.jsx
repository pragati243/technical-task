'use client'

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

// Common component to set up the environment and lighting for the 3D scene
export const Common = ({ color }) => {
  const refLight = useRef()
  
  // Using the helper to visualize the PointLight in the scene
  useHelper(refLight, PointLightHelper, 0.5, 'red')

  // Loading the environment map image
  const envMap = useEnvironment({ files: envMapImage.src })

  return (
    <Suspense fallback={null}>
      {/* Setting the environment map as the background */}
      <Environment background map={envMap} />
      
      {/* Adding ambient light to the scene */}
      <ambientLight intensity={8.5} />
      
      {/* Setting up the perspective camera */}
      <PerspectiveCamera makeDefault fov={40} position={[0, 0, 500]} />
    </Suspense>
  )
}

// View component to handle the rendering of the 3D view and orbit controls
const View = forwardRef(({ children, orbit, ...props }, ref) => {
  const localRef = useRef(null)
  
  // Exposing the localRef through the forwarded ref
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
      
      {/* Rendering the 3D scene inside the Three component */}
      <Three>
        {/* ViewImpl is used to track and render the view */}
        <ViewImpl track={localRef}>
          {children}
          
          {/* Adding orbit controls if the orbit prop is true */}
          {orbit && (
            <OrbitControls
              makeDefault
              enablePan={false}
              enableRotate={false}
              target={[0, 0, 0]}
              enableZoom={true}
              zoomSpeed={2}
              dampingFactor={1}
            />
          )}
        </ViewImpl>
      </Three>
    </>
  )
})
View.displayName = 'View'

export { View }
