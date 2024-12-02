import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { X, Plus, Save, Trash2 } from 'lucide-react-native';
import { fonts, fontSizes, borderRadius } from '../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { setNotes } from '../../redux/features/notesSlice';
import SQLiteService from '../../services/SQLiteService';

const NotesModal = ({ visible, onClose, theme }) => {
    const dispatch = useDispatch();
    const { notes } = useSelector(state => state.notes);
    const [localNotes, setLocalNotes] = useState([]);

    useEffect(() => {
        setLocalNotes(notes.length > 0 ? [...notes] : ['']);
    }, [visible]);

    const handleAddNote = () => {
        if (localNotes.length < 5) {
            setLocalNotes([...localNotes, '']);
        }
    };

    const handleUpdateNote = (index, text) => {
        const updatedNotes = [...localNotes];
        updatedNotes[index] = text;
        setLocalNotes(updatedNotes);
    };

    const handleRemoveNote = (index) => {
        const updatedNotes = [...localNotes];
        updatedNotes.splice(index, 1);
        setLocalNotes(updatedNotes);
    };

    const handleSave = async () => {
        try {
            const validNotes = localNotes.filter(note => note.trim() !== '');
            dispatch(setNotes(validNotes));
            await SQLiteService.setNotes(validNotes); // Save in SQLite
            onClose();
        } catch (error) {
            console.log('Error saving notes:', error);
        }
    };

    const getPlaceholder = (index) => {
        const placeholders = [
            "What's on your mind today?",
            "Share your thoughts",
            "Notable experiences recently?",
            "Reflect on your day",
            "Anything significant to remember?",
        ];
        return placeholders[index] || "Share your thoughts";
    };

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.centeredView}
            >
                <View style={[styles.modalView, { backgroundColor: theme.background }]}>
                    <View style={styles.modalHeader}>
                        <Text style={[styles.modalTitle, { color: theme.foreground }]}>Your Notes</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X color={theme.mutedForeground} size={24} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false} style={styles.notesContainer}>
                        {localNotes.map((note, index) => (
                            <View key={index} style={styles.noteItem}>
                                <TextInput
                                    style={[styles.input, { backgroundColor: theme.muted, color: theme.foreground }]}
                                    placeholder={getPlaceholder(index)}
                                    placeholderTextColor={theme.mutedForeground}
                                    value={note}
                                    onChangeText={(text) => handleUpdateNote(index, text)}
                                    multiline
                                />
                                {localNotes.length > 1 && (
                                    <TouchableOpacity onPress={() => handleRemoveNote(index)} style={styles.removeButton}>
                                        <Trash2 color={theme.error} size={20} />
                                    </TouchableOpacity>
                                )}
                            </View>
                        ))}
                    </ScrollView>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            onPress={handleAddNote}
                            style={[
                                styles.button,
                                styles.addButton,
                                { backgroundColor: theme.muted, opacity: localNotes.length >= 5 ? 0.5 : 1 }
                            ]}
                            disabled={localNotes.length >= 5}
                        >
                            <Plus color={theme.mutedForeground} size={24} />
                            <Text style={[styles.buttonText, { color: theme.mutedForeground }]}>Add Note</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleSave}
                            style={[styles.button, styles.saveButton, { backgroundColor: theme.primary }]}
                        >
                            <Save color={theme.primaryForeground} size={24} />
                            <Text style={[styles.buttonText, { color: theme.primaryForeground }]}>Save Notes</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0)',
    },
    modalView: {
        borderTopLeftRadius: borderRadius.xl,
        borderTopRightRadius: borderRadius.xl,
        padding: 20,
        flex: 1,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: fontSizes.lg,
        fontFamily: fonts.semibold,
    },
    closeButton: {
        padding: 5,
    },
    notesContainer: {
        flex: 1,
    },
    noteItem: {
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        borderRadius: borderRadius.default,
        padding: 15,
        fontSize: fontSizes.base,
        fontFamily: fonts.regular,
        minHeight: 80,
    },
    removeButton: {
        marginLeft: 10,
        padding: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: borderRadius.default,
        flex: 1,
    },
    addButton: {
        marginRight: 5,
    },
    saveButton: {
        marginLeft: 5,
    },
    buttonText: {
        marginLeft: 10,
        marginTop: 3,
        fontSize: fontSizes.base,
        fontFamily: fonts.semibold,
    },
});

export default NotesModal;
