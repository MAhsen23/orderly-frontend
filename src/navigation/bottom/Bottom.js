import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LayoutDashboard, Calendar, Activity, User } from 'lucide-react-native';
import { borderRadius } from '../../constants';
import useTheme from '../../hooks/useTheme';
import HomeScreen from '../../pages/Home';
import CalendarScreen from '../../pages/Calendar';
import InsightsScreen from '../../pages/Insights';
import ProfileScreen from '../../pages/Profile';

const Tab = createBottomTabNavigator();
const CustomTabBar = ({ state, descriptors, navigation }) => {
    const { theme } = useTheme();

    return (
        <View style={[styles.tabBarContainer, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };
                const IconComponent = options.tabBarIcon;
                return (
                    <TouchableOpacity
                        key={index}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        style={styles.tabItem}
                    >
                        <View style={styles.iconContainer}>
                            <IconComponent color={isFocused ? theme.primary : theme.mutedForeground} size={24} />
                        </View>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

function BottomTabNavigator() {
    const { theme } = useTheme();

    return (
        <Tab.Navigator
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color }) => <LayoutDashboard color={color} size={24} />,
                }}
            />
            <Tab.Screen
                name="Calendar"
                component={CalendarScreen}
                options={{
                    tabBarIcon: ({ color }) => <Calendar color={color} size={24} />,
                }}
            />
            <Tab.Screen
                name="Insights"
                component={InsightsScreen}
                options={{
                    tabBarIcon: ({ color }) => <Activity color={color} size={24} />,
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ color }) => <User color={color} size={24} />,
                }}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    tabBarContainer: {
        flexDirection: 'row',
        borderTopWidth: 1,
        height: 60,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        padding: 8,
        borderRadius: borderRadius.full,
    },
});

export default BottomTabNavigator;
