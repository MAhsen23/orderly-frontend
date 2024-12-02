import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch, ActivityIndicator } from 'react-native';
import { User, Settings, Moon, Bell, Key, MessageCircle, Globe, Users, Shield, BookOpen, FileText, Lock, ChevronRight } from 'lucide-react-native';
import { fonts, fontSizes, borderRadius, colors } from '../constants';
import useTheme from '../hooks/useTheme';
import StorageService from '../services/StorageService';
import SQLiteService from '../services/SQLiteService';
import { useNavigation } from '@react-navigation/native';
import { useAlert } from '../contexts/AlertContext';
import { useDispatch } from 'react-redux';
import { clearUser } from '../redux/features/userSlice';
import Button from '../components/button/Button';

const Profile = () => {
    const { theme, isDarkMode, toggleTheme } = useTheme();
    const { showAlert } = useAlert();
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await StorageService.removeItem('user');
            await StorageService.removeItem('token');
            await SQLiteService.clearAllData();
            dispatch(clearUser());
            setIsLoading(false);
            navigation.reset({
                index: 0,
                routes: [{ name: 'Auth' }],
            });
        } catch (error) {
            setIsLoading(false);
        }
    }

    const handleEditProfile = () => {
        navigation.navigate('EditProfile');
    }

    const showComingSoonAlert = () => {
        showAlert({ type: 'info', title: 'Coming Soon', message: 'This feature is not yet available. Stay tuned for updates!' })
    }

    const toggleAccessCode = async () => {
        try {
            const accessCodeData = await SQLiteService.getAccessCode();
            if (accessCodeData.accessCode) {
                const newValue = !useAccessCode;
                await SQLiteService.updateUseAccessCode(newValue);
                setUseAccessCode(newValue);
            }
            else {
                showAlert({ title: 'Warning', type: 'warning', message: 'Please set access code before enable' });
                return;
            }
        } catch (error) {
            console.log('Error updating access code setting:', error);
        }
    }

    const MenuItem = ({ icon: Icon, label, onPress, disabled = false }) => (
        <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: theme.muted, opacity: disabled ? 0.5 : 1 }]}
            onPress={disabled ? showComingSoonAlert : onPress}
        >
            <Icon color={theme.primary} size={24} />
            <View style={styles.menuItemTextContainer}>
                <Text allowFontScaling={false} style={[styles.menuItemText, { color: theme.foreground }]}>{label}</Text>
            </View>
            <ChevronRight color={theme.mutedForeground} size={24} />
        </TouchableOpacity>
    );

    const getInitials = (name) => {
        const names = name.split(' ');
        if (names.length > 1) {
            return `${names[0][0]}${names[1][0]}`.toUpperCase();
        }
        return name[0].toUpperCase();
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { borderColor: theme.muted }]}>
                <Text allowFontScaling={false} style={[styles.headerTitle, { color: theme.foreground }]}>Profile</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.section}>
                    <Text allowFontScaling={false} style={[styles.sectionTitle, { color: theme.foreground }]}>Account</Text>
                    <MenuItem icon={User} label="Edit Profile" onPress={showComingSoonAlert} />
                    <MenuItem icon={Settings} label="Account Settings" onPress={showComingSoonAlert} />
                </View>
                <View style={styles.section}>
                    <Text allowFontScaling={false} style={[styles.sectionTitle, { color: theme.foreground }]}>Preferences</Text>
                    <View style={[styles.menuItem, { backgroundColor: theme.muted }]}>
                        <Moon color={theme.primary} size={24} />
                        <View style={styles.menuItemTextContainer}>
                            <Text allowFontScaling={false} style={[styles.menuItemText, { color: theme.foreground }]}>Dark Mode</Text>
                        </View>
                        <Switch
                            trackColor={{ false: colors.light.border, true: colors.light.border }}
                            thumbColor={isDarkMode ? theme.primary : theme.primaryForeground}
                            ios_backgroundColor={theme.muted}
                            onValueChange={toggleTheme}
                            value={isDarkMode}
                        />
                    </View>
                    <MenuItem icon={Bell} label="Notifications" onPress={showComingSoonAlert} />
                    <MenuItem icon={Globe} label="Change Language" onPress={showComingSoonAlert} />
                </View>
                <View style={styles.section}>
                    <Text allowFontScaling={false} style={[styles.sectionTitle, { color: theme.foreground }]}>Security</Text>
                    <View style={[styles.menuItem, { backgroundColor: theme.muted }]}>
                        <Lock color={theme.primary} size={24} />
                        <View style={styles.menuItemTextContainer}>
                            <Text allowFontScaling={false} style={[styles.menuItemText, { color: theme.foreground }]}>Use Access Code</Text>
                        </View>
                        <Switch
                            trackColor={{ false: colors.light.border, true: colors.light.border }}
                            // thumbColor={useAccessCode ? theme.primary : theme.primaryForeground}
                            ios_backgroundColor={theme.muted}
                            onValueChange={toggleAccessCode}
                            value={false}
                        />
                    </View>
                    <MenuItem icon={Key} label={"Access Code"} onPress={() => { navigation.navigate('AccessCode') }} />
                </View>
                <View style={styles.section}>
                    <Text allowFontScaling={false} style={[styles.sectionTitle, { color: theme.foreground }]}>About</Text>
                    <MenuItem icon={BookOpen} label="Quick Guide" onPress={() => { navigation.navigate('Welcome') }} />
                    <MenuItem icon={Shield} label="Privacy Policy" onPress={showComingSoonAlert} />
                    <MenuItem icon={FileText} label="Terms and Conditions" onPress={showComingSoonAlert} />
                    <MenuItem icon={Users} label="Invite a Friend" onPress={showComingSoonAlert} />
                </View>
                <View style={styles.section}>
                    <Text allowFontScaling={false} style={[styles.sectionTitle, { color: theme.foreground }]}>Support</Text>
                    <MenuItem icon={MessageCircle} label="Support" onPress={showComingSoonAlert} />
                </View>
                <Button isLoading={isLoading} onPress={() => { handleLogout() }} text={'Logout'} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: { paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, },
    headerTitle: { fontSize: fontSizes['2xl'], fontFamily: fonts.bold },
    scrollContent: {
        padding: 20,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: fontSizes.lg,
        fontFamily: fonts.semibold,
        marginBottom: 15,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: borderRadius.lg,
        padding: 15,
        marginBottom: 10,
    },
    menuItemTextContainer: {
        flex: 1,
        marginLeft: 15,
    },
    menuItemText: {
        fontSize: fontSizes.base,
        fontFamily: fonts.medium,
        marginTop: 3,
    },
});

export default Profile;