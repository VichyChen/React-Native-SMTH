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
        AsyncStorageKit.set('newsmth_access_token', token);
    }

    static getAccessToken() {
        var token = AsyncStorageKit.get('newsmth_access_token');
        return token ? token : '';
    }

    static setUsername(username) {
        AsyncStorageKit.set('newsmth_username', username);
    }

    static getUsername() {
        var username = AsyncStorageKit.get('newsmth_username');
        return username ? username : '';
    }

    static setID(id) {
        AsyncStorageKit.set('newsmth_id', id);
    }

    static getID() {
        var id = AsyncStorageKit.get('newsmth_id');
        return id ? id : '';
    }

    static setPassword(password) {
        AsyncStorageKit.set('newsmth_password', password);
    }

    static getPassword() {
        var password = AsyncStorageKit.get('newsmth_password');
        return password ? password : '';
    }

    static setUsernamePassword(username, password) {
        AsyncStorageKit.set('newsmth_username', username);
        AsyncStorageKit.set('newsmth_password', password);
    }

    static getUsernamePassword() {
        var username = AsyncStorageKit.get('newsmth_username');
        var password = AsyncStorageKit.get('newsmth_password');
        // return username ? username : '';
        var dic = new Array();
        dic["username"] = username;
        dic["password"] = password;

        return dic;
    }

    static setSectionArray(sectionArray) {
        var array = JSON.stringify(sectionArray);
        AsyncStorageKit.set('newsmth_sectionarray', array);
    }

    static getSectionArray() {
        return AsyncStorage.getItem('newsmth_sectionarray')
            .then(req => JSON.parse(req))
            .then((json) => {
                return json;
            });
    }

    static setLogin(login) {
        AsyncStorageKit.set('newsmth_login', login == true ? '1' : '0');
    }

    static getLogin() {
        return AsyncStorageKit.get('newsmth_login').then(login => {
            return login == '1' ? true : false;
        });
    }
}    