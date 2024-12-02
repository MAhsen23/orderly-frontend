import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, ActivityIndicator, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Lock, X } from 'lucide-react-native';
import { fonts, fontSizes, borderRadius } from '../constants';
import useTheme from '../hooks/useTheme';
import SQLiteService from '../services/SQLiteService';
import { useAlert } from '../contexts/AlertContext';
import SettingHeader from '../components/header/SettingHeader';

const AccessCodeScreen = () => {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const { showAlert } = useAlert();
    const [code, setCode] = useState('');
    const [confirmCode, setConfirmCode] = useState('');
    const [shake] = useState(new Animated.Value(0));
    const [existingCode, setExistingCode] = useState(null);
    const [stage, setStage] = useState('loading');
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        checkExistingCode();
    }, []);

    useEffect(() => {
        if (code.length === 4) {
            handleSubmit();
        }
    }, [code]);

    useEffect(() => {
        if (confirmCode.length === 4) {
            handleSubmit();
        }
    }, [confirmCode]);

    const checkExistingCode = async () => {
        setIsProcessing(true);
        try {
            const accessCodeData = await SQLiteService.getAccessCode();
            const accessCode = accessCodeData?.accessCode;
            setExistingCode(accessCode);
            setStage((accessCode ? 'enter' : 'set'));
        } catch (error) {
            console.log("Error checking existing code:", error);
            showAlert({ title: 'Error', message: 'Failed to check existing code', type: 'error' });
            setStage('set');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleNumberPress = (number) => {
        if (stage === 'set' || stage === 'enter' || stage === 'new') {
            if (code.length < 4) setCode(code + number);
        } else if (stage === 'confirm' || stage === 'confirmNew') {
            if (confirmCode.length < 4) setConfirmCode(confirmCode + number);
        }
    };

    const handleDelete = () => {
        if (stage === 'set' || stage === 'enter' || stage === 'new') {
            if (code.length > 0) setCode(code.slice(0, -1));
        } else if (stage === 'confirm' || stage === 'confirmNew') {
            if (confirmCode.length > 0) setConfirmCode(confirmCode.slice(0, -1));
        }
    };

    const handleSubmit = async () => {
        setIsProcessing(true);
        if (stage === 'set') {
            if (code.length === 4) {
                setStage('confirm');
                setConfirmCode('');
            } else {
                showAlert({ title: 'Error', message: 'Please enter a 4-digit code', type: 'error' });
                shakeAnimation();
            }
        } else if (stage === 'confirm') {
            if (confirmCode.length === 4) {
                if (code === confirmCode) {
                    await SQLiteService.updateAccessCode(code);
                    navigation.goBack();
                } else {
                    showAlert({ title: 'Error', message: 'Codes do not match. Please try again.', type: 'error' });
                    setCode('');
                    setConfirmCode('');
                    setStage('set');
                    shakeAnimation();
                }
            } else {
                showAlert({ title: 'Error', message: 'Please confirm your 4-digit code', type: 'error' });
                shakeAnimation();
            }
        } else if (stage === 'enter') {
            if (code.length === 4) {
                if (code === existingCode) {
                    setStage('new');
                    setCode('');
                } else {
                    showAlert({ title: 'Error', message: 'Incorrect code. Please try again.', type: 'error' });
                    setCode('');
                    shakeAnimation();
                }
            } else {
                showAlert({ title: 'Error', message: 'Please enter your 4-digit code', type: 'error' });
                shakeAnimation();
            }
        } else if (stage === 'new') {
            if (code.length === 4) {
                setStage('confirmNew');
                setConfirmCode('');
            } else {
                showAlert({ title: 'Error', message: 'Please enter a 4-digit code', type: 'error' });
                shakeAnimation();
            }
        } else if (stage === 'confirmNew') {
            if (confirmCode.length === 4) {
                if (code === confirmCode) {
                    await SQLiteService.updateAccessCode(code);
                    navigation.goBack();
                } else {
                    showAlert({ title: 'Error', message: 'Codes do not match. Please try again.', type: 'error' });
                    setCode('');
                    setConfirmCode('');
                    setStage('new');
                    shakeAnimation();
                }
            } else {
                showAlert({ title: 'Error', message: 'Please confirm your 4-digit code', type: 'error' });
                shakeAnimation();
            }
        }
        setIsProcessing(false);
    };

    const shakeAnimation = () => {
        Animated.sequence([
            Animated.timing(shake, { toValue: 10, duration: 100, useNativeDriver: true }),
            Animated.timing(shake, { toValue: -10, duration: 100, useNativeDriver: true }),
            Animated.timing(shake, { toValue: 10, duration: 100, useNativeDriver: true }),
            Animated.timing(shake, { toValue: 0, duration: 100, useNativeDriver: true })
        ]).start();
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
                        (stage === 'set' || stage === 'enter' || stage === 'new' ? code.length > i : confirmCode.length > i) && { backgroundColor: theme.primary }
                    ]}
                />
            );
        }
        return dots;
    };

    const renderNumberPad = () => {
        const rows = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
            ['', 0, 'delete']
        ];
        return (
            <View style={styles.numberPad}>
                {rows.map((row, rowIndex) => (
                    <View key={rowIndex} style={styles.row}>
                        {row.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[styles.numberButton, { backgroundColor: theme.muted }]}
                                onPress={() => item !== 'delete' ? handleNumberPress(item.toString()) : handleDelete()}
                                disabled={item === ''}
                            >
                                {item === 'delete' ? (
                                    <X color={theme.foreground} size={24} />
                                ) : (
                                    <Text style={[styles.numberText, { color: theme.foreground }]}>{item}</Text>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
            </View>
        );
    };

    const getTitle = () => {
        switch (stage) {
            case 'set': return 'Set Access Code';
            case 'confirm': return 'Confirm Access Code';
            case 'enter': return 'Enter Access Code';
            case 'new': return 'Set New Access Code';
            case 'confirmNew': return 'Confirm New Access Code';
            default: return 'Access Code';
        }
    };

    const getSubtitle = () => {
        switch (stage) {
            case 'set': return 'Create a 4 digit code to secure your app';
            case 'confirm': return 'Please confirm your new access code';
            case 'enter': return 'Enter your current code to access the app';
            case 'new': return 'Create a new 4 digit code to secure your app';
            case 'confirmNew': return 'Please confirm your new access code';
            default: return '';
        }
    };

    if (stage === 'loading' || isProcessing) {
        return (
            <View style={[styles.container, styles.loadingContainer, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <SettingHeader onBackPress={() => { navigation.goBack() }} showBorder={false} />
                <View style={[styles.content, { backgroundColor: theme.background }]}>
                    <View style={styles.contentHeader}>
                        <Lock color={theme.primary} size={48} />
                        <Text style={[styles.title, { color: theme.foreground }]}>{getTitle()}</Text>
                        <Text style={[styles.subtitle, { color: theme.mutedForeground }]}>{getSubtitle()}</Text>
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
        marginTop: 3,
    },
});

export default AccessCodeScreen;