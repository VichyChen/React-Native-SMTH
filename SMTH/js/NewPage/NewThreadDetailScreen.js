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
import cio from 'cheerio-without-node-native';
import AutoHeightImage from 'react-native-auto-height-image';
import HTMLView from 'react-native-htmlview';
import ActionSheet from 'react-native-actionsheet'
import AsyncStorageManger from '../storage/AsyncStorageManger';

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
  NavigationBar,
  SectionBlankHeader
} from '../config/Common';

import {
  ScanRecordModel,
  FavouriteThreadModel
} from 'ModelModule';

export default class NewThreadDetailScreen extends Component {

  webURL;
  threadCount;
  totalPage;
  currentPage;
  title;
  hostID;     //楼主ID
  hostTime;
  hostBody;
  hostArticleId;
  wordage;
  boardID;
  boardName;
  boardTitle;
  boardObject;
  selectMoreItemIndex;
  selectMoreItemName;
  selectMoreItemMeta;
  selectMoreItemReply;
  selectMoreItemReplyID;
  scanRecord;
  page;
  likeCount;

  constructor(props) {
    super(props);
    this.state = {
      screenStatus: global.screen.loading,
      screenText: null,
      dataArray: [],
      backgroundMaskViewHidden: true,
      selectPageViewHidden: true,
      currentPage: 1,
      totalPage: 1,
      // selectedValue: '1',
      showMoreLike: false,
    }
    this.scanRecord = false;
    this.webURL = 'https://exp.newsmth.net/topic/' + (this.props.navigation.state.params.type == null ? '' : 'article/') + this.props.navigation.state.params.id;

    this.page = 1;
    this.getNewTopic(this.page);
  }

  componentWillUnmount() {
    // this.subscription.remove();
    DeviceEventEmitter.emit('RefreshScanRecordNotification', null);
  }

