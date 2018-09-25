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
} from '../config/Common';
import cio from 'cheerio-without-node-native';

export default class NewUserArticleScreen extends Component {

    _page = 1;

    constructor(props) {
        super(props);
        this.state = {
            pullLoading: false,
            pullMoreLoading: false,
            viewLoading: true,
            screenText: null,
            dataArray: [],
        }

        this.getNewAccountArticles(this._page);
    }

    getNewAccountArticles(page) {
        NetworkManager.getNewAccountArticles(this.props.id, page, (result) => {
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

                    var quote = this.$('div[class=article-quote]').html();

                    this.$ = cio.load(elem, { decodeEntities: false });
                    this.$('.image-package').remove();
                    this.$('.image-caption').remove();
                    this.$('div[class=article-time]').remove();
                    this.$('.article-quote').remove();

                    var object = {
                        key: dataArray.length,
                        id: this.$('a[class=article-subject]').attr('href').split('/')[2],
                        time: time,
                        title: this.$('a[class=article-subject]').text().trim(),
                        content: this.$('div[class=article-main]').html(),
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
                        id: this.$('a[class=article-subject]').attr('href').split('/')[2],
                        time: time,
                        title: this.$('a[class=article-subject]').text().trim(),
                        content: this.$('div[class=article-main]').html(),
                        quote: quote,
                        attachment_list: attachment_list,
                        boardName: this.$('div[class=article-board-name]').children().first().text(),
                        boardTitle: this.$('div[class=article-board-title]').children().first().text(),
                    });
                }
            });

            // this.setState({
            //     dataArray: dataArray,
            //     pullLoading: false,
            //     pullMoreLoading: false,
            //     viewLoading: false,
            //     screenText: null
            // });

        }, (error) => {

        }, (errorMessage) => {

        });
    }


    render() {
        return (
            <Screen
                showLoading={this.state.viewLoading}
                loadingType={'background'}
                text={this.state.screenText}
                onPress={() => {
                    this.setState({
                        viewLoading: true,
                        screenText: null
                    });
                    this._page = 1;
                    this.getNewAccountArticles(this._page);
                }}
            >
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
                        if (this.state.pullLoading == false && this.state.pullMoreLoading == false) {
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
            backgroundColor: global.colors.whiteColor
        }
    },
}