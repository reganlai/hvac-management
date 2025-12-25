import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, FileText, Package, User } from 'lucide-react-native';

export default function QuoteDetails({ route, navigation }: any) {
    const { quote } = route.params;

    // Simulate parts data if not provided (since existing mockup QUOTES is minimal)
    const parts = quote.parts || [
        { partNumber: 'MOT-12345', name: 'Condenser Fan Motor', quantity: 1, markupPrice: 280.00 },
        { partNumber: 'CAP-67890', name: 'Dual Run Capacitor', quantity: 1, markupPrice: 45.00 },
        { partNumber: 'CON-11223', name: 'Contactor 2-Pole', quantity: 1, markupPrice: 65.00 },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft color="#333" size={24} />
                </TouchableOpacity>
                <Text style={styles.title}>Quote Details</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.statusCard}>
                    <View style={[styles.statusBadge, { backgroundColor: quote.status === 'SIGNED' ? '#E1F8EB' : '#FFF4E5' }]}>
                        <Text style={[styles.statusText, { color: quote.status === 'SIGNED' ? '#27AE60' : '#FF9500' }]}>{quote.status}</Text>
                    </View>
                    <Text style={styles.quoteId}>Quote ID: #{quote.id}</Text>
                    <Text style={styles.date}>{quote.date}</Text>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <User color="#666" size={18} />
                        <Text style={styles.sectionTitle}>Client Information</Text>
                    </View>
                    <View style={styles.infoCard}>
                        <Text style={styles.infoLabel}>Name</Text>
                        <Text style={styles.infoValue}>{quote.client}</Text>
                        <Text style={[styles.infoLabel, { marginTop: 8 }]}>Technician</Text>
                        <Text style={styles.infoValue}>{quote.technician}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Package color="#666" size={18} />
                        <Text style={styles.sectionTitle}>Parts & Materials</Text>
                    </View>
                    {parts.map((part: any, index: number) => (
                        <View key={index} style={styles.partItem}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.partName}>{part.name}</Text>
                                <Text style={styles.partNumber}>PN: {part.partNumber}</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={styles.partPrice}>${part.markupPrice.toFixed(2)}</Text>
                                <Text style={styles.partQty}>Qty: {part.quantity}</Text>
                            </View>
                        </View>
                    ))}
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total Amount</Text>
                        <Text style={styles.totalValue}>${quote.total.toFixed(2)}</Text>
                    </View>
                </View>

                {quote.status === 'SIGNED' && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <FileText color="#666" size={18} />
                            <Text style={styles.sectionTitle}>Customer Signature</Text>
                        </View>
                        <View style={styles.signaturePlaceholder}>
                            <Text style={styles.placeholderText}>[Digital Signature Captured]</Text>
                        </View>
                    </View>
                )}
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
    statusCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 20,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        marginBottom: 8,
    },
    statusText: {
        fontWeight: '700',
        fontSize: 14,
    },
    quoteId: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    date: {
        fontSize: 14,
        color: '#999',
        marginTop: 4,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        paddingHorizontal: 4,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#666',
        marginLeft: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    infoCard: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
    },
    infoLabel: {
        fontSize: 12,
        color: '#999',
    },
    infoValue: {
        fontSize: 16,
        color: '#1a1a1a',
        fontWeight: '500',
    },
    partItem: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
    },
    partName: {
        fontSize: 16,
        fontWeight: '500',
    },
    partNumber: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    partPrice: {
        fontSize: 16,
        fontWeight: '700',
        color: '#007AFF',
    },
    partQty: {
        fontSize: 12,
        color: '#999',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        marginTop: 8,
    },
    totalLabel: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    totalValue: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    signaturePlaceholder: {
        height: 120,
        backgroundColor: '#eee',
        borderRadius: 12,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        color: '#999',
        fontStyle: 'italic',
    }
});
