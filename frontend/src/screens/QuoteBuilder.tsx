import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Trash2, PenTool, CheckCircle, Calculator, X } from 'lucide-react-native';
import { TextInput } from 'react-native-gesture-handler'; // Ensure using proper gesture handler if available or just default from react-native
import { quoteApi } from '../services/api';

export default function QuoteBuilder({ route, navigation }: any) {
    const [parts, setParts] = useState<any[]>([]);
    const [labor, setLabor] = useState<any[]>([]);
    const [fees, setFees] = useState<any[]>([]);
    const [clientName, setClientName] = useState('');
    const [clientAddress, setClientAddress] = useState('');
    const [clientZip, setClientZip] = useState('');
    const [notes, setNotes] = useState('');
    const [taxRate, setTaxRate] = useState(0.08); // Default 8%
    const [taxAmount, setTaxAmount] = useState(0);

    useEffect(() => {
        if (route.params?.newPart) {
            setParts([...parts, route.params.newPart]);
        }
        if (route.params?.newLabor) {
            setLabor([...labor, route.params.newLabor]);
        }
        if (route.params?.newFee) {
            setFees([...fees, route.params.newFee]);
        }
    }, [route.params?.newPart, route.params?.newLabor, route.params?.newFee]);

    // Simple tax rate lookup based on zip (mock)
    useEffect(() => {
        const zipTaxRates: { [key: string]: number } = {
            '98101': 0.1025, // Seattle
            '90210': 0.095,  // Beverly Hills
            '10001': 0.08875, // NYC
        };
        if (clientZip && zipTaxRates[clientZip]) {
            setTaxRate(zipTaxRates[clientZip]);
        } else {
            setTaxRate(0.08); // Default
        }
    }, [clientZip]);

    const calculateSubtotal = () => {
        const partsTotal = parts.reduce((sum, p) => sum + (p.markupPrice * p.quantity), 0);
        const laborTotal = labor.reduce((sum, l) => sum + (l.hourlyRate * l.hours), 0);
        const feesTotal = fees.reduce((sum, f) => sum + f.amount, 0);
        return partsTotal + laborTotal + feesTotal;
    };

    useEffect(() => {
        const subtotal = calculateSubtotal();
        setTaxAmount(subtotal * taxRate);
    }, [parts, labor, fees, taxRate]);

    const calculateTotal = () => {
        return calculateSubtotal() + taxAmount;
    };

    const handleSign = () => {
        if (parts.length === 0 && labor.length === 0) {
            Alert.alert('Error', 'Quote must have at least one part or labor item');
            return;
        }
        navigation.navigate('SignatureCapture', { total: calculateTotal() });
    };

    const handleDiscard = () => {
        Alert.alert(
            "Discard Quote",
            "Are you sure you want to discard this quote? All unsaved changes will be lost.",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Discard", style: "destructive", onPress: () => navigation.goBack() }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleDiscard} style={styles.discardBtn}>
                    <X color="#333" size={24} />
                </TouchableOpacity>
                <Text style={styles.title}>Quote Builder</Text>
                <TouchableOpacity onPress={handleSign} style={styles.signBtn}>
                    <PenTool color="#fff" size={20} />
                    <Text style={styles.signText}>Sign & Lock</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.clientCard}>
                    <Text style={styles.sectionTitle}>Customer Information</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Customer Name"
                        value={clientName}
                        onChangeText={setClientName}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Service Address"
                        value={clientAddress}
                        onChangeText={setClientAddress}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Zip Code"
                        keyboardType="numeric"
                        value={clientZip}
                        onChangeText={setClientZip}
                    />
                </View>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Parts</Text>
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
                    <TouchableOpacity onPress={() => navigation.navigate('AddLabor')}>
                        <Plus color="#007AFF" size={24} />
                    </TouchableOpacity>
                </View>

                {labor.map((l, index) => (
                    <View key={index} style={styles.item}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.itemName}>{l.description}</Text>
                            <Text style={styles.itemSubtext}>{l.hours} hrs @ ${l.hourlyRate}/hr</Text>
                        </View>
                        <Text style={styles.itemPrice}>${l.total.toFixed(2)}</Text>
                    </View>
                ))}

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Additional Fees</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('AddFee')}>
                        <Plus color="#007AFF" size={24} />
                    </TouchableOpacity>
                </View>

                {fees.map((f, index) => (
                    <View key={index} style={styles.item}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.itemName}>{f.name}</Text>
                        </View>
                        <Text style={styles.itemPrice}>${f.amount.toFixed(2)}</Text>
                    </View>
                ))}

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Notes</Text>
                </View>
                <TextInput
                    style={[styles.input, styles.notesInput]}
                    placeholder="Add internal notes or customer instructions..."
                    value={notes}
                    onChangeText={setNotes}
                    multiline={true}
                    numberOfLines={4}
                    textAlignVertical="top"
                />

                <View style={styles.totalCard}>
                    <View style={styles.totalRow}>
                        <Text style={styles.taxLabel}>Subtotal</Text>
                        <Text style={styles.taxValue}>${calculateSubtotal().toFixed(2)}</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={styles.taxLabel}>Tax ({(taxRate * 100).toFixed(2)}%)</Text>
                        <Text style={styles.taxValue}>${taxAmount.toFixed(2)}</Text>
                    </View>
                    <View style={[styles.totalRow, { marginTop: 12, borderTopWidth: 1, borderTopColor: '#444', paddingTop: 12 }]}>
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
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
    },
    discardBtn: {
        padding: 4,
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
    input: {
        backgroundColor: '#F5F7FA',
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
        marginTop: 12,
    },
    notesInput: {
        minHeight: 100,
        paddingTop: 12,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        marginTop: 12,
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
    },
    taxLabel: {
        color: '#aaa',
        fontSize: 14,
    },
    taxValue: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    }
});
