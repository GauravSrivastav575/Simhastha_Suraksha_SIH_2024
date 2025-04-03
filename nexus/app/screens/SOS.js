import {
  View,
  Text,
  StatusBar,
  ScrollView,
  Pressable,
  Linking,
} from 'react-native';
import React, {useContext} from 'react';
import {AuthContext} from '../../context/AuthContext';

const SOS = ({navigation}) => {
  const {user} = useContext(AuthContext);

  return (
    <View className="flex-1 bg-orange-50">
      <Text className="text-center my-1 font-medium text-gray-900">SOS</Text>
      <View className="h-2/5 justify-center items-center">
        <View className="w-36 aspect-square rounded-full justify-center items-center bg-red-600">
          <Text className="text-white font-extrabold text-3xl">SOS</Text>
        </View>
        <Text className="text-red-600 font-medium text-3xl mt-10 mb-2">
          Keep Calm!
        </Text>
        <Text>After pressing the SOS button,</Text>
        <Text>Help will arrive in 10 minutes</Text>
      </View>
      <ScrollView className="bg-red-200 flex-1 rounded-t-[2.5rem] px-4 py-12">
        <Pressable
          className="bg-gray-50 w-full p-4 rounded-2xl"
          onPress={() => {
            navigation.navigate('Report');
          }}>
          <Text className="text-2xl text-center">Missing Person</Text>
          <Text className="text-5xl text-center text-orange-500 mt-4">
            Report
          </Text>
        </Pressable>
        {user &&user?.role && (
          <Pressable
            className="bg-gray-50 w-full p-4 rounded-2xl mt-3"
            onPress={() => {
              navigation.navigate('PersonList');
            }}>
            <Text className="text-2xl text-center">Missing Person</Text>
            <Text className="text-5xl text-center text-orange-500 mt-4">
              List
            </Text>
          </Pressable>
        )}
        <Pressable
          className="bg-gray-50 w-full p-4 rounded-2xl mt-3"
          onPress={() => {
            Linking.openURL('tel:1920').catch(err =>
              console.error('Error:', err),
            );
          }}>
          <Text className="text-2xl text-center">Kumbh Helpline</Text>
          <Text className="text-5xl text-center text-orange-500 mt-4">
            1920
          </Text>
        </Pressable>
        <Pressable
          className="bg-gray-50 w-full p-4 rounded-2xl mt-3"
          onPress={() => {
            Linking.openURL('tel:112').catch(err =>
              console.error('Error:', err),
            );
          }}>
          <Text className="text-2xl text-center">General Helpline</Text>
          <Text className="text-5xl text-center text-orange-500 mt-4">112</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default SOS;
