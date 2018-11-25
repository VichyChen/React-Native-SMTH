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
  Dimensions,
  DeviceEventEmitter,
  Modal,
  Linking,
  Clipboard,
  WebView,
  StatusBar
} from 'react-native';
import { NativeModules } from 'react-native';

import AutoHeightImage from 'react-native-auto-height-image';
import ActionSheet from 'react-native-actionsheet'

import {
  NetworkManager,
  DateUtil,
  SeperatorLine,
  HorizontalSeperatorLine,
  AvatorImage,
  NavigatorTitleButton,
  ThreadDetailBottomBarView,
  ThreadDetailBottomSelectPageView,
  ThreadDetailFloorActionView,
  ThreadDetailMoreView,
  BackgroundMaskView,
  WindowsMaskView,
  LoadingView,
  Button,
  ImageButton,
  LoginView,
  Screen,
  ToastUtil,
  NavigationBar
} from '../config/Common';

import {
  ScanRecordModel,
  BoardModel,
  FavouriteThreadModel
} from 'ModelModule';

export default class ThreadDetailScreen extends Component {

  from;
  size;
  threadCount;
  hostID;//楼主ID
  hostTime;
  hostBody;
  board;
  boardName;
  boardObject;
  scanRecord;

  webURL;
  historyURL;

  selectMoreItemIndex;
  selectMoreItemName;
  selectMoreItemMeta;
  selectMoreItemReply;
  selectMoreItemReplyID;

  constructor(props) {
    super(props);
    this.state = {
      screenStatus: global.screen.loading,
      screenText: null,
      dataArray: [],
      backgroundMaskViewHidden: true,
      selectPageViewHidden: true,
      floorActionViewHidden: true,
      moreViewHidden: true,
      currentPage: 1,
      totalPage: 1,
      // selectedValue: '1',
    }
    this.size = 20;
    this.board = unescape(this.props.navigation.state.params.board);
    this.boardName = global.configures.boards[unescape(this.props.navigation.state.params.board)];
    this.scanRecord = false;

    this.webURL = 'http://m.newsmth.net/article/' + this.board + '/' + this.props.navigation.state.params.id;
    this.historyURL = 'http://jinghuasoft.com/smthview.jsp?board=' + this.board + '&id=' + this.props.navigation.state.params.id;
    this.from = 0;
    this.net_GetThread(this.from, this.size);
    this.net_QueryBoard();
  }

  componentWillMount() {
    this.threadRefreshNotification = DeviceEventEmitter.addListener('ThreadRefreshNotification', (mid) => {
      if (mid == this.props.navigation.state.params.id) {
        this.setState({
          screenStatus: global.screen.loading,
        });
        this.net_GetThread(this.from, this.size);
      }
    });
  }

  componentWillUnmount() {
    this.threadRefreshNotification.remove();
    DeviceEventEmitter.emit('RefreshScanRecordNotification', null);
  }

