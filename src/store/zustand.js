import { create } from 'zustand'

// Create a Zustand store named useWeatherStore
export const useWeatherStore = create((set) => ({
    // Initial state of the store
    coordinates: { lat: null, lng: null }, // Default coordinates are null
    placeInfo: null, // Default placeInfo is null
    tempUnit: { // Default temperature unit configuration
        param: 'celsius', // Parameter for temperature unit
        name: 'Celsius (°C)' // Display name of the temperature unit
    },
    windUnit: { // Default wind unit configuration
        param: 'kmh', // Parameter for wind unit
        name: 'km/h' // Display name of the wind unit
    },
    // Method to set the temperature unit
    setTempUnit: (param, name) => set(state => ({ ...state, tempUnit: { param: param, name: name } })),
    // Method to set the wind unit
    setWindUnit: (param, name) => set(state => ({ ...state, windUnit: { param: param, name: name } })),
    // Method to set the coordinates (latitude and longitude)
    setCoordinates: (lat, lng) => set((state) => ({ ...state, coordinates: { lat: lat, lng: lng } })),
    // Method to set place information
    setPlaceInfo: (info) => set(state => ({ ...state, placeInfo: info }))
}));
