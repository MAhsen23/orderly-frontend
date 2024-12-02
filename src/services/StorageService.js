import AsyncStorage from '@react-native-async-storage/async-storage';

const setValue = (key, value) => {
    return new Promise((resolve, reject) => {
        const jsonValue = JSON.stringify(value);
        AsyncStorage.setItem(key, jsonValue)
            .then(() => {
                resolve(true);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

const getValue = async (key) => {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem(key)
            .then((jsonValue) => {
                resolve(jsonValue != null ? JSON.parse(jsonValue) : null);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

const removeItem = async (key) => {
    await AsyncStorage.removeItem(key);
};

const StorageService = {
    setValue, getValue, removeItem
};

export default StorageService;