  net_GetThread(from, size) {
    NetworkManager.net_GetThread(this.board, this.props.navigation.state.params.id, from, size, '1', (result) => {
      this.threadCount = result['count'];
      for (var i = 0; i < result['articles'].length; i++) {
        if (from == 0 && i == 0) {
          this.hostID = result['articles'][i].author_id;
          this.hostBody = result['articles'][i].body;
          this.hostTime = DateUtil.formatTimeStamp(result['articles'][i].time);
        }
        result['articles'][i].key = i;
        result['articles'][i].floor = from + i;
        result['articles'][i].time = DateUtil.formatTimeStamp(result['articles'][i].time);
        for (var j = 0; j < result['articles'][i].attachment_list.length; j++) {
          result['articles'][i]['attachment_list'][j].key = j;
          result['articles'][i]['attachment_list'][j].id = result['articles'][i].id;
        }
      }

      if (from == 0 && result['articles'].length == 0) {
        this.setState({
          screenStatus: global.screen.text,
          screenText: '帖子不存在，可以尝试从浏览器打开或查看快照',
        });
      }
      else {
        this.setState({
          dataArray: result['articles'],
          totalPage: this.threadCount % size == 0 ? parseInt(this.threadCount / size) : parseInt(this.threadCount / size) + 1,
          currentPage: parseInt(from / size) + 1,
          selectedValue: (parseInt(from / size) + 1).toString(),
          screenStatus: global.screen.none,
        });

        if (this.refs.flatList != null) {
          this.refs.flatList.scrollToOffset({ offset: 1, animated: true })
          setTimeout(() => {
            if (this.refs.flatList != null) {
              this.refs.flatList.scrollToOffset({ offset: 0, animated: true })
            }
          }, 50);
        }

      }

      if (this.scanRecord == false) {
        ScanRecordModel.create(
          'old',
          this.props.navigation.state.params.id,
          this.props.navigation.state.params.board,
          this.props.navigation.state.params.subject,
          this.hostID,
          this.hostTime
        ).then(() => {
          this.scanRecord = true;
        }).catch((error) => {
          this.scanRecord == false
        });
      }

    }, (error) => {
      ToastUtil.info(error.message);
      this.setState({
        screenStatus: this.state.screenStatus == global.screen.loading ? global.screen.error : global.screen.none,
        screenText: error.message,
      });
    }, (errorMessage) => {
      ToastUtil.info(errorMessage);
      this.setState({
        screenStatus: this.state.screenStatus == global.screen.loading ? global.screen.networkError : global.screen.none,
      });
    });
  }

  net_QueryBoard() {
    NetworkManager.net_QueryBoard(this.board, (result) => {
      for (var i = 0; i < result['boards'].length; i++) {
        if (this.board == result['boards'][i].id) {
          this.boardObject = result['boards'][i];
          break;
        }
      }
    }, (error) => {
    }, (timeout) => {
    });
  }

  //http://www.newsmth.net/nForum/#!article/ADAgent_TG/1138845
  _renderItem = ({ item }) => (
    <View>

      {
        item.floor == 0 ?
          <View>
            <View style={styles.container}>
              <Text style={styles.subject}>{this.props.navigation.state.params.subject}</Text>
              <Text style={styles.replyCount}> {(parseInt(this.threadCount) - 1) + '回复'} </Text>
            </View>
            <HorizontalSeperatorLine />
          </View>
          :
          null
      }

      <View style={styles.container}>

        {/* {
          item.floor == 0 ?
            <View style={{ marginBottom: global.constants.Margin }}>
              <Text style={styles.subject}>{this.props.navigation.state.params.subject}</Text>
              <Text style={styles.replyCount}> {(parseInt(this.threadCount) - 1) + '回复'} </Text>
              <HorizontalSeperatorLine />
            </View>
            :
            null
        } */}

        {
          item.floor == 1
            ?
            (<View style={styles.sectionView} >
              <View style={styles.sectionVerticalLine} />
              <Text style={styles.sectionTitle} >
                {(parseInt(this.threadCount) - 1) + '回复'}
              </Text>
            </View>)
            :
            null
        }

        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
          <AvatorImage style={styles.avator}
            borderRadius={15}
            widthAndHeight={30}
            onPressClick={() => {
              this.props.navigation.navigate('newUserScreen', { id: null, name: item.author_id });
            }}
            uri={NetworkManager.net_getFace(item.author_id)} />

          <Text style={styles.author} >{item.author_id}</Text>
          {
            item.author_id == this.hostID
              ?
              <Text style={styles.host} >{'楼主'}</Text>
              :
              null
          }

          {
            item.floor != 0
              ?
              <ImageButton
                style={styles.imageButton}
                color={global.colors.gray2Color}
                width={44}
                height={44}
                margin={24}
                source={global.images.icon_moreif}
                onPress={() => {
                  this.selectMoreItemIndex = item.floor;
                  this.selectMoreItemName = item.author_id;
                  this.selectMoreItemReply = item.body;
                  this.selectMoreItemReplyID = item.id;
                  this.setState({});
                  setTimeout(() => {
                    this.itemMoreActionSheet.show()
                  }, 50);
                }} />
              :
              null
          }

        </View>
        <Text style={styles.time} >{(item.floor == 0 ? '' : (item.floor + '楼') + '  ') + item.time}</Text>
        <Text style={styles.body}>{item.body.trim()}</Text>
        <FlatList
          data={item.attachment_list}
          renderItem={this._attachmentImageItem}
        />
      </View>
      {
        item.floor == 0
          ?
          <HorizontalSeperatorLine />
          :
          <SeperatorLine />
      }
    </View>
  );

