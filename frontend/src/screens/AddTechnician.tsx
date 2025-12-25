import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Save, Mail, User, Shield, Lock } from 'lucide-react-native';
import { userApi } from '../services/api';

export default function AddTechnician({ navigation }: any) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('tech123'); // Default password
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        if (!firstName || !lastName || !email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        setIsLoading(true);
        try {
            await userApi.createTechnician({
                firstName,
                lastName,
                email,
                password,
                role: 'TECHNICIAN'
            });

            Alert.alert(
                'Success',
                `Technician ${firstName} ${lastName} has been created. They can now log in using the email and password provided.`,
                [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
        } catch (error: any) {
            console.error('Failed to create technician:', error);
            Alert.alert('Error', error.response?.data?.error || 'Failed to create technician account');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft color="#333" size={24} />
                </TouchableOpacity>
                <Text style={styles.title}>Add Technician</Text>
                <TouchableOpacity onPress={handleSave} disabled={isLoading}>
                    <Save color={isLoading ? '#ccc' : '#007AFF'} size={24} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                <View style={[styles.infoCard, { backgroundColor: '#E8F2FF', marginBottom: 24 }]}>
                    <Shield color="#007AFF" size={20} />
                    <Text style={styles.infoText}>
                        Create a new account manually. Set a temporary password for the technician to log in.
                    </Text>
                </View>

                <Text style={styles.label}>First Name</Text>
                <View style={styles.inputContainer}>
                    <User color="#999" size={20} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. Alice"
                        value={firstName}
                        onChangeText={setFirstName}
                    />
                </View>

                <Text style={styles.label}>Last Name</Text>
                <View style={styles.inputContainer}>
                    <User color="#999" size={20} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. Smith"
                        value={lastName}
                        onChangeText={setLastName}
                    />
                </View>

                <Text style={styles.label}>Email Address</Text>
                <View style={styles.inputContainer}>
                    <Mail color="#999" size={20} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="alice@hvac.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>

                <Text style={styles.label}>Temporary Password</Text>
                <View style={styles.inputContainer}>
                    <Lock color="#999" size={20} style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.saveBtn, isLoading && styles.disabledBtn]}
                    onPress={handleSave}
                    disabled={isLoading}
                >
                    <Text style={styles.saveBtnText}>
                        {isLoading ? 'Creating Account...' : 'Create Technician Account'}
                    </Text>
                </TouchableOpacity>
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
    infoCard: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    infoText: {
        color: '#007AFF',
        fontSize: 14,
        marginLeft: 12,
        flex: 1,
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
        fontWeight: '500',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F7FA',
        borderRadius: 12,
        marginBottom: 20,
        paddingHorizontal: 12,
    },
    inputIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        padding: 16,
        fontSize: 16,
        color: '#1a1a1a',
    },
    saveBtn: {
        backgroundColor: '#007AFF',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 12,
    },
    disabledBtn: {
        backgroundColor: '#A0CCFF',
    },
    saveBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    }
});
