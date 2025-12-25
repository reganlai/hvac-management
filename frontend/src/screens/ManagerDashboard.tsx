import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import { Users, FileText, Settings, Plus, LogOut, ChevronRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useState, useRef } from 'react';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ManagerDashboard() {
    const { user, logout } = useAuth();
    const navigation = useNavigation<any>();
    const [activeTab, setActiveTab] = useState('quotes');
    const scrollRef = useRef<ScrollView>(null);

    const handleTabPress = (tab: string) => {
        setActiveTab(tab);
        scrollRef.current?.scrollTo({
            x: tab === 'quotes' ? 0 : SCREEN_WIDTH,
            animated: true
        });
    };

    const handleScroll = (event: any) => {
        const xOffset = event.nativeEvent.contentOffset.x;
        const index = Math.round(xOffset / SCREEN_WIDTH);
        setActiveTab(index === 0 ? 'quotes' : 'users');
    };

    const QUOTES = [
        { id: '1', client: 'John Doe', status: 'SIGNED', technician: 'Alice Smith', total: 450.00, date: '2023-10-25' },
        { id: '2', client: 'Jane Roe', status: 'DRAFT', technician: 'Bob Jones', total: 1200.00, date: '2023-10-24' },
    ];

    const TECHNICIANS = [
        { id: '1', name: 'Alice Smith', email: 'alice@hvac.com', active: true },
        { id: '2', name: 'Bob Jones', email: 'bob@hvac.com', active: true },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Manager Admin</Text>
                    <Text style={styles.role}>Organization Oversight</Text>
                </View>
                <TouchableOpacity onPress={logout}>
                    <LogOut color="#FF3B30" size={24} />
                </TouchableOpacity>
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'quotes' && styles.activeTab]}
                    onPress={() => handleTabPress('quotes')}
                >
                    <FileText color={activeTab === 'quotes' ? '#007AFF' : '#666'} size={20} />
                    <Text style={[styles.tabText, activeTab === 'quotes' && styles.activeTabText]}>Quotes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'users' && styles.activeTab]}
                    onPress={() => handleTabPress('users')}
                >
                    <Users color={activeTab === 'users' ? '#007AFF' : '#666'} size={20} />
                    <Text style={[styles.tabText, activeTab === 'users' && styles.activeTabText]}>Technicians</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                ref={scrollRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={handleScroll}
                style={styles.contentScroll}
            >
                <View style={styles.page}>
                    <FlatList
                        data={QUOTES}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContent}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.card}
                                onPress={() => navigation.navigate('QuoteDetails', { quote: item })}
                            >
                                <View style={styles.cardHeader}>
                                    <Text style={styles.clientName}>{item.client}</Text>
                                    <View style={[styles.statusBadge, { backgroundColor: item.status === 'SIGNED' ? '#E1F8EB' : '#FFF4E5' }]}>
                                        <Text style={[styles.statusText, { color: item.status === 'SIGNED' ? '#27AE60' : '#FF9500' }]}>{item.status}</Text>
                                    </View>
                                </View>
                                <Text style={styles.technicianName}>Tech: {item.technician}</Text>
                                <View style={styles.cardFooter}>
                                    <Text style={styles.date}>{item.date}</Text>
                                    <Text style={styles.amount}>${item.total.toFixed(2)}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>

                <View style={styles.page}>
                    <FlatList
                        data={TECHNICIANS}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContent}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.card}
                                onPress={() => navigation.navigate('TechnicianDetails', { technician: item })}
                            >
                                <View style={styles.cardHeader}>
                                    <Text style={styles.clientName}>{item.name}</Text>
                                    <ChevronRight color="#CCC" size={20} />
                                </View>
                                <Text style={styles.technicianName}>{item.email}</Text>
                            </TouchableOpacity>
                        )}
                        ListFooterComponent={
                            <TouchableOpacity
                                style={styles.addBtn}
                                onPress={() => navigation.navigate('AddTechnician')}
                            >
                                <Plus color="#fff" size={20} />
                                <Text style={styles.addBtnText}>Create New Technician</Text>
                            </TouchableOpacity>
                        }
                    />
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
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#fff',
    },
    greeting: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    role: {
        fontSize: 14,
        color: '#666',
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    tab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 12,
        marginRight: 16,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#007AFF',
    },
    tabText: {
        marginLeft: 8,
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    activeTabText: {
        color: '#007AFF',
    },
    contentScroll: {
        flex: 1,
    },
    page: {
        width: SCREEN_WIDTH,
        flex: 1,
    },
    listContent: {
        padding: 16,
    },
    card: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    clientName: {
        fontSize: 17,
        fontWeight: '600',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    technicianName: {
        color: '#666',
        fontSize: 14,
        marginBottom: 12,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#f5f5f5',
        paddingTop: 12,
    },
    date: {
        color: '#999',
        fontSize: 12,
    },
    amount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    addBtn: {
        backgroundColor: '#007AFF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        marginTop: 16,
    },
    addBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    }
});
