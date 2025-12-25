import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Trash2, PenTool, CheckCircle } from 'lucide-react-native';
import { quoteApi } from '../services/api';

export default function QuoteBuilder({ route, navigation }: any) {
    const [parts, setParts] = useState<any[]>([]);
    const [labor, setLabor] = useState<any[]>([]);
    const [fees, setFees] = useState<any[]>([]);
    const [clientInfo, setClientInfo] = useState({ name: 'John Doe', address: '123 HVAC Lane' });

    useEffect(() => {
        if (route.params?.newPart) {
            setParts([...parts, route.params.newPart]);
        }
    }, [route.params?.newPart]);

    const calculateTotal = () => {
        const partsTotal = parts.reduce((sum, p) => sum + (p.markupPrice * p.quantity), 0);
        const laborTotal = labor.reduce((sum, l) => sum + (l.hourlyRate * l.hours), 0);
        const feesTotal = fees.reduce((sum, f) => sum + f.amount, 0);
        return partsTotal + laborTotal + feesTotal;
    };

    const handleSign = () => {
        if (parts.length === 0 && labor.length === 0) {
            Alert.alert('Error', 'Quote must have at least one part or labor item');
            return;
        }
        navigation.navigate('SignatureCapture', { total: calculateTotal() });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Quote Builder</Text>
                <TouchableOpacity onPress={handleSign} style={styles.signBtn}>
                    <PenTool color="#fff" size={20} />
                    <Text style={styles.signText}>Sign & Lock</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.clientCard}>
                    <Text style={styles.clientName}>{clientInfo.name}</Text>
                    <Text style={styles.clientAddress}>{clientInfo.address}</Text>
                </View>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Parts (35% Markup)</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('SupplierLookup', { url: 'https://thermalsupplyinc.com', supplierName: 'Thermal Supply' })}>
                        <Plus color="#007AFF" size={24} />
                    </TouchableOpacity>
                </View>

                {parts.map((part, index) => (
                    <View key={index} style={styles.item}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.itemName}>{part.name}</Text>
                            <Text style={styles.itemSubtext}>{part.supplier} | Qty: {part.quantity}</Text>
                        </View>
                        <Text style={styles.itemPrice}>${(part.markupPrice * part.quantity).toFixed(2)}</Text>
                    </View>
                ))}

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Labor</Text>
                    <TouchableOpacity>
                        <Plus color="#007AFF" size={24} />
                    </TouchableOpacity>
                </View>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Additional Fees</Text>
                    <TouchableOpacity>
                        <Plus color="#007AFF" size={24} />
                    </TouchableOpacity>
                </View>

                <View style={styles.totalCard}>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total Amount</Text>
                        <Text style={styles.totalAmount}>${calculateTotal().toFixed(2)}</Text>
                    </View>
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
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    signBtn: {
        backgroundColor: '#34C759',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    signText: {
        color: '#fff',
        fontWeight: '600',
        marginLeft: 8,
    },
    content: {
        padding: 24,
    },
    clientCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 16,
        marginBottom: 24,
    },
    clientName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    clientAddress: {
        color: '#666',
        marginTop: 4,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    item: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '500',
    },
    itemSubtext: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    totalCard: {
        backgroundColor: '#1a1a1a',
        padding: 24,
        borderRadius: 16,
        marginTop: 12,
        marginBottom: 40,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabel: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    totalAmount: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    }
});
