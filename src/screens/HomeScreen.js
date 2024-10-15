import React from "react";
import { View, Text } from "react-native";
import { Button } from "react-native-paper";

const HomeScreen = () => {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-black text-2xl font-bold">Home Screen</Text>
      <Button mode="contained" className="mt-5 bg-secondary" onPress={() => console.log("Pressed")}>
        Go Somewhere
      </Button>
    </View>
  );
};

export default HomeScreen;
