import { IconContext } from 'react-icons'
import { GoGear } from 'react-icons/go'
import React, { useState } from 'react'
import { useWeatherStore } from '@/store/zustand'
import styles from './Settings.module.css'
import { useMediaQuery } from 'react-responsive'

export default function Settings() {
  // State to toggle the visibility of the settings menu
  const [showSettings, setShowSettings] = useState(false)

  // Zustand store hooks to manage temperature and wind units
  const setTempUnit = useWeatherStore((state) => state.setTempUnit)
  const tempUnit = useWeatherStore((state) => state.tempUnit)
  const setWindUnit = useWeatherStore((state) => state.setWindUnit)
  const windUnit = useWeatherStore((state) => state.windUnit)

  // Media query hook to check if the screen width is less than 1280px
  const isLg = useMediaQuery({ maxWidth: 1280 })

  // Data for unit selection
  const unitData = [
    {
      title: 'Temperature:',
      names: [!isLg ? 'Celsius (°C)' : '°C', !isLg ? 'Fahrenheit (°F)' : '°F'],
      params: ['celsius', 'fahrenheit'],
      type: 'temp',
    },
    {
      title: 'Wind Speed:',
      names: ['km/h', 'm/s', 'mph', 'Knots'],
      params: ['kmh', 'ms', 'mph', 'kn'],
      type: 'wind',
    },
  ]

  return (
    <div className={styles['settings-container']}>
      {/* Settings icon to toggle the settings menu */}
      <div className={styles['settings__icon']} onClick={() => setShowSettings(!showSettings)}>
        <IconContext.Provider value={{ size: '2rem', color: 'inherit' }}>
          <GoGear />
        </IconContext.Provider>
      </div>
      {/* Settings menu */}
      {showSettings && (
        <div className={styles['settings__selection']}>
          {unitData.map((value, index) => {
            return (
              <div key={index} className={styles['settings__unit']}>
                {/* Title for each unit category */}
                <h1 className={styles['settings__unit-title']}>{value.title}</h1>
                <div className={`${styles['settings__unit-container']} ${styles[`settings__unit-${value.type}`]}`}>
                  {value.names.map((innerValue, innerIndex) => {
                    const isActive =
                      value.type === 'temp'
                        ? tempUnit.name.includes(innerValue) || innerValue.includes(tempUnit.name)
                        : windUnit.name.includes(innerValue) || innerValue.includes(windUnit.name)
                    return (
                      <div
                        key={innerIndex}
                        className={`${styles['settings__unit-item']} ${isActive ? styles['settings__unit-item-active'] : ''}`}
                        onClick={() => {
                          return value.type === 'temp'
                            ? setTempUnit(value.params[innerIndex], innerValue)
                            : setWindUnit(value.params[innerIndex], innerValue)
                        }}
                      >
                        {innerValue}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
