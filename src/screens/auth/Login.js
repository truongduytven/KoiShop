import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import Toast from "react-native-toast-message";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const resetToMain = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Main" }],
    });
    navigation.navigate("Main", { screen: 'Profile'})
  };

  const handleLogin = () => {
    console.log("Email:", email);
    console.log("Password:", password);
    axios
      .post("https://koi-api.uydev.id.vn/api/v1/users/login", {
        email,
        password,
      })
      .then(async (response) => {
        if (response.data.data.status === false) {
          Alert.alert("Error", response.data.data.message);
        } else {
          const jwtToken = response.data.data.jwt;
          console.log(jwtToken);
          Toast.show({
            position: "bottom",
            type: "success",
            text1: "Login successful",
          });
          try {
            await AsyncStorage.setItem("jwtToken", jwtToken);
            resetToMain();
          } catch (error) {
            console.error("Failed to save JWT:", error);
          }
        }
      })
      .catch((error) => {
        // Handle error
        console.log(error.response.data.message);

        Alert.alert("Error", error.response.data.message);
      });
  };

  return (
    <View className="flex-1 justify-center p-4 bg-primary">
      <View className="justify-center items-center bg-[#470101]">
        <View className="w-52 h-52 bg-[#dcdcda] rounded-full">
          <Image
            source={require("../../../assets/logo.jpg")}
            className="w-full h-full object-cover rounded-full scale-90"
          />
        </View>
      </View>
      <Text className="text-3xl mb-8 text-center font-bold text-tertiari">
        Welcome Back
      </Text>
      <TextInput
        className="h-12 border border-gray-400 rounded-lg mb-4 px-4 bg-white"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#6d1a1a"
      />
      <TextInput
        className="h-12 border border-gray-400 rounded-lg mb-2 px-4 bg-white"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#6d1a1a"
      />
      <View className="flex-row justify-end mb-6">
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text className="text-white text-sm underline">Register</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        className="bg-secondary py-3 rounded-lg"
        onPress={handleLogin}
      >
        <Text className="text-center text-white text-lg">Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;
