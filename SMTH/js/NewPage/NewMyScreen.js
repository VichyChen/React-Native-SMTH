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
  DeviceEventEmitter,
  Dimensions
} from 'react-native';

import {
  NetworkManager,
  AvatorImage,
  SectionBlankHeader,
  CellBackground,
  SeperatorLine,
  NavigationBar
} from '../config/Common';

import AsyncStorageManger from '../storage/AsyncStorageManger';
import { NativeModules } from 'react-native';

var mailCount;
var sentMailCount;
var replyMeCount;
var atMeCount;

export default class NewMyScreen extends Component {
  static navigationOptions = {
    title: '我的',
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dataArray: [],
      username: '',
      notificationCount: 0,
    }

    mailCount = 0;
    sentMailCount = 0;
    replyMeCount = 0;
    atMeCount = 0;

    this.subscription1 = DeviceEventEmitter.addListener('LoginSuccessNotification', (username) => {
      this.setState({
        username: username,
        notificationCount: 0,
      });
      this.network();
    });
    this.subscription2 = DeviceEventEmitter.addListener('LogoutNotification', () => {

    });
    this.subscription3 = DeviceEventEmitter.addListener('ClickMyScreenNotification', () => {
      this.network();
    });

    this.refreshViewNotification = DeviceEventEmitter.addListener('RefreshViewNotification', () => {
      this.setState({});
    });

