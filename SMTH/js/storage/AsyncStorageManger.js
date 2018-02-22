import { AsyncStorage } from 'react-native';
import AsyncStorageKit from './AsyncStorageKit';

export default class AsyncStorageManger {
    
    static set(key, value) {
        AsyncStorageKit.set(key, value);
    }

    static get(key) {
        return AsyncStorageKit.get(key);
    }

    static setAccessToken(token) {
        AsyncStorageKit.set('access_token', token);
    }

    static getAccessToken() {
        var token = AsyncStorageKit.get('access_token');
        return token ? token : '';
    }

    static setUsername(username) {
        AsyncStorageKit.set('username', username);
    }

    static getUsername() {
        var username = AsyncStorageKit.get('username');
        return username ? username : '';
    }

    static setPassword(password) {
        AsyncStorageKit.set('password', password);
    }

    static getPassword() {
        var password = AsyncStorageKit.get('password');
        return password ? password : '';
    }

    static setUsernamePassword(username, password) {
        AsyncStorageKit.set('username', username);
        AsyncStorageKit.set('password', password);
    }

    static getUsernamePassword() {
        var username = AsyncStorageKit.get('username');
        var password = AsyncStorageKit.get('password');
        // return username ? username : '';
        var dic = new Array();
        dic["username"] = username;
        dic["password"] = password;
        
        return dic;
    }
}    