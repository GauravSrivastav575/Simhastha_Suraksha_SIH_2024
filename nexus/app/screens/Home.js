import { View, Text } from 'react-native'
import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext';

const Home = () => {
    const {
        user,
        fcmToken,
        isLocationPermissionGranted,
        isNotificationPermissionGranted,
        isBackgroundLocationPermissionGranted,
      } = useContext(AuthContext);
  return (
    <View>
      <Text>Home</Text>
      <Text>{user ? user.id : 'no user'}</Text>
      <Text>{user?.role ? 'police' : 'user'}</Text>
      <Text>{fcmToken ? fcmToken : 'no fcmToken'}</Text>
      <Text>
        {isLocationPermissionGranted
          ? 'LocationPermissionGranted'
          : 'no forground location'}
      </Text>
      <Text>
        {isNotificationPermissionGranted
          ? 'NotificationPermissionGranted'
          : 'no notification'}
      </Text>
      <Text>
        {isBackgroundLocationPermissionGranted
          ? 'BackgroundLocationPermissionGranted'
          : 'no background loaction'}
      </Text>
    </View>
  )
}

export default Home