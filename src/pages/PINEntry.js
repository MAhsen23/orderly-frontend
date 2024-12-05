import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, SafeAreaView } from 'react-native';
import { Lock, X, Fingerprint } from 'lucide-react-native';
import { fonts, fontSizes, borderRadius } from '../constants';
import useTheme from '../hooks/useTheme';
import SQLiteService from '../services/SQLiteService';
import { useNavigation } from '@react-navigation/native';
import StorageService from '../services/StorageService';
import TouchID from 'react-native-touch-id';

const PinEntryScreen = () => {
    const { theme } = useTheme();
    const [pin, setPin] = useState('');
    const navigation = useNavigation();
    const [shake] = useState(new Animated.Value(0));
    const [isBiometricSupported, setIsBiometricSupported] = useState(false);

    useEffect(() => {
        checkBiometricSupport();
    }, []);

    useEffect(() => {
        if (pin.length === 4) {
            verifyPin();
        }
    }, [pin]);

    useEffect(() => {
        if (isBiometricSupported) {
            setTimeout(() => {
                handleBiometricAuth();
            }, 500); // Delay of 500ms to ensure complete screen load
        }
    }, [isBiometricSupported]);

    const checkBiometricSupport = () => {
        TouchID.isSupported()
            .then(biometryType => {
                setIsBiometricSupported(true);
            })
            .catch(error => {
                console.log('TouchID error', error);
                setIsBiometricSupported(false);
            });
    };

    const verifyPin = async () => {
        const { accessCode } = await SQLiteService.getAccessCode();
        console.log('accessCode', accessCode);
        if (pin === accessCode) {
            navigateToNextScreen();
        } else {
            setPin('');
            shakeAnimation();
        }
    };

    const navigateToNextScreen = async () => {
        try {
            const user = await StorageService.getValue('user');
            if (user) {
                const isProfileComplete = await StorageService.getValue('isProfileComplete');
                if (isProfileComplete) { navigation.replace('Main'); }
                else { navigation.replace('Setup'); }
            }
            else {
                navigation.replace('Auth');
            }
        } catch (error) {
            navigation.replace('Main');
        }
    };

    const handleNumberPress = (number) => {
        if (pin.length < 4) setPin(pin + number);
    };

    const handleDelete = () => {
        if (pin.length > 0) setPin(pin.slice(0, -1));
    };

    const shakeAnimation = () => {
        Animated.sequence([
            Animated.timing(shake, { toValue: 10, duration: 100, useNativeDriver: true }),
            Animated.timing(shake, { toValue: -10, duration: 100, useNativeDriver: true }),
            Animated.timing(shake, { toValue: 10, duration: 100, useNativeDriver: true }),
            Animated.timing(shake, { toValue: 0, duration: 100, useNativeDriver: true })
        ]).start();
    };

    const handleBiometricAuth = () => {
        const optionalConfigObject = {
            title: 'Authentication Required',
            imageColor: theme.primary,
            imageErrorColor: theme.error,
            sensorDescription: 'Touch sensor',
            sensorErrorDescription: 'Failed',
            cancelText: 'Cancel',
            fallbackLabel: 'Show Passcode',
            unifiedErrors: false,
            passcodeFallback: false,
        };
        TouchID.authenticate('Authenticate to access the app', optionalConfigObject)
            .then(success => {
                navigateToNextScreen();
            })
            .catch(error => {
                console.log('Authentication Failed', error);
            });
    };

    const renderDots = () => {
        const dots = [];
        for (let i = 0; i < 4; i++) {
            dots.push(
                <View
                    key={i}
                    style={[
                        styles.dot,
                        { backgroundColor: theme.border },
                        pin.length > i && { backgroundColor: theme.primary }
                    ]}
                />
            );
        }
        return dots;
    };

    const renderNumberPad = () => {
        const rows = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [isBiometricSupported ? 'fingerprint' : '', 0, 'delete']];
        return (
            <View style={styles.numberPad}>
                {rows.map((row, rowIndex) => (
                    <View key={rowIndex} style={styles.row}>
                        {row.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[styles.numberButton, { backgroundColor: theme.muted }]}
                                onPress={() => {
                                    if (item === 'fingerprint') handleBiometricAuth();
                                    else if (item === 'delete') handleDelete();
                                    else handleNumberPress(item.toString());
                                }}
                                disabled={item === ''}
                            >
                                {item === 'delete' ? <X color={theme.foreground} size={24} /> :
                                    item === 'fingerprint' ? <Fingerprint color={theme.foreground} size={24} /> :
                                        item !== '' ? <Text style={[styles.numberText, { color: theme.foreground }]}>{item}</Text> : null}
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
            </View>
        );
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <View style={[styles.content, { backgroundColor: theme.background }]}>
                    <View style={styles.contentHeader}>
                        <Lock color={theme.primary} size={48} />
                        <Text style={[styles.title, { color: theme.foreground }]}>Enter PIN</Text>
                        <Text style={[styles.subtitle, { color: theme.mutedForeground }]}>Enter your PIN to access the app</Text>
                        <Animated.View style={[styles.dotsContainer, { transform: [{ translateX: shake }] }]}>
                            {renderDots()}
                        </Animated.View>
                    </View>
                    {renderNumberPad()}
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    contentHeader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: fontSizes['2xl'],
        fontFamily: fonts.bold,
        marginTop: 20,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: fontSizes.base,
        fontFamily: fonts.normal,
        textAlign: 'center',
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 30,
    },
    dot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginHorizontal: 8,
    },
    numberPad: {
        padding: 10,
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    numberButton: {
        width: '30%',
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: borderRadius.default,
    },
    numberText: {
        fontSize: fontSizes['2xl'],
        fontFamily: fonts.semibold,
    },
});

export default PinEntryScreen;