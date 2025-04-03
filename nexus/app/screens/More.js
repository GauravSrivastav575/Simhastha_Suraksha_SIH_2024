import { View, Text, Alert, Pressable } from 'react-native'
import React, { useContext } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../context/AuthContext';

const More = ({navigation}) => {
  const {setUser} = useContext(AuthContext);
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
      <Text>More</Text>
      <Pressable
        className="w-full h-16 rounded-xl my-4 bg-orange-400 active:bg-orange-700 flex justify-center items-center"
        onPress={handleLogout}>
        <Text className="font-semibold text-3xl">Logout</Text>
      </Pressable>
    </View>
  )
}

export default More