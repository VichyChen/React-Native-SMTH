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

var webURL;
var historyURL;
var from = 0;
var size;
var threadCount;
var totalPage;
var hostID;     //楼主ID
var hostTime;
var hostBody;
var board;
var boardName;
var boardObject;

var scanRecord;
var page;

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
    }
    size = global.configures.pageSize;
    board = unescape(this.props.navigation.state.params.board);
    boardName = global.configures.boards[unescape(this.props.navigation.state.params.board)];
    scanRecord = false;

    webURL = 'http://m.newsmth.net/article/' + board + '/' + this.props.navigation.state.params.id;
    historyURL = 'http://jinghuasoft.com/smthview.jsp?board=' + board + '&id=' + this.props.navigation.state.params.id;
    from = 0;

    page = 1;
    this.getNewTopic(page);
  }


  getNewTopic(page) {
    NetworkManager.getNewTopic(this.props.navigation.state.params.id, page, (result) => {
      var array = [];

      //第一页
      if (page == 1) {
        this.$ = cio.load(result, { decodeEntities: false });
        this.$ = cio.load(this.$('div[class=article]').html(), { decodeEntities: false });
        //标题
        array.push({
          section: 0,
          title: this.$('.title').text(),
        });
        //楼主
        array.push({
          section: 1,
          avatar: this.$('.avatar').children().first().attr('src'),
          name: this.$('.avatar').children().first().attr('title'),
          meta: this.$('.meta').children().first().text(),
          time: this.$('.publish-time').text(),
          wordage: this.$('.wordage').text(),
          reply: this.$('.show-content').html().trim(),
        });
        //like
        this.$ = cio.load(result, { decodeEntities: false });
        var like = this.$('div[class=like-list]').html();
        if (like != null) {
          this.$ = cio.load(this.$('div[class=like-list]').html(), { decodeEntities: false });
          this.$('div[class=like]').each(function (i, elem) {
            this.$ = cio.load(elem, { decodeEntities: false });
            array.push({
              section: 2,
              avatar: this.$('.avatar').children().attr('src'),
              name: this.$('.name').children().first().text(),
              meta: this.$('.name').next().text(),
              time: this.$('.name').next().next().text(),
              reply: this.$('.text').html().trim(),
            });
          });
        }
        //
        array.push({
          section: 4,
        });  
      }

      //回复
      this.$ = cio.load(result);
      this.$ = cio.load(this.$('div[class=reply-list]').html());
      this.$('div[class=reply]').each(function (i, elem) {
        this.$ = cio.load(elem, { decodeEntities: false });
        this.$('.tool-group').remove();
        this.$('.article-quote').prev().remove();
        this.$('.article-quote').children().last().remove();
        var quote = this.$('div[class=article-quote]').html();
        this.$('.article-quote').remove();
        console.log('reply:' + this.$('div[class=reply-wrap]').html().trim());
        console.log('quote:' + quote);
        array.push({
          section: 3,
          key: this.$('div[class=reply-wrap]').text(),
          index: '',
          avatar: this.$('a[class=avatar]').children().attr('src'),
          name: this.$('a[class=name]').text(),
          meta: this.$('div[class=meta]').children().first().text(),
          time: this.$('div[class=meta]').children().last().text(),
          reply: this.$('div[class=reply-wrap]').html().trim(),
          quote: quote,
        });
      });

      // if (from == 0 && result['articles'].length == 0) {
      //   this.setState({
      //     firstLoading: false,
      //     viewLoading: false,
      //     screenText: '帖子不存在，可以尝试从浏览器打开或查看快照',
      //   });
      // }
      // else {
      this.setState({
        dataArray: array,
        totalPage: threadCount % size == 0 ? parseInt(threadCount / size) : parseInt(threadCount / size) + 1,
        currentPage: parseInt(from / size) + 1,
        selectedValue: (parseInt(from / size) + 1).toString(),
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
        <View style={[styles.container, { paddingBottom: -global.constants.Padding, }]} >
          <Text style={styles.title} >{item.title}</Text>
        </View>
      );
    }
    //楼主
    else if (item.section == 1) {
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
            </View>
            <Text style={styles.itemTime} >{item.time}</Text>
            <View style={[styles.itemReplyView, styles.itemReplyViewNoQuote]} >
              <HTMLView value={item.reply} stylesheet={styles.itemReply} />
            </View>
          </View>
          <ImageButton
            style={styles.itemMore}
            color={global.colors.themeColor}
            width={44}
            height={44}
            margin={24}
            source={global.images.icon_more}
            onPress={() => {
              this.setState({
                floorItem: item,
                floorActionViewHidden: false,
              });
            }} />
          <SeperatorLine />
        </View>
      );
    }
    //like
    else if (item.section == 2) {
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
                <Text style={styles.likeItemMeta} >{item.meta}</Text>
                <Text style={styles.likeItemTime} >{item.time.trim()}</Text>
              </View>
              <Text style={styles.likeItemReply} >{item.reply}</Text>
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                <View style={{ flex: 1, marginTop: 5, height: 1, backgroundColor: global.colors.seperatorColor }} />
              </View>
            </View>
          </View>

        </View>
      );
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
            </View>
            <Text style={styles.itemTime} >{item.time}</Text>
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
                <View></View>
            )}
          </View>
          <ImageButton
            style={styles.itemMore}
            color={global.colors.themeColor}
            width={44}
            height={44}
            margin={24}
            source={global.images.icon_more}
            onPress={() => {
              this.setState({
                floorItem: item,
                floorActionViewHidden: false,
              });
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
      style={styles.image}
      width={global.constants.ScreenWidth - 26}
      imageURL={NetworkManager.net_getAttachmentImage(board, item.id, item.pos)}
    />
  );

  render() {
    return (
      <View style={{ flex: 1 }}>
        <NavigationBar title='' />

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
              if (from == 0) return;
              this.setState({
                viewLoading: true,
                loadingType: 'none',
              });
              from = from - size;
              this.getNewTopic(page);
            }}
            onSelectClick={() => {
              this.setState({
                selectPageViewHidden: false,
                // backgroundMaskViewHidden: false,
              });
            }}
            onNextClick={() => {
              if (from + size > threadCount) return;
              this.setState({
                viewLoading: true,
                loadingType: 'none',
              });
              from = from + size;
              this.getNewTopic(page);
            }}
            onReplyClick={() => {
              this.props.navigation.navigate('replyThreadScreen',
                {
                  mid: this.props.navigation.state.params.id,
                  id: this.props.navigation.state.params.id,
                  board: board,
                  subject: this.props.navigation.state.params.subject,
                  body: '',
                });
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
              Linking.openURL(historyURL).catch(err => console.error('An error occurred', err));
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
                currentPage: (parseInt(from / size) + 1).toString(),
              });
            }}
            onFirstClick={() => {
              this.setState({
                viewLoading: true,
                loadingType: 'none',
                selectPageViewHidden: true,
                backgroundMaskViewHidden: true,
              });
              from = 0;
              this.getNewTopic(page);
            }}
            onLastClick={() => {
              this.setState({
                viewLoading: true,
                loadingType: 'none',
                selectPageViewHidden: true,
                backgroundMaskViewHidden: true,
              });
              from = (this.state.totalPage - 1) * size;
              this.getNewTopic(page);
            }}
            onCompleteClick={(page) => {
              if (page == (parseInt(from / size) + 1).toString()) {
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
              from = (page - 1) * size;
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
        </Screen>
      </View>

    )
  }
}

var styles = {
  get flatList() {
    return {
      height: global.constants.ScreenHeight - 40 - global.constants.BottomSaveArea - global.constants.NavigationBarHeight,
      backgroundColor: global.colors.backgroundGrayColor,
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
      color: global.colors.gray1Color
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
  get itemTime() {
    return {
      marginTop: 10,
      marginBottom: 20,
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
  get itemReplyView() {
    return {
      paddingBottom: 15,
      // backgroundColor: 'red'
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
      // backgroundColor: 'green'
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
