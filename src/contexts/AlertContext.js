import React, { createContext, useContext, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react-native';
import { fonts, fontSizes, borderRadius } from '../constants';
import useTheme from '../hooks/useTheme';

const AlertContext = createContext(undefined);

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlert must be used within an AlertProvider');
    }
    return context;
};

export const AlertProvider = ({ children }) => {
    const [alertState, setAlertState] = useState(null);
    const { theme, isDarkMode } = useTheme();

    const showAlert = (options) => {
        setAlertState(options);

        if (options.duration) {
            setTimeout(hideAlert, options.duration);
        }
    };

    const hideAlert = () => {
        setAlertState(null);
    };

    const getAlertIcon = (type) => {
        switch (type) {
            case 'success':
                return <CheckCircle color={theme.foreground} size={20} />;
            case 'error':
                return <XCircle color={theme.foreground} size={20} />;
            case 'info':
                return <Info color={theme.foreground} size={20} />;
            case 'warning':
                return <AlertCircle color={theme.foreground} size={20} />;
            default:
                return null;
        }
    };

    return (
        <AlertContext.Provider value={{ showAlert, hideAlert }}>
            {children}
            <Modal transparent visible={!!alertState} animationType="none">
                <View style={styles.modalContainer}>
                    <View
                        style={[
                            styles.alertContainer,
                            { backgroundColor: isDarkMode ? theme.accent : theme.background },
                        ]}
                    >
                        {alertState && (
                            <>
                                <View style={styles.headerContainer}>
                                    {/* {getAlertIcon(alertState.type)} */}
                                    <Text allowFontScaling={false} style={[styles.title, { color: theme.foreground }]}>
                                        {alertState.title}
                                    </Text>
                                </View>
                                <Text allowFontScaling={false} style={[styles.message, { color: theme.mutedForeground }]}>
                                    {alertState.message}
                                </Text>
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity
                                        style={[styles.button, {}]}
                                        onPress={hideAlert}
                                    >
                                        <Text allowFontScaling={false} style={[styles.buttonText, { color: theme.foreground }]}>OK</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </AlertContext.Provider>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0)',
    },
    alertContainer: {
        width: '80%',
        borderRadius: borderRadius.md,
        padding: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    title: {
        fontSize: fontSizes.lg,
        fontFamily: fonts.semibold,
    },
    message: {
        fontSize: fontSizes.base,
        fontFamily: fonts.normal,
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    button: {
        padding: 5,
    },
    buttonText: {
        fontSize: fontSizes.base,
        fontFamily: fonts.medium,
    },
});
