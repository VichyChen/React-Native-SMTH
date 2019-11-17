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
    SectionBlankHeader,
    ReactNavigation,
    CellBackground,
    LoginButtonView
} from '../config/Common';
import { CommonCSS } from 'CommonCSS';
import uuid from 'uuid';

import {
    ScanRecordModel,
    FavouriteThreadModel
} from 'ModelModule';

export default class NewSMTHThreadDetailScreen extends Component {

    webURL;
    currentPage;
    hostArticleId;
    realArticleId;
    wordage;
    // likeCount;
    boardObject;
    selectMoreItemIndex;
    selectMoreItemName;
    selectMoreItemMeta;
    selectMoreItemReply;
    selectMoreItemReplyID;
    scanRecord;
    page;
    author;
    seeHost;
    seeOne;
    hostID;

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
            likeCount: 0,
            threadCount: 0,
            hostID: '', //楼主ID
            hostTime: '',
            boardName: '',
            boardTitle: '',
            title: '',
            // selectedValue: '1',
            showMoreLike: true,
            needLogin: false,
        }
        this.scanRecord = false;
        this.webURL = 'https://exp.newsmth.net/topic/' + (this.props.navigation.state.params.type == null ? '' : 'article/') + this.props.navigation.state.params.id;

        this.page = 1;
        this.author = '';
        this.seeHost = false;
        this.seeOne = false;
        this.getNewSMTHThread(this.page, this.author);
    }

    componentWillMount() {
        this.newThreadRefreshNotification = DeviceEventEmitter.addListener('NewThreadRefreshNotification', (id) => {
            if (id == this.props.navigation.state.params.id) {
                this.setState({
                    screenStatus: global.screen.loading,
                });
                this.page = 1;
                this.getNewSMTHThread(this.page, this.author);
            }
        });
        this.loginSuccessNotification = DeviceEventEmitter.addListener('LoginSuccessNotification', () => {
            this.setState({
                needLogin: false,
                screenStatus: global.screen.loading,
            });
            this.getNewSMTHThread(this.page, this.author);
        });
    }

    componentWillUnmount() {
        this.newThreadRefreshNotification.remove();
        this.loginSuccessNotification.remove();
        DeviceEventEmitter.emit('RefreshScanRecordNotification', null);
    }

    getNewSMTHThread(page, author) {
        NetworkManager.getNewSMTHThread(this.props.navigation.state.params.board, this.props.navigation.state.params.id, author, page, (result) => {
        // NetworkManager.getNewSMTHThread('Universal', '1966175', author, page, (result) => {
            var array = [];

            console.log('___________________________________________________________________________' + '');
            console.log('___________________________________________________________________________' + '');
            console.log('___________________________________________________________________________' + '');
            console.log('___________________________________________________________________________' + '');
            console.log('___________________________________________________________________________' + '');

            this.$ = cio.load(result, { decodeEntities: false });

            if (this.$('samp[class=ico-pos-dot]').parent().text() == '您未登录,请登录后继续操作') {
                this.setState({
                    needLogin: true,
                });
            } else {

                var currentPage = this.$('li[class=page-select]').first().children().first().text();
                console.log('currentPage:::::' + currentPage);
                console.log(this.$('li[class=page-pre]').first().children().first().text());
                var totalPage = parseInt(this.$('li[class=page-pre]').first().children().first().text() / 10) + 1;
                console.log('totalPage:::::' + totalPage);

                // ????? this.realArticleId = this.$('.pagination').children().last().attr('class') == 'disabled' ? null : this.$('.pagination').children().last().children().attr('href').split('/')[2];
                console.log('likeCount111:::::' + this.$('div[class=like_name]').html());
                console.log('likeCount222::::' + this.$('div[class=like_name]').first().text());

                var likeCount = this.$('div[class=like_name]').first().text().length == 0 ? 0 : this.$('div[class=like_name]').first().text().split('位用户评价了这篇文章：')[0].split('有')[1];
                console.log('likeCount:::::' + this.$('div[class=like_name]').html());
                console.log('likeCount:::::' + this.$('div[class=like_name]').first().text());
                console.log('likeCount:::::' + likeCount);

                var id = this.props.navigation.state.params.id;
                var boardName = this.props.navigation.state.params.board;
                console.log('boardName:::::' + boardName);
                var boardTitle = this.$('script').last().prev().text().split('<a href="/nForum/board/' + boardName + '">')[1].split('</a>&ensp;>>&ensp;<a href="javascript:void(0)">阅读文章</a>')[0];
                console.log('boardTitle:::::' + boardTitle);
                //第一页
                if (page == 1) {
                    //帖子总数
                    var threadCount = this.$('li[class=page-pre]').first().children().first().text();
                    console.log('threadCount:::::' + threadCount);
                    var hostID = this.$('table[class=article]').first().children().first().children().first().children().first().children().first().text();
                    this.hostID = hostID;
                    console.log('hostID:::::' + hostID);
                    console.log('hostTime1111111:::::' + this.$('td[class=a-content]').children().first().html());
                    console.log('hostTime1111111:::::' + this.$('td[class=a-content]').children().first().text());
                    var hostTime = this.$('td[class=a-content]').children().first().html().split('<br>')[2];
                    console.log('hostTime:::::' + hostTime);
                    //  推迟，回复帖子的id  this.hostArticleId = this.$('.follow-detail').children().first().children().first().next().attr('href').split('/')[3];

                    this.$ = cio.load(result, { decodeEntities: false });
                    var title = this.$('span[class=n-left]').text().split('文章主题:&ensp;')[1];
                    console.log('title:::::' + title);
                    //标题
                    array.push({
                        key: array.length,
                        section: 0,
                        title: title,
                    });
                }

                //回复
                this.$ = cio.load(result);
                this.$('table[class=article]').each(function (i, elem) {
                    this.$ = cio.load(elem, { decodeEntities: false });

                    //图片
                    // var imageTag = 'img[src*=//att.newsmth.net/nForum/att/' + boardName + '/' + id + '/]';
                    var imageTag = 'img[border=0]';
                    console.log('imageTag:::::' + imageTag);
                    // console.log('this.$(imageTag).children().html():::::' + this.$(imageTag).children().html());
                    // console.log('this.$(imageTag).children().length:::::' + this.$(imageTag).children().length);

                    var attachment_list = [];
                    console.log('444444444:::::');

                    // if (this.$(imageTag).children().length > 0) {
                    this.$('img[border=0]').each(function (i, elem2) {
                        this.$ = cio.load(elem2, { decodeEntities: false });
                        console.log('5555555555:::::');
                        console.log('5555555555:::::' + this.$('').html());
                        console.log('5555555555:::::' + this.$('').parent().html());
                        console.log('5555555555:::::' + this.$('').parent().children().first().attr('src'));
                        console.log('5555555555:::::' + this.$('').parent().html().replace('<img border="0" title="单击此查看原图" src="', '').replace('" class="resizeable">', '').replace('//', ''));

                        attachment_list.push({
                            key: attachment_list.length,
                            arrayKey: array.length,
                            url: 'http:' + this.$('').parent().html().replace('<img border="0" title="单击此查看原图" src="', '').replace('" class="resizeable">', ''),
                        });
                    });
                    // }
                    this.$(imageTag).remove();
                    console.log('6666666666:::::' + attachment_list.length);
                    console.log('6666666666:::::');

                    var likeArray = [];
                    //like
                    if (currentPage == 1 && i == 0 && author.length == 0) {
                        this.$ = cio.load(elem, { decodeEntities: false });
                        if (this.$('div[class=like_list]').html() != null) {
                            this.$ = cio.load(this.$('div[class=like_list]').html(), { decodeEntities: false });
                            this.$('li').each(function (i, elem) {
                                this.$ = cio.load(elem, { decodeEntities: false });
                                console.log('name:::::' + this.$('span[class=like_user]').text());
                                console.log('time:::::' + this.$('span[class=like_time]').text());
                                console.log('reply:::::' + this.$('span[class=like_msg]').text());
                                console.log('score:::::' + this.$('span').first().html().substring(1, 3));

                                likeArray.push({
                                    key: uuid.v4(),
                                    index: i,
                                    section: 2,
                                    // avatar: this.$('.avatar').children().attr('src'),
                                    // avatarID: this.$('.name').children().first().attr('href').split('/')[2],
                                    name: this.$('span[class=like_user]').text(),
                                    // meta: this.$('.name').next().text(),
                                    time: this.$('span[class=like_time]').text(),
                                    reply: this.$('span[class=like_msg]').text(),
                                    score: this.$('span').first().html().substring(1, 3).trim(),
                                });
                            });
                        }
                    }

                    //其他内容
                    this.$ = cio.load(elem, { decodeEntities: false });
                    var replyID = this.$('samp[class=ico-pos-reply]').parent().next().children().last().attr('href').split('?id=')[1];
                    console.log('replyID:::::' + replyID);
                    // var quote = this.$('div[class=article-quote]').html();

                    this.$ = cio.load(elem, { decodeEntities: false });
                    console.log('xxxxxxxx:::::' + this.$('samp[class=ico-pos-user]').parent().html());
                    console.log('xxxxxxxx:::::' + this.$('samp[class=ico-pos-user]').parent().children().last().html());
                    console.log('xxxxxxxx:::::' + this.$('samp[class=ico-pos-user]').parent().children().last().attr('href').split('?au=')[1]);
                    console.log('xxxxxxxxtime:::::' + this.$('td[class=a-content]').children().first().html());
                    console.log('xxxxxxxxtime:::::' + this.$('td[class=a-content]').children().first().html().split('<br>')[2]);

                    this.$('div[class=like_name]').remove();
                    this.$('div[class=like_list]').remove();
                    this.$('button[class*=add_like]').remove();
                    this.$('div[id=like_util]').remove();

                    // console.log('replyreplyreplyreply:::::' + this.$('td[class=a-content]').html().trim().replace('<font class="f000"> <br> </font></p>', '</p>'));

                    var reply = '<p>' + this.$('td[class=a-content]').html().trim().replace('<font class="f000"> <br> </font>', '').replace('<font class="f000"> <br>  <br> </font>', '').replace('<font class="f000"> <br>  <br>  <br> </font><br>', '').replace('<font class="f000"> <br>  <br>  <br> </font>', '').trim().split('<br>').splice(3).join('<br>').slice(6).trim();
                    console.log('replyreplyreplyreply:::::' + reply);

                    var time = this.$('td[class=a-content]').children().first().html().split('<br>')[2].split('发信站: 水木社区 (')[1];
                    if (time != undefined || time != null) {
                        time = this.$('td[class=a-content]').children().first().html().split('<br>')[2].split('发信站: 水木社区 (')[1].split('), 站内 ')[0];
                    } else {
                        time = this.$('td[class=a-content]').children().first().html().split('<br>')[2].split('发信站: 水木社区自动发信系统 (')[1].split(')')[0];
                    }
                    
                    console.log('123123123123123' + this.$('td[class=a-content]').children().first().html().split('<br>')[2].split('发信站: 水木社区 (')[1]);

                    array.push({
                        key: array.length,
                        index: currentPage == 1 ? (i + 1) : (i + ((currentPage - 1) * 10)),
                        section: 3,
                        // avatar: this.$('a[class=avatar]').children().attr('src'),
                        // avatarID: this.$('.avatar').attr('href').split('/')[2],
                        name: author.length > 0 ? author : this.$('samp[class=ico-pos-user]').parent().children().last().attr('href').split('?au=')[1],
                        floor: this.$('span[class=a-pos]').text().replace('第', ''),
                        meta: this.$('div[class=a-u-uid]').text(),
                        time: time,   //还需要继续split
                        attachment_list: attachment_list,
                        replyID: replyID,
                        reply: reply,  //还需要继续处理
                        // quote: quote,
                    });

                    //like
                    if (currentPage == 1 && i == 0 && author.length == 0) {
                        this.$ = cio.load(elem, { decodeEntities: false });
                        for (var j = 0; j < likeArray.length; j++) {
                            array.push(likeArray[j]);
                        }
                        //
                        array.push({
                            key: array.length,
                            section: 4,
                        });
                    }
                });

                // var login = this.$('ul[class*=navbar-right]').children().first().children().first().text();
                // console.log('loginloginloginlogin:' + login);
                // if (login == '登录') {
                //   AsyncStorageManger.setLogin(false);
                //   global.login = false;
                // }
                // else {
                // }


                if (page == 1 && array.length == 0) {
                    this.setState({
                        screenStatus: global.screen.none,
                        screenText: '帖子不存在',
                        needLogin: false,
                    });
                }
                else {
                    this.setState({
                        dataArray: array,
                        totalPage: totalPage,
                        currentPage: page,
                        likeCount: likeCount,
                        threadCount: threadCount,
                        hostID: hostID,
                        hostTime: hostTime,
                        boardName: boardName,
                        boardTitle: boardTitle,
                        title: title,
                        selectedValue: page.toString(),
                        screenStatus: global.screen.none,
                        screenText: null,
                        needLogin: false,
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
                        boardName,
                        title,
                        hostID,
                        hostTime
                    ).then(() => {
                        this.scanRecord = true;
                    }).catch((error) => {
                        this.scanRecord == false
                    });
                }
            }


        }, (error) => {
            ToastUtil.info(error);
            this.setState({
                screenStatus: this.state.screenStatus == global.screen.loading ? global.screen.error : global.screen.none,
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
                        <Text style={CommonCSS.threadTitle} >{item.title}</Text>
                        <Text style={[CommonCSS.listDescript, { marginTop: 10, }]} >
                            {
                                // (this.wordage.length > 0 ? (this.wordage.split(' ')[1] + '字数 ') : '') +
                                (this.state.threadCount.length > 0 ? (this.state.threadCount.split(' ')[0] + '回复 ') : '')
                            }
                        </Text>
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
                                        if (global.login == true) {
                                            ReactNavigation.navigate(this.props.navigation, 'newUserScreen', { id: item.avatarID, name: item.name });
                                        }
                                        else {
                                            DeviceEventEmitter.emit('LoginNotification', null);
                                        }
                                    }}
                                    uri={NetworkManager.net_getFace(item.name)}
                                />

                                <Text style={[CommonCSS.listName, { marginLeft: 10 }]} >{item.name}</Text>
                                <Text style={[CommonCSS.listMeta, { marginLeft: 5 }]} >{item.meta}</Text>
                                {
                                    item.name == this.hostID
                                        ?
                                        <Text style={[CommonCSS.listHost, { marginLeft: 6 }]} >{'楼主'}</Text>
                                        :
                                        null
                                }
                            </View>
                            <Text style={[CommonCSS.listTime, { marginTop: 10 }]} >{item.time}</Text>
                            <FlatList
                                data={item.attachment_list}
                                renderItem={this._attachmentImageItem}
                            />
                            <View style={[styles.itemReplyView, styles.itemReplyViewNoQuote]} >
                                <HTMLView stylesheet={styles.itemReply} value={item.reply} />
                            </View>
                        </View>
                        <HorizontalSeperatorLine />

                    </View>
                    {
                        this.state.likeCount.length > 0
                            ?
                            <View style={CommonCSS.sectionView} >
                                <View style={CommonCSS.sectionVerticalLine} />
                                <Text style={CommonCSS.sectionTitle} >
                                    {this.state.likeCount.split(' ')[0] + ' Like'}
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
                                    if (global.login == true) {
                                        ReactNavigation.navigate(this.props.navigation, 'newUserScreen', { id: item.avatarID, name: item.name });
                                    }
                                    else {
                                        DeviceEventEmitter.emit('LoginNotification', null);
                                    }
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
                                    {item.time.trim().length > 0 ? <Text style={styles.likeItemTime} >{item.time.trim()}</Text> : null}
                                </View>
                                <Text style={styles.likeItemReply} >
                                    {
                                        item.score.length > 0
                                            ?
                                            <Text style={[styles.likeItemReply, { fontWeight: '600', color: (item.score > 0 ? 'red' : 'green') }]} >
                                                {item.score + ' '}
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
                                    if (global.login == true) {
                                        ReactNavigation.navigate(this.props.navigation, 'newUserScreen', { id: item.avatarID, name: item.name });
                                    }
                                    else {
                                        DeviceEventEmitter.emit('LoginNotification', null);
                                    }
                                }}
                                uri={NetworkManager.net_getFace(item.name)}
                            />
                            <Text style={[CommonCSS.listName, { marginLeft: 10 }]} >{item.name}</Text>
                            {/* <Text style={[CommonCSS.listMeta, { marginLeft: 5 }]} >{item.meta}</Text> */}
                            {
                                (item.name.toUpperCase() == this.hostID.toUpperCase() && this.seeOne == false) || item.floor == '楼主'
                                    ?
                                    <Text style={[CommonCSS.listHost, { marginLeft: 6 }]} >{'楼主'}</Text>
                                    :
                                    null
                            }
                        </View>
                        <Text style={[CommonCSS.listTime, { marginTop: 10 }]} >{(item.floor) + '  ' + item.time}</Text>
                        <FlatList
                            data={item.attachment_list}
                            renderItem={this._attachmentImageItem}
                        />
                        <View style={[styles.itemReplyView, (item.quote == null ? styles.itemReplyViewNoQuote : null)]} >
                            <HTMLView stylesheet={styles.itemReply} value={item.reply} />
                        </View>
                        {(
                            item.quote != null
                                ?
                                <View style={styles.itemQuoteView} >
                                    <HTMLView stylesheet={styles.itemQuote} value={item.quote} />
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
                    {
                        this.state.likeCount.length > 0 && item.index == 1 && this.author.length == 0
                            ?
                            <View style={CommonCSS.sectionView} >
                                <View style={CommonCSS.sectionVerticalLine} />
                                <Text style={CommonCSS.sectionTitle} >
                                    {this.state.likeCount.split(' ')[0] + ' Like'}
                                </Text>

                            </View>
                            :
                            null
                    }
                </View>
            );
        }
        else if (item.section == 4) {
            return (
                <View>
                    {
                        this.state.likeCount.length > 0 && item.index == 1
                            ?
                            <HorizontalSeperatorLine />
                            :
                            null
                    }
                    {
                        <View style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            flex: 1,
                            marginTop: 15,
                            marginBottom: 15,
                        }}>
                            <Button
                                style={{ borderRadius: 4, width: 100 }}
                                text=' 我要Like！'
                                fontColor={global.colors.whiteColor}
                                backgroundColor={global.colors.themeColor}
                                onPress={() => {
                                    if (global.login == true) {
                                        ReactNavigation.navigate(this.props.navigation, 'newSMTHThreadDetailLikeScreen',
                                            {
                                                board: this.state.boardName,
                                                id: this.props.navigation.state.params.id,
                                            });
                                    }
                                    else {
                                        DeviceEventEmitter.emit('LoginNotification', null);
                                    }
                                }}
                            />
                        </View>
                    }
                    <SeperatorLine />
                    {
                        this.state.threadCount.length > 1
                            ?
                            (
                                <View style={CommonCSS.sectionView} >
                                    <View style={CommonCSS.sectionVerticalLine} />
                                    <Text style={CommonCSS.sectionTitle} >
                                        {this.state.threadCount.split(' ')[0] + ' 回复 '}
                                    </Text>
                                </View>
                            )
                            :
                            null
                    }

                </View>
            );
        }
    };

    _attachmentImageItem = ({ item }) => (
        <TouchableWithoutFeedback
            onPress={() => {
                var array = [];
                for (var i = 0; i < this.state.dataArray[item.arrayKey].attachment_list.length; i++) {
                    console.log('111111111' + this.state.dataArray[item.arrayKey].attachment_list[i].url);

                    array.push({
                        url: this.state.dataArray[item.arrayKey].attachment_list[i].url
                    });
                }
                console.log('123123132');
                console.log('123123132' + item.key);
                console.log('123123132' + array);
                DeviceEventEmitter.emit('ShowImagesNotification', { images: array, index: item.key });
            }}
        >
            <View style={{
                marginTop: 15, backgroundColor: global.colors.backgroundGrayColor
            }}>
                <AutoHeightImage

                    style={[styles.itemImage, {}]}
                    width={global.constants.ScreenWidth - global.constants.Padding * 2}
                    imageURL={item.url}
                />
            </ View>
        </TouchableWithoutFeedback >
    );

    render() {
        return (
            <View style={{ flex: 1 }}>
                <StatusBar barStyle="dark-content" />
                <NavigationBar
                    title={this.state.boardTitle}
                    message={this.state.boardName}
                    titleOnPress={() => {
                        ReactNavigation.navigate(this.props.navigation, 'newSMTHBoardScreen', { id: '', name: this.state.boardTitle, title: this.state.boardName });
                    }}
                    showBackButton={true}
                    showBottomLine={false}
                    navigation={this.props.navigation}
                    rightButtonImage={this.state.screenStatus == global.screen.loading ? null : global.images.icon_more}
                    rightButtonOnPress={() => {
                        this.moreActionSheet.show()
                    }}
                />

                {
                    this.seeOne == false && this.seeHost == false ? null :
                        <Button
                            style={{ zIndex: 999, position: 'absolute', top: global.constants.TopSaveArea + 19, right: global.constants.Padding + 40, height: 44, }}
                            height={44}
                            text={'展开'}
                            fontColor={global.colors.themeColor}
                            onPress={() => {
                                this.setState({
                                    screenStatus: global.screen.loading,
                                });
                                this.page = 1;
                                this.author = '';
                                this.seeOne = false;
                                this.seeHost = false;
                                this.getNewSMTHThread(this.page, this.author);
                            }} />
                }

                <Screen status={this.state.screenStatus} text={this.state.screenText} onPress={() => {
                    this.setState({
                        screenStatus: global.screen.loading,
                    });
                    this.getNewSMTHThread(this.page, this.author);
                }} >
                    {
                        this.state.needLogin == true
                            ?
                            <LoginButtonView text={'需登陆才能查看帖子'} style={{ zIndex: 999, position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }} />
                            :
                            null
                    }
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
                            this.getNewSMTHThread(this.page, this.author);
                        }}
                        onSelectClick={() => {
                            this.setState({
                                selectPageViewHidden: false,
                                // backgroundMaskViewHidden: false,
                            });
                        }}
                        onNextClick={() => {
                            if (this.page + 1 > this.state.totalPage) return;
                            this.setState({
                                screenStatus: global.screen.loadingClear,
                            });
                            this.page = this.page + 1;
                            this.getNewSMTHThread(this.page, this.author);
                        }}
                        onReplyClick={() => {
                            if (global.login == true) {
                                ReactNavigation.navigate(this.props.navigation, 'newSMTHReplyThreadScreen',
                                    {
                                        board: this.state.boardName,
                                        id: this.props.navigation.state.params.id,
                                        threadID: this.props.navigation.state.params.id,
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
                            this.getNewSMTHThread(this.page, this.author);
                        }}
                        onLastClick={() => {
                            this.setState({
                                screenStatus: global.screen.loadingClear,
                                selectPageViewHidden: true,
                                backgroundMaskViewHidden: true,
                            });
                            this.page = this.state.totalPage;
                            this.getNewSMTHThread(this.page, this.author);
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
                            this.getNewSMTHThread(this.page, this.author);
                        }}
                        onValueChange={(page) => {
                            this.setState({
                                selectedValue: page,
                            });
                        }}
                    />

                    <ActionSheet
                        ref={o => this.moreActionSheet = o}
                        title={this.state.title}
                        // message={}
                        options={this.seeOne == true || this.seeHost == true ? ['分享', '收藏', '从浏览器打开', '复制链接', '给楼主私信',/*'查看快照',*/ '举报', '取消'] : ['只看楼主', '分享', '收藏', '从浏览器打开', '复制链接', '给楼主私信',/*'查看快照',*/ '举报', '取消']}
                        cancelButtonIndex={this.seeOne == true || this.seeHost == true ? 6 : 7}
                        onPress={(index) => {
                            var mode = this.seeOne == true || this.seeHost == true ? 1 : 0;
                            //只看楼主
                            if (index == 0 - mode) {
                                this.setState({
                                    screenStatus: global.screen.loadingClear,
                                });
                                this.page = 1;
                                this.author = this.hostID;
                                this.seeHost = true;
                                this.seeOne = false;
                                this.getNewSMTHThread(this.page, this.author);
                            }
                            else if (index == 1 - mode) {
                                var shareManager = NativeModules.ShareManager;
                                shareManager.share(this.state.title, this.webURL);
                            }
                            //收藏
                            else if (index == 2 - mode) {
                                FavouriteThreadModel.create(
                                    'new',
                                    this.props.navigation.state.params.id,
                                    this.state.boardName,
                                    this.state.title,
                                    this.hostID,
                                ).then(() => {
                                    ToastUtil.info('已收藏');
                                    DeviceEventEmitter.emit('RefreshFavouriteThreadNotification', null);
                                }).catch((error) => {
                                    ToastUtil.info('收藏失败');
                                });
                            }
                            //从浏览器打开
                            else if (index == 3 - mode) {
                                Linking.openURL(this.webURL).catch(err => console.error('An error occurred', err));
                            }
                            //复制链接
                            else if (index == 4 - mode) {
                                Clipboard.setString(this.webURL);
                                ToastUtil.info('已复制');
                            }
                            //给楼主私信
                            else if (index == 5 - mode) {
                                if (global.login == true) {
                                    ReactNavigation.navigate(this.props.navigation, 'newMessageSendScreen', { user: this.hostID })
                                }
                                else {
                                    DeviceEventEmitter.emit('LoginNotification', null);
                                }
                            }
                            //举报
                            else if (index == 6 - mode) {
                                if (global.login == true) {
                                    if (this.boardObject == null) {
                                        NetworkManager.net_QueryBoard(this.state.boardName, (result) => {
                                            for (var i = 0; i < result['boards'].length; i++) {
                                                if (this.state.boardName == result['boards'][i].id) {
                                                    this.boardObject = result['boards'][i];
                                                    break;
                                                }
                                            }
                                            if (this.boardObject != null) {
                                                var array = this.boardObject.manager.split(" ");
                                                if (array.length == 0) return;
                                                ReactNavigation.navigate(this.props.navigation, 'newMessageSendScreen', {
                                                    user: array[0],
                                                    title: '举报 ' + this.hostID + ' 在 ' + this.state.boardName + ' 版中发表的内容',
                                                    content: '\n' + this.webURL + '\n\n【以下为被举报的帖子内容】\n' + this.state.title,
                                                });
                                            }

                                        }, (error) => {
                                        }, (timeout) => {
                                        });
                                    }
                                    else {
                                        var array = this.boardObject.manager.split(" ");
                                        if (array.length == 0) return;
                                        ReactNavigation.navigate(this.props.navigation, 'newMessageSendScreen', {
                                            user: array[0],
                                            title: '举报 ' + this.hostID + ' 在 ' + this.state.boardName + ' 版中发表的内容',
                                            content: '\n' + this.webURL + '\n\n【以下为被举报的帖子内容】\n' + this.state.title,
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
                        options={this.seeOne == true || this.seeHost == true ? ['回复', '给 ' + this.selectMoreItemName + ' 私信', '举报', '取消'] : ['只看 ' + this.selectMoreItemName, '回复', '给 ' + this.selectMoreItemName + ' 私信', '举报', '取消']}
                        cancelButtonIndex={this.seeOne == true || this.seeHost == true ? 3 : 4}
                        onPress={(index) => {
                            var mode = this.seeOne == true || this.seeHost == true ? 1 : 0;
                            //只看此人
                            if (index == 0 - mode) {
                                this.setState({
                                    screenStatus: global.screen.loadingClear,
                                });
                                this.page = 1;
                                this.author = this.selectMoreItemName;
                                this.seeOne = this.selectMoreItemName == this.hostID ? false : true;
                                this.seeHost = this.selectMoreItemName == this.hostID ? true : false;
                                this.getNewSMTHThread(this.page, this.author);
                            }
                            //回复
                            else if (index == 1 - mode) {
                                if (global.login == true) {
                                    ReactNavigation.navigate(this.props.navigation, 'newSMTHReplyThreadScreen',
                                        {
                                            board: this.state.boardName,
                                            id: this.selectMoreItemReplyID,
                                            threadID: this.props.navigation.state.params.id,
                                        });
                                }
                                else {
                                    DeviceEventEmitter.emit('LoginNotification', null);
                                }
                            }
                            //私信
                            else if (index == 2 - mode) {
                                if (global.login == true) {
                                    ReactNavigation.navigate(this.props.navigation, 'newMessageSendScreen', { user: this.selectMoreItemName })
                                }
                                else {
                                    DeviceEventEmitter.emit('LoginNotification', null);
                                }
                            }
                            //举报
                            else if (index == 3 - mode) {
                                if (global.login == true) {
                                    if (this.boardObject == null) {
                                        NetworkManager.net_QueryBoard(this.state.boardName, (result) => {
                                            for (var i = 0; i < result['boards'].length; i++) {
                                                if (this.state.boardName == result['boards'][i].id) {
                                                    this.boardObject = result['boards'][i];
                                                    break;
                                                }
                                            }
                                            if (this.boardObject != null) {
                                                var array = this.boardObject.manager.split(" ");
                                                if (array.length == 0) return;
                                                ReactNavigation.navigate(this.props.navigation, 'newMessageSendScreen', {
                                                    user: array[0],
                                                    title: '举报 ' + this.selectMoreItemName + ' 在 ' + this.state.boardName + ' 版中发表的内容',
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
                                        ReactNavigation.navigate(this.props.navigation, 'newMessageSendScreen', {
                                            user: array[0],
                                            title: '举报 ' + this.selectMoreItemName + ' 在 ' + this.state.boardName + ' 版中发表的内容',
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
    get likeItemName() {
        return {
            fontSize: global.configures.fontSize14,
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
            fontSize: global.configures.fontSize14,
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
    get itemTitle() {
        return {
            marginTop: 10,
            fontSize: global.configures.fontSize17,
            fontWeight: '600',
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
            // paddingBottom: 15,
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
                fontSize: global.configures.fontSize17,
                color: global.colors.fontColor,
            },
            a: {
                color: global.colors.fontColor,
            }
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
                fontSize: global.configures.fontSize16,
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
