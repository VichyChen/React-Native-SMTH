
import {
    DeviceEventEmitter,
} from 'react-native';
import {
    NetworkManager,
  } from '../config/Common';
import AsyncStorageManger from '../storage/AsyncStorageManger';
import Cookie from 'react-native-cookie';

export default class LoginManager {

    static update() {
        Cookie.get('http://www.newsmth.net')
            .then((res) => {
                if (res == null || res == undefined || res['main[UTMPUSERID]'] == 'guest') {
                    LoginManager.logout();
                }
            });
    }

    static logout() {
        Cookie.clear();
        AsyncStorageManger.setAccessToken('');
        AsyncStorageManger.setID('');
        AsyncStorageManger.setUsername('');
        AsyncStorageManger.setLogin(false);
        global.login = false;
        global.current.username = '';
        DeviceEventEmitter.emit('LogoutNotification', null);
    }

    static postNewSMTHLogout() {
        NetworkManager.postNewSMTHLogout(() => {
        }, (error) => {
        }, (errorMessage) => {
        });
    }
}
