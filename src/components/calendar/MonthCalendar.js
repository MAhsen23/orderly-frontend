import React, { useMemo, useCallback } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import Day from './Day';
import { fontSizes, fonts, } from '../../constants';
import useTheme from '../../hooks/useTheme';

const MonthCalendar = ({ month, cycleData, selectedFilter }) => {
    const { theme } = useTheme();
    const daysInMonth = useMemo(() => {
        const startOfMonth = month.clone().startOf('month');
        const endOfMonth = month.clone().endOf('month');
        const days = [];
        for (let i = startOfMonth.day(); i > 0; i--) {
            days.push({ date: startOfMonth.clone().subtract(i, 'days'), isCurrentMonth: false });
        }
        for (let i = 1; i <= endOfMonth.date(); i++) {
            days.push({ date: month.clone().date(i), isCurrentMonth: true });
        }
        const remainingDays = 7 - (days.length % 7);
        for (let i = 1; i <= remainingDays; i++) {
            days.push({ date: endOfMonth.clone().add(i, 'days'), isCurrentMonth: false });
        }
        return days;
    }, [month]);

    const getType = (day) => {
        const matchedDay = cycleData.find(item => item.date.isSame(day, 'day'));
        if (matchedDay) {
            if (selectedFilter === "fertile" && matchedDay.type === "ovulation") {
                return 'fertile';
            } else {
                return matchedDay.type;
            }
        }
        else {
            return 'nothing'
        }
    };

    const renderDay = useCallback(
        ({ item }) => {
            const type = item.isCurrentMonth ? getType(item.date) : [];
            return <Day day={item} type={type} />;
        },
        [cycleData]
    );

    return (
        <View style={styles.calendarContainer}>
            <View style={[styles.weekDaysContainer, { borderBottomColor: theme.border }]}>
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                    <Text allowFontScaling={false} key={`weekday-${index}`} style={[styles.weekDayText, { color: theme.foreground }]}>{day}</Text>
                ))}
            </View>
            <FlatList
                data={daysInMonth}
                renderItem={renderDay}
                keyExtractor={(item) => item.date.format('YYYY-MM-DD')}
                numColumns={7}
                scrollEnabled={false}
            />
        </View>
    );
};

export default MonthCalendar;

const styles = StyleSheet.create({
    calendarContainer: {
        paddingHorizontal: 20,
    },
    weekDaysContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
    },
    weekDayText: {
        fontSize: fontSizes.base,
        fontFamily: fonts.medium,
    },
});
