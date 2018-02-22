import {
    Dimensions,
    Platform,
    DeviceEventEmitter
} from 'react-native';

import AsyncStorageManger from './js/storage/AsyncStorageManger';

import {
    BoardModel
} from 'ModelModule';

global.constants = {
    IOS: Platform.OS === 'ios',
    ANDROID: Platform.OS === 'android',
    SCREEN_WIDTH: Dimensions.get('window').width,
    SCREEN_HEIGHT: Platform.OS === 'ios' ? Dimensions.get('window').height : Dimensions.get('window').height - 24,
    NAVIGATIONBAR_HEIGHT: Platform.OS === 'ios' ? 64 : 80,
};

global.colors = {
    whiteColor: 'white',
    clearColor: '#00000000',
    themeColor: '#6495ED', //167efb、4788c7、6495ED
    blueColor: '#167efb',
    fontColor: '#323232',
    gray1Color: '#646464',
    gray2Color: '#969696',
    gray3Color: '#b4b4b4',
    gray4Color: '#dcdcdc',
    backgroundGrayColor: '#f5f5f5',
    seperatorColor: '#f2f2f2',
};

global.images = {
    get face_default_m() { return require('./js/image/face_default_m.jpg') },
    get icon_advice() { return require('./js/image/icon_advice.png') },
    get icon_collect_filled() { return require('./js/image/icon_collect_filled.png') },
    get icon_collect() { return require('./js/image/icon_collect.png') },
    get icon_edit() { return require('./js/image/icon_edit.png') },
    get icon_forward_arrow() { return require('./js/image/icon_forward_arrow.png') },
    get icon_message() { return require('./js/image/icon_message.png') },
    get icon_minus() { return require('./js/image/icon_minus.png') },
    get icon_more() { return require('./js/image/icon_more.png') },
    get icon_replycount() { return require('./js/image/icon_replycount.png') },
    get icon_search() { return require('./js/image/icon_search.png') },
    get icon_setting() { return require('./js/image/icon_setting.png') },
    get icon_share() { return require('./js/image/icon_share.png') },
    get icon_theme() { return require('./js/image/icon_theme.png') },
    get icon_update() { return require('./js/image/icon_update.png') },
    get tabbar_home_filled() { return require('./js/image/tabbar_home_filled.png') },
    get tabbar_home() { return require('./js/image/tabbar_home.png') },
    get tabbar_tree_filled() { return require('./js/image/tabbar_tree_filled.png') },
    get tabbar_tree() { return require('./js/image/tabbar_tree.png') },
    get tabbar_user_filled() { return require('./js/image/tabbar_user_filled.png') },
    get tabbar_user() { return require('./js/image/tabbar_user.png') },
};

global.storageKeys = {
    pageSize: 'pageSize',
    fontSize: 'fontSize',
};

global.configures = {
    pageSize: 20,
    currentFontSize: 15,
    standandFontSize: 17,
    fontSize20: 20,
    fontSize19: 19,
    fontSize18: 18,
    fontSize17: 17,
    fontSize16: 16,
    fontSize15: 15,
    fontSize14: 14,
    fontSize13: 13,
    boards: new Array(), //板块
};

global.current = {
    username: '',
};

function init() {
    //用户名
    AsyncStorageManger.getUsername().then(username => {
        global.current.username = username;
    });
    //板块
    BoardModel.read().then((array) => {
        for (var i = 0; i < array.length; i++) {
            global.configures.boards[array[i].id] = array[i].name
        }
    });

    configure();
    this.subscription = DeviceEventEmitter.addListener('RefreshConfigureNotification', () => {
        configure();
    });
}

async function configure() {
    //每页回复数
    var pageSize = await AsyncStorageManger.get(global.storageKeys.pageSize);
    if (pageSize.length > 0) {
        global.configures.pageSize = parseInt(pageSize);
    }

    //字体大小
    var fontSize = await AsyncStorageManger.get(global.storageKeys.fontSize);
    if (fontSize.length > 0) {
        global.configures.currentFontSize = parseInt(fontSize);
    }
    var diff = global.configures.currentFontSize - global.configures.standandFontSize;
    global.configures.fontSize20 = 20 + diff;
    global.configures.fontSize19 = 19 + diff;
    global.configures.fontSize18 = 18 + diff;
    global.configures.fontSize17 = 17 + diff;
    global.configures.fontSize16 = 16 + diff;
    global.configures.fontSize15 = 15 + diff;
    global.configures.fontSize14 = 14 + diff;
    global.configures.fontSize13 = 13 + diff;
}

init();
