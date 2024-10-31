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
    // console.log(orderDetail.koiFish);
    // console.log(orderDetail);
    return (
        <ScrollView className="mb-4">
            {/* {orderDetail.map((item) => ( */}
            <View
                className={`m-2 rounded-lg shadow-lg bg-white my-3`}
            >
                <View className=" rounded-lg">
                    {/* <Text className="p-2 text-lg font-bold text-white bg-green-500">ORDER {orderStatus}</Text> */}
                    <Text
                        className={`p-2 text-lg font-bold ${orderStatus === 'COMPLETED'
                            ? 'text-white bg-green-500'
                            : orderStatus === 'PENDING'
                                ? 'text-white bg-orange-500'
                                : orderStatus === 'CANCELLED'
                                    ? 'text-white bg-red-500'
                                    : 'text-white bg-gray-300'
                            }`}
                    >
                        ORDER {orderStatus}
                    </Text>

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


                        {/* <View className="flex-1 mx-3">
                            {orderDetail.map((fish) => (
                                <Text className="text-lg text-red-900">{fish.name}</Text>
                            ))}
                        </View> */}



                        <View className={`flex-row mb-5`} >
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
                                <View className="flex-row justify-between items-start">
                                    <View className="flex-row gap-3">
                                        <Text className="text-sm text-gray-400">{orderDetail[0].koiFish.origin}, {orderDetail[0].koiFish.gender}</Text>
                                    </View>
                                    <Text
                                        className={`text-sm ${orderDetail[0].status === 'COMPLETED'
                                            ? 'text-green-500'
                                            : orderDetail[0].status === 'PENDING'
                                                ? 'text-orange-300'
                                                : orderDetail[0].status === 'CANCELLED'
                                                    ? 'text-red-300'
                                                    : 'text-gray-300'
                                            }`}
                                    >
                                        {orderDetail[0].status}
                                    </Text>
                                </View>
                            </View>



                        </View>

                        {orderDetail[1] ?
                            (
                                <View className={`flex-row mb-5`} >
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
                                                <Text className="text-lg font-medium text-gray-700">{orderDetail[1].koiFish.name}</Text>
                                            </View>
                                            <Text className="text-sm font-medium text-orange-400">{formatNumber(orderDetail[1].koiFish.price)}</Text>
                                        </View>
                                        <View className="flex-row justify-between items-start">
                                            <View className="flex-row gap-3">
                                                <Text className="text-sm text-gray-400">{orderDetail[1].koiFish.origin}, {orderDetail[1].koiFish.gender}</Text>
                                            </View>
                                            <Text
                                                className={`text-sm ${orderDetail[1].status === 'COMPLETED'
                                                    ? 'text-green-500'
                                                    : orderDetail[1].status === 'PENDING'
                                                        ? 'text-orange-300'
                                                        : orderDetail[1].status === 'CANCELLED'
                                                            ? 'text-red-300'
                                                            : 'text-gray-300'
                                                    }`}
                                            >
                                                {orderDetail[1].status}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            ) : (<></>)
                        }

                        {orderDetail[2] ?
                            (
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
                                                <Text className="text-lg font-medium text-gray-700">{orderDetail[2].koiFish.name}</Text>
                                            </View>
                                            <Text className="text-sm font-medium text-orange-400">{formatNumber(orderDetail[2].koiFish.price)}</Text>
                                        </View>
                                        <View className="flex-row justify-between items-start">
                                            <View className="flex-row gap-3">
                                                <Text className="text-sm text-gray-400">{orderDetail[2].koiFish.origin}, {orderDetail[2].koiFish.gender}</Text>
                                            </View>
                                            <Text
                                                className={`text-sm ${orderDetail[2].status === 'COMPLETED'
                                                    ? 'text-green-500'
                                                    : orderDetail[2].status === 'PENDING'
                                                        ? 'text-orange-300'
                                                        : orderDetail[2].status === 'CANCELLED'
                                                            ? 'text-red-300'
                                                            : 'text-gray-300'
                                                    }`}
                                            >
                                                {orderDetail[2].status}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            ) : (<></>)
                        }

                        {orderDetail[3] ?
                            (
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
                                                <Text className="text-lg font-medium text-gray-700">{orderDetail[3].koiFish.name}</Text>
                                            </View>
                                            <Text className="text-sm font-medium text-orange-400">{formatNumber(orderDetail[3].koiFish.price)}</Text>
                                        </View>
                                        <View className="flex-row justify-between items-start">
                                            <View className="flex-row gap-3">
                                                <Text className="text-sm text-gray-400">{orderDetail[3].koiFish.origin}, {orderDetail[3].koiFish.gender}</Text>
                                            </View>
                                            <Text
                                                className={`text-sm ${orderDetail[3].status === 'COMPLETED'
                                                    ? 'text-green-500'
                                                    : orderDetail[3].status === 'PENDING'
                                                        ? 'text-orange-300'
                                                        : orderDetail[3].status === 'CANCELLED'
                                                            ? 'text-red-300'
                                                            : 'text-gray-300'
                                                    }`}
                                            >
                                                {orderDetail[3].status}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            ) : (<></>)
                        }

                        {orderDetail[4] ?
                            (
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
                                                <Text className="text-lg font-medium text-gray-700">{orderDetail[4].koiFish.name}</Text>
                                            </View>
                                            <Text className="text-sm font-medium text-orange-400">{formatNumber(orderDetail[4].koiFish.price)}</Text>
                                        </View>
                                        <View className="flex-row justify-between items-start">
                                            <View className="flex-row gap-3">
                                                <Text className="text-sm text-gray-400">{orderDetail[4].koiFish.origin}, {orderDetail[4].koiFish.gender}</Text>
                                            </View>
                                            <Text
                                                className={`text-sm ${orderDetail[4].status === 'COMPLETED'
                                                    ? 'text-green-500'
                                                    : orderDetail[4].status === 'PENDING'
                                                        ? 'text-orange-300'
                                                        : orderDetail[4].status === 'CANCELLED'
                                                            ? 'text-red-300'
                                                            : 'text-gray-300'
                                                    }`}
                                            >
                                                {orderDetail[4].status}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            ) : (<></>)
                        }

                        {orderDetail[5] ?
                            (
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
                                                <Text className="text-lg font-medium text-gray-700">{orderDetail[5].koiFish.name}</Text>
                                            </View>
                                            <Text className="text-sm font-medium text-orange-400">{formatNumber(orderDetail[5].koiFish.price)}</Text>
                                        </View>
                                        <View className="flex-row justify-between items-start">
                                            <View className="flex-row gap-3">
                                                <Text className="text-sm text-gray-400">{orderDetail[5].koiFish.origin}, {orderDetail[5].koiFish.gender}</Text>
                                            </View>
                                            <Text
                                                className={`text-sm ${orderDetail[5].status === 'COMPLETED'
                                                    ? 'text-green-500'
                                                    : orderDetail[5].status === 'PENDING'
                                                        ? 'text-orange-300'
                                                        : orderDetail[5].status === 'CANCELLED'
                                                            ? 'text-red-300'
                                                            : 'text-gray-300'
                                                    }`}
                                            >
                                                {orderDetail[5].status}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            ) : (<></>)
                        }

                        {orderDetail[6] ?
                            (
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
                                                <Text className="text-lg font-medium text-gray-700">{orderDetail[6].koiFish.name}</Text>
                                            </View>
                                            <Text className="text-sm font-medium text-orange-400">{formatNumber(orderDetail[6].koiFish.price)}</Text>
                                        </View>
                                        <View className="flex-row justify-between items-start">
                                            <View className="flex-row gap-3">
                                                <Text className="text-sm text-gray-400">{orderDetail[6].koiFish.origin}, {orderDetail[6].koiFish.gender}</Text>
                                            </View>
                                            <Text
                                                className={`text-sm ${orderDetail[6].status === 'COMPLETED'
                                                    ? 'text-green-500'
                                                    : orderDetail[6].status === 'PENDING'
                                                        ? 'text-orange-300'
                                                        : orderDetail[6].status === 'CANCELLED'
                                                            ? 'text-red-300'
                                                            : 'text-gray-300'
                                                    }`}
                                            >
                                                {orderDetail[6].status}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            ) : (<></>)
                        }

                        {orderDetail[7] ?
                            (
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
                                                <Text className="text-lg font-medium text-gray-700">{orderDetail[7].koiFish.name}</Text>
                                            </View>
                                            <Text className="text-sm font-medium text-orange-400">{formatNumber(orderDetail[7].koiFish.price)}</Text>
                                        </View>
                                        <View className="flex-row justify-between items-start">
                                            <View className="flex-row gap-3">
                                                <Text className="text-sm text-gray-400">{orderDetail[7].koiFish.origin}, {orderDetail[7].koiFish.gender}</Text>
                                            </View>
                                            <Text
                                                className={`text-sm ${orderDetail[7].status === 'COMPLETED'
                                                    ? 'text-green-500'
                                                    : orderDetail[7].status === 'PENDING'
                                                        ? 'text-orange-300'
                                                        : orderDetail[7].status === 'CANCELLED'
                                                            ? 'text-red-300'
                                                            : 'text-gray-300'
                                                    }`}
                                            >
                                                {orderDetail[7].status}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            ) : (<></>)
                        }

                        {orderDetail[8] ?
                            (
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
                                                <Text className="text-lg font-medium text-gray-700">{orderDetail[8].koiFish.name}</Text>
                                            </View>
                                            <Text className="text-sm font-medium text-orange-400">{formatNumber(orderDetail[8].koiFish.price)}</Text>
                                        </View>
                                        <View className="flex-row justify-between items-start">
                                            <View className="flex-row gap-3">
                                                <Text className="text-sm text-gray-400">{orderDetail[8].koiFish.origin}, {orderDetail[8].koiFish.gender}</Text>
                                            </View>
                                            <Text
                                                className={`text-sm ${orderDetail[8].status === 'COMPLETED'
                                                    ? 'text-green-500'
                                                    : orderDetail[8].status === 'PENDING'
                                                        ? 'text-orange-300'
                                                        : orderDetail[8].status === 'CANCELLED'
                                                            ? 'text-red-300'
                                                            : 'text-gray-300'
                                                    }`}
                                            >
                                                {orderDetail[8].status}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            ) : (<></>)
                        }

                        {orderDetail[9] ?
                            (
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
                                                <Text className="text-lg font-medium text-gray-700">{orderDetail[9].koiFish.name}</Text>
                                            </View>
                                            <Text className="text-sm font-medium text-orange-400">{formatNumber(orderDetail[9].koiFish.price)}</Text>
                                        </View>
                                        <View className="flex-row justify-between items-start">
                                            <View className="flex-row gap-3">
                                                <Text className="text-sm text-gray-400">{orderDetail[9].koiFish.origin}, {orderDetail[9].koiFish.gender}</Text>
                                            </View>
                                            <Text
                                                className={`text-sm ${orderDetail[9].status === 'COMPLETED'
                                                    ? 'text-green-500'
                                                    : orderDetail[9].status === 'PENDING'
                                                        ? 'text-orange-300'
                                                        : orderDetail[9].status === 'CANCELLED'
                                                            ? 'text-red-300'
                                                            : 'text-gray-300'
                                                    }`}
                                            >
                                                {orderDetail[9].status}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            ) : (<></>)
                        }


                        <Text className="text-sm text-gray-500 p-2">Note: {note}</Text>
                        <View className="items-end border-b border-gray-200 border-b-opacity-50 pb-2">
                            <Text className="text-lg">Total:
                                <Text className="text-lg font-bold text-red-400"> {formatNumber(totalAmount)}</Text>
                            </Text>

                        </View>
                        <Text className="text-lg pb-1 pt-1">Payment information</Text>
                        <View className="flex-row justify-between items-start mb-2">
                            <Text className="text-sm text-gray-500">Method Payment</Text>
                            <Text className="text-sm text-blue-500 font-bold">{paymentMethod}</Text>
                        </View>
                        <View className="flex-row justify-between items-start mb-3">
                            <Text className="text-sm text-gray-500">Status</Text>
                            <Text
                                className={`text-sm ${orderDetail[0].status === 'COMPLETED'
                                    ? 'text-green-500'
                                    : orderDetail[0].status === 'PENDING'
                                        ? 'text-orange-500'
                                        : orderDetail[0].status === 'CANCELLED'
                                            ? 'text-red-300'
                                            : 'text-gray-300'
                                    }`}
                            >
                                {orderDetail[0].status}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
            <View className="flex flex-row items-center justify-center my-4">
                <Text className="flex-1 border-t border-gray-400 border-b-opacity-50 mx-2"></Text>
                <Text style={{ marginTop: -20 }}>FAQ</Text>
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