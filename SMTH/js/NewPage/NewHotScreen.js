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
  NewLoginView
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

    this.loginNotification = DeviceEventEmitter.addListener('LoginNotification', () => {
      this.setState({
        showLogin: true,
      });
    });
  }

  componentDidMount() {
    // codePush.sync();
  }

  componentWillUnmount() {

  }

  render() {
    var titles = [];
    var pages = [];
    titles.push('全站');
    pages.push((<NewHotListScreen navigation={this.props.navigation} section={''} />));
    if (global.current.sectionArray != null) {
      global.current.sectionArray.map((item) => {
        titles.push(item.title);
        pages.push((<NewHotListScreen navigation={this.props.navigation} section={item.key} />));
      });
    }
    else {
      global.configures.sections.map((item) => {
        titles.push(item.title);
        pages.push((<NewHotListScreen navigation={this.props.navigation} section={item.key} />));
      });
    }

    return (
      <View style={styles.container}>
        <NavigationBar title='热点' />
        <TabPageView titles={titles} pages={pages} />
        <NewLoginView visible={this.state.showLogin} success={() => {
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
