import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import useTheme from '../../hooks/useTheme';
import { fontSizes, fonts, borderRadius } from '../../constants';

const Button = ({ onPress, isLoading, text }) => {
    const { theme } = useTheme();

    return (
        <TouchableOpacity onPress={onPress} style={[styles.button, { backgroundColor: theme.primary }]} disabled={isLoading}>
            {isLoading ? (
                <ActivityIndicator color={theme.primaryForeground} />
            ) : (
                <Text allowFontScaling={false} style={[styles.buttonText, { color: theme.primaryForeground }]}>{text}</Text>
            )}
        </TouchableOpacity>
    );
};
const styles = StyleSheet.create({
    button: {
        borderRadius: borderRadius.lg,
        height: 45,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16
    },
    buttonText: {
        fontSize: fontSizes.base,
        fontFamily: fonts.semibold,
        marginTop: 3,
    },
});

export default Button;