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
  DeviceEventEmitter
} from 'react-native';

import {
  NetworkManager,
  SectionBlankHeader,
  SeperatorLine,
  Button,
  CellBackground,
  PickerSelectView
} from '../config/Common';

import AsyncStorageManger from '../storage/AsyncStorageManger';

var maxFontSize = 20;
var minFontSize = 14;
var step = 1 / (maxFontSize - minFontSize);

export default class SettingScreen extends Component {
  static navigationOptions = {
    title: '设置',
  };

  constructor(props) {
    super(props);
    this.state = {
      selectPageSizeViewHidden: true,
      selectPageSize: global.configures.pageSize,
      pageSize: global.configures.pageSize,
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
      <ScrollView style={{ backgroundColor: global.colors.backgroundGrayColor }}>

        <SectionBlankHeader />

        <CellBackground
          onPress={() => {
            this.setState({
              selectPageSizeViewHidden: false,
            });
          }}
        >
          <View style={{ flexDirection: 'column', backgroundColor: global.colors.whiteColor }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 44, }}>
              <Text
                style={{
                  paddingLeft: 13,
                  paddingRight: 13,
                  fontSize: global.configures.fontSize17,
                  color: global.colors.fontColor,
                }}>
                帖子详情页每页回复数：
              </Text>
              <Image
                style={{
                  marginRight: 13,
                  width: 10,
                  height: 17,
                }}
                source={global.images.icon_forward_arrow} />
              <Text
                style={{
                  position: 'absolute',
                  top: 13,
                  right: 30,
                  fontSize: global.configures.fontSize17,
                  color: global.colors.fontColor,
                }}>
                {this.state.pageSize}
              </Text>
            </View>
          </View>
        </CellBackground>

        <SectionBlankHeader />

        <View style={{ backgroundColor: global.colors.whiteColor }}>
          <Text style={[{ fontSize: global.configures.fontSize17, color: global.colors.fontColor, marginLeft: 13, marginTop: 13 }]} >字体大小：</Text>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', width: global.constants.SCREEN_WIDTH, height: 60, }}>
            <Text style={[{
              fontSize: this.state.fontSizeValue,
              textAlign: 'center',
              marginLeft: 13,
              width: global.constants.SCREEN_WIDTH - 26,
              color: global.colors.fontColor
            }]}>
              拖动滑动条调整字体大小。
          </Text>
          </View>

          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', width: global.constants.SCREEN_WIDTH, height: 44, }}>
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

        <Button onPress={() => {
          AsyncStorageManger.setAccessToken('');
          // AsyncStorageManger.setUsernamePassword('', '');
          this.props.navigation.goBack();
          global.current.username = '';
          DeviceEventEmitter.emit('LoginNotification', null);
        }} text='退出' />

        <PickerSelectView
          hidden={this.state.selectPageSizeViewHidden}
          array={[10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
          selectedValue={this.state.selectPageSize}
          onCancelClick={() => {
            this.setState({
              selectPageSizeViewHidden: true,
            });
          }}
          onCompleteClick={(pageSize) => {
            this.setState({
              selectPageSizeViewHidden: true,
              pageSize: pageSize,
            });

            AsyncStorageManger.set(global.storageKeys.pageSize, (pageSize));
            DeviceEventEmitter.emit('RefreshConfigureNotification', null);
          }}
          onValueChange={(pageSize) => {
            this.setState({
              selectPageSize: pageSize,
            });
          }}
        />
      </ScrollView>
    );
  }
}

var styles = {
  get slider() {
    return {
      width: global.constants.SCREEN_WIDTH - 100,
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
}
