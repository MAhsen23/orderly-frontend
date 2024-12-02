import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { Calendar, Droplet, Heart, Moon, Download, TrendingUp, Activity, Zap } from 'lucide-react-native';
import { colors, fonts, fontSizes, borderRadius } from '../constants';
import useTheme from '../hooks/useTheme';
import { useAlert } from '../contexts/AlertContext';
import { useSelector } from 'react-redux';

const Insights = () => {
    const { theme, isDarkMode } = useTheme();
    const { showAlert } = useAlert();
    const user = useSelector(state => state.user.user);

    const showFeatureAlert = () => {
        showAlert({ type: 'info', title: 'Feature Not Available', message: 'This feature is coming soon!' })
    };

    const quickInsightItems = [
        { icon: Calendar, color: theme.primary, label: 'Average Cycle', value: `${user.averageCycleLength} days` },
        { icon: Droplet, color: isDarkMode ? theme.secondaryLight : theme.secondary, label: 'Average Flow', value: 'Moderate' },
        { icon: Heart, color: theme.mutedForeground, label: 'Fertile Window', value: '5 days' },
        { icon: Moon, color: isDarkMode ? theme.accentLight : theme.accent, label: 'Avg. Period Length', value: `${user.averagePeriodDuration} days` },
    ];

    const additionalFeatures = [
        { icon: TrendingUp, title: 'Trend Analysis', description: 'Analyze your cycle trends over time' },
        { icon: Activity, title: 'Symptom Tracker', description: 'Log and track your symptoms throughout your cycle' },
        { icon: Zap, title: 'Personalized Insights', description: 'Get AI-powered insights tailored to your cycle' },
    ];

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <View style={[styles.header, { borderColor: theme.muted }]}>
                    <Text allowFontScaling={false} style={[styles.headerTitle, { color: theme.foreground }]}>Health Insights</Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    <View style={styles.quickInsights}>
                        <Text allowFontScaling={false} style={[styles.sectionTitle, { color: theme.foreground }]}>Quick Insights</Text>
                        <View style={styles.insightsGrid}>
                            {quickInsightItems.map((item, index) => (
                                <View key={index} style={[styles.insightItem, { backgroundColor: theme.muted }]}>
                                    <View style={[styles.insightIconContainer, { backgroundColor: item.color }]}>
                                        <item.icon color={colors.light.background} size={24} />
                                    </View>
                                    <Text allowFontScaling={false} style={[styles.insightLabel, { color: theme.mutedForeground }]}>{item.label}</Text>
                                    <Text allowFontScaling={false} style={[styles.insightValue, { color: theme.foreground }]}>{item.value}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={styles.downloadReport}>
                        <Text allowFontScaling={false} style={[styles.sectionTitle, { color: theme.foreground }]}>Download Report</Text>
                        <TouchableOpacity
                            style={[styles.downloadButton, { backgroundColor: theme.primary }]}
                            onPress={showFeatureAlert}
                        >
                            <Download color={theme.primaryForeground} size={24} />
                            <View style={styles.downloadTextContainer}>
                                <Text allowFontScaling={false} style={[styles.downloadTitle, { color: theme.primaryForeground }]}>Health Summary Report</Text>
                                <Text allowFontScaling={false} style={[styles.downloadDescription, { color: theme.secondaryForeground }]}>Get a comprehensive overview of your health insights</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.additionalFeatures}>
                        <Text allowFontScaling={false} style={[styles.sectionTitle, { color: theme.foreground }]}>Additional Features</Text>
                        {additionalFeatures.map((feature, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[styles.additionalFeatureItem, { backgroundColor: theme.muted }]}
                                onPress={showFeatureAlert}
                            >
                                <View style={[styles.additionalFeatureIconContainer, { backgroundColor: theme.primary }]}>
                                    <feature.icon color={theme.primaryForeground} size={24} />
                                </View>
                                <View style={styles.additionalFeatureTextContainer}>
                                    <Text allowFontScaling={false} style={[styles.additionalFeatureTitle, { color: theme.foreground }]}>{feature.title}</Text>
                                    <Text allowFontScaling={false} style={[styles.additionalFeatureDescription, { color: theme.mutedForeground }]}>{feature.description}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    header: { paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, },
    headerTitle: { fontSize: fontSizes['2xl'], fontFamily: fonts.bold },
    scrollContent: {
        padding: 20,
    },
    quickInsights: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: fontSizes.xl,
        fontFamily: fonts.semibold,
        marginBottom: 20,
    },
    insightsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    insightItem: {
        width: '48%',
        borderRadius: borderRadius.lg,
        padding: 15,
        marginBottom: 15,
        alignItems: 'center',
    },
    insightIconContainer: {
        width: 50,
        height: 50,
        borderRadius: borderRadius.full,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    insightLabel: {
        fontSize: fontSizes.sm,
        fontFamily: fonts.medium,
        marginBottom: 5,
        textAlign: 'center',
    },
    insightValue: {
        fontSize: fontSizes.lg,
        fontFamily: fonts.semibold,
        textAlign: 'center',
    },
    downloadReport: {
        marginBottom: 30,
    },
    downloadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: borderRadius.lg,
        padding: 20,
    },
    downloadTextContainer: {
        marginLeft: 15,
        flex: 1,
    },
    downloadTitle: {
        fontSize: fontSizes.lg,
        fontFamily: fonts.semibold,
        marginBottom: 5,
    },
    downloadDescription: {
        fontSize: fontSizes.sm,
        fontFamily: fonts.regular,
    },
    additionalFeatures: {
        marginBottom: 0,
    },
    additionalFeatureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: borderRadius.lg,
        padding: 15,
        marginBottom: 15,
    },
    additionalFeatureIconContainer: {
        width: 50,
        height: 50,
        borderRadius: borderRadius.full,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    additionalFeatureTextContainer: {
        flex: 1,
    },
    additionalFeatureTitle: {
        fontSize: fontSizes.lg,
        fontFamily: fonts.semibold,
        marginBottom: 5,
    },
    additionalFeatureDescription: {
        fontSize: fontSizes.sm,
        fontFamily: fonts.regular,
    },
});

export default Insights;