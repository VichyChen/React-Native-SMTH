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
  ToastUtil
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
    this.getNewTopic(page);
  }

  componentWillMount() {
    this.setBarItemButton('notShow');
    this.subscription = DeviceEventEmitter.addListener('ThreadRefreshNotification', (mid) => {
      if (mid == this.props.navigation.state.params.id) {
        this.setState({
          firstLoading: true,
          viewLoading: true,
          loadingType: 'background',
          screenText: null,
        });
        from = 0;
        this.getNewTopic(page);
      }
    });
  }

  componentWillUnmount() {
    this.subscription.remove();
    DeviceEventEmitter.emit('RefreshScanRecordNotification', null);
  }

  setBarItemButton(type) {
    this.props.navigation.setParams({
      headerRight: (
        <View style={{ flexDirection: 'row' }}>
          <ImageButton
            color={global.colors.whiteColor}
            width={40}
            height={40}
            margin={15}
            source={global.images.icon_more}
            onPress={() => {
              if (type == 'show') {
                this.setState({
                  selectPageViewHidden: true,
                  floorActionViewHidden: true,
                  backgroundMaskViewHidden: true,
                  moreViewHidden: true,
                });
                this.setBarItemButton('notShow');
              } else {
                this.setState({
                  selectPageViewHidden: true,
                  floorActionViewHidden: true,
                  backgroundMaskViewHidden: false,
                  moreViewHidden: false,
                });
                this.setBarItemButton('show');
              }

            }} />
        </View>
      )
    })
  }

  getNewTopic(page) {
    NetworkManager.getNewTopic(this.props.navigation.state.params.id, page, (result) => {
      this.$ = cio.load(result);
      this.$ = cio.load(this.$('div[class=reply-list]').html());

      var array = [];
      this.$('div[class=reply]').each(function (i, elem) {
        this.$ = cio.load(elem, { decodeEntities: false });
        // this.$ = this.$('.tool-group').remove()

        this.$('.tool-group').remove();
        this.$('.article-quote').prev().remove();
        this.$('.article-quote').children().last().remove();
        
        console.log('123:', this.$('div[class=reply-wrap]').html().trim());

        array.push({
          key: this.$('div[class=reply-wrap]').text(),
          index: '',
          avatar: this.$('a[class=avatar]').children().attr('src'),
          name: this.$('a[class=name]').text(),
          meta: this.$('div[class=meta]').children().first().text(),
          time: this.$('div[class=meta]').children().last().text(),
          reply: this.$('div[class=reply-wrap]').html().trim(),
          // reply: this.$('.tool-group').prevAll().html(),
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

  //http://www.newsmth.net/nForum/#!article/ADAgent_TG/1138845
  _renderItem = ({ item }) => (
    <View style={styles.container}>
      {/* <WebView source={'<a>Here I am</a>'} /> */}

      {/* <Text>{item.reply}</Text> */}
      {/* <WebView bounces={false}
        // scalesPageToFit={true}
        source={{ html: "<h1 style='color:#ff0000'>欢迎访问 hangge.com</h1>" }}
        style={{ width: 100, height: 100 }}
      /> */}

      <HTMLView
        value={item.reply}
        stylesheet={styles.reply}
      />


      <SeperatorLine />
    </View>
  );

  _attachmentImageItem = ({ item }) => (
    <AutoHeightImage
      style={styles.image}
      width={global.constants.ScreenWidth - 26}
      imageURL={NetworkManager.net_getAttachmentImage(board, item.id, item.pos)}
    />
  );

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

        <ThreadDetailFloorActionView
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
        />
      </Screen>
    )
  }
}

var styles = {
  get flatList() {
    return {
      height: Dimensions.get('window').height - 40 - global.constants.NavigationBarHeight,
      backgroundColor: global.colors.backgroundGrayColor,
    }
  },
  get container() {
    return {
      flex: 1,
      padding: 0,
      backgroundColor: global.colors.whiteColor
    }
  },
  get subject() {
    return {
      marginTop: 10,
      marginBottom: 10,
      marginLeft: 13,
      marginRight: 13,
      fontSize: global.configures.fontSize19,
      fontWeight: 'bold',
      color: global.colors.fontColor,
    }
  },
  get reply() {
    return {
      p: {
        margin: 0,
        padding: 0,
      },
      div: {
        
      },
    }
  },
  get replyCount() {
    return {
      marginLeft: 13,
      marginBottom: 10,
      color: global.colors.gray1Color,
      fontSize: global.configures.fontSize15,
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
      fontSize: global.configures.fontSize17,
      color: global.colors.fontColor,
    }
  },
  get host() {
    return {
      paddingTop: 4,
      paddingBottom: 4,
      paddingLeft: 6,
      paddingRight: 6,
      marginLeft: 13,
      fontSize: global.configures.fontSize15,
      color: global.colors.gray2Color,
      backgroundColor: global.colors.backgroundGrayColor,
      borderRadius: 10,
    }
  },
  get imageButton() {
    return {
      position: 'absolute',
      top: 0,
      right: 5,
    }
  },
  get time() {
    return {
      marginLeft: 10,
      height: 19,
      fontSize: global.configures.fontSize15,
      color: global.colors.gray2Color,
    }
  },
  get body() {
    return {
      marginLeft: 13,
      marginRight: 13,
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