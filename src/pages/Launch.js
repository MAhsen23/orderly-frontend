import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Easing,
    Image,
    Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const Launch = () => {
    const logoScale = useRef(new Animated.Value(0.8)).current;
    const logoOpacity = useRef(new Animated.Value(0)).current;
    const textOpacity = useRef(new Animated.Value(0)).current;
    const lineWidth = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(logoScale, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            }),
            Animated.timing(logoOpacity, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            }),
        ]).start(() => {
            Animated.parallel([
                Animated.timing(textOpacity, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                }),
                Animated.timing(lineWidth, {
                    toValue: width * 0.6,
                    duration: 800,
                    useNativeDriver: false,
                    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                }),
            ]).start();
        });
    }, []);

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.logoContainer,
                    {
                        opacity: logoOpacity,
                        transform: [{ scale: logoScale }],
                    },
                ]}
            >
                <Image
                    source={require('../assets/orderly.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </Animated.View>
            <Animated.View style={[styles.textContainer, { opacity: textOpacity }]}>
                <Text style={styles.appName}>Orderly</Text>
                <Animated.View style={[styles.line, { width: lineWidth }]} />
                <Text style={styles.tagline}>Stay Safe, Stay Organized</Text>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    logoContainer: {
        marginBottom: 30,
    },
    logo: {
        width: 120,
        height: 120,
    },
    textContainer: {
        alignItems: 'center',
    },
    appName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#3b5998',
        marginBottom: 10,
    },
    line: {
        height: 2,
        backgroundColor: '#3b5998',
        marginBottom: 10,
    },
    tagline: {
        fontSize: 18,
        color: '#666',
    },
});

export default Launch;