  _attachmentImageItem = ({ item }) => (
    <AutoHeightImage
      style={styles.image}
      width={global.constants.ScreenWidth - 26}
      imageURL={NetworkManager.net_getAttachmentImage(this.board, item.id, item.pos)}
    />
  );

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" />

        <NavigationBar
          title={this.state.screenStatus == global.screen.loading ? '' : global.boards.all[unescape(this.props.navigation.state.params.board)] == null ? this.props.navigation.state.params.board : global.boards.all[unescape(this.props.navigation.state.params.board)].name}
          message={this.state.screenStatus == global.screen.loading ? '' : unescape(this.props.navigation.state.params.board)}
          titleOnPress={() => {
            if (global.boards.all[unescape(this.props.navigation.state.params.board)] == null) {
              return;
            }
            this.props.navigation.navigate('newBoardListScreen', {
              id: global.boards.all[unescape(this.props.navigation.state.params.board)].id,
              name: global.boards.all[unescape(this.props.navigation.state.params.board)].name,
              title: unescape(this.props.navigation.state.params.board),
            });
          }}
          showBackButton={true}
          showBottomLine={true}
          navigation={this.props.navigation}
          rightButtonImage={this.state.screenStatus == global.screen.loading ? null : global.images.icon_more}
          rightButtonOnPress={() => {
            this.moreActionSheet.show();
          }}
        />

        <Screen status={this.state.screenStatus} text={this.state.screenText} onPress={() => {
          this.setState({
            screenStatus: global.screen.loading,
          });
          this.net_GetThread(this.from, this.size);
        }} >
          <FlatList
            ref="flatList"
            data={this.state.dataArray}
            renderItem={this._renderItem}
            style={styles.flatList}
            removeClippedSubviews={false}
            extraData={this.state}
          />

          <ThreadDetailBottomBarView
            currentPage={this.state.currentPage}
            totalPage={this.state.totalPage}
            onPreviousClick={() => {
              if (this.from == 0) return;
              this.setState({
                screenStatus: global.screen.loadingClear,
              });
              this.from = this.from - this.size;
              this.net_GetThread(this.from, this.size);
            }}
            onSelectClick={() => {
              this.setState({
                selectPageViewHidden: false,
                // backgroundMaskViewHidden: false,
              });
            }}
            onNextClick={() => {
              if (this.from + this.size > this.threadCount) return;
              this.setState({
                screenStatus: global.screen.loadingClear,
              });
              this.from = this.from + this.size;
              this.net_GetThread(this.from, this.size);
            }}
            onReplyClick={() => {
              this.props.navigation.navigate('replyThreadScreen',
                {
                  mid: this.props.navigation.state.params.id,
                  id: this.props.navigation.state.params.id,
                  board: this.board,
                  subject: this.props.navigation.state.params.subject,
                  body: '',
                });
            }}
          />

          <BackgroundMaskView height={Dimensions.get('window').height - global.constants.NavigationBarHeight}
            onPress={() => {
              this.setState({
                selectPageViewHidden: true,
                backgroundMaskViewHidden: true,
                floorActionViewHidden: true,
                moreViewHidden: true,
                currentPage: (parseInt(this.from / this.size) + 1).toString(),
              });
            }}
            hidden={this.state.backgroundMaskViewHidden}
          />

