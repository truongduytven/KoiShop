import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { formatPrice } from '../lib/utils';
import { ActivityIndicator } from 'react-native-paper';

const RechargeTab = () => {
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
        try {
          const jwtToken = await AsyncStorage.getItem("jwtToken");
          if (!jwtToken) {
            setLoading(false);
            return;
          }
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
          Alert.alert("Error", "Failed to fetch balance data");
          setLoading(false);
        }
      }
    fetchBalance();
  }, [])

  const handleRecharge = () => {
    // Handle the recharge action (e.g., API call)
    console.log("Recharging with amount:", rechargeAmount);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center bg-primary items-center">
        <ActivityIndicator size="large" color="#faeaa3" />
      </View>
    );
  }

  return (
    <View className="flex-1 p-4 bg-secondary ">
        <Text className="text-lg font-bold mb-3 text-white">Your Wallet Balance: {formatPrice(balance)}</Text>
      <Text className="text-lg font-bold mb-3 text-white">Recharge to Your Wallet</Text>
      <TextInput
        className="border border-gray-300 rounded-lg p-3 mb-4 bg-white"
        placeholder="Enter amount to recharge"
        keyboardType="numeric"
        value={rechargeAmount}
        onChangeText={setRechargeAmount}
        
      />
      <TouchableOpacity className="bg-primary p-3 rounded-lg w-full flex-row justify-center items-center mb-4" onPress={handleRecharge}>
        <Text className="text-tertiari text-base">Recharge</Text>
      </TouchableOpacity>
    </View>
  );
};

const TransactionsTab = () => {
  return (
    <View className="flex-1 p-4 bg-white">
      <Text className="text-lg font-bold mb-3">Wallet Transactions</Text>
      <View className="py-2">
        <Text className="text-base mb-2">Transaction #1 - Recharge - $50.00</Text>
        <Text className="text-base mb-2">Transaction #2 - Purchase - $20.00</Text>
        <Text className="text-base mb-2">Transaction #3 - Refund - $10.00</Text>
      </View>
    </View>
  );
};

export default function WalletDetails() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'recharge', title: 'Recharge' },
    { key: 'transactions', title: 'Transactions' },
  ]);

  const renderScene = SceneMap({
    recharge: RechargeTab,
    transactions: TransactionsTab,
  });

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: '#faeaa3', height: 3 }} // Tab indicator color
      style={{ backgroundColor: '#6f1a1a' }} // Tab bar background color
      labelStyle={{ color: '#faeaa3', fontWeight: 'bold' }} // Label color and font weight
    />
  );

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={setIndex}
      initialLayout={{ width: Dimensions.get('window').width }}
      style={{ backgroundColor: '#470101' }}
    />
  );
}
