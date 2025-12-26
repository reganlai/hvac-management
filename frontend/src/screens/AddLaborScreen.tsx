import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Save } from 'lucide-react-native';

export default function AddLaborScreen({ navigation }: any) {
    const [description, setDescription] = useState('');
    const [hourlyRate, setHourlyRate] = useState('85'); // Default rate
    const [hours, setHours] = useState('1');

    const handleSave = () => {
        if (!description || !hourlyRate || !hours) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        const rate = parseFloat(hourlyRate);
        const hrs = parseFloat(hours);

        if (isNaN(rate) || isNaN(hrs)) {
            Alert.alert('Error', 'Invalid numbers entered');
            return;
        }

        const newLabor = {
            description,
            hourlyRate: rate,
            hours: hrs,
            total: rate * hrs
        };

        navigation.navigate('QuoteBuilder', { newLabor });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft color="#333" size={24} />
                </TouchableOpacity>
                <Text style={styles.title}>Add Labor</Text>
                <TouchableOpacity onPress={handleSave}>
                    <Save color="#007AFF" size={24} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                <Text style={styles.label}>Description *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. System Diagnostic & Repair"
                    value={description}
                    onChangeText={setDescription}
                />

                <View style={styles.row}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                        <Text style={styles.label}>Hourly Rate ($) *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="0.00"
                            keyboardType="numeric"
                            value={hourlyRate}
                            onChangeText={setHourlyRate}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.label}>Hours *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="1.0"
                            keyboardType="numeric"
                            value={hours}
                            onChangeText={setHours}
                        />
                    </View>
                </View>

                <View style={styles.totalCard}>
                    <Text style={styles.totalLabel}>Labor Subtotal</Text>
                    <Text style={styles.totalValue}>
                        ${(parseFloat(hourlyRate || '0') * parseFloat(hours || '0')).toFixed(2)}
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
    row: {
        flexDirection: 'row',
    },
    totalCard: {
        backgroundColor: '#E8F2FF',
        padding: 20,
        borderRadius: 16,
        marginTop: 20,
        alignItems: 'center',
    },
    totalLabel: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '600',
    },
    totalValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginTop: 8,
    }
});
