import React, { useEffect } from "react";
import { View, Image } from "react-native";

const SplashScreen = ({ navigation }) => {
      useEffect(() => {
        setTimeout(() => {
          navigation.replace('Home');
        }, 3000);
      }, [navigation]);

    return (
        <View className="flex-1 justify-center items-center bg-[#470101]">
            <View className='w-52 h-52 bg-[#dcdcda] rounded-full'>
                <Image source={require('../../assets/logo.jpg')} className="w-full h-full object-cover rounded-full scale-90" />
            </View>
        </View>
    );
};

export default SplashScreen;
