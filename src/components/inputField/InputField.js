import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { fontSizes, borderRadius, fonts } from '../../constants';
import useTheme from '../../hooks/useTheme';

const InputField = ({
    label,
    icon,
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    togglePasswordVisibility,
    showPassword,
    keyboardType,
    autoCapitalize = 'none'
}) => {
    const { theme } = useTheme();

    return (
        <View style={styles.inputContainer}>
            <Text allowFontScaling={false} style={[styles.inputLabel, { color: theme.foreground }]}>
                {label}
            </Text>
            <View style={[styles.inputWrapper, { borderColor: theme.border }]}>
                {icon}
                <TextInput
                    autoComplete="off"
                    autoCorrect={false}
                    allowFontScaling={false}
                    style={[styles.input, { color: theme.foreground }]}
                    placeholder={placeholder}
                    value={value}
                    placeholderTextColor={theme.mutedForeground}
                    onChangeText={onChangeText}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType || 'default'}
                    autoCapitalize={autoCapitalize}
                />
                {togglePasswordVisibility && (
                    <TouchableOpacity
                        hitSlop={{ left: 20, right: 20, bottom: 20, top: 20 }}
                        onPress={togglePasswordVisibility}
                    >
                        {showPassword ? (
                            <EyeOff size={16} color={theme.mutedForeground} />
                        ) : (
                            <Eye size={16} color={theme.mutedForeground} />
                        )}
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    inputContainer: {
        marginBottom: 16
    },
    inputLabel: {
        fontSize: fontSizes.sm,
        fontFamily: fonts.medium,
        marginBottom: 8
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: borderRadius.lg,
        paddingHorizontal: 16,
    },
    input: {
        flex: 1,
        height: 40,
        paddingHorizontal: 8,
        fontSize: fontSizes.sm,
        fontFamily: fonts.normal,
        marginTop: 3,
    },
});

export default InputField;