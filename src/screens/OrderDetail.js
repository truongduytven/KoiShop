import { View, Text, Image, FlatList, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { List } from 'react-native-paper';
import { LogBox } from 'react-native';

export default function OrderDetail({ route }) {
    LogBox.ignoreAllLogs();
    const [question, setQuestion] = useState([]);
    const {
        orderStatus,
        shippingAddress,
        orderDate,
        totalAmount,
        paymentMethod,
        note,
        orderDetail
    } = route.params;

    // console.log(orderStatus);
    // console.log(orderDetail[0]);
    // const [orderDetails, setOrderDetails] = useState(null);
    // const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const responseQuestion = await axios.get(
                    "https://671b3d972c842d92c37f0b37.mockapi.io/question"
                );
                setQuestion(responseQuestion.data);

            } catch (error) {
                console.log("Error fetching data:", error);
            }
        };

        fetchQuestions();
    }, []);

    const renderQuestionCard = ({ item }) => (
        <View className="mr-3 ml-3 rounded-lg shadow-lg">
            <List.Accordion
                title="Câu hỏi: "
                description={item.question}
                left={props => <List.Icon {...props} icon="chat-question" />}
                style={{ borderTopColor: "gray", borderTopWidth: 0.5, marginBottom: 10 }}>
                <List.Item title="Trả lời: " description={item.answer} style={{ backgroundColor: 'white', borderColor: "gray", borderWidth: 0.5 }} />
                {item.solution ? (
                    <List.Item title="Bí quyết: " description={item.solution} style={{ backgroundColor: 'white', borderColor: "gray", borderWidth: 0.5 }} />
                ) : (
                    <></>
                )}
            </List.Accordion>
        </View>
    );

    function formatNumber(number) {
        return number.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    };

    function formatDateToDMY(isoDate) {
        const date = new Date(isoDate);
        const minute = date.getMinutes().toString().padStart(2, '0');
        const hour = date.getHours();
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year} ${hour}:${minute}`;
      };

    return (
        <ScrollView className="mb-4">
            {/* {orderDetail.map((item) => ( */}
            <View
                className={`m-2 rounded-lg shadow-lg bg-white my-3`}
            >
                <View className=" rounded-lg" style={{ backgroundColor: '#03c1ae' }}>
                    <Text className="p-2 text-lg font-bold text-white">ORDER {orderStatus}</Text>
                    <View className="p-2 border-b border-gray-200 border-b-opacity-50" style={{ backgroundColor: '#fef8ff' }}>
                        <Text className="text-lg pb-1">Shipping address</Text>
                        <Text className="text-lg text-gray-500">
                            <MaterialIcons name="location-pin" size={24} color="gray" />
                            {shippingAddress}
                        </Text>
                    </View>
                    <View className="p-2 border-b border-gray-500 border-b-opacity-50 rounded-b-lg" style={{ backgroundColor: '#fef8ff' }}>
                        <Text className="text-lg pb-1">Order information</Text>

                        <View className="flex-row justify-between items-start mb-2">
                            <Text className="text-sm text-gray-500">Date order</Text>
                            <Text className="text-sm text-gray-500">{formatDateToDMY(orderDate)} </Text>
                        </View>

                        <View className={`flex-row`} >
                            <Image
                                className="h-24 w-24 rounded-lg mr-3"
                                source={{
                                    uri: "https://sanvuonadong.vn/wp-content/uploads/2021/02/ca-koi-buom-01.jpg",
                                }}
                                resizeMode="cover"
                            />

                            <View className="flex-1 mx-3">
                                <View className="flex-row justify-between items-start">
                                    <View className="flex-row gap-3">
                                        <Text className="text-lg font-medium text-gray-700">{orderDetail[0].koiFish.name}</Text>
                                    </View>
                                    <Text className="text-sm font-medium text-orange-400">{formatNumber(orderDetail[0].koiFish.price)}</Text>
                                </View>
                                <Text className="text-sm text-gray-400">{orderDetail[0].koiFish.origin}, {orderDetail[0].koiFish.gender}</Text>
                            </View>

                        </View>
                        <Text className="text-sm text-gray-500 p-2">Note: {note}</Text>
                        <View className="items-end border-b border-gray-200 border-b-opacity-50 pb-2">
                            <Text className="text-lg font-bold text-red-600">Total: {formatNumber(totalAmount)}</Text>

                        </View>
                        <Text className="text-lg pb-1 pt-1">Payment information</Text>
                        <View className="flex-row justify-between items-start mb-2">
                            <Text className="text-sm text-gray-500">Method Payment</Text>
                            <Text className="text-sm text-black font-bold">{paymentMethod}</Text>
                        </View>
                        <View className="flex-row justify-between items-start mb-3">
                            <Text className="text-sm text-gray-500">Status payment</Text>
                            <Text className="text-sm text-red-500">{orderDetail[0].status} </Text>
                        </View>
                    </View>
                </View>
            </View>
            <View className="flex flex-row items-center justify-center my-4">
                <Text className="flex-1 border-t border-gray-400 border-b-opacity-50 mx-2"></Text>
                <Text style={{marginTop: -20}}>FAQ</Text>
                <Text className="flex-1 border-t border-gray-400 border-b-opacity-50 mx-2"></Text>                
            </View>
            <FlatList
                data={question}
                renderItem={renderQuestionCard}
                keyExtractor={(item) => item.id}
                horizontal={false}
                showsHorizontalScrollIndicator={true}
            />
            {/* ))}; */}

        </ScrollView>
    )
}