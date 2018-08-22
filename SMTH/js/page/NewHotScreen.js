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
  AvatorImage
} from '../config/Common';

import AsyncStorageManger from '../storage/AsyncStorageManger';

import Tabs from 'antd-mobile/lib/tabs';
import ScrollableTabView, {DefaultTabBar, ScrollableTabBar} from 'react-native-scrollable-tab-view';

import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import { Dimensions } from 'react-native';

var _array;

const FirstRoute = () => (
  <View style={[{ backgroundColor: '#ff4081', flex: 1 }]} />
);

const SecondRoute = () => (
  <View style={[{ backgroundColor: '#673ab7', flex: 1 }]} />
);

const SecondRoute1 = () => (
  <View style={[{ backgroundColor: '#673ab7', flex: 1 }]} />
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
      index: 0,
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

  _renderHeader = ({ section }) => (
    <View>
      <SectionHeader title={section.key} />
    </View>
  );

  _renderItem = ({ item }) => (
    <CellBackground
      onPress={() => {
        this.props.navigation.navigate('threadDetail', { id: item.id, board: item.board, subject: item.subject })
      }}
    >
      <View style={styles.container}>
        <Text style={styles.subject}>{item.subject + '(' + item.count + ')'}</Text>
        <View style={styles.other}>
          <Text style={styles.board}>{item.boardName == null ? item.board : item.boardName}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.author}>{item.author_id}</Text>
        </View>

        {/* <View style={{ flexDirection: 'row', padding: 13, backgroundColor: global.colors.whiteColor }}>
          <AvatorImage
            style={styles.avator}
            borderRadius={20}
            widthAndHeight={40}
            onPressClick={() => {
              this.props.navigation.navigate('userScreen', { id: item.author_id });
            }}
            uri={NetworkManager.net_getFace(item.author_id)} />
          <View>
            <Text style={styles.author}>{item.author_id}</Text>
            <Text style={styles.time}>{DateUtil.formatTimeStamp(item.time) + '     ' + item.count + '回复'}</Text>
          </View>
          <Text style={styles.board}>{unescape(item.board)}</Text>
        </View>
        <Text style={styles.subject}>{item.subject}</Text> */}


        <SeperatorLine />
      </View>
    </CellBackground>
  );


  _renderTabBar = props => <TabBar scrollEnabled {...props} 
  tabStyle={{width:86, height:40}} 
  indicatorStyle={{width:20, marginLeft:33}} 
  labelStyle={{fontSize:global.configures.fontSize15}}/>;

  _renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    second1: SecondRoute1,
    second2: SecondRoute2,
    second3: SecondRoute3,
    second4: SecondRoute4,
    second5: SecondRoute5,
  });

  render() {
  
    return (
    
      <TabView
        navigationState={this.state}
        renderScene={this._renderScene}
        renderTabBar={this._renderTabBar}
        onIndexChange={ index => { this.setState({ index }) } }
        initialLayout={{
          width: Dimensions.get('window').width,
          height: 0,
        }}
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
