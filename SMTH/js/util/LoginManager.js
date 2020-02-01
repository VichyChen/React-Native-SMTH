
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
                    AsyncStorageManger.getLogin().then(login => {
                        if (login == true) {
                            LoginManager.postNewSMTHLogin();
                        }
                        else {
                            LoginManager.logout();
                        }
                    });
                }
            });
    }

    static logout() {
        Cookie.clear();
        AsyncStorageManger.setAccessToken('');
        AsyncStorageManger.setID('');
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

    static postNewSMTHLogin() {
        AsyncStorageManger.getUsername().then(username => {
            AsyncStorageManger.getPassword().then((password) => {
                NetworkManager.postNewSMTHLogin(username, password, 99999, (result) => {
                    AsyncStorageManger.setLogin(true);
                    global.login = true;
                    global.current.username = username;
                    DeviceEventEmitter.emit('LoginSuccessNotification', result);
                }, (error) => {
                }, (errorMessage) => {
                });        
            });
        });
    }
}
