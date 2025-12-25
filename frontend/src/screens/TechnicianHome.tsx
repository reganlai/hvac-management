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
                <TouchableOpacity onPress={logout}>
                    <LogOut color="#FF3B30" size={24} />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <View style={styles.welcomeCard}>
                    <View style={styles.iconCircle}>
                        <Wrench color="#007AFF" size={40} />
                    </View>
                    <Text style={styles.welcomeTitle}>Ready for the next job?</Text>
                    <Text style={styles.welcomeSub}>Create a professional quote for your customer in minutes.</Text>
                </View>

                <TouchableOpacity
                    style={styles.actionCard}
                    onPress={() => navigation.navigate('QuoteBuilder')}
                >
                    <Plus color="#fff" size={32} />
                    <Text style={styles.actionText}>Create New Quote</Text>
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
    },
    welcomeCard: {
        alignItems: 'center',
        marginBottom: 40,
    },
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#E8F2FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    welcomeTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1a1a1a',
        textAlign: 'center',
    },
    welcomeSub: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 12,
        lineHeight: 24,
        paddingHorizontal: 20,
    },
    actionCard: {
        backgroundColor: '#007AFF',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        borderRadius: 24,
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
    },
    actionText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
        marginTop: 16,
    },
});
