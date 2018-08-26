/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
} from 'react-native';

import { TabView, TabBar, SceneMap, PagerPan } from 'react-native-tab-view';
import { Dimensions } from 'react-native';

var _array;

export default class TabPageView extends Component {
  constructor(props) {
    super(props);

    _array = new Array();
    _array.push('0');

    var routes = new Array();
    props.titles.map((title, index) => {
      routes[index] = { key: index.toString(), title: title };
    });

    this.state = {
      index: 0,
      routes: routes,
    }
  }

  _renderScene = ({ route }) => {
    for ( var i = 0; i <this.props.pages.length; i++){
      if (route.key == i && (_array.indexOf(route.key) != -1)) {
        return this.props.pages[i];
      }
    }
  };

  _renderTabBar = props => (
    <TabBar scrollEnabled {...props}
      tabStyle={{ width: 86, height: 40 }}
      indicatorStyle={{ width: 20, marginLeft: 33 }}
      labelStyle={{ fontSize: global.configures.fontSize15 }} />
  );

  _onIndexChange = index => { 
    if (_array.indexOf(index) == -1) {
      _array.push(index.toString());
    }

    this.setState({ index })
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
