import { View, Text, ScrollView, Image } from 'react-native'
import React from 'react'

export default function NewsDetails({ route }) {
    const { newsItem } = route.params;
    return (
        <ScrollView className="flex-1 p-5 bg-primary">
            {newsItem && (
                <>
                    <Text className="text-3xl text-center font-bold text-tertiari mb-3">{newsItem.title}</Text>
                    <View className="flex-column justify-between items-center gap-y-5 mb-5">
                        {newsItem.imgUrl ? (
                            <Image className="w-1/2 h-60 rounded-lg" source={{ uri: newsItem.imgUrl }} resizeMode="cover" />
                        ) : (
                            <Image className="w-1/2 h-60 rounded-lg" source={{ uri: 'https://sanvuonadong.vn/wp-content/uploads/2021/02/ca-koi-buom-01.jpg' }} resizeMode="cover" />
                        )}
                        <Text className="text-base text-justify w-full text-white pr-3">{newsItem.content}</Text>
                    </View>
                </>
            )}
        </ScrollView>
    )
}