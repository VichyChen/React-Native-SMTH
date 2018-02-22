import { StackNavigator } from 'react-navigation';
import ThreadDetailScreen from '../ThreadDetailScreen';
import BoardScreen from '../BoardScreen';
import BoardListScreen from '../BoardListScreen';
import FavouriteScreen from '../FavouriteScreen';
import UserScreen from '../UserScreen';
import UserThreadScreen from '../UserThreadScreen';
import UserImageThreadScreen from '../UserImageThreadScreen';
import LoginScreen from '../LoginScreen';
import MessageScreen from '../MessageScreen';
import SendMessageScreen from '../SendMessageScreen';
import SendMessageDetailScreen from '../SendMessageDetailScreen';
import ReceiveMessageDetailScreen from '../ReceiveMessageDetailScreen';
import SettingScreen from '../SettingScreen';
import PostThreadScreen from '../PostThreadScreen';
import ReplyThreadScreen from '../ReplyThreadScreen';
import SearchBoardScreen from '../SearchBoardScreen';
import ReportScreen from '../ReportScreen';
import UpdateListScreen from '../UpdateListScreen';
import ScanRecordScreen from '../ScanRecordScreen';

import SMTHTabNavigator from './SMTHTabNavigator';


import {
    Color
} from '../../config/Common';

const SMTHStackNavigator = StackNavigator({
    tabNavigator: { screen: SMTHTabNavigator },
    threadDetail: { screen: ThreadDetailScreen },
    boardScreen: { screen: BoardScreen },
    boardListScreen: { screen: BoardListScreen },
    favouriteScreen: { screen: FavouriteScreen },
    userScreen: { screen: UserScreen },
    userThreadScreen: { screen: UserThreadScreen },
    userImageThreadScreen: { screen: UserImageThreadScreen },
    loginScreen: { screen: LoginScreen },
    messageScreen: { screen: MessageScreen },
    sendMessageScreen: { screen: SendMessageScreen },
    sendMessageDetailScreen: { screen: SendMessageDetailScreen },
    receiveMessageDetailScreen: { screen: ReceiveMessageDetailScreen },
    settingScreen: { screen: SettingScreen },
    postThreadScreen: { screen: PostThreadScreen },
    replyThreadScreen: { screen: ReplyThreadScreen },
    searchBoardScreen: { screen: SearchBoardScreen },
    reportScreen: { screen: ReportScreen },
    updateListScreen: { screen: UpdateListScreen },
    scanRecordScreen: { screen: ScanRecordScreen },
},
    {
        navigationOptions: {
            headerBackTitle: null,
            headerTintColor: 'white',
            headerStyle: {
                backgroundColor: global.colors.themeColor//'#63B8FF' //87CEFA、63B8FF、87CEFF、7EC0EE    40E0D0、48D1CC
            },
        },
    }
);

module.exports = SMTHStackNavigator;
