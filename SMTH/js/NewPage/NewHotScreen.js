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
  DeviceEventEmitter,
  StatusBar
} from 'react-native';

import SegmentedControl from 'antd-mobile/lib/segmented-control';

import {
  NavigationBar,
  TabPageView,
  NewHotListScreen,
  NewLoginView,
  NewTopTenScreen,
  NewPictureListScreen,
  ReactNavigation
} from '../config/Common';

import AsyncStorageManger from '../storage/AsyncStorageManger';

export default class NewHotScreen extends Component {

  _catchArray = [0];
  _tabSelectedIndex = 0;

  constructor(props) {
    super(props);
    this.state = {
      pullLoading: false,
      viewLoading: true,
      screenText: null,
      dataArray: [],
      showLogin: false,
      closeCallback: null,
      selectedIndex: 0,
    }

    this.loginNotification = DeviceEventEmitter.addListener('LoginNotification', (closeCallback) => {
      this.setState({
        showLogin: true,
        closeCallback: closeCallback,
      });
    });
    this.loginSuccessNotification = DeviceEventEmitter.addListener('LoginSuccessNotification', () => {
      this.setState({
        showLogin: false,
        viewLoading: true
      });
    });
    this.loginCloseNotification = DeviceEventEmitter.addListener('LoginCloseNotification', () => {
      this.setState({
        showLogin: false,
      });
    });
    this.doubleClickHotScreenNotification = DeviceEventEmitter.addListener('DoubleClickHotScreenNotification', () => {
      if (this.state.selectedIndex == 1) {
        setTimeout(() => {
          DeviceEventEmitter.emit('NewHotListScreenRefreshNotification', this._tabSelectedIndex);
        }, 50);
      }
    });
    this.newHotListScreenRefreshNotification = DeviceEventEmitter.addListener('NewHotScreenNotification', (index) => {
      this._tabSelectedIndex = index;
    });
  }

  componentDidMount() {
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      StatusBar.setBarStyle('dark-content');
    });
  }

  componentWillUnmount() {
    this.loginNotification.remove();
    this.loginSuccessNotification.remove();
    this.doubleClickHotScreenNotification.remove();
    this.newHotListScreenRefreshNotification.remove();

    this._navListener.remove();
  }

  render() {
    var titles = [];
    var pages = [];
    titles.push('全站');
    pages.push((<NewHotListScreen navigation={this.props.navigation} section={''} index={0} />));
    if (global.current.sectionArray != null) {
      global.current.sectionArray.map((item) => {
        titles.push(item.title);
        pages.push((<NewHotListScreen navigation={this.props.navigation} section={item.id} index={1 + item.key} />));
      });
    }
    else {
      global.configures.sections.map((item) => {
        titles.push(item.title);
        pages.push((<NewHotListScreen navigation={this.props.navigation} section={item.id} index={1 + item.key} />));
      });
    }

    return (
      <View style={styles.container}>

        <NavigationBar
          showBottomLine={false}
          rightButtonImage={global.images.icon_search}
          rightButtonImageMargin={22}
          rightButtonTintColor={global.colors.themeColor}
          rightButtonOnPress={() => {
            ReactNavigation.navigate(this.props.navigation, 'newSearchScreen', { index: 0 });
          }}
        >
          <SegmentedControl
            values={['十大', '热点', '图览']}
            tintColor={global.colors.themeColor}
            style={{ height: 26, width: 180 }}
            selectedIndex={this.state.selectedIndex}
            onChange={(e) => {
              if (this._catchArray.indexOf(e.nativeEvent.selectedSegmentIndex) == -1) {
                this._catchArray.push(e.nativeEvent.selectedSegmentIndex);
              }
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
          scrollEnabled={true}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          onScroll={event => {
            var selectedIndex = Math.floor((event.nativeEvent.contentOffset.x - global.constants.ScreenWidth / 2) / global.constants.ScreenWidth) + 1;
            if (this._catchArray.indexOf(selectedIndex) == -1) {
              this._catchArray.push(selectedIndex);
            }
            this.setState({
              selectedIndex: selectedIndex,
            });
          }}
        >
          <View style={styles.page}>
            <NewTopTenScreen navigation={this.props.navigation} selected={this.state.selectedIndex == 0 ? true : false} />
          </View>
          <View style={styles.page}>
            {
              this._catchArray.indexOf(1) == -1 ? null :
                <TabPageView titles={['全站', '社区管理', '国内院校', '休闲娱乐', '五湖四海', '游戏运动', '社会信息', '知性感性', '文化人文', '学术科学', '电脑技术']}
                  pages={[
                    (<NewHotListScreen navigation={this.props.navigation} section={''} index={0} />),
                    (<NewHotListScreen navigation={this.props.navigation} section={'7fba65e45f678eb8c605d4107de04185'} index={1} />),
                    (<NewHotListScreen navigation={this.props.navigation} section={'4fcab28694a0be93d9297d8cede052d9'} index={2} />),
                    (<NewHotListScreen navigation={this.props.navigation} section={'3497e48bb537373d0f738b41fe53a41b'} index={3} />),
                    (<NewHotListScreen navigation={this.props.navigation} section={'353fdfda1dfe7a714e592bab99c762cd'} index={4} />),
                    (<NewHotListScreen navigation={this.props.navigation} section={'c8d614e56acb8a192ec4af8b375a5eea'} index={5} />),
                    (<NewHotListScreen navigation={this.props.navigation} section={'5b634fdc9ecddf6042561c959176c077'} index={6} />),
                    (<NewHotListScreen navigation={this.props.navigation} section={'1c455a5dccf4242008d188f9676e3f4e'} index={7} />),
                    (<NewHotListScreen navigation={this.props.navigation} section={'12af235486fde6684e4b9e83f5d2b779'} index={8} />),
                    (<NewHotListScreen navigation={this.props.navigation} section={'4ed7f0d8b621c8ccf9e11eca9991d6dc'} index={9} />),
                    (<NewHotListScreen navigation={this.props.navigation} section={'4dda79c64b3ffb61f8048d745292ff5d'} index={10} />),
                  ]}
                  notification={'NewHotScreenNotification'} />
            }
          </View>
          <View style={styles.page}>
            {
              this._catchArray.indexOf(2) == -1 ? null : <NewPictureListScreen navigation={this.props.navigation} selected={this.state.selectedIndex == 2 ? true : false} />
            }
          </View>
        </ScrollView>
        {
          this.state.showLogin == false ? null : (
            <NewLoginView visible={true} closeCallback={this.state.closeCallback} />
          )
        }
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
