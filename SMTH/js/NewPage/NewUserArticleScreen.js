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
    Dimensions
} from 'react-native';

import {
    NetworkManager,
    AvatorImage,
    SeperatorLine,
    LoadingView,
    Screen,
    CellBackground,
    NavigationBar,
    ToastUtil
} from '../config/Common';

import cio from 'cheerio-without-node-native';
import HTMLView from 'react-native-htmlview';
import AutoHeightImage from 'react-native-auto-height-image';

export default class NewUserArticleScreen extends Component {

    _page = 1;
    _currentPage;
    _totalPage;

    constructor(props) {
        super(props);
        this.state = {
            pullLoading: false,
            pullMoreLoading: false,
            screenStatus: global.screen.loading,
            screenText: null,
            dataArray: [],
        }

        this.getNewAccountArticles(this._page);
    }

    getNewAccountArticles(page) {
        NetworkManager.getNewAccountArticles(this.props.id, page, (result) => {
            this.$ = cio.load(result, { decodeEntities: false });
            this.$ = cio.load(this.$('ul[class=pagination]').html());
            this._currentPage = this.$('.active').children().first().text() == null ? 1 : this.$('.active').children().first().text();
            this._totalPage = this.$('li').last().attr('class') == 'disabled' ? this._currentPage : this.$('li').last().children().attr('href').split('/')[4];

            this.$ = cio.load(result, { decodeEntities: false });
            this.$ = cio.load(this.$('ul[class=article-list]').html());

            var dataArray = [];
            if (page != 1) {
                dataArray = dataArray.concat(this.state.dataArray);
            }
            this.$('li').each(function (i, elem) {
                this.$ = cio.load(elem, { decodeEntities: false });
                if (this.$('a[class=article-subject]').attr('href') != null) {
                    var time = this.$('div[class=article-time]').text()

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
                    this.$('.article-quote').prev().remove();
                    this.$('.article-quote').children().last().remove();
                    var quote = this.$('div[class=article-quote]').html();
                    this.$('.image-package').remove();
                    this.$('.image-caption').remove();
                    this.$('div[class=article-time]').remove();
                    this.$('.article-quote').remove();

                    var object = {
                        key: dataArray.length,
                        id: this.$('a[class=article-subject]').attr('href').split('/')[2],
                        time: time,
                        title: this.$('a[class=article-subject]').text().trim(),
                        content: this.$('div[class=article-main]').html().trim(),
                        quote: quote,
                        attachment_list: attachment_list,
                        boardName: this.$('div[class=article-board-name]').children().first().text(),
                        boardTitle: this.$('div[class=article-board-title]').children().first().text(),
                    };
                    console.log('object.key:' + object.key);
                    console.log('object.id:' + object.id);
                    console.log('object.time:' + object.time);
                    console.log('object.title:' + object.title);
                    console.log('object.content:' + object.content);
                    console.log('object.quote:' + object.quote);
                    console.log('object.boardName:' + object.boardName);
                    console.log('object.boardTitle:' + object.boardTitle);

                    dataArray.push({
                        key: dataArray.length,
                        id: this.$('a[class=article-subject]').attr('href').split('/')[3],
                        time: time,
                        title: this.$('a[class=article-subject]').text().trim(),
                        content: this.$('div[class=article-main]').html().trim(),
                        quote: quote,
                        attachment_list: attachment_list,
                        boardName: this.$('div[class=article-board-name]').children().first().text(),
                        boardTitle: this.$('div[class=article-board-title]').children().first().text(),
                    });
                }
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
                screenStatus: this.state.screenStatus == global.screen.loading ? global.screen.textImage : global.screen.none,
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
                    console.log('item.iditem.iditem.id' + item.id);
                    this.props.navigation.navigate('newThreadDetailScreen', { id: item.id, type: 'article' });
                }}
            >
                <View>
                    <View style={styles.container} >
                        <Text style={styles.itemTitle} >{item.title}</Text>
                        <FlatList
                            data={item.attachment_list}
                            renderItem={this._attachmentImageItem}
                        />
                        <View style={[styles.itemReplyView, (item.quote == null ? styles.itemReplyViewNoQuote : null)]} >
                            <HTMLView value={item.content} stylesheet={styles.itemReply} />
                        </View>
                        {(
                            item.quote != null
                                ?
                                <View style={styles.itemQuoteView} >
                                    <HTMLView value={item.quote.trim()} stylesheet={styles.itemQuote} />
                                </View>
                                :
                                null
                        )}
                        <Text style={styles.itemTime} >{item.time}</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }} >
                            <Text style={[styles.itemBoard, { paddingTop: 1 }]} >{item.boardName}</Text>
                            <Text style={[styles.itemBoard, { marginLeft: 8, marginRight: 8, paddingTop: 3 }]} >{item.boardTitle}</Text>
                        </View>
                    </View>
                    <SeperatorLine />
                </View>
            </CellBackground>
        );
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
            <Screen status={this.state.screenStatus} text={this.state.screenText} onPress={() => {
                this.setState({
                    screenStatus: global.screen.loading,
                });
                this._page = 1;
                this.getNewAccountArticles(this._page);
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
                        this._page = 1;
                        this.getNewAccountArticles(this._page);
                    }
                    }
                    onEndReached={() => {
                        if (this.state.pullLoading == false && this.state.pullMoreLoading == false && this._page < this._totalPage) {
                            this.setState({
                                pullMoreLoading: true
                            });
                            this._page = this._page + 1;
                            this.getNewAccountArticles(this._page);
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
            padding: global.constants.Padding,
            backgroundColor: global.colors.whiteColor
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
    get itemTime() {
        return {
            marginTop: 10,
            fontSize: global.configures.fontSize13,
            color: global.colors.gray2Color
        }
    },
    get itemTitle() {
        return {
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
}