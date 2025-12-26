import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../hooks/useAuth';
import LoginScreen from '../screens/LoginScreen';
import TechnicianDashboard from '../screens/TechnicianDashboard';
import ManagerDashboard from '../screens/ManagerDashboard';
import SupplierWebView from '../screens/SupplierWebView';
import QuoteBuilder from '../screens/QuoteBuilder';
import CapturePartScreen from '../screens/CapturePartScreen';
import SignatureCaptureScreen from '../screens/SignatureCaptureScreen';
import QuoteDetails from '../screens/QuoteDetails';
import AddTechnician from '../screens/AddTechnician';
import TechnicianDetails from '../screens/TechnicianDetails';
import AddLaborScreen from '../screens/AddLaborScreen';
import AddFeeScreen from '../screens/AddFeeScreen';
import TechnicianTabs from './TechnicianTabs';

const Stack = createStackNavigator();

export default function AppNavigator() {
    const { user, isLoading } = useAuth();

    if (isLoading) return null; // Or a splash screen

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!user ? (
                <Stack.Screen name="Login" component={LoginScreen} />
            ) : user.role === 'TECHNICIAN' ? (
                <>
                    <Stack.Screen name="TechnicianDashboard" component={TechnicianTabs} />
                    <Stack.Screen name="SupplierLookup" component={SupplierWebView} />
                    <Stack.Screen name="CapturePart" component={CapturePartScreen} />
                    <Stack.Screen name="QuoteBuilder" component={QuoteBuilder} />
                    <Stack.Screen name="AddLabor" component={AddLaborScreen} />
                    <Stack.Screen name="AddFee" component={AddFeeScreen} />
                    <Stack.Screen name="SignatureCapture" component={SignatureCaptureScreen} />
                    <Stack.Screen name="QuoteDetails" component={QuoteDetails} />
                </>
            ) : (
                <>
                    <Stack.Screen name="ManagerDashboard" component={ManagerDashboard} />
                    <Stack.Screen name="QuoteDetails" component={QuoteDetails} />
                    <Stack.Screen name="AddTechnician" component={AddTechnician} />
                    <Stack.Screen name="TechnicianDetails" component={TechnicianDetails} />
                </>
            )}
        </Stack.Navigator>
    );
}
