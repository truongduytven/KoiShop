import React from "react";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ListShowAllFishes from "./ListShowAllFishes";
import FishDetailScreen from "./FishDetailScreen";

const Stack = createNativeStackNavigator();

const FishStack = ({ navigation, route }) => {
    React.useLayoutEffect(() => {
        const routeName = getFocusedRouteNameFromRoute(route);
        if (routeName === 'FishDetail') {
            navigation.setOptions({ tabBarStyle: { display: 'none' } });
        } else {
            navigation.setOptions({ tabBarStyle: { display: 'flex', backgroundColor: "#6d1a1a", } });
        }
    }, [navigation, route]);
    return (
        <Stack.Navigator>
            <Stack.Screen name="Fishes" component={ListShowAllFishes} options={{ headerShown: false }} />
            <Stack.Screen 
            name="FishDetail" 
            component={FishDetailScreen} 
            options={{ 
                title: 'Fish Detail', 
                headerTitleAlign: 'center',
                headerStyle: { backgroundColor: '#470101' },
                headerTintColor: '#faeaa3', 
            }} />
        </Stack.Navigator>
    );
};

export default FishStack;
