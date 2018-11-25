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

    static setID(id) {
        AsyncStorageKit.set('id', id);
    }

    static getID() {
        var id = AsyncStorageKit.get('id');
        return id ? id : '';
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

    static setSectionArray(sectionArray) {
        var array = JSON.stringify(sectionArray);
        AsyncStorageKit.set('sectionArray', array);
    }

    static getSectionArray() {
        return AsyncStorage.getItem('sectionArray')
            .then(req => JSON.parse(req))
            .then((json) => {
                return json;
            });
    }

    static setLogin(login) {
        AsyncStorageKit.set('Login', login == true ? '1' : '0');
    }

    static getLogin() {
        return AsyncStorageKit.get('Login').then(login => {
            return login == '1' ? true : false;
        });
    }
}    