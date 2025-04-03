import messaging from '@react-native-firebase/messaging';
import './global.css';
import React, {useContext, useEffect} from 'react';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
import AppNavigation from './app/navigation';
import {AuthContext, AuthProvider} from './context/AuthContext';
import Geolocation from 'react-native-geolocation-service';

function App() {
  const {user} = useContext(AuthContext);
  let data = {
    coords: {
      accuracy: 5,
      altitude: 5,
      altitudeAccuracy: 0.5,
      heading: 0,
      latitude: 37.4219983,
      longitude: -122.084,
      speed: 0,
    },
    mocked: false,
    provider: 'fused',
    timestamp: 1733482546338,
  };
  useEffect(() => {
    if (user && user?.role) {
      const getLocation = () => {
        let CoordinateData = {};
        Geolocation.getCurrentPosition(
          position => {
            console.log('Location:', position);
            CoordinateData = {
              userId: user.id,
              location: {
                type: 'Point',
                coordinates: [
                  position.coords.longitude,
                  position.coords.latitude,
                ],
              },
            };
            console.log(CoordinateData);
          },
          error => {
            console.error('Error getting location:', error);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
        const sendCoordinates = async () => {
          const coResponse = await fetch(
            // 'https://server-sih-1.onrender.com/locationUpdate',
            'http://192.168.137.8:5000/locationUpdate',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(CoordinateData),
            },
          );
          const result = await coResponse.json();
          console.log(result);
        };
        if (CoordinateData) {
          sendCoordinates();
        }
      };
      const intervalId = setInterval(getLocation, 60 * 1000);
      return () => clearInterval(intervalId);
    }
  }, [user]);
  return (
    <AuthProvider>
      <AppNavigation />
    </AuthProvider>
  );
}

export default App;

// gradlew clean
// gradlew assembleRelease
