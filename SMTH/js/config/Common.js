
import NetworkManager from '../util/NetworkManager';
import HTMLParseManager from '../util/HTMLParseManager';


import ReactNavigation from '../util/ReactNavigation';
import DateUtil from '../util/DateUtil';
import ToastUtil from '../util/ToastUtil';

import AvatorImage from '../component/AvatorImage';
import SeperatorLine from '../component/SeperatorLine';
import HorizontalSeperatorLine from '../component/HorizontalSeperatorLine';
import SectionHeader from '../component/SectionHeader';
import CellBackground from '../component/CellBackground';
import NavigatorTitleButton from '../component/NavigatorTitleButton';
import SectionBlankHeader from '../component/SectionBlankHeader';
import ThreadDetailBottomBarView from '../component/ThreadDetailBottomBarView';
import ThreadDetailBottomSelectPageView from '../component/ThreadDetailBottomSelectPageView';
import ThreadDetailFloorActionView from '../component/ThreadDetailFloorActionView';
import ThreadDetailMoreView from '../component/ThreadDetailMoreView';
import BackgroundMaskView from '../component/BackgroundMaskView';
import WindowsMaskView from '../component/WindowsMaskView';
import TitleValueItem from '../component/TitleValueItem';
import LeftImageTitleValueArrowItem from '../component/LeftImageTitleValueArrowItem';
import TitleArrowItem from '../component/TitleArrowItem';
import LoginButtonView from '../component/LoginButtonView';

import BoardItems from '../page/items/BoardItems';


import Button from '../component/Button';
import CustomDoubleClick from '../component/CustomDoubleClick';
import ImageButton from '../component/ImageButton';
import LoadingView from '../component/LoadingView';
import LoadingViewText from '../component/LoadingViewText';
import LoadingViewError from '../component/LoadingViewError';
import LoadingViewNetworkError from '../component/LoadingViewNetworkError';
import LoadingViewTry from '../component/LoadingViewTry';
import ToastView from '../component/ToastView';
import LoginView from '../component/LoginView';

import Screen from '../component/Screen';

import Toast from 'antd-mobile/lib/toast';

import PickerSelectView from '../component/PickerSelectView';
import NavigationBar from '../component/NavigationBar';
import TabPageView from '../component/TabPageView';

import NewPictureListScreen from '../NewPage/NewPictureListScreen';
import NewTopTenScreen from '../NewPage/NewTopTenScreen';
import NewHotListScreen from '../NewPage/NewHotListScreen';
import NewLoginView from '../NewPage/NewLoginView';
import NewFavouriteBoardScreen from '../NewPage/NewFavouriteBoardScreen';
import NewFavouriteThreadScreen from '../NewPage/NewFavouriteThreadScreen';

import NewUserInfoScreen from '../NewPage/NewUserInfoScreen';
import NewUserArticleScreen from '../NewPage/NewUserArticleScreen';
import NewUserMemberScreen from '../NewPage/NewUserMemberScreen';
import NewUserFriendsScreen from '../NewPage/NewUserFriendsScreen';
import NewUserfansScreen from '../NewPage/NewUserfansScreen';

import NewMessageMailListScreen from '../NewPage/NewMessageMailListScreen';
import NewMessageSendMailListScreen from '../NewPage/NewMessageSendMailListScreen';
import NewMessageReplyListScreen from '../NewPage/NewMessageReplyListScreen';
import NewMessageAtListScreen from '../NewPage/NewMessageAtListScreen';
import NewMessageLikeListScreen from '../NewPage/NewMessageLikeListScreen';

import GDTNativeExpressView from '../GDT/GDTNativeExpressView';

import NewSearchArticleScreen from '../NewPage/NewSearchArticleScreen';
import NewSearchBoardScreen from '../NewPage/NewSearchBoardScreen';
import NewSearchAccountScreen from '../NewPage/NewSearchAccountScreen';

export {
    NetworkManager,
    HTMLParseManager,
    DateUtil,
    ReactNavigation,
    ToastUtil,
    SeperatorLine,
    HorizontalSeperatorLine,
    SectionHeader,
    CellBackground,
    NavigatorTitleButton,
    AvatorImage,
    SectionBlankHeader,
    ThreadDetailBottomBarView,
    ThreadDetailBottomSelectPageView,
    ThreadDetailFloorActionView,
    ThreadDetailMoreView,
    BackgroundMaskView,
    WindowsMaskView,
    BoardItems,
    Button,
    CustomDoubleClick,
    ImageButton,
    LoadingView,
    LoadingViewText,
    LoadingViewError,
    LoadingViewNetworkError,
    LoadingViewTry,
    ToastView,
    TitleValueItem,
    LeftImageTitleValueArrowItem,
    TitleArrowItem,
    LoginButtonView,
    LoginView,
    Screen,
    Toast,
    PickerSelectView,
    NavigationBar,
    TabPageView,
    NewHotListScreen,
    NewTopTenScreen,
    NewPictureListScreen,
    NewLoginView,
    NewFavouriteBoardScreen,
    NewFavouriteThreadScreen,
    NewUserInfoScreen,
    NewUserArticleScreen,
    NewUserMemberScreen,
    NewUserFriendsScreen,
    NewUserfansScreen,
    NewMessageMailListScreen,
    NewMessageSendMailListScreen,
    NewMessageReplyListScreen,
    NewMessageAtListScreen,
    NewMessageLikeListScreen,

    GDTNativeExpressView,
    NewSearchArticleScreen,
    NewSearchBoardScreen,
    NewSearchAccountScreen,
}


(function () {
    "use strict";

    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    // Use a lookup table to find the index.
    var lookup = new Uint8Array(256);
    for (var i = 0; i < chars.length; i++) {
        lookup[chars.charCodeAt(i)] = i;
    }

    exports.encode = function (arraybuffer) {
        var bytes = new Uint8Array(arraybuffer),
            i, len = bytes.length, base64 = "";

        for (i = 0; i < len; i += 3) {
            base64 += chars[bytes[i] >> 2];
            base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
            base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
            base64 += chars[bytes[i + 2] & 63];
        }

        if ((len % 3) === 2) {
            base64 = base64.substring(0, base64.length - 1) + "=";
        } else if (len % 3 === 1) {
            base64 = base64.substring(0, base64.length - 2) + "==";
        }

        return base64;
    };

    exports.decode = function (base64) {
        var bufferLength = base64.length * 0.75,
            len = base64.length, i, p = 0,
            encoded1, encoded2, encoded3, encoded4;

        if (base64[base64.length - 1] === "=") {
            bufferLength--;
            if (base64[base64.length - 2] === "=") {
                bufferLength--;
            }
        }

        var arraybuffer = new ArrayBuffer(bufferLength),
            bytes = new Uint8Array(arraybuffer);

        for (i = 0; i < len; i += 4) {
            encoded1 = lookup[base64.charCodeAt(i)];
            encoded2 = lookup[base64.charCodeAt(i + 1)];
            encoded3 = lookup[base64.charCodeAt(i + 2)];
            encoded4 = lookup[base64.charCodeAt(i + 3)];

            bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
            bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
            bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
        }

        return arraybuffer;
    };
})();
