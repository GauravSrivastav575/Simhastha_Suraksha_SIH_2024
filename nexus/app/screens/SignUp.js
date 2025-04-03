import {View, Text, TextInput, Pressable, Alert} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from '../../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from 'react-native-geolocation-service';

const SignUp = ({navigation}) => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const {
    user,
    setUser,
    isLocationPermissionGranted,
    isBackgroundLocationPermissionGranted,
    isNotificationPermissionGranted,
    fcmToken,
  } = useContext(AuthContext);

  // useEffect(() => {
  //   const getLocation = () => {
  //     Geolocation.getCurrentPosition(
  //       position => {
  //         console.log('Location:', position);
  //       },
  //       error => {
  //         console.error('Error getting location:', error);
  //       },
  //       {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
  //     );
  //   };
  //   const intervalId = setInterval(getLocation, 4000);
  //   return () => clearInterval(intervalId);
  // }, []);
  // {"coords": {"accuracy": 600, "altitude": 0, "altitudeAccuracy": 0, "heading": 0, "latitude": 37.4220936, "longitude": -122.083922, "speed": 0}, "mocked": false, "provider": "fused", "timestamp": 1733241030737}

  async function handleSubmit() {
    try {
      let data = {
        name,
        contact,
        password,
        isLocationPermissionGranted,
        isBackgroundLocationPermissionGranted,
        isNotificationPermissionGranted,
        firebaseToken: fcmToken,
      };
      // const URL = 'https://server-sih-1.onrender.com/signupApp';
      const URL = 'http://192.168.137.8:5000/signupApp';
      const response = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      console.log(contact, password);

      const result = await response.json();
      console.log(result);
      if (result.Success) {
        // Alert.alert('Success', 'Signed Up successfully!');
        console.log('Server Response:', result);
        setUser({role: result.isAuthority, id: result.userId});
        await AsyncStorage.setItem(
          'user',
          JSON.stringify({role: result.isAuthority, id: result.userId}),
        );
        let jsonValue = await AsyncStorage.getItem('user');
        console.log(jsonValue, 1212);
        navigation.navigate('Welcome');
      } else {
        Alert.alert('Error', 'Failed to req.');
        console.log('Error Response:', result);
      }
    } catch (error) {
      console.error('Upload Error:', error);
      Alert.alert('Error', 'An error occurred while uploading.');
    }
  }

  return (
    <View className="flex-1 bg-violet-100 p-2 justify-center items-center">
      <View className="bg-white rounded-2xl p-4 flex flex-col justify-center items-center w-full">
        <Text className="text-4xl my-3 font-extrabold text-gray-800">Signup</Text>
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={text => {
            setName(text);
          }}
          className="w-full bg-gray-200 p-4 my-2 text-xl font-semibold rounded-xl"
        />
        <TextInput
          placeholder="Mobile Contact"
          value={contact}
          onChangeText={text => {
            setContact(text);
          }}
          className="w-full bg-gray-200 p-4 my-2 text-xl font-semibold rounded-xl"
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={text => {
            setPassword(text);
          }}
          className="w-full bg-gray-200 p-4 my-2 text-xl font-semibold rounded-xl"
        />
        <Pressable
          className="w-full h-16 rounded-xl my-4 bg-violet-400 active:bg-violet-700 flex justify-center items-center"
          onPress={handleSubmit}>
          <Text className="font-semibold text-3xl text-white">Signup</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default SignUp;
