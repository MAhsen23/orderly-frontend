import React, { useEffect, useState } from 'react';
import { StatusBar, View, ActivityIndicator } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { CardStyleInterpolators } from '@react-navigation/stack';
import Auth from '../../pages/auth/Auth';
import Signup from '../../pages/auth/Signup';
import Verification from '../../pages/auth/Verification';
import BottomTabNavigator from '../bottom/Bottom';
import useTheme from '../../hooks/useTheme';
import Welcome from '../../pages/Welcome';
import StorageService from '../../services/StorageService';
import Setup from '../../pages/Setup';
import EditProfile from '../../pages/EditProfile';
import SQLiteService from '../../services/SQLiteService';
import SplashScreen from 'react-native-splash-screen';
import AccessCodeScreen from '../../pages/AccessCode';
import PinEntryScreen from '../../pages/PINEntry';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/features/userSlice';
import { setDailyTip } from '../../redux/features/dailyTipSlice';
import { healthTips } from '../../constants';
import { setNotes } from '../../redux/features/notesSlice';

const Stack = createStackNavigator();

function AppStack() {
    const { theme, isDarkMode } = useTheme();
    const [initialRoute, setInitialRoute] = useState(null);
    const dispatch = useDispatch();

    const getRandomTip = () => {
        const randomIndex = Math.floor(Math.random() * healthTips.length);
        return healthTips[randomIndex];
    };

    const updateDailyTip = async () => {
        try {
            const today = new Date().toDateString();
            const lastTipDate = await StorageService.getValue('lastTipDate');
            const savedTip = lastTipDate === today ? await StorageService.getValue('currentTip') : null;
            const tip = savedTip || getRandomTip();
            dispatch(setDailyTip({ tip, date: today }));

            if (!savedTip) {
                await StorageService.setValue('lastTipDate', today);
                await StorageService.setValue('currentTip', tip);
            }
        } catch (error) {
            dispatch(setDailyTip({ tip: getRandomTip(), date: new Date().toDateString() }));
        }
    };

    useEffect(() => {
        checkUser();
        SQLiteService.initDB();
    }, []);

    const loadUserData = async (userId) => {
        try {
            const user = await SQLiteService.getUser();
            const notes = await SQLiteService.getNotes();
            dispatch(setNotes(notes));
            const menstrualCycles = await SQLiteService.getMenstrualCycles();
            const lastPeriodStartDate = menstrualCycles.length ? menstrualCycles[menstrualCycles.length - 1].startDate : null;
            dispatch(setUser({ user: { ...user, lastPeriodStartDate }, token: await StorageService.getValue('token') }));
            return true;
        } catch (error) {
            return false;
        }
    };

    const checkUser = async () => {
        try {
            const user = await StorageService.getValue('user');
            if (user) {
                const token = await StorageService.getValue('token');
                if (token) {
                    await loadUserData(user);
                    await updateDailyTip();
                    setInitialRoute('Main');
                } else {
                    setInitialRoute('Auth');
                }
            } else {
                const isFirstLaunch = await StorageService.getValue('isFirstLaunch');
                if (isFirstLaunch === false) {
                    await updateDailyTip();
                    setInitialRoute('Auth');
                } else {
                    await StorageService.setValue('isFirstLaunch', false);
                    await updateDailyTip();
                    setInitialRoute('Welcome');
                }
            }
        } catch (error) {
            await updateDailyTip();
            setInitialRoute('Auth');
        } finally {
            SplashScreen.hide();
        }
    };

    if (initialRoute === null) {
        return (
            <>
                <StatusBar backgroundColor={theme.background} barStyle={isDarkMode ? "light-content" : "dark-content"} />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
                    <ActivityIndicator size="large" color={theme.primary} />
                </View>
            </>
        );
    }

    return (
        <>
            <StatusBar backgroundColor={theme.background} barStyle={isDarkMode ? "light-content" : "dark-content"} />
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
                    transitionSpec: {
                        open: { animation: 'timing', config: { duration: 300 } },
                        close: { animation: 'timing', config: { duration: 300 } },
                    }
                }}
                initialRouteName={initialRoute}
            >
                <Stack.Screen name="Welcome" component={Welcome} />
                <Stack.Screen name="Setup" component={Setup} />
                <Stack.Screen name="Auth" component={Auth} />
                <Stack.Screen name="Signup" component={Signup} />
                <Stack.Screen name="Verification" component={Verification} />
                <Stack.Screen name="Main" component={BottomTabNavigator} />
                <Stack.Screen name="PINEntry" component={PinEntryScreen} />
                <Stack.Screen
                    name="EditProfile"
                    component={EditProfile}
                    options={{
                        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                    }}
                />
                <Stack.Screen name="AccessCode" component={AccessCodeScreen} options={{
                    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                }} />
            </Stack.Navigator>
        </>
    );
}

export default AppStack;
