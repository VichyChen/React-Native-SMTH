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
import SegmentedControl from 'antd-mobile/lib/segmented-control';

import {
  NavigationBar,
  TabPageView,
  NewHotListScreen,
  NewLoginView,
  NewTopTenScreen,
  NewPictureListScreen
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
      selectedIndex: 0,
    }

    this.loginNotification = DeviceEventEmitter.addListener('LoginNotification', () => {
      this.setState({
        showLogin: true,
      });
    });
    this.loginSuccessNotification = DeviceEventEmitter.addListener('LoginSuccessNotification', () => {
      this.setState({
        showLogin: false,
        viewLoading: true
      });
    });
  }

  componentDidMount() {
    // codePush.sync();
  }

  componentWillUpdate() {
    // StatusBar.setBarStyle('dark-content');
  }

  componentWillUnmount() {
    this.loginNotification.remove();
    this.loginSuccessNotification.remove();
  }

  render() {
    var titles = [];
    var pages = [];
    titles.push('全站');
    pages.push((<NewHotListScreen navigation={this.props.navigation} section={''} />));
    if (global.current.sectionArray != null) {
      global.current.sectionArray.map((item) => {
        titles.push(item.title);
        pages.push((<NewHotListScreen navigation={this.props.navigation} section={item.id} />));
      });
    }
    else {
      global.configures.sections.map((item) => {
        titles.push(item.title);
        pages.push((<NewHotListScreen navigation={this.props.navigation} section={item.id} />));
      });
    }

    return (
      <View style={styles.container}>
        {/* <NavigationBar title='热点' showBottomLine={false} > */}
        <NavigationBar showBottomLine={false} >
          <SegmentedControl
            values={['热点', '十大', '图览']}
            tintColor={global.colors.themeColor}
            style={{ height: 26, width: 180 }}
            selectedIndex={this.state.selectedIndex}
            onChange={(e) => {
              this.setState({
                selectedIndex: e.nativeEvent.selectedSegmentIndex,
              });
              this.refs.scrollView.scrollTo({ x: e.nativeEvent.selectedSegmentIndex * global.constants.ScreenWidth, y: 0, animated: false });
            }}
          />
        </NavigationBar>
        <ScrollView
          ref="scrollView"
          style={styles.scrollView}
          horizontal={true}
          bounces={false}
          scrollEnabled={false}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
        >
          <View style={styles.page}>
            <TabPageView titles={titles} pages={pages} />
          </View>
          <View style={styles.page}>
            <NewTopTenScreen navigation={this.props.navigation} />
          </View>
          <View style={styles.page}>
            <NewPictureListScreen navigation={this.props.navigation} />
          </View>
        </ScrollView>
        <NewLoginView visible={this.state.showLogin} />
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
  get scrollView() {
    return {
      flex: 1,
      width: global.constants.ScreenWidth,
      height: global.constants.ScreenHeight - global.constants.NavigationBarHeight - global.constants.TabBarHeight,
      backgroundColor: global.colors.whiteColor
    }
  },
  get page() {
    return {
      width: global.constants.ScreenWidth,
      height: global.constants.ScreenHeight - global.constants.NavigationBarHeight - global.constants.TabBarHeight,
    }
  },
}