  getNewTopic(page) {
    NetworkManager.getNewTopic(this.props.navigation.state.params.type, this.props.navigation.state.params.id, page, (result) => {
      var array = [];

      this.$ = cio.load(result, { decodeEntities: false });
      var currentPage = this.$('.active').children().first().text() == null ? 1 : this.$('.active').children().first().text();
      this.totalPage = this.$('.pagination').children().last().attr('class') == 'disabled' ? currentPage : this.$('.pagination').children().last().children().attr('href').split('/')[3];
      this.likeCount = this.$('.article-likes').children().first().children().first().text();

      //第一页
      if (page == 1) {
        //帖子总数
        this.threadCount = this.$('.reply-list').children().first().children().first().children().first().children().first().text();
        this.hostID = this.$('.avatar').children().first().attr('title');
        this.hostTime = this.$('.publish-time').text();
        this.hostBody = this.$('.show-content').html().trim();
        this.hostArticleId = this.$('.follow-detail').children().first().children().first().next().attr('href').split('/')[3];
        this.boardID = this.$('.notebook').attr('href').split('/')[2];
        this.boardName = this.$('.notebook').children().first().next().text();
        this.boardTitle = this.$('.notebook').children().last().text();

        this.$ = cio.load(result, { decodeEntities: false });
        this.$ = cio.load(this.$('div[class=article]').html(), { decodeEntities: false });

        this.title = this.$('.title').text();
        //标题
        array.push({
          key: array.length,
          section: 0,
          title: this.title,
        });

        //楼主图片
        var images = this.$('div[class=image-package]').html();
        var attachment_list = [];
        if (images != null) {
          this.$ = cio.load(this.$('div[class=image-package]').html(), { decodeEntities: false });
          this.$('a').each(function (i, elem) {
            this.$ = cio.load(elem, { decodeEntities: false });
            attachment_list.push({
              key: attachment_list.length,
              url: this.$('img').attr('src')
            });
          });
        }

        this.$ = cio.load(result, { decodeEntities: false });
        this.$ = cio.load(this.$('div[class=article]').html(), { decodeEntities: false });
        this.$('.image-package').remove();
        this.$('.image-caption').remove();

        this.wordage = this.$('.wordage').text();
        //楼主
        array.push({
          key: array.length,
          section: 1,
          avatar: this.$('.avatar').children().first().attr('src'),
          avatarID: this.$('.avatar').attr('href').split('/')[2],
          name: this.$('.avatar').children().first().attr('title'),
          meta: this.$('.meta').children().first().text(),
          time: this.$('.publish-time').text(),
          wordage: this.$('.wordage').text(),
          attachment_list: attachment_list,
          reply: this.$('.show-content').html().trim(),
        });
        //like
        this.$ = cio.load(result, { decodeEntities: false });
        var like = this.$('div[class=like-list]').html();
        if (like != null) {
          this.$ = cio.load(this.$('div[class=like-list]').html(), { decodeEntities: false });
          this.$('div[class=like]').each(function (i, elem) {
            this.$ = cio.load(elem, { decodeEntities: false });

            var score = this.$('div[class*=score-bad]').text();
            if (score.length == 0) {
              score = this.$('div[class*=score-good]').text();
            }

            array.push({
              key: array.length,
              index: i,
              section: 2,
              avatar: this.$('.avatar').children().attr('src'),
              avatarID: this.$('.name').children().first().attr('href').split('/')[2],
              name: this.$('.name').children().first().text(),
              meta: this.$('.name').next().text(),
              time: this.$('.name').next().next().text(),
              reply: this.$('.text').html().trim(),
              score: score.trim(),
            });
          });
        }
        //
        array.push({
          key: array.length,
          section: 4,
        });
      }

      //回复
      this.$ = cio.load(result);
      var reply = this.$('div[class=reply-list]').html();
      if (reply != null) {
        this.$ = cio.load(this.$('div[class=reply-list]').html());
        this.$('div[class=reply]').each(function (i, elem) {
          this.$ = cio.load(elem, { decodeEntities: false });
          var images = this.$('div[class=image-package]').html();
          var attachment_list = [];
          if (images != null) {
            this.$ = cio.load(this.$('div[class=image-package]').html(), { decodeEntities: false });
            this.$('a').each(function (i, elem) {
              this.$ = cio.load(elem, { decodeEntities: false });
              attachment_list.push({
                key: attachment_list.length,
                url: this.$('img').attr('src')
              });
            });
          }

          this.$ = cio.load(elem, { decodeEntities: false });
          var replyID = this.$('div[class=tool-group]').children().last().attr('href').split('/')[3];
          this.$('.tool-group').remove();
          this.$('.article-quote').prev().remove();
          this.$('.article-quote').children().last().remove();
          var quote = this.$('div[class=article-quote]').html();
          this.$('.article-quote').remove();
          this.$('.image-package').remove();
          this.$('.image-caption').remove();

          array.push({
            key: array.length,
            index: currentPage == 1 ? (i + 1) : (i + ((currentPage - 1) * 20)),
            section: 3,
            avatar: this.$('a[class=avatar]').children().attr('src'),
            avatarID: this.$('.avatar').attr('href').split('/')[2],
            name: this.$('a[class=name]').text(),
            meta: this.$('div[class=meta]').children().first().text(),
            time: this.$('div[class=meta]').children().last().text(),
            attachment_list: attachment_list,
            replyID: replyID,
            reply: this.$('div[class=reply-wrap]').html().trim(),
            quote: quote,
          });
        });
      }

      //分区
      this.$ = cio.load(result);
      var second = this.$('div[id=bs-example-navbar-collapse-1]').children().first().children().first().next().text().trim();
      //有登陆
      if (second.indexOf("成员") != -1) {
        AsyncStorageManger.setLogin(true);
        this.$ = cio.load(this.$('div[id=bs-example-navbar-collapse-1]').children().first().children().first().next().next().next().html());
      }
      //没登陆
      else {
        AsyncStorageManger.setLogin(false);
        this.$ = cio.load(this.$('div[id=bs-example-navbar-collapse-1]').children().first().children().first().next().html());
      }
      this.$ = cio.load(this.$('.dropdown-menu').html());
      this.$('li[class=divider]').next().remove();
      this.$('li[class=divider]').remove();

      var sectionArray = new Array();
      this.$('li').each(function (i, elem) {
        this.$ = cio.load(elem);
        sectionArray.push({
          key: this.$('a').attr('href').split('/')[2],
          title: this.$('a').text(),
        });
      });
      AsyncStorageManger.setSectionArray(sectionArray);


      if (page == 1 && array.length == 0) {
        this.setState({
          screenStatus: global.screen.none,
          screenText: '帖子不存在',
        });
      }
      else {
        this.setState({
          dataArray: array,
          totalPage: this.totalPage,
          currentPage: page,
          selectedValue: page.toString(),
          screenStatus: global.screen.none,
          screenText: null,
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
          'new',
          this.props.navigation.state.params.id,
          this.boardName,
          this.title,
          this.hostID,
          this.hostTime
        ).then(() => {
          this.scanRecord = true;
        }).catch((error) => {
          this.scanRecord == false
        });
      }

    }, (error) => {
      ToastUtil.info(error);
      this.setState({
        screenStatus: this.state.screenStatus == global.screen.loading ? global.screen.textImage : global.screen.none,
        screenText: error,
      });
    }, (errorMessage) => {
      ToastUtil.info(errorMessage);
      this.setState({
        screenStatus: this.state.screenStatus == global.screen.loading ? global.screen.networkError : global.screen.none,
      });
    });
  }

  _renderItem = ({ item }) => {
    //标题
    if (item.section == 0) {
      return (
        <View>
          <View style={[styles.container, {}]} >
            <Text style={styles.title} >{item.title}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }} >
              <Text style={styles.wordage} >
                {
                  (this.wordage.length > 0 ? (this.wordage.split(' ')[1] + '字数 ') : '') +
                  (this.threadCount.length > 0 ? (this.threadCount.split(' ')[0] + '回复 ') : '')
                }
              </Text>
            </View>
          </View>
          <HorizontalSeperatorLine />
        </View>
      );
    }
    //楼主
    else if (item.section == 1) {
      return (
        <View>
          <View>
            <View style={styles.container} >
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                <AvatorImage
                  borderRadius={15}
                  widthAndHeight={30}
                  onPressClick={() => {
                    this.props.navigation.navigate('newUserScreen', { id: item.avatarID, name: item.name });
                  }}
                  uri={NetworkManager.net_getFace(item.name)}
                />

                <Text style={styles.itemName} >{item.name}</Text>
                <Text style={styles.itemMeta} >{item.meta}</Text>
                {
                  item.name == this.hostID
                    ?
                    <Text style={styles.itemHost} >{'楼主'}</Text>
                    :
                    null
                }
              </View>
              <Text style={styles.itemTime} >{item.time}</Text>
              <FlatList
                data={item.attachment_list}
                renderItem={this._attachmentImageItem}
              />
              <View style={[styles.itemReplyView, styles.itemReplyViewNoQuote]} >
                <HTMLView value={item.reply} stylesheet={styles.itemReply} />
              </View>
            </View>
            <HorizontalSeperatorLine />

          </View>
          {
            this.likeCount.length > 0
              ?
              <View style={styles.sectionView} >
                <View style={styles.sectionVerticalLine} />
                <Text style={styles.sectionTitle} >
                  {this.likeCount.split(' ')[0] + ' Like'}
                </Text>
              </View>
              :
              null
          }
        </View>

      );
    }
    //like
    else if (item.section == 2) {
      if (this.state.showMoreLike == false && item.index == 5) {
        return (
          <Button
            style={styles.moreLikeButton}
            onPress={() => {
              this.setState({
                showMoreLike: true,
              });
            }}
            text='点击显示更多Like'
          />
        );
      }
      else if (this.state.showMoreLike == false && item.index > 5) {
        return null;
      }
      else {
        return (
          <View style={{
            flex: 1,
            paddingTop: 10,
            paddingBottom: 0,
            paddingLeft: global.constants.Padding * 2,
            paddingRight: global.constants.Padding * 2,
            backgroundColor: global.colors.whiteColor
          }} >
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
              <AvatorImage
                borderRadius={10}
                widthAndHeight={20}
                onPressClick={() => {
                  this.props.navigation.navigate('newUserScreen', { id: item.avatarID, name: item.name });
                }}
                uri={NetworkManager.net_getFace(item.name)}
              />
              <View style={{
                flex: 1,
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                marginLeft: 10,
                marginRight: 10,
              }}>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                  <Text style={styles.likeItemName} >{item.name.trim()}</Text>
                  {/* {item.meta.length > 0 ? <Text style={styles.likeItemMeta} >{item.meta}</Text> : null}
                  {item.time.trim().length > 0 ? <Text style={styles.likeItemTime} >{item.time.trim()}</Text> : null} */}

                  <Text style={styles.likeItemMeta} >
                    {(item.meta.trim().length > 0 ? (item.meta.trim() + ' ') : '') + item.time.trim()}
                  </Text>

                </View>
                <Text style={styles.likeItemReply} >
                  {
                    item.score.length > 0
                      ?
                      <Text style={[styles.likeItemReply, { fontWeight: 'bold', color: (item.score > 0 ? 'red' : 'green') }]} >
                        {(item.score > 0 ? '+' + item.score : item.score) + ' '}
                      </Text>
                      : null
                  }
                  {item.reply}
                </Text>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                  <View style={{ flex: 1, marginTop: 5, height: 1, backgroundColor: global.colors.seperatorColor }} />
                </View>
              </View>
            </View>

          </View>
        );
      }
    }
    //回复
    else if (item.section == 3) {
      return (
        <View>
          <View style={styles.container} >
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
              <AvatorImage
                borderRadius={15}
                widthAndHeight={30}
                onPressClick={() => {
                  this.props.navigation.navigate('newUserScreen', { id: item.avatarID, name: item.name });
                }}
                uri={NetworkManager.net_getFace(item.name)}
              />

              <Text style={styles.itemName} >{item.name}</Text>
              <Text style={styles.itemMeta} >{item.meta}</Text>
              {
                item.name == this.hostID
                  ?
                  <Text style={styles.itemHost} >{'楼主'}</Text>
                  :
                  null
              }
            </View>
            <Text style={styles.itemTime} >{(item.index + '楼') + '  ' + item.time}</Text>
            <FlatList
              data={item.attachment_list}
              renderItem={this._attachmentImageItem}
            />
            <View style={[styles.itemReplyView, (item.quote == null ? styles.itemReplyViewNoQuote : null)]} >
              <HTMLView value={item.reply} stylesheet={styles.itemReply} />
            </View>
            {(
              item.quote != null
                ?
                <View style={styles.itemQuoteView} >
                  <HTMLView value={item.quote} stylesheet={styles.itemQuote} />
                </View>
                :
                null
            )}
          </View>
          <ImageButton
            style={styles.itemMore}
            color={global.colors.gray2Color}
            width={44}
            height={44}
            margin={24}
            source={global.images.icon_moreif}
            onPress={() => {
              this.selectMoreItemIndex = item.index;
              this.selectMoreItemName = item.name;
              this.selectMoreItemMeta = item.meta;
              this.selectMoreItemReply = item.reply;
              this.selectMoreItemReplyID = item.replyID;
              this.setState({});
              setTimeout(() => {
                this.itemMoreActionSheet.show()
              }, 50);
            }} />
          <SeperatorLine />
        </View>
      );
    }
    else if (item.section == 4) {
      return (
        <View>
          {
            this.likeCount.length > 0
              ?
              <HorizontalSeperatorLine />
              :
              null
          }

          {
            this.threadCount.length > 0
              ?
              (<View style={styles.sectionView} >
                <View style={styles.sectionVerticalLine} />
                <Text style={styles.sectionTitle} >
                  {this.threadCount.split(' ')[0] + ' 回复 '}
                </Text>
              </View>)
              :
              null
          }

        </View>
      );
    }
  };

  _attachmentImageItem = ({ item }) => (
    <View style={{
      marginTop: 15, backgroundColor: global.colors.backgroundGrayColor
    }}>
      <AutoHeightImage
        style={styles.itemImage}
        width={global.constants.ScreenWidth - global.constants.Padding * 2}
        imageURL={'https://exp.newsmth.net/' + item.url}
        onHeightChange={(height) => {

        }}
      />
    </View>
  );

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" />
        <NavigationBar
          title={this.boardTitle}
          message={this.boardName}
          titleOnPress={() => {
            this.props.navigation.navigate('newBoardListScreen', {
              id: this.boardID,
              name: this.boardTitle,
              title: this.boardName,
            });
          }}
          showBackButton={true}
          showBottomLine={true}
          navigation={this.props.navigation}
          rightButtonImage={this.state.screenStatus == global.screen.loading ? null : global.images.icon_more}
          rightButtonOnPress={() => {
            this.moreActionSheet.show()
          }}
        />

        <Screen status={this.state.screenStatus} text={this.state.screenText} onPress={() => {
          this.setState({
            screenStatus: global.screen.loading,
          });
          this.getNewTopic(this.page);
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
              if (this.page == 1) return;
              this.setState({
                screenStatus: global.screen.loadingClear,
              });
              this.page = this.page - 1;
              this.getNewTopic(this.page);
            }}
            onSelectClick={() => {
              this.setState({
                selectPageViewHidden: false,
                // backgroundMaskViewHidden: false,
              });
            }}
            onNextClick={() => {
              if (this.page + 1 > this.totalPage) return;
              this.setState({
                screenStatus: global.screen.loadingClear,
              });
              this.page = this.page + 1;
              this.getNewTopic(this.page);
            }}
            onReplyClick={() => {
              if (global.login == true) {
                this.props.navigation.navigate('newReplyThreadScreen',
                  {
                    id: this.hostArticleId,
                    title: this.title,
                    body: '',
                  });
              }
              else {
                DeviceEventEmitter.emit('LoginNotification', null);
              }
            }}
          />

          <ThreadDetailBottomSelectPageView
            currentPage={this.state.currentPage}
            totalPage={this.state.totalPage}
            selectedValue={this.state.selectedValue}
            hidden={this.state.selectPageViewHidden}
            onCancelClick={() => {
              this.setState({
                selectPageViewHidden: true,
                backgroundMaskViewHidden: true,
                currentPage: this.page.toString(),
              });
            }}
            onFirstClick={() => {
              this.setState({
                screenStatus: global.screen.loadingClear,
                selectPageViewHidden: true,
                backgroundMaskViewHidden: true,
              });
              this.page = 1;
              this.getNewTopic(this.page);
            }}
            onLastClick={() => {
              this.setState({
                screenStatus: global.screen.loadingClear,
                selectPageViewHidden: true,
                backgroundMaskViewHidden: true,
              });
              this.page = this.totalPage;
              this.getNewTopic(this.page);
            }}
            onCompleteClick={(p) => {
              if (p == this.page.toString()) {
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
              this.page = p;
              this.getNewTopic(this.page);
            }}
            onValueChange={(page) => {
              this.setState({
                selectedValue: page,
              });
            }}
          />

          <ActionSheet
            ref={o => this.moreActionSheet = o}
            title={this.title}
            // message={}
            options={['分享', '收藏', '从浏览器打开', '复制链接', '给楼主私信',/*'查看快照',*/ '举报', '取消']}
            cancelButtonIndex={6}
            onPress={(index) => {
              //分享
              if (index == 0) {
                var shareManager = NativeModules.ShareManager;
                shareManager.share(this.title, this.webURL);
              }
              //收藏
              else if (index == 1) {
                FavouriteThreadModel.create(
                  'new',
                  this.props.navigation.state.params.id,
                  this.boardName,
                  this.title,
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
              //给楼主私信
              else if (index == 4) {
                this.props.navigation.navigate('newMessageSendScreen', { user: this.hostID })
              }
              //举报
              else if (index == 5) {
                if (global.login == true) {
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
                          title: '举报 ' + this.hostID + ' 在 ' + this.boardName + ' 版中发表的内容',
                          content: '\n' + this.webURL + '\n\n【以下为被举报的帖子内容】\n' + this.title,
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
                      title: '举报 ' + this.hostID + ' 在 ' + this.boardName + ' 版中发表的内容',
                      content: '\n' + this.webURL + '\n\n【以下为被举报的帖子内容】\n' + this.title,
                    });
                  }
                }
                else {
                  DeviceEventEmitter.emit('LoginNotification', null);
                }
              }
              else {

              }
            }}
          />

          <ActionSheet
            ref={o => this.itemMoreActionSheet = o}
            title={this.selectMoreItemIndex + '楼'}
            message={this.selectMoreItemName + ' ' + this.selectMoreItemMeta}
            options={['回复', '给 ' + this.selectMoreItemName + ' 私信', '举报', '取消']}
            cancelButtonIndex={3}
            onPress={(index) => {
              //回复
              if (index == 0) {
                if (global.login == true) {
                  this.props.navigation.navigate('newReplyThreadScreen',
                    {
                      id: this.selectMoreItemReplyID,
                      author: this.selectMoreItemName,
                      title: this.title,
                      body: this.selectMoreItemReply,
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
                if (global.login == true) {
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
                          title: '举报 ' + this.selectMoreItemName + ' 在 ' + this.boardName + ' 版中发表的内容',
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
                      title: '举报 ' + this.selectMoreItemName + ' 在 ' + this.boardName + ' 版中发表的内容',
                      content: '\n' + this.webURL + '\n\n【以下为被举报的帖子内容】\n' + this.selectMoreItemReply,
                    });
                  }
                }
                else {
                  DeviceEventEmitter.emit('LoginNotification', null);
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
      backgroundColor: global.colors.whiteColor
    }
  },
  get title() {
    return {
      lineHeight: global.constants.LineHeight,
      fontSize: global.configures.fontSize17,
      fontWeight: 'bold',
      color: global.colors.fontColor
    }
  },
  get sectionView() {
    return {
      height: 30, flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: global.constants.Padding
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
      // fontWeight: 'bold',
      color: global.colors.fontColor
    }
  },
  get itemBoard() {
    return {
      marginTop: 10,
      paddingLeft: 4,
      paddingRight: 4,
      alignItems: 'center',
      fontSize: global.configures.fontSize14,
      color: global.colors.redColor,
      borderColor: global.colors.redColor,
      borderWidth: 1,
      borderRadius: 2,
      height: 18,
      textAlign: 'center'
    }
  },
  get wordage() {
    return {
      marginTop: 10,
      fontSize: global.configures.fontSize13,
      color: global.colors.gray2Color
    }
  },
  get likeItemName() {
    return {
      fontSize: global.configures.fontSize15,
      color: global.colors.fontColor
    }
  },
  get likeItemMeta() {
    return {
      marginLeft: 5,
      fontSize: global.configures.fontSize13,
      color: global.colors.gray2Color
    }
  },
  get likeItemTime() {
    return {
      marginLeft: 5,
      fontSize: global.configures.fontSize13,
      color: global.colors.gray2Color
    }
  },
  get likeItemReply() {
    return {
      marginTop: 5,
      marginBottom: 5,
      lineHeight: global.constants.LineHeight - 2,
      fontSize: global.configures.fontSize15,
      color: global.colors.fontColor
    }
  },
  get moreLikeButton() {
    return {
      marginTop: 10,
      marginBottom: 10,
    }
  },
  get itemContainer() {
    return {
      flex: 1,
      flexDirection: 'column',
      padding: global.constants.Padding,
      backgroundColor: global.colors.whiteColor
    }
  },
  get itemName() {
    return {
      marginLeft: 10,
      fontSize: global.configures.fontSize16,
      color: global.colors.fontColor
    }
  },
  get itemMeta() {
    return {
      marginLeft: 5,
      fontSize: global.configures.fontSize13,
      color: global.colors.gray1Color
    }
  },
  get itemHost() {
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
  get itemTime() {
    return {
      marginTop: 10,
      fontSize: global.configures.fontSize13,
      color: global.colors.gray2Color
    }
  },
  get itemTitle() {
    return {
      marginTop: 10,
      fontSize: global.configures.fontSize17,
      fontWeight: 'bold',
      color: global.colors.fontColor
    }
  },
  get itemImage() {
    return {
    }
  },
  get itemReplyView() {
    return {
      marginTop: 15,
      paddingBottom: 15,
      backgroundColor: global.colors.clearColor
    }
  },
  get itemReplyViewNoQuote() {
    return {
      marginBottom: -30,
    }
  },
  get itemReply() {
    return {
      p: {
        marginBottom: -15,
        lineHeight: global.constants.LineHeight,
        fontSize: global.configures.fontSize16,
        color: global.colors.fontColor,
      },
    }
  },
  get itemQuoteView() {
    return {
      marginTop: 20,
      marginBottom: 5,
      paddingBottom: 25,
      borderLeftWidth: 2,
      borderLeftColor: global.colors.gray4Color,
    }
  },
  get itemQuote() {
    return {
      p: {
        marginBottom: -25,
        marginLeft: 10,
        lineHeight: global.constants.LineHeight,
        fontSize: global.configures.fontSize15,
        color: global.colors.gray2Color,
      },
    }
  },
  get itemMore() {
    return {
      position: 'absolute',
      top: 0,
      right: 5,
    }
  },
}
