import React, { useEffect, useState } from 'react'
import SearchBar from './SearchBar'
import { useDrag } from '@use-gesture/react'
import { useSpring, a } from '@react-spring/web'
import { FaArrowLeft, FaMapMarkerAlt, FaSearchLocation } from 'react-icons/fa'
import styles from './SearchSelection.module.css'
import FavoritesBar from './FavoritesBar'

export default function SearchSelection() {
  // State to manage the visibility of the search bar
  const [searchBarVisible, setSearchBarVisible] = useState(true)
  // State to track if the search bar is off the screen
  const [isSearchBarOffScreen, setIsSearchBarOffScreen] = useState(false)
  // State to manage the selected tab index
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)
  // Select the appropriate component based on the selected tab index
  const SelectedTab = selectedTabIndex === 0 ? SearchBar : FavoritesBar

  // Handle the visibility click to toggle the search bar
  const handleBarVisibilityClick = () => {
    if (isSearchBarOffScreen) {
      setSearchBarVisible(true)
    } else {
      setSearchBarVisible(false)
    }
  }

  // Spring animation configuration
  const [{ x, y, width, opacity, color, hideSearchBarRotate }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    width: '100%',
    opacity: 1,
    color: 'white',
    hideSearchBarRotate: 0,
  }))

  // Bind drag events to the search bar
  const bind = useDrag(({ offset: [x, y] }) => api.start({ x, y, immediate: true }))

  // Effect to handle the search bar visibility animations
  useEffect(() => {
    if (!searchBarVisible) {
      api.start({ color: 'transparent', immediate: true })
      api.start({ x: 0, y: 0, immediate: true })
      api.start({
        width: '0%',
        opacity: 0,
        hideSearchBarRotate: 1,
        immediate: false,
        onResolve: () => {
          setIsSearchBarOffScreen(true)
        },
      })
    } else {
      setIsSearchBarOffScreen(false)
      api.start({
        width: '100%',
        opacity: 1,
        hideSearchBarRotate: 0,
        color: 'white',
        immediate: false,
      })
    }
  }, [searchBarVisible, api])

  return (
    <a.div className={styles['selection__flex']} {...bind()} style={{ x, y }}>
      {!isSearchBarOffScreen && (
        <a.div style={{ width, opacity, color }}>
          <div className={styles['selection__tabs--container']}>
            <div
              className={`${styles['selection__tabs--item']} ${selectedTabIndex === 0 ? styles['selection__tabs--active'] : ''}`}
              onClick={() => setSelectedTabIndex(0)}
            >
              <FaSearchLocation />
              <p>Search</p>
            </div>
            <div
              className={`${styles['selection__tabs--item']} ${selectedTabIndex === 1 ? styles['selection__tabs--active'] : ''}`}
              onClick={() => setSelectedTabIndex(1)}
            >
              <FaMapMarkerAlt />
              <p>Favorites</p>
            </div>
          </div>
          <div className={styles['selection__item--container']}>
            <SelectedTab />
          </div>
        </a.div>
      )}
      <div className={styles['hide__container']} onClick={handleBarVisibilityClick}>
        <a.div
          style={{
            transform: hideSearchBarRotate.to([0, 1], [0, 180]).to((value) => `rotateZ(${value}deg)`),
          }}
        >
          <FaArrowLeft />
        </a.div>
      </div>
    </a.div>
  )
}
