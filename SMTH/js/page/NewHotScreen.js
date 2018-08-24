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
  TabPageView,
  NewHotListScreen
} from '../config/Common';

import AsyncStorageManger from '../storage/AsyncStorageManger';


var _array;

export default class NewHotScreen extends Component {
  static navigationOptions = {
    title: '热门',
  };

  constructor(props) {
    super(props);
    this.state = {
      pullLoading: false,
      viewLoading: true,
      screenText: null,
      dataArray: [],
      showLogin: false,
    }

    _array = [
      { 'index': '0', 'key': '本日十大热门话题', 'data': [] },
      { 'index': '1', 'key': '社区管理', 'data': [] },
      { 'index': '2', 'key': '国内院校', 'data': [] },
      { 'index': '3', 'key': '休闲娱乐', 'data': [] },
      { 'index': '4', 'key': '五湖四海', 'data': [] },
      { 'index': '5', 'key': '游戏运动', 'data': [] },
      { 'index': '6', 'key': '社会信息', 'data': [] },
      { 'index': '7', 'key': '知性感性', 'data': [] },
      { 'index': '8', 'key': '文化人文', 'data': [] },
      { 'index': '9', 'key': '学术科学', 'data': [] },
      { 'index': '10', 'key': '电脑技术', 'data': [] },
    ];

    this.loginNotification = DeviceEventEmitter.addListener('LoginNotification', () => {
      AsyncStorageManger.setAccessToken('');
      this.setState({
        showLogin: true,
      });
    });

    this.refreshViewNotification = DeviceEventEmitter.addListener('RefreshViewNotification', () => {
      this.setState({});
    });

    AsyncStorageManger.getAccessToken().then((value) => {
      if (value.length == 0) {
        this.setState({
          showLogin: true,
        });
      }
      else {
        AsyncStorageManger.getUsername().then((username) => {
          AsyncStorageManger.getPassword().then((password) => {

            if (username.length == 0 || password.length == 0) {
              this.setState({
                showLogin: true,
              });
            } else {
              NetworkManager.login(username, password, () => {
                this.net_LoadSectionHot();
              }, (error) => {
                this.setState({
                  pullLoading: false,
                  viewLoading: false,
                  screenText: error
                });
                DeviceEventEmitter.emit('LoginNotification', null);
              }, (errorMessage) => {
                this.setState({
                  pullLoading: false,
                  viewLoading: false,
                  screenText: errorMessage + '，请点击重试'
                });
              });
            }

          });
        });
      }
    });
  }

  componentDidMount() {
    codePush.sync();
  }

  componentWillUnmount() {
    this.loginNotification.remove();
    this.refreshViewNotification.remove();
  }

  net_LoadSectionHot() {
    NetworkManager.net_LoadSectionHot(0, (result) => {
      for (var i = 0; i < result['threads'].length; i++) {
        result['threads'][i].key = i;
        result['threads'][i].board = unescape(result['threads'][i].board);
        result['threads'][i].boardName = global.configures.boards[result['threads'][i].board];
      }

      _array[0].data = result['threads'];
      this.setState({
        dataArray: _array,
        pullLoading: false,
        viewLoading: false,
        screenText: null
      });

      for (var j = 1; j < 11; j++) {
        this.loadMore(j);
      }
    }, (error) => {
      if (this.state.viewLoading == true) {
        this.setState({
          pullLoading: false,
          viewLoading: false,
          screenText: error
        });
      }
      else {
        ToastUtil.info(error);
        this.setState({
          pullLoading: false,
          viewLoading: false,
          screenText: null
        });
      }
    }, (errorMessage) => {
      if (this.state.viewLoading == true) {
        this.setState({
          pullLoading: false,
          viewLoading: false,
          screenText: errorMessage + '，请点击重试'
        });
      }
      else {
        ToastUtil.info(errorMessage);
        this.setState({
          pullLoading: false,
          viewLoading: false,
          screenText: null
        });
      }
    });
  }

