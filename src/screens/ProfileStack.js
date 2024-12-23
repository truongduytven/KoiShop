import React from "react";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "./ProfileScreen";
import WalletDetails from "./WalletDetails";
import ListHistoryOrders from "./ListHistoryOrders";
import OrderStack from "./OrderStack";
const Stack = createNativeStackNavigator();

const ProfileStack = ({ navigation, route }) => {
    React.useLayoutEffect(() => {
        const routeName = getFocusedRouteNameFromRoute(route);
        if (routeName === 'WalletDetails' || routeName === 'HistoryOrders') {
            navigation.setOptions({ tabBarStyle: { display: 'none' } });
        } else {
            navigation.setOptions({ tabBarStyle: { display: 'flex', backgroundColor: "#6d1a1a", } });
        }
    }, [navigation, route]);

    return (
        <Stack.Navigator>
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />

            <Stack.Screen 
            name="WalletDetails" 
            component={WalletDetails} 
            options={{ 
                title: 'Wallet Detail', 
                headerTitleAlign: 'center',
                headerStyle: { backgroundColor: '#470101' },
                headerTintColor: '#faeaa3',
                StyleSheet: { position: 'relative' }, 
            }} />

            {/* <Stack.Screen 
            name="HistoryOrders" 
            component={ListHistoryOrders} 
            options={{ 
                title: 'History Order', 
                headerTitleAlign: 'center',
                headerStyle: { backgroundColor: '#470101' },
                headerTintColor: '#faeaa3', 
            }} /> */}

            <Stack.Screen 
            name="HistoryOrders" 
            component={OrderStack} 
            options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};

export default ProfileStack;
