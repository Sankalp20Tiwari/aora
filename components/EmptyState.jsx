// EmptyState.js
import { View, Text, Image } from 'react-native';
import React from 'react';
import { images } from '../constants';
import CustomButton from './CustomButton';
import { router } from 'expo-router';

const EmptyState = ({ title, subtitle, buttonTitle, onButtonPress }) => {
  return (
    <View className="items-center justify-center px-4">
      <Image  
        source={images.empty}
        className="w-[270px] h-[215px]"
        resizeMode="contain"
      />
      <Text className="font-psemibold mt-2 text-center text-xl text-white">
          {title}
      </Text>
      <Text className="font-pmedium text-sm text-gray-100">
          {subtitle}
      </Text>

      <CustomButton 
        title={buttonTitle || "Create Video"} // Default button title
        handlePress={onButtonPress || (
          () => router.push('/create'))} // Default no-op function
        containerStyles="w-full mt-4"
      />
    </View>
  );
}

export default EmptyState;





