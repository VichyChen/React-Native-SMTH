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

import codePush from 'react-native-code-push'
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


var _page = 1;

export default class NewHotListScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pullLoading: false,
            pullMoreLoading: false,
            viewLoading: true,
            screenText: null,
            dataArray: [],
        }

        console.log('NewHotListScreen constructor');

        this.getNewHot(_page);
    }

    getNewHot(page) {
        NetworkManager.getNewHot(this.props.section, page, (result) => {
            this.$ = cio.load(result);
            this.$ = cio.load(this.$('ul[class=article-list]').html());

            var array = [];
            this.$('div[class=article-content]').each(function (i, elem) {
                this.$ = cio.load(elem);
                array.push({
                    key: this.$('a[class=article-subject]').attr('href').split('/')[2],
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

            if (array.length == 0) {
                if (this.state.viewLoading == true) {
                    this.setState({
                        pullLoading: false,
                        viewLoading: false,
                        screenText: '网络请求出错，请点击重试',
                    });
                }
                else {
                    this.setState({
                        pullLoading: false,
                        viewLoading: false,
                        screenText: null
                    });
                }
            }
            else {
                this.setState({
                    dataArray: array,
                    pullLoading: false,
                    viewLoading: false,
                    screenText: null
                });
            }
        }, (error) => {
            console.log('error111' + error);

        }, (errorMessage) => {
            console.log('errorMessage');

        });
    }


    _renderItem = ({ item }) => {
        return (
            <CellBackground
                onPress={() => {
                    console.log('item.key:' + item.key);

                    this.props.navigation.navigate('newThreadDetailScreen', { id: item.key });
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

                            <Text style={styles.itemName} >{item.name}</Text>
                        </View>
                        <Text style={styles.itemTime} >{item.time}</Text>
                        <Text style={styles.itemTitle} >{item.title}</Text>
                        {item.content.length > 0 ? <Text style={styles.itemContent} >{item.content}</Text> : null}
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }} >
                            <Text style={styles.itemBoard} >{item.boardName}</Text>
                            <Text style={[styles.itemBoard, { marginLeft: 8, marginRight: 8 }]} >{item.boardTitle}</Text>
                            <Text style={styles.itemDescript} >{(item.comment.length > 0 ? (item.comment + '回复 ') : '') + (item.heart.length > 0 ? (item.heart + '赞 ') : '') + (item.picture.length > 0 ? (item.picture + '图片 ') : '')}</Text>
                        </View>

                    </View>
                    <SeperatorLine />
                </View>
            </CellBackground>
        )
    };

    render() {
        console.log('NewHotListScreen render');
        return (
            // <Screen
            //     showLoading={this.state.viewLoading}
            //     loadingType={'background'}
            //     text={this.state.screenText}
            //     onPress={() => {
            //         this.setState({
            //             viewLoading: true,
            //             screenText: null
            //         });
            //         this.getNewHot(_page);
            //     }}
            // >
            <View style={styles.container}>
                <FlatList
                    data={this.state.dataArray}
                    renderItem={this._renderItem}
                    removeClippedSubviews={false}
                    extraData={this.state}
                    style={styles.flatList}
                    onRefresh={() => {
                        this.setState({
                            pullLoading: true
                        });
                        page = 1;
                        this.getNewHot(_page);
                    }
                    }
                    onEndReached={() => {
                        if (this.state.pullLoading == false && this.state.pullMoreLoading == false) {
                            this.setState({
                                pullMoreLoading: true
                            });
                            _page++;
                            this.getNewHot(_page);
                        }
                    }
                    }
                    onEndReachedThreshold={0.2}
                    refreshing={this.state.pullLoading}
                />
            </View>
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
    get itemName() {
        return {
            marginLeft: 10,
            fontSize: global.configures.fontSize15,
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
            marginTop: 10,
            fontSize: global.configures.fontSize17,
            fontWeight: 'bold',
            color: global.colors.fontColor
        }
    },
    get itemContent() {
        return {
            marginTop: 10,
            fontSize: global.configures.fontSize15,
            color: global.colors.fontColor
        }
    },
    get itemBoard() {
        return {
            marginTop: 10,
            paddingTop: 2,
            paddingBottom: 0,
            paddingLeft: 4,
            paddingRight: 4,
            alignItems: 'center',
            fontSize: global.configures.fontSize14,
            color: global.colors.redColor,
            borderColor: global.colors.redColor,
            borderWidth: 1,
            borderRadius: 2,
            height: 16,
        }
    },
    get itemDescript() {
        return {
            marginTop: 10,
            fontSize: global.configures.fontSize13,
            color: global.colors.gray2Color
        }
    },
}
