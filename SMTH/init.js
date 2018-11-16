import {
    Dimensions,
    Platform,
    DeviceEventEmitter
} from 'react-native';

import AsyncStorageManger from './js/storage/AsyncStorageManger';

import {
    BoardModel
} from 'ModelModule';

global.login = false;

global.bool = {
    iOS: Platform.OS === 'ios',
    Android: Platform.OS === 'android',
    iPhoneX: Platform.OS === 'ios' ? (Dimensions.get('window').width == 375 && Dimensions.get('window').height == 812) : false,
};

global.constants = {
    ScreenWidth: Dimensions.get('window').width,
    ScreenHeight: global.bool.iOS ? Dimensions.get('window').height : Dimensions.get('window').height - 24,
    StatusBarHeight: global.bool.iOS ? (global.bool.iPhoneX ? 44 : 20) : 20,
    NavigationBarHeight: global.bool.iOS ? (global.bool.iPhoneX ? 88 : 64) : 80,
    TabBarHeight: global.bool.iOS ? (global.bool.iPhoneX ? 49 + 34 : 49) : 49,
    TopSaveArea: global.bool.iOS ? (global.bool.iPhoneX ? 24 : 0) : 0,
    BottomSaveArea: global.bool.iOS ? (global.bool.iPhoneX ? 34 : 0) : 0,
    TopMargin: 15,
    BottomMargin: 15,
    LeftMargin: 15,
    RightMargin: 15,
    Margin: 15,
    Padding: 15,
    LineHeight: 20,
};

global.colors = {
    whiteColor: 'white',
    clearColor: '#00000000',
    themeColor: '#6495ED', //167efb、4788c7、6495ED
    blueColor: '#337ab7',
    redColor: '#ea6f5a',
    fontColor: '#333333',
    gray1Color: '#666666',
    gray2Color: '#999999',
    gray3Color: '#b4b4b4',
    gray4Color: '#dcdcdc',
    backgroundGrayColor: '#F5F5F5',
    seperatorColor: '#F1F1F1',
};

global.fontSize = {
    20: 20,
    19: 19,
    18: 18,
    17: 17,
    16: 16,
    15: 15,
    14: 14,
    13: 13,
    12: 12,
    11: 11,
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

    get ic_return_b_90x90() { return require('./js/image/ic_return_b_90x90.png') },

    get icon_message_mail() { return require('./js/image/icon_message_mail.png') },
    get icon_message_sendmail() { return require('./js/image/icon_message_sendmail.png') },
    get icon_message_reply() { return require('./js/image/icon_message_reply.png') },
    get icon_message_at() { return require('./js/image/icon_message_at.png') },
};

global.storageKeys = {
    pageSize: 'pageSize',
    fontSize: 'fontSize',
};

global.configures = {
    pageSize: 20,
    currentFontSize: 16,
    standandFontSize: 17,
    fontSize20: 20,
    fontSize19: 19,
    fontSize18: 18,
    fontSize17: 17,
    fontSize16: 16,
    fontSize15: 15,
    fontSize14: 14,
    fontSize13: 13,
    fontSize12: 12,
    fontSize11: 11,
    fontSize10: 10,
    fontSize9: 9,
    fontSize8: 8,
    boards: new Array(), //板块
    sections: [
        { key: 0, id: '7fba65e45f678eb8c605d4107de04185', title: '社区管理' },
        { key: 1, id: '4fcab28694a0be93d9297d8cede052d9', title: '国内院校' },
        { key: 2, id: '3497e48bb537373d0f738b41fe53a41b', title: '休闲娱乐' },
        { key: 3, id: '353fdfda1dfe7a714e592bab99c762cd', title: '五湖四海' },
        { key: 4, id: 'c8d614e56acb8a192ec4af8b375a5eea', title: '游戏运动' },
        { key: 5, id: '5b634fdc9ecddf6042561c959176c077', title: '社会信息' },
        { key: 6, id: '1c455a5dccf4242008d188f9676e3f4e', title: '知性感性' },
        { key: 7, id: '12af235486fde6684e4b9e83f5d2b779', title: '文化人文' },
        { key: 8, id: '4ed7f0d8b621c8ccf9e11eca9991d6dc', title: '学术科学' },
        { key: 9, id: '4dda79c64b3ffb61f8048d745292ff5d', title: '电脑技术' },
    ],
};

global.current = {
    username: '',
    sectionArray: [],
    favouriteArray: [],
};

function init() {
    //是否有登陆
    AsyncStorageManger.getLogin().then(login => {
        global.login = login;
    });
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
    //新板块
    AsyncStorageManger.getSectionArray().then((sectionArray) => {
        global.current.sectionArray = sectionArray;
    });
    //收藏
    AsyncStorageManger.getFavouriteArray().then((favouriteArray) => {
        global.current.favouriteArray = favouriteArray;
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