  loadMore(index) {
    NetworkManager.net_LoadSectionHot(index, (result) => {
      for (var k = 0; k < result['threads'].length; k++) {
        result['threads'][k].key = k;
        result['threads'][k].board = unescape(result['threads'][k].board);
        result['threads'][k].boardName = global.configures.boards[result['threads'][k].board];
      }
      _array[index].data = result['threads'];
      this.setState({
        dataArray: _array,
      });
    }, (error) => {
    }, (timeout) => {
    });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>

        <NavigationBar title='热点' />

        <TabPageView
          titles={['全站', '社区管理', '国内院校', '休闲娱乐', '五湖四海', '游戏运动', '社会信息', '知性感性', '文化人文', '学术科学', '电脑技术']}
          pages={[
            (<View style={[{ backgroundColor: 'blue', flex: 1 }]} />),
            (<View style={[{ backgroundColor: 'red', flex: 1 }]} />),
            (<NewHotListScreen />),
            (<View style={[{ backgroundColor: 'green', flex: 1 }]} />),
            (<View style={[{ backgroundColor: 'black', flex: 1 }]} />),
            (<View style={[{ backgroundColor: 'blue', flex: 1 }]} />),
            (<View style={[{ backgroundColor: 'red', flex: 1 }]} />),
            (<View style={[{ backgroundColor: 'green', flex: 1 }]} />),
            (<View style={[{ backgroundColor: 'black', flex: 1 }]} />),
            (<View style={[{ backgroundColor: 'blue', flex: 1 }]} />),
            (<View style={[{ backgroundColor: 'red', flex: 1 }]} />),
          ]}
        />
      </View>
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
  get subject() {
    return {
      paddingLeft: 13,
      paddingRight: 13,
      paddingTop: 13,
      fontSize: global.configures.fontSize17,
      color: global.colors.fontColor,
      backgroundColor: global.colors.whiteColor
    }
  },
  get other() {
    return {
      flexDirection: 'row',
      padding: 13,
      backgroundColor: global.colors.whiteColor
    }
  },
  // board: {
  //   position: 'absolute',
  //   top: 13,
  //   right: 13,
  //   paddingTop: 3,
  //   paddingBottom: 3,
  //   paddingLeft: 5,
  //   paddingRight: 5,
  //   fontSize: global.configures.fontSize15,
  //   color: global.colors.gray2Color,
  //   backgroundColor: global.colors.backgroundGrayColor,
  //   borderRadius: 10,
  // },
  get board() {
    return {
      paddingTop: 3,
      paddingBottom: 3,
      paddingLeft: 5,
      paddingRight: 5,
      fontSize: global.configures.fontSize15,
      color: global.colors.gray2Color,
      backgroundColor: global.colors.backgroundGrayColor,
      borderRadius: 10,
    }
  },
  get avator() {
    return {
      width: 40,
      height: 40,
    }
  },
  // author: {
  //   marginLeft: 10,
  //   fontSize: global.configures.fontSize17,
  //   height: 20,
  //   color: global.colors.fontColor,
  // },
  get author() {
    return {
      fontSize: global.configures.fontSize15,
      paddingTop: 3,
      height: 20,
      color: global.colors.gray2Color,
    }
  },
  get time() {
    return {
      marginLeft: 10,
      marginTop: 4,
      height: 20,
      fontSize: global.configures.fontSize15,
      color: global.colors.gray2Color,
    }
  },
  get dot() {
    return {
      paddingTop: 3,
      paddingLeft: 5,
      paddingRight: 5,
      fontSize: global.configures.fontSize14,
      color: global.colors.gray2Color,
      backgroundColor: global.colors.whiteColor

    }
  },
  get countView() {
    return {
      flexDirection: 'row',
      position: 'absolute',
      top: 15,
      right: 12
    }
  },
  get countImage() {
    return {
      width: 14,
      height: 14,
      marginTop: 2,
      marginRight: 3,
      tintColor: global.colors.gray2Color
    }
  },
  get count() {
    return {
      fontSize: global.configures.fontSize15,
      color: global.colors.gray2Color,
    }
  },
}
