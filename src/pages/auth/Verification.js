import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Keyboard,
    Dimensions,
    SafeAreaView,
} from 'react-native';
import { borderRadius, fonts, fontSizes } from '../../constants';
import { ChevronLeft } from 'lucide-react-native';
import Button from '../../components/button/Button';
import useTheme from '../../hooks/useTheme';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import ApiService from '../../services/ApiService';
import { setUser } from '../../redux/features/userSlice';
import StorageService from '../../services/StorageService';
import { useAlert } from '../../contexts/AlertContext';

const OTP_LENGTH = 6;
const { width } = Dimensions.get('window');
const BOX_SIZE = Math.min((width - 80) / OTP_LENGTH, 50);

const Verification = () => {
    const { theme } = useTheme();
    const { showAlert } = useAlert();
    const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
    const [focusedIndex, setFocusedIndex] = useState(0);
    const inputRefs = useRef([]);
    const navigation = useNavigation();
    const user = useSelector(state => state.user.user);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false)

    const handleOtpChange = (value, index) => {
        if (value.length > 1) {
            const otpArray = value.split('').slice(0, OTP_LENGTH);
            const newOtp = [...otp];
            otpArray.forEach((digit, idx) => {
                if (idx + index < OTP_LENGTH) {
                    newOtp[idx + index] = digit;
                }
            });
            setOtp(newOtp);
            if (index + otpArray.length < OTP_LENGTH) {
                inputRefs.current[index + otpArray.length]?.focus();
            } else {
                Keyboard.dismiss();
            }
            return;
        }
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value !== '') {
            if (index < OTP_LENGTH - 1) {
                inputRefs.current[index + 1]?.focus();
            } else {
                Keyboard.dismiss();
            }
        }
    };

    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && index > 0 && otp[index] === '') {
            const newOtp = [...otp];
            newOtp[index - 1] = '';
            setOtp(newOtp);
            inputRefs.current[index - 1]?.focus();
        }
    };

    const verifyOtp = async () => {
        const code = otp.join('');
        if (code.length !== OTP_LENGTH) {
            return;
        }
        setIsLoading(true);
        try {
            const response = await ApiService.verifyOTP(user._id, code);
            if (response.success) {
                const token = response.token;
                const user = response.user;
                await StorageService.setValue('user', user);
                await StorageService.setValue('token', token);
                dispatch(setUser({ user, token }));
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Setup' }],
                });
            }
        } catch (error) {
            showAlert({
                type: 'error',
                title: 'Error',
                message: error.response?.data?.message || 'An error cccurred during verification',
            });
        }
        finally {
            setIsLoading(false)
        }
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <View style={[styles.header]}>
                    <TouchableOpacity onPress={() => { navigation.goBack() }} style={styles.backButton}>
                        <ChevronLeft color={theme.mutedForeground} size={24} />
                    </TouchableOpacity>
                </View>
                <View style={styles.content}>
                    <View style={styles.contentText}>
                        <Text allowFontScaling={false} style={[styles.title, { color: theme.primary }]}>
                            OTP Verification
                        </Text>
                        <Text allowFontScaling={false} style={[styles.subtitle, { color: theme.mutedForeground }]}>
                            Please enter 6 digit code we have sent you on your email <Text style={{ letterSpacing: 0.5 }}>{user.email}</Text>
                        </Text>
                    </View>
                    <View style={styles.otpContainer}>
                        {otp.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={ref => inputRefs.current[index] = ref}
                                style={[
                                    { color: theme.foreground, borderColor: focusedIndex === index ? theme.primary : theme.border },
                                    styles.otpInput,
                                ]}
                                value={digit}
                                onChangeText={(value) => handleOtpChange(value, index)}
                                onKeyPress={(e) => handleKeyPress(e, index)}
                                onFocus={() => setFocusedIndex(index)}
                                keyboardType="numeric"
                                maxLength={1}
                                selectTextOnFocus
                            />
                        ))}
                    </View>
                    <Button
                        onPress={verifyOtp}
                        isLoading={isLoading}
                        text={'Continue'}
                    />
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
    content: {
        flex: 1,
        padding: 20,
    },
    contentText: {
        alignItems: 'center',
        marginBottom: 32
    },
    title: {
        fontSize: fontSizes['3xl'],
        fontFamily: fonts.bold,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: fontSizes.sm,
        fontFamily: fonts.normal,
        textAlign: 'center',
        marginTop: 8,
        lineHeight: 24,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    otpInput: {
        width: BOX_SIZE,
        height: BOX_SIZE,
        borderWidth: 1,
        borderRadius: borderRadius.lg,
        textAlign: 'center',
        fontSize: fontSizes.lg,
    },
});

export default Verification;