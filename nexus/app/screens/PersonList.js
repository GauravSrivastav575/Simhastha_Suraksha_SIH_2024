import {Image, Pressable, ScrollView, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';

const HomeScreen = () => {
  const [personList, setPersonList] = useState([]);
  useEffect(()=>{
    async function fetchData() {
      try {
        // const URL = 'https://server-sih-1.onrender.com/listReport';
      const URL = 'http://192.168.137.8:5000/listReport';
        let result = await fetch(URL);
        result = await result.json();
        if (result.success) {
          setPersonList(result.data);
          console.log(result.data[0].url);
        }
      } catch (err) {
        console.log("error: ", err);
      }
    }
    fetchData();
  },[])

  return (
    <View className="flex-1 bg-orange-200 p-2">
      <ScrollView>
        {personList.map((person, index) => (
          <View
            key={index}
            className="rounded-xl flex flex-col items-center my-1 w-full mx-auto">
            <Image
              source={{uri: person.url}}
              className="w-full aspect-square rounded-lg"
            />
            <View className="flex flex-row justify-between items-center py-2 px-4 w-full">
              <Text
                key={index}
                className="text-3xl font-semibold text-gray-900">
                {person.name}
              </Text>
                <Pressable className='px-3 py-2 bg-orange-500 rounded-xl'>
                  <Text className='text-xl text-white'>Detected here</Text>
                </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
