import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, } from 'react-native';
import { fonts, fontSizes, borderRadius } from '../constants';
import useTheme from '../hooks/useTheme';
import { Calendar, Activity, Shield } from 'react-native-feather';
import StorageService from '../services/StorageService';

const Welcome = ({ navigation }) => {
    const { theme } = useTheme();
    const [currentPage, setCurrentPage] = useState(0);
    const [isUserExist, setIsUserExist] = useState(false);
    useEffect(() => {
        checkUserExistence();
    }, [])

    const checkUserExistence = async () => {
        const isUserExist = await StorageService.getValue('user');
        if (isUserExist) {
            setIsUserExist(true);
        }
    }

    const onboardingData = [
        {
            title: "Track Your Cycle",
            description: "Easily log your cycle & symptoms to understand your body's unique patterns.",
            icon: (props) => <Calendar {...props} />,
        },
        {
            title: "Personalized Insights",
            description: "Get tailored health recommendations based on your individual cycle data.",
            icon: (props) => <Activity {...props} />,
        },
        {
            title: "Secure and Private",
            description: "Your data is encrypted and protected. We prioritize your privacy and security.",
            icon: (props) => <Shield {...props} />,
        },
    ];

    const handleNext = async () => {
        if (currentPage < onboardingData.length - 1) {
            setCurrentPage(currentPage + 1);
        } else {
            if (isUserExist) {
                navigation.goBack();
            } else {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Auth' }],
                });
            }
        }
    };

    const handleDotPress = (index) => {
        setCurrentPage(index);
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <View style={styles.content}>
                    <View style={styles.iconContainer}>
                        {onboardingData[currentPage].icon({ width: 120, height: 120, color: theme.primary })}
                    </View>
                    <Text allowFontScaling={false} style={[styles.title, { color: theme.foreground }]}>
                        {onboardingData[currentPage].title}
                    </Text>
                    <Text allowFontScaling={false} style={[styles.description, { color: theme.mutedForeground }]}>
                        {onboardingData[currentPage].description}
                    </Text>
                    <View style={styles.paginationContainer}>
                        {onboardingData.map((_, index) => (
                            <TouchableOpacity
                                hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                                key={index}
                                onPress={() => handleDotPress(index)}>
                                <View
                                    style={[
                                        styles.paginationDot,
                                        { backgroundColor: index === currentPage ? theme.primary : theme.border }
                                    ]}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: theme.primary }]}
                        onPress={handleNext}
                    >
                        <Text allowFontScaling={false} style={[styles.buttonText, { color: theme.primaryForeground }]}>
                            {currentPage === onboardingData.length - 1 ? isUserExist ? 'Finish' : "Get Started" : "Next"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Welcome;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    iconContainer: {
        marginBottom: 40,
    },
    title: {
        fontSize: fontSizes['3xl'],
        fontFamily: fonts.bold,
        textAlign: 'center',
        marginBottom: 20,
    },
    description: {
        fontSize: fontSizes.lg,
        fontFamily: fonts.normal,
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 24,
        paddingHorizontal: 10,
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    paginationDot: {
        width: 10,
        height: 10,
        borderRadius: borderRadius.full,
        marginHorizontal: 8,
    },
    buttonContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        borderRadius: borderRadius.lg,
    },
    buttonText: {
        fontSize: fontSizes.base,
        fontFamily: fonts.semibold,
    },
});
