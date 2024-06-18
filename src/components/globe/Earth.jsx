import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import GlobeMarker from './GlobeMarker'
import { FaMapMarkerAlt } from 'react-icons/fa'
import { Vector3, MathUtils, Euler } from 'three'
import { useDrag } from '@use-gesture/react'
import { a, useSpring } from '@react-spring/three'
import { useFrame, useThree } from '@react-three/fiber'
import { useWeatherStore } from '@/store/zustand'
import { latLngToCartesian, latLngToSpherical } from '@/helpers/utils'
import { damp } from 'maath/easing'
import { useMediaQuery } from 'react-responsive'

export default function Earth(props) {
  // Reference to the group containing the globe
  const groupRef = useRef(null)
  // State to check if the globe is rendered
  const [globeRendered, setGlobeRendered] = useState(false)
  // State to store the marker position on the globe
  const [markerPosition, setMarkerPosition] = useState(new Vector3(0, 0, 0))
  // State to manage zoom animation
  const [playZoomAnimation, setPlayZoomAnimation] = useState(false)
  // Getting the size of the canvas
  const { size } = useThree()
  // Media query to check if the device is a tablet or mobile
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })

  // Euler object for rotation
  const euler = useMemo(() => new Euler(0, 0, 0, 'YXZ'), [])
  // Spring for animating the globe's rotation
  const [globeSpring, globeApi] = useSpring(() => ({
    rotation: [0, 0, 0],
  }))

  // Handler for drag gestures
  const bind = useDrag(({ delta: [dx, dy] }) => {
    const responsiveness = isTabletOrMobile ? 10 : 20
    euler.y += (dx / size.width) * responsiveness
    euler.x += (dy / size.width) * responsiveness
    euler.x = MathUtils.clamp(euler.x, -Math.PI / 2, Math.PI / 2)
    globeApi.start({ rotation: euler.toArray().slice(0, 3) })
  })

  // Getting the coordinates from the Zustand store
  const coordinates = useWeatherStore((state) => state.coordinates)

  // Effect to update the marker position and globe rotation based on coordinates
  useEffect(() => {
    if (coordinates.lat) {
      const cartesianCoords = latLngToCartesian(coordinates.lat, coordinates.lng, 100)
      setMarkerPosition(markerPosition.clone().set(...cartesianCoords))
      const [phi, theta] = latLngToSpherical(coordinates.lat, coordinates.lng)
      // Set globe to correct angle
      euler.set(Math.PI / 2 - phi, -(Math.PI / 2 - theta), 0, 'YXZ')
      globeApi.start({ rotation: euler.toArray().slice(0, 3) })
      setPlayZoomAnimation(true)
    }
  }, [coordinates])

  // Frame loop to handle zoom animation
  useFrame(({ camera, controls }, delta) => {
    if (playZoomAnimation) {
      if (damp(camera.position, 'z', 220, 0.25, delta)) {
        controls.enabled = false
      } else {
        controls.enabled = true
        setPlayZoomAnimation(false)
      }
    }
  })

  // Effect to set the globe as rendered
  useEffect(() => {
    if (!globeRendered) setGlobeRendered(true)
  }, [])

  // Loading the 3D model of the Earth
  const { nodes, materials } = useGLTF('/Earth.glb')

  return (
    <a.group ref={groupRef} {...props} dispose={null} position={new Vector3(0, 0, 0)} {...bind()} {...globeSpring}>
      {/* Mesh for the Earth model */}
      <mesh
        geometry={nodes.Cube001.geometry}
        material={materials['Default OBJ']}
        scale={0.2}
        rotation={[0, -Math.PI, 0]}
      />
      {/* Marker on the globe */}
      <GlobeMarker position={markerPosition} scale={3}>
        <FaMapMarkerAlt style={{ color: 'indianred', cursor: 'pointer' }} />
      </GlobeMarker>
    </a.group>
  )
}

// Preload the GLTF model
useGLTF.preload('/Earth.glb')
