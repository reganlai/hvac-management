import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SignatureScreen from 'react-native-signature-canvas';
import { Check, X } from 'lucide-react-native';
import * as SecureStore from 'expo-secure-store';
import { useQuoteContext } from '../context/QuoteContext';
import { quoteApi } from '../services/api';

export default function SignatureCaptureScreen({ route, navigation }: any) {
    const { total } = route.params;
    const ref = useRef<any>(null);
    const [isSaving, setIsSaving] = React.useState(false);

    const {
        clientName, clientEmail, clientAddress, clientZip,
        parts, labor, fees,
        resetQuote
    } = useQuoteContext();

    const handleOK = async (signature: string) => {
        setIsSaving(true);
        try {
            const token = await SecureStore.getItemAsync('userToken');
            console.log(`Starting save process. Token length: ${token?.length}`);

            // 1. Create Quote
            console.log('Step 1: Creating Quote...');
            const quoteRes = await quoteApi.createQuote({
                clientName,
                clientEmail,
                clientAddress: `${clientAddress} ${clientZip}`,
            });
            const quoteId = quoteRes.data.id;
            console.log('Quote created with ID:', quoteId);

            // 2. Add Parts
            console.log(`Step 2: Adding ${parts.length} parts...`);
            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];
                console.log(`Adding part ${i + 1}/${parts.length}: ${part.partNumber}`);
                await quoteApi.addPart(quoteId, {
                    name: part.name,
                    partNumber: part.partNumber,
                    supplier: part.supplier,
                    basePrice: part.basePrice,
                    quantity: part.quantity
                });
            }

            // 3. Add Labor
            console.log(`Step 3: Adding ${labor.length} labor items...`);
            for (let i = 0; i < labor.length; i++) {
                const l = labor[i];
                console.log(`Adding labor ${i + 1}/${labor.length}: ${l.description}`);
                await quoteApi.addLabor(quoteId, {
                    description: l.description,
                    hourlyRate: l.hourlyRate,
                    hours: l.hours
                });
            }

            // 4. Add Fees
            console.log(`Step 4: Adding ${fees.length} fees...`);
            for (let i = 0; i < fees.length; i++) {
                const fee = fees[i];
                console.log(`Adding fee ${i + 1}/${fees.length}: ${fee.name}`);
                await quoteApi.addFee(quoteId, {
                    name: fee.name,
                    amount: fee.amount
                });
            }

            // 5. Sign Quote
            console.log('Step 5: Signing Quote...');
            await quoteApi.signQuote(quoteId, signature);
            console.log('Quote signed successfully!');

            // Success
            resetQuote();
            Alert.alert(
                'Success',
                'Quote signed and locked. Customer will receive a copy via email.',
                [{ text: 'OK', onPress: () => navigation.navigate('TechnicianDashboard') }]
            );

        } catch (error: any) {
            console.error('Failed to save quote:', error);
            const status = error.response?.status;
            const message = error.response?.data?.error || error.message;
            console.error(`Error details: Status ${status}, Message: ${message}`);

            Alert.alert('Error', `Failed to save quote (${status || 'Unknown'}). ${message}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleClear = () => {
        ref.current.clearSignature();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} disabled={isSaving}>
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
                {isSaving && (
                    <View style={styles.loadingOverlay}>
                        <Text style={styles.loadingText}>Saving Quote...</Text>
                    </View>
                )}
            </View>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.clearBtn} onPress={handleClear} disabled={isSaving}>
                    <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.confirmBtn, isSaving && { opacity: 0.7 }]}
                    onPress={() => ref.current.readSignature()}
                    disabled={isSaving}
                >
                    <Check color="#fff" size={20} />
                    <Text style={styles.confirmText}>{isSaving ? 'Saving...' : 'Confirm Acceptance'}</Text>
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
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#007AFF',
    }
});
