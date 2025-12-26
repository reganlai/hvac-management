import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Save } from 'lucide-react-native';

export default function AddFeeScreen({ navigation }: any) {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');

    const handleSave = () => {
        if (!name || !amount) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        const amt = parseFloat(amount);

        if (isNaN(amt)) {
            Alert.alert('Error', 'Invalid amount entered');
            return;
        }

        const newFee = {
            name,
            amount: amt
        };

        navigation.navigate('QuoteBuilder', { newFee });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft color="#333" size={24} />
                </TouchableOpacity>
                <Text style={styles.title}>Add Additional Fee</Text>
                <TouchableOpacity onPress={handleSave}>
                    <Save color="#007AFF" size={24} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                <Text style={styles.label}>Fee Name *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. Diagnostic Fee, Travel Fee"
                    value={name}
                    onChangeText={setName}
                />

                <Text style={styles.label}>Amount ($) *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="0.00"
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                />

                <View style={styles.infoCard}>
                    <Text style={styles.infoText}>
                        This fee will be added to the subtotal and taxed accordingly.
                    </Text>
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
    infoCard: {
        backgroundColor: '#F8F9FA',
        padding: 16,
        borderRadius: 12,
        marginTop: 12,
    },
    infoText: {
        color: '#666',
        fontSize: 14,
        fontStyle: 'italic',
    }
});
