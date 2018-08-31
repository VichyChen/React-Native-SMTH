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
  NavigationBar,
  TabPageView,
  NewHotListScreen,
  LoginView
} from '../config/Common';

import AsyncStorageManger from '../storage/AsyncStorageManger';

export default class NewHotScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pullLoading: false,
      viewLoading: true,
      screenText: null,
      dataArray: [],
      showLogin: true,
    }

    DeviceEventEmitter.emit('LoginNotification', null);
  }

  componentDidMount() {
    // codePush.sync();
  }

  componentWillUnmount() {

  }

  render() {
    return (
      <View style={styles.container}>

        <NavigationBar title='热点' />

        <TabPageView
          titles={['全站', '社区管理', '国内院校', '休闲娱乐', '五湖四海', '游戏运动', '社会信息', '知性感性', '文化人文', '学术科学', '电脑技术']}
          pages={
            [
              (<NewHotListScreen navigation={this.props.navigation} section='' />),
              (<NewHotListScreen navigation={this.props.navigation} section='a0de82aa57b9c9d0eed752f60e8e215c' />),
              (<NewHotListScreen navigation={this.props.navigation} section='ad014fa45379dcd4c5d543dee2ffcb9e' />),
              (<NewHotListScreen navigation={this.props.navigation} section='710c5f8e5a5cb9825a7ba42431503290' />),
              (<NewHotListScreen navigation={this.props.navigation} section='725cba31613e9a65167c4c1bcea10995' />),
              (<NewHotListScreen navigation={this.props.navigation} section='01f3dd2e7d1c9c451282e382c29bc4ef' />),
              (<NewHotListScreen navigation={this.props.navigation} section='e884890123997afb871785804f801738' />),
              (<NewHotListScreen navigation={this.props.navigation} section='a0b1f3baa1d74b0a790e906a03c50067' />),
              (<NewHotListScreen navigation={this.props.navigation} section='7c9bc21c8bd8b0b4639a63000d7e9087' />),
              (<NewHotListScreen navigation={this.props.navigation} section='9a280091d78540fa4071f620dfa9652b' />),
              (<NewHotListScreen navigation={this.props.navigation} section='452bf2314855e55815c805d7c1995cae' />),
            ]}
        />
        <LoginView visible={this.state.showLogin} success={() => {
          this.setState({
            showLogin: false,
            viewLoading: true
          });
        }} />
      </View>
    )
  }
}

var styles = {
  get container() {
    return {
      flex: 1,
      backgroundColor: global.colors.whiteColor
    }
  },


}
