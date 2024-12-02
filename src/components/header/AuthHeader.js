import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fontSizes, fonts } from '../../constants';
import useTheme from '../../hooks/useTheme';

const AuthHeader = ({ isLogin }) => {
    const { theme } = useTheme();
    return (
        <View style={styles.headerContainer}>
            <Text allowFontScaling={false} style={[styles.headerTitle, { color: theme.primary }]}>
                {isLogin ? 'Welcome Back' : 'Create Account'}
            </Text>
            <Text allowFontScaling={false} style={[styles.headerSubtitle, { color: theme.mutedForeground }]}>
                {isLogin ? 'Log in to your account' : 'Sign up to get started'}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        alignItems: 'center',
        marginBottom: 32
    },
    headerTitle: {
        fontSize: fontSizes['3xl'],
        fontFamily: fonts.bold,
    },
    headerSubtitle: {
        fontSize: fontSizes.sm,
        fontFamily: fonts.normal,
        marginTop: 8
    },
});

export default AuthHeader;