import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import { Plus, Search, FileText, Settings, LogOut } from 'lucide-react-native';

const SUPPLIERS = [
    { name: 'Thermal Supply', url: 'https://thermalsupplyinc.com' },
    { name: 'Parts Town', url: 'https://www.partstown.com' },
];

export default function TechnicianDashboard({ navigation }: any) {
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

            <ScrollView style={styles.content}>
                <Text style={styles.sectionTitle}>Supplier Lookup</Text>
                <View style={styles.supplierGrid}>
                    {SUPPLIERS.map((supplier) => (
                        <TouchableOpacity
                            key={supplier.name}
                            style={styles.supplierCard}
                            onPress={() => navigation.navigate('SupplierLookup', {
                                url: supplier.url,
                                supplierName: supplier.name
                            })}
                        >
                            <Search color="#007AFF" size={32} />
                            <Text style={styles.supplierName}>{supplier.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>Actions</Text>
                <TouchableOpacity
                    style={styles.actionCard}
                    onPress={() => navigation.navigate('QuoteBuilder')}
                >
                    <Plus color="#fff" size={24} />
                    <Text style={styles.actionText}>Create New Quote</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionCard, { backgroundColor: '#5856D6' }]}
                    onPress={() => navigation.navigate('QuoteDetails', {
                        quote: { id: 'Mock-123', client: 'Sample Client', status: 'DRAFT', technician: user?.firstName, total: 0, date: '2023-12-23' }
                    })}
                >
                    <FileText color="#fff" size={24} />
                    <Text style={styles.actionText}>Recent Quotes</Text>
                </TouchableOpacity>
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
    content: {
        padding: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
        marginTop: 8,
    },
    supplierGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    supplierCard: {
        backgroundColor: '#fff',
        width: '48%',
        padding: 24,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    supplierName: {
        marginTop: 12,
        fontWeight: '600',
    },
    actionCard: {
        backgroundColor: '#007AFF',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 16,
        marginBottom: 16,
    },
    actionText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 12,
    },
});
