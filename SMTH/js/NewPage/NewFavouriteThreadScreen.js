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
  Dimensions,
  TouchableWithoutFeedback,
  DeviceEventEmitter
} from 'react-native';

import {
  NetworkManager,
  SeperatorLine,
  CellBackground,
  NavigatorTitleButton,
  ImageButton,
  LoadingView,
  Screen,
  ToastUtil,
  NavigationBar
} from '../config/Common';

var _dataArray;

export default class NewFavouriteThreadScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: '收藏',
    headerRight: navigation.state.params ? navigation.state.params.headerRight : null
  });

  constructor(props) {
    super(props);
    this.state = {
      pullLoading: false,
      viewLoading: true,
      loadingType: 'background',
      screenText: null,
      isDeleting: false,
      editing: false,
      dataArray: [],
      title: '编辑',
    }

  }


  render() {
    return (
      <Screen
        showLoading={this.state.viewLoading || this.state.isDeleting}
        loadingType={this.state.loadingType}
        text={this.state.screenText}
        onPress={() => {
          this.setState({
            viewLoading: true,
            loadingType: 'background',
            screenText: null
          });

        }}
      >
        <NavigationBar title='收藏' />
       

      </Screen >
    )
  }
}

var styles = {
  get container() {
    return {
      flexDirection: 'column',
      backgroundColor: global.colors.clearColor
    }
  },
  get content() {
    return {
      flexDirection: 'row',
      alignItems: 'center',
      height: 44,
      backgroundColor: global.colors.whiteColor
    }
  },
  get deleteButton() {
    return {
      marginLeft: 0,
      marginRight: -13
    }
  },
  get board() {
    return {
      marginLeft: 13,
      fontSize: global.configures.fontSize17,
      color: global.colors.fontColor,
      backgroundColor: global.colors.whiteColor,
    }
  },
  get arrow() {
    return {
      position: 'absolute',
      top: 13,
      right: 13,
      width: 10,
      height: 17,
    }
  },
  get rightView() {
    return {
      // backgroundColor: 'yellow',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      paddingLeft: 15,
      paddingTop: 5,
      paddingBottom: 15,
    }
  },
  get rightItemContainer() {
    return {
      height: 30,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
      marginTop: 10,
      paddingLeft: 10,
      paddingRight: 10,
      backgroundColor: '#F5F5F5',
      borderRadius: 4,
    }
  },
  get rightItemTitle() {
    return {
      fontSize: global.configures.fontSize15,
      color: global.colors.gray1Color,
    }
  },

}