    AsyncStorageManger.getUsername().then(username => {
      this.setState({
        username: username,
      });
    });
    this.network();
  }

  network() {
    NetworkManager.net_GetMailCount((result) => {
      if (result['new_count'] != null) {
        mailCount = result['new_count'];
        this.setState({
          notificationCount: mailCount + sentMailCount + replyMeCount + atMeCount
        });
      }
    }, (error) => {


    }, (errorMessage) => {

    });
    NetworkManager.net_GetMailCountSent((result) => {
      if (result['new_count'] != null) {
        sentMailCount = result['new_count'];
        this.setState({
          notificationCount: mailCount + sentMailCount + replyMeCount + atMeCount
        });
      }
    }, (error) => {


    }, (errorMessage) => {

    });

    NetworkManager.net_GetReferCount(2, (result) => {
      if (result['new_count'] != null) {
        replyMeCount = result['new_count'];
        this.setState({
          notificationCount: mailCount + sentMailCount + replyMeCount + atMeCount
        });
      }
    }, (error) => {


    }, (errorMessage) => {

    });
    NetworkManager.net_GetReferCount(1, (result) => {
      if (result['new_count'] != null) {
        atMeCount = result['new_count'];
        this.setState({
          notificationCount: mailCount + sentMailCount + replyMeCount + atMeCount
        });
      }
    }, (error) => {


    }, (errorMessage) => {

    });

  }

  componentWillUnmount() {
    this.subscription1.remove();
    this.subscription2.remove();
    this.subscription3.remove();
    this.refreshViewNotification.remove();
  }

  render() {
    return (
      <View>
        <NavigationBar title='我的' />

        <ScrollView style={{ backgroundColor: global.colors.backgroundGrayColor, height: Dimensions.get('window').height - 64, }}>

          <SectionBlankHeader />

          <CellBackground
            onPress={() => {
              this.props.navigation.navigate('userScreen', { id: this.state.username });
            }}
          >
            <View style={{ flexDirection: 'row', padding: 13, height: 80, backgroundColor: global.colors.whiteColor }}>
              <AvatorImage style={{ marginLeft: 13, }} widthAndHeight={60} uri={NetworkManager.net_getFace(this.state.username)} />
              <Text style={{ marginLeft: 13, fontSize: global.configures.fontSize17, color: global.colors.fontColor }}>{this.state.username}</Text>
            </View>
          </CellBackground>

          <SectionBlankHeader />

          <CellBackground
            onPress={() => {
              this.props.navigation.navigate('userThreadScreen', { id: this.state.username })
            }}
          >
            <View style={styles.container}>
              <Image style={styles.leftImage} source={global.images.icon_theme} />
              <View style={styles.content}>
                <Text style={styles.board}>我的主题</Text>
                <Image style={styles.arrow} source={global.images.icon_forward_arrow} />
              </View>
            </View>
          </CellBackground>

          <SeperatorLine />

          <CellBackground
            onPress={() => {
              this.props.navigation.navigate('scanRecordScreen', { id: this.state.username })
            }}
          >
            <View style={styles.container}>
              <Image style={styles.leftImage} source={global.images.icon_theme} />
              <View style={styles.content}>
                <Text style={styles.board}>浏览记录</Text>
                <Image style={styles.arrow} source={global.images.icon_forward_arrow} />
              </View>
            </View>
          </CellBackground>

          <SeperatorLine />

          <CellBackground
            onPress={() => {
              this.props.navigation.navigate('messageScreen')
            }}
          >
            <View style={styles.container}>
              <Image style={styles.leftImage} source={global.images.icon_message} />
              <View style={styles.content}>
                <Text style={styles.board}>通知{this.state.notificationCount == 0 ? '' : ('(' + this.state.notificationCount + ')')}</Text>
                <Image style={styles.arrow} source={global.images.icon_forward_arrow} />
              </View>
            </View>
          </CellBackground>

          <SectionBlankHeader />

          <CellBackground
            onPress={() => {
              this.props.navigation.navigate('sendMessageScreen', {
                user: 'VichyChen',
                title: '意见反馈',
                content: '',
              });
            }}
          >
            <View style={styles.container}>
              <Image style={styles.leftImage} source={global.images.icon_advice} />
              <View style={styles.content}>
                <Text style={styles.board}>意见反馈</Text>
                <Image style={styles.arrow} source={global.images.icon_forward_arrow} />
              </View>
            </View>
          </CellBackground>

          <SeperatorLine />

          {/* <CellBackground
          onPress={() => {
            this.props.navigation.navigate('updateListScreen')
          }}
        >
          <View style={styles.container}>
            <Image style={styles.leftImage} source={global.images.icon_update} />
            <View style={styles.content}>
              <Text style={styles.board}>更新内容</Text>
              <Image style={styles.arrow} source={global.images.icon_forward_arrow} />
            </View>
          </View>
        </CellBackground>

        <SeperatorLine /> */}

          <CellBackground
            onPress={() => {
              var shareManager = NativeModules.ShareManager;
              shareManager.share('T水木-简洁的水木社区客户端', 'https://itunes.apple.com/us/app/t%E6%B0%B4%E6%9C%A8/id1330286243?l=zh&ls=1&mt=8');
            }}
          >
            <View style={styles.container}>
              <Image style={styles.leftImage} source={global.images.icon_share} />
              <View style={styles.content}>
                <Text style={styles.board}>分享T水木</Text>
                <Image style={styles.arrow} source={global.images.icon_forward_arrow} />
              </View>
            </View>
          </CellBackground>

          <SeperatorLine />

          <CellBackground
            onPress={() => {
              this.props.navigation.navigate('settingScreen')
            }}
          >
            <View style={styles.container}>
              <Image style={styles.leftImage} source={global.images.icon_setting} />
              <View style={styles.content}>
                <Text style={styles.board}>设置</Text>
                <Image style={styles.arrow} source={global.images.icon_forward_arrow} />
              </View>
            </View>
          </CellBackground>

        </ScrollView>
      </View>
    );
  }
}

var styles = {
  get leftImage() {
    return {
      position: 'absolute',
      top: 12,
      left: 13,
      height: 20,
      width: 20,
    }
  },
  get container() {
    return {
      flexDirection: 'column',
      backgroundColor: global.colors.whiteColor
    }
  },
  get content() {
    return {
      paddingLeft: 34,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: 44,
    }
  },
  get board() {
    return {
      paddingLeft: 13,
      paddingRight: 13,
      fontSize: global.configures.fontSize17,
      color: global.colors.fontColor,
      backgroundColor: global.colors.whiteColor,
    }
  },
  get arrow() {
    return {
      marginRight: 13,
      width: 10,
      height: 17,
    }
  },
}
