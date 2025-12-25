import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, ChevronRight, Globe } from 'lucide-react-native';

const SUPPLIERS = [
    { name: 'Thermal Supply', url: 'https://thermalsupplyinc.com', desc: 'HVAC parts, equipment and supplies' },
    { name: 'Parts Town', url: 'https://www.partstown.com', desc: 'Genuine OEM replacement parts' },
];

export default function SupplierList({ navigation }: any) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Supplier Lookup</Text>
                <Text style={styles.subtitle}>Find parts across multiple suppliers</Text>
            </View>

            <ScrollView style={styles.content}>
                {SUPPLIERS.map((supplier) => (
                    <TouchableOpacity
                        key={supplier.name}
                        style={styles.supplierCard}
                        onPress={() => navigation.navigate('SupplierLookup', {
                            url: supplier.url,
                            supplierName: supplier.name
                        })}
                    >
                        <View style={styles.iconContainer}>
                            <Globe color="#007AFF" size={24} />
                        </View>
                        <View style={styles.info}>
                            <Text style={styles.supplierName}>{supplier.name}</Text>
                            <Text style={styles.supplierDesc}>{supplier.desc}</Text>
                        </View>
                        <ChevronRight color="#CCC" size={20} />
                    </TouchableOpacity>
                ))}

                <View style={styles.infoBox}>
                    <Search color="#666" size={18} />
                    <Text style={styles.infoText}>
                        Browse the supplier's website and use the "Capture" button to import part details directly into your quote.
                    </Text>
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
        padding: 24,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    content: {
        padding: 16,
    },
    supplierCard: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#E8F2FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    info: {
        flex: 1,
    },
    supplierName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    supplierDesc: {
        fontSize: 13,
        color: '#666',
        marginTop: 2,
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
        padding: 16,
        borderRadius: 12,
        marginTop: 24,
        alignItems: 'center',
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        color: '#666',
        marginLeft: 12,
        fontStyle: 'italic',
    }
});
