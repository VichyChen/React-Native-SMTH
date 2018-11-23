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
  StatusBar
} from 'react-native';

import {
  NetworkManager,
  AvatorImage,
  SectionBlankHeader,
  CellBackground,
  SeperatorLine,
  HorizontalSeperatorLine,
  NavigationBar,
  DateUtil
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
      this.setState({
        mailCount: 0,
        sentMailCount: 0,
        replyMeCount: 0,
        atMeCount: 0,
      });
    });
    this.clickMyScreenNotification = DeviceEventEmitter.addListener('ClickMyScreenNotification', () => {
      if (global.login == true) {
        this.network();
      }
    });
    this.refreshViewNotification = DeviceEventEmitter.addListener('RefreshViewNotification', () => {
      this.setState({});
    });

    if (global.login == true) {
      AsyncStorageManger.getUsername().then(username => {
        this.setState({
          username: username,
        });

        this.network();
      });
    }
  }

  network() {
    NetworkManager.net_QueryUser(this.state.username, (result) => {
      this.setState({
        isLoading: false,
        id: result['user'].id,
        nick: result['user'].nick,
        uid: result['user'].uid,
        gender: result['user'].gender,
        title: result['user'].title,
        posts: result['user'].posts,
        logins: result['user'].logins,
        level: result['user'].level,
        score: result['user'].score,
        first_login: result['user'].first_login,
        last_login: result['user'].last_login,
        age: result['user'].age,
        life: result['user'].life,
      });
    }, (error) => {

    }, (errorMessage) => {

    });

    NetworkManager.net_GetMailCount((result) => {
      if (result['new_count'] != null) {
        mailCount = result['new_count'];
        this.setState({
          mailCount: mailCount,
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
          sentMailCount: sentMailCount,
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
          replyMeCount: replyMeCount,
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
          atMeCount: atMeCount,
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

  showLogin() {
    StatusBar.setBarStyle('dark-content');
    DeviceEventEmitter.emit('LoginNotification', () => { StatusBar.setBarStyle('light-content'); });
  }

  render() {
    return (
      <View style={{ backgroundColor: 'green' }}>
        <StatusBar barStyle="light-content" />
        <NavigationBar
          showBackButton={false}
          showBottomLine={false}
          style={{ backgroundColor: global.colors.themeColor }}
          rightButtonTitle='设置'
          rightButtonTitleColor={global.colors.whiteColor}
          rightButtonOnPress={() => {
            StatusBar.setBarStyle('dark-content');
            this.props.navigation.navigate('newSettingScreen');
          }}
        />

        <ScrollView
          scrollEnabled={false}
          style={{
            backgroundColor: global.colors.backgroundGrayColor
          }}
        >
          <View style={{
            height: global.constants.ScreenHeight - global.constants.TabBarHeight - global.constants.NavigationBarHeight,
            flexDirection: 'column',
          }}>

            <View style={{
              height: 215,
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: global.colors.themeColor,
            }}>

              <CellBackground
                showSelect={false}
                onPress={() => {
                  if (global.login == true) {
                    AsyncStorageManger.getID().then(id => {
                      this.props.navigation.navigate('newUserScreen', { id: id, name: this.state.username });
                    });
                  }
                  else {
                    this.showLogin();
                  }
                }}
              >
                <View style={{
                  height: 64,
                  width: global.constants.ScreenWidth - 40,
                  marginBottom: 10,
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }} >
                  <AvatorImage
                    borderRadius={30}
                    widthAndHeight={60}
                    uri={(global.login == true && this.state.username.length > 0 ? NetworkManager.net_getFace(this.state.username) : null)} />

                  <Text style={{
                    marginLeft: 5,
                    fontSize: global.configures.fontSize20,
                    fontWeight: '600',
                    color: global.colors.whiteColor
                  }}>
                    {global.login == true ? '' : '未登录'}
                  </Text>

                  <View style={{
                    flex: 1,
                    marginLeft: 5,
                  }} >
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                      <Text style={{
                        fontSize: global.configures.fontSize20,
                        fontWeight: '600',
                        color: global.colors.whiteColor
                      }}>
                        {global.login == true && this.state.username.length > 0 ? this.state.username : ''}
                      </Text>

                      {/* {
                        global.login == true && this.state.gender != null ?
                          <Image style={{ marginLeft: 10, width: 16, height: 16, tintColor: global.colors.whiteColor }} source={this.state.gender == 1 ? global.images.icon_female : global.images.icon_male} />
                          :
                          null
                      } */}

                    </View>

                    <Text style={[styles.nick, { marginTop: 10 }]} >
                      {global.login == true && this.state.nick != null ? this.state.nick : ''}
                    </Text>

                  </View>

                  <Image style={[styles.arrow, { marginRight: 15, tintColor: global.colors.whiteColor }]} source={global.images.icon_right_arrow} />

                </View>
              </CellBackground>
              <HorizontalSeperatorLine color={global.colors.whiteColor} width={global.constants.ScreenWidth - 40} />

              <View style={[styles.userInfoView, { marginTop: 10, height: 40 }]} >
                <Text style={[styles.userInfoSmallText]} >{'身份 '}</Text>
                <Text style={[styles.userInfoBigText]} >
                  {global.login == true && this.state.title != null ? this.state.title : '无'}
                </Text>
                <Text style={[styles.userInfoSmallText]} >{'  |  '}</Text>
                <Text style={[styles.userInfoSmallText]} >{'积分 '}</Text>
                <Text style={[styles.userInfoBigText]} >
                  {global.login == true && this.state.score != null ? this.state.score : '0'}
                </Text>
                <Text style={[styles.userInfoSmallText]} >{'  |  '}</Text>
                <Text style={[styles.userInfoSmallText]} >{'等级 '}</Text>
                <Text style={[styles.userInfoBigText]} >
                  {global.login == true && this.state.life != null ? this.state.life + '(' + this.state.level + ')' : '无'}
                </Text>
              </View>

              <View style={[styles.userInfoView, { marginTop: 5, marginBottom: 20 }]} >
                <Text style={[styles.userInfoSmallText, styles.nick]} >
                  {
                    '上次登录 ' +
                    (global.login == true && this.state.last_login != null ? DateUtil.formatTimeStamp(this.state.last_login) : '无') +
                    '  |  注册于 ' +
                    (global.login == true && this.state.first_login != null ? DateUtil.formatTimeStamp(this.state.first_login) : '无')
                  }
                </Text>

                {/* <Text style={[styles.userInfoSmallText, styles.nick]} >{'上次登录 '}</Text>
                <Text style={[styles.userInfoSmallText]} >
                  {global.login == true && this.state.last_login != null ? DateUtil.formatTimeStamp(this.state.last_login) : '无'}
                </Text>
                <Text style={[styles.userInfoSmallText]} >{'  |  '}</Text>
                <Text style={[styles.userInfoSmallText]} >{'注册于 '}</Text>
                <Text style={[styles.userInfoSmallText]} >
                  {global.login == true && this.state.first_login != null ? DateUtil.formatTimeStamp(this.state.first_login) : '无'}
                </Text> */}
              </View>

              <View style={{
                height: 100,
                width: global.constants.ScreenWidth - 40,
                marginTop: 5,
                flexDirection: 'row',
                backgroundColor: global.colors.whiteColor,
                borderRadius: 6,
                shadowColor: global.colors.whiteColor,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 1,
                shadowRadius: 5,
              }} >
                <View style={{
                  flex: 1,
                  flexDirection: 'row',
                }} >
                  <CellBackground
                    showSelect={false}
                    onPress={() => {
                      if (global.login == true) {
                        StatusBar.setBarStyle('dark-content');
                        this.props.navigation.navigate('newMessageScreen', { selectedIndex: 0 })
                      }
                      else {
                        this.showLogin();
                      }
                    }}
                  >
                    <View style={[styles.messageItem]}>
                      <View style={{ alignItems: 'center' }}>
                        <Image style={styles.messageImageItem} resizeMode="cover" source={global.images.icon_message_mail} />
                        <Text style={styles.messageTextItem}>{'收信箱'}</Text>
                        {
                          this.state.mailCount > 0 ?
                            <View style={styles.messageCountViewItem} >
                              <Text style={styles.messageCountTextItem} >{this.state.mailCount}</Text>
                            </View>
                            : null
                        }
                      </View>
                    </View>
                  </CellBackground>

                  <CellBackground
                    showSelect={false}
                    onPress={() => {
                      if (global.login == true) {
                        StatusBar.setBarStyle('dark-content');
                        this.props.navigation.navigate('newMessageScreen', { selectedIndex: 1 })
                      }
                      else {
                        this.showLogin();
                      }
                    }}
                  >
                    <View style={[styles.messageItem]}>
                      <View style={{ alignItems: 'center' }}>
                        <Image style={styles.messageImageItem} resizeMode="cover" source={global.images.icon_message_sendmail} />
                        <Text style={styles.messageTextItem}>发信箱</Text>
                        {
                          this.state.sentMailCount > 0 ?
                            <View style={styles.messageCountViewItem} >
                              <Text style={styles.messageCountTextItem} >{this.state.sentMailCount}</Text>
                            </View>
                            :
                            null
                        }
                      </View>
                    </View>
                  </CellBackground>

                  <CellBackground
                    showSelect={false}
                    onPress={() => {
                      if (global.login == true) {
                        StatusBar.setBarStyle('dark-content');
                        this.props.navigation.navigate('newMessageScreen', { selectedIndex: 2 })
                      }
                      else {
                        this.showLogin();
                      }
                    }}
                  >
                    <View style={[styles.messageItem]}>
                      <View style={{ alignItems: 'center' }}>
                        <Image style={styles.messageImageItem} resizeMode="cover" source={global.images.icon_message_reply} />
                        <Text style={styles.messageTextItem}>回复我</Text>
                        {
                          this.state.sentMailCount > 0 ?
                            <View style={styles.messageCountViewItem} >
                              <Text style={styles.messageCountTextItem} >{this.state.replyMeCount}</Text>
                            </View>
                            :
                            null
                        }
                      </View>
                    </View>
                  </CellBackground>

                  <CellBackground
                    showSelect={false}
                    onPress={() => {
                      if (global.login == true) {
                        StatusBar.setBarStyle('dark-content');
                        this.props.navigation.navigate('newMessageScreen', { selectedIndex: 3 })
                      }
                      else {
                        this.showLogin();
                      }
                    }}
                  >
                    <View style={[styles.messageItem]}>
                      <View style={{ alignItems: 'center' }}>
                        <Image style={styles.messageImageItem} resizeMode="cover" source={global.images.icon_message_at} />
                        <Text style={styles.messageTextItem}>AT我</Text>
                        {
                          this.state.sentMailCount > 0 ?
                            <View style={styles.messageCountViewItem} >
                              <Text style={styles.messageCountTextItem} >{this.state.atMeCount}</Text>
                            </View>
                            :
                            null
                        }
                      </View>
                    </View>
                  </CellBackground>
                </View>
              </View>

            </View>

            <View style={{
              flex: 1,
              marginTop: global.constants.TopMargin + 35 + global.constants.Padding,
              marginBottom: 20,
              marginHorizontal: 20,
              // height: 100,
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: global.colors.whiteColor,
              borderRadius: 6,
            }} >

              <CellBackground
                showSelect={false}
                onPress={() => {
                  if (global.login == true) {
                    AsyncStorageManger.getID().then(id => {
                      StatusBar.setBarStyle('dark-content');
                      this.props.navigation.navigate('newUserArticleScreen', { id: id });
                    });
                  }
                  else {
                    this.showLogin();
                  }
                }}
              >
                <View style={[styles.content]}>
                  <Text style={styles.board}>我的文章</Text>
                  <Image style={styles.arrow} source={global.images.icon_right_arrow} />
                </View>
              </CellBackground>

              <HorizontalSeperatorLine width={global.constants.ScreenWidth - 40 - global.constants.Padding * 2} />

              <CellBackground
                showSelect={false}
                onPress={() => {
                  StatusBar.setBarStyle('dark-content');
                  this.props.navigation.navigate('newFavouriteThreadScreen')
                }}
              >
                <View style={[styles.content]}>
                  <Text style={styles.board}>帖子收藏</Text>
                  <Image style={styles.arrow} source={global.images.icon_right_arrow} />
                </View>
              </CellBackground>

              <HorizontalSeperatorLine width={global.constants.ScreenWidth - 40 - global.constants.Padding * 2} />

              <CellBackground
                showSelect={false}
                onPress={() => {
                  StatusBar.setBarStyle('dark-content');
                  this.props.navigation.navigate('scanRecordScreen', { id: this.state.username })
                }}
              >
                <View style={[styles.content]}>
                  <Text style={styles.board}>浏览记录</Text>
                  <Image style={styles.arrow} source={global.images.icon_right_arrow} />
                </View>
              </CellBackground>

              <HorizontalSeperatorLine width={global.constants.ScreenWidth - 40 - global.constants.Padding * 2} />

            </View>
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
  get nick() {
    return {
      fontSize: global.configures.fontSize12,
      color: global.colors.whiteColor,
    }
  },
  get messageItem() {
    return {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      width: (global.constants.ScreenWidth - 40) / 4,
      // backgroundColor: 'yellow'
    }
  },
  get messageCountViewItem() {
    return {
      position: 'absolute',
      right: -4,
      top: -8,
      width: 20,
      height: 20,
      backgroundColor: global.colors.redColor,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    }
  },
  get messageCountTextItem() {
    return {
      backgroundColor: global.colors.clearColor,
      color: global.colors.whiteColor,
      textAlign: 'center',
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
      fontSize: global.fontSize.fontSize13,
    }
  },
  get content() {
    return {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: 50,
      width: global.constants.ScreenWidth - global.constants.Padding * 2,
      backgroundColor: global.colors.clearColor,
    }
  },
  get board() {
    return {
      paddingLeft: 20,
      fontSize: global.configures.fontSize17,
      color: global.colors.fontColor,
    }
  },
  get arrow() {
    return {
      marginRight: 20,
      width: 10,
      height: 15,
    }
  },
  get userInfoView() {
    return {
      width: global.constants.ScreenWidth - 40,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    }
  },
  get userInfoSmallText() {
    return {
      fontSize: global.configures.fontSize10,
      color: global.colors.whiteColor,
      marginBottom: -4,
    }
  },
  get userInfoBigText() {
    return {
      fontSize: global.configures.fontSize20,
      fontWeight: '600',
      color: global.colors.whiteColor
    }
  },
}
