import styles from './HourlyWeatherCard.module.css'
import CapsuleTabSelection from '../dom/CapsuleTabSelection'

import React, { useState } from 'react'
import Image from 'next/image'
import { useMediaQuery } from 'react-responsive'
import CounterDaySelection from '../dom/CounterDaySelection'

export default function HourlyWeatherCard({ data, units, style, ...props }) {
  // State to keep track of the selected day's index
  const [selectedDayIndex, setSelectedDayIndex] = useState(0)
  // Determine if the screen size is small (e.g., mobile)
  const isSmallScreen = useMediaQuery({ query: '(max-width: 768px)' })

  return (
    <div className={styles['weather__hourly--flex']} style={style}>
      {data && (
        <>
          {/* Container for the hourly weather information */}
          <div className={styles['weather__hourly--container']}>
            {/* Header row for the weather information table */}
            <div className={styles['weather__hourly--row']}>
              <div className={styles['weather__hourly--header']}>Time</div>
              <div className={styles['weather__hourly--header']}>Cond.</div>
              <div className={styles['weather__hourly--header']}>Temp.</div>
              <div className={styles['weather__hourly--header']}>Feels Like</div>
              <div className={styles['weather__hourly--header']}>{!isSmallScreen ? 'Humidity' : 'Hum'}</div>
              <div className={styles['weather__hourly--header']}>Chance of Rain</div>
              <div className={styles['weather__hourly--header']}>Wind</div>
            </div>
            {/* Loop to generate rows for each hour of the selected day */}
            {Array.from({ length: 24 }).map((val, idx) => {
              return (
                <div key={idx} className={styles['weather__hourly--row']}>
                  {/* Display the hour of the day */}
                  <div className={styles['weather__hourly--item']}>
                    {new Date(0, 0, 0, idx).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  {/* Display the weather condition image */}
                  <div className={styles['weather__hourly--item']}>
                    <Image
                      alt={data[selectedDayIndex].weather_desc[idx]}
                      src={data[selectedDayIndex].weather_img[idx]}
                      style={{ display: 'block' }}
                      width={48}
                      height={48}
                    />
                  </div>
                  {/* Display the temperature */}
                  <div className={styles['weather__hourly--item']}>
                    {`${data[selectedDayIndex].temperature_2m[idx]} ${units.temperature_2m}`}
                  </div>
                  {/* Display the apparent temperature */}
                  <div className={styles['weather__hourly--item']}>
                    {`${data[selectedDayIndex].apparent_temperature[idx]} ${units.apparent_temperature}`}
                  </div>
                  {/* Display the relative humidity */}
                  <div className={styles['weather__hourly--item']}>
                    {`${data[selectedDayIndex].relative_humidity_2m[idx]} ${units.relative_humidity_2m}`}
                  </div>
                  {/* Display the chance of rain */}
                  <div className={styles['weather__hourly--item']}>
                    {`${data[selectedDayIndex].precipitation_probability[idx]} ${units.precipitation_probability}`}
                  </div>
                  {/* Display the wind speed */}
                  <div className={styles['weather__hourly--item']}>
                    {`${data[selectedDayIndex].wind_speed_10m[idx]} ${units.wind_speed_10m}`}
                  </div>
                </div>
              )
            })}
          </div>
          {/* CapsuleTabSelection component to switch between different days */}
          <CapsuleTabSelection
            tabNames={
              data
                ? data.map((value) => {
                    return value.day
                  })
                : ['No Data']
            }
            onClickHandler={setSelectedDayIndex}
            activeIndex={selectedDayIndex}
          />
          {/* CounterDaySelection component to switch between different days */}
          <CounterDaySelection
            days={data ? data.map((value) => value.day) : ['No data']}
            selectedTab={selectedDayIndex}
            notify={setSelectedDayIndex}
          />
        </>
      )}
    </div>
  )
}
