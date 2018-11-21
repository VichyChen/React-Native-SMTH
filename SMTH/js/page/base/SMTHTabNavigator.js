import React from 'react';
import {
    Image,
    DeviceEventEmitter,
    StatusBar,
    View,
    TouchableWithoutFeedback
} from 'react-native';

import { TabNavigator } from "react-navigation";

import HotScreen from '../HotScreen';
import BoardScreen from '../BoardScreen';
import FavouriteScreen from '../FavouriteScreen';
import MyScreen from '../MyScreen';

import NewHotScreen from '../../NewPage/NewHotScreen';
import NewBoardScreen from '../../NewPage/NewBoardScreen';
import NewFavouriteScreen from '../../NewPage/NewFavouriteScreen';
import NewFavouriteBoardScreen from '../../NewPage/NewFavouriteBoardScreen';
import NewMyScreen from '../../NewPage/NewMyScreen';

import {
    CustomDoubleClick
} from '../../config/Common';

const SMTHTabNavigator = TabNavigator({
    HotScreen: {
        screen: NewHotScreen,
        navigationOptions: ({ navigation }) => ({
            tabBarLabel: '首页',
            tabBarIcon: ({ tintColor, focused }) => (
                <CustomDoubleClick style={{ width: 44, height: 48, alignItems: 'center', justifyContent: 'center', }}
                    onDoubleClick={() => {
                        DeviceEventEmitter.emit('DoubleClickHotScreenNotification', null);
                    }}
                    onClick={() => {
                        if (!focused) {
                            StatusBar.setBarStyle('dark-content');
                            navigation.navigate('HotScreen')
                        }
                    }}>
                    <Image source={focused == true ? global.images.tabbar_home_filled : global.images.tabbar_home}
                        style={[{ width: 22, height: 22, tintColor: focused == true ? global.colors.themeColor : global.colors.gray2Color }]} />
                </CustomDoubleClick>
            ),
            tabBarOnPress: ({ previousScene, scene, jumpToIndex }) => {
                StatusBar.setBarStyle('dark-content');
                navigation.navigate('HotScreen')
            },
        })
    },
    BoardScreen: {
        screen: NewBoardScreen,
        navigationOptions: ({ navigation }) => ({
            tabBarLabel: '板块',
            tabBarIcon: ({ tintColor, focused }) => (
                <Image
                    source={focused == true ? global.images.tabbar_group_filled : global.images.tabbar_group}
                    style={[{ width: 22, height: 22, tintColor: focused == true ? global.colors.themeColor : global.colors.gray2Color }]}
                />
            ),
            tabBarOnPress: ({ previousScene, scene, jumpToIndex }) => {
                StatusBar.setBarStyle('dark-content');
                navigation.navigate('BoardScreen')
            },
        })
    },
    FavouriteScreen: {
        screen: NewFavouriteBoardScreen,
        navigationOptions: ({ navigation }) => ({
            tabBarLabel: '收藏',
            tabBarIcon: ({ tintColor, focused }) => (
                <Image
                    source={focused == true ? global.images.tabbar_favourite_filled : global.images.tabbar_favourite}
                    style={[{ width: 22, height: 22, tintColor: focused == true ? global.colors.themeColor : global.colors.gray2Color }]}
                />
            ),
            tabBarOnPress: ({ previousScene, scene, jumpToIndex }) => {
                StatusBar.setBarStyle('dark-content');
                navigation.navigate('FavouriteScreen')
            },
        })
    },
    MyScreen: {
        screen: NewMyScreen,
        navigationOptions: ({ navigation }) => ({
            tabBarLabel: '我的',
            tabBarOnPress: () => {
                StatusBar.setBarStyle('light-content');
                DeviceEventEmitter.emit('ClickMyScreenNotification', null);
                navigation.navigate('MyScreen')
            },
            tabBarIcon: ({ tintColor, focused }) => (
                <Image
                    source={focused == true ? global.images.tabbar_user_filled : global.images.tabbar_user}
                    style={[{ width: 22, height: 22, tintColor: focused == true ? global.colors.themeColor : global.colors.gray2Color }]}
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
            inactiveTintColor: global.colors.gray2Color,
            labelStyle: [{
                fontSize: 11,
            }, global.bool.iOS ? {} : { marginTop: 2 }],
            iconStyle: [{
            }, global.bool.iOS ? {} : { marginTop: -3 }],
            style: [{
                backgroundColor: global.colors.whiteColor,
            }, global.bool.iOS ? {} : { height: 50 }],
        },
    }
);

module.exports = SMTHTabNavigator;
