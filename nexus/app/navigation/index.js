import React, {useContext, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PersonList from '../screens/PersonList';
import Report from '../screens/Report';
import SignIn from '../screens/SignIn';
import {AuthContext} from '../../context/AuthContext';
import SignUp from '../screens/SignUp';
import Welcome from '../screens/Welcome';
import Welcome1 from '../screens/Welcome1';
import Main from '../screens/Main';
import {StatusBar} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  const URL = ''
  const {user} = useContext(AuthContext);
  useEffect(() => {
    if (user && user?.role) {
      console.log('inside the if');
      const sendCoordinates = async (CoordinateData) => {
        console.log('inside the send cordinate func', CoordinateData);

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
        console.log(result, 121212);
      };
      const getLocation = () => {
        Geolocation.getCurrentPosition(
          position => {
            console.log('Location:', position);
            let CoordinateData = {
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
            sendCoordinates(CoordinateData);
          },
          error => {
            console.error('Error getting location:', error);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      };
      const intervalId = setInterval(getLocation, 10000);
      return () => clearInterval(intervalId);
    }
  }, []);
  return (
    <NavigationContainer>
      <StatusBar backgroundColor={'#FFF7ED'} barStyle={'dark-content'} />
      <Stack.Navigator
        initialRouteName={'Welcome'}
        screenOptions={{headerShown: false}}>
        {/* <Stack.Screen name='PersonList' component={PersonList} options={{headerShown:true, headerShadowVisible:true, headerStyle:{backgroundColor:"rgb(100 116 152);"}}}/> */}
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Welcome1" component={Welcome1} />
        <Stack.Screen
          name="PersonList"
          component={PersonList}
          options={{
            headerShown: true,
            headerStyle: {backgroundColor: '#FFF7ED'},
            headerTitle: 'Mission Person List',
          }}
        />
        <Stack.Screen
          name="Report"
          component={Report}
          options={{
            headerShown: true,
            headerStyle: {backgroundColor: '#FFF7ED'},
          }}
        />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen name="SignUp" component={SignUp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
