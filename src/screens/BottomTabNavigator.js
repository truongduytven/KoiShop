import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeScreen from './HomeScreen'
import ProfileScreen from './ProfileScreen'
import { MaterialIcons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator()

export default function BottomTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;

                    if (route.name === "Home") {
                        iconName = "home";
                    } else if (route.name === "Profile") {
                        iconName = "person";
                    } 
                    return <MaterialIcons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: "#faeaa3",
                tabBarInactiveTintColor: "gray",
                tabBarStyle: {
                    backgroundColor: "#6d1a1a",
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    )
}