          {/* <ThreadDetailMoreView hidden={this.state.moreViewHidden}
            onShareClick={() => {
              this.setState({
                backgroundMaskViewHidden: true,
                moreViewHidden: true,
              });
              var shareManager = NativeModules.ShareManager;
              shareManager.share(this.props.navigation.state.params.subject, this.webURL);
            }}
            onCopyClick={() => {
              Clipboard.setString(this.webURL);
              ToastUtil.info('已复制到剪贴板');
            }}
            onSafariClick={() => {
              // Linking.openURL(this.webURL).catch(err => console.error('An error occurred', err));
              // this.setState({
              //   backgroundMaskViewHidden: true,
              //   moreViewHidden: true,
              // });

              Realm.open({
                schema: [{ name: 'Dog', properties: { name: 'string' } }]
              }).then(realm => {
                realm.write(() => {
                  realm.create('Dog', { name: 'Rex' });
                });
                this.setState({ realm });
              });

            }}
            onHistoryClick={() => {
              Linking.openURL(this.historyURL).catch(err => console.error('An error occurred', err));
              this.setState({
                backgroundMaskViewHidden: true,
                moreViewHidden: true,
              });
            }}
            onReportClick={() => {
              if (this.boardObject == null) return;
              var array = this.boardObject.manager.split(" ");
              if (array.length == 0) return;
              this.props.navigation.navigate('sendMessageScreen', {
                user: array[0],
                title: '举报 ' + this.hostID + ' 在 ' + this.board + ' 版中发表的内容',
                content: '\n' + this.webURL + '\n\n【以下为被举报的帖子内容】\n' + this.hostBody,
              });
              this.setState({
                backgroundMaskViewHidden: true,
                moreViewHidden: true,
              });
            }}
          /> */}

          <ThreadDetailBottomSelectPageView
            currentPage={this.state.currentPage}
            totalPage={this.state.totalPage}
            selectedValue={this.state.selectedValue}
            hidden={this.state.selectPageViewHidden}
            onCancelClick={() => {
              this.setState({
                selectPageViewHidden: true,
                backgroundMaskViewHidden: true,
                currentPage: (parseInt(this.from / this.size) + 1).toString(),
              });
            }}
            onFirstClick={() => {
              this.setState({
                screenStatus: global.screen.loadingClear,
                selectPageViewHidden: true,
                backgroundMaskViewHidden: true,
              });
              this.from = 0;
              this.net_GetThread(this.from, this.size);
            }}
            onLastClick={() => {
              this.setState({
                screenStatus: global.screen.loadingClear,
                selectPageViewHidden: true,
                backgroundMaskViewHidden: true,
              });
              this.from = (this.state.totalPage - 1) * this.size;
              this.net_GetThread(this.from, this.size);
            }}
            onCompleteClick={(page) => {
              if (page == (parseInt(this.from / this.size) + 1).toString()) {
                this.setState({
                  selectPageViewHidden: true,
                  backgroundMaskViewHidden: true,
                });
                return;
              }
              this.setState({
                screenStatus: global.screen.loadingClear,
                selectPageViewHidden: true,
                backgroundMaskViewHidden: true,
              });
              this.from = (page - 1) * this.size;
              this.net_GetThread(this.from, this.size);
            }}
            onValueChange={(page) => {
              this.setState({
                selectedValue: page,
              });
            }}
          />

          {/* <ThreadDetailFloorActionView
            hidden={this.state.floorActionViewHidden}
            floorItem={this.state.floorItem}
            onReplyClick={(floorItem) => {
              this.props.navigation.navigate('replyThreadScreen',
                {
                  mid: this.props.navigation.state.params.id,
                  id: floorItem.id,
                  board: this.board,
                  subject: this.props.navigation.state.params.subject,
                  body: floorItem.body,
                  author: floorItem.author_id,
                });
              this.setState({
                backgroundMaskViewHidden: true,
                floorActionViewHidden: true,
              });
            }}
            onSeeOnlyClick={(floorItem) => {
              this.setState({
                backgroundMaskViewHidden: true,
                floorActionViewHidden: true,
              });
            }}
            onReportClick={(floorItem) => {
              if (this.boardObject == null) return;
              var array = this.boardObject.manager.split(" ");
              if (array.length == 0) return;
              this.props.navigation.navigate('sendMessageScreen', {
                user: array[0],
                title: '举报 ' + floorItem.author_id + ' 在 ' + this.board + ' 版中发表的内容',
                content: '\n' + this.webURL + '\n\n【以下为被举报的帖子内容】\n' + floorItem.body,
              });
              this.setState({
                backgroundMaskViewHidden: true,
                floorActionViewHidden: true,
              });
            }}
            onCancelClick={() => {
              this.setState({
                backgroundMaskViewHidden: true,
                floorActionViewHidden: true,
              });
            }}
          /> */}

