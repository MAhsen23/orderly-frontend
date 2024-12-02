import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { X, Plus, Save, Trash2 } from 'lucide-react-native';
import { fonts, fontSizes, borderRadius, colors } from '../../constants';

const NotesModal = ({ visible, onClose, onSave, theme, savedNotes }) => {
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        if (savedNotes && savedNotes.length > 0) {
            setNotes(savedNotes.map((text, index) => ({ id: index + 1, text })));
        } else {
            setNotes([{ id: 1, text: '' }]);
        }
    }, [savedNotes]);

    const addNote = () => {
        if (notes.length < 5) {
            setNotes([...notes, { id: Date.now(), text: '' }]);
        }
    };

    const updateNote = (id, text) => {
        setNotes(notes.map(note => note.id === id ? { ...note, text } : note));
    };

    const removeNote = (id) => {
        setNotes(notes.filter(note => note.id !== id));
    };

    const handleSave = () => {
        onSave(notes.map(note => note.text));
    };

    const getPlaceholder = (index) => {
        const placeholders = [
            "What's on your mind today?",
            "Share your thoughts",
            "Notable experiences recently?",
            "Reflect on your day",
            "Anything significant to remember?"
        ];
        return placeholders[index] || `Share your thoughts`;
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
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
                        {notes.map((note, index) => (
                            <View key={note.id} style={styles.noteItem}>
                                <TextInput
                                    style={[styles.input, { backgroundColor: theme.muted, color: theme.foreground }]}
                                    placeholder={getPlaceholder(index)}
                                    placeholderTextColor={theme.mutedForeground}
                                    value={note.text}
                                    onChangeText={(text) => updateNote(note.id, text)}
                                    multiline
                                />
                                {notes.length > 1 && (
                                    <TouchableOpacity onPress={() => removeNote(note.id)} style={styles.removeButton}>
                                        <Trash2 color={theme.error} size={20} />
                                    </TouchableOpacity>
                                )}
                            </View>
                        ))}
                    </ScrollView>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            onPress={addNote}
                            style={[
                                styles.button,
                                styles.addButton,
                                { backgroundColor: theme.muted, opacity: notes.length >= 5 ? 0.5 : 1 }
                            ]}
                            disabled={notes.length >= 5}
                        >
                            <Plus color={theme.mutedForeground} size={24} />
                            <Text style={[styles.buttonText, { color: theme.mutedForeground }]}>Add Note</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleSave} style={[styles.button, styles.saveButton, { backgroundColor: theme.primary }]}>
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
