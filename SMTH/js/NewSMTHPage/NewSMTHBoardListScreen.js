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
    GDTNativeExpressView
} from '../config/Common';

import { CommonCSS } from 'CommonCSS';

import cio from 'cheerio-without-node-native';
import { NativeModules } from 'react-native';
import uuid from 'uuid';

count = 0;

export default class NewSMTHBoardListScreen extends Component {

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

        this.getNewSMTHBoardThreadList(this._page);
    }

    componentWillUnmount() {
        if (count == 1) {
            var nativeExpressAdManager = NativeModules.GDTNativeExpressAdManager;
            nativeExpressAdManager.remove(this._adTag);
        }
        count--;
    }

    getNewSMTHBoardThreadList(page) {
        NetworkManager.getNewSMTHBoardThreadList(this.props.board, page, (result) => {
            this.$ = cio.load(result);
            this.$ = cio.load(this.$('tbody').html());

            var dataArray = [];
            if (page != 1) {
                dataArray = dataArray.concat(this.state.dataArray);
            }
            this.$('tr').each(function (i, elem) {
                this.$ = cio.load(elem);
                // if (this.$('a[class=article-subject]').attr('href') != null) {
                var index = i + ((page - 1) * 20);
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
                // }
            });

            this.setState({
                dataArray: dataArray,
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
        if (item.type == 'ad') {
            return (
                <View>
                    <GDTNativeExpressView
                        style={{ height: this.state.adheight[item.adTag.toString()] }}
                        adType={0}
                        adTag={item.adTag}
                        onRenderSuccess={(event) => {
                            this.state.adheight[item.adTag.toString()] = event.nativeEvent.height;
                            this.setState({
                                adheight: this.state.adheight,
                            });
                        }}
                    />
                    <SeperatorLine />
                </View>
            );
        }
        else {
            return (
                <CellBackground
                    onPress={() => {
                        // ReactNavigation.navigate(this.props.navigation, 'threadDetail', { id: item.id, board: this.props.board, subject: item.title })
                        ReactNavigation.navigate(this.props.navigation, 'newSMTHThreadDetailScreen', { id: item.id, board: this.props.board })
                    }}
                >
                    <View>
                        <View style={styles.itemContainer}>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <AvatorImage
                                    style={styles.avator}
                                    borderRadius={20}
                                    widthAndHeight={40}
                                    onPressClick={() => {
                                        ReactNavigation.navigate(this.props.navigation, 'newUserScreen', { id: null, name: item.authorID });
                                    }}
                                    uri={NetworkManager.net_getFace(item.authorID)} />

                                <Text style={[CommonCSS.listName, { marginLeft: 10 }]} >{item.authorID}</Text>
                            </View>
                            <Text style={[CommonCSS.listTime, { marginTop: 10 }]} >{item.time}</Text>
                            <Text style={[CommonCSS.listTitle, { marginTop: 10 }]} >{item.title}</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }} >
                                <Text style={[CommonCSS.listDescript, { marginTop: 10, marginLeft: -2, }]} >{(item.score.length > 0 ? (item.score + '评分 ') : '') + (item.like.length > 0 ? (item.like + 'Like ') : '') + (item.comment.length > 0 ? (item.comment + '回复 ') : '')}</Text>
                            </View>
                        </View>
                        <SeperatorLine />
                    </View>
                </CellBackground>
            )
        }
    };

    render() {
        return (
            <Screen status={this.state.screenStatus} text={this.state.screenText} onPress={() => {
                this.setState({
                    screenStatus: global.screen.loading,
                });
                this._page = 1;
                this.getNewSMTHBoardThreadList(this._page);
            }} >
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
