import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Bell, Droplet, ChevronRight, PenSquare } from 'lucide-react-native';
import { fonts, fontSizes, borderRadius } from '../constants';
import useTheme from '../hooks/useTheme';
import UpcomingEvents from '../components/upcomingEvents/UpcomingEvents';
import NotesModal from '../modals/noteModal/NotesModal';
import { useSelector } from 'react-redux';

const Home = () => {
    const { theme } = useTheme();
    const user = useSelector(state => state.user.user);
    const [cycleInfo, setCycleInfo] = useState({
        cycleDay: 0,
        daysUntilNextPeriod: 0,
        currentPhase: '',
        nextPeriod: null,
        fertileWindowStart: null,
        fertileWindowEnd: null,
    });
    const { tip } = useSelector(state => state.dailyTip);
    const [isNoteModalVisible, setIsNoteModalVisible] = useState(false);

    useEffect(() => {
        if (user) {
            calculateCycleInfo({
                lastPeriodStartDate: user.lastPeriodStartDate,
                averageCycleLength: user.averageCycleLength,
                averagePeriodDuration: user.averagePeriodDuration
            });
        }
    }, [user]);

    const calculateCycleInfo = (config) => {
        const today = new Date();
        const lastPeriodStart = new Date(config.lastPeriodStartDate);
        const daysSinceLastPeriod = Math.floor((today - lastPeriodStart) / (1000 * 60 * 60 * 24));

        const averageCycleLength = config.averageCycleLength;
        const averagePeriodDuration = config.averagePeriodDuration;

        const currentCycleDay = (daysSinceLastPeriod % averageCycleLength) + 1;
        const daysUntilNextPeriod = averageCycleLength - currentCycleDay + 1;

        const nextPeriodDate = new Date(lastPeriodStart);
        nextPeriodDate.setDate(nextPeriodDate.getDate() + Math.ceil(daysSinceLastPeriod / averageCycleLength) * averageCycleLength);

        const ovulationDay = Math.round(averageCycleLength / 2);
        let fertileWindowStart = new Date(lastPeriodStart);
        fertileWindowStart.setDate(fertileWindowStart.getDate() + ovulationDay - 5);
        if (fertileWindowStart < today) {
            fertileWindowStart = new Date(nextPeriodDate);
            fertileWindowStart.setDate(fertileWindowStart.getDate() + ovulationDay - 5);
        }
        const fertileWindowEnd = new Date(fertileWindowStart);
        fertileWindowEnd.setDate(fertileWindowEnd.getDate() + 6);

        const currentPhase = calculatePhase(currentCycleDay, averageCycleLength, averagePeriodDuration);

        setCycleInfo({
            cycleDay: currentCycleDay,
            daysUntilNextPeriod,
            currentPhase,
            nextPeriod: nextPeriodDate,
            fertileWindowStart,
            fertileWindowEnd,
        });
    };

    const calculatePhase = (cycleDay, cycleLength, periodDuration) => {
        if (cycleDay <= periodDuration) return 'Menstrual Phase';
        if (cycleDay <= Math.round(cycleLength * 0.45)) return 'Follicular Phase';
        if (cycleDay <= Math.round(cycleLength * 0.55)) return 'Ovulatory Phase';
        return 'Luteal Phase';
    };

    const handleAddNote = () => {
        setIsNoteModalVisible(true);
    };

    const handleCloseNoteModal = () => {
        setIsNoteModalVisible(false);
    };

    const handleSaveNotes = async (updatedNotes) => {

    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <View>
                    <Text allowFontScaling={false} style={[styles.greeting, { color: theme.foreground }]}>
                        Hello, {user ? user.name : 'User'}
                    </Text>
                    <Text allowFontScaling={false} style={[styles.subGreeting, { color: theme.mutedForeground }]}>Welcome back</Text>
                </View>
                <View style={styles.headerButtons}>
                    <TouchableOpacity style={[styles.iconButton, { backgroundColor: theme.muted }]} onPress={handleAddNote}>
                        <PenSquare color={theme.mutedForeground} size={24} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.iconButton, { backgroundColor: theme.muted, marginLeft: 10 }]}>
                        <Bell color={theme.mutedForeground} size={24} />
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.cycleOverview}>
                    <View style={[styles.cycleCard, { backgroundColor: theme.primary }]}>
                        <View style={styles.cycleHeader}>
                            <Text allowFontScaling={false} style={[styles.cycleTitle, { color: theme.primaryForeground }]}>
                                Cycle Day {cycleInfo.cycleDay || '...'}
                            </Text>
                            <TouchableOpacity style={styles.cycleMoreButton}>
                                <Text allowFontScaling={false} style={[styles.cycleMoreText, { color: theme.primaryForeground }]}>Details</Text>
                                <ChevronRight style={{ marginBottom: 1 }} color={theme.primaryForeground} size={16} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.cycleContent}>
                            <View style={styles.cycleInfo}>
                                <Text allowFontScaling={false} style={[styles.cyclePhase, { color: theme.primaryForeground }]}>
                                    {cycleInfo.currentPhase || '...'}
                                </Text>
                                <Text allowFontScaling={false} style={[styles.cycleDaysLeft, { color: theme.secondaryForeground }]}>
                                    {cycleInfo.daysUntilNextPeriod || '...'} days until next period
                                </Text>
                            </View>
                            <View style={styles.cycleProgressContainer}>
                                <View style={[styles.cycleProgressCircle, { borderColor: theme.primaryForeground }]}>
                                    <Text allowFontScaling={false} style={[styles.cycleProgressText, { color: theme.primaryForeground }]}>
                                        {cycleInfo.cycleDay || '...'}/{user?.averageCycleLength || '--'}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={[styles.infoCard, { backgroundColor: theme.muted }]}>
                    <View style={styles.infoHeader}>
                        <Text allowFontScaling={false} style={[styles.infoTitle, { color: theme.foreground }]}>Today's Tip</Text>
                    </View>
                    <View style={styles.infoContent}>
                        <View style={[styles.infoIconContainer, { backgroundColor: theme.primary }]}>
                            <Droplet color={theme.background} size={24} />
                        </View>
                        <View style={styles.infoTextContainer}>
                            <Text allowFontScaling={false} style={[styles.infoText, { color: theme.foreground }]}>
                                {tip || '...'}
                            </Text>
                        </View>
                    </View>
                </View>
                <UpcomingEvents
                    nextPeriod={cycleInfo.nextPeriod}
                    fertileWindow={cycleInfo.fertileWindowStart}
                />
            </ScrollView>
            <NotesModal
                visible={isNoteModalVisible}
                onClose={handleCloseNoteModal}
                theme={theme}
            />
        </View>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 10,
    },
    headerButtons: {
        flexDirection: 'row',
    },
    greeting: {
        fontSize: fontSizes['2xl'],
        fontFamily: fonts.bold,
    },
    subGreeting: {
        fontSize: fontSizes.sm,
        fontFamily: fonts.normal,
    },
    iconButton: {
        padding: 12,
        borderRadius: borderRadius.full,
    },
    cycleOverview: {
        marginBottom: 20,
    },
    cycleCard: {
        borderRadius: borderRadius.lg,
        padding: 20,
    },
    cycleHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    cycleTitle: {
        fontSize: fontSizes.xl,
        fontFamily: fonts.semibold,
    },
    cycleMoreButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cycleMoreText: {
        fontSize: fontSizes.sm,
        fontFamily: fonts.medium,
        marginRight: 5,
    },
    cycleContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cycleInfo: {
        flex: 1,
    },
    cyclePhase: {
        fontSize: fontSizes.lg,
        fontFamily: fonts.medium,
        marginBottom: 5,
    },
    cycleDaysLeft: {
        fontSize: fontSizes.sm,
        fontFamily: fonts.normal,
    },
    cycleProgressContainer: {
        alignItems: 'center',
    },
    cycleProgressCircle: {
        width: 60,
        height: 60,
        borderRadius: borderRadius.full,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cycleProgressText: {
        fontSize: fontSizes.base,
        fontFamily: fonts.bold,
    },
    infoCard: {
        padding: 20,
        borderRadius: borderRadius.lg,
        marginBottom: 20,
    },
    infoHeader: {
        marginBottom: 15,
    },
    infoTitle: {
        fontSize: fontSizes.xl,
        fontFamily: fonts.semibold,
    },
    infoContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoIconContainer: {
        padding: 12,
        borderRadius: borderRadius.full,
        marginRight: 15,
    },
    infoTextContainer: {
        flex: 1,
    },
    infoText: {
        fontSize: fontSizes.base,
        fontFamily: fonts.normal,
        lineHeight: 24,
    },
});