          <ActionSheet
            ref={o => this.moreActionSheet = o}
            title={this.title}
            // message={}
            options={['分享', '收藏', '从浏览器打开', '复制链接', '查看快照', '给楼主私信', '举报', '取消']}
            cancelButtonIndex={7}
            onPress={(index) => {
              //分享
              if (index == 0) {
                var shareManager = NativeModules.ShareManager;
                shareManager.share(this.props.navigation.state.params.subject, this.webURL);
              }
              //收藏
              else if (index == 1) {
                FavouriteThreadModel.create(
                  'old',
                  this.props.navigation.state.params.id,
                  this.board,
                  this.props.navigation.state.params.subject,
                  this.hostID,
                ).then(() => {
                  ToastUtil.info('已收藏');
                  DeviceEventEmitter.emit('RefreshFavouriteThreadNotification', null);
                }).catch((error) => {
                  ToastUtil.info('收藏失败');
                });
              }
              //从浏览器打开
              else if (index == 2) {
                Linking.openURL(this.webURL).catch(err => console.error('An error occurred', err));
              }
              //复制链接
              else if (index == 3) {
                Clipboard.setString(this.webURL);
                ToastUtil.info('已复制');
              }
              //查看快照
              else if (index == 4) {
                Linking.openURL(this.historyURL).catch(err => console.error('An error occurred', err));
              }
              //给楼主私信
              else if (index == 5) {
                this.props.navigation.navigate('newMessageSendScreen', { user: this.hostID })
              }
              //举报
              else if (index == 6) {
                if (this.boardObject == null) {
                  NetworkManager.net_QueryBoard(this.boardName, (result) => {
                    for (var i = 0; i < result['boards'].length; i++) {
                      if (this.boardName == result['boards'][i].id) {
                        this.boardObject = result['boards'][i];
                        break;
                      }
                    }
                    if (this.boardObject != null) {
                      var array = this.boardObject.manager.split(" ");
                      if (array.length == 0) return;
                      this.props.navigation.navigate('newMessageSendScreen', {
                        user: array[0],
                        title: '举报 ' + this.hostID + ' 在 ' + this.board + ' 版中发表的内容',
                        content: '\n' + this.webURL + '\n\n【以下为被举报的帖子内容】\n' + this.props.navigation.state.params.subject,
                      });
                    }

                  }, (error) => {
                  }, (timeout) => {
                  });
                }
                else {
                  var array = this.boardObject.manager.split(" ");
                  if (array.length == 0) return;
                  this.props.navigation.navigate('newMessageSendScreen', {
                    user: array[0],
                    title: '举报 ' + this.hostID + ' 在 ' + this.board + ' 版中发表的内容',
                    content: '\n' + this.webURL + '\n\n【以下为被举报的帖子内容】\n' + this.props.navigation.state.params.subject,
                  });
                }

              }
              else {

              }
            }}
          />

