import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, User, Mail, Calendar, MapPin, Phone, Award, FileText } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import { quoteApi } from '../services/api';

export default function TechnicianDetails({ route, navigation }: any) {
    const { technician } = route.params;
    const [quotes, setQuotes] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadQuotes = async () => {
        setIsLoading(true);
        try {
            const res = await quoteApi.getQuotesByUser(technician.id);
            setQuotes(res.data);
        } catch (error) {
            console.error('Failed to load technician quotes:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadQuotes();
        }, [technician.id])
    );

    const completedQuotesCount = quotes.filter(q => q.status === 'SIGNED').length;

    // Simulated data for static fields (since user model is simple)
    const stats = {
        joinedDate: new Date(technician.createdAt || Date.now()).toLocaleDateString(),
        location: 'Seattle, WA', // Placeholder
        phone: '(555) 123-4567', // Placeholder
        completedQuotes: completedQuotesCount,
        active: technician.active
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft color="#333" size={24} />
                </TouchableOpacity>
                <Text style={styles.title}>Technician Profile</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <User color="#007AFF" size={40} />
                    </View>
                    <Text style={styles.name}>{technician.firstName} {technician.lastName}</Text>
                    <Text style={styles.email}>{technician.email}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: stats.active ? '#E1F8EB' : '#FEE2E2' }]}>
                        <Text style={[styles.statusText, { color: stats.active ? '#27AE60' : '#EF4444' }]}>
                            {stats.active ? 'Active' : 'Inactive'}
                        </Text>
                    </View>
                </View>

                <View style={styles.statsRow}>
                    <View style={[styles.statBox, { width: '100%' }]}>
                        <FileText color="#5856D6" size={24} />
                        <Text style={styles.statValue}>{stats.completedQuotes}</Text>
                        <Text style={styles.statLabel}>Completed Quotes</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Contact Information</Text>
                    <View style={styles.infoList}>
                        <View style={styles.infoItem}>
                            <Phone color="#666" size={18} />
                            <Text style={styles.infoText}>{stats.phone}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <MapPin color="#666" size={18} />
                            <Text style={styles.infoText}>{stats.location}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Calendar color="#666" size={18} />
                            <Text style={styles.infoText}>Joined {stats.joinedDate}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quotes Completed</Text>
                    {isLoading ? (
                        <ActivityIndicator size="small" color="#007AFF" />
                    ) : quotes.length === 0 ? (
                        <Text style={styles.emptyText}>No quotes found.</Text>
                    ) : (
                        quotes.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.activityCard}
                                onPress={() => navigation.navigate('QuoteDetails', { quote: { ...item, technician: `${technician.firstName} ${technician.lastName}` } })}
                            >
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.activityClient}>{item.clientName || 'Unknown Client'}</Text>
                                    <Text style={styles.activityDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                                    <View style={[styles.statusBadge, { backgroundColor: item.status === 'SIGNED' ? '#E1F8EB' : '#FFF4E5', alignSelf: 'flex-start', marginTop: 4 }]}>
                                        <Text style={[styles.statusText, { color: item.status === 'SIGNED' ? '#27AE60' : '#FF9500', fontSize: 10 }]}>{item.status}</Text>
                                    </View>
                                </View>
                                <Text style={styles.activityAmount}>${Number(item.totalAmount || 0).toFixed(2)}</Text>
                            </TouchableOpacity>
                        ))
                    )}
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
    },
    content: {
        padding: 16,
    },
    profileCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#E8F2FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    email: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
        marginBottom: 12,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '700',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    statBox: {
        backgroundColor: '#fff',
        width: '48%',
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        elevation: 1,
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 8,
    },
    statLabel: {
        fontSize: 12,
        color: '#999',
        marginTop: 2,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
        marginBottom: 12,
        paddingHorizontal: 4,
    },
    infoList: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    infoText: {
        fontSize: 15,
        color: '#444',
        marginLeft: 12,
    },
    activityCard: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
        alignItems: 'center',
    },
    activityClient: {
        fontSize: 15,
        fontWeight: '600',
    },
    activityDate: {
        fontSize: 12,
        color: '#999',
        marginTop: 2,
    },
    activityAmount: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1a1a1a',
    },
    emptyText: {
        textAlign: 'center',
        color: '#999',
        marginTop: 12,
        fontStyle: 'italic',
    }
});
