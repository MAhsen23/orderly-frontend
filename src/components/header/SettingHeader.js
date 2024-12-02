import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { ChevronLeft } from 'lucide-react-native';
import { fonts, fontSizes } from '../../constants';
import useTheme from '../../hooks/useTheme';

const SettingHeader = ({ onBackPress, onSavePress, title, showBorder = false }) => {
    const { theme } = useTheme();
    return (
        <View style={[styles.header, { borderBottomColor: theme.muted, borderBottomWidth: showBorder ? 1 : 0 }]}>
            <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
                <ChevronLeft color={theme.mutedForeground} size={24} />
            </TouchableOpacity>
            <View>
                <Text allowFontScaling={false} style={[styles.headerTitle, { color: theme.foreground }]}>{title}</Text>
            </View>
            <TouchableOpacity onPress={onSavePress} disabled={true} style={styles.saveButton}>
                <Text allowFontScaling={false} style={[styles.saveText, { color: theme.mutedForeground }]}>Skip</Text>
            </TouchableOpacity>
        </View>
    )
}

export default SettingHeader;
const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 15,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: fontSizes['2xl'],
        fontFamily: fonts.bold,
    },
    saveText: {
        fontFamily: fonts.medium,
        fontSize: fontSizes.base,
    },
    backButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    saveButton: {
        justifyContent: 'flex-end',
        flex: 1,
        flexDirection: 'row',
        opacity: 0,
    },
})