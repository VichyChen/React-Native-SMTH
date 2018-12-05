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
    DeviceEventEmitter,
    StatusBar
} from 'react-native';

import {
    NetworkManager,
    SeperatorLine,
    CellBackground,
    NavigatorTitleButton,
    ImageButton,
    LoadingView,
    AvatorImage,
    Screen,
    ToastUtil,
    NavigationBar,
    ReactNavigation,
} from '../config/Common';
import { CommonCSS } from 'CommonCSS';
import cio from 'cheerio-without-node-native';
import HTMLView from 'react-native-htmlview';

export default class NewSearchArticleScreen extends Component {

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

        this.getNewSearchArticle(this._page);
    }

    getNewSearchArticle(page) {
        NetworkManager.getNewSearchArticle(this.props.keyword, true, page, (result) => {
            this.$ = cio.load(result);
            this.$ = cio.load(this.$('ul[class=article-list]').html());

            var _dataArray = [];
            if (page != 1) {
                _dataArray = _dataArray.concat(this.state.dataArray);
            }
            this.$('div[class=article-content]').each(function (i, elem) {
                this.$ = cio.load(elem);
                this.$('.image-package').remove();
                var quote = this.$('div[class=article-quote]').html();
                this.$('.article-quote').remove();
    
                _dataArray.push({
                    key: i,
                    id: this.$('a[class=article-subject]').attr('href').split('/')[3],
                    avatar: this.$('a[class=article-account-avatar]').children().attr('src'),
                    authorID: this.$('div[class=article-account-name]').children().first().attr('href').split('/')[2],
                    authorName: this.$('a[class=article-account-avatar]').children().first().attr('title'),
                    name: this.$('div[class=article-account-name]').children().first().text(),
                    time: this.$('div[class=article-account-name]').children().last().text(),
                    title: this.$('a[class=article-subject]').text().trim(),
                    reply: this.$('div[class=article-main]').html().trim(),
                    quote: quote,
                    boardName: this.$('div[class=article-board-name]').children().text(),
                    boardTitle: this.$('div[class=article-board-title]').children().text(),
                    // comment: this.$('span[class*=glyphicon-comment]').parent().text(),
                    // heart: this.$('span[class*=glyphicon-heart]').parent().text(),
                    picture: this.$('span[class*=glyphicon-picture]').parent().text(),
                });
            });

            this.setState({
                dataArray: _dataArray,
                pullLoading: false,
                pullMoreLoading: false,
                screenStatus: _dataArray.length == 0 ? global.screen.text : global.screen.none,
                screenText: '没有搜索结果',
            });

        }, (error) => {
            ToastUtil.info(error.message);
            this.setState({
                pullLoading: false,
                screenStatus: this.state.screenStatus == global.screen.loading ? (error.error == 10010 ? global.screen.try : global.screen.error) : global.screen.none,
                screenText: error.message,
            });
        }, (errorMessage) => {
            ToastUtil.info(errorMessage);
            this.setState({
                pullLoading: false,
                screenStatus: this.state.screenStatus == global.screen.loading ? global.screen.networkError : global.screen.none,
            });
        });
    }

    _renderItem = ({ item }) => {
        return (
            <CellBackground
                onPress={() => {
                    ReactNavigation.navigate(this.props.navigation, 'newThreadDetailScreen', { id: item.id, type: 'article' });
                }}
            >
                <View>
                    <View style={styles.itemContainer}>

                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <AvatorImage
                                borderRadius={15}
                                widthAndHeight={30}
                                onPressClick={() => {
                                    ReactNavigation.navigate(this.props.navigation, 'newUserScreen', { id: item.authorID, name: item.authorName });
                                }}
                                uri={'https://exp.newsmth.net/' + item.avatar} />

                            <Text style={[CommonCSS.listName, { marginLeft: 10 }]} >{item.name}</Text>
                        </View>
                        <Text style={[CommonCSS.listTime, { marginTop: 10 }]} >{item.time}</Text>
                        <Text style={[CommonCSS.listTitle, { marginTop: 10 }]} >{item.title}</Text>

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

                        <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }} >
                            <Text style={[CommonCSS.listBoardEN, { paddingTop: 1 }]} >{item.boardName}</Text>
                            <Text style={[CommonCSS.listBoardCH, { marginLeft: 8, marginRight: 8, paddingTop: 3 }]} >{item.boardTitle}</Text>
                            <Text style={CommonCSS.listDescript} >{item.picture.length > 0 ? (item.picture + '图片 ') : ''}</Text>
                        </View>

                    </View>
                    <SeperatorLine />
                </View>
            </CellBackground>
        )
    };

    render() {
        return (
            <View style={{ flex: 1 }}>

                <Screen status={this.state.screenStatus} text={this.state.screenText} onPress={() => {
                    this.setState({
                        screenStatus: global.screen.loading,
                    });
                    this._page = 1;
                    this.getNewSearchArticle(this._page);
                }} >
                    <FlatList
                        data={this.state.dataArray}
                        renderItem={this._renderItem}
                        removeClippedSubviews={false}
                        extraData={this.state}
                        keyExtractor={(item, index) => index}
                        style={{
                            backgroundColor: global.colors.whiteColor,
                            height: global.constants.ScreenHeight - global.constants.NavigationBarHeight,
                        }}
                        onRefresh={() => {
                            this.setState({
                                pullLoading: true
                            });
                            this._page = 1;
                            this.getNewSearchArticle(this._page);
                        }
                        }
                        onEndReached={() => {
                            if (this.state.pullLoading == false && this.state.pullMoreLoading == false) {
                                this.setState({
                                    pullMoreLoading: true
                                });
                                this._page = this._page + 1;
                                this.getNewSearchArticle(this._page);
                            }
                        }}
                        onEndReachedThreshold={4}
                        refreshing={this.state.pullLoading}
                    />
                </Screen>
            </View>
        );
    }
}

var styles = {
    get container() {
        return {
            flex: 1,
            flexDirection: 'column',
            padding: global.constants.Padding,
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
                fontSize: global.configures.fontSize14,
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
                fontSize: global.configures.fontSize14,
                color: global.colors.gray2Color,
            },
        }
    },
}
