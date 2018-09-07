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
      showLogin: false,
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
              (<NewHotListScreen navigation={this.props.navigation} section='7fba65e45f678eb8c605d4107de04185' />),
              (<NewHotListScreen navigation={this.props.navigation} section='4fcab28694a0be93d9297d8cede052d9' />),
              (<NewHotListScreen navigation={this.props.navigation} section='3497e48bb537373d0f738b41fe53a41b' />),
              (<NewHotListScreen navigation={this.props.navigation} section='353fdfda1dfe7a714e592bab99c762cd' />),
              (<NewHotListScreen navigation={this.props.navigation} section='c8d614e56acb8a192ec4af8b375a5eea' />),
              (<NewHotListScreen navigation={this.props.navigation} section='5b634fdc9ecddf6042561c959176c077' />),
              (<NewHotListScreen navigation={this.props.navigation} section='1c455a5dccf4242008d188f9676e3f4e' />),
              (<NewHotListScreen navigation={this.props.navigation} section='12af235486fde6684e4b9e83f5d2b779' />),
              (<NewHotListScreen navigation={this.props.navigation} section='4ed7f0d8b621c8ccf9e11eca9991d6dc' />),
              (<NewHotListScreen navigation={this.props.navigation} section='4dda79c64b3ffb61f8048d745292ff5d' />),
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
