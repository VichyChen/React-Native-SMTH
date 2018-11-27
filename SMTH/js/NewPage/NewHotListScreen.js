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
    DeviceEventEmitter
} from 'react-native';

import cio from 'cheerio-without-node-native';

import {
    NetworkManager,
    DateUtil,
    SeperatorLine,
    HorizontalSeperatorLine,
    SectionHeader,
    CellBackground,
    LoginView,
    LoadingView,
    Screen,
    Toast,
    ToastUtil,
    AvatorImage,
    NavigationBar
} from '../config/Common';
import { CommonCSS } from 'CommonCSS';

import AsyncStorageManger from '../storage/AsyncStorageManger';

export default class NewHotListScreen extends Component {
    _page = 1;

    constructor(props) {
        super(props);
        this.state = {
            pullLoading: false,
            pullMoreLoading: false,
            screenStatus: global.screen.loading,
            screenText: null,
            dataArray: [],
        }
        this.newHotListScreenRefreshNotification = DeviceEventEmitter.addListener('NewHotListScreenRefreshNotification', (index) => {
            if (this.props.index == index) {
                this.setState({
                    pullLoading: true,
                });
                setTimeout(() => {
                    this.refs.flatList.scrollToOffset({ offset: -64, animated: true })
                }, 50);
                setTimeout(() => {
                    this._page = 1;
                    this.getNewHot(this._page);
                }, 1000);
            }
        });

        this.getNewHot(this._page);
    }

    componentWillUnmount() {
        this.newHotListScreenRefreshNotification.remove();
    }

    getNewHot(page) {
        NetworkManager.getNewHot(this.props.section, page, (result) => {
            //帖子
            this.$ = cio.load(result);
            this.$ = cio.load(this.$('ul[class=article-list]').html());

            var array = [];
            if (page != 1) {
                array = array.concat(this.state.dataArray);
            }
            this.$('div[class=article-content]').each(function (i, elem) {
                this.$ = cio.load(elem);
                array.push({
                    key: i + ((page - 1) * 20),
                    id: this.$('a[class=article-subject]').attr('href').split('/')[2],
                    avatar: this.$('a[class=article-account-avatar]').children().attr('src'),
                    name: this.$('div[class=article-account-name]').children().first().text(),
                    time: this.$('div[class=article-account-name]').children().last().text(),
                    title: this.$('a[class=article-subject]').text().trim(),
                    content: this.$('p[class=article-brief]').text().trim(),
                    boardName: this.$('div[class=article-board-name]').children().text(),
                    boardTitle: this.$('div[class=article-board-title]').children().text(),
                    comment: this.$('span[class*=glyphicon-comment]').parent().text(),
                    heart: this.$('span[class*=glyphicon-heart]').parent().text(),
                    picture: this.$('span[class*=glyphicon-picture]').parent().text(),
                });
            });

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
                    key: i,
                    id: this.$('a').attr('href').split('/')[2],
                    title: this.$('a').text(),
                });
            });
            AsyncStorageManger.setSectionArray(sectionArray);

            // //收藏
            // this.$ = cio.load(result);
            // this.$ = cio.load(this.$('body').html());
            // var srcipt = this.$('script').text();
            // if (srcipt.length > 0) {
            //     console.log('qweqewewew:'+(this.$('script').text()
            //     .replace("$(function () {", '')
            //     .replace("build_favorites($('#__favorites'), ", '')
            //     .replace("        });", '')
            //     .replace(");", '')
            //     .replace("&quot;", "").trim()));
            //     var favouriteArray = JSON.parse((this.$('script').text()
            //     .replace("$(function () {", '')
            //     .replace("build_favorites($('#__favorites'), ", '')
            //     .replace("        });", '')
            //     .replace(");", '')
            //     .replace("&quot;", "").trim()));
            // }
            // AsyncStorageManger.setFavouriteArray(favouriteArray);

            this.setState({
                dataArray: array,
                pullLoading: false,
                pullMoreLoading: false,
                screenStatus: global.screen.none,
            });

        }, (error) => {
            ToastUtil.info(error);
            this.setState({
                pullLoading: false,
                pullMoreLoading: false,
                screenStatus: this.state.screenStatus == global.screen.loading ? global.screen.error : global.screen.none,
                screenText: error,
            });
        }, (errorMessage) => {
            ToastUtil.info(errorMessage);
            this.setState({
                pullLoading: false,
                pullMoreLoading: false,
                screenStatus: this.state.screenStatus == global.screen.loading ? global.screen.networkError : global.screen.none,
            });
        });
    }


    _renderItem = ({ item }) => {
        return (
            <CellBackground
                onPress={() => {
                    this.props.navigation.navigate('newThreadDetailScreen', { id: item.id });
                }}
            >
                <View>
                    <View style={styles.itemContainer}>

                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <AvatorImage
                                borderRadius={15}
                                widthAndHeight={30}
                                onPressClick={() => {
                                    // this.props.navigation.navigate('userScreen', { id: item.author_id });
                                }}
                                uri={'https://exp.newsmth.net/' + item.avatar} />

                            <Text style={[CommonCSS.listName, { marginLeft: 10 }]} >{item.name}</Text>
                        </View>
                        <Text style={[CommonCSS.listTime, { marginTop: 10 }]} >{item.time}</Text>
                        <Text style={[CommonCSS.listTitle, { marginTop: 10 }]} >{item.title}</Text>
                        {item.content.length > 0 ? <Text style={[CommonCSS.listContent, { marginTop: 10 }]} >{item.content}</Text> : null}
                        <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }} >
                            <Text style={[CommonCSS.listBoardEN, { paddingTop: 1 }]} >{item.boardName}</Text>
                            <Text style={[CommonCSS.listBoardCH, { marginLeft: 8, marginRight: 8, paddingTop: 3 }]} >{item.boardTitle}</Text>
                            <Text style={CommonCSS.listDescript} >{(item.comment.length > 0 ? (item.comment + '回复 ') : '') + (item.heart.length > 0 ? (item.heart + '赞 ') : '') + (item.picture.length > 0 ? (item.picture + '图片 ') : '')}</Text>
                        </View>

                    </View>
                    <SeperatorLine />
                </View>
            </CellBackground>
        )
    };

    render() {
        return (
            <Screen status={this.state.screenStatus} text={this.state.screenText} onPress={() => {
                this.setState({
                    screenStatus: global.screen.loading,
                });
                this._page = 1;
                this.getNewHot(this._page);
            }} >
                <FlatList
                    ref="flatList"
                    data={this.state.dataArray}
                    renderItem={this._renderItem}
                    removeClippedSubviews={false}
                    extraData={this.state}
                    style={styles.flatList}
                    onRefresh={() => {
                        this.setState({
                            pullLoading: true
                        });
                        this._page = 1;
                        this.getNewHot(this._page);
                    }
                    }
                    onEndReached={() => {
                        if (this.state.pullLoading == false && this.state.pullMoreLoading == false && this._page < 5) {
                            this.setState({
                                pullMoreLoading: true
                            });
                            this._page = this._page + 1;
                            this.getNewHot(this._page);
                        }
                    }
                    }
                    onEndReachedThreshold={4}
                    refreshing={this.state.pullLoading}
                />
            </Screen>
        )
    }
}

var styles = {
    get container() {
        return {
            flex: 1,
            backgroundColor: global.colors.whiteColor
        }
    },
    get flatList() {
        return {
            flex: 1,
            backgroundColor: global.colors.whiteColor
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
}