          <ActionSheet
            ref={o => this.itemMoreActionSheet = o}
            title={this.selectMoreItemIndex + '楼'}
            message={this.selectMoreItemName}
            options={['回复', '给 ' + this.selectMoreItemName + ' 私信', '举报', '取消']}
            cancelButtonIndex={3}
            onPress={(index) => {
              //回复
              if (index == 0) {
                if (global.login == true) {
                  this.props.navigation.navigate('replyThreadScreen',
                    {
                      mid: this.props.navigation.state.params.id,
                      id: this.selectMoreItemReplyID,
                      board: this.board,
                      subject: this.props.navigation.state.params.subject,
                      body: this.selectMoreItemReply,
                      author: this.selectMoreItemName,
                    });
                }
                else {
                  DeviceEventEmitter.emit('LoginNotification', null);
                }
              }
              //私信
              else if (index == 1) {
                this.props.navigation.navigate('newMessageSendScreen', { user: this.selectMoreItemName })
              }
              //举报
              else if (index == 2) {
                if (this.boardObject == null) {
                  NetworkManager.net_QueryBoard(this.boardName, (result) => {
                    for (var i = 0; i < result['boards'].length; i++) {
                      if (this.boardName == result['boards'][i].id) {
                        this.boardObject = result['boards'][i];
                        break;
                      }
                    }
                    if (this.boardObject != null) {
                      var array = this.boardObject.manager.split(" ");
                      if (array.length == 0) return;
                      this.props.navigation.navigate('newMessageSendScreen', {
                        user: array[0],
                        title: '举报 ' + this.selectMoreItemName + ' 在 ' + this.board + ' 版中发表的内容',
                        content: '\n' + this.webURL + '\n\n【以下为被举报的帖子内容】\n' + this.selectMoreItemReply,
                      });
                    }

                  }, (error) => {
                  }, (timeout) => {
                  });
                }
                else {
                  var array = this.boardObject.manager.split(" ");
                  if (array.length == 0) return;
                  this.props.navigation.navigate('newMessageSendScreen', {
                    user: array[0],
                    title: '举报 ' + this.selectMoreItemName + ' 在 ' + this.board + ' 版中发表的内容',
                    content: '\n' + this.webURL + '\n\n【以下为被举报的帖子内容】\n' + this.selectMoreItemReply,
                  });
                }
              }
              else {

              }
            }}
          />

        </Screen>
      </View>
    )
  }
}

var styles = {
  get flatList() {
    return {
      height: global.constants.ScreenHeight - 40 - global.constants.BottomSaveArea - global.constants.NavigationBarHeight,
      backgroundColor: global.colors.whiteColor,
    }
  },
  get container() {
    return {
      flex: 1,
      padding: global.constants.Padding,
    }
  },
  get subject() {
    return {
      lineHeight: global.constants.LineHeight,
      fontSize: global.configures.fontSize17,
      fontWeight: '600',
      color: global.colors.fontColor,
    }
  },
  get replyCount() {
    return {
      marginTop: 10,
      color: global.colors.gray1Color,
      fontSize: global.configures.fontSize15,
    }
  },
  get sectionView() {
    return {
      height: 30, flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: global.constants.Padding,
      marginTop: -global.constants.Padding,
      marginLeft: -global.constants.Padding,
      marginBottom: global.constants.Padding
    }
  },
  get sectionVerticalLine() {
    return {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: 2,
      backgroundColor: global.colors.themeColor,
    }
  },
  get sectionTitle() {
    return {
      fontSize: global.configures.fontSize16,
      // fontWeight: '600',
      color: global.colors.fontColor
    }
  },
  get board() {
    return {
      marginRight: 13,
      marginBottom: 10,
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
      fontSize: global.configures.fontSize16,
      color: global.colors.fontColor
    }
  },
  get host() {
    return {
      marginLeft: 6,
      paddingLeft: 3,
      paddingRight: 3,
      paddingTop: 3,
      paddingBottom: 2,
      fontSize: global.configures.fontSize10,
      color: global.colors.redColor,
      borderColor: global.colors.redColor,
      borderWidth: 1,
      borderRadius: 2,
      textAlign: 'center'
    }
  },
  get imageButton() {
    return {
      position: 'absolute',
      top: -global.constants.Padding,
      right: -global.constants.Padding + 4,
    }
  },
  get time() {
    return {
      marginTop: 10,
      fontSize: global.configures.fontSize13,
      color: global.colors.gray2Color
    }
  },
  get body() {
    return {
      marginTop: 10,
      lineHeight: global.constants.LineHeight,
      fontSize: global.configures.fontSize17,
      color: global.colors.fontColor,
    }
  },
  get image() {
    return {
      marginBottom: 13,
      marginLeft: 13,
    }
  },
}
