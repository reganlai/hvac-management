import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Save } from 'lucide-react-native';

export default function CapturePartScreen({ route, navigation }: any) {
    const { supplier } = route.params;
    const [partName, setPartName] = useState('');
    const [partNumber, setPartNumber] = useState('');
    const [basePrice, setBasePrice] = useState('');
    const [quantity, setQuantity] = useState('1');

    const handleSave = () => {
        if (!partName || !partNumber || !basePrice) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        const price = parseFloat(basePrice);
        if (isNaN(price)) {
            Alert.alert('Error', 'Invalid price entered');
            return;
        }

        const newPart = {
            name: partName,
            partNumber: partNumber,
            supplier: supplier,
            basePrice: price,
            quantity: parseInt(quantity) || 1,
            markupPrice: price * 1.35
        };

        // In a real app, this would save to a temporary state/store
        // For now, we'll navigate back with the data
        navigation.navigate('QuoteBuilder', { newPart });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft color="#333" size={24} />
                </TouchableOpacity>
                <Text style={styles.title}>Capture Part Details</Text>
                <TouchableOpacity onPress={handleSave}>
                    <Save color="#007AFF" size={24} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                <Text style={styles.label}>Supplier</Text>
                <TextInput style={[styles.input, styles.disabledInput]} value={supplier} editable={false} />

                <Text style={styles.label}>Part Name *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. Condenser Fan Motor"
                    value={partName}
                    onChangeText={setPartName}
                />

                <Text style={styles.label}>Part Number *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. MOT-12345"
                    value={partNumber}
                    onChangeText={setPartNumber}
                />

                <View style={styles.row}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                        <Text style={styles.label}>Base Price ($) *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="0.00"
                            keyboardType="numeric"
                            value={basePrice}
                            onChangeText={setBasePrice}
                        />
                    </View>
                    <View style={{ width: 100 }}>
                        <Text style={styles.label}>Quantity</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={quantity}
                            onChangeText={setQuantity}
                        />
                    </View>
                </View>

                <View style={styles.infoCard}>
                    <Text style={styles.infoText}>
                        A fixed 35% markup will be automatically applied to this part.
                    </Text>
                    {basePrice ? (
                        <Text style={styles.markupPreview}>
                            Customer Price: ${(parseFloat(basePrice) * 1.35).toFixed(2)}
                        </Text>
                    ) : null}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
    },
    content: {
        padding: 24,
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
        fontWeight: '500',
    },
    input: {
        backgroundColor: '#F5F7FA',
        padding: 16,
        borderRadius: 12,
        fontSize: 16,
        marginBottom: 20,
    },
    disabledInput: {
        color: '#999',
    },
    row: {
        flexDirection: 'row',
    },
    infoCard: {
        backgroundColor: '#E8F2FF',
        padding: 16,
        borderRadius: 12,
        marginTop: 12,
    },
    infoText: {
        color: '#007AFF',
        fontSize: 14,
    },
    markupPreview: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginTop: 8,
    }
});
