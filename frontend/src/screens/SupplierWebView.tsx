import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { X, ChevronLeft, ChevronRight, Share, Box } from 'lucide-react-native';

export default function SupplierWebView({ route, navigation }: any) {
    const { url, supplierName } = route.params;
    const [canGoBack, setCanGoBack] = useState(false);
    const [canGoForward, setCanGoForward] = useState(false);
    const webViewRef = useRef<WebView>(null);

    const script = `
    (function() {
      // Logic to capture part info from page could be added here
      // But per rules, technician confirms manually.
      // We can add a bridge to send data back if needed.
    })();
  `;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <X color="#333" size={24} />
                </TouchableOpacity>
                <Text style={styles.title}>{supplierName}</Text>
                <TouchableOpacity style={styles.captureBtn} onPress={() => {
                    // Transition to form to manually enter captured data
                    navigation.navigate('CapturePart', { supplier: supplierName });
                }}>
                    <Box color="#fff" size={20} />
                    <Text style={styles.captureText}>Capture</Text>
                </TouchableOpacity>
            </View>

            <WebView
                ref={webViewRef}
                source={{ uri: url }}
                style={styles.webview}
                onNavigationStateChange={(navState) => {
                    setCanGoBack(navState.canGoBack);
                    setCanGoForward(navState.canGoForward);
                }}
                injectedJavaScript={script}
            />

            <View style={styles.navBar}>
                <TouchableOpacity
                    onPress={() => webViewRef.current?.goBack()}
                    disabled={!canGoBack}
                >
                    <ChevronLeft color={canGoBack ? "#007AFF" : "#CCC"} size={32} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => webViewRef.current?.goForward()}
                    disabled={!canGoForward}
                >
                    <ChevronRight color={canGoForward ? "#007AFF" : "#CCC"} size={32} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => webViewRef.current?.reload()}>
                    <Share color="#007AFF" size={24} />
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
    webview: {
        flex: 1,
    },
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    captureBtn: {
        backgroundColor: '#34C759',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    captureText: {
        color: '#fff',
        marginLeft: 4,
        fontWeight: '600',
    }
});
