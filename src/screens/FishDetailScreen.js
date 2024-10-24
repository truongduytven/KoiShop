import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, FlatList } from "react-native";
import axios from "axios";

const FishDetailScreen = ({ route }) => {
    const { fishID } = route.params;
    const [fishDetails, setFishDetails] = useState(null);

    useEffect(() => {
        const fetchFishDetails = async () => {
            try {
                const response = await axios.get(`https://koi-api.uydev.id.vn/api/v1/koi-fishes/${fishID}`);
                setFishDetails(response.data.data);
                // console.log("Data của cá : " + response.data.data);
            } catch (error) {
                console.log("Error fetching fish details:", error);
            }
        };

        fetchFishDetails();
    }, [fishID]);

    return (
        <ScrollView className="flex-1 p-5 bg-primary">
            {fishDetails && (
                <>
                    <View className="flex-column justify-between items-center gap-y-5 mb-5">
                        {fishDetails.imageUrl ? (
                            <Image className="w-1/2 h-60 rounded-lg" source={{ uri: fishDetails.imageUrl }} resizeMode="cover" />
                        ) : (
                            <Image className="w-1/2 h-60 rounded-lg" source={{ uri: 'https://sanvuonadong.vn/wp-content/uploads/2021/02/ca-koi-buom-01.jpg' }} resizeMode="cover" />
                        )}
                        <Text className="text-3xl text-center font-bold text-tertiari mb-3">{fishDetails.name}</Text>
                        <Text className="text-sm font-bold text-white">Giá bán:
                            <Text className="text-2xl font-bold text-tertiari mb-3"> {fishDetails.price}</Text>
                            <Text> VNĐ</Text>
                        </Text>
                    </View>

                    <Text className="text-2xl font-bold text-white mb-2">Thông tin cơ bản</Text>
                    <View className="p-2 border border-gray-500 border-b-opacity-50 mb-5">
                        {fishDetails.ownerId ? (
                            <Text className="text-sm font-bold text-white ">Người sở hữu:
                                <Text className="text-lg">  {fishDetails.ownerId}</Text>
                            </Text>
                        ) : (
                            <></>
                        )}
                        <Text className="text-sm font-bold text-white mb-2">Xuất sứ:
                            <Text className="text-lg">  {fishDetails.origin}</Text>
                        </Text>
                        <Text className="text-sm font-bold text-white mb-2">Giới tính:
                            <Text className="text-lg">  {fishDetails.gender}</Text>
                        </Text>
                        <Text className="text-sm font-bold text-white mb-2">Chiều dài:
                            <Text className="text-lg">  {fishDetails.length} cm</Text>
                        </Text>
                        <Text className="text-sm font-bold text-white mb-2">Cân nặng:
                            <Text className="text-lg">  {fishDetails.weight} gr</Text>
                        </Text>
                        <Text className="text-sm font-bold text-white mb-2">Ngày sinh:
                            <Text className="text-lg">  {fishDetails.dob}</Text>
                        </Text>
                    </View>

                    <Text className="text-2xl font-bold text-white mb-2">Thông tin chi tiết</Text>
                    <View className="p-2 border border-gray-500 border-b-opacity-50 mb-5">
                        <Text className="text-sm font-bold text-white mb-2">Tính cách:
                            <Text className="text-lg">  {fishDetails.personalityTraits}</Text>
                        </Text>
                        <Text className="text-sm font-bold text-white mb-2">Lượng đồ ăn mỗi ngày:
                            <Text className="text-lg">  {fishDetails.dailyFeedAmount} gr/ngày</Text>
                        </Text>
                        <Text className="text-sm font-bold text-white mb-2">Ngày kiểm tra sức khỏe:
                            <Text className="text-lg">  {fishDetails.lastHealthCheck}</Text>
                        </Text>
                    </View>
                    <Text className="text-2xl font-bold text-white mb-2">Trạng thái</Text>

                    <View className="p-2 border border-gray-500 border-b-opacity-50 mb-10">                      
                        <Text className="text-sm font-bold text-white mb-2">Trạng thái trong kho:
                            <Text className="text-lg">  {fishDetails.isAvailableForSale ? "Sẵn có" : "Chờ đặt hàng"}</Text>
                        </Text>
                        <Text className="mb-2">
                            <Text className="text-sm font-bold text-tertiari">{fishDetails.isConsigned ? "Đã ký gửi" : "Chưa ký gửi"}</Text>
                            <Text className="text-sm font-bold text-white"> - </Text>
                            <Text className="text-lg font-bold text-tertiari">{fishDetails.isSold ? "Đã bán" : "Chưa bán"}</Text>
                        </Text>
                    </View>
                </>
            )}
        </ScrollView>
    );
};

export default FishDetailScreen;
