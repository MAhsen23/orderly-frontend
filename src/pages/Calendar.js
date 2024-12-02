import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, SafeAreaView } from 'react-native';
import moment from 'moment';
import { borderRadius, fontSizes, fonts } from '../constants';
import useTheme from '../hooks/useTheme';
import MonthCalendar from '../components/calendar/MonthCalendar';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import SQLiteService from '../services/SQLiteService';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';

const CalendarScreen = () => {
    const { theme, isDarkMode } = useTheme();
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [currentMonth, setCurrentMonth] = useState(moment());
    const [userConfig, setUserConfig] = useState(null);
    const [slideAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        const fetchUserConfig = async () => {
            try {
                const config = await SQLiteService.getUserConfig();
                setUserConfig(config);
            } catch (error) {
                console.error('Error fetching user config:', error);
            }
        };
        fetchUserConfig();
    }, []);

    const calculateCycleData = useCallback((month) => {
        if (!userConfig) return [];

        const data = [];
        const startDate = month.clone().startOf('month');
        const endDate = month.clone().endOf('month');
        const lastPeriodStart = moment(userConfig.lastPeriodStartDate);
        const averageCycleLength = userConfig.averageCycleLength;
        const averagePeriodDuration = userConfig.averagePeriodDuration;

        let cycleStartDate = lastPeriodStart.clone();
        const daysSinceLastPeriod = moment().diff(lastPeriodStart, 'days');
        const completedCycles = Math.floor(daysSinceLastPeriod / averageCycleLength);

        cycleStartDate.add(completedCycles * averageCycleLength, 'days')
        if (cycleStartDate.isAfter(startDate)) {
            cycleStartDate.subtract(averageCycleLength, 'days');
        }

        while (cycleStartDate.isBefore(endDate)) {
            const periodEndDate = cycleStartDate.clone().add(averagePeriodDuration - 1, 'days');
            const follicularEndDate = cycleStartDate.clone().add(Math.round(averageCycleLength * 0.45) - 1, 'days');
            const ovulatoryEndDate = cycleStartDate.clone().add(Math.round(averageCycleLength * 0.55) - 1, 'days');

            const ovulationDay = cycleStartDate.clone().add(Math.round(averageCycleLength / 2), 'days');
            const fertileStartDate = ovulationDay.clone().subtract(5, 'days');
            const fertileEndDate = ovulationDay.clone().add(1, 'days');

            let currentDate = cycleStartDate.clone();
            while (currentDate.isSameOrBefore(periodEndDate)) {
                if (currentDate.isSameOrAfter(startDate) && currentDate.isSameOrBefore(endDate)) {
                    data.push({
                        date: currentDate.clone(),
                        type: 'period',
                        phase: 'Menstrual Phase'
                    });
                }
                currentDate.add(1, 'days');
            }

            currentDate = fertileStartDate.clone();
            while (currentDate.isSameOrBefore(fertileEndDate)) {
                if (currentDate.isSameOrAfter(startDate) && currentDate.isSameOrBefore(endDate)) {
                    data.push({
                        date: currentDate.clone(),
                        type: currentDate.isSame(ovulationDay, 'day') ? 'ovulation' : 'fertile',
                        phase: 'Ovulatory Phase'
                    });
                }
                currentDate.add(1, 'days');
            }

            currentDate = cycleStartDate.clone();
            while (currentDate.isBefore(cycleStartDate.clone().add(averageCycleLength, 'days'))) {
                if (currentDate.isSameOrAfter(startDate) && currentDate.isSameOrBefore(endDate)) {
                    const existingEntry = data.find(entry => entry.date.isSame(currentDate, 'day'));
                    if (!existingEntry) {
                        let phase;
                        if (currentDate.isSameOrBefore(follicularEndDate)) {
                            phase = 'Follicular Phase';
                        } else if (currentDate.isSameOrBefore(ovulatoryEndDate)) {
                            phase = 'Ovulatory Phase';
                        } else {
                            phase = 'Luteal Phase';
                        }

                        data.push({
                            date: currentDate.clone(),
                            type: 'phase',
                            phase
                        });
                    }
                }
                currentDate.add(1, 'days');
            }

            cycleStartDate.add(averageCycleLength, 'days');
        }
        return data;
    }, [userConfig]);

    const cycleData = useMemo(() => calculateCycleData(currentMonth), [currentMonth, calculateCycleData]);
    const filteredCycleData = useMemo(() => {
        if (selectedFilter === 'fertile') {
            return cycleData.filter(item => item.type === 'fertile' || item.type === 'ovulation');
        }
        return cycleData.filter(item => selectedFilter === 'all' || item.type === selectedFilter);
    }, [cycleData, selectedFilter]);

    const getFilterColor = useCallback((type) => {
        switch (type) {
            case 'period': return theme.primary;
            case 'fertile': return isDarkMode ? theme.secondaryLight : theme.secondary;
            case 'ovulation': return isDarkMode ? theme.accentLight : theme.accent;
            default: return theme.muted;
        }
    }, [theme, isDarkMode]);

    const FilterButton = useCallback(({ type, label }) => (
        <TouchableOpacity
            style={[
                styles.filterButton,
                {
                    backgroundColor: theme.background,
                    borderColor: selectedFilter === type ? theme.primary : theme.border
                }
            ]}
            onPress={() => setSelectedFilter(type)}
        >
            <View style={styles.filterButtonContent}>
                {type !== 'all' && <View style={[styles.filterDot, { backgroundColor: getFilterColor(type) }]} />}
                <Text allowFontScaling={false} style={[styles.filterButtonText, { color: theme.foreground }]}>{label}</Text>
            </View>
        </TouchableOpacity>
    ), [selectedFilter, theme, getFilterColor]);

    const filterButtons = useMemo(() => (
        <View style={styles.filterContainer}>
            {['all', 'period', 'fertile', 'ovulation'].map(type => (
                <FilterButton key={type} type={type} label={type.charAt(0).toUpperCase() + type.slice(1)} />
            ))}
        </View>
    ), [FilterButton]);

    const changeMonth = (direction) => {
        const newMonth = direction === 'left' ? currentMonth.clone().add(1, 'month') : currentMonth.clone().subtract(1, 'month');
        setCurrentMonth(newMonth);
        Animated.timing(slideAnim, {
            toValue: direction === 'left' ? -400 : 400,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            slideAnim.setValue(0);
        });
    };

    const onSwipe = (event) => {
        if (event.nativeEvent.state === State.END) {
            const { translationX } = event.nativeEvent;
            if (translationX > 50) {
                changeMonth('right');
            } else if (translationX < -50) {
                changeMonth('left');
            }
        }
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <View style={[styles.header, { borderColor: theme.muted }]}>
                    <Text allowFontScaling={false} style={[styles.headerTitle, { color: theme.foreground }]}>Calendar</Text>
                </View>
                <View style={styles.content}>
                    {filterButtons}
                    <View style={styles.monthTitleContainer}>
                        <TouchableOpacity onPress={() => changeMonth('right')}>
                            <ChevronLeft size={20} color={theme.foreground} />
                        </TouchableOpacity>
                        <Text allowFontScaling={false} style={[styles.monthTitle, { color: theme.foreground }]}>
                            {currentMonth.format('MMMM YYYY')}
                        </Text>
                        <TouchableOpacity onPress={() => changeMonth('left')}>
                            <ChevronRight size={20} color={theme.foreground} />
                        </TouchableOpacity>
                    </View>
                    <GestureHandlerRootView style={{ flex: 1 }}>
                        <PanGestureHandler onHandlerStateChange={onSwipe}>
                            <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
                                <MonthCalendar month={currentMonth} cycleData={filteredCycleData} selectedFilter={selectedFilter} />
                            </Animated.View>
                        </PanGestureHandler>
                    </GestureHandlerRootView>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: { flex: 1 },
    content: { paddingVertical: 20, flex: 1 },
    header: { paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, },
    headerTitle: { fontSize: fontSizes['2xl'], fontFamily: fonts.bold },
    filterContainer: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 15, marginBottom: 30, },
    filterButton: { height: 30, paddingHorizontal: 14, justifyContent: 'center', alignItems: 'center', borderRadius: borderRadius.full, borderWidth: 1 },
    filterButtonContent: { flexDirection: 'row', alignItems: 'center' },
    filterDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
    filterButtonText: { fontSize: fontSizes.sm, fontFamily: fonts.medium, marginTop: 2 },
    monthTitleContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 30, marginBottom: 20 },
    monthTitle: { fontSize: fontSizes.lg, fontFamily: fonts.semibold, paddingTop: 2 },
});

export default React.memo(CalendarScreen);