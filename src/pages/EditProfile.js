import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import { User, Mail, Calendar, Clock, ArrowLeft } from 'lucide-react-native';
import { fonts, fontSizes, borderRadius } from '../constants';
import useTheme from '../hooks/useTheme';
import SQLiteService from '../services/SQLiteService';
import { useNavigation } from '@react-navigation/native';
import InputField from '../components/inputField/InputField';
import SettingHeader from '../components/header/SettingHeader';
const EditProfile = () => {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    const [userConfig, setUserConfig] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [birthYear, setBirthYear] = useState('');
    const [averageCycleLength, setAverageCycleLength] = useState('');
    const [averagePeriodDuration, setAveragePeriodDuration] = useState('');

    useEffect(() => {
        const fetchUserConfig = async () => {
            try {
                const config = await SQLiteService.getUserConfig();
                setUserConfig(config);
                setName(config.name || '');
                setEmail(config.email || '');
                setBirthYear(config.birthYear ? config.birthYear.toString() : '');
                setAverageCycleLength(config.averageCycleLength ? config.averageCycleLength.toString() : '');
                setAveragePeriodDuration(config.averagePeriodDuration ? config.averagePeriodDuration.toString() : '');
            } catch (error) {
                console.log('Error fetching user config:', error);
            }
        };
        fetchUserConfig();
    }, []);

    const handleSave = async () => {
        // setIsLoading(true);
        // try {
        //     await SQLiteService.updateUserConfig({
        //         ...userConfig,
        //         name,
        //         email,
        //         birthYear: parseInt(birthYear, 10),
        //         averageCycleLength: parseInt(averageCycleLength, 10),
        //         averagePeriodDuration: parseInt(averagePeriodDuration, 10),
        //     });
        //     setIsLoading(false);
        //     navigation.goBack();
        // } catch (error) {
        //     console.error('Error updating user config:', error);
        //     setIsLoading(false);
        //     Alert.alert('Error', 'Failed to update profile. Please try again.');
        // }
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <SettingHeader title="Edit Profile" onBackPress={() => { navigation.goBack() }} showBorder={true} />
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    <View style={styles.form}>
                        <InputField
                            label="Name"
                            icon={<User size={16} color={theme.mutedForeground} />}
                            value={name}
                            onChangeText={setName}
                            placeholder="Enter your name"
                            autoCapitalize='words'
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
                            label="Birth Year"
                            icon={<Calendar size={16} color={theme.mutedForeground} />}
                            value={birthYear}
                            onChangeText={setBirthYear}
                            placeholder="Enter your birth year"
                            keyboardType="numeric"
                        />
                        <InputField
                            label="Cycle Length"
                            icon={<Clock size={16} color={theme.mutedForeground} />}
                            value={averageCycleLength}
                            onChangeText={setAverageCycleLength}
                            placeholder="Enter average cycle length"
                            keyboardType="numeric"
                        />
                        <InputField
                            label="Period Duration"
                            icon={<Clock size={16} color={theme.mutedForeground} />}
                            value={averagePeriodDuration}
                            onChangeText={setAveragePeriodDuration}
                            placeholder="Enter average period duration"
                            keyboardType="numeric"
                        />
                    </View>
                </ScrollView>
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.button, styles.cancelButton, { borderColor: theme.border }]}
                        onPress={() => navigation.goBack()}
                    >
                        <Text allowFontScaling={false} style={[styles.buttonText, { color: theme.foreground }]}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, styles.saveButton, { backgroundColor: theme.primary }]}
                        onPress={handleSave}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color={theme.primaryForeground} />
                        ) : (
                            <Text allowFontScaling={false} style={[styles.buttonText, { color: theme.primaryForeground }]}>Save</Text>
                        )}
                    </TouchableOpacity>
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
    scrollContent: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    form: {
        //marginBottom: 20,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        alignItems: 'center',
        paddingVertical: 15,
    },
    button: {
        flex: 1,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: borderRadius.default,
        alignItems: 'center',
    },
    cancelButton: {
        marginRight: 5,
        borderWidth: 1,
    },
    saveButton: {
        marginLeft: 5,
    },
    buttonText: {
        fontSize: fontSizes.base,
        fontFamily: fonts.semibold,
        marginTop: 3,
    },
});

export default EditProfile;