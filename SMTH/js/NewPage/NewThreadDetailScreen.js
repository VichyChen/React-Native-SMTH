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
  WebView
} from 'react-native';
import { NativeModules } from 'react-native';
import cio from 'cheerio-without-node-native';

import AutoHeightImage from 'react-native-auto-height-image';
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
  BoardModel
} from 'ModelModule';

import HTMLView from 'react-native-htmlview';
import ActionSheet from 'react-native-actionsheet'
import AsyncStorageManger from '../storage/AsyncStorageManger';

var webURL;
var threadCount;
var totalPage;
var currentPage;
var title;
var hostID;     //楼主ID
var hostBody;
var hostArticleId;
var wordage;
var boardID;
var boardName;
var boardTitle;

var selectMoreItemIndex;
var selectMoreItemName;
var selectMoreItemMeta;
var selectMoreItemReply;

var scanRecord;
var page;

var likeCount;

export default class NewThreadDetailScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: '详情',
    headerRight: navigation.state.params ? navigation.state.params.headerRight : null
  });

  constructor(props) {
    super(props);
    this.state = {
      firstLoading: true,
      viewLoading: true,
      loadingType: 'background',
      screenText: null,
      dataArray: [],
      backgroundMaskViewHidden: true,
      selectPageViewHidden: true,
      floorActionViewHidden: true,
      moreViewHidden: true,
      currentPage: 1,
      totalPage: 1,
      // selectedValue: '1',
      showMoreLike: false,
    }
    scanRecord = false;

    webURL = 'https://exp.newsmth.net/topic/' + this.props.navigation.state.params.id;

    page = 1;
    this.getNewTopic(page);
  }


  getNewTopic(page) {
    NetworkManager.getNewTopic(this.props.navigation.state.params.id, page, (result) => {
      var array = [];

      this.$ = cio.load(result, { decodeEntities: false });
      currentPage = this.$('.active').children().first().text() == null ? 1 : this.$('.active').children().first().text();
      // totalPage = this.$('.pagination').children().last().children().attr('href') == 'javascript:void(0);' ? (this.$('.pagination').children().last().attr('class') == 'disabled' ? 1 : 1) : this.$('.pagination').children().last().children().attr('href').split('/')[3];
      totalPage = this.$('.pagination').children().last().attr('class') == 'disabled' ? currentPage : this.$('.pagination').children().last().children().attr('href').split('/')[3];
      likeCount = this.$('.article-likes').children().first().children().first().text();

      //第一页
      if (page == 1) {
        //帖子总数
        threadCount = this.$('.reply-list').children().first().children().first().children().first().children().first().text();
        hostID = this.$('.avatar').children().first().attr('title');
        hostBody = this.$('.show-content').html().trim();
        hostArticleId = this.$('.follow-detail').children().first().children().first().next().attr('href').split('/')[3];
        boardID = this.$('.notebook').attr('href').split('/')[2];
        boardName = this.$('.notebook').children().first().next().text();
        boardTitle = this.$('.notebook').children().last().text();

        this.$ = cio.load(result, { decodeEntities: false });
        this.$ = cio.load(this.$('div[class=article]').html(), { decodeEntities: false });

        title = this.$('.title').text();
        //标题
        array.push({
          key: array.length,
          section: 0,
          title: title,
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

        wordage = this.$('.wordage').text();
        //楼主
        array.push({
          key: array.length,
          section: 1,
          avatar: this.$('.avatar').children().first().attr('src'),
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
            name: this.$('a[class=name]').text(),
            meta: this.$('div[class=meta]').children().first().text(),
            time: this.$('div[class=meta]').children().last().text(),
            attachment_list: attachment_list,
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
          firstLoading: false,
          viewLoading: false,
          screenText: '帖子不存在，可以尝试从浏览器打开或查看快照',
        });
      }

      // else {
      this.setState({
        dataArray: array,
        totalPage: totalPage, //抓取,
        currentPage: page,
        selectedValue: page.toString(),
        firstLoading: false,
        viewLoading: false,
        screenText: null,
      });

      this.refs.flatList.scrollToOffset({ offset: 1, animated: true })
      setTimeout(() => {
        this.refs.flatList.scrollToOffset({ offset: 0, animated: true })
      }, 50);
      // }

    }, (error) => {

    }, (errorMessage) => {

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
              <Text style={[styles.itemBoard, { paddingTop: 1 }]} >{boardName}</Text>
              <Text style={[styles.itemBoard, { marginLeft: 8, marginRight: 8, paddingTop: 3 }]} >{boardTitle}</Text>
              <Text style={styles.wordage} >
                {
                  (wordage.length > 0 ? (wordage.split(' ')[1] + '字数 ') : '') +
                  (threadCount.length > 0 ? (threadCount.split(' ')[0] + '回复 ') : '')
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
                    // this.props.navigation.navigate('userScreen', { id: item.author_id });
                  }}
                  uri={'https://exp.newsmth.net/' + item.avatar} />

                <Text style={styles.itemName} >{item.name}</Text>
                <Text style={styles.itemMeta} >{item.meta}</Text>
                {
                  item.name == hostID
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
            <SeperatorLine />

          </View>
          {
            likeCount.length > 0
              ?
              <View style={{ backgroundColor: global.colors.whiteColor, padding: global.constants.Padding }}>
                <Text style={styles.title} >{likeCount.split(' ')[0] + '个赞'}</Text>
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
            text='点击显示更多的赞'
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
                borderRadius={8}
                widthAndHeight={16}
                onPressClick={() => {
                  // this.props.navigation.navigate('userScreen', { id: item.author_id });
                }}
                uri={'https://exp.newsmth.net/' + item.avatar} />
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
                  // this.props.navigation.navigate('userScreen', { id: item.author_id });
                }}
                uri={'https://exp.newsmth.net/' + item.avatar} />

              <Text style={styles.itemName} >{item.name}</Text>
              <Text style={styles.itemMeta} >{item.meta}</Text>
              {
                item.name == hostID
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
            source={global.images.icon_more}
            onPress={() => {
              selectMoreItemIndex = item.index;
              selectMoreItemName = item.name;
              selectMoreItemMeta = item.meta;
              selectMoreItemReply = item.reply;
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
        <SectionBlankHeader height={5} />
      );
    }
  };

  _attachmentImageItem = ({ item }) => (
    <AutoHeightImage
      style={styles.itemImage}
      width={global.constants.ScreenWidth - global.constants.Padding * 2}
      imageURL={'https://exp.newsmth.net/' + item.url}
    />
  );

  render() {
    return (
      <View style={{ flex: 1 }}>

        <NavigationBar
          title='帖子详情'
          showBackButton={true}
          navigation={this.props.navigation}
          rightButtonImage={global.images.icon_more}
          rightButtonOnPress={() => {
            this.moreActionSheet.show()
          }}
        />

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
            this.getNewTopic(page);
          }}
        >
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
              if (page == 1) return;
              this.setState({
                viewLoading: true,
                loadingType: 'none',
              });
              page = page - 1;
              this.getNewTopic(page);
            }}
            onSelectClick={() => {
              this.setState({
                selectPageViewHidden: false,
                // backgroundMaskViewHidden: false,
              });
            }}
            onNextClick={() => {
              if (page + 1 > totalPage) return;
              this.setState({
                viewLoading: true,
                loadingType: 'none',
              });
              page = page + 1;
              this.getNewTopic(page);
            }}
            onReplyClick={() => {
              if (global.login == true) {
                this.props.navigation.navigate('newReplyThreadScreen',
                  {
                    id: hostArticleId,
                    body: '',
                  });
              }
              else {
                DeviceEventEmitter.emit('LoginNotification', null);
              }
              // this.showActionSheet(); return;

            }}
          />
          {/*
          <BackgroundMaskView height={Dimensions.get('window').height - global.constants.NavigationBarHeight}
            onPress={() => {
              this.setState({
                selectPageViewHidden: true,
                backgroundMaskViewHidden: true,
                floorActionViewHidden: true,
                moreViewHidden: true,
                currentPage: (parseInt(from / size) + 1).toString(),
              });
            }}
            hidden={this.state.backgroundMaskViewHidden}
          />

          <ThreadDetailMoreView hidden={this.state.moreViewHidden}
            onShareClick={() => {
              this.setState({
                backgroundMaskViewHidden: true,
                moreViewHidden: true,
              });
              var shareManager = NativeModules.ShareManager;
              shareManager.share(this.props.navigation.state.params.subject, webURL);
            }}
            onCopyClick={() => {
              Clipboard.setString(webURL);
              ToastUtil.info('已复制到剪贴板');
            }}
            onSafariClick={() => {
              // Linking.openURL(webURL).catch(err => console.error('An error occurred', err));
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
              // Linking.openURL(historyURL).catch(err => console.error('An error occurred', err));
              this.setState({
                backgroundMaskViewHidden: true,
                moreViewHidden: true,
              });
            }}
            onReportClick={() => {
              if (boardObject == null) return;
              var array = boardObject.manager.split(" ");
              if (array.length == 0) return;
              this.props.navigation.navigate('sendMessageScreen', {
                user: array[0],
                title: '举报 ' + hostID + ' 在 ' + board + ' 版中发表的内容',
                content: '\n' + webURL + '\n\n【以下为被举报的帖子内容】\n' + hostBody,
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
                currentPage: page.toString(),
              });
            }}
            onFirstClick={() => {
              this.setState({
                viewLoading: true,
                loadingType: 'none',
                selectPageViewHidden: true,
                backgroundMaskViewHidden: true,
              });
              page = 1;
              this.getNewTopic(page);
            }}
            onLastClick={() => {
              this.setState({
                viewLoading: true,
                loadingType: 'none',
                selectPageViewHidden: true,
                backgroundMaskViewHidden: true,
              });
              page = totalPage;
              this.getNewTopic(page);
            }}
            onCompleteClick={(p) => {
              if (p == page.toString()) {
                this.setState({
                  selectPageViewHidden: true,
                  backgroundMaskViewHidden: true,
                });
                return;
              }
              this.setState({
                viewLoading: true,
                loadingType: 'none',
                selectPageViewHidden: true,
                backgroundMaskViewHidden: true,
              });
              page = p;
              this.getNewTopic(page);
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
                  board: board,
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
              if (boardObject == null) return;
              var array = boardObject.manager.split(" ");
              if (array.length == 0) return;
              this.props.navigation.navigate('sendMessageScreen', {
                user: array[0],
                title: '举报 ' + floorItem.author_id + ' 在 ' + board + ' 版中发表的内容',
                content: '\n' + webURL + '\n\n【以下为被举报的帖子内容】\n' + floorItem.body,
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
            title={title}
            // message={}
            options={['分享到...', '复制链接', '从浏览器打开', '给楼主寄信',/*'查看快照',*/ '前往 ' + boardTitle, '举报', '取消']}
            cancelButtonIndex={6}
            onPress={(index) => {

            }}
          />

          <ActionSheet
            ref={o => this.itemMoreActionSheet = o}
            title={selectMoreItemIndex + '楼'}
            message={selectMoreItemName + ' ' + selectMoreItemMeta}
            options={['回复', '给 ' + selectMoreItemName + ' 寄信', '举报', '取消']}
            cancelButtonIndex={3}
            onPress={(index) => {


            }}
          />

        </Screen>
      </View>

    )
  }

  showActionSheet = () => {
    this.ActionSheet.show()
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
      fontSize: global.configures.fontSize17,
      fontWeight: 'bold',
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
      marginTop: 15,
      backgroundColor: global.colors.backgroundColor
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
