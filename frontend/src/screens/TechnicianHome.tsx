import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import { Plus, LogOut, Wrench } from 'lucide-react-native';

export default function TechnicianHome({ navigation }: any) {
    const { user, logout } = useAuth();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Hi, {user?.firstName}</Text>
                    <Text style={styles.role}>HVAC Technician</Text>
                </View>
            </View>

            <View style={styles.content}>
                <TouchableOpacity
                    style={styles.actionCard}
                    onPress={() => navigation.navigate('QuoteBuilder')}
                >
                    <Plus color="#fff" size={40} />
                    <Text style={styles.actionText}>Create Quote</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    greeting: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    role: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionCard: {
        backgroundColor: '#007AFF',
        width: 140,
        height: 140,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 24,
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
    },
    actionText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        marginTop: 12,
        textAlign: 'center',
    },
});
