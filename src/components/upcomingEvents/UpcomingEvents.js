import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { Calendar, Heart } from 'lucide-react-native';
import { borderRadius, fonts, fontSizes } from '../../constants';
import useTheme from '../../hooks/useTheme';

const UpcomingEvents = ({ nextPeriod, fertileWindow }) => {
    const { theme, isDarkMode } = useTheme();

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getDaysUntil = (date) => {
        const today = new Date();
        const diffTime = date.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    return (
        <View style={[styles.upcomingEvents, { backgroundColor: theme.muted }]}>
            <Text allowFontScaling={false} style={[styles.sectionTitle, { color: theme.foreground }]}>Upcoming</Text>
            {nextPeriod && fertileWindow ? (
                <>
                    <View style={styles.eventItem}>
                        <Calendar color={theme.primary} size={24} />
                        <View style={styles.eventTextContainer}>
                            <Text allowFontScaling={false} style={[styles.eventText, { color: theme.foreground }]}>
                                Period in {getDaysUntil(nextPeriod)} days
                            </Text>
                            <Text allowFontScaling={false} style={[styles.eventDate, { color: theme.mutedForeground }]}>
                                {formatDate(nextPeriod)}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.eventItem}>
                        <Heart color={!isDarkMode ? theme.secondary : theme.secondaryLight} size={24} />
                        <View style={styles.eventTextContainer}>
                            <Text allowFontScaling={false} style={[styles.eventText, { color: theme.foreground }]}>
                                Fertile window starts in {getDaysUntil(fertileWindow)} days
                            </Text>
                            <Text allowFontScaling={false} style={[styles.eventDate, { color: theme.mutedForeground }]}>
                                {formatDate(fertileWindow)}
                            </Text>
                        </View>
                    </View>
                </>
            ) : (
                <>
                    <View style={styles.eventItem}>
                        <Calendar color={theme.primary} size={24} />
                        <View style={styles.eventTextContainer}>
                            <Text allowFontScaling={false} style={[styles.eventText, { color: theme.foreground }]}>
                                Period in ... days
                            </Text>
                            <Text allowFontScaling={false} style={[styles.eventDate, { color: theme.mutedForeground }]}>
                                ...
                            </Text>
                        </View>
                    </View>
                    <View style={styles.eventItem}>
                        <Heart color={!isDarkMode ? theme.secondary : theme.secondaryLight} size={24} />
                        <View style={styles.eventTextContainer}>
                            <Text allowFontScaling={false} style={[styles.eventText, { color: theme.foreground }]}>
                                Fertile window starts in ... days
                            </Text>
                            <Text allowFontScaling={false} style={[styles.eventDate, { color: theme.mutedForeground }]}>
                                ...
                            </Text>
                        </View>
                    </View>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    upcomingEvents: {
        padding: 20,
        borderRadius: borderRadius.lg,
    },
    sectionTitle: {
        fontSize: fontSizes.xl,
        fontFamily: fonts.semibold,
        marginBottom: 15,
    },
    eventItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    eventTextContainer: {
        marginLeft: 15,
    },
    eventText: {
        fontSize: fontSizes.base,
        fontFamily: fonts.semibold,
    },
    eventDate: {
        fontSize: fontSizes.sm,
        fontFamily: fonts.normal,
    },
});

export default UpcomingEvents;