import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import { User, Mail, Calendar, FileText, ChevronRight, Award, LogOut } from 'lucide-react-native';

export default function TechnicianProfile({ navigation }: any) {
    const { user, logout } = useAuth();
    const [quotes, setQuotes] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate fetching recent quotes
        setTimeout(() => {
            setQuotes([
                { id: '1', client: 'John Doe', total: 450.00, date: '2023-11-20', status: 'SIGNED' },
                { id: '2', client: 'Mary Jane', total: 1200.50, date: '2023-11-18', status: 'SIGNED' },
                { id: '3', client: 'Bob Builder', total: 85.00, date: '2023-11-15', status: 'DRAFT' },
            ]);
            setIsLoading(false);
        }, 800);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.content}>
                <View style={styles.profileHeader}>
                    <View style={styles.avatarCircle}>
                        <User color="#fff" size={40} />
                    </View>
                    <Text style={styles.name}>{user?.firstName} {user?.lastName}</Text>
                    <Text style={styles.role}>Certified HVAC Technician</Text>
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.statBox}>
                        <FileText color="#007AFF" size={20} />
                        <Text style={styles.statValue}>156</Text>
                        <Text style={styles.statLabel}>Quotes</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account Information</Text>
                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <Mail color="#666" size={18} />
                            <Text style={styles.infoText}>{user?.email}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Calendar color="#666" size={18} />
                            <Text style={styles.infoText}>Member since Oct 2023</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recent Quotes</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAll}>See All</Text>
                        </TouchableOpacity>
                    </View>

                    {isLoading ? (
                        <ActivityIndicator color="#007AFF" style={{ marginTop: 20 }} />
                    ) : (
                        quotes.map(item => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.quoteCard}
                                onPress={() => navigation.navigate('QuoteDetails', { quote: { ...item, client: item.client, technician: `${user?.firstName} ${user?.lastName}` } })}
                            >
                                <View style={styles.quoteInfo}>
                                    <Text style={styles.clientName}>{item.client}</Text>
                                    <View style={styles.quoteMeta}>
                                        <Text style={styles.quoteDate}>{item.date}</Text>
                                        <Text style={styles.dot}>•</Text>
                                        <Text style={[styles.status, { color: item.status === 'SIGNED' ? '#4CD964' : '#FF9500' }]}>{item.status}</Text>
                                    </View>
                                </View>
                                <View style={styles.quoteAmountContainer}>
                                    <Text style={styles.quoteAmount}>${item.total.toFixed(2)}</Text>
                                    <ChevronRight color="#CCC" size={18} />
                                </View>
                            </TouchableOpacity>
                        ))
                    )}
                </View>

                <View style={styles.logoutSection}>
                    <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                        <LogOut color="#FF3B30" size={20} />
                        <Text style={styles.logoutText}>Sign Out</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    content: {
        flex: 1,
    },
    profileHeader: {
        alignItems: 'center',
        padding: 32,
        backgroundColor: '#fff',
    },
    avatarCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    role: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    statsRow: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    statBox: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginTop: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
    },
    section: {
        padding: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 12,
    },
    infoCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        color: '#444',
        marginLeft: 12,
    },
    seeAll: {
        color: '#007AFF',
        fontSize: 14,
        fontWeight: '600',
    },
    quoteCard: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    quoteInfo: {
        flex: 1,
    },
    clientName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    quoteMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    quoteDate: {
        fontSize: 13,
        color: '#666',
    },
    dot: {
        marginHorizontal: 8,
        color: '#ccc',
    },
    status: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    quoteAmountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quoteAmount: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1a1a1a',
        marginRight: 8,
    },
    logoutSection: {
        padding: 24,
        paddingTop: 0,
        marginBottom: 40,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FFE5E5',
    },
    logoutText: {
        color: '#FF3B30',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 12,
    },
});
