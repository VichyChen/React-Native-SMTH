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
    Dimensions,
} from 'react-native';

import {
    NetworkManager,
    DateUtil,
    NavigatorTitleButton,
    SeperatorLine,
    SectionHeader,
    CellBackground,
    LoadingView,
    Screen,
    ToastUtil,
    AvatorImage,
    ReactNavigation,
    GDTNativeExpressView,
    HorizontalSeperatorLine,
} from '../config/Common';

import { CommonCSS } from 'CommonCSS';

import cio from 'cheerio-without-node-native';
import { NativeModules } from 'react-native';
import uuid from 'uuid';

count = 0;

export default class NewSMTHBoardDetailScreen extends Component {

    _page = 1;
    _adTag = [400, 401, 402, 403];

    constructor(props) {
        super(props);
        this.state = {
            pullLoading: false,
            pullMoreLoading: false,
            screenStatus: global.screen.loading,
            screenText: null,
            dataArray: [],
            adheight: { '400': 0, '401': 0, '402': 0, '403': 0 },
        }
        count++;

        this.getNewSMTHBoardThreadList();
    }

    componentWillUnmount() {
        if (count == 1) {
            var nativeExpressAdManager = NativeModules.GDTNativeExpressAdManager;
            nativeExpressAdManager.remove(this._adTag);
        }
        count--;
    }

    getNewSMTHBoardThreadList() {
        NetworkManager.getNewSMTHBoardThreadList(this.props.board, 1, (result) => {
            this.$ = cio.load(result);
            // this.$ = cio.load(this.$('span[class=n-right]').html());

            // var dataArray = [];
            // this.$('a').each(function (i, elem) {
            //     this.$ = cio.load(elem);
            //     console.log(this.$().parent().html().split('">')[1].split('</a>')[0]);
            //     dataArray.push({
            //         admin: this.$().parent().html().split('">')[1].split('</a>')[0],
            //     });
            // });

            this.$ = cio.load(this.$('tbody').html());

            var dataArray = [];
            this.$('tr').each(function (i, elem) {
                this.$ = cio.load(elem);
                var index = i;
                if (this.$().parent().html().startsWith("<tr class=")) {
                    dataArray.push({
                        key: uuid.v4(),
                        id: this.$('td[class=title_9]').children().first().attr('href').split('/')[4],
                        // avatar: this.$('a[class=article-account-avatar]').children().attr('src'),
                        authorID: this.$('td[class=title_12]').first().children().first().attr('href').split('/')[4],
                        // authorName: this.$('a[class=article-account-avatar]').children().first().attr('title'),
                        // name: this.$('div[class=article-account-name]').children().first().text(),
                        time: this.$('td[class=title_9]').next().text(),
                        title: this.$('td[class=title_9]').children().first().text().trim(),
                        score: this.$('td[class*=title_11]').first().text(),
                        like: this.$('td[class*=title_11]').first().next().text(),
                        comment: this.$('td[class*=title_11]').last().text(),
                    });
                }
                // }
            });
            this.$ = cio.load(result);

            this.setState({
                pullLoading: false,
                pullMoreLoading: false,
                screenStatus: global.screen.none,
                dataArray: dataArray,
                totalThreadCount: this.$('li[class=page-pre]').first().children().first().text(),
                todayCount: this.$('span[class=n-left]').text().split('今日帖数')[1].split(' 版面积分')[0],
                onlineCount: this.$('span[class=n-left]').text().split('人在线[')[0].split('本版当前共有')[1],
                maxOnlineCount: this.$('span[class=n-left]').children().first().text().replace('[最高', '').replace('人]', ''),
                maxOnlineCountTime: this.$('span[class=n-left]').children().first().attr('title'),
                boardScore: this.$('span[class=n-left]').text().split('版面积分:')[1],
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
                    ReactNavigation.navigate(this.props.navigation, 'newSMTHThreadDetailScreen', { id: item.id, board: this.props.board })
                }}
            >
                <View>
                    <View style={styles.itemContainer}>
                        <Text style={[CommonCSS.listOnlyTitle, { color: 'red' }]} >{item.title}</Text>
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
                this.getNewSMTHBoardThreadList();
            }} >
                <View style={{ flex: 1, flexDirection: 'column' }}>
                    <View style={styles.container}>
                        <Text style={[CommonCSS.listDescript]} >{'今天帖数' + this.state.todayCount + '，总主题数' + this.state.totalThreadCount}</Text>
                        <Text style={[CommonCSS.listDescript, {
                            marginTop: 8, lineHeight: global.constants.LineHeight,
                        }]} >{'当前共有' + this.state.onlineCount + '人在线，最高' + this.state.maxOnlineCount + '人在线，' + this.state.maxOnlineCountTime}</Text>
                    </View>
                    <HorizontalSeperatorLine />
                    <FlatList
                        removeClippedSubviews={false}
                        extraData={this.state}
                        data={this.state.dataArray}
                        renderItem={this._renderItem}
                        style={styles.flatList}
                        onRefresh={() => {
                            this.setState({
                                pullLoading: true
                            });
                            var nativeExpressAdManager = NativeModules.GDTNativeExpressAdManager;
                            nativeExpressAdManager.remove(this._adTag);
                            this._page = 1;
                            this.getNewSMTHBoardThreadList(this._page);
                        }
                        }
                        onEndReached={() => {
                            if (this.state.pullLoading == false && this.state.pullMoreLoading == false) {
                                this.setState({
                                    pullMoreLoading: true
                                });
                                this._page = this._page + 1;
                                this.getNewSMTHBoardThreadList(this._page);
                            }
                        }
                        }
                        onEndReachedThreshold={2}
                        refreshing={this.state.pullLoading}
                    />
                </View>
            </Screen>
        )
    }
}

var styles = {
    get container() {
        return {
            backgroundColor: global.colors.whiteColor,
            padding: global.constants.Padding,

        }
    },
    get flatList() {
        return {
            // flex: 1,
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
