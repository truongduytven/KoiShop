import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Dimensions, Alert, ScrollView } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { formatDate, formatPrice } from '../lib/utils';
import { ActivityIndicator, Modal } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';

const RechargeTab = () => {
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [isWebViewVisible, setIsWebViewVisible] = useState(false);
  const navigation = useNavigation();
  const [jwtToken, setJwtToken] = useState(null);

  const checkSuccessUrl = "https://koi-api.uydev.id.vn/api/v1/payment/vnpay-ipn-receive";

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const jwtToken = await AsyncStorage.getItem("jwtToken");
        if (!jwtToken) {
          setLoading(false);
          return;
        }
        setJwtToken(jwtToken);
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
    if (rechargeAmount === '') {
      Toast.show({
        position: "bottom",
        type: 'error',
        text1: 'Please enter the recharge amount',
      });
      return;
    }
    Alert.alert("Recharge Confirmation", `Are you sure you want to recharge ${formatPrice(rechargeAmount)} to your wallet?`, [
      {
        text: "Cancel",
        onPress: () => { },
        style: "cancel",
      },
      {
        text: "OK",
        onPress: async () => {
          try {
            const response = await axios.post(
              `https://koi-api.uydev.id.vn/api/v1/wallets/deposit?amount=${rechargeAmount}`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${jwtToken}`,
                },
              }
            );
            setPaymentUrl(response.data.data.payUrl);
            setIsWebViewVisible(true);
          } catch (error) {
            console.error("Error recharging wallet:", error);
            Alert.alert("Error", "Failed to recharge wallet. Please try again later.");
          }
        },
      },
    ])
  };

  const handleNavigationStateChange = (navState) => {
    const { url } = navState;

    if (url.startsWith(checkSuccessUrl)) {
      const urlParams = new URLSearchParams(url.split('?')[1]);
      const transactionStatus = urlParams.get('vnp_TransactionStatus');

      if (transactionStatus === '00') {
        setIsWebViewVisible(false);
        Alert.alert("Payment Success", "Your recharge has been completed.");
        const fetchBalance = async () => {
          try {
            const response = await axios.get(
              "https://koi-api.uydev.id.vn/api/v1/users/me/wallets",
              {
                headers: {
                  Authorization: `Bearer ${jwtToken}`,
                },
              }
            );
            setBalance(response.data.data.balance);
          } catch (error) {
            console.error("Error fetching balance data:", error);
            Alert.alert("Error", "Failed to update balance. Please try again.");
          }
        };
        fetchBalance();
        setRechargeAmount("");
        navigation.reset({
          index: 0,
          routes: [{ name: "Profile" }],
        });
        navigation.navigate("Profile", { screen: 'WalletDetails' })
      } else {
        Alert.alert("Payment Failed", "The transaction was not successful.");
      }
    }
  };

  if (isWebViewVisible && paymentUrl) {
    return (
      <WebView
        source={{ uri: paymentUrl }}
        onNavigationStateChange={handleNavigationStateChange}
        style={{ flex: 1 }}
      />
    );
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center bg-primary items-center">
        <ActivityIndicator size="large" color="#faeaa3" />
      </View>
    );
  }

  return (
    <View className="flex-1 p-4 bg-secondary">
      <Text className="text-lg font-bold mb-3 text-white">Your Wallet Balance: {formatPrice(balance)}</Text>
      <Text className="text-lg font-bold mb-3 text-white">Recharge to Your Wallet</Text>
      <View className='relative'>
        <TextInput
          className="border border-gray-300 rounded-lg p-3 mb-4 bg-white"
          placeholder="Enter amount to recharge"
          keyboardType="numeric"
          value={rechargeAmount}
          onChangeText={setRechargeAmount}
        />
        <Text className="absolute top-3 right-3 text-lg font-bold text-black opacity-40">(VND)</Text>
      </View>
      <TouchableOpacity className="bg-primary p-3 rounded-lg w-full flex-row justify-center items-center mb-4" onPress={handleRecharge}>
        <Text className="text-tertiari text-base">Recharge</Text>
      </TouchableOpacity>
    </View>
  );
};

const TransactionsTab = () => {
  const [transactionsHistory, setTransactionsHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const jwtToken = await AsyncStorage.getItem("jwtToken");
        if (!jwtToken) {
          setLoading(false);
          return;
        }
        const response = await axios.get(
          "https://koi-api.uydev.id.vn/api/v1/users/me/wallet-transactions",
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        setTransactionsHistory(response.data.data);
      } catch (error) {
        console.error("Error fetching transactions data:", error);
      } finally {
        setLoading(false);
      }
    }
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
    fetchTransactions();
  }, [])

  if (loading) {
    return (
      <View className="flex-1 justify-center bg-primary items-center">
        <ActivityIndicator size="large" color="#faeaa3" />
      </View>
    );
  }

  return (
    <View className="flex-1 p-4 bg-secondary">
      <Text className="text-lg font-bold mb-3 text-white">Your Wallet Balance: {formatPrice(balance)}</Text>
      <Text className="text-lg font-bold mb-3 text-white">Wallet Transactions</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="py-2 w-full p-3 flex-col items-center gap-y-3">
          {transactionsHistory.reverse().map((transaction, index) => (
            <View key={index} className='w-full bg-white p-3 rounded-lg'>
              <View className='w-full flex-row justify-between'>
                <Text className="text-lg font-medium mb-3 text-black">{formatDate(transaction.transactionDate)}</Text>
                <Text className={`text-lg font-bold mb-3 ${transaction.transactionStatus === 'COMPLETED' ? 'text-green-500' : 'text-red-500'}`}>{transaction.transactionStatus}</Text>
              </View>
              <Text className="text-lg font-medium mb-3 text-black">Type: {transaction.transactionType}</Text>
              <Text className="text-lg font-medium mb-3 text-black">Payment Method: {transaction.paymentMethod}</Text>
              <View className='flex-row items-center justify-start gap-x-1'>
                <Text className="text-lg font-extrabold mb-3 ">Total: {formatPrice(transaction.balanceAfter)}</Text>
                <Text className={`text-lg font-extrabold mb-3 ${transaction.transactionType === 'DEPOSIT' ? 'text-green-500' : 'text-red-500'}`}>({transaction.transactionType === 'DEPOSIT' ? '+' : '-'}{formatPrice(transaction.amount)})</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default function WalletDetails() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'transactions', title: 'Transactions' },
    { key: 'recharge', title: 'Recharge' },
  ]);

  const renderScene = SceneMap({
    transactions: TransactionsTab,
    recharge: RechargeTab,
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
