import React, { memo } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import useTheme from '../../hooks/useTheme';
import { borderRadius, fontSizes } from '../../constants';

const Day = memo(({ day, type }) => {
    const { theme } = useTheme();
    const isCurrentMonth = day.isCurrentMonth;

    const getBackgroundColor = () => {
        switch (type) {
            case 'period': return theme.primaryLight;
            case 'ovulation': return theme.accentLight;
            case 'fertile': return theme.secondaryLight;
            default: return theme.muted;
        }
    };

    const getTextColor = () => {
        return theme.foreground;
    }

    return (
        <TouchableOpacity
            style={[
                styles.dayContainer,
                { backgroundColor: getBackgroundColor(), borderRadius: borderRadius.default },
                !isCurrentMonth && styles.inactiveDay,
            ]}
            disabled={!isCurrentMonth}
        >
            <Text allowFontScaling={false} style={[styles.dayText, { color: getTextColor() },]}>{day.date.date()}</Text>
        </TouchableOpacity>
    );
});

export default Day;

const styles = StyleSheet.create({
    dayContainer: {
        flex: 1,
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 4,
        marginVertical: 12,
    },
    dayText: {
        fontSize: fontSizes.base,
        fontWeight: '600'
    },
    inactiveDay: {
        opacity: 0.2,
    },
});
