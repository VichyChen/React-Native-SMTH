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

var webURL;
var threadCount;
var totalPage;
var hostID;     //楼主ID
var hostBody;
var boardID;
var boardName;
var boardTitle;


/*
from
size
抓
threadCount
totalPage
hostID
hostBody
boardName
boardTitle
*/

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
      likeCount = this.$('.article-likes').children().first().children().first().text();

      //第一页
      if (page == 1) {
        //帖子总数
        threadCount = this.$('.reply-list').children().first().children().first().children().first().children().first().text();
        totalPage = this.$('.pagination').children().last().children().attr('href') != null ? this.$('.pagination').children().last().children().attr('href').split('/')[3] : 1;
        hostID = this.$('.avatar').children().first().attr('title');
        hostBody = this.$('.show-content').html().trim();
        boardID = this.$('.notebook').attr('href').split('/')[2];
        boardName = this.$('.notebook').children().first().next().text();
        boardTitle = this.$('.notebook').children().last().text();

        this.$ = cio.load(result, { decodeEntities: false });
        this.$ = cio.load(this.$('div[class=article]').html(), { decodeEntities: false });

        //标题
        array.push({
          section: 0,
          title: this.$('.title').text(),
        });

        //楼主图片
        var images = this.$('div[class=image-package]').html();
        var attachment_list = [];
        if (images != null) {
          this.$ = cio.load(this.$('div[class=image-package]').html(), { decodeEntities: false });
          this.$('a').each(function (i, elem) {
            this.$ = cio.load(elem, { decodeEntities: false });
            attachment_list.push(this.$('img').attr('src'));
          });
        }

        this.$ = cio.load(result, { decodeEntities: false });
        this.$ = cio.load(this.$('div[class=article]').html(), { decodeEntities: false });
        this.$('.image-package').remove();
        this.$('.image-caption').remove();

        //楼主
        array.push({
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
              attachment_list.push(this.$('img').attr('src'));
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
            section: 3,
            key: this.$('div[class=reply-wrap]').text(),
            index: '',
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
        <View style={[styles.container, { paddingBottom: -global.constants.Padding, }]} >
          <Text style={styles.title} >{item.title}</Text>
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
          {
            likeCount.length > 0
              ?
              <View style={{ backgroundColor: global.colors.whiteColor, padding: global.constants.Padding }}>
                <Text style={styles.title} >{likeCount}</Text>
              </View>
              :
              null
          }
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
      style={styles.itemImage}
      width={global.constants.ScreenWidth - global.constants.Padding * 2}
      imageURL={'https://exp.newsmth.net/' + item}
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
              DeviceEventEmitter.emit('LoginNotification', null);
return;
              this.showActionSheet(); return;

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
            title={'Which one do you like ?'}
            options={['分享', '复制链接', '从浏览器打开', '查看快照', '举报', '取消']}
            cancelButtonIndex={2}
            destructiveButtonIndex={1}
            onPress={(index) => { /* do something */ }}
          />

          <ActionSheet
            ref={o => this.itemMoreActionSheet = o}
            title={'Which one do you like ?'}
            options={['回复', '举报', '取消']}
            cancelButtonIndex={2}
            destructiveButtonIndex={1}
            onPress={(index) => { /* do something */ }}
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
