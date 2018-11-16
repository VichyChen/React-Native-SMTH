/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  Text,
  DeviceEventEmitter
} from 'react-native';

import { TabView, TabBar, SceneMap, PagerPan } from 'react-native-tab-view';
import { Dimensions } from 'react-native';

var _array;
var routes;

export default class TabPageView extends Component {
  constructor(props) {
    super(props);

    _array = new Array();
    _array.push(this.props.selectedIndex == null ? '0' : this.props.selectedIndex.toString());

    routes = new Array();
    props.titles.map((title, index) => {
      routes[index] = { key: index.toString(), title: title };
    });

    this.state = {
      index: this.props.selectedIndex == null ? 0 : this.props.selectedIndex,
      routes: routes,
    }
  }

  _renderScene = ({ route }) => {
    for (var i = 0; i < this.props.pages.length; i++) {
      if (route.key == i && (_array.indexOf(route.key) != -1)) {
        return this.props.pages[i];
      }
    }
  };

  _renderTabBar = props => {
    var tabWidth = this.props.titles.length > 5 ? 88 : global.constants.ScreenWidth / this.props.titles.length;
    var tabHeight = 40;
    var indicatorWidth = 16;
    var indicatorHeight = 2;
    var indicatorMarginLeft = (tabWidth - indicatorWidth) / 2;
    return (
      <TabBar scrollEnabled {...props}
        tabStyle={{ width: tabWidth, height: tabHeight }}
        indicatorStyle={{ width: indicatorWidth, height: indicatorHeight, marginLeft: indicatorMarginLeft, backgroundColor: global.colors.themeColor }}
        style={{ backgroundColor: 'white', }}
        renderLabel={this._renderLabel}
      />
    )
  };

  _renderLabel = ({ route }) => {
    var selected = route.key == this.state.index ? true : false;
    return (
      <View>
        <Text style={{
          fontSize: global.configures.fontSize15,
          fontWeight: selected ? 'bold' : 'normal',
          color: selected ? global.colors.themeColor : global.colors.gray1Color,
        }}>
          {route.title}
        </Text>
      </View>
    );
  };

  _onIndexChange = index => {
    if (_array.indexOf(index) == -1) {
      _array.push(index.toString());
    }

    this.setState({ index })

    if (this.props.notification != null) {
      DeviceEventEmitter.emit(this.props.notification, index);
    }
  };

  render() {
    return (
      <TabView
        navigationState={this.state}
        renderScene={this._renderScene}
        renderTabBar={this._renderTabBar}
        onIndexChange={this._onIndexChange}
        initialLayout={{
          width: Dimensions.get('window').width,
          height: 0,
        }}
        useNativeDriver
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
