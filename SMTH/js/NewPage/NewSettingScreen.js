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
  TouchableWithoutFeedback,
  Slider,
  DeviceEventEmitter,
  StatusBar
} from 'react-native';

import {
  NetworkManager,
  SectionBlankHeader,
  SeperatorLine,
  Button,
  CellBackground,
  PickerSelectView,
  NavigationBar,
  ReactNavigation
} from '../config/Common';

import AsyncStorageManger from '../storage/AsyncStorageManger';
import Cookie from 'react-native-cookie';
import { NativeModules } from 'react-native';
import LoginManager from '../util/LoginManager';

var maxFontSize = 20;
var minFontSize = 14;
var step = 1 / (maxFontSize - minFontSize);

export default class NewSettingScreen extends Component {
  static navigationOptions = {
    title: '设置',
  };

  constructor(props) {
    super(props);
    this.state = {
      fontSizeValue: global.configures.currentFontSize,
      fontSizeSlideValue: (global.configures.currentFontSize - minFontSize) * step,
    }

    DeviceEventEmitter.emit('RefreshConfigureNotification', null);
  }

  componentWillUnmount() {
    DeviceEventEmitter.emit('RefreshViewNotification', null);
  }

  render() {
    return (
      <View style={{ flex: 1 }}>

        <NavigationBar title='设置' showBackButton={true} navigation={this.props.navigation} />

        <ScrollView style={{ backgroundColor: global.colors.backgroundGrayColor }}>

          <View style={styles.rowView}>
            <Text style={styles.leftText} >更多的设置内容正在开发中...敬请期待</Text>
          </View>

          <SectionBlankHeader />

          <CellBackground onPress={() => {
            if (global.login == true) {
              ReactNavigation.navigate(this.props.navigation, 'newMessageSendScreen', { user: 'VichyChen' })
            }
            else {
              DeviceEventEmitter.emit('LoginNotification', null);
            }
          }} >
            <View style={styles.rowView}>
              <Text style={styles.leftText} >意见建议，Bug反馈</Text>
              <Image style={styles.rightArrow} source={global.images.icon_right_arrow} />
            </View>
          </CellBackground>

          <SeperatorLine />

          <CellBackground onPress={() => {
            var shareManager = NativeModules.ShareManager;
            shareManager.share('天天水木 - 水木社区客户端', 'https://itunes.apple.com/us/app/t%E6%B0%B4%E6%9C%A8/id1330286243?l=zh&ls=1&mt=8');
          }} >
            <View style={styles.rowView}>
              <Text style={styles.leftText} >分享天天水木</Text>
              <Image style={styles.rightArrow} source={global.images.icon_right_arrow} />
            </View>
          </CellBackground>

          <SectionBlankHeader />


          {/* 字体大小 
          <View style={{ backgroundColor: global.colors.whiteColor }}>
            <Text style={[{ fontSize: global.configures.fontSize17, color: global.colors.fontColor, marginLeft: 13, marginTop: 13 }]} >字体大小：</Text>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', width: global.constants.ScreenWidth, height: 60, }}>
              <Text style={[{
                fontSize: this.state.fontSizeValue,
                textAlign: 'center',
                marginLeft: 13,
                width: global.constants.ScreenWidth - 26,
                color: global.colors.fontColor
              }]}>
                拖动滑动条调整字体大小。
          </Text>
            </View>

            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', width: global.constants.ScreenWidth, height: 44, }}>
              <Text style={[styles.silderHorizonText, { fontSize: minFontSize, }]} >A</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={1}
                step={step}
                minimumTrackTintColor={global.colors.gray3Color}
                maximumTrackTintColor={global.colors.gray3Color}
                value={this.state.fontSizeSlideValue}
                onValueChange={(value) => {
                  AsyncStorageManger.set(global.storageKeys.fontSize, (parseInt(value / step + minFontSize)).toString());
                  DeviceEventEmitter.emit('RefreshConfigureNotification', null);
                  setTimeout(() => {
                    this.setState({
                      fontSizeSlideValue: value,
                      fontSizeValue: parseInt(value / step + minFontSize)
                    });
                  }, 50);
                }}
              />
              <Text style={[styles.silderHorizonText, { fontSize: maxFontSize }]} >A</Text>
            </View>
          </View>

          <SectionBlankHeader />
*/}

          {/* 退出 */}
          {
            global.login == true
              ?
              <Button onPress={() => {
               
                LoginManager.logout();
                LoginManager.postNewSMTHLogout();
                
                this.props.navigation.goBack();
              }} text='退出登录' />
              :
              null
          }



        </ScrollView>
      </View>

    );
  }
}

var styles = {
  get slider() {
    return {
      width: global.constants.ScreenWidth - 100,
      height: 44,
    }
  },
  get silderHorizonText() {
    return {
      width: 50,
      textAlign: 'center',
      color: global.colors.fontColor,
    }
  },
  get rowView() {
    return {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: 50,
      backgroundColor: global.colors.whiteColor,
    }
  },
  get leftText() {
    return {
      marginLeft: global.constants.Padding,
      fontSize: global.configures.fontSize16,
      color: global.colors.fontColor,
    }
  },
  get rightArrow() {
    return {
      marginRight: global.constants.Padding,
      width: 10,
      height: 15,
    }
  },
}
