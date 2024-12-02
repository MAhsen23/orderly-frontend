import React, { createContext, useState, useEffect } from 'react';
import { colors } from '../constants';
import StorageService from '../services/StorageService';

export const ThemeContext = createContext();
const THEME_KEY = 'theme';

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    useEffect(() => {
        loadSavedTheme();
    }, []);

    const loadSavedTheme = async () => {
        try {
            StorageService.getValue(THEME_KEY).then((value) => {
                if (value !== null) {
                    setIsDarkMode(value === 'dark');
                } else {
                    setIsDarkMode(false);
                }
            });
        } catch (error) {
            setIsDarkMode(false);
        }
    };

    const saveTheme = async (isDark) => {
        StorageService.setValue(THEME_KEY, isDark ? 'dark' : 'light');
    };

    const toggleTheme = () => {
        setIsDarkMode(prevMode => {
            const newMode = !prevMode;
            saveTheme(newMode);
            return newMode;
        });
    };

    const theme = isDarkMode ? colors.dark : colors.light;
    return (
        <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};