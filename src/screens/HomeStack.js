import React from "react";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./HomeScreen";
import BreedDetailScreen from "./BreedDetailScreen";
import CartScreen from "./CartScreen";
import FishDetailScreen from "./FishDetailScreen";
import NewsDetails from "./NewsDetails";
const Stack = createNativeStackNavigator();

const HomeStack = ({ navigation, route }) => {
    React.useLayoutEffect(() => {
        const routeName = getFocusedRouteNameFromRoute(route);
        if (routeName === 'BreedDetail' || routeName==="Cart" || routeName==='NewDetail') {
            navigation.setOptions({ tabBarStyle: { display: 'none' } });
        } else {
            navigation.setOptions({ tabBarStyle: { display: 'flex', backgroundColor: "#6d1a1a", } });
        }
    }, [navigation, route]);
    return (
        <Stack.Navigator>
            <Stack.Screen name="HomePage" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen 
            name="BreedDetail" 
            component={BreedDetailScreen} 
            options={{ 
                title: 'Breed Detail', 
                headerTitleAlign: 'center',
                headerStyle: { backgroundColor: '#470101' },
                headerTintColor: '#faeaa3', 
            }} />
            <Stack.Screen 
            name="Cart" 
            component={CartScreen} 
            options={{ 
                title: 'Your Cart', 
                headerTitleAlign: 'center',
                headerStyle: { backgroundColor: '#470101' },
                headerTintColor: '#faeaa3', 
            }} />
            <Stack.Screen 
                name="FishDetail"
                component={FishDetailScreen} 
                options={{ 
                    title: 'Fish Detail', 
                    headerTitleAlign: 'center',
                    headerStyle: { backgroundColor: '#470101' },
                    headerTintColor: '#faeaa3', 
                }} 
            />
            <Stack.Screen 
                name="NewDetail"
                component={NewsDetails} 
                options={{ 
                    title: 'News Detail', 
                    headerTitleAlign: 'center',
                    headerStyle: { backgroundColor: '#470101' },
                    headerTintColor: '#faeaa3', 
                }} 
            />
        </Stack.Navigator>
    );
};

export default HomeStack;
