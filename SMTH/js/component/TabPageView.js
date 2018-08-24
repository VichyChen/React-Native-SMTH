/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  TextInput,
  ScrollView,
  ListView,
  View,
  Navigator,
  FlatList,
  SectionList,
  TouchableHighlight,
  TouchableWithoutFeedback,
  DeviceEventEmitter
} from 'react-native';

import codePush from 'react-native-code-push'

import {
  NetworkManager,
  DateUtil,
  SeperatorLine,
  HorizontalSeperatorLine,
  SectionHeader,
  CellBackground,
  LoginView,
  LoadingView,
  Screen,
  Toast,
  ToastUtil,
  AvatorImage,
  NavigationBar,
  NewHotListScreen
} from '../config/Common';

import AsyncStorageManger from '../storage/AsyncStorageManger';

import Tabs from 'antd-mobile/lib/tabs';
import ScrollableTabView, { DefaultTabBar, ScrollableTabBar } from 'react-native-scrollable-tab-view';

import { TabView, TabBar, SceneMap, PagerPan } from 'react-native-tab-view';
import { Dimensions } from 'react-native';

var _array;

var sceneMap;

export default class TabPageView extends Component {
  constructor(props) {
    super(props);

    var routes = new Array();
    props.titles.map((title, index) => {
      routes[index] = { key: index.toString(), title: title };
    });
    console.log(routes);
    console.log('11111');

    // var scenes = new Object();
    // props.titles.map((title, index) => {
    //   scenes[index.toString()] = title;
    // });
    // console.log(scenes);

    // console.log({
    //   'first': 'FirstRoute',
    //   'second': 'SecondRoute',
    // });

    // sceneMap = scenes;

    this.state = {
      index: 0,
      // routes: routes,
      routes: [
        { key: 'first', title: '全站' },
        { key: 'second', title: '社区管理' },
        { key: 'second1', title: '国内院校' },
        { key: 'second2', title: '休闲娱乐' },
        { key: 'second3', title: '五湖四海' },
        { key: 'second4', title: '游戏运动' },
        { key: 'second5', title: '社会信息' },
      ],
    }
  }

  render() {
    console.log('this.state.index' + this.state.index);

    const FirstRoute = () => (
      <View style={[{ backgroundColor: '#673ab7', flex: 1 }]} />
    );
    const SecondRoute = () => (
      <View style={[{ backgroundColor: '#673ab7', flex: 1 }]} />
    );
    const SecondRoute1 = () => (
      <NewHotListScreen />
    );
    const SecondRoute2 = () => (
      <View style={[{ backgroundColor: '#673ab7', flex: 1 }]} />
    );
    const SecondRoute3 = () => (
      <View style={[{ backgroundColor: '#673ab7', flex: 1 }]} />
    );
    const SecondRoute4 = () => (
      <View style={[{ backgroundColor: '#673ab7', flex: 1 }]} />
    );
    const SecondRoute5 = () => (
      <View style={[{ backgroundColor: '#673ab7', flex: 1 }]} />
    );

    // _renderScene = SceneMap({
    //   'first': FirstRoute,
    //   'second': SecondRoute,
    //   'second1': SecondRoute1,
    //   'second2': SecondRoute2,
    //   'second3': SecondRoute3,
    //   'second4': SecondRoute4,
    //   'second5': SecondRoute5,
    // });

    // var scenes = new Object();
    // this.props.titles.map((title, index) => {
    //   scenes[index.toString()] = title;
    // });
    scenes = {
        'first': FirstRoute,
        'second': SecondRoute,
        'second1': SecondRoute1,
        'second2': SecondRoute2,
        'second3': SecondRoute3,
        'second4': SecondRoute4,
        'second5': SecondRoute5,
      };
    _renderScene = SceneMap(scenes);

    _renderTabBar = props => (
      <TabBar scrollEnabled {...props}
        tabStyle={{ width: 86, height: 40 }}
        indicatorStyle={{ width: 20, marginLeft: 33 }}
        labelStyle={{ fontSize: global.configures.fontSize15 }} />
    );

    return (
      <TabView
        navigationState={this.state}
        renderScene={_renderScene}
        useNativeDriver
        renderTabBar={_renderTabBar}
        onIndexChange={index => { this.setState({ index }) }}
        initialLayout={{
          width: Dimensions.get('window').width,
          height: 0,
        }}
        style={{ marginTop: 0 }}
      />
    )
  }
}

var styles = {
  get container() {
    return {
      flex: 1,
      padding: 0,
      backgroundColor: global.colors.clearColor
    }
  },

}
