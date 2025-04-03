import {Alert, Pressable, Text, View} from 'react-native';
import React, {useContext, useEffect} from 'react';
import {AuthContext} from '../../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Welcome1 = ({navigation}) => {
  const {
    user,
    fcmToken,
    setUser,
    isLocationPermissionGranted,
    isNotificationPermissionGranted,
    isBackgroundLocationPermissionGranted,
  } = useContext(AuthContext);
  useEffect(() => {}, [
    isLocationPermissionGranted,
    isNotificationPermissionGranted,
    isBackgroundLocationPermissionGranted,
  ]);
  async function handleLogout() {
    try {
      await AsyncStorage.removeItem('user');
      console.log('Data removed successfully');
      setUser(null);
      navigation.navigate('SignIn');
    } catch (error) {
      console.error('Error removing data:', error);
      Alert.alert('Error', 'Logout error!');
    }
  }
  return (
    <View>
      <Text>Welcome1</Text>
      <Text>{user ? user.id : 'no'}</Text>
      <Text>{fcmToken ? fcmToken : 'no fcmToken'}</Text>
      <Text>
        {isLocationPermissionGranted
          ? 'LocationPermissionGranted'
          : 'no fcmToken'}
      </Text>
      <Text>
        {isNotificationPermissionGranted
          ? 'NotificationPermissionGranted'
          : 'no fcmToken'}
      </Text>
      <Text>
        {isBackgroundLocationPermissionGranted
          ? 'BackgroundLocationPermissionGranted'
          : 'no fcmToken'}
      </Text>
      <Pressable
        className="w-full h-16 rounded-xl my-4 bg-orange-400 active:bg-orange-700 flex justify-center items-center"
        onPress={() => navigation.navigate('PersonList')}>
        <Text className="font-semibold text-3xl">Missing Person List</Text>
      </Pressable>
      <Pressable
        className="w-full h-16 rounded-xl my-4 bg-orange-400 active:bg-orange-700 flex justify-center items-center"
        onPress={() => navigation.navigate('Report')}>
        <Text className="font-semibold text-3xl">Report</Text>
      </Pressable>
      <Pressable
        className="w-full h-16 rounded-xl my-4 bg-orange-400 active:bg-orange-700 flex justify-center items-center"
        onPress={handleLogout}>
        <Text className="font-semibold text-3xl">Logout</Text>
      </Pressable>
    </View>
  );
};

export default Welcome1;
