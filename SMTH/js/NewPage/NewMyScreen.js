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
  Dimensions,
} from 'react-native';

import {
  NetworkManager,
  AvatorImage,
  SectionBlankHeader,
  CellBackground,
  SeperatorLine,
  HorizontalSeperatorLine,
  NavigationBar
} from '../config/Common';

import AsyncStorageManger from '../storage/AsyncStorageManger';
import { NativeModules } from 'react-native';

var mailCount;
var sentMailCount;
var replyMeCount;
var atMeCount;

export default class NewMyScreen extends Component {

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

    this.loginSuccessNotification = DeviceEventEmitter.addListener('LoginSuccessNotification', (username) => {
      this.setState({
        username: username,
        notificationCount: 0,
      });
      this.network();
    });
    this.logoutNotification = DeviceEventEmitter.addListener('LogoutNotification', () => {
      this.setState({});
    });
    this.clickMyScreenNotification = DeviceEventEmitter.addListener('ClickMyScreenNotification', () => {
      if (global.login == true) {
        this.network();
      }
    });
    this.refreshViewNotification = DeviceEventEmitter.addListener('RefreshViewNotification', () => {
      this.setState({});
    });

    AsyncStorageManger.getUsername().then(username => {
      this.setState({
        username: username,
      });
    });

    if (global.login == true) {
      this.network();
    }
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
    this.loginSuccessNotification.remove();
    this.logoutNotification.remove();
    this.clickMyScreenNotification.remove();
    this.refreshViewNotification.remove();
  }

  componentWillUpdate() {
    // StatusBar.setBarStyle('light-content');
  }

  render() {
    return (
      <View style={{ backgroundColor: global.colors.whiteColor }}>
        <NavigationBar
          // titleColor={global.colors.whiteColor}
          showBottomLine={false}
          rightButtonTitle={'设置'}
        />

        <ScrollView style={{ backgroundColor: global.colors.whiteColor, height: Dimensions.get('window').height - 64, }}>
          <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>

            <AvatorImage
              borderRadius={30}
              widthAndHeight={60}
              uri={NetworkManager.net_getFace(this.state.username)} />

            <Text style={{
              marginTop: 10,
              fontSize: global.configures.fontSize17,
              color: global.colors.fontColor
            }}>
              {this.state.username}
            </Text>

            <View style={{
              height: 100,
              width: global.constants.ScreenWidth - global.constants.Padding * 4,
              marginTop: 20,
              flexDirection: 'row',
              backgroundColor: global.colors.whiteColor,
              borderRadius: 6,
              shadowColor: global.colors.backgroundGrayColor,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 1,
              shadowRadius: 10,
            }} >
              <View style={{
                flex: 1,
                flexDirection: 'row',
              }} >
                <CellBackground
                  showSelect={false}
                  onPress={() => {
                    this.props.navigation.navigate('newMessageScreen', { selectedIndex: 0 })
                  }}
                >
                  <View style={[styles.messageItem]}>
                    <Image style={styles.messageImageItem} resizeMode="cover" source={global.images.icon_message_mail} />
                    <Text style={styles.messageTextItem}>收信箱</Text>
                  </View>
                </CellBackground>

                <CellBackground
                  showSelect={false}
                  onPress={() => {
                    this.props.navigation.navigate('newMessageScreen', { selectedIndex: 1 })
                  }}
                >
                  <View style={[styles.messageItem]}>
                    <Image style={styles.messageImageItem} resizeMode="cover" source={global.images.icon_message_sendmail} />
                    <Text style={styles.messageTextItem}>发信箱</Text>
                  </View>
                </CellBackground>

                <CellBackground
                  showSelect={false}
                  onPress={() => {
                    this.props.navigation.navigate('newMessageScreen', { selectedIndex: 2 })
                  }}
                >
                  <View style={[styles.messageItem]}>
                    <Image style={styles.messageImageItem} resizeMode="cover" source={global.images.icon_message_reply} />
                    <Text style={styles.messageTextItem}>回复我</Text>
                  </View>
                </CellBackground>

                <CellBackground
                  showSelect={false}
                  onPress={() => {
                    this.props.navigation.navigate('newMessageScreen', { selectedIndex: 3 })
                  }}
                >
                  <View style={[styles.messageItem]}>
                    <Image style={styles.messageImageItem} resizeMode="cover" source={global.images.icon_message_at} />
                    <Text style={styles.messageTextItem}>@我</Text>
                  </View>
                </CellBackground>
              </View>
            </View>

            <CellBackground
              showSelect={false}
              onPress={() => {
                this.props.navigation.navigate('userThreadScreen', { id: this.state.username })
              }}
            >
              <View style={[styles.content, { marginTop: 10 }]}>
                <Text style={styles.board}>我的主题</Text>
                <Image style={styles.arrow} source={global.images.icon_forward_arrow} />
              </View>
            </CellBackground>

            <HorizontalSeperatorLine width={global.constants.ScreenWidth - global.constants.Padding * 2} />

            <CellBackground
              showSelect={false}
              onPress={() => {
                this.props.navigation.navigate('scanRecordScreen', { id: this.state.username })
              }}
            >
              <View style={[styles.content]}>
                <Text style={styles.board}>浏览记录</Text>
                <Image style={styles.arrow} source={global.images.icon_forward_arrow} />
              </View>
            </CellBackground>

            <HorizontalSeperatorLine width={global.constants.ScreenWidth - global.constants.Padding * 2} />

            <CellBackground
              showSelect={false}
              onPress={() => {
                this.props.navigation.navigate('sendMessageScreen', {
                  user: 'VichyChen',
                  title: '意见反馈',
                  content: '',
                });
              }}
            >
              <View style={[styles.content]}>
                <Text style={styles.board}>意见反馈</Text>
                <Image style={styles.arrow} source={global.images.icon_forward_arrow} />
              </View>
            </CellBackground>

            <HorizontalSeperatorLine width={global.constants.ScreenWidth - global.constants.Padding * 2} />

            <CellBackground
              showSelect={false}
              onPress={() => {
                var shareManager = NativeModules.ShareManager;
                shareManager.share('T水木-简洁的水木社区客户端', 'https://itunes.apple.com/us/app/t%E6%B0%B4%E6%9C%A8/id1330286243?l=zh&ls=1&mt=8');
              }}
            >
              <View style={[styles.content]}>
                <Text style={styles.board}>分享天天水木</Text>
                <Image style={styles.arrow} source={global.images.icon_forward_arrow} />
              </View>
            </CellBackground>

            <HorizontalSeperatorLine width={global.constants.ScreenWidth - global.constants.Padding * 2} />

          </View>

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
  get messageItem() {
    return {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      width: (global.constants.ScreenWidth - global.constants.Padding * 4) / 4,
      // backgroundColor: 'yellow'
    }
  },
  get messageImageItem() {
    return {
      width: 25,
      height: 25,
    }
  },
  get messageTextItem() {
    return {
      marginTop: 8,
      color: global.colors.gray1Color,
      fontSize: global.fontSize.fontSize15,
    }
  },
  get content() {
    return {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: 50,
      width: global.constants.ScreenWidth - global.constants.Padding * 2,
    }
  },
  get board() {
    return {
      paddingLeft: 15,
      fontSize: global.configures.fontSize17,
      color: global.colors.fontColor,
      backgroundColor: global.colors.whiteColor,
    }
  },
  get arrow() {
    return {
      marginRight: 15,
      width: 10,
      height: 17,
    }
  },
}
