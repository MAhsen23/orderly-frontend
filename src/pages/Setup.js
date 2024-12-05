import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Animated, ActivityIndicator, SafeAreaView } from 'react-native';
import { fonts, fontSizes, borderRadius } from '../constants';
import useTheme from '../hooks/useTheme';
import { Calendar } from 'react-native-calendars';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import ApiService from '../services/ApiService';
import StorageService from '../services/StorageService';
import SQLiteService from '../services/SQLiteService';
import SettingHeader from '../components/header/SettingHeader';
import { setNotes } from '../redux/features/notesSlice';
import { setUser } from '../redux/features/userSlice';
import { useAlert } from '../contexts/AlertContext';
import { useDispatch } from 'react-redux';

const Setup = () => {
    const { theme } = useTheme();
    const { showAlert } = useAlert();
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedCycleType, setSelectedCycleType] = useState(null);
    const [selectedCycleLength, setSelectedCycleLength] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedPeriodLength, setSelectedPeriodLength] = useState(null);
    const [years, setYears] = useState([]);
    const [cycleLengths, setCycleLengths] = useState([]);
    const [periodLengths, setPeriodLengths] = useState([]);
    const [progressAnimation] = useState(new Animated.Value(0));
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const currentYear = new Date().getFullYear();
        const yearList = Array.from({ length: 40 }, (_, i) => currentYear - i - 13);
        setYears(yearList);
        const lengthList = Array.from({ length: 30 }, (_, i) => i + 21);
        setCycleLengths(lengthList);
        const periodLengthList = Array.from({ length: 10 }, (_, i) => i + 1);
        setPeriodLengths(periodLengthList);
    }, []);

    useEffect(() => {
        Animated.timing(progressAnimation, {
            toValue: (currentStep) / setupSteps.length,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [currentStep]);

    const setupSteps = [
        {
            title: "Birth Year",
            description: "We use this to customize your app experience.",
        },
        {
            title: "Cycle Type",
            description: "A cycle with a deviation within 7 days is considered regular.",
        },
        {
            title: "Average Cycle Length",
            description: "Don't worry if you're not sure, you can always update this later.",
        },
        {
            title: "Last Period Start Date",
            description: "This helps us calculate your next period and fertile window.",
        },
        {
            title: "Average Period Length",
            description: "This information helps us tailor the app to your needs.",
        },
    ];

    const cycleTypes = ["Regular", "Irregular", "Don't know"];

    const handleNext = async () => {
        if (currentStep < setupSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            setIsLoading(true);
            try {
                const response = await ApiService.profileSetup({ birthYear: selectedYear, cycleType: selectedCycleType, averageCycleLength: selectedCycleLength, lastPeriodStartDate: selectedDate, averagePeriodDuration: selectedPeriodLength });
                if (response.success) {
                    const { user, menstrualCycles, notes } = response;
                    await SQLiteService.setUser(user);

                    const cycles = menstrualCycles.map(cycle => ({
                        startDate: cycle.startDate, endDate: cycle.endDate || null, duration: cycle.duration
                    }));
                    await SQLiteService.setMenstrualCycles(cycles);

                    const lastPeriodStartDate = cycles.length ? cycles[cycles.length - 1].startDate : null;
                    dispatch(setUser({ user: { ...user, lastPeriodStartDate }, token: await StorageService.getValue('token') }));
                    const formattedNotes = notes.filter(note => note.trim() !== '');
                    dispatch(setNotes(formattedNotes));
                    await SQLiteService.setNotes(formattedNotes);
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Main' }],
                    });
                }
            } catch (error) {
                showAlert({
                    type: 'error',
                    title: 'Error',
                    message: error.response?.data?.message || 'An error cccurred during profile setup',
                });
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSkip = () => {
    };

    const renderYearItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.yearItem, { borderColor: theme.border, backgroundColor: selectedYear === item ? theme.muted : 'transparent' }]} onPress={() => setSelectedYear(item)} >
            <Text allowFontScaling={false} style={[styles.yearText, { color: theme.foreground }]}>{item}</Text>
        </TouchableOpacity>
    );

    const renderCycleTypeItem = (item) => (
        <TouchableOpacity
            key={item}
            style={[styles.cycleTypeItem, { borderColor: theme.border, backgroundColor: selectedCycleType === item ? theme.muted : 'transparent' }]}
            onPress={() => setSelectedCycleType(item)}
        >
            <Text allowFontScaling={false} style={[styles.cycleTypeText, { color: theme.foreground }]}>{item}</Text>
        </TouchableOpacity>
    );

    const renderCycleLengthItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.cycleLengthItem, { borderColor: theme.border, backgroundColor: selectedCycleLength === item ? theme.muted : 'transparent' }]}
            onPress={() => setSelectedCycleLength(item)}
        >
            <Text allowFontScaling={false} style={[styles.cycleLengthText, { color: theme.foreground }]}>{item} days</Text>
        </TouchableOpacity>
    );

    const renderPeriodLengthItem = ({ item }) => (
        <TouchableOpacity style={[styles.periodLengthItem, { borderColor: theme.border, backgroundColor: selectedPeriodLength === item ? theme.muted : 'transparent' }]} onPress={() => setSelectedPeriodLength(item)} >
            <Text allowFontScaling={false} style={[styles.periodLengthText, { color: theme.foreground }]}>{item === 1 ? `${item} day` : `${item} days`}</Text>
        </TouchableOpacity>
    );

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <FlatList
                        data={years}
                        renderItem={renderYearItem}
                        keyExtractor={(item) => item.toString()}
                        style={styles.yearList}
                        showsVerticalScrollIndicator={false}
                    />
                );
            case 1:
                return (
                    <View style={styles.cycleTypeContainer}>
                        {cycleTypes.map(renderCycleTypeItem)}
                    </View>
                );
            case 2:
                return (
                    <FlatList
                        data={cycleLengths}
                        renderItem={renderCycleLengthItem}
                        keyExtractor={(item) => item.toString()}
                        style={styles.cycleLengthList}
                        showsVerticalScrollIndicator={false}
                    />
                );
            case 3:
                return (
                    <Calendar
                        onDayPress={(day) => setSelectedDate(day.dateString)}
                        markedDates={{
                            [selectedDate]: { selected: true, selectedColor: theme.primary }
                        }}
                        theme={{
                            backgroundColor: theme.background,
                            calendarBackground: theme.background,
                            textSectionTitleColor: theme.mutedForeground,
                            selectedDayBackgroundColor: theme.primary,
                            selectedDayTextColor: theme.primaryForeground,
                            todayTextColor: theme.primary,
                            dayTextColor: theme.foreground,
                            textDisabledColor: theme.mutedForeground,
                            dotColor: theme.primary,
                            selectedDotColor: theme.primaryForeground,
                            monthTextColor: theme.foreground,
                            textMonthFontFamily: fonts.medium,
                            textDayHeaderFontFamily: fonts.normal,
                            textDayFontSize: fontSizes.base,
                            textMonthFontSize: fontSizes.base,
                            textDayHeaderFontSize: fontSizes.base,
                            'stylesheet.day.basic': {
                                base: {
                                    width: 30,
                                    height: 30,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                },
                                selected: {
                                    borderRadius: borderRadius.full,
                                }
                            }
                        }}
                        renderArrow={(direction) => (
                            direction === 'left'
                                ? <ChevronLeft color={theme.primary} size={20} />
                                : <ChevronRight color={theme.primary} size={20} />
                        )}
                        style={[styles.calendar, { borderColor: theme.border }]}
                        hideExtraDays={true}
                        maxDate={new Date().toISOString().split('T')[0]}
                    />
                );
            case 4:
                return (
                    <FlatList
                        data={periodLengths}
                        renderItem={renderPeriodLengthItem}
                        keyExtractor={(item) => item.toString()}
                        style={styles.periodLengthList}
                        showsVerticalScrollIndicator={false}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <SettingHeader title={"Account Setup"} onBackPress={handleBack} onSkipPress={handleSkip} />
                <View style={styles.content}>
                    <View style={[styles.progressBarContainer, { backgroundColor: theme.border }]}>
                        <Animated.View
                            style={[
                                styles.progressBar,
                                {
                                    backgroundColor: theme.primary,
                                    width: progressAnimation.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ['0%', '100%']
                                    })
                                }
                            ]}
                        />
                    </View>
                    <View style={styles.dataContainer}>
                        <Text allowFontScaling={false} style={[styles.title, { color: theme.foreground }]}>
                            {setupSteps[currentStep].title}
                        </Text>
                        <Text allowFontScaling={false} style={[styles.description, { color: theme.mutedForeground }]}>
                            {setupSteps[currentStep].description}
                        </Text>
                        {renderStepContent()}
                    </View>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: theme.primary }]}
                        onPress={handleNext}
                        disabled={(currentStep === 0 && !selectedYear) || (currentStep === 1 && !selectedCycleType) || (currentStep === 2 && !selectedCycleLength) || (currentStep === 3 && !selectedDate) || (currentStep === 4 && !selectedPeriodLength) || isLoading}
                    >
                        {isLoading && currentStep === setupSteps.length - 1 ? (
                            <ActivityIndicator color={theme.primaryForeground} />
                        ) : (
                            <Text allowFontScaling={false} style={[styles.buttonText, { color: theme.primaryForeground }]}>
                                {currentStep === setupSteps.length - 1 ? "Finish" : "Next"}
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Setup;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    progressBarContainer: {
        height: 1,
        marginBottom: 30,
    },
    progressBar: {
        height: '100%',
    },
    title: {
        fontSize: fontSizes['2xl'],
        fontFamily: fonts.bold,
        textAlign: 'center',
        marginBottom: 10,
    },
    description: {
        fontSize: fontSizes.base,
        fontFamily: fonts.normal,
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 24,
    },
    dataContainer: {
        flex: 1,
        marginBottom: 30,
        paddingHorizontal: 20,
    },
    buttonContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 45,
        borderRadius: borderRadius.lg,
    },
    buttonText: {
        fontSize: fontSizes.base,
        fontFamily: fonts.semibold,
    },
    yearList: {
        flex: 1,
    },
    yearItem: {
        padding: 12,
        borderRadius: borderRadius.md,
        marginBottom: 10,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    yearText: {
        fontSize: fontSizes.lg,
        fontFamily: fonts.medium,
    },
    cycleTypeContainer: {
        flex: 1,
    },
    cycleTypeItem: {
        padding: 12,
        borderRadius: borderRadius.md,
        marginBottom: 10,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cycleTypeText: {
        fontSize: fontSizes.lg,
        fontFamily: fonts.medium,
    },
    cycleLengthList: {
        flex: 1,
    },
    cycleLengthItem: {
        padding: 12,
        borderRadius: borderRadius.md,
        marginBottom: 10,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cycleLengthText: {
        fontSize: fontSizes.lg,
        fontFamily: fonts.medium,
    },
    calendar: {
        borderWidth: 1,
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
    },
    periodLengthList: {
        flex: 1,
    },
    periodLengthItem: {
        padding: 12,
        borderRadius: borderRadius.md,
        marginBottom: 10,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    periodLengthText: {
        fontSize: fontSizes.lg,
        fontFamily: fonts.medium,
    },
});
