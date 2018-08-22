import React from 'react';
import {
    Image,
    DeviceEventEmitter
} from 'react-native';

import { TabNavigator } from "react-navigation";

import HotScreen from '../HotScreen';
import BoardScreen from '../BoardScreen';
import FavouriteScreen from '../FavouriteScreen';
import MyScreen from '../MyScreen';

import NewHotScreen from '../NewHotScreen';

import {
    Color
} from '../../config/Common';

const SMTHTabNavigator = TabNavigator({
    HotScreen: {
        screen: HotScreen,
        navigationOptions: ({ navigation }) => ({
            tabBarLabel: '热点',
            tabBarIcon: ({ tintColor, focused }) => (
                <Image
                    source={focused == true ? global.images.tabbar_home_filled : global.images.tabbar_home}
                    style={[{ width: 22, height: 22, tintColor: focused == true ? global.colors.themeColor : global.colors.gray1Color }]}
                />
            ),
        })
    },
    BoardScreen: {
        screen: BoardScreen,
        navigationOptions: ({ navigation }) => ({
            tabBarLabel: '板块',
            tabBarIcon: ({ tintColor, focused }) => (
                <Image
                    source={focused == true ? global.images.tabbar_tree_filled : global.images.tabbar_tree}
                    style={[{ width: 22, height: 22, tintColor: focused == true ? global.colors.themeColor : global.colors.gray1Color }]}
                />
            ),
        })
    },
    FavouriteScreen: {
        screen: FavouriteScreen,
        navigationOptions: ({ navigation }) => ({
            tabBarLabel: '收藏',
            tabBarIcon: ({ tintColor, focused }) => (
                <Image
                    source={focused == true ? global.images.icon_collect_filled : global.images.icon_collect}
                    style={[{ width: 22, height: 22, tintColor: focused == true ? global.colors.themeColor : global.colors.gray1Color }]}
                />
            ),
        })
    },
    MyScreen: {
        screen: MyScreen,
        navigationOptions: ({ navigation }) => ({
            tabBarLabel: '我的',
            tabBarOnPress: () => {
                DeviceEventEmitter.emit('ClickMyScreenNotification', null);
                navigation.navigate('MyScreen')
            },
            tabBarIcon: ({ tintColor, focused }) => (
                <Image
                    source={focused == true ? global.images.tabbar_user_filled : global.images.tabbar_user}
                    style={[{ width: 22, height: 22, tintColor: focused == true ? global.colors.themeColor : global.colors.gray1Color }]}
                />
            ),
            lazy: false,
        })
    }
}, {
        tabBarPosition: 'bottom',
        lazy: true,
        swipeEnabled: false,
        animationEnabled: false,
        tabBarOptions: {
            showIcon: true,
            activeTintColor: global.colors.themeColor,
            inactiveTintColor: global.colors.gray1Color,
            labelStyle: [{
                fontSize: 12,
            }, global.constants.IOS ? {} : { marginTop: 2 }],
            iconStyle: [{
            }, global.constants.IOS ? {} : { marginTop: -3 }],
            style: [{
                backgroundColor: global.colors.whiteColor,
            }, global.constants.IOS ? {} : { height: 50 }],
        },
    }
);

module.exports = SMTHTabNavigator;
