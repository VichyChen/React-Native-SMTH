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
  Dimensions
} from 'react-native';

import {
  NetworkManager,
  Screen,
  HorizontalSeperatorLine,
  SeperatorLine,
  CellBackground,
  AvatorImage,
  DateUtil,
  NavigatorTitleButton
} from '../config/Common';

import ScrollableTabView, { DefaultTabBar, ScrollableTabBar } from 'react-native-scrollable-tab-view';

export default class MessageScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: '通知',
    headerRight: (
      <View style={{ flexDirection: 'row' }}>
        <NavigatorTitleButton
          title='发送短信'
          color={global.colors.whiteColor}
          fontSize={16}
          onPressClick={() => {
            navigation.navigate('sendMessageScreen');
          }}
        />
      </View>
    ),
  });

  constructor(props) {
    super(props);
    this.state = {
      pullLoading1: false,
      viewLoading1: true,
      screenText1: null,
      pullLoading2: false,
      viewLoading2: true,
      screenText2: null,
      pullLoading3: false,
      viewLoading3: true,
      screenText3: null,
      pullLoading4: false,
      viewLoading4: true,
      screenText4: null,
      dataArray: [],
      index: 0,
    }

    this.network(0);
  }

  network(index) {
    switch (index) {
      //收件箱
      case 0:
        NetworkManager.net_LoadMailList(0, 20, (result) => {
          for (var i = 0; i < result['mails'].length; i++) {
            result['mails'][i].key = i;
          }
          this.setState({
            mailDataArray: result['mails'],
            pullLoading1: false,
            viewLoading1: false,
            screenText1: result['mails'].length == 0 ? '您没有任何邮件' : null
          });
          this.refs.flatList1.scrollToOffset({ offset: 0, animated: true });
        }, (error) => {
          if (this.state.viewLoading1 == true) {
            this.setState({
              pullLoading1: false,
              viewLoading1: false,
              screenText1: error
            });
          }
          else {
            ToastUtil.info(error);
            this.setState({
              pullLoading1: false,
              viewLoading1: false,
              screenText1: null
            });
          }
        }, (errorMessage) => {
          if (this.state.viewLoading1 == true) {
            this.setState({
              pullLoading1: false,
              viewLoading1: false,
              screenText1: errorMessage + '，请点击重试'
            });
          }
          else {
            ToastUtil.info(errorMessage);
            this.setState({
              pullLoading1: false,
              viewLoading1: false,
              screenText1: null
            });
          }
        });
        break;
      //发件箱
      case 1:
        NetworkManager.net_LoadMailSentList(0, 20, (result) => {
          for (var i = 0; i < result['mails'].length; i++) {
            result['mails'][i].key = i;
          }
          this.setState({
            mailSentDataArray: result['mails'],
            pullLoading2: false,
            viewLoading2: false,
            screenText2: result['mails'].length == 0 ? '您没有任何邮件' : null
          });
          this.refs.flatList2.scrollToOffset({ offset: 0, animated: true });
        }, (error) => {
          if (this.state.viewLoading2 == true) {
            this.setState({
              pullLoading2: false,
              viewLoading2: false,
              screenText2: error
            });
          }
          else {
            ToastUtil.info(error);
            this.setState({
              pullLoading2: false,
              viewLoading2: false,
              screenText2: null
            });
          }
        }, (errorMessage) => {
          if (this.state.viewLoading2 == true) {
            this.setState({
              pullLoading2: false,
              viewLoading2: false,
              screenText2: errorMessage + '，请点击重试'
            });
          }
          else {
            ToastUtil.info(errorMessage);
            this.setState({
              pullLoading2: false,
              viewLoading2: false,
              screenText2: null
            });
          }
        });
        break;
      //回复我
      case 2:
        NetworkManager.net_LoadRefer(2, 0, 20, (result) => {
          for (var i = 0; i < result['refers'].length; i++) {
            result['refers'][i].key = i;
          }
          this.setState({
            replyMeDataArray: result['refers'],
            pullLoading3: false,
            viewLoading3: false,
            screenText3: result['refers'].length == 0 ? '不存在任何文章' : null
          });
          this.refs.flatList3.scrollToOffset({ offset: 0, animated: true });
        }, (error) => {
          if (this.state.viewLoading3 == true) {
            this.setState({
              pullLoading3: false,
              viewLoading3: false,
              screenText3: error
            });
          }
          else {
            ToastUtil.info(error);
            this.setState({
              pullLoading3: false,
              viewLoading3: false,
              screenText3: null
            });
          }
        }, (errorMessage) => {
          if (this.state.viewLoading3 == true) {
            this.setState({
              pullLoading3: false,
              viewLoading3: false,
              screenText3: errorMessage + '，请点击重试'
            });
          }
          else {
            ToastUtil.info(errorMessage);
            this.setState({
              pullLoading3: false,
              viewLoading3: false,
              screenText3: null
            });
          }
        });
        break;
      //@我
      case 3:
        NetworkManager.net_LoadRefer(1, 0, 20, (result) => {
          for (var i = 0; i < result['refers'].length; i++) {
            result['refers'][i].key = i;
          }
          this.setState({
            atMeDataArray: result['refers'],
            pullLoading4: false,
            viewLoading4: false,
            screenText4: result['refers'].length == 0 ? '不存在任何文章' : null
          });
          this.refs.flatList4.scrollToOffset({ offset: 0, animated: true });
        }, (error) => {
          if (this.state.viewLoading4 == true) {
            this.setState({
              pullLoading4: false,
              viewLoading4: false,
              screenText4: error
            });
          }
          else {
            ToastUtil.info(error);
            this.setState({
              pullLoading4: false,
              viewLoading4: false,
              screenText4: null
            });
          }
        }, (errorMessage) => {
          if (this.state.viewLoading4 == true) {
            this.setState({
              pullLoading4: false,
              viewLoading4: false,
              screenText4: errorMessage + '，请点击重试'
            });
          }
          else {
            ToastUtil.info(errorMessage);
            this.setState({
              pullLoading4: false,
              viewLoading4: false,
              screenText4: null
            });
          }
        });
        break;
    }
  }

  _renderItem0 = ({ item }) => {
    return (
      <CellBackground
        onPress={() => {
          this.props.navigation.navigate('receiveMessageDetailScreen', { message: item })
        }}
      >
        <View>
          <View style={{ backgroundColor: global.colors.whiteColor }}>
            <View style={{ flexDirection: 'row', padding: 13 }}>
              <AvatorImage
                style={styles.avator}
                borderRadius={20}
                widthAndHeight={40}
                onPressClick={() => {
                  this.props.navigation.navigate('userScreen', { id: item.author_id });
                }}
                uri={NetworkManager.net_getFace(item.author_id)} />
              <View style={{ height: 42 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', height: 24 }}>
                  <Text style={styles.author}>{item.author_id}</Text>
                </View>
                <Text style={styles.time}>
                  {DateUtil.formatTimeStamp(item.time)}
                </Text>
              </View>
            </View>
            <Text style={styles.body}>{item.subject}</Text>
          </View>
          <SeperatorLine />
        </View>
      </CellBackground>
    )
  };

  _renderItem1 = ({ item }) => {
    return (
      <CellBackground
        onPress={() => {
          this.props.navigation.navigate('sendMessageDetailScreen', { message: item })
        }}
      >
        <View>
          <View style={{ backgroundColor: global.colors.whiteColor }}>
            <View style={{ flexDirection: 'row', padding: 13 }}>
              <AvatorImage
                style={styles.avator}
                borderRadius={20}
                widthAndHeight={40}
                onPressClick={() => {
                  this.props.navigation.navigate('userScreen', { id: item.author_id });
                }}
                uri={NetworkManager.net_getFace(item.author_id)} />
              <View style={{ height: 42 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', height: 24 }}>
                  <Text style={styles.author}>
                    {item.author_id}
                  </Text>
                </View>
                <Text style={styles.time}>
                  {DateUtil.formatTimeStamp(item.time)}
                </Text>
              </View>
            </View>
            <Text style={styles.body}>{item.subject}</Text>
          </View>
          <SeperatorLine />
        </View>
      </CellBackground>
    )
  };

  _renderItem2 = ({ item }) => {
    return (
      <CellBackground
        onPress={() => {
          this.props.navigation.navigate('threadDetail', { id: item.re_id, board: item.board_id, subject: item.subject })
        }}
      >
        <View>
          <View style={{ backgroundColor: global.colors.whiteColor }}>
            <View style={{ flexDirection: 'row', padding: 13 }}>
              <AvatorImage
                style={styles.avator}
                borderRadius={20}
                widthAndHeight={40}
                onPressClick={() => {
                  this.props.navigation.navigate('userScreen', { id: item.user_id });
                }}
                uri={NetworkManager.net_getFace(item.user_id)} />
              <View style={{ height: 42 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', height: 24 }}>
                  <Text style={styles.author}>
                    {item.user_id}
                  </Text>
                </View>
                <Text style={styles.time}>
                  {DateUtil.formatTimeStamp(item.time)}
                </Text>
              </View>
            </View>
            <Text style={styles.body}>{item.subject}</Text>
          </View>
          <SeperatorLine />
          <Text style={styles.board}>{item.board_id}</Text>
        </View>
      </CellBackground>
    )
  };

  render() {
    return (
      <View>
        <View style={styles.tab}>
          <ScrollableTabView
            tabBarTextStyle={{ fontSize: global.configures.fontSize18, fontWeight: 'normal' }}
            tabBarUnderlineStyle={{ backgroundColor: global.colors.clearColor }}
            tabBarBackgroundColor={global.colors.whiteColor}
            tabBarActiveTextColor={global.colors.themeColor}
            tabBarInactiveTextColor={global.colors.gray1Color}
            scrollWithoutAnimation={true}
            tabBarPosition='bottom'
            renderTabBar={() => <ScrollableTabBar />}
            page={this.state.index}
            onChangeTab={(obj) => {
              console.log('index:' + obj.i);
              this.setState({
                index: obj.i,
              });
              this.refs.scrollView.scrollTo({ x: obj.i * Dimensions.get('window').width, y: 0, animated: false });
              switch (obj.i) {
                //收件箱
                case 0:
                  this.setState({
                    viewLoading1: true,
                    screenText1: null
                  });
                  break;
                //发件箱
                case 1:
                  this.setState({
                    viewLoading2: true,
                    screenText2: null
                  });
                  break;
                //回复我
                case 2:
                  this.setState({
                    viewLoading3: true,
                    screenText3: null
                  });
                //@我
                case 3:
                  this.setState({
                    viewLoading4: true,
                    screenText4: null
                  });
                  break;
              }
              this.network(obj.i);
            }}
          >
            <Text tabLabel='收件箱' />
            <Text tabLabel='发件箱' />
            <Text tabLabel='回复我' />
            <Text tabLabel='@我' />
          </ScrollableTabView>
          <HorizontalSeperatorLine />
        </View>
        <ScrollView
          ref="scrollView"
          style={styles.scrollView}
          horizontal={true}
          bounces={false}
          scrollEnabled={false}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          onScroll={(event) => {
            console.log(event.nativeEvent.contentOffset.x);
            console.log(Math.floor((event.nativeEvent.contentOffset.x - Dimensions.get('window').width / 2) / Dimensions.get('window').width) + 1);
            this.setState({
              index: Math.floor((event.nativeEvent.contentOffset.x - Dimensions.get('window').width / 2) / Dimensions.get('window').width) + 1,
            });
          }}
        >

          <Screen showLoading={this.state.viewLoading1}
            loadingType={'background'}
            text={this.state.screenText1}
            onPress={() => {
              this.setState({
                viewLoading1: true,
                screenText1: null
              });
              this.network(0);
            }}
          >
            <View style={[styles.content]}>
              <FlatList
                ref="flatList1"
                data={this.state.mailDataArray}
                renderItem={this._renderItem0}
                removeClippedSubviews={false}
                extraData={this.state}
                style={[styles.flatList]}
                onRefresh={() => {
                  this.setState({
                    pullLoading1: true
                  });
                  this.network(0);
                }
                }
                refreshing={this.state.pullLoading1}
              />
            </View>
          </Screen>

          <Screen showLoading={this.state.viewLoading2}
            loadingType={'background'}
            text={this.state.screenText2}
            onPress={() => {
              this.setState({
                viewLoading2: true,
                screenText2: null
              });
              this.network(1);
            }}
          >
            <View style={[styles.content]}>
              <FlatList
                ref="flatList2"
                data={this.state.mailSentDataArray}
                renderItem={this._renderItem1}
                removeClippedSubviews={false}
                extraData={this.state}
                style={[styles.flatList]}
                onRefresh={() => {
                  this.setState({
                    pullLoading2: true
                  });
                  this.network(1);
                }
                }
                refreshing={this.state.pullLoading2}
              />
            </View>
          </Screen>

          <Screen showLoading={this.state.viewLoading3}
            loadingType={'background'}
            text={this.state.screenText3}
            onPress={() => {
              this.setState({
                viewLoading3: true,
                screenText3: null
              });
              this.network(2);
            }}
          >
            <View style={[styles.content]}>
              <FlatList
                ref="flatList3"
                data={this.state.replyMeDataArray}
                renderItem={this._renderItem2}
                removeClippedSubviews={false}
                extraData={this.state}
                style={[styles.flatList]}
                onRefresh={() => {
                  this.setState({
                    pullLoading3: true
                  });
                  this.network(2);
                }
                }
                refreshing={this.state.pullLoading3}
              />
            </View>
          </Screen>

          <Screen showLoading={this.state.viewLoading4}
            loadingType={'background'}
            text={this.state.screenText4}
            onPress={() => {
              this.setState({
                viewLoading4: true,
                screenText4: null
              });
              this.network(3);
            }}
          >
            <View style={[styles.content]}>
              <FlatList
                ref="flatList4"
                data={this.state.atMeDataArray}
                renderItem={this._renderItem2}
                removeClippedSubviews={false}
                extraData={this.state}
                style={[styles.flatList]}
                onRefresh={() => {
                  this.setState({
                    pullLoading4: true
                  });
                  this.network(3);
                }
                }
                refreshing={this.state.pullLoading4}
              />
            </View>
          </Screen>

        </ScrollView>
      </View>
    );
  }
}

var styles = {
  get tab() {
    return {
      height: 48,
    }
  },
  get scrollView() {
    return {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height - 64 - 48,
    }
  },
  get flatList() {
    return {
      // backgroundColor: global.colors.whiteColor
    }
  },
  get content() {
    return {

      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height - 64 - 48,
      backgroundColor: global.colors.whiteColor
    }
  },
  get avator() {
    return {
      width: 40,
      height: 40,
    }
  },
  get author() {
    return {
      marginLeft: 10,
      fontSize: global.configures.fontSize17,
      color: global.colors.fontColor,
    }
  },
  get time() {
    return {
      marginLeft: 10,
      height: 19,
      fontSize: global.configures.fontSize14,
      color: global.colors.gray2Color,
    }
  },
  get body() {
    return {
      marginLeft: 13,
      marginRight: 13,
      marginBottom: 13,
      fontSize: global.configures.fontSize17,
      color: global.colors.fontColor,
    }
  },
  get board() {
    return {
      position: 'absolute',
      top: 13,
      right: 13,
      paddingTop: 2,
      paddingBottom: 2,
      paddingLeft: 5,
      paddingRight: 5,
      fontSize: global.configures.fontSize15,
      color: global.colors.gray2Color,
      backgroundColor: global.colors.backgroundGrayColor,
      borderRadius: 10,
    }
  },
}
