import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react-native';
import { TextInput } from 'react-native-gesture-handler';
import { quoteApi } from '../services/api';
import { useAuth } from '../hooks/useAuth';

export default function AllQuotesScreen({ navigation }: any) {
    const { user, logout } = useAuth();
    const [quotes, setQuotes] = useState<any[]>([]);
    const [filteredQuotes, setFilteredQuotes] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const loadQuotes = async () => {
        try {
            const response = await quoteApi.getQuotes();
            setQuotes(response.data);
            setFilteredQuotes(response.data);
        } catch (error: any) {
            console.error('Failed to load quotes:', error);
            if (error.response?.status === 401) {
                logout();
            }
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadQuotes();
        }, [])
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadQuotes();
    }, []);

    const handleSearch = (text: string) => {
        setSearchQuery(text);
        if (text.trim() === '') {
            setFilteredQuotes(quotes);
        } else {
            const filtered = quotes.filter(q =>
                (q.clientName?.toLowerCase().includes(text.toLowerCase())) ||
                (q.id.toLowerCase().includes(text.toLowerCase()))
            );
            setFilteredQuotes(filtered);
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.quoteCard}
            onPress={() => navigation.navigate('QuoteDetails', {
                quote: {
                    ...item,
                    technician: `${user?.firstName} ${user?.lastName}`
                }
            })}
        >
            <View style={styles.quoteInfo}>
                <Text style={styles.clientName}>{item.clientName || 'Unknown Client'}</Text>
                <View style={styles.quoteMeta}>
                    <Text style={styles.quoteDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                    <Text style={styles.dot}>•</Text>
                    <Text style={[styles.status, { color: item.status === 'SIGNED' ? '#4CD964' : '#FF9500' }]}>
                        {item.status}
                    </Text>
                </View>
            </View>
            <View style={styles.quoteAmountContainer}>
                <Text style={styles.quoteAmount}>${Number(item.totalAmount || 0).toFixed(2)}</Text>
                <ChevronRight color="#CCC" size={18} />
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft color="#333" size={24} />
                </TouchableOpacity>
                <Text style={styles.title}>All Quotes</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.searchContainer}>
                <Search color="#666" size={20} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by client or ID..."
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
            </View>

            {isLoading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#007AFF" />
                </View>
            ) : (
                <FlatList
                    data={filteredQuotes}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No quotes found.</Text>
                        </View>
                    }
                />
            )}
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
    backButton: {
        padding: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        margin: 16,
        paddingHorizontal: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#eee',
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 44,
        fontSize: 16,
    },
    listContent: {
        padding: 16,
        paddingTop: 0,
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
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 40,
    },
    emptyText: {
        color: '#666',
        fontSize: 16,
    },
});
