import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SignatureScreen from 'react-native-signature-canvas';
import { Check, X } from 'lucide-react-native';

export default function SignatureCaptureScreen({ route, navigation }: any) {
    const { total } = route.params;
    const ref = useRef<any>(null);

    const handleOK = (signature: string) => {
        // In real app, send to backend
        Alert.alert(
            'Success',
            'Quote signed and locked. Customer will receive a copy via email.',
            [{ text: 'OK', onPress: () => navigation.navigate('TechnicianDashboard') }]
        );
    };

    const handleClear = () => {
        ref.current.clearSignature();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <X color="#333" size={24} />
                </TouchableOpacity>
                <Text style={styles.title}>Customer Signature</Text>
                <Text style={styles.total}>${total.toFixed(2)}</Text>
            </View>

            <Text style={styles.instruction}>
                Please have the customer sign below to accept the quote.
            </Text>

            <View style={styles.signatureContainer}>
                <SignatureScreen
                    ref={ref}
                    onOK={handleOK}
                    descriptionText="Sign Here"
                    clearText="Clear"
                    confirmText="Accept Quote"
                    webStyle={`.m-signature-pad--footer {display: none; margin: 0px;}`}
                />
            </View>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.clearBtn} onPress={handleClear}>
                    <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.confirmBtn} onPress={() => ref.current.readSignature()}>
                    <Check color="#fff" size={20} />
                    <Text style={styles.confirmText}>Confirm Acceptance</Text>
                </TouchableOpacity>
            </View>
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
    total: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#34C759',
    },
    instruction: {
        padding: 24,
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    signatureContainer: {
        flex: 1,
        backgroundColor: '#F8F9FA',
        margin: 24,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        overflow: 'hidden',
    },
    footer: {
        flexDirection: 'row',
        padding: 24,
        backgroundColor: '#fff',
    },
    clearBtn: {
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        marginRight: 12,
    },
    clearText: {
        fontWeight: '600',
        color: '#666',
    },
    confirmBtn: {
        flex: 1,
        backgroundColor: '#007AFF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
    },
    confirmText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 8,
    }
});
