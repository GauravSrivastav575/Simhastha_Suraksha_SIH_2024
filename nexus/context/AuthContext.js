import AsyncStorage from '@react-native-async-storage/async-storage';
import {createContext, useEffect, useState} from 'react';
import {PermissionsAndroid} from 'react-native';
import messaging from '@react-native-firebase/messaging';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [isLocationPermissionGranted, setIsLocationPermissionGranted] =
    useState(false);
  const [isNotificationPermissionGranted, setIsNotificationPermissionGranted] =
    useState(false);
  const [fcmToken, setFcmToken] = useState(null);
  const [
    isBackgroundLocationPermissionGranted,
    setIsBackgroundLocationPermissionGranted,
  ] = useState(false);
  let value = {
    user,
    setUser,
    isLocationPermissionGranted,
    isNotificationPermissionGranted,
    isBackgroundLocationPermissionGranted,
    setIsLocationPermissionGranted,
    setIsNotificationPermissionGranted,
    setIsBackgroundLocationPermissionGranted,
    setFcmToken,
    fcmToken,
  };

  // async function getToken() {
  //   const token = await messaging().getToken();
  //   setFcmToken(token);
  //   return token;
  //   // Send this token to your Express server to store it
  // }
  // async function handleSendFcmToken(id) {
  //   try {
  //     const token = await getToken();
  //     console.log('fcmtoeknnnnnn', token);
  //     const URL = 'https://server-sih-1.onrender.com/updateFCMToken';
  //     // const URL = 'http://192.168.137.8:5000/updateFCMToken';
  //     let result = await fetch(URL, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({firebaseToken: token, userId: id}),
  //     });
  //     result = await result.json();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // async function userSet() {
  //   let jsonValue = await AsyncStorage.getItem('user');
  //   jsonValue = jsonValue != null ? JSON.parse(jsonValue) : null;
  //   setUser(jsonValue);
  //   if (jsonValue) handleSendFcmToken(jsonValue.id);
  // }

  // async function handlePermissionCheck() {
  //   const locationStatus = await PermissionsAndroid.check(
  //     PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //   );
  //   setIsLocationPermissionGranted(locationStatus);
  //   const notificationStatus = await PermissionsAndroid.check(
  //     PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  //   );
  //   setIsNotificationPermissionGranted(notificationStatus);
  //   const backgroundLocationStatus = await PermissionsAndroid.check(
  //     PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
  //   );
  //   setIsBackgroundLocationPermissionGranted(backgroundLocationStatus);
  // }
  // useEffect(() => {
  //   userSet();
  //   handlePermissionCheck();
  // }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
