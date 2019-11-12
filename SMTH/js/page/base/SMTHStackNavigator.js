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

import NewBoardListScreen from '../../NewPage/NewBoardListScreen';
import NewThreadDetailScreen from '../../NewPage/NewThreadDetailScreen';
import NewSearchScreen from '../../NewPage/NewSearchScreen';
import NewFavouriteScreen from '../../NewPage/NewFavouriteScreen';
import NewMyScreen from '../../NewPage/NewMyScreen';
import NewReplyThreadScreen from '../../NewPage/NewReplyThreadScreen';
import NewPostThreadScreen from '../../NewPage/NewPostThreadScreen';
import NewFavouriteBoardScreen from '../../NewPage/NewFavouriteBoardScreen';
import NewFavouriteThreadScreen from '../../NewPage/NewFavouriteThreadScreen';

import NewUserScreen from '../../NewPage/NewUserScreen';
import NewUserArticleScreen from '../../NewPage/NewUserArticleScreen';

import NewMessageScreen from '../../NewPage/NewMessageScreen';
import NewMessageMailDetailScreen from '../../NewPage/NewMessageMailDetailScreen';
import NewMessageSendMailDetailScreen from '../../NewPage/NewMessageSendMailDetailScreen';
import NewMessageSendScreen from '../../NewPage/NewMessageSendScreen';

import NewSettingScreen from '../../NewPage/NewSettingScreen';

import NewSearchArticleScreen from '../../NewPage/NewSearchArticleScreen';
import NewSearchBoardScreen from '../../NewPage/NewSearchBoardScreen';
import NewSearchAccountScreen from '../../NewPage/NewSearchAccountScreen';

import NewSMTHBoardScreen from '../../NewSMTHPage/NewSMTHBoardScreen';
import NewSMTHMyScreen from '../../NewSMTHPage/NewSMTHMyScreen';
import NewSMTHFavouriteBoardScreen from '../../NewSMTHPage/NewSMTHFavouriteBoardScreen';
import NewSMTHThreadDetailScreen from '../../NewSMTHPage/NewSMTHThreadDetailScreen';
import NewSMTHReplyThreadScreen from '../../NewSMTHPage/NewSMTHReplyThreadScreen';
import NewSMTHPostThreadScreen from '../../NewSMTHPage/NewSMTHPostThreadScreen';
import NewSMTHThreadDetailLikeScreen from '../../NewSMTHPage/NewSMTHThreadDetailLikeScreen';
import NewSMTHSearchThreadScreen from '../../NewSMTHPage/NewSMTHSearchThreadScreen';
import NewSMTHSearchThreadResultScreen from '../../NewSMTHPage/NewSMTHSearchThreadResultScreen';

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
    newBoardListScreen: { screen: NewBoardListScreen },
    newThreadDetailScreen: { screen: NewThreadDetailScreen },
    newSearchScreen: { screen: NewSearchScreen },
    newFavouriteScreen: { screen: NewFavouriteScreen },
    newMyScreen: { screen: NewMyScreen },
    newReplyThreadScreen: { screen: NewReplyThreadScreen },
    newPostThreadScreen: { screen: NewPostThreadScreen },
    newFavouriteBoardScreen: { screen: NewFavouriteBoardScreen },
    newFavouriteThreadScreen: { screen: NewFavouriteThreadScreen },
    newUserScreen: { screen: NewUserScreen },
    newUserArticleScreen: { screen: NewUserArticleScreen },
    newMessageScreen: { screen: NewMessageScreen },
    newMessageMailDetailScreen: { screen: NewMessageMailDetailScreen },
    newMessageSendMailDetailScreen: { screen: NewMessageSendMailDetailScreen },
    newMessageSendScreen: { screen: NewMessageSendScreen },
    newSettingScreen: { screen: NewSettingScreen },

    newSearchArticleScreen: { screen: NewSearchArticleScreen },
    newSearchBoardScreen: { screen: NewSearchBoardScreen },
    newSearchAccountScreen: { screen: NewSearchAccountScreen },

    newSMTHBoardScreen: { screen: NewSMTHBoardScreen },
    newSMTHMyScreen: { screen: NewSMTHMyScreen },
    newSMTHFavouriteBoardScreen: { screen: NewSMTHFavouriteBoardScreen },
    newSMTHThreadDetailScreen: { screen: NewSMTHThreadDetailScreen },
    newSMTHReplyThreadScreen: { screen: NewSMTHReplyThreadScreen },
    newSMTHPostThreadScreen: { screen: NewSMTHPostThreadScreen },
    newSMTHThreadDetailLikeScreen: { screen: NewSMTHThreadDetailLikeScreen },
    newSMTHSearchThreadScreen: { screen: NewSMTHSearchThreadScreen },
    newSMTHSearchThreadResultScreen: { screen: NewSMTHSearchThreadResultScreen },
},
    {
        navigationOptions: {
            headerBackTitle: null,
            headerTintColor: 'white',
            header:null,
            headerStyle: {
                backgroundColor: global.colors.themeColor//'#63B8FF' //87CEFA、63B8FF、87CEFF、7EC0EE    40E0D0、48D1CC
            },
        },
    }
);

module.exports = SMTHStackNavigator;
