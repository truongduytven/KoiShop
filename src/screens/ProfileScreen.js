import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  Modal,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { formatPrice } from "../lib/utils";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { BlurView } from 'expo-blur';

const ProfileScreen = ({ navigation }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [balance, setBalance] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState("");
  const fetchProfile = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem("jwtToken");
      if (!jwtToken) {
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }

      setIsLoggedIn(true);
      const response = await axios.get(
        "https://koi-api.uydev.id.vn/api/v1/users/me",
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      setProfile(response.data.data);
      setLoading(false);
    } catch (error) {
      setIsLoggedIn(false);
      try {
        await AsyncStorage.removeItem("jwtToken");
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setLoading(false);
      }
      console.error("Error fetching profile data:", error);
      setLoading(false);
    }
  };

  const fetchBalance = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem("jwtToken");
      if (!jwtToken) {
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }

      setIsLoggedIn(true);
      const response = await axios.get(
        "https://koi-api.uydev.id.vn/api/v1/users/me/wallets",
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      setBalance(response.data.data.balance);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching balance data:", error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProfile();
    fetchBalance();
  }, []);

  function handleLogout() {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        onPress: () => { },
        style: "cancel",
      },
      {
        text: "OK",
        onPress: async () => {
          await AsyncStorage.removeItem("jwtToken");
          navigation.reset({
            index: 0,
            routes: [{ name: "Main" }],
          });
          navigation.navigate("Main", { screen: 'Profile'})
          Toast.show({
            position: "bottom",
            type: "success",
            text1: "Logout successful",
          });
        },
      },
    ]);
  }
  if (loading) {
    return (
      <View className="flex-1 justify-center bg-primary items-center">
        <ActivityIndicator size="large" color="#faeaa3" />
      </View>
    );
  }

  if (!isLoggedIn) {
    return (
      <View className="flex-1 justify-center items-center bg-primary p-4">
        <Text className="text-white mb-5 text-xl">
          Please login to continue
        </Text>
        <TouchableOpacity
          className="bg-secondary py-3 px-6 rounded-lg"
          onPress={() => navigation.navigate("Login")}
        >
          <Text className="text-center text-white text-lg">Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="flex-2 bg-primary p-4">
      <View className="items-center">
        <View className="w-32 h-32 rounded-full bg-gray-300 overflow-hidden mb-6">
          <Image
            source={
              profile?.imageUrl
                ? { uri: profile.imageUrl }
                : require("../../assets/avatar-mac-dinh-1.jpg")
            }
            className="w-full h-full object-cover"
          />
        </View>

        <Text className="text-3xl font-bold mb-2 text-white">
          {profile?.fullName}
        </Text>
        <View className='flex-row items-center'>
          <Text className="text-white text-lg">Wallets: {formatPrice(balance)}</Text>
          <MaterialIcons name="attach-money" size={24} color="#faeaa3" />
        </View>
        <Text className="text-white text-lg mb-4">Loyalty Points: {profile?.loyaltyPoints}</Text>
        {/* <Text className="text-white mb-4">{profile?.email}</Text> */}

        <View className="w-full bg-white rounded-lg p-4 mb-4">
          <Text className="font-semibold text-lg mb-2">
            Personal Information
          </Text>
          <Text className="text-gray-600 mb-1">
            Email: {profile?.email}
          </Text>
          <Text className="text-gray-600 mb-1">
            Date of Birth: {new Date(profile?.dob).toLocaleDateString()}
          </Text>
          <Text className="text-gray-600 mb-1">
            Phone Number: {profile?.phoneNumber}
          </Text>
          <Text className="text-gray-600 mb-1">
            Address: {profile?.address}
          </Text>
        </View>
        {/* 
        <View className="w-full bg-white rounded-lg p-4 mb-4">
          <Text className="font-semibold text-lg mb-2">Loyalty Points</Text>
          <Text className="text-gray-600 mb-1">
            Points: {profile?.loyaltyPoints}
          </Text>
        </View> */}

        <TouchableOpacity
          className="bg-secondary p-3 rounded-lg w-full flex-row justify-between items-center mb-4"
          onPress={() => navigation.navigate("WalletDetails")}
        >
          <View className='flex-row justify-center items-center'>
            <Text className="text-center text-tertiari text-lg mr-3">Your wallets</Text>
            <MaterialIcons name="add-card" size={24} color="#faeaa3" />
          </View>
          <MaterialIcons name="arrow-right" size={24} color="#faeaa3" />
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-secondary py-3 rounded-lg w-full"
          onPress={() => handleLogout()}
        >
          <Text className="text-center text-tertiari text-lg">Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
