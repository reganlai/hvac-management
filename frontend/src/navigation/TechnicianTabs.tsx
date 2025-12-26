import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Search, User } from 'lucide-react-native';
import TechnicianHome from '../screens/TechnicianHome';
import SupplierList from '../screens/SupplierList';
import TechnicianProfile from '../screens/TechnicianProfile';

const Tab = createBottomTabNavigator();

export default function TechnicianTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: '#666',
                tabBarStyle: {
                    paddingTop: 12,
                    paddingBottom: 0,
                    height: 85,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                },
            }}
        >
            <Tab.Screen
                name="Home"
                component={TechnicianHome}
                options={{
                    tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
                }}
            />
            <Tab.Screen
                name="Search"
                component={SupplierList}
                options={{
                    tabBarIcon: ({ color, size }) => <Search color={color} size={size} />,
                    tabBarLabel: 'Search',
                }}
            />
            <Tab.Screen
                name="Profile"
                component={TechnicianProfile}
                options={{
                    tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
                }}
            />
        </Tab.Navigator>
    );
}
