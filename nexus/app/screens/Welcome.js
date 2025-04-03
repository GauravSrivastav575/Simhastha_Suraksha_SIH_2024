import React, {useContext, useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';
import {
  View,
  Text,
  Image,
  ImageBackground,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import {AuthContext} from '../../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Welcome = ({navigation}) => {
  const {
    setIsLocationPermissionGranted,
    setIsNotificationPermissionGranted,
    setIsBackgroundLocationPermissionGranted,
    setFcmToken,
    setUser,
  } = useContext(AuthContext);

  async function getToken() {
    console.log('function getToken() called...');
    const token = await messaging().getToken();
    setFcmToken(token);
    Alert.alert('FCM token accepted');
  }

  async function userSet() {
    console.log('function userSet() called...');
    let jsonValue = await AsyncStorage.getItem('user');
    jsonValue = jsonValue != null ? JSON.parse(jsonValue) : null;
    console.log('jsonvalue', jsonValue)
    setUser(jsonValue);
    if (jsonValue) {
      console.log('redirecting to main');
      navigation.navigate('Main');
    } else {
      console.log('redirecting to signin');
      navigation.navigate('SignIn');
    }
  }

  async function requestUserPermission() {
    console.log('function requestUserPermission() called...');
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      setIsNotificationPermissionGranted(true); // Update context
    } else {
      setIsNotificationPermissionGranted(false); // Update context
    }
  }

  const requestLocationPermissions = async () => {
    console.log('function requestLocationPermissions() called...');
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: 'Notification Permission',
            message:
              'This app needs notification permissions to send you updates.',
            buttonPositive: 'Allow',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Notification permission granted');
          setIsNotificationPermissionGranted(true);
        } else if (granted === PermissionsAndroid.RESULTS.DENIED) {
          console.log('Notification permission denied');
          setIsNotificationPermissionGranted(false);
        } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          console.log('Notification permission set to never ask again');
        }

        // Request Foreground Location Permission
        const foregroundGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message:
              'This app needs access to your location to function properly.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (foregroundGranted === PermissionsAndroid.RESULTS.GRANTED) {
          console.warn('Foreground location permission granted.');
          setIsLocationPermissionGranted(true);
          // Request Background Location Permission (For Android 10+)
          const backgroundGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
            {
              title: 'Background Location Permission',
              message:
                'This app requires background location access to track your location even when the app is closed.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );

          if (backgroundGranted === PermissionsAndroid.RESULTS.GRANTED) {
            console.warn('Background location permission granted.');
            setIsBackgroundLocationPermissionGranted(true);
          } else {
            console.warn('Background location permission denied.');
            setIsBackgroundLocationPermissionGranted(false);
          }
        } else {
          console.warn('Foreground location permission denied.');
          setIsLocationPermissionGranted(false);
        }
      } catch (err) {
        console.warn('Permission error:', err);
      } finally {
        // navigation.navigate('SignIn');
      }
    } else {
      Alert.alert('Permissions are not required for iOS in this example.');
    }
  };

  useEffect(() => {
    requestLocationPermissions();
    requestUserPermission();
    getToken();
    userSet();
    // const unsubscribe = messaging().onMessage(async remoteMessage => {
    //   console.log('Notification received in foreground:', remoteMessage);
    // });
    // return unsubscribe;
  }, []);

  return (
    <ImageBackground
      source={require('../assets/BG.png')}
      resizeMode="cover"
      className="flex-1 justify-center items-center">
      <Text className="text-3xl font-bold text-red-600 text-center">
        Government of Madhya Pradesh
      </Text>
      <Text className="text-2xl font-bold text-blue-600 text-center">
        Madhya Pradesh Police
      </Text>
      <View className="flex flex-row justify-center items-center w-full px-3 flex-wrap my-12">
        <Image
          source={require('../assets/MP_GOV_LOGO.png')}
          className="w-36 aspect-square rounded-lg mx-auto"
        />
        <Image
          source={require('../assets/MP_POLICE_LOGO.png')}
          className="w-32 aspect-square rounded-lg mx-auto"
        />
      </View>
      <Text className="text-4xl font-bold text-orange-600 text-center">
        Simhastha Kumbh Mela
      </Text>
      <Text className="text-5xl font-extrabold text-orange-600 my-3 text-center">
        2028
      </Text>
    </ImageBackground>
  );
};

export default Welcome;
