import React, { useState, useEffect } from 'react'
import { Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, Alert, SafeAreaView, View, } from 'react-native'
import { Mail, Lock, User, ChevronLeft, } from 'lucide-react-native'
import { fontSizes, fonts } from '../../constants'
import { useNavigation } from '@react-navigation/native'
import ApiService from '../../services/ApiService'
import useTheme from '../../hooks/useTheme'
import StorageService from '../../services/StorageService'
import AuthHeader from '../../components/header/AuthHeader'
import Button from '../../components/button/Button'
import InputField from '../../components/inputField/InputField'
import { useAlert } from '../../contexts/AlertContext'
import { useDispatch } from 'react-redux'
import { setUser } from '../../redux/features/userSlice'
import SQLiteService from '../../services/SQLiteService'

export default function Auth() {
    const { theme } = useTheme();
    const { showAlert } = useAlert();
    const navigation = useNavigation()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const dispatch = useDispatch();

    const validateForm = () => {
        if (!name.trim()) return showAlert({ type: 'error', title: 'Validation Error', message: 'Name is required.' }) && false;
        if (!email.trim()) return showAlert({ type: 'error', title: 'Validation Error', message: 'Email is required.' }) && false;
        if (!/\S+@\S+\.\S+/.test(email)) return showAlert({ type: 'error', title: 'Validation Error', message: 'Invalid email format.' }) && false;
        if (!password) return showAlert({ type: 'error', title: 'Validation Error', message: 'Password is required.' }) && false;
        if (password.length < 8 && !isLogin) return showAlert({ type: 'error', title: 'Validation Error', message: 'Password must be at least 6 characters long.' }) && false;
        if (password !== confirmPassword) return showAlert({ type: 'error', title: 'Validation Error', message: 'Passwords do not match.' }) && false;
        return true;
    }

    const handleSignup = async () => {
        if (validateForm()) {
            setIsLoading(true)
            try {
                const userData = { name, email, password };
                const response = await ApiService.createUser(userData);
                if (response.success) {
                    await StorageService.setValue('user', response.user._id);
                    await SQLiteService.setUser(response.user);
                    dispatch(setUser({ user: response.user, token: null }));
                    navigation.navigate('Verification');
                }
            } catch (error) {
                showAlert({ type: 'error', title: 'Error', message: error.response?.data?.message || 'An error cccurred during registration' });
            } finally {
                setIsLoading(false);
            }
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    }

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={[styles.container, { backgroundColor: theme.background }]}>
                <View style={[styles.header]}>
                    <TouchableOpacity onPress={() => { navigation.goBack() }} style={styles.backButton}>
                        <ChevronLeft color={theme.mutedForeground} size={24} />
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    <AuthHeader isLogin={false} />
                    <InputField
                        label="Name"
                        icon={<User size={16} color={theme.mutedForeground} />}
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter your name"
                        autoCapitalize="words"
                    />

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

                    <InputField
                        label="Confirm Password"
                        icon={<Lock size={16} color={theme.mutedForeground} />}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Confirm your password"
                        secureTextEntry={!showConfirmPassword}
                        togglePasswordVisibility={toggleConfirmPasswordVisibility}
                        showPassword={showConfirmPassword}
                    />

                    <Button
                        onPress={handleSignup}
                        isLoading={isLoading}
                        text={'Sign Up'}
                    />

                    <TouchableOpacity onPress={() => { navigation.goBack() }} style={styles.toggleAuthButton}>
                        <Text allowFontScaling={false} style={[styles.toggleAuthText, { color: theme.mutedForeground }]}>
                            Already have an account? Login
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
    header: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 15,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    backButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
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