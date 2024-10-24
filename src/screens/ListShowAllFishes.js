import { View, Text, Image, FlatList, TouchableOpacity, Button } from 'react-native'
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from 'react'
import axios from 'axios';


export default function ListShowAllFishes() {
    const [fishes, setFishes] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchFishes = async () => {
            try {
                const response = await axios.get('https://koi-api.uydev.id.vn/api/v1/koi-fishes');
                // https://koi-api.uydev.id.vn/api/v1/koi-fishes
                // https://koi-api.uydev.id.vn/api/v1/odata/koi-fishes
                setFishes(response.data.data);
                // console.log("Cho coi data nè " + response.data.data);

            } catch (error) {
                console.log("Error fetching data:", error);
            }
        };
        fetchFishes();
        // console.log("Fetch được rồi ní");
    }, []);
    function formatNumber(number) {
        return number.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    }

    const renderFishesCard = ({ item }) => (
        <>
            <TouchableOpacity className="w-1/2 p-2" onPress={() => navigation.navigate('FishDetail', { fishID: item.id })}>
                <View>
                    <View className="bg-white rounded-xl shadow-lg overflow-hidden">
                        {item.ImageUrl ? (
                            <Image className="w-full h-60" source={{ uri: item.koiFishImages[0] }} resizeMode="cover" />
                        ) : (
                            <Image className="w-full h-60" source={{ uri: 'https://sanvuonadong.vn/wp-content/uploads/2021/02/ca-koi-buom-01.jpg' }} resizeMode="cover" />
                        )}
                        <View className="p-3 flex-row justify-center">
                            <Text className="text-lg font-bold text-black">{item.name}</Text>
                        </View>
                        <View className="p-1 flex-row justify-center">
                            <View className="p-1 flex-row justify-start">
                                <Text className="text-md font-bold text-black justify-start">{formatNumber(item.price)}</Text>
                            </View>


                            <View className="p-1 flex-row justify-end">
                                {item.isSold ? (
                                    <Text className="text-lg font-bold text-red-800">Sold</Text>
                                ) : (
                                    <Text className="text-md font-bold text-green-700">Selling</Text>

                                )}
                            </View>
                        </View>
                        <Button className="bg-red-500 text-black font-bold py-2 px-4 rounded"
                            title="Thêm vào giỏ" />
                    </View>

                </View>

            </TouchableOpacity>

        </>
    );

    return (
        <View className="flex justify-start bg-primary p-3 gap-y-5">

            <FlatList
                data={fishes}
                renderItem={renderFishesCard}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 5 }}
                ListHeaderComponent={
                    <>
                        {/* <View className="flex flex-row justify-between items-center gap-5 mb-5">
              <View className='flex-1'>
                <Searchbar placeholder="Search" />
              </View>
              <Feather name="shopping-cart" size={24} color="white" />
            </View> */}
                        <View className='w-full h-60 mb-5'>
                            <Image className='w-full h-full rounded-xl' source={require('../../assets/Banner.png')} resizeMode="cover" />
                        </View>
                        {/* <View className='w-full flex-row mb-5'>
              <View className='w-2/3'>
                <Text className="text-lg font-bold mb-2 text-tertiari">Welcome to Koi Shop</Text>
                <Text className="text-base text-justify pr-5 text-white">
                  Koi Shop specializes in selling high-quality Koi fish of various fishes from various breeds. We offer the best selection to meet your needs, ensuring beautiful and healthy Koi for your pond.
                </Text>
              </View>
              <View className='w-1/3 h-60'>
                <Image className='w-full h-full rounded-xl' source={{ uri: 'https://minhxuankoifarm.com/wp-content/uploads/2020/09/1-1-1.jpg' }} resizeMode="cover" />
              </View>
            </View> */}
                        <Text className="text-xl font-bold text-tertiari mb-3">Our Koi Fishes</Text>
                    </>
                }
            />
        </View>
    );
};