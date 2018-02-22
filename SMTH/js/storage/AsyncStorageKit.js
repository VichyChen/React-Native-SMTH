import { AsyncStorage } from 'react-native';

export default class AsyncStorageKit {
    static set(key, value) {
        AsyncStorage.setItem(key, value ? value : '');
    }

    static get(key) {
        return AsyncStorage.getItem(key).then((value) => {
            return value ? value : '';
        })
    }
}    