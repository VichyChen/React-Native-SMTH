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
  DeviceEventEmitter
} from 'react-native';

import cio from 'cheerio-without-node-native';

import {
  NetworkManager,
  NavigatorTitleButton,
  SeperatorLine,
  BoardItems,
  ImageButton,
  LoadingView,
  Screen,
  ToastUtil
} from '../config/Common';

export default class BoardScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params == undefined ? '版块' : navigation.state.params.text}`,
    headerRight: (
      <View style={{ flexDirection: 'row' }}>
        <ImageButton
          color={global.colors.whiteColor}
          width={44}
          height={44}
          margin={22}
          source={global.images.icon_search}
          onPress={() => {
            navigation.navigate('searchBoardScreen', { id: '' })
          }} />
      </View>
    ),
  });

  constructor(props) {
    super(props);
    this.state = {
      pullLoading: false,
      viewLoading: true,
      loadingType: 'background',
      screenText: null,
      dataArray: [],
    }

    this.refreshViewNotification = DeviceEventEmitter.addListener('RefreshViewNotification', () => {
      this.setState({});
    });

    this.getSection();
  }

  componentWillUnmount() {
    this.refreshViewNotification.remove();
  }

  getSection() {
    NetworkManager.getSection(this.props.navigation.state.params == undefined ? '' : this.props.navigation.state.params.id, (result) => {
      this.$ = cio.load(result);
      this.$ = cio.load(this.$('ul').html());
      var array = [];
      this.$('li').each(function (i, elem) {
        //目录
        if (elem.children[0].type == 'tag') {
          array.push({
            typeText: elem.children[0].children[0].data,
            type: elem.children[0].next.next.attribs.href.split('/')[1],
            href: elem.children[0].next.next.attribs.href,
            id: elem.children[0].next.next.attribs.href.split('/')[2],
            text: elem.children[0].next.next.children[0].data
          });
        }
        //版面
        else {
          array.push({
            typeText: elem.children[0].data,
            type: elem.children[0].next.next.prev.attribs.href.split('/')[1],
            href: elem.children[0].next.attribs.href,
            id: elem.children[0].next.next.prev.attribs.href.split('/')[2],
            text: elem.children[0].next.children[0].data
          });
        }
      });

      if (array.length == 0) {
        if (this.state.viewLoading == true) {
          this.setState({
            pullLoading: false,
            viewLoading: false,
            screenText: '网络请求出错，请点击重试',
          });
        }
        else {
          this.setState({
            pullLoading: false,
            viewLoading: false,
            screenText: null
          });
        }
      }
      else {
        for (var i = 0; i < array.length; i++) {
          array[i].key = i;
        }
        this.setState({
          dataArray: array,
          pullLoading: false,
          viewLoading: false,
          screenText: null
        });
      }

    }, (error) => {
      if (this.state.viewLoading == true) {
        this.setState({
          pullLoading: false,
          viewLoading: false,
          screenText: error
        });
      }
      else {
        ToastUtil.info(error.message);
        this.setState({
          pullLoading: false,
          viewLoading: false,
          screenText: null
        });
      }
    }, (errorMessage) => {
      if (this.state.viewLoading == true) {
        this.setState({
          pullLoading: false,
          viewLoading: false,
          screenText: errorMessage + '，请点击重试'
        });
      }
      else {
        ToastUtil.info(errorMessage);
        this.setState({
          pullLoading: false,
          viewLoading: false,
          screenText: null
        });
      }
    });
  }

  _renderItem = ({ item }) => {
    return (
      <BoardItems text={item.text} type={item.type == 'section' ? '目录' : '版面'} onPress={() => {
        if (item.type == 'board') {
          this.props.navigation.navigate('boardListScreen', { id: item.id, text: item.text })
        } else {
          this.props.navigation.navigate('boardScreen', { id: item.id, text: item.text })
        }
      }}
      />
    )
  };

  render() {
    return (
      <Screen
        showLoading={this.state.viewLoading}
        loadingType={this.state.loadingType}
        text={this.state.screenText}
        onPress={() => {
          this.setState({
            viewLoading: true,
            loadingType: 'background',
            screenText: null
          });
          this.getSection();
        }}
      >
        <FlatList
          data={this.state.dataArray}
          renderItem={this._renderItem}
          removeClippedSubviews={false}
          extraData={this.state}
          style={{
            backgroundColor: global.colors.backgroundGrayColor,
            height: global.constants.ScreenHeight - 64 - (this.props.navigation.state.params == undefined ? 48 : 0)
          }}
          onRefresh={() => {
            this.setState({
              pullLoading: true
            });
            this.getSection();
          }
          }
          refreshing={this.state.pullLoading}
        />
      </Screen>
    )
  }
}
