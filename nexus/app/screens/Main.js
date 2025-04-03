import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import SignIn from './SignIn';
import SignUp from './SignUp';
import SOS from './SOS';
import More from './More';
import Dates from './Dates';
import Home from './Home';
// import Profile from './Profile';

const Tab = createBottomTabNavigator();

const Main = () => {
  async function handleSendFcmToken(id) {
    try {
      const token = await getToken();
      console.log('fcmtoeknnnnnn', token);
      // const URL = 'https://server-sih-1.onrender.com/updateFCMToken';
      const URL = 'http://192.168.137.8:5000/updateFCMToken';
      let result = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({firebaseToken: token, userId: id}),
      });
      result = await result.json();
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Tab.Navigator
    initialRouteName='SOS'
      screenOptions={{
        tabBarStyle: {
          height: 75,
          paddingTop: 4,
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
        },
        tabBarLabelStyle: {fontSize: 12},
        tabBarActiveTintColor:'red',
        tabBarInactiveTintColor:'gray',
        tabBarInactiveBackgroundColor:'none',
        
      }}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="SignUp" component={SignUp} />
      <Tab.Screen
        name="SOS"
        component={SOS}
        options={{
          headerShown: false,
          tabBarButton: props => (
            <TouchableOpacity {...props}>
              <View className="bg-red-600 justify-center items-center w-16 aspect-square rounded-full mx-auto">
                <Text className="text-xl font-bold text-white">SOS</Text>
              </View>
            </TouchableOpacity>
          ),
        }}
      />
      <Tab.Screen name="Notification" component={Dates} />
      <Tab.Screen name="More" component={More} />
    </Tab.Navigator>
  );
};

export default Main;
