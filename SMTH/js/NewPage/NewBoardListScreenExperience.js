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
    ReactNavigation
} from '../config/Common';

import { CommonCSS } from 'CommonCSS';

import cio from 'cheerio-without-node-native';

export default class NewBoardListScreenExperience extends Component {

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

        this.getNewBoardExperience(this._page);
    }

    getNewBoardExperience(page) {
        NetworkManager.getNewBoardExperience(this.props.board, page, (result) => {
            this.$ = cio.load(result);
            this.$ = cio.load(this.$('ul[class=article-list]').html());

            var dataArray = [];
            if (page != 1) {
                dataArray = dataArray.concat(this.state.dataArray);
            }
            this.$('li').each(function (i, elem) {
                this.$ = cio.load(elem);
                if (this.$('a[class=article-subject]').attr('href') != null) {
                    dataArray.push({
                        key: dataArray.length,
                        id: this.$('a[class=article-subject]').attr('href').split('/')[2],
                        avatar: this.$('a[class=article-account-avatar]').children().attr('src'),
                        name: this.$('div[class=article-account-name]').children().first().text(),
                        time: this.$('div[class=article-account-name]').children().last().text(),
                        title: this.$('a[class=article-subject]').text().trim(),
                        content: this.$('p[class=article-brief]').text().trim(),
                        comment: this.$('span[class*=glyphicon-comment]').parent().text(),
                        heart: this.$('span[class*=glyphicon-heart]').parent().text(),
                        picture: this.$('span[class*=glyphicon-picture]').parent().text(),
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
                    ReactNavigation.navigate(this.props.navigation, 'newThreadDetailScreen', { id: item.id });
                }}
            >
                <View>
                    <View style={styles.itemContainer}>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <AvatorImage
                                borderRadius={15}
                                widthAndHeight={30}
                                onPressClick={() => {
                                    // ReactNavigation.navigate(this.props.navigation, 'userScreen', { id: item.author_id });
                                }}
                                uri={'https://exp.newsmth.net/' + item.avatar} />

                            <Text style={[CommonCSS.listName, { marginLeft: 10 }]} >{item.name}</Text>
                        </View>
                        <Text style={[CommonCSS.listTime, { marginTop: 10 }]} >{item.time}</Text>
                        <Text style={[CommonCSS.listTitle, { marginTop: 10 }]} >{item.title}</Text>
                        {item.content.length > 0 ? <Text style={[CommonCSS.listContent, { marginTop: 10 }]} >{item.content}</Text> : null}
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }} >
                            <Text style={[CommonCSS.listDescript, { marginTop: 10, marginLeft: -2, }]} >{(item.comment.length > 0 ? (item.comment + '回复 ') : '') + (item.heart.length > 0 ? (item.heart + '赞 ') : '') + (item.picture.length > 0 ? (item.picture + '图片 ') : '')}</Text>
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
                this.getNewBoardExperience(this._page);
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
                        this.getNewBoardExperience(this._page);
                    }
                    }
                    onEndReached={() => {
                        if (this.state.pullLoading == false && this.state.pullMoreLoading == false) {
                            this.setState({
                                pullMoreLoading: true
                            });
                            this._page = this._page + 1;
                            this.getNewBoardExperience(this._page);
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
