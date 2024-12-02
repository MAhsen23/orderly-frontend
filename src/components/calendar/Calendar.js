import React from 'react';
import { Calendar as RNCalendar } from 'react-native-calendars';
import { fontSizes, borderRadius, fonts } from '../../constants';

const CalendarComponent = React.memo(({ theme, current, onDayPress, markedDates, ...props }) => {
    return (
        <RNCalendar
            current={current}
            onDayPress={onDayPress}
            markedDates={markedDates}
            hideArrows={true}
            showWeekNumbers={false}
            disableMonthChange={true}
            disableArrowLeft={true}
            disableArrowRight={true}
            disableAllTouchEventsForDisabledDays={true}
            renderHeader={() => null}
            theme={{
                backgroundColor: 'transparent',
                calendarBackground: 'transparent',
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
            style={[{
                borderColor: theme.input, borderWidth: 1,
                borderRadius: borderRadius.lg,
                overflow: 'hidden',
            }]}
            hideExtraDays={true}
            {...props}
        />
    );
});

export default CalendarComponent;