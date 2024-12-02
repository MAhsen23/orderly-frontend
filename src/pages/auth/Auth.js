import React, { useState, useEffect } from 'react'
import { Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, Alert, SafeAreaView, } from 'react-native'
import { Mail, Lock, User, } from 'lucide-react-native'
import { fontSizes, fonts } from '../../constants'
import { useNavigation } from '@react-navigation/native'
import ApiService from '../../services/ApiService'
import useTheme from '../../hooks/useTheme'
import StorageService from '../../services/StorageService'
import AuthHeader from '../../components/header/AuthHeader'
import Button from '../../components/button/Button'
import InputField from '../../components/inputField/InputField'
import { useAlert } from '../../contexts/AlertContext';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/features/userSlice';
import SQLiteService from '../../services/SQLiteService'
import { setNotes } from '../../redux/features/notesSlice'

export default function Auth() {
    const { theme } = useTheme();
    const { showAlert } = useAlert();
    const navigation = useNavigation()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const dispatch = useDispatch();

    const handleAuth = async () => {
        if (!email || !password) {
            showAlert({
                type: 'error',
                title: 'Error',
                message: 'Email and Password fields cannot be empty.',
            });
            return
        }
        setIsLoading(true);
        try {
            const response = await ApiService.login({ email, password });
            if (response.success) {
                const { token, user, menstrualCycles, notes } = response;
                await StorageService.setValue('token', token);
                await StorageService.setValue('user', user._id);

                await SQLiteService.setUser(user);

                const cycles = menstrualCycles.map(cycle => ({
                    startDate: cycle.startDate, endDate: cycle.endDate || null, duration: cycle.duration
                }));
                await SQLiteService.setMenstrualCycles(cycles);

                const lastPeriodStartDate = cycles.length ? cycles[cycles.length - 1].startDate : null;
                dispatch(setUser({ user: { ...user, lastPeriodStartDate }, token }));

                const formattedNotes = notes.filter(note => note.trim() !== '');
                dispatch(setNotes(formattedNotes));
                await SQLiteService.setNotes(formattedNotes);

                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Main' }],
                });
            }
        } catch (loginError) {
            showAlert({
                type: 'error',
                title: 'Error',
                message: loginError.response?.data?.error || 'An error cccurred during login',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }
    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={[styles.container, { backgroundColor: theme.background }]}
            >
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    <AuthHeader isLogin={true} />

                    <InputField
                        label="Email"
                        icon={<Mail size={16} color={theme.mutedForeground} />}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Enter your email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <InputField
                        label="Password"
                        icon={<Lock size={16} color={theme.mutedForeground} />}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Enter your password"
                        secureTextEntry={!showPassword}
                        togglePasswordVisibility={togglePasswordVisibility}
                        showPassword={showPassword}
                    />

                    <Button
                        onPress={handleAuth}
                        isLoading={isLoading}
                        text={'Log In'}
                    />

                    <TouchableOpacity onPress={() => {
                        // navigation.navigate('Signup')
                    }} style={styles.toggleAuthButton}>
                        <Text allowFontScaling={false} style={[styles.toggleAuthText, { color: theme.mutedForeground }]}>
                            Don't have an account? Register
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    toggleAuthButton: {
        marginTop: 16,
        alignItems: 'center'
    },
    toggleAuthText: {
        fontSize: fontSizes.sm,
        fontFamily: fonts.normal,
        letterSpacing: 0.25
    